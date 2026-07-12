import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://kcqnykjbgqjlgcxmcaro.supabase.co";
const SUPABASE_KEY = "sb_publishable_0dnpl6eFXDjB1Ot26f-qsg_B9IasaUw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
