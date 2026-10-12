/** One recorded page view. Stored in the `visits` collection (see lib/mongo.ts). */
export type Device = "desktop" | "mobile" | "tablet";

export type Visit = {
  ts: Date;
  /** Random id kept in the visitor's localStorage: the same browser keeps the same id. */
  vid: string;
  /** Random id kept in sessionStorage: one per tab session. */
  sid: string;
  path: string;
  /** Referring site's host, on the first page view of a session only. */
  ref: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device: Device;
  browser: string;
  os: string;
  /** Set when the visitor was signed in. */
  uid: string | null;
  name: string | null;
  email: string | null;
  /** The site owner's own visits are stored but left out of the dashboard. */
  owner: boolean;
  lang: string | null;
};

// ---- request parsing -------------------------------------------------------------------------

const BOT =
  /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget|python-requests|node-fetch|undici|axios|go-http|monitor|uptime/i;

/** Crawlers and scripts rarely run the tracker, but the ones that do should not count as people. */
export function isBot(ua: string | null | undefined): boolean {
  return !ua || BOT.test(ua);
}

export function parseUserAgent(ua: string): { browser: string; os: string; device: Device } {
  const browser = /Edg(e|A|iOS)?\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung Internet"
        : /Firefox\/|FxiOS/.test(ua)
          ? "Firefox"
          : /Chrome\/|CriOS/.test(ua)
            ? "Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Other";
  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X|Macintosh/.test(ua)
          ? "macOS"
          : /CrOS/.test(ua)
            ? "ChromeOS"
            : /Linux/.test(ua)
              ? "Linux"
              : "Other";
  const device: Device =
    /iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))
      ? "tablet"
      : /iPhone|iPod|Mobile/.test(ua)
        ? "mobile"
        : "desktop";
  return { browser, os, device };
}

/** Pathname only: no query string or hash (they can carry tokens), no protocol-relative or odd values. */
export function cleanPath(raw: string): string | null {
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.length > 200) return null;
  if (/[\u0000-\u001f\u007f]/.test(raw)) return null;
  const p = raw.split(/[?#]/)[0];
  return p.length > 1 ? p.replace(/\/+$/, "") || "/" : p;
}

/** The referrer reduced to its host. Links from the site itself are not referrals. */
export function refHost(ref: string | null | undefined, ownHost: string | null): string | null {
  if (!ref) return null;
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "").toLowerCase();
    if (!host) return null;
    const own = ownHost
      ?.split(":")[0]
      .replace(/^www\./, "")
      .toLowerCase();
    return host === own ? null : host.slice(0, 100);
  } catch {
    return null;
  }
}

/** Vercel sends the city URL-encoded. Anything unreadable becomes null. */
export function headerText(v: string | null, max = 80): string | null {
  if (!v) return null;
  try {
    return decodeURIComponent(v).slice(0, max) || null;
  } catch {
    return v.slice(0, max);
  }
}

export function countryName(code: string | null): string {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

// ---- aggregation -----------------------------------------------------------------------------

export type Count = { label: string; n: number };

export type Person = {
  key: string;
  label: string;
  /** Email for a signed-in visitor. */
  sub: string | null;
  signedIn: boolean;
  place: string;
  device: Device;
  browser: string;
  os: string;
  views: number;
  sessions: number;
  first: Date;
  last: Date;
};

export type Bucket = { t: number; views: number; visitors: number };

export type Summary = {
  views: number;
  visitors: number;
  sessions: number;
  signedIn: number;
  bounceRate: number | null;
  series: Bucket[];
  bucket: "hour" | "day";
  pages: Count[];
  referrers: Count[];
  countries: Count[];
  devices: Count[];
  browsers: Count[];
  systems: Count[];
  people: Person[];
  recent: Visit[];
};

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function tally(items: Iterable<string>, limit = 8): Count[] {
  const m = new Map<string, number>();
  for (const k of items) m.set(k, (m.get(k) ?? 0) + 1);
  return [...m]
    .map(([label, n]) => ({ label, n }))
    .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function place(v: Pick<Visit, "city" | "country">): string {
  if (!v.country) return "Unknown location";
  return v.city ? `${v.city}, ${countryName(v.country)}` : countryName(v.country);
}

/** Visit ids kept short for display: enough to tell anonymous visitors apart. */
const shortId = (vid: string) => vid.replace(/-/g, "").slice(0, 4);

/**
 * Everything the dashboard shows, from the visits in [since, until). `visits` may be in any order.
 * Buckets are UTC hours for ranges up to two days, UTC days otherwise.
 */
export function summarize(visits: Visit[], since: number, until: number): Summary {
  const bucket = until - since <= 2 * DAY ? "hour" : "day";
  const step = bucket === "hour" ? HOUR : DAY;
  const first = Math.floor(since / step) * step;

  const series = new Map<number, { views: number; vids: Set<string> }>();
  for (let t = first; t < until; t += step) series.set(t, { views: 0, vids: new Set() });

  const vids = new Set<string>();
  const sessions = new Map<string, { views: number; ref: string | null }>();
  const signedIn = new Set<string>();
  const people = new Map<string, Person & { sids: Set<string> }>();

  const sorted = [...visits].sort((a, b) => a.ts.getTime() - b.ts.getTime());
  for (const v of sorted) {
    const b = series.get(Math.floor(v.ts.getTime() / step) * step);
    if (b) {
      b.views++;
      b.vids.add(v.vid);
    }
    vids.add(v.vid);
    const s = sessions.get(v.sid) ?? { views: 0, ref: null };
    s.views++;
    s.ref ??= v.ref;
    sessions.set(v.sid, s);
    if (v.uid) signedIn.add(v.uid);

    const key = v.uid ?? v.vid;
    const p = people.get(key) ?? {
      key,
      label: "",
      sub: null,
      signedIn: false,
      place: "",
      device: v.device,
      browser: v.browser,
      os: v.os,
      views: 0,
      sessions: 0,
      first: v.ts,
      last: v.ts,
      sids: new Set<string>(),
    };
    p.views++;
    p.sids.add(v.sid);
    p.last = v.ts;
    // The latest visit wins for where and on what, and a name sticks once the visitor has signed in.
    p.place = place(v);
    p.device = v.device;
    p.browser = v.browser;
    p.os = v.os;
    if (v.uid) {
      p.signedIn = true;
      p.label = v.name || v.email || "Signed-in visitor";
      p.sub = v.name ? v.email : null;
    } else if (!p.signedIn) p.label = `Visitor ${shortId(v.vid)}`;
    people.set(key, p);
  }

  const bounced = [...sessions.values()].filter((s) => s.views === 1).length;
  const refCounts = tally(
    [...sessions.values()].map((s) => s.ref ?? "Direct or unknown"),
    8,
  );

  return {
    views: visits.length,
    visitors: vids.size,
    sessions: sessions.size,
    signedIn: signedIn.size,
    bounceRate: sessions.size ? bounced / sessions.size : null,
    bucket,
    series: [...series].map(([t, b]) => ({ t, views: b.views, visitors: b.vids.size })),
    pages: tally(
      sorted.map((v) => v.path),
      10,
    ),
    referrers: refCounts,
    countries: tally(
      sorted.map((v) => countryName(v.country)),
      8,
    ),
    devices: tally(
      sorted.map((v) => v.device),
      3,
    ),
    browsers: tally(
      sorted.map((v) => v.browser),
      6,
    ),
    systems: tally(
      sorted.map((v) => v.os),
      6,
    ),
    people: [...people.values()]
      .map(({ sids, ...p }) => ({ ...p, sessions: sids.size }))
      .sort((a, b) => b.last.getTime() - a.last.getTime())
      .slice(0, 25),
    recent: sorted.slice(-40).reverse(),
  };
}

/** "just now", "5 min ago", "3 h ago", "2 d ago". */
export function ago(then: Date, now: number): string {
  const s = Math.max(0, Math.round((now - then.getTime()) / 1000));
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
}
