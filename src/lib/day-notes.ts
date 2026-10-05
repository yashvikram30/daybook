import fs from "node:fs";
import path from "node:path";
import type { StepSlug } from "./day-steps";

export type StepNotes = { body: string; refs: string };

const REFS = /^#\s+Further reading\s*$/m;

/** Parse one day's notes file: sections start with a line `@@ <step>`, and each may end with `# Further reading`. */
export function parseNotes(src: string): Partial<Record<StepSlug, StepNotes>> {
  const out: Partial<Record<StepSlug, StepNotes>> = {};
  for (const part of src.split(/^@@ /m).slice(1)) {
    const nl = part.indexOf("\n");
    const slug = part.slice(0, nl).trim() as StepSlug;
    const text = part.slice(nl + 1).trim();
    const m = REFS.exec(text);
    out[slug] = m
      ? { body: text.slice(0, m.index).trim(), refs: text.slice(m.index + m[0].length).trim() }
      : { body: text, refs: "" };
  }
  return out;
}

/** Summaries live in data/notes/<dayId>.md (e.g. w3d2.md). Read at build time by the static day pages. */
export function getNotes(dayId: string, dir = path.resolve(process.cwd(), "data/notes")) {
  const file = path.join(dir, dayId + ".md");
  return fs.existsSync(file) ? parseNotes(fs.readFileSync(file, "utf8")) : {};
}

const normUrl = (u: string) =>
  u
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/[#?].*$/, "")
    .replace(/\/$/, "");

/** Drop reading-list lines whose link already appears as a tick item on the same page, so nothing is listed twice. */
export function dedupeRefs(refs: string, urls: string[]): string {
  const seen = new Set(urls.map(normUrl));
  return refs
    .split("\n")
    .filter((line) => {
      const m = /\]\((https?:[^)\s]+)\)/.exec(line);
      if (!m) return true;
      const u = normUrl(m[1]);
      if (seen.has(u)) return false;
      seen.add(u);
      return true;
    })
    .join("\n")
    .trim();
}
