import type { LinkTarget } from "./markdown";
import { titleOf, type Note } from "./brain-store";

export type DayRef = { id: string; week: number; day: number; title: string; href: string };

/**
 * Resolve the text inside [[double brackets]]. A note title wins, then a day (by title, id like w3d2,
 * or "Day 12"), then "Week 5". Anything else points at a new note with that title.
 */
export function makeResolver(notes: Note[], days: DayRef[]) {
  const byNote = new Map<string, Note>();
  for (const n of notes) {
    const t = titleOf(n).toLowerCase();
    if (!byNote.has(t)) byNote.set(t, n);
  }
  const byDay = new Map<string, DayRef>();
  days.forEach((d, i) => {
    byDay.set(d.title.toLowerCase(), d);
    byDay.set(d.id, d);
    byDay.set(`day ${i + 1}`, d);
  });
  return (target: string): LinkTarget => {
    const t = target.trim().toLowerCase();
    const note = byNote.get(t);
    if (note) return { href: `/notes?n=${note.id}`, kind: "note" };
    const day = byDay.get(t);
    if (day) return { href: day.href, kind: "day" };
    const wk = /^week\s+(\d+)$/.exec(t);
    if (wk && days.some((d) => d.week === Number(wk[1]))) return { href: `/week/${wk[1]}`, kind: "day" };
    return { href: `/notes?new=1&title=${encodeURIComponent(target.trim())}`, kind: "missing" };
  };
}

export type Backlinks = { notes: Note[]; days: DayRef[] };

/** Notes whose [[links]] point at this note's title. */
export function backlinksTo(note: Note, all: Note[], linksOf: (body: string) => string[]): Note[] {
  const t = titleOf(note).toLowerCase();
  return all.filter((n) => n.id !== note.id && linksOf(n.body).includes(t));
}
