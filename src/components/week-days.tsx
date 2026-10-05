"use client";
import Link from "next/link";
import { dayStatus, useGuestState } from "@/lib/guest-store";

type D = { id: string; week: number; day: number; title: string; why: string };

export function WeekDayList({ days }: { days: D[] }) {
  const guest = useGuestState();
  return (
    <ul className="daylist">
      {days.map((d) => {
        const s = dayStatus(guest, d.id);
        return (
          <li key={d.id}>
            <Link href={`/day/${d.week}/${d.day}`}>
              <span
                className={"dot " + (s === "todo" ? "" : s)}
                role="img"
                aria-label={s === "done" ? "Done" : s === "started" ? "In progress" : "Not started"}
              />
              <span>
                <span className="dtt">
                  Day {d.day}: {d.title}
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
