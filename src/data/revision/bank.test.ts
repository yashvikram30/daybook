import { describe, expect, it } from "vitest";
import curriculum from "@/data/curriculum.json";
import { problems } from "@/lib/revise-engine";
import { QUESTIONS } from "./index";
import { SECTIONS } from "./meta";

const WEEKS = curriculum.weeks.length;

describe("revision question bank", () => {
  it("is well formed", () => {
    const bad = QUESTIONS.flatMap((q) => problems(q).map((p) => `${q.id}: ${p}`));
    expect(bad).toEqual([]);
  });

  it("has unique ids", () => {
    const seen = new Set<string>();
    const dup = QUESTIONS.filter((q) => (seen.has(q.id) ? true : (seen.add(q.id), false))).map((q) => q.id);
    expect(dup).toEqual([]);
  });

  it("only uses weeks that exist", () => {
    expect([...new Set(QUESTIONS.map((q) => q.week))].filter((w) => w < 1 || w > WEEKS)).toEqual([]);
  });

  it("gives every written week every section and a variety of question types", () => {
    const weeks = [...new Set(QUESTIONS.map((q) => q.week))];
    for (const w of weeks) {
      const qs = QUESTIONS.filter((q) => q.week === w);
      for (const s of SECTIONS)
        expect(qs.filter((q) => q.sec === s).length, `week ${w} ${s}`).toBeGreaterThanOrEqual(3);
      expect(qs.length, `week ${w} size`).toBeGreaterThanOrEqual(30);
      const types = new Set(qs.map((q) => q.t));
      expect(types.size, `week ${w} types`).toBeGreaterThanOrEqual(6);
      expect(qs.filter((q) => q.code).length, `week ${w} code snippets`).toBeGreaterThanOrEqual(2);
    }
  });
});
