import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { count } from "drizzle-orm";
import * as schema from "./schema";
import type { Curriculum } from "../../scripts/lib/legacy";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

// Initial load only. Refuses to run on a non-empty curriculum so it can never overwrite admin edits.
export async function seedCurriculum(
  db: Db,
  c: Curriculum,
): Promise<{ weeks: number; days: number; items: number; questions: number }> {
  const [{ n }] = await db.select({ n: count() }).from(schema.weeks);
  if (n > 0) throw new Error("Curriculum is not empty; refusing to seed.");

  return db.transaction(async (tx) => {
    const phaseRows = await tx.insert(schema.phases).values(c.phases).returning();
    const phaseId = new Map(phaseRows.map((p) => [p.slug, p.id]));
    let days = 0,
      items = 0,
      questions = 0;

    for (const w of c.weeks) {
      const [week] = await tx
        .insert(schema.weeks)
        .values({
          number: w.number,
          phaseId: phaseId.get(w.phase)!,
          title: w.title,
          summary: w.summary,
          project: w.project,
        })
        .returning();
      const dayRows = await tx
        .insert(schema.days)
        .values(
          w.days.map((d) => ({
            weekId: week.id,
            numberInWeek: d.numberInWeek,
            globalIndex: d.globalIndex,
            title: d.title,
            why: d.why,
            ship: d.ship,
            dsaTitle: d.dsaTitle,
            sweTitle: d.sweTitle,
          })),
        )
        .returning();
      days += dayRows.length;
      for (const row of dayRows) {
        const d = w.days.find((x) => x.globalIndex === row.globalIndex)!;
        await tx.insert(schema.items).values(d.items.map((it) => ({ ...it, dayId: row.id })));
        await tx
          .insert(schema.questions)
          .values(d.questions.map((body, position) => ({ dayId: row.id, position, body })));
        items += d.items.length;
        questions += d.questions.length;
      }
    }
    return { weeks: c.weeks.length, days, items, questions };
  });
}
