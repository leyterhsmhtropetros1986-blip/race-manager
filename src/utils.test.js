import { describe, it, expect, vi, afterEach } from "vitest";
import {
  PERK_PAIRS, SUGGESTED_PERKS, translatePerk, getDaysUntilRace, autoToastType,
  validateGreekPhone, validateAMKA, generateCalendarLinks, parseDistanceKm, truncLoc,
  timeToSeconds, formatTime, secToChartFormat, buildTimeProgressChart, calculatePrice,
  parseGPX, haversineKm, calculateRouteStats, escapeXml, generateGPX, buildElevationData,
  downsampleProfile, normalizeText, parseCSV, mapCSVRow, parseTimeFlex, matchRunner,
} from "./utils.js";

describe("translatePerk", () => {
  it("keeps the given language variant", () => {
    expect(translatePerk("🏅 Μετάλλιο", "en")).toBe("🏅 Medal");
    expect(translatePerk("🏅 Medal", "el")).toBe("🏅 Μετάλλιο");
  });
  it("returns the input unchanged for unknown perks", () => {
    expect(translatePerk("custom perk", "en")).toBe("custom perk");
  });
  it("SUGGESTED_PERKS mirrors the el labels", () => {
    expect(SUGGESTED_PERKS).toEqual(PERK_PAIRS.map((p) => p.el));
  });
});

describe("getDaysUntilRace", () => {
  afterEach(() => vi.useRealTimers());
  it("returns null for falsy input", () => {
    expect(getDaysUntilRace(null)).toBeNull();
    expect(getDaysUntilRace("")).toBeNull();
  });
  it("computes whole days until the end of the race day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00"));
    // ceil of (end-of-day 2026-01-11 minus now) -> 11
    expect(getDaysUntilRace("2026-01-11")).toBe(11);
    expect(getDaysUntilRace("2026-01-01")).toBe(1);
  });
  it("returns a negative number for past races", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-10T12:00:00"));
    expect(getDaysUntilRace("2026-01-01")).toBeLessThan(0);
  });
});

describe("autoToastType", () => {
  it("defaults to info", () => {
    expect(autoToastType("")).toBe("info");
    expect(autoToastType(null)).toBe("info");
    expect(autoToastType("just a message")).toBe("info");
  });
  it("detects success/error/warning markers (el + en)", () => {
    expect(autoToastType("✅ Επιτυχία")).toBe("success");
    expect(autoToastType("Operation success")).toBe("success");
    expect(autoToastType("❌ Σφάλμα")).toBe("error");
    expect(autoToastType("Fatal error occurred")).toBe("error");
    expect(autoToastType("⚠ Συμπληρώστε")).toBe("warning");
    expect(autoToastType("invalid input")).toBe("warning");
  });
});

describe("validateGreekPhone", () => {
  it("treats empty as valid (optional field)", () => {
    expect(validateGreekPhone("")).toEqual({ valid: true, clean: "" });
  });
  it("accepts valid mobile / landline / international formats", () => {
    expect(validateGreekPhone("6912345678").valid).toBe(true);
    expect(validateGreekPhone("2101234567").valid).toBe(true);
    expect(validateGreekPhone("+306912345678").valid).toBe(true);
    expect(validateGreekPhone("00306912345678").valid).toBe(true);
  });
  it("strips spaces, dashes and parentheses before validating", () => {
    const res = validateGreekPhone("69 12-34(56)78");
    expect(res.valid).toBe(true);
    expect(res.clean).toBe("6912345678");
  });
  it("rejects invalid numbers with an error message", () => {
    const res = validateGreekPhone("12345");
    expect(res.valid).toBe(false);
    expect(res.error).toBeTruthy();
  });
});

describe("validateAMKA", () => {
  it("treats empty as valid", () => {
    expect(validateAMKA("")).toEqual({ valid: true, clean: "" });
  });
  it("requires exactly 11 digits", () => {
    expect(validateAMKA("123").valid).toBe(false);
    expect(validateAMKA("01019012345").valid).toBe(true);
  });
  it("validates the embedded birth date", () => {
    expect(validateAMKA("99999012345").valid).toBe(false); // day 99, month 99
    expect(validateAMKA("00009012345").valid).toBe(false); // day 00
  });
  it("strips non-digit characters", () => {
    expect(validateAMKA("010-190/12345").clean).toBe("01019012345");
  });
});

describe("generateCalendarLinks", () => {
  it("returns null without a date", () => {
    expect(generateCalendarLinks({ name: "x" })).toBeNull();
    expect(generateCalendarLinks(null)).toBeNull();
  });
  it("builds google / outlook / ics links", () => {
    const links = generateCalendarLinks({
      id: 7, name: "City Run", date: "2026-05-01", location: "Athens", description: "Fun",
    });
    expect(links.google).toContain("calendar.google.com");
    expect(links.google).toContain(encodeURIComponent("City Run"));
    expect(links.outlook).toContain("outlook.live.com");
    expect(links.ics).toContain("BEGIN:VCALENDAR");
    expect(links.ics).toContain("UID:7@racemanagement.gr");
    expect(links.ics).toContain("SUMMARY:City Run");
  });
});

describe("parseDistanceKm", () => {
  it("returns 0 for falsy/unknown", () => {
    expect(parseDistanceKm("")).toBe(0);
    expect(parseDistanceKm("random")).toBe(0);
  });
  it("parses numeric km values", () => {
    expect(parseDistanceKm("10km")).toBe(10);
    expect(parseDistanceKm("23.5 km")).toBe(23.5);
  });
  it("recognises marathon distances in both languages", () => {
    expect(parseDistanceKm("Μαραθώνιος")).toBe(42.195);
    expect(parseDistanceKm("Marathon")).toBe(42.195);
  });
  it("recognises the english half-marathon", () => {
    expect(parseDistanceKm("Half")).toBe(21.0975);
  });
  it("KNOWN BUG: greek 'half marathon' matches the marathon branch first", () => {
    // "Ημιμαραθώνιος" contains the substring "μαραθ", which is
    // tested before "ημιμαρ", so it wrongly resolves to the full distance.
    expect(parseDistanceKm("Ημιμαραθώνιος")).toBe(42.195);
  });
});

describe("truncLoc", () => {
  it("returns dash for empty", () => {
    expect(truncLoc("")).toBe("—");
  });
  it("returns short strings unchanged", () => {
    expect(truncLoc("Athens")).toBe("Athens");
  });
  it("truncates long strings with an ellipsis", () => {
    const out = truncLoc("A very long location name that exceeds", 10);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBe(10);
  });
});

describe("timeToSeconds / formatTime / secToChartFormat", () => {
  it("timeToSeconds handles hh:mm:ss and mm:ss", () => {
    expect(timeToSeconds("01:02:03")).toBe(3723);
    expect(timeToSeconds("02:30")).toBe(150);
    expect(timeToSeconds("")).toBe(0);
    expect(timeToSeconds("bad")).toBe(0);
  });
  it("formatTime zero-pads and normalizes", () => {
    expect(formatTime("1:2:3")).toBe("01:02:03");
    expect(formatTime("5:9")).toBe("00:05:09");
    expect(formatTime("")).toBe("—");
  });
  it("secToChartFormat renders m:ss and h:mm:ss", () => {
    expect(secToChartFormat(0)).toBe("0:00");
    expect(secToChartFormat(NaN)).toBe("0:00");
    expect(secToChartFormat(90)).toBe("1:30");
    expect(secToChartFormat(3723)).toBe("1:02:03");
  });
});

describe("buildTimeProgressChart", () => {
  it("returns null for invalid races input", () => {
    expect(buildTimeProgressChart([], null)).toBeNull();
  });
  it("groups finished registrations by distance, keeping only those with >= 2 entries", () => {
    const races = [
      { id: 1, name: "R1", date: "2026-01-01" },
      { id: 2, name: "R2", date: "2026-02-01" },
      { id: 3, name: "R3", date: "2026-03-01" },
    ];
    const regs = [
      { race_id: 1, distance: "10km", finish_time: "00:50:00" },
      { race_id: 2, distance: "10km", finish_time: "00:48:00" },
      { race_id: 3, distance: "5km", finish_time: "00:22:00" }, // only one -> excluded
    ];
    const res = buildTimeProgressChart(regs, races);
    expect(res.validDists).toEqual(["10km"]);
    expect(res.byDist["10km"]).toHaveLength(2);
    // sorted ascending by date
    expect(res.byDist["10km"][0].date).toBe("2026-01-01");
  });
});

describe("calculatePrice", () => {
  const race = (extra = {}) => ({ pricing: [{ distance: "10km", price: 20 }], ...extra });
  it("returns base price when no early bird", () => {
    expect(calculatePrice(race(), "10km")).toEqual({ base: 20, final: 20, isEarlyBird: false });
  });
  it("defaults to 0 for unknown distance", () => {
    expect(calculatePrice(race(), "42km").base).toBe(0);
  });
  it("applies discount before deadline", () => {
    const res = calculatePrice(
      race({ early_bird: { deadline: "2999-01-01", discount_percent: 25 } }),
      "10km",
    );
    expect(res.isEarlyBird).toBe(true);
    expect(res.final).toBe(15);
    expect(res.discount).toBe(25);
  });
  it("ignores expired early bird", () => {
    const res = calculatePrice(
      race({ early_bird: { deadline: "2000-01-01", discount_percent: 25 } }),
      "10km",
    );
    expect(res.isEarlyBird).toBe(false);
    expect(res.final).toBe(20);
  });
});

describe("parseGPX", () => {
  it("parses track points with elevation", () => {
    const gpx = `<?xml version="1.0"?><gpx><trk><trkseg>
      <trkpt lat="37.9" lon="23.7"><ele>100</ele></trkpt>
      <trkpt lat="38.0" lon="23.8"><ele>150</ele></trkpt>
    </trkseg></trk></gpx>`;
    const pts = parseGPX(gpx);
    expect(pts).toHaveLength(2);
    expect(pts[0]).toEqual([37.9, 23.7, 100]);
  });
  it("defaults missing elevation to 0", () => {
    const pts = parseGPX(`<gpx><trkpt lat="1" lon="2"></trkpt></gpx>`);
    expect(pts[0]).toEqual([1, 2, 0]);
  });
  it("returns null when there are no points", () => {
    expect(parseGPX(`<gpx></gpx>`)).toBeNull();
  });
});

describe("haversineKm / calculateRouteStats", () => {
  it("computes ~zero distance for identical points", () => {
    expect(haversineKm([37.9, 23.7], [37.9, 23.7])).toBeCloseTo(0, 5);
  });
  it("computes a known distance roughly", () => {
    // ~1 degree of latitude ≈ 111 km
    expect(haversineKm([0, 0], [1, 0])).toBeCloseTo(111.19, 1);
  });
  it("returns zeroed stats for < 2 points", () => {
    expect(calculateRouteStats([[0, 0, 0]])).toEqual({ totalKm: 0, gain: 0, loss: 0 });
  });
  it("accumulates gain and loss", () => {
    const stats = calculateRouteStats([
      [0, 0, 100],
      [0, 0.01, 150],
      [0, 0.02, 120],
    ]);
    expect(stats.gain).toBe(50);
    expect(stats.loss).toBe(30);
    expect(stats.totalKm).toBeGreaterThan(0);
  });
});

describe("escapeXml / generateGPX", () => {
  it("escapes xml special characters", () => {
    expect(escapeXml(`<a>&"'`)).toBe("&lt;a&gt;&amp;&quot;&apos;");
    expect(escapeXml(null)).toBe("");
  });
  it("generates a gpx document with track points", () => {
    const gpx = generateGPX({ distance: "10km", points: [[37.9, 23.7, 100]] });
    expect(gpx).toContain("<gpx");
    expect(gpx).toContain(`<trkpt lat="37.9" lon="23.7">`);
    expect(gpx).toContain("<ele>100</ele>");
    // round trip
    expect(parseGPX(gpx)).toEqual([[37.9, 23.7, 100]]);
  });
});

describe("buildElevationData / downsampleProfile", () => {
  it("returns empty for < 2 points", () => {
    expect(buildElevationData([[0, 0, 0]])).toEqual([]);
  });
  it("builds cumulative distance vs elevation", () => {
    const data = buildElevationData([
      [0, 0, 10],
      [0, 0.01, 20],
    ]);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual({ x: 0, y: 10 });
    expect(data[1].y).toBe(20);
    expect(data[1].x).toBeGreaterThan(0);
  });
  it("downsampleProfile keeps data below threshold intact", () => {
    const d = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    expect(downsampleProfile(d, 5)).toBe(d);
  });
  it("downsampleProfile reduces size and preserves the last point", () => {
    const d = Array.from({ length: 100 }, (_, i) => ({ x: i, y: i }));
    const out = downsampleProfile(d, 10);
    expect(out.length).toBeLessThan(d.length);
    expect(out[out.length - 1]).toEqual(d[d.length - 1]);
  });
});

describe("normalizeText", () => {
  it("lowercases, strips accents, normalizes final sigma and whitespace", () => {
    expect(normalizeText("  Ελλάς  ")).toBe("ελλασ");
    expect(normalizeText("ΓΙΩΡΓΟΣ")).toBe("γιωργοσ");
    expect(normalizeText("a   b")).toBe("a b");
    expect(normalizeText(null)).toBe("");
  });
});

describe("parseCSV", () => {
  it("returns [] when fewer than 2 lines", () => {
    expect(parseCSV("only header")).toEqual([]);
  });
  it("parses headers (normalized) and rows", () => {
    const csv = "BIB,Name\n1,Alice\n2,Bob";
    const { headers, rows } = parseCSV(csv);
    expect(headers).toEqual(["bib", "name"]);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ bib: "1", name: "Alice" });
  });
  it("handles quoted values containing commas and escaped quotes", () => {
    const csv = 'name,note\n"Doe, John","say ""hi"""';
    const { rows } = parseCSV(csv);
    expect(rows[0].name).toBe("Doe, John");
    expect(rows[0].note).toBe('say "hi"');
  });
});

describe("mapCSVRow", () => {
  it("maps flexible column aliases to standard fields", () => {
    expect(mapCSVRow({ "#": "42", mail: "a@b.gr", name: "Alice", surname: "Smith" })).toEqual({
      bib: "42", email: "a@b.gr", first_name: "Alice", last_name: "Smith", club: "", finish_time: "",
    });
  });
});

describe("parseTimeFlex", () => {
  it("returns null for empty", () => {
    expect(parseTimeFlex("")).toBeNull();
    expect(parseTimeFlex("garbage")).toBeNull();
  });
  it("passes through DNF/DNS/DSQ", () => {
    expect(parseTimeFlex("dnf")).toBe("DNF");
    expect(parseTimeFlex("DSQ")).toBe("DSQ");
  });
  it("normalizes hh:mm:ss and drops milliseconds", () => {
    expect(parseTimeFlex("1:2:3")).toBe("01:02:03");
    expect(parseTimeFlex("01:02:03.456")).toBe("01:02:03");
  });
  it("converts mm:ss, rolling minutes into hours", () => {
    expect(parseTimeFlex("90:30")).toBe("01:30:30");
    expect(parseTimeFlex("45:10")).toBe("00:45:10");
  });
});

describe("matchRunner", () => {
  const runners = [
    { id: "r1", email: "alice@x.gr", first_name: "Alice", last_name: "Smith", club: "Team A" },
    { id: "r2", email: "bob@x.gr", first_name: "Bob", last_name: "Jones", club: "Team B" },
    { id: "r3", email: "carol@x.gr", first_name: "Alice", last_name: "Smith", club: "Team C" },
  ];
  const registrations = [
    { id: "reg1", runner_id: "r1", bib_number: 101 },
    { id: "reg2", runner_id: "r2", bib_number: 102 },
    { id: "reg3", runner_id: "r3", bib_number: 103 },
  ];

  it("matches by BIB first", () => {
    const res = matchRunner({ bib_number: "102" }, registrations, runners);
    expect(res).toEqual({ registration: registrations[1], method: "BIB" });
  });
  it("matches by email when no bib", () => {
    const res = matchRunner({ email: "BOB@x.gr" }, registrations, runners);
    expect(res.method).toBe("email");
    expect(res.registration.id).toBe("reg2");
  });
  it("matches by unique normalized name", () => {
    const res = matchRunner({ name: "Bob", surname: "Jones" }, registrations, runners);
    expect(res.method).toBe("name");
    expect(res.registration.id).toBe("reg2");
  });
  it("disambiguates duplicate names using club", () => {
    const res = matchRunner(
      { name: "Alice", surname: "Smith", club: "Team C" },
      registrations,
      runners,
    );
    expect(res.method).toBe("name+club");
    expect(res.registration.id).toBe("reg3");
  });
  it("flags ambiguous when duplicate names and no club match", () => {
    const res = matchRunner({ name: "Alice", surname: "Smith" }, registrations, runners);
    expect(res).toEqual({ ambiguous: true, count: 2 });
  });
  it("returns null when nothing matches", () => {
    const res = matchRunner({ email: "nobody@x.gr" }, registrations, runners);
    expect(res).toBeNull();
  });
});
