import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import curriculum from "@/data/curriculum.json";
import { parseNotes } from "./day-notes";

const STEPS = ["learn", "build", "dsa", "engineering", "check"] as const;
const dir = path.resolve(process.cwd(), "data/notes");
const ids = curriculum.weeks.flatMap((w) => w.days.map((d) => d.id));

describe("day notes", () => {
  it("parses sections and splits off the further reading", () => {
    const n = parseNotes("@@ learn\nBody\n\n# Further reading\n- [a](https://x.dev)\n@@ check\nAnswer");
    expect(n.learn).toEqual({ body: "Body", refs: "- [a](https://x.dev)" });
    expect(n.check).toEqual({ body: "Answer", refs: "" });
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
