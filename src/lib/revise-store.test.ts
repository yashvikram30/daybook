import { describe, expect, it } from "vitest";
import { normalizeRevise } from "./revise-store";

describe("normalizeRevise", () => {
  it("keeps valid history and preferences", () => {
    const r = normalizeRevise({
      stats: { "w1c-abc": { seen: 3, miss: 1, lastOk: true } },
      prefs: { weeks: [1, 3, 3], secs: ["dsa"], types: ["mcq"], size: 20 },
    });
    expect(r.stats["w1c-abc"]).toEqual({ seen: 3, miss: 1, lastOk: true });
    expect(r.prefs).toEqual({ weeks: [1, 3], secs: ["dsa"], types: ["mcq"], size: 20 });
  });

  it("drops anything malformed instead of throwing", () => {
    const r = normalizeRevise({
      stats: { a: { seen: 0, miss: 0 }, b: "x", c: { seen: 2, miss: -1 } },
      prefs: { weeks: ["1"], secs: ["nope"], types: [], size: -4 },
    });
    expect(r).toEqual({ stats: {}, prefs: {} });
    expect(normalizeRevise(null)).toEqual({ stats: {}, prefs: {} });
    expect(normalizeRevise("junk")).toEqual({ stats: {}, prefs: {} });
  });
});
