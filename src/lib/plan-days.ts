import type { Curriculum } from "./curriculum-types";

/** Lightweight per-day facts handed to client components that deal with the schedule. */
export type PlanDay = {
  id: string;
  week: number;
  day: number;
  title: string;
  weekTitle: string;
  why: string;
  itemCount: number;
};

export function planDays(c: Curriculum): PlanDay[] {
  return c.weeks.flatMap((w) =>
    w.days.map((d) => ({
      id: d.id,
      week: w.number,
      day: d.numberInWeek,
      title: d.title,
      weekTitle: w.title,
      why: d.why,
      itemCount: d.items.length,
    })),
  );
}
