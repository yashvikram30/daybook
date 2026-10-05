// The revision question bank. Questions are authored per week in w01-04.ts ... w13-16.ts with the small
// builders below, so a question reads as one line or a few. Everything here is plain data: the quiz engine
// (src/lib/revise-engine.ts) decides what to ask, in what order, and how to grade it.

/** Which part of a day the question comes from: the main track, the DSA hour, or the engineering slot. */
export type Sec = "core" | "dsa" | "eng";

export type QType = "mcq" | "multi" | "tf" | "blank" | "card" | "order" | "match";

export type Code = { lang: string; src: string };

type Base = {
  /** Stable across edits and reordering: week, section and a hash of the prompt. */
  id: string;
  week: number;
  sec: Sec;
  /** Shown after answering. */
  why?: string;
  code?: Code;
};

export type Question = Base &
  (
    | { t: "mcq"; q: string; options: string[]; answer: number }
    | { t: "multi"; q: string; options: string[]; answers: number[] }
    | { t: "tf"; q: string; answer: boolean }
    /** `___` marks a blank in `q` or `code`; each blank lists the accepted answers. */
    | { t: "blank"; q: string; answers: string[][] }
    | { t: "card"; front: string; back: string }
    /** `items` are in the correct order; the quiz shuffles them. */
    | { t: "order"; q: string; items: string[] }
    /** Pairs of [left, right]; the quiz shuffles the right-hand side. */
    | { t: "match"; q: string; pairs: [string, string][] }
  );

export const TYPE_LABEL: Record<QType, string> = {
  mcq: "Multiple choice",
  multi: "Select all",
  tf: "True or false",
  blank: "Fill in the blank",
  card: "Flashcard",
  order: "Put in order",
  match: "Match up",
};

export const SEC_LABEL: Record<Sec, string> = {
  core: "Main track",
  dsa: "DSA",
  eng: "Engineering",
};

/** Tagged templates for code snippets: py`...`. Trims the margin and common indentation. */
function snippet(lang: string) {
  return (strings: TemplateStringsArray, ...values: unknown[]): Code => {
    let src = strings.raw.reduce((acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ""), "");
    src = src.replace(/^\n+/, "").replace(/\s+$/, "");
    const lines = src.split("\n");
    const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => /^\s*/.exec(l)![0].length));
    return { lang, src: lines.map((l) => l.slice(indent)).join("\n") };
  };
}
export const py = snippet("python");
export const sql = snippet("sql");
export const sh = snippet("sh");
export const txt = snippet("text");
export const yaml = snippet("yaml");
export const json = snippet("json");

/** A question before its week, section and id are known. */
export type Draft = DistributiveOmit<Question, "id" | "week" | "sec">;
type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;

export const mcq = (q: string, options: string[], answer: number, why?: string, code?: Code): Draft => ({
  t: "mcq",
  q,
  options,
  answer,
  why,
  code,
});
export const multi = (q: string, options: string[], answers: number[], why?: string, code?: Code): Draft => ({
  t: "multi",
  q,
  options,
  answers,
  why,
  code,
});
export const tf = (q: string, answer: boolean, why?: string, code?: Code): Draft => ({
  t: "tf",
  q,
  answer,
  why,
  code,
});
/** Each answer is "a|b|c": any of the alternatives is accepted for that blank. */
export const blank = (q: string, answers: string[], why?: string, code?: Code): Draft => ({
  t: "blank",
  q,
  answers: answers.map((a) => a.split("|")),
  why,
  code,
});
export const card = (front: string, back: string, code?: Code): Draft => ({ t: "card", front, back, code });
export const order = (q: string, items: string[], why?: string): Draft => ({ t: "order", q, items, why });
export const match = (q: string, pairs: [string, string][], why?: string): Draft => ({
  t: "match",
  q,
  pairs,
  why,
});

/** A week's questions, grouped by section. */
export type WeekDraft = { core: Draft[]; dsa: Draft[]; eng: Draft[] };

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function promptOf(d: Draft): string {
  return d.t === "card" ? d.front : d.q;
}

export function week(week: number, w: WeekDraft): Question[] {
  return (["core", "dsa", "eng"] as const).flatMap((sec) =>
    w[sec].map(
      (d) =>
        ({ ...d, week, sec, id: `w${week}${sec[0]}-${hash(promptOf(d) + (d.code?.src ?? ""))}` }) as Question,
    ),
  );
}

/** Number of `___` blanks in a question's prompt and code. */
export function blankCount(q: Extract<Question, { t: "blank" }>): number {
  return ((q.q + "\n" + (q.code?.src ?? "")).match(/___/g) ?? []).length;
}
