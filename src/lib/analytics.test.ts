import { describe, expect, it } from "vitest";
import { ago, cleanPath, isBot, parseUserAgent, refHost, summarize, type Visit } from "./analytics";

const CHROME_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const SAFARI_IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const CHROME_ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";
const EDGE_WIN =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0";

describe("parseUserAgent", () => {
  it("recognises common browsers, systems and devices", () => {
    expect(parseUserAgent(CHROME_MAC)).toEqual({ browser: "Chrome", os: "macOS", device: "desktop" });
    expect(parseUserAgent(SAFARI_IPHONE)).toEqual({ browser: "Safari", os: "iOS", device: "mobile" });
    expect(parseUserAgent(CHROME_ANDROID)).toEqual({ browser: "Chrome", os: "Android", device: "mobile" });
    expect(parseUserAgent(EDGE_WIN)).toEqual({ browser: "Edge", os: "Windows", device: "desktop" });
  });

  it("treats Android without Mobile and iPad as tablets", () => {
    expect(parseUserAgent("Mozilla/5.0 (Linux; Android 13; SM-X700) Chrome/120 Safari/537.36").device).toBe(
      "tablet",
    );
    expect(
      parseUserAgent("Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) Version/17.5 Safari/604.1").device,
    ).toBe("tablet");
  });
});

describe("isBot", () => {
  it("flags crawlers, scripts and a missing user agent", () => {
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBe(true);
    expect(isBot("curl/8.4.0")).toBe(true);
    expect(isBot("HeadlessChrome/126")).toBe(true);
    expect(isBot(null)).toBe(true);
    expect(isBot(CHROME_MAC)).toBe(false);
  });
});

describe("cleanPath", () => {
  it("keeps the pathname only", () => {
    expect(cleanPath("/day/3/1?token=abc#x")).toBe("/day/3/1");
    expect(cleanPath("/revise/")).toBe("/revise");
    expect(cleanPath("/")).toBe("/");
  });
  it("rejects anything that is not a plain site path", () => {
    expect(cleanPath("//evil.example")).toBeNull();
    expect(cleanPath("https://evil.example")).toBeNull();
    expect(cleanPath("/a\nb")).toBeNull();
    expect(cleanPath("/" + "a".repeat(300))).toBeNull();
  });
});

describe("refHost", () => {
  it("reduces a referrer to its host and drops our own site", () => {
    expect(refHost("https://www.google.com/search?q=daybook", "daybookcs.vercel.app")).toBe("google.com");
    expect(refHost("https://daybookcs.vercel.app/plan", "daybookcs.vercel.app")).toBeNull();
    expect(refHost("not a url", "x.dev")).toBeNull();
    expect(refHost("", "x.dev")).toBeNull();
  });
});

const DAY = 86_400_000;
const T0 = Date.UTC(2026, 9, 1);

function visit(over: Partial<Visit> & { at: number }): Visit {
  const { at, ...rest } = over;
  return {
    ts: new Date(T0 + at),
    vid: "aaaa1111-0000",
    sid: "s1",
    path: "/",
    ref: null,
    country: "IN",
    region: null,
    city: "Pune",
    device: "desktop",
    browser: "Chrome",
    os: "macOS",
    uid: null,
    name: null,
    email: null,
    owner: false,
    lang: "en-US",
    ...rest,
  };
}

describe("summarize", () => {
  const rows: Visit[] = [
    visit({ at: 1000, path: "/", ref: "google.com" }),
    visit({ at: 2000, path: "/plan" }),
    visit({ at: DAY + 1000, vid: "bbbb2222-0000", sid: "s2", path: "/plan", country: "US", city: null }),
    visit({
      at: 2 * DAY + 1000,
      vid: "cccc3333-0000",
      sid: "s3",
      path: "/revise",
      uid: "google:1",
      name: "Ada Lovelace",
      email: "ada@example.com",
    }),
    visit({
      at: 2 * DAY + 5000,
      vid: "dddd4444-0000",
      sid: "s3",
      path: "/revise",
      uid: "google:1",
      name: "Ada Lovelace",
      email: "ada@example.com",
    }),
  ];
  const s = summarize(rows, T0, T0 + 3 * DAY);

  it("counts views, visitors and sessions", () => {
    expect(s.views).toBe(5);
    expect(s.visitors).toBe(4);
    expect(s.sessions).toBe(3);
    expect(s.signedIn).toBe(1);
    // s2 is a single page; s1 and s3 have two.
    expect(s.bounceRate).toBeCloseTo(1 / 3);
  });

  it("buckets by UTC day with empty days included", () => {
    expect(s.bucket).toBe("day");
    expect(s.series.map((b) => b.views)).toEqual([2, 1, 2]);
    expect(s.series.map((b) => b.visitors)).toEqual([1, 1, 2]);
  });

  it("ranks pages and attributes referrers per session", () => {
    expect(s.pages[0]).toEqual({ label: "/plan", n: 2 });
    expect(s.referrers).toContainEqual({ label: "google.com", n: 1 });
    expect(s.referrers).toContainEqual({ label: "Direct or unknown", n: 2 });
  });

  it("groups people by account when signed in, otherwise by browser", () => {
    const ada = s.people.find((p) => p.signedIn);
    expect(ada).toMatchObject({ label: "Ada Lovelace", sub: "ada@example.com", views: 2, sessions: 1 });
    expect(s.people).toHaveLength(3);
    expect(s.people.find((p) => p.key === "bbbb2222-0000")).toMatchObject({
      label: "Visitor bbbb",
      place: "United States",
    });
  });

  it("uses hourly buckets for short ranges and lists newest first", () => {
    const h = summarize(rows.slice(0, 2), T0, T0 + DAY);
    expect(h.bucket).toBe("hour");
    expect(h.series).toHaveLength(24);
    expect(h.recent[0].path).toBe("/plan");
  });

  it("handles no visits", () => {
    const e = summarize([], T0, T0 + DAY);
    expect(e.views).toBe(0);
    expect(e.bounceRate).toBeNull();
    expect(e.people).toEqual([]);
  });
});

describe("ago", () => {
  it("rounds to a friendly unit", () => {
    const now = T0;
    expect(ago(new Date(now - 10_000), now)).toBe("just now");
    expect(ago(new Date(now - 5 * 60_000), now)).toBe("5 min ago");
    expect(ago(new Date(now - 3 * 3_600_000), now)).toBe("3 h ago");
    expect(ago(new Date(now - 2 * DAY), now)).toBe("2 d ago");
  });
});
