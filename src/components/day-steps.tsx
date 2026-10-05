"use client";
import Link from "next/link";
import { checkedCount, useGuestState } from "@/lib/guest-store";
import { STEPS, stepHref, type StepSlug } from "@/lib/day-steps";
import { formatDate, placement } from "@/lib/schedule";
import { useSchedule } from "@/lib/use-schedule";

export type StepInfo = { slug: StepSlug; keys: string[]; preview: string };

function progress(info: StepInfo, guest: ReturnType<typeof useGuestState>, dayId: string) {
  if (info.slug === "check") return { done: guest.done[dayId] ? 1 : 0, total: 1 };
  return { done: info.keys.filter((k) => guest.items[k]).length, total: info.keys.length };
}

/** The day's overview: five pages, each with a plain line of what is in it and how far you are. */
export function StepList({
  week,
  day,
  dayId,
  steps,
}: {
  week: number;
  day: number;
  dayId: string;
  steps: StepInfo[];
}) {
  const guest = useGuestState();
  const rows = steps.map((s) => ({
    s,
    meta: STEPS.find((x) => x.slug === s.slug)!,
    p: progress(s, guest, dayId),
  }));
  const next = rows.find((r) => r.p.total > 0 && r.p.done < r.p.total);
  const started = rows.some((r) => r.p.done > 0);
  return (
    <>
      <ol className="steplist">
        {rows.map(({ s, meta, p }) => {
          const full = p.total > 0 && p.done === p.total;
          return (
            <li key={s.slug}>
              <Link href={stepHref(week, day, s.slug)} className={full ? "full" : undefined}>
                <span className="step-mark" aria-hidden="true">
                  {full ? "✓" : ""}
                </span>
                <span className="step-body">
                  <b>{meta.label}</b>
                  <span>{s.preview}</span>
                </span>
                <span className="step-side">
                  <small>{meta.minutes} min</small>
                  {s.slug !== "check" && p.total > 0 && (
                    <em>
                      {p.done} of {p.total}
                    </em>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      {next && (
        <Link className="btn primary big" href={stepHref(week, day, next.s.slug)}>
          {started ? `Continue with ${next.meta.label}` : "Start with Learn"}
        </Link>
      )}
    </>
  );
}

/** A slim row of the day's pages, so you can jump between them. */
export function StepNav({
  week,
  day,
  dayId,
  steps,
  current,
}: {
  week: number;
  day: number;
  dayId: string;
  steps: StepInfo[];
  current: StepSlug;
}) {
  const guest = useGuestState();
  return (
    <nav className="stepnav" aria-label="Pages in this day">
      {steps.map((s) => {
        const meta = STEPS.find((x) => x.slug === s.slug)!;
        const p = progress(s, guest, dayId);
        const full = p.total > 0 && p.done === p.total;
        return (
          <Link
            key={s.slug}
            href={stepHref(week, day, s.slug)}
            className={(s.slug === current ? "on " : "") + (full ? "full" : "")}
            aria-current={s.slug === current ? "page" : undefined}
          >
            {meta.label}
            {full && <span aria-label="done"> ✓</span>}
          </Link>
        );
      })}
    </nav>
  );
}

/** Quiet one-line status for the day header. */
export function DayStatus({ dayId }: { dayId: string }) {
  const guest = useGuestState();
  if (guest.done[dayId]) return <span className="ok-text"> · Done</span>;
  const n = checkedCount(guest, dayId);
  return n > 0 ? <span> · In progress</span> : null;
}

/** The planned date for a day, as plain text. Renders nothing until you have picked a start date. */
export function DayWhen({ dayIds, index }: { dayIds: string[]; index: number }) {
  const { dates, today, isDone } = useSchedule(dayIds);
  if (!dates || !today) return null;
  const p = placement(dates[index], today, isDone(index));
  return (
    <span className={p === "overdue" ? "late-text" : p === "today" ? "today-text" : undefined}>
      {" · "}
      {formatDate(dates[index])}
      {p === "today" ? ", today" : p === "overdue" ? ", overdue" : ""}
    </span>
  );
}
