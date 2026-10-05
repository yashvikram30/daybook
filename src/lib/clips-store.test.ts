import { describe, expect, it } from "vitest";
import { clipsOn, dayFromPath, isUrl, normalizeClips } from "./clips-store";

describe("dayFromPath", () => {
  it("reads the day from a day page or a step page", () => {
    expect(dayFromPath("/day/3/2")).toBe("w3d2");
    expect(dayFromPath("/day/12/5/practice")).toBe("w12d5");
  });
  it("is null elsewhere", () => {
    expect(dayFromPath("/notes")).toBeNull();
    expect(dayFromPath("/week/3")).toBeNull();
    expect(dayFromPath(null)).toBeNull();
  });
});

describe("isUrl", () => {
  it("accepts one http(s) address only", () => {
    expect(isUrl(" https://go.dev/doc ")).toBe(true);
    expect(isUrl("see https://go.dev")).toBe(false);
    expect(isUrl("javascript:alert(1)")).toBe(false);
  });
});

describe("normalizeClips", () => {
  const ok = { id: "a", day: "w1d1", kind: "text", text: "hi", created: 5 };
  it("keeps good clips and drops bad ones", () => {
    const out = normalizeClips({
      clips: [
        ok,
        { ...ok, id: "a" },
        { ...ok, id: "b", day: "nope" },
        { ...ok, id: "c", kind: "image" },
        { ...ok, id: "d", kind: "link", text: "not a url" },
        { ...ok, id: "e", text: "  " },
        { ...ok, id: "f", kind: "image", img: "data:image/webp;base64,AAAA", text: "" },
        { ...ok, id: "g", kind: "image", img: "javascript:alert(1)" },
      ],
    });
    expect(out.clips.map((c) => c.id)).toEqual(["a", "f"]);
  });
  it("survives junk", () => {
    expect(normalizeClips(null).clips).toEqual([]);
    expect(normalizeClips({ clips: "x" }).clips).toEqual([]);
  });
});

describe("clipsOn", () => {
  it("filters by day, oldest first", () => {
    const mk = (id: string, day: string, created: number) =>
      ({ id, day, kind: "text", text: id, created }) as const;
    const got = clipsOn([mk("x", "w1d1", 3), mk("y", "w1d2", 1), mk("z", "w1d1", 2)], "w1d1");
    expect(got.map((c) => c.id)).toEqual(["z", "x"]);
  });
});
