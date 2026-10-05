"use client";
import { useState } from "react";
import { savePlan } from "@/lib/plan-store";
import { dateForDay, formatDate, reschedule } from "@/lib/schedule";
import { useSchedule } from "@/lib/use-schedule";

const SNOOZE_KEY = "csplan.snooze";

// Only called once a plan exists, which is client-only, so Date.now() never runs during prerender.
function snoozed(): boolean {
  try {
    return Date.now() < Number(localStorage.getItem(SNOOZE_KEY) ?? 0);
  } catch {
    return false;
  }
}

/** Shown when scheduled days have passed unfinished. Offers a catch-up with the new dates previewed first. */
export function BehindBanner({ dayIds }: { dayIds: string[] }) {
  const { plan, dates, today, behind, firstUnfinished } = useSchedule(dayIds);
  const [dismissed, setDismissed] = useState(false);
  if (!plan || !dates || !today || behind === 0 || firstUnfinished === null || dismissed || snoozed())
    return null;

  const next = reschedule(plan, firstUnfinished, today);
  const last = dayIds.length - 1;
  return (
    <div className="banner" role="status">
      <p style={{ margin: "0 0 8px" }}>
        <b>
          You are {behind} study {behind === 1 ? "day" : "days"} behind.
        </b>{" "}
        Reschedule from today: day {firstUnfinished + 1} moves from {formatDate(dates[firstUnfinished])} to{" "}
        {formatDate(dateForDay(next, firstUnfinished))}, and the plan ends{" "}
        {formatDate(dateForDay(next, last), { year: true })} instead of{" "}
        {formatDate(dates[last], { year: true })}.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn primary" type="button" onClick={() => savePlan(next)}>
          Reschedule from today
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => {
            try {
              localStorage.setItem(SNOOZE_KEY, String(Date.now() + 24 * 3600 * 1000));
            } catch {}
            setDismissed(true);
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
