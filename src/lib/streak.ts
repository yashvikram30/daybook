import { addDays, normalizeStudyDays, weekdayOf } from "./schedule";

/**
 * Current streak: how many days with activity are in the unbroken run ending today.
 * Rest days (weekdays outside the user's study days) never break it. A study day with no activity does,
 * except today, which stays open until the day is over.
 */
export function currentStreak(activity: Record<string, number>, studyDays: number[], today: string): number {
  const study = new Set(normalizeStudyDays(studyDays));
  let d = activity[today] ? today : addDays(today, -1);
  let count = 0;
  for (let i = 0; i < 400; i++) {
    if (activity[d] > 0) count++;
    else if (study.has(weekdayOf(d))) break;
    d = addDays(d, -1);
  }
  return count;
}

export function bestStreak(activity: Record<string, number>, studyDays: number[]): number {
  const dates = Object.keys(activity)
    .filter((k) => activity[k] > 0)
    .sort();
  if (!dates.length) return 0;
  let best = 0;
  for (const end of dates) best = Math.max(best, currentStreak(activity, studyDays, end));
  return best;
}
