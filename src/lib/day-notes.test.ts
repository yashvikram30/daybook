import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import curriculum from "@/data/curriculum.json";
import { dedupeRefs, parseNotes } from "./day-notes";

const STEPS = ["learn", "build", "dsa", "engineering", "check"] as const;
const dir = path.resolve(process.cwd(), "data/notes");
const ids = curriculum.weeks.flatMap((w) => w.days.map((d) => d.id));

describe("day notes", () => {
  it("parses sections and splits off the further reading", () => {
    const n = parseNotes("@@ learn\nBody\n\n# Further reading\n- [a](https://x.dev)\n@@ check\nAnswer");
    expect(n.learn).toEqual({ body: "Body", refs: "- [a](https://x.dev)" });
    expect(n.check).toEqual({ body: "Answer", refs: "" });
  });

  it("drops reading-list links already shown as items, and repeats", () => {
    const refs =
      "- [a](https://x.dev/a)\n- [b](https://www.y.dev/b/#top)\n- [a again](https://x.dev/a)\n- [c](https://z.dev)";
    expect(dedupeRefs(refs, ["https://y.dev/b"])).toBe("- [a](https://x.dev/a)\n- [c](https://z.dev)");
    expect(dedupeRefs("- [a](https://x.dev/a)", ["https://x.dev/a"])).toBe("");
  });

  it("has a model answer for every check question, in order", () => {
    for (const w of curriculum.weeks)
      for (const d of w.days) {
        const n = parseNotes(fs.readFileSync(path.join(dir, d.id + ".md"), "utf8"));
        const answers = (n.check?.body.match(/^\d+\.\s/gm) ?? []).length;
        expect(answers, `${d.id} answers`).toBe(d.questions.length);
      }
  });

  const written = ids.filter((id) => fs.existsSync(path.join(dir, id + ".md")));
  it.each(written)("%s has every page, and links on every page but check", (id) => {
    const n = parseNotes(fs.readFileSync(path.join(dir, id + ".md"), "utf8"));
    for (const s of STEPS) {
      expect(n[s]?.body.length ?? 0, `${id} ${s} body`).toBeGreaterThan(40);
      if (s !== "check") expect(n[s]?.refs, `${id} ${s} links`).toMatch(/\]\(https:\/\/[^)\s]+\)/);
    }
  });
});
