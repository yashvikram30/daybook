import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/data/revision";
import { QUESTION_TYPES, SECTIONS } from "@/data/revision/meta";
import type { Question } from "@/data/revision/types";
import {
  grade,
  interleave,
  matching,
  normalizeText,
  pickQuestions,
  prepare,
  type Config,
} from "./revise-engine";

/** A small deterministic random source so tests do not flake. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const all = (weeks: number[], size = 0): Config => ({
  weeks,
  secs: [...SECTIONS],
  types: [...QUESTION_TYPES],
  size,
});

const byType = <T extends Question["t"]>(t: T) =>
  QUESTIONS.find((q) => q.t === t) as Extract<Question, { t: T }>;

describe("pickQuestions", () => {
  it("shares a session evenly across the chosen weeks", () => {
    const picked = pickQuestions(QUESTIONS, all([2, 5, 9, 14], 20), {}, seeded(1));
    expect(picked).toHaveLength(20);
    const counts = [2, 5, 9, 14].map((w) => picked.filter((q) => q.week === w).length);
    expect(counts).toEqual([5, 5, 5, 5]);
  });

  it("only returns questions from the chosen weeks, sections and kinds", () => {
    const cfg: Config = { weeks: [3, 4], secs: ["dsa"], types: ["mcq", "blank"], size: 0 };
    const picked = pickQuestions(QUESTIONS, cfg, {}, seeded(2));
    expect(picked.length).toBeGreaterThan(0);
    for (const q of picked) {
      expect([3, 4]).toContain(q.week);
      expect(q.sec).toBe("dsa");
      expect(["mcq", "blank"]).toContain(q.t);
    }
  });

  it("never repeats a question and caps at what exists", () => {
    const cfg = all([1], 500);
    const picked = pickQuestions(QUESTIONS, cfg, {}, seeded(3));
    expect(new Set(picked.map((q) => q.id)).size).toBe(picked.length);
    expect(picked).toHaveLength(matching(QUESTIONS, cfg).length);
  });

  it("mixes question types inside one week", () => {
    const picked = pickQuestions(QUESTIONS, all([7], 12), {}, seeded(4));
    expect(new Set(picked.map((q) => q.t)).size).toBeGreaterThanOrEqual(4);
  });

  it("prefers unseen and missed questions over ones recently got right", () => {
    const pool = matching(QUESTIONS, all([6]));
    const stats = Object.fromEntries(pool.map((q, i) => [q.id, { seen: 2, miss: 0, lastOk: i % 2 === 0 }]));
    const picked = pickQuestions(QUESTIONS, all([6], 10), stats, seeded(5));
    const missed = picked.filter((q) => !stats[q.id].lastOk).length;
    expect(missed).toBeGreaterThanOrEqual(8);
  });

  it("returns nothing when the filters match nothing", () => {
    expect(pickQuestions(QUESTIONS, { ...all([1]), types: [] })).toEqual([]);
  });

  it("avoids back-to-back repeats of a type when it can", () => {
    const ordered = interleave(matching(QUESTIONS, all([1, 2, 3])), seeded(6));
    let repeats = 0;
    for (let i = 1; i < ordered.length; i++) if (ordered[i].t === ordered[i - 1].t) repeats++;
    expect(repeats).toBeLessThan(ordered.length * 0.15);
  });
});

describe("prepare", () => {
  it("never starts an ordering question already solved", () => {
    const q = byType("order");
    for (let s = 1; s < 50; s++) {
      const p = prepare(q, seeded(s));
      expect(p.shown.every((v, i) => v === i)).toBe(false);
      expect([...p.shown].sort()).toEqual(q.items.map((_, i) => i));
    }
  });
});

describe("grade", () => {
  it("marks multiple choice by the original option index", () => {
    const q = byType("mcq");
    expect(grade(q, { t: "mcq", pick: q.answer }).ok).toBe(true);
    expect(grade(q, { t: "mcq", pick: (q.answer + 1) % q.options.length }).ok).toBe(false);
  });

  it("needs exactly the right set for select-all", () => {
    const q = byType("multi");
    expect(grade(q, { t: "multi", picks: [...q.answers].reverse() }).ok).toBe(true);
    expect(grade(q, { t: "multi", picks: q.answers.slice(1) }).ok).toBe(false);
    expect(grade(q, { t: "multi", picks: [...q.answers, 99] }).ok).toBe(false);
  });

  it("accepts any listed alternative for a blank, ignoring case, spaces and quotes", () => {
    const q = { ...byType("blank"), answers: [["-N -l", "-l -N"], ["O(n log n)"]] };
    expect(grade(q, { t: "blank", texts: ["-n-L", " `o(n LOG n)`. "] })).toEqual({
      ok: true,
      parts: [true, true],
    });
    expect(grade(q, { t: "blank", texts: ["-l -N", "n"] })).toEqual({ ok: false, parts: [true, false] });
    expect(grade(q, { t: "blank", texts: ["", ""] }).ok).toBe(false);
  });

  it("grades ordering and matching per position", () => {
    const o = byType("order");
    const right = o.items.map((_, i) => i);
    expect(grade(o, { t: "order", seq: right }).ok).toBe(true);
    const swapped = [...right];
    [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
    expect(grade(o, { t: "order", seq: swapped }).parts?.slice(0, 2)).toEqual([false, false]);

    const m = byType("match");
    expect(grade(m, { t: "match", picks: m.pairs.map((_, i) => i) }).ok).toBe(true);
    expect(grade(m, { t: "match", picks: m.pairs.map(() => 0) }).ok).toBe(false);
  });

  it("trusts a flashcard self-grade", () => {
    const q = byType("card");
    expect(grade(q, { t: "card", knew: true }).ok).toBe(true);
    expect(grade(q, { t: "card", knew: false }).ok).toBe(false);
  });
});

describe("normalizeText", () => {
  it("ignores case, whitespace, quotes and a trailing period", () => {
    expect(normalizeText(' "Wrap Around". ')).toBe("wraparound");
  });
});
