import { describe, expect, it } from "vitest";
import {
  addDays,
  behindBy,
  changeStudyDays,
  dateForDay,
  firstUnfinished,
  formatDate,
  isISODate,
  newPlan,
  placement,
  reschedule,
  scheduleDates,
  todayIn,
  weekdayOf,
} from "./schedule";

// 2025-10-13 is a Monday.
const mon = "2025-10-13";

describe("schedule", () => {
  it("places 4 days a week on Mon-Thu by default", () => {
    const p = newPlan(mon);
    expect(scheduleDates(p, 9)).toEqual([
      "2025-10-13",
      "2025-10-14",
      "2025-10-15",
      "2025-10-16",
      "2025-10-20",
      "2025-10-21",
      "2025-10-22",
      "2025-10-23",
      "2025-10-27",
    ]);
  });

  it("starts on the next study weekday when the start date is a rest day", () => {
    expect(dateForDay(newPlan("2025-10-17"), 0)).toBe("2025-10-20"); // Friday -> Monday
    expect(dateForDay(newPlan("2025-10-17", [5, 6]), 0)).toBe("2025-10-17");
  });

  it("supports any weekday set, in any order", () => {
    const p = newPlan(mon, [6, 0, 3]);
    expect(scheduleDates(p, 4).map(weekdayOf)).toEqual([3, 6, 0, 3]);
  });

  it("falls back to the default study days when none are valid", () => {
    expect(newPlan(mon, []).studyDays).toEqual([1, 2, 3, 4]);
    expect(newPlan(mon, [9, -1, 2.5]).studyDays).toEqual([1, 2, 3, 4]);
  });

  it("crosses month and year boundaries", () => {
    const p = newPlan("2025-12-29");
    expect(scheduleDates(p, 5)).toEqual([
      "2025-12-29",
      "2025-12-30",
      "2025-12-31",
      "2026-01-01",
      "2026-01-05",
    ]);
    expect(addDays("2024-02-28", 2)).toBe("2024-03-01"); // leap year
  });

  it("is unaffected by DST changes", () => {
    const p = newPlan("2025-10-27"); // UTC offsets change in Europe on 26 Oct and in the US on 2 Nov
    expect(scheduleDates(p, 8).map(weekdayOf)).toEqual([1, 2, 3, 4, 1, 2, 3, 4]);
    expect(dateForDay(newPlan("2025-03-24"), 5)).toBe("2025-04-01");
  });

  it("covers the whole 64-day plan in 16 weeks", () => {
    const d = scheduleDates(newPlan(mon), 64);
    expect(d[63]).toBe("2026-01-29");
  });

  it("reschedules from today without touching earlier dates", () => {
    const p = newPlan(mon);
    const before = scheduleDates(p, 52);
    // Finished days 0-2, then life happened; it's now Mon 3 Nov.
    const r = reschedule(p, 3, "2025-11-03");
    const after = scheduleDates(r, 52);
    expect(after.slice(0, 3)).toEqual(before.slice(0, 3));
    expect(after[3]).toBe("2025-11-03");
    expect(after[4]).toBe("2025-11-04");
    expect(after[51]).toBe("2026-01-26");
  });

  it("moves the first unfinished day to the next study day when today is a rest day", () => {
    const r = reschedule(newPlan(mon), 2, "2025-10-18"); // Saturday
    expect(dateForDay(r, 2)).toBe("2025-10-20");
  });

  it("replaces later anchors when rescheduling again", () => {
    let p = reschedule(newPlan(mon), 3, "2025-11-03");
    p = reschedule(p, 5, "2025-11-17");
    expect(p.anchors).toEqual([
      { index: 3, date: "2025-11-03" },
      { index: 5, date: "2025-11-17" },
    ]);
    p = reschedule(p, 4, "2025-11-24");
    expect(p.anchors).toEqual([
      { index: 3, date: "2025-11-03" },
      { index: 4, date: "2025-11-24" },
    ]);
  });

  it("restarting from day 1 resets the start date", () => {
    expect(reschedule(newPlan(mon), 0, "2025-11-03")).toEqual(newPlan("2025-11-03"));
  });

  it("changing study days keeps anchors", () => {
    const p = changeStudyDays(reschedule(newPlan(mon), 3, "2025-11-03"), [1, 3, 5]);
    expect(dateForDay(p, 3)).toBe("2025-11-03");
    expect(dateForDay(p, 4)).toBe("2025-11-05");
  });

  it("reports placement, first unfinished and how far behind", () => {
    const dates = scheduleDates(newPlan(mon), 8);
    const done = new Set([0, 1]);
    const isDone = (i: number) => done.has(i);
    expect(firstUnfinished(8, isDone)).toBe(2);
    expect(firstUnfinished(2, isDone)).toBeNull();
    expect(behindBy(dates, "2025-10-21", isDone)).toBe(3); // days 2,3,4 are before Tue 21 Oct
    expect(behindBy(dates, mon, isDone)).toBe(0);
    expect(placement("2025-10-21", "2025-10-21", false)).toBe("today");
    expect(placement("2025-10-20", "2025-10-21", false)).toBe("overdue");
    expect(placement("2025-10-20", "2025-10-21", true)).toBe("done");
    expect(placement("2025-10-22", "2025-10-21", false)).toBe("upcoming");
  });

  it("formats and validates dates", () => {
    expect(formatDate("2025-10-13")).toBe("Mon 13 Oct");
    expect(isISODate("2025-02-30")).toBe(false);
    expect(isISODate("2025-10-13")).toBe(true);
    expect(isISODate("13/10/2025")).toBe(false);
  });

  it("computes today in a given time zone", () => {
    const instant = new Date("2025-10-13T23:30:00Z");
    expect(todayIn("UTC", instant)).toBe("2025-10-13");
    expect(todayIn("Asia/Kolkata", instant)).toBe("2025-10-14");
    expect(todayIn("America/Los_Angeles", instant)).toBe("2025-10-13");
  });
});
