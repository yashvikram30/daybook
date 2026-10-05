import { describe, expect, it } from "vitest";
import { LABS, labKey } from "./labs";
import { MONTHS, WEEKS_PER_MONTH, monthExercises, monthKey, monthOf, monthWeeks } from "./months";

describe("monthly review", () => {
  it("covers all sixteen weeks in four-week months", () => {
    expect(MONTHS.map((m) => m.month)).toEqual([1, 2, 3, 4]);
    expect(MONTHS.length * WEEKS_PER_MONTH).toBe(LABS.length);
    expect(monthWeeks(2)).toEqual([5, 8]);
    expect(monthOf(8)).toBe(2);
    expect(monthOf(9)).toBe(3);
  });

  it("reaches back into earlier months from month 2 on", () => {
    expect(MONTHS[0].carry).toHaveLength(0);
    for (const m of MONTHS.slice(1)) expect(m.carry.length).toBeGreaterThan(0);
  });

  it("gives every exercise a unique progress key that cannot clash with a weekly lab", () => {
    const keys = [
      ...MONTHS.flatMap((m) => monthExercises(m).map((_, i) => monthKey(m.month, i))),
      ...LABS.flatMap((l) => l.exercises.map((_, i) => labKey(l.week, i))),
    ];
    expect(new Set(keys).size).toBe(keys.length);
  });
});
