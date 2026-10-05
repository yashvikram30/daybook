"use client";
import Link from "next/link";
import { savePlan } from "@/lib/plan-store";
import { formatDate, placement, reschedule, type Placement } from "@/lib/schedule";
import type { PlanDay } from "@/lib/plan-days";
import { useSchedule } from "@/lib/use-schedule";
import { useGuestState, dayStatus } from "@/lib/guest-store";
import { BehindBanner } from "./behind-banner";
import { useHydrated } from "@/lib/plan-store";

const LABEL: Record<Placement | "started", string> = {
  done: "Done",
  today: "Today",
  overdue: "Overdue",
  upcoming: "Upcoming",
  started: "In progress",
};

export function ScheduleTable({ days }: { days: PlanDay[] }) {
  const hydrated = useHydrated();
  const ids = days.map((d) => d.id);
  const { plan, dates, today, firstUnfinished } = useSchedule(ids);
  const guest = useGuestState();

  if (!hydrated) return null;
  if (!plan || !dates || !today) {
    return (
      <div className="empty">
        <p>You have not picked a start date yet.</p>
        <Link className="btn primary" href="/start">
          Pick your start date
        </Link>
      </div>
    );
  }
  return (
    <>
      <BehindBanner dayIds={ids} />
      <p style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link className="btn" href="/start">
          Change start date and study days
        </Link>
        {firstUnfinished !== null && firstUnfinished > 0 && (
          <button
            className="btn"
            type="button"
            onClick={() => savePlan(reschedule(plan, firstUnfinished, today))}
          >
            Reschedule from today
          </button>
        )}
      </p>
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th scope="col" className="num">
                Day
              </th>
              <th scope="col">Date</th>
              <th scope="col">Topic</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => {
              const done = !!guest.done[d.id];
              const p = placement(dates[i], today, done);
              const label =
                p === "upcoming" && dayStatus(guest, d.id) === "started" ? LABEL.started : LABEL[p];
              return (
                <tr key={d.id} className={p === "today" ? "is-today" : undefined}>
                  <td className="num">{i + 1}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{formatDate(dates[i])}</td>
                  <td>
                    <Link href={`/day/${d.week}/${d.day}`}>{d.title}</Link>
                  </td>
                  <td>{label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
