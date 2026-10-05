// Pure scheduling logic. Dates are "YYYY-MM-DD" strings and all arithmetic is done in UTC,
// so daylight-saving changes and the machine's time zone can never shift a calendar date.
// See docs/design.md section 7.

export type Anchor = { index: number; date: string };
export type Plan = {
  startDate: string;
  /** Weekdays the user studies on, 0 = Sunday ... 6 = Saturday. */
  studyDays: number[];
  /** Extra anchors created by catch-up. The initial plan has none (day 0 is implicitly at startDate). */
  anchors: Anchor[];
};

export const DEFAULT_STUDY_DAYS = [1, 2, 3, 4];
export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MS_DAY = 86_400_000;

const toMs = (iso: string) => Date.parse(iso + "T00:00:00Z");
const fromMs = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function isISODate(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && fromMs(toMs(s)) === s;
}

export function addDays(iso: string, n: number): string {
  return fromMs(toMs(iso) + n * MS_DAY);
}

export function weekdayOf(iso: string): number {
  return new Date(toMs(iso)).getUTCDay();
}

export function diffDays(a: string, b: string): number {
  return Math.round((toMs(a) - toMs(b)) / MS_DAY);
}

export function normalizeStudyDays(days: number[]): number[] {
  const set = [...new Set(days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort((a, b) => a - b);
  return set.length ? set : DEFAULT_STUDY_DAYS;
}

export function newPlan(startDate: string, studyDays: number[] = DEFAULT_STUDY_DAYS): Plan {
  return { startDate, studyDays: normalizeStudyDays(studyDays), anchors: [] };
}

function allAnchors(plan: Plan): Anchor[] {
  return [{ index: 0, date: plan.startDate }, ...plan.anchors].sort((a, b) => a.index - b.index);
}

function firstStudyDateOnOrAfter(date: string, study: Set<number>): string {
  let d = date;
  while (!study.has(weekdayOf(d))) d = addDays(d, 1);
  return d;
}

/** Calendar date on which day `index` (0-based) is scheduled. */
export function dateForDay(plan: Plan, index: number): string {
  const study = new Set(normalizeStudyDays(plan.studyDays));
  const anchors = allAnchors(plan);
  let anchor = anchors[0];
  for (const a of anchors) if (a.index <= index) anchor = a;
  let date = firstStudyDateOnOrAfter(anchor.date, study);
  for (let n = index - anchor.index; n > 0; n--) date = firstStudyDateOnOrAfter(addDays(date, 1), study);
  return date;
}

export function scheduleDates(plan: Plan, total: number): string[] {
  return Array.from({ length: total }, (_, i) => dateForDay(plan, i));
}

/** Index of the day scheduled on `date`, or null on a rest day or outside the plan. */
export function dayOnDate(dates: string[], date: string): number | null {
  const i = dates.indexOf(date);
  return i === -1 ? null : i;
}

export type Placement = "done" | "today" | "overdue" | "upcoming";

export function placement(date: string, today: string, done: boolean): Placement {
  if (done) return "done";
  if (date === today) return "today";
  return date < today ? "overdue" : "upcoming";
}

/** Lowest-indexed day that is not complete, or null when all are done. */
export function firstUnfinished(total: number, isDone: (index: number) => boolean): number | null {
  for (let i = 0; i < total; i++) if (!isDone(i)) return i;
  return null;
}

/** Number of unfinished days whose scheduled date is before `today`. */
export function behindBy(dates: string[], today: string, isDone: (index: number) => boolean): number {
  let n = 0;
  for (let i = 0; i < dates.length; i++) if (dates[i] < today && !isDone(i)) n++;
  return n;
}

/**
 * Catch-up: the first unfinished day moves to the next study day on or after `today`, later days follow.
 * Earlier dates are untouched. Anchors at or after that day are replaced.
 */
export function reschedule(plan: Plan, firstUnfinishedIndex: number, today: string): Plan {
  if (firstUnfinishedIndex <= 0) return { ...plan, startDate: today, anchors: [] };
  const kept = plan.anchors.filter((a) => a.index < firstUnfinishedIndex);
  return { ...plan, anchors: [...kept, { index: firstUnfinishedIndex, date: today }] };
}

export function changeStudyDays(plan: Plan, studyDays: number[]): Plan {
  return { ...plan, studyDays: normalizeStudyDays(studyDays) };
}

export function formatDate(iso: string, opts: { year?: boolean } = {}): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(opts.year ? { year: "numeric" } : {}),
    timeZone: "UTC",
  })
    .format(new Date(toMs(iso)))
    .replace(",", "");
}

/** Today's calendar date in an IANA time zone (the browser's, when omitted). */
export function todayIn(timeZone?: string, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  }).format(now);
  return parts; // en-CA formats as YYYY-MM-DD
}
