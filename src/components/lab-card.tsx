"use client";
import Link from "next/link";
import { labKey } from "@/data/labs";
import { monthKey } from "@/data/months";
import { useGuestState } from "@/lib/guest-store";

/** The optional fifth day of a week, shown on the week page. */
export function LabCard({ week, focus, count }: { week: number; focus: string; count: number }) {
  const guest = useGuestState();
  const done = Array.from({ length: count }, (_, i) => guest.items[labKey(week, i)]).filter(Boolean).length;
  return (
    <Link className="lab-card" href={`/week/${week}/lab`}>
      <span className="lab-badge">Optional day 5</span>
      <b>Revision lab</b>
      <span>{focus}</span>
      <small>
        {done > 0
          ? `${done} of ${count} exercises done`
          : `${count} hands-on exercises, a review round and problems to revisit`}
      </small>
    </Link>
  );
}

/** The optional review at the end of every fourth week. */
export function MonthCard({ month, focus, count }: { month: number; focus: string; count: number }) {
  const guest = useGuestState();
  const done = Array.from({ length: count }, (_, i) => guest.items[monthKey(month, i)]).filter(
    Boolean,
  ).length;
  return (
    <Link className="lab-card month" href={`/month/${month}`}>
      <span className="lab-badge">Optional month review</span>
      <b>Month {month} review</b>
      <span>{focus}</span>
      <small>
        {done > 0
          ? `${done} of ${count} exercises done`
          : month > 1
            ? `A longer review round and ${count} exercises, reaching back into earlier months`
            : `A longer review round and ${count} exercises that join the month together`}
      </small>
    </Link>
  );
}
