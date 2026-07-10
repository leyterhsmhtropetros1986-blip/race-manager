-- Security-critical fixes: server-side enforcement for registration, payments, admin promotion, and RLS.
-- Apply via Supabase SQL editor or `supabase db push`.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_profile_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_race(p_race_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.races
    WHERE id = p_race_id AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.compute_race_price(
  p_pricing jsonb,
  p_early_bird jsonb,
  p_distance text
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  base_price numeric := 0;
  discount numeric := 0;
  deadline timestamptz;
BEGIN
  IF p_pricing IS NOT NULL THEN
    SELECT COALESCE((elem->>'price')::numeric, 0)
      INTO base_price
    FROM jsonb_array_elements(p_pricing) AS elem
    WHERE elem->>'distance' = p_distance
    LIMIT 1;
  END IF;

  IF p_early_bird IS NOT NULL
     AND (p_early_bird->>'deadline') IS NOT NULL
     AND now() <= (p_early_bird->>'deadline')::timestamptz THEN
    discount := COALESCE((p_early_bird->>'discount_percent')::numeric, 0);
    RETURN ROUND(base_price * (1 - discount / 100.0), 2);
  END IF;

  RETURN ROUND(base_price, 2);
END;
$$;

-- ---------------------------------------------------------------------------
-- Unique constraints (idempotent)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'registrations_race_runner_unique'
  ) THEN
    ALTER TABLE public.registrations
      ADD CONSTRAINT registrations_race_runner_unique UNIQUE (race_id, runner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'registrations_race_bib_unique'
  ) THEN
    ALTER TABLE public.registrations
      ADD CONSTRAINT registrations_race_bib_unique UNIQUE (race_id, bib_number);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Profile role sanitization (block client-side admin assignment)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sanitize_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.role IS DISTINCT FROM 'admin' THEN
      NEW.role := CASE WHEN NEW.role = 'organizer' THEN 'organizer' ELSE 'athlete' END;
    ELSIF NOT public.is_admin() THEN
      NEW.role := 'athlete';
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.role = 'admin' AND OLD.role IS DISTINCT FROM 'admin' AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only admins can assign the admin role';
    END IF;
    IF NEW.role NOT IN ('admin', 'organizer', 'athlete') THEN
      NEW.role := OLD.role;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sanitize_profile_role_trigger ON public.profiles;
CREATE TRIGGER sanitize_profile_role_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_profile_role();

-- ---------------------------------------------------------------------------
-- Block client manipulation of payment fields on registrations
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_registration_payment_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('app.internal_registration', true) = '1' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN
      RETURN NEW;
    END IF;
    NEW.payment_status := COALESCE(NEW.payment_status, 'pending');
    IF NEW.payment_status <> 'pending' THEN
      NEW.payment_status := 'pending';
    END IF;
    IF NEW.price_paid IS NOT NULL AND NEW.price_paid <> 0 THEN
      NEW.price_paid := 0;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN
      RETURN NEW;
    END IF;
    IF public.is_admin() OR public.owns_race(NEW.race_id) THEN
      RETURN NEW;
    END IF;

    IF NEW.payment_status IS DISTINCT FROM OLD.payment_status
       OR NEW.price_paid IS DISTINCT FROM OLD.price_paid THEN
      RAISE EXCEPTION 'Payment fields can only be changed by race organizers or admins';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_registration_payment_fields_trigger ON public.registrations;
CREATE TRIGGER guard_registration_payment_fields_trigger
  BEFORE INSERT OR UPDATE ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_registration_payment_fields();

-- ---------------------------------------------------------------------------
-- RPC: register_for_race (atomic BIB + capacity + server-side pricing)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.register_for_race(
  p_race_id uuid,
  p_runner_id uuid,
  p_distance text,
  p_category text DEFAULT NULL,
  p_tshirt text DEFAULT NULL,
  p_medical_cert boolean DEFAULT false,
  p_custom_answers jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_race public.races%ROWTYPE;
  v_runner public.runners%ROWTYPE;
  v_count integer;
  v_next_bib integer;
  v_price numeric;
  v_reg public.registrations%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT * INTO v_race FROM public.races WHERE id = p_race_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Race not found';
  END IF;

  SELECT * INTO v_runner FROM public.runners WHERE id = p_runner_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Runner not found';
  END IF;

  IF v_runner.email IS DISTINCT FROM auth.jwt() ->> 'email' THEN
    RAISE EXCEPTION 'You can only register your own runner profile';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.registrations
    WHERE race_id = p_race_id AND runner_id = p_runner_id
  ) THEN
    RAISE EXCEPTION 'Already registered for this race';
  END IF;

  IF v_race.max_runners IS NOT NULL THEN
    SELECT count(*) INTO v_count FROM public.registrations WHERE race_id = p_race_id;
    IF v_count >= v_race.max_runners THEN
      RAISE EXCEPTION 'Race is sold out';
    END IF;
  END IF;

  SELECT COALESCE(MAX(NULLIF(bib_number::text, '')::integer), 0) + 1
    INTO v_next_bib
  FROM public.registrations
  WHERE race_id = p_race_id;

  v_price := public.compute_race_price(v_race.pricing, v_race.early_bird, p_distance);

  PERFORM set_config('app.internal_registration', '1', true);

  INSERT INTO public.registrations (
    runner_id, race_id, distance, category, tshirt, medical_cert,
    bib_number, custom_answers, price_paid, payment_status, gdpr_consent_at
  ) VALUES (
    p_runner_id, p_race_id, p_distance, p_category, p_tshirt, p_medical_cert,
    v_next_bib::text, p_custom_answers, v_price, 'pending', now()
  )
  RETURNING * INTO v_reg;

  RETURN jsonb_build_object(
    'id', v_reg.id,
    'bib_number', v_reg.bib_number,
    'price_paid', v_reg.price_paid,
    'payment_status', v_reg.payment_status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.register_for_race(uuid, uuid, text, text, text, boolean, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_for_race(uuid, uuid, text, text, text, boolean, jsonb) TO authenticated;

-- ---------------------------------------------------------------------------
-- RPC: promote_to_admin (admin-only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.promote_to_admin(p_target_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can promote users';
  END IF;

  UPDATE public.profiles
  SET role = 'admin', status = 'approved'
  WHERE id = p_target_id;
END;
$$;

REVOKE ALL ON FUNCTION public.promote_to_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.promote_to_admin(uuid) TO authenticated;

-- ---------------------------------------------------------------------------
-- RPC: toggle_registration_payment (organizer/admin only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.toggle_registration_payment(p_registration_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reg public.registrations%ROWTYPE;
  v_new_status text;
BEGIN
  SELECT * INTO v_reg FROM public.registrations WHERE id = p_registration_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Registration not found';
  END IF;

  IF NOT (public.is_admin() OR public.owns_race(v_reg.race_id)) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  v_new_status := CASE WHEN v_reg.payment_status = 'paid' THEN 'pending' ELSE 'paid' END;

  UPDATE public.registrations
  SET payment_status = v_new_status
  WHERE id = p_registration_id
  RETURNING * INTO v_reg;

  RETURN jsonb_build_object('id', v_reg.id, 'payment_status', v_reg.payment_status);
END;
$$;

REVOKE ALL ON FUNCTION public.toggle_registration_payment(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_registration_payment(uuid) TO authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- Races: public read for active statuses; organizers manage own
DROP POLICY IF EXISTS races_public_read ON public.races;
CREATE POLICY races_public_read ON public.races
  FOR SELECT
  USING (status IN ('upcoming', 'active', 'finished') OR user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS races_organizer_write ON public.races;
CREATE POLICY races_organizer_write ON public.races
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Runners: own profile + organizers for their race participants + admin
DROP POLICY IF EXISTS runners_select_scoped ON public.runners;
CREATE POLICY runners_select_scoped ON public.runners
  FOR SELECT TO authenticated
  USING (
    email = auth.jwt() ->> 'email'
    OR public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.registrations reg
      JOIN public.races r ON r.id = reg.race_id
      WHERE reg.runner_id = runners.id
        AND (r.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS runners_insert_own ON public.runners;
CREATE POLICY runners_insert_own ON public.runners
  FOR INSERT TO authenticated
  WITH CHECK (email = auth.jwt() ->> 'email' OR public.is_admin());

DROP POLICY IF EXISTS runners_update_own ON public.runners;
CREATE POLICY runners_update_own ON public.runners
  FOR UPDATE TO authenticated
  USING (email = auth.jwt() ->> 'email' OR public.is_admin())
  WITH CHECK (email = auth.jwt() ->> 'email' OR public.is_admin());

-- Registrations: athletes see own; organizers see their races; public race-scoped read
DROP POLICY IF EXISTS registrations_select_scoped ON public.registrations;
CREATE POLICY registrations_select_scoped ON public.registrations
  FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.runners rn
      WHERE rn.id = registrations.runner_id
        AND rn.email = auth.jwt() ->> 'email'
    )
    OR EXISTS (
      SELECT 1 FROM public.races r
      WHERE r.id = registrations.race_id
        AND r.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.races r
      WHERE r.id = registrations.race_id
        AND r.status IN ('upcoming', 'active', 'finished')
    )
  );

DROP POLICY IF EXISTS registrations_insert_own ON public.registrations;
CREATE POLICY registrations_insert_own ON public.registrations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.runners rn
      WHERE rn.id = registrations.runner_id
        AND rn.email = auth.jwt() ->> 'email'
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS registrations_organizer_update ON public.registrations;
CREATE POLICY registrations_organizer_update ON public.registrations
  FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.races r
      WHERE r.id = registrations.race_id AND r.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.runners rn
      WHERE rn.id = registrations.runner_id
        AND rn.email = auth.jwt() ->> 'email'
    )
  );

DROP POLICY IF EXISTS registrations_organizer_delete ON public.registrations;
CREATE POLICY registrations_organizer_delete ON public.registrations
  FOR DELETE TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.races r
      WHERE r.id = registrations.race_id AND r.user_id = auth.uid()
    )
  );
