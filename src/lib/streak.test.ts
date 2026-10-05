import { describe, expect, it } from "vitest";
import { bestStreak, currentStreak } from "./streak";

const MON_THU = [1, 2, 3, 4];
const act = (...dates: string[]) => Object.fromEntries(dates.map((d) => [d, 1]));

describe("streak", () => {
  it("is zero with no activity", () => {
    expect(currentStreak({}, MON_THU, "2025-10-15")).toBe(0);
  });

  it("counts consecutive study days and keeps today open", () => {
    const a = act("2025-10-13", "2025-10-14"); // Mon, Tue
    expect(currentStreak(a, MON_THU, "2025-10-14")).toBe(2);
    expect(currentStreak(a, MON_THU, "2025-10-15")).toBe(2); // Wed, nothing yet: still alive
  });

  it("breaks when a scheduled study day is missed", () => {
    const a = act("2025-10-13", "2025-10-14"); // Mon, Tue
    expect(currentStreak(a, MON_THU, "2025-10-16")).toBe(0); // Wed missed, Thu is today
  });

  it("keeps the streak across rest days", () => {
    const a = act("2025-10-15", "2025-10-16", "2025-10-20"); // Wed, Thu, then Mon
    expect(currentStreak(a, MON_THU, "2025-10-20")).toBe(3);
    expect(currentStreak(a, MON_THU, "2025-10-18")).toBe(2); // Saturday, a rest day
  });

  it("counts study on a rest day without penalty", () => {
    const a = act("2025-10-16", "2025-10-18", "2025-10-20"); // Thu, Sat (rest), Mon
    expect(currentStreak(a, MON_THU, "2025-10-20")).toBe(3);
  });

  it("does not run forever when nothing is active", () => {
    expect(currentStreak(act("2020-01-01"), MON_THU, "2025-10-15")).toBe(0);
  });

  it("finds the best streak", () => {
    const a = act("2025-10-13", "2025-10-14", "2025-10-15", "2025-10-27");
    expect(bestStreak(a, MON_THU)).toBe(3);
    expect(bestStreak({}, MON_THU)).toBe(0);
  });
});
