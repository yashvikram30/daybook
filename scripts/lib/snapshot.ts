import { dayId, type Curriculum } from "../../src/lib/curriculum-types";
import { loadLegacyCurriculum } from "./legacy";

/** The curriculum in the shape the app renders. src/data/curriculum.json is generated from this. */
export function buildSnapshot(dir?: string): Curriculum {
  const c = loadLegacyCurriculum(dir);
  return {
    phases: c.phases.map((p) => ({ slug: p.slug, name: p.name, language: p.language })),
    weeks: c.weeks.map((w) => ({
      number: w.number,
      phase: w.phase,
      title: w.title,
      summary: w.summary,
      project: w.project,
      days: w.days.map((d) => ({
        id: dayId(w.number, d.numberInWeek),
        weekNumber: w.number,
        numberInWeek: d.numberInWeek,
        globalIndex: d.globalIndex,
        title: d.title,
        why: d.why,
        ship: d.ship,
        dsaTitle: d.dsaTitle,
        sweTitle: d.sweTitle,
        items: d.items,
        questions: d.questions,
      })),
    })),
  };
}
