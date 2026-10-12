import { beforeEach, describe, expect, it, vi } from "vitest";

const insertOne = vi.fn();
const authMock = vi.fn();

vi.mock("@/lib/mongo", () => ({ visits: async () => ({ insertOne }) }));
vi.mock("@/auth", () => ({ auth: () => authMock() }));

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://daybookcs.vercel.app/api/track", {
    method: "POST",
    headers: {
      "user-agent": UA,
      "content-type": "application/json",
      host: "daybookcs.vercel.app",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const good = { vid: "11111111-2222-3333-4444-555555555555", sid: "66666666-7777", path: "/plan?x=1" };

async function run(req: Request) {
  const { POST } = await import("@/app/api/track/route");
  return POST(req);
}

beforeEach(() => {
  insertOne.mockReset();
  authMock.mockReset().mockResolvedValue(null);
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("ANALYTICS_OWNER_EMAIL", "me@example.com");
});

describe("POST /api/track", () => {
  it("records a view with geo, device and a cleaned path", async () => {
    const res = await run(
      post(
        { ...good, ref: "https://www.google.com/search?q=x", lang: "en-GB" },
        { "x-vercel-ip-country": "in", "x-vercel-ip-city": "Navi%20Mumbai" },
      ),
    );
    expect(res.status).toBe(204);
    expect(insertOne).toHaveBeenCalledTimes(1);
    expect(insertOne.mock.calls[0][0]).toMatchObject({
      path: "/plan",
      ref: "google.com",
      country: "IN",
      city: "Navi Mumbai",
      browser: "Chrome",
      os: "macOS",
      device: "desktop",
      uid: null,
      owner: false,
    });
  });

  it("attaches the signed-in user and marks the owner", async () => {
    authMock.mockResolvedValue({ user: { id: "google:9", name: "Me", email: "ME@example.com" } });
    await run(post(good));
    expect(insertOne.mock.calls[0][0]).toMatchObject({ uid: "google:9", name: "Me", owner: true });
  });

  it.each([
    ["bots", () => post(good, { "user-agent": "Googlebot/2.1" })],
    ["cross-site requests", () => post(good, { "sec-fetch-site": "cross-site" })],
    ["bad ids", () => post({ ...good, vid: "x" })],
    ["api paths", () => post({ ...good, path: "/api/sync" })],
    ["the dashboard itself", () => post({ ...good, path: "/analytics" })],
    [
      "non-JSON bodies",
      () =>
        new Request("https://x.dev/api/track", {
          method: "POST",
          headers: { "user-agent": UA },
          body: "nope",
        }),
    ],
  ])("ignores %s without error", async (_name, make) => {
    const res = await run(make());
    expect(res.status).toBe(204);
    expect(insertOne).not.toHaveBeenCalled();
  });

  it("does nothing in development unless opted in", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await run(post(good));
    expect(insertOne).not.toHaveBeenCalled();
    vi.stubEnv("ANALYTICS_TRACK_DEV", "1");
    await run(post(good));
    expect(insertOne).toHaveBeenCalledTimes(1);
  });

  it("survives a database failure", async () => {
    insertOne.mockRejectedValue(new Error("down"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await run(post(good));
    expect(res.status).toBe(204);
    spy.mockRestore();
  });
});
