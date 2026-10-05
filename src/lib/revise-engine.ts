import { blankCount, type QType, type Question, type Sec } from "@/data/revision/types";

export type Rng = () => number;

export type Config = {
  weeks: number[];
  secs: Sec[];
  types: QType[];
  /** How many questions; 0 means every matching question. */
  size: number;
};

/** What the learner's history says about one question. */
export type Stat = { seen: number; miss: number; lastOk: boolean };
export type Stats = Record<string, Stat>;

export function shuffle<T>(a: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function matching(bank: readonly Question[], cfg: Config): Question[] {
  const weeks = new Set(cfg.weeks);
  const secs = new Set(cfg.secs);
  const types = new Set(cfg.types);
  return bank.filter((q) => weeks.has(q.week) && secs.has(q.sec) && types.has(q.t));
}

/** Questions never seen, then ones last missed, are favoured; ones recently got right wait their turn. */
function weight(s: Stat | undefined, rng: Rng): number {
  if (!s) return rng() + 0.6;
  return rng() + (s.lastOk ? -0.4 : 0.9);
}

/**
 * Choose a session. Each selected week gets an equal share (round-robin), and inside a week the picks are
 * spread over question types and sections. Unseen and missed questions come first. The result is ordered
 * so the same type or week rarely comes twice in a row.
 */
export function pickQuestions(
  bank: readonly Question[],
  cfg: Config,
  stats: Stats = {},
  rng: Rng = Math.random,
): Question[] {
  const pool = matching(bank, cfg);
  const want = cfg.size > 0 ? Math.min(cfg.size, pool.length) : pool.length;

  const byWeek = new Map<number, Question[]>();
  for (const q of pool) byWeek.set(q.week, [...(byWeek.get(q.week) ?? []), q]);

  // For each week, an ordering that favours new/missed questions and rotates through types and sections.
  const queues = new Map<number, Question[]>();
  for (const [w, qs] of byWeek) {
    const base = new Map(qs.map((q) => [q.id, weight(stats[q.id], rng)]));
    const left = [...qs];
    const typeUsed = new Map<string, number>();
    const secUsed = new Map<string, number>();
    const ordered: Question[] = [];
    while (left.length) {
      let best = 0;
      let bestScore = -Infinity;
      left.forEach((q, i) => {
        const s = base.get(q.id)! - 0.45 * (typeUsed.get(q.t) ?? 0) - 0.2 * (secUsed.get(q.sec) ?? 0);
        if (s > bestScore) {
          bestScore = s;
          best = i;
        }
      });
      const [q] = left.splice(best, 1);
      typeUsed.set(q.t, (typeUsed.get(q.t) ?? 0) + 1);
      secUsed.set(q.sec, (secUsed.get(q.sec) ?? 0) + 1);
      ordered.push(q);
    }
    queues.set(w, ordered);
  }

  const picked: Question[] = [];
  const weeks = shuffle([...queues.keys()], rng);
  while (picked.length < want) {
    let progressed = false;
    for (const w of weeks) {
      const next = queues.get(w)!.shift();
      if (!next) continue;
      picked.push(next);
      progressed = true;
      if (picked.length >= want) break;
    }
    if (!progressed) break;
  }
  return interleave(picked, rng);
}

/** Random order, but avoid repeating the previous question's type or week when there is a choice. */
export function interleave(qs: Question[], rng: Rng = Math.random): Question[] {
  const left = shuffle(qs, rng);
  const out: Question[] = [];
  while (left.length) {
    const prev = out[out.length - 1];
    let i = prev ? left.findIndex((q) => q.t !== prev.t && q.week !== prev.week) : 0;
    if (i < 0) i = left.findIndex((q) => q.t !== prev.t);
    if (i < 0) i = 0;
    out.push(...left.splice(i, 1));
  }
  return out;
}

/** A question plus the random layout the learner sees (option order and so on). */
export type Prepared = { q: Question; shown: number[] };

export function prepare(q: Question, rng: Rng = Math.random): Prepared {
  switch (q.t) {
    case "mcq":
    case "multi":
      return {
        q,
        shown: shuffle(
          q.options.map((_, i) => i),
          rng,
        ),
      };
    case "match":
      return {
        q,
        shown: shuffle(
          q.pairs.map((_, i) => i),
          rng,
        ),
      };
    case "order": {
      const idx = q.items.map((_, i) => i);
      let s = shuffle(idx, rng);
      // Never start already solved.
      for (let tries = 0; tries < 5 && s.every((v, i) => v === i); tries++) s = shuffle(idx, rng);
      if (s.every((v, i) => v === i) && s.length > 1) s = [...s.slice(1), s[0]];
      return { q, shown: s };
    }
    default:
      return { q, shown: [] };
  }
}

export type Response =
  | { t: "mcq"; pick: number }
  | { t: "multi"; picks: number[] }
  | { t: "tf"; pick: boolean }
  | { t: "blank"; texts: string[] }
  | { t: "card"; knew: boolean }
  /** Item indexes in the order the learner arranged them. */
  | { t: "order"; seq: number[] }
  /** For each left side, the index of the pair whose right side they chose. */
  | { t: "match"; picks: number[] };

export type Result = { ok: boolean; parts?: boolean[] };

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[`'"“”‘’]/g, "")
    .replace(/\s+/g, "")
    .replace(/[.;]+$/, "");
}

export function grade(q: Question, r: Response): Result {
  switch (q.t) {
    case "mcq":
      return { ok: r.t === "mcq" && r.pick === q.answer };
    case "multi": {
      if (r.t !== "multi") return { ok: false };
      const want = new Set(q.answers);
      const got = new Set(r.picks);
      return { ok: want.size === got.size && [...want].every((i) => got.has(i)) };
    }
    case "tf":
      return { ok: r.t === "tf" && r.pick === q.answer };
    case "blank": {
      if (r.t !== "blank") return { ok: false };
      const parts = q.answers.map((alts, i) => {
        const got = normalizeText(r.texts[i] ?? "");
        return got !== "" && alts.some((a) => normalizeText(a) === got);
      });
      return { ok: parts.every(Boolean), parts };
    }
    case "card":
      return { ok: r.t === "card" && r.knew };
    case "order": {
      if (r.t !== "order") return { ok: false };
      const parts = q.items.map((_, i) => r.seq[i] === i);
      return { ok: parts.every(Boolean), parts };
    }
    case "match": {
      if (r.t !== "match") return { ok: false };
      const parts = q.pairs.map((_, i) => r.picks[i] === i);
      return { ok: parts.every(Boolean), parts };
    }
  }
}

/** The answer written out, for the "show answer" and review screens. */
export function answerText(q: Question): string {
  switch (q.t) {
    case "mcq":
      return q.options[q.answer];
    case "multi":
      return q.answers.map((i) => q.options[i]).join("; ");
    case "tf":
      return q.answer ? "True" : "False";
    case "blank":
      return q.answers.map((a) => a[0]).join(", ");
    case "card":
      return q.back;
    case "order":
      return q.items.join(" → ");
    case "match":
      return q.pairs.map(([l, r]) => `${l} → ${r}`).join("; ");
  }
}

/** Problems with a question's shape; empty when it is well formed. Used by the bank's test. */
export function problems(q: Question): string[] {
  const out: string[] = [];
  const dup = (xs: string[]) => new Set(xs).size !== xs.length;
  switch (q.t) {
    case "mcq":
      if (q.options.length < 3 || q.options.length > 6) out.push("needs 3 to 6 options");
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length)
        out.push("answer out of range");
      if (dup(q.options)) out.push("duplicate options");
      break;
    case "multi":
      if (q.options.length < 4) out.push("needs at least 4 options");
      if (q.answers.length < 2 || q.answers.length >= q.options.length)
        out.push("needs 2+ right and 1+ wrong");
      if (q.answers.some((i) => !Number.isInteger(i) || i < 0 || i >= q.options.length))
        out.push("answer out of range");
      if (new Set(q.answers).size !== q.answers.length) out.push("repeated answer index");
      if (dup(q.options)) out.push("duplicate options");
      break;
    case "blank": {
      const n = blankCount(q);
      if (n === 0) out.push("no ___ in prompt or code");
      if (n !== q.answers.length) out.push(`${n} blanks but ${q.answers.length} answers`);
      if (q.answers.some((a) => a.length === 0 || a.some((x) => x.trim() === ""))) out.push("empty answer");
      break;
    }
    case "order":
      if (q.items.length < 3 || q.items.length > 8) out.push("needs 3 to 8 items");
      if (dup(q.items)) out.push("duplicate items");
      break;
    case "match":
      if (q.pairs.length < 3 || q.pairs.length > 7) out.push("needs 3 to 7 pairs");
      if (dup(q.pairs.map((p) => p[0])) || dup(q.pairs.map((p) => p[1]))) out.push("duplicate side");
      break;
    case "card":
      if (!q.front.trim() || !q.back.trim()) out.push("empty card");
      break;
    case "tf":
      break;
  }
  return out;
}
