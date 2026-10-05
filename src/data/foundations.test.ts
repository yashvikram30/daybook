import { describe, expect, it } from "vitest";
import { FOUNDATION_DAYS, FOUNDATION_WEEKS, findFoundationDay, foundationHref } from "./foundations";

describe("python foundations", () => {
  it("is four weeks of four days", () => {
    expect(FOUNDATION_WEEKS.map((w) => w.days.length)).toEqual([4, 4, 4, 4]);
    expect(FOUNDATION_DAYS).toHaveLength(16);
  });

  it("has unique day ids and item keys that start with the day id", () => {
    expect(new Set(FOUNDATION_DAYS.map((d) => d.id)).size).toBe(16);
    const keys = FOUNDATION_DAYS.flatMap((d) => [...d.learn, ...d.practice].map((i) => i.key));
    expect(new Set(keys).size).toBe(keys.length);
    for (const d of FOUNDATION_DAYS)
      for (const i of [...d.learn, ...d.practice]) expect(i.key.startsWith(d.id + ":")).toBe(true);
  });

  it("gives every day something to learn, something to practise and questions to answer", () => {
    for (const d of FOUNDATION_DAYS) {
      expect(d.learn.length, d.id).toBeGreaterThanOrEqual(3);
      expect(d.practice.length, d.id).toBeGreaterThanOrEqual(3);
      expect(d.check.length, d.id).toBe(3);
      expect(d.goal.length, d.id).toBeGreaterThan(20);
      expect(d.minutes, d.id).toBeGreaterThanOrEqual(120);
      expect(d.minutes, d.id).toBeLessThanOrEqual(200);
    }
  });

  it("only links to https pages, and every link item has a note on what to do", () => {
    for (const d of FOUNDATION_DAYS)
      for (const i of [...d.learn, ...d.practice]) {
        if (i.url) {
          expect(i.url.startsWith("https://"), `${i.key} ${i.url}`).toBe(true);
          expect(i.note, i.key).toBeTruthy();
        }
      }
  });

  it("draws on all three sources", () => {
    const urls = FOUNDATION_DAYS.flatMap((d) => [...d.learn, ...d.practice].map((i) => i.url ?? ""));
    expect(urls.some((u) => u.includes("developers.google.com/edu/python"))).toBe(true);
    expect(urls.some((u) => u.includes("freecodecamp.org/learn/python-v9"))).toBe(true);
    expect(urls.some((u) => u.includes("youtube.com/watch?v=rfscVS0vtbw&t="))).toBe(true);
  });

  it("finds days by their URL parts", () => {
    expect(findFoundationDay("2", "3")?.id).toBe("f2d3");
    expect(findFoundationDay("5", "1")).toBeNull();
    expect(foundationHref(4, 4)).toBe("/foundations/4/4");
  });
});
