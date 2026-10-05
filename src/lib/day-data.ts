import { getCurriculum } from "./curriculum";
import { allDays, itemsOf, type Day } from "./curriculum-types";
import type { StepInfo } from "@/components/day-steps";
import { STEPS, type StepSlug } from "./day-steps";

export async function findDay(n: string, d: string) {
  const c = await getCurriculum();
  const week = c.weeks.find((w) => String(w.number) === n);
  const day = week?.days.find((x) => String(x.numberInWeek) === d);
  if (!week || !day) return null;
  const phase = c.phases.find((p) => p.slug === week.phase)!;
  const flat = allDays(c);
  const i = flat.findIndex((x) => x.id === day.id);
  return {
    week,
    day,
    phase,
    prev: flat[i - 1] ?? null,
    next: flat[i + 1] ?? null,
    total: flat.length,
    ids: flat.map((x) => x.id),
  };
}

/** The items that belong on each page of a day. */
export function itemsFor(day: Day, step: StepSlug) {
  switch (step) {
    case "learn":
      return itemsOf(day, "learn");
    case "build":
      return itemsOf(day, "build");
    case "dsa":
      return [...itemsOf(day, "dsa_learn"), ...itemsOf(day, "dsa_problem")];
    case "engineering":
      return itemsOf(day, "swe");
    case "check":
      return [];
  }
}

const clip = (s: string, n = 90) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

export function stepInfo(day: Day): StepInfo[] {
  return STEPS.map(({ slug }) => {
    const items = itemsFor(day, slug);
    const more = items.length - 1;
    const preview =
      slug === "learn"
        ? `${items[0].title}${more > 0 ? ` and ${more} more` : ""}`
        : slug === "build"
          ? clip(items[0].title)
          : slug === "dsa"
            ? day.dsaTitle
            : slug === "engineering"
              ? day.sweTitle
              : `${day.questions.length} questions, then a few lines in your own words`;
    return { slug, keys: items.map((i) => i.key), preview };
  });
}
