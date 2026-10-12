import { summarize, type Summary } from "./analytics";
import { visits } from "./mongo";

/** Hard stop so a very busy quarter cannot pull the whole collection into memory. */
export const MAX_ROWS = 100_000;

export type Report = { summary: Summary; returning: number; truncated: boolean; now: number };

/** The dashboard's numbers for the last `ms` milliseconds, leaving out the owner's own visits. */
export async function loadReport(ms: number): Promise<Report> {
  const now = Date.now();
  const since = now - ms;
  const col = await visits();
  const rows = await col
    .find({ ts: { $gte: new Date(since) }, owner: { $ne: true } }, { projection: { _id: 0 } })
    .sort({ ts: -1 })
    .limit(MAX_ROWS)
    .toArray();
  const ids = [...new Set(rows.map((r) => r.vid))];
  // Visitors seen in the range who had already been here before it began.
  const returning = ids.length
    ? (await col.distinct("vid", { vid: { $in: ids }, ts: { $lt: new Date(since) } })).length
    : 0;
  return { summary: summarize(rows, since, now), returning, truncated: rows.length >= MAX_ROWS, now };
}
