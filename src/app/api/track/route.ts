import { z } from "zod";
import { auth } from "@/auth";
import { cleanPath, headerText, isBot, parseUserAgent, refHost, type Visit } from "@/lib/analytics";
import { visits } from "@/lib/mongo";
import { isOwnerEmail } from "@/lib/owner";

const ID = /^[A-Za-z0-9-]{8,64}$/;
const Body = z.object({
  vid: z.string().regex(ID),
  sid: z.string().regex(ID),
  path: z.string().max(300),
  ref: z.string().max(500).nullish(),
  lang: z.string().max(35).nullish(),
});

// The tracker never needs an answer, and a failed write must never surface to a visitor.
const done = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

/** Records one page view: { vid, sid, path, ref?, lang? } from components/page-view-tracker.tsx. */
export async function POST(req: Request) {
  // Local `next dev` shares the production database, so it is opt-in.
  if (process.env.NODE_ENV !== "production" && !process.env.ANALYTICS_TRACK_DEV) return done();
  // Only our own pages send views. (Header absent: older clients and tools, which we can ignore.)
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return done();

  const ua = req.headers.get("user-agent");
  if (isBot(ua)) return done();
  if (Number(req.headers.get("content-length") ?? 0) > 4096) return done();

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return done();
  }
  const path = cleanPath(body.path);
  if (!path || path.startsWith("/api/") || path.startsWith("/analytics")) return done();

  const session = await auth();
  const { browser, os, device } = parseUserAgent(ua ?? "");
  const h = req.headers;
  const visit: Visit = {
    ts: new Date(),
    vid: body.vid,
    sid: body.sid,
    path,
    ref: refHost(body.ref, h.get("host")),
    country: headerText(h.get("x-vercel-ip-country"), 2)?.toUpperCase() ?? null,
    region: headerText(h.get("x-vercel-ip-country-region")),
    city: headerText(h.get("x-vercel-ip-city")),
    device,
    browser,
    os,
    uid: session?.user?.id ?? null,
    name: session?.user?.name?.slice(0, 100) ?? null,
    email: session?.user?.email?.slice(0, 200) ?? null,
    owner: isOwnerEmail(session?.user?.email),
    lang: body.lang?.slice(0, 35) ?? null,
  };
  try {
    await (await visits()).insertOne(visit);
  } catch (e) {
    console.error("track failed", e);
  }
  return done();
}
