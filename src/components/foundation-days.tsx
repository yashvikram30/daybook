"use client";
import Link from "next/link";
import { dayStatus, useGuestState } from "@/lib/guest-store";

type D = { id: string; href: string; n: number; title: string; why: string };

/** The days of one foundations week, with the same progress dots as the main plan. */
export function FoundationDayList({ days }: { days: D[] }) {
  const guest = useGuestState();
  return (
    <ul className="daylist">
      {days.map((d) => {
        const s = dayStatus(guest, d.id);
        return (
          <li key={d.id}>
            <Link href={d.href}>
              <span
                className={"dot " + (s === "todo" ? "" : s)}
                role="img"
                aria-label={s === "done" ? "Done" : s === "started" ? "In progress" : "Not started"}
              />
              <span>
                <span className="dtt">
                  Day {d.n}: {d.title}
                </span>
                <span className="dd">{d.why}</span>
              </span>
              <span className="st">{s === "done" ? "Done" : s === "started" ? "In progress" : ""}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** "3 of 16 days done" for the whole pre-course. */
export function FoundationProgress({ ids }: { ids: string[] }) {
  const guest = useGuestState();
  const done = ids.filter((id) => guest.done[id]).length;
  return (
    <div className="complete-bar">
      <div className="cb-progress">
        <span aria-live="polite">
          {done} of {ids.length} foundation days complete
        </span>
        <div className="bar" aria-hidden="true">
          <span style={{ width: `${(done / ids.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
