"use client";
import { useMemo } from "react";
import { useGuestState } from "./guest-store";
import { usePlan, useToday } from "./plan-store";
import { behindBy, firstUnfinished, scheduleDates, type Plan } from "./schedule";

/** Everything the UI needs about the user's schedule, derived from the plan and progress. */
export function useSchedule(dayIds: string[]) {
  const plan = usePlan();
  const today = useToday();
  const guest = useGuestState();
  return useMemo(() => {
    const dates = plan ? scheduleDates(plan, dayIds.length) : null;
    const isDone = (i: number) => !!guest.done[dayIds[i]];
    const doneCount = dayIds.filter((id) => guest.done[id]).length;
    const first = firstUnfinished(dayIds.length, isDone);
    const behind = dates && today ? behindBy(dates, today, isDone) : 0;
    return { plan: plan as Plan | null, dates, today, doneCount, firstUnfinished: first, behind, isDone };
  }, [plan, today, guest.done, dayIds]);
}
