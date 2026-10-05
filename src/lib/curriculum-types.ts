// Plain, serialisable curriculum shapes shared by server and client code.
export type Section = "learn" | "build" | "dsa_learn" | "dsa_problem" | "swe";
export type Kind = "read" | "video" | "docs" | "lab" | "task" | "problem";

export type Item = {
  key: string;
  section: Section;
  kind: Kind;
  title: string;
  url: string | null;
  note: string | null;
  difficulty: "E" | "M" | "H" | null;
  position: number;
};

export type Day = {
  /** "w3d2", the id used in URLs, guest storage and completions. */
  id: string;
  weekNumber: number;
  numberInWeek: number;
  /** 0-based position in the whole plan. */
  globalIndex: number;
  title: string;
  why: string;
  ship: string;
  dsaTitle: string;
  sweTitle: string;
  items: Item[];
  questions: string[];
};

export type Week = {
  number: number;
  phase: string;
  title: string;
  summary: string;
  project: string;
  days: Day[];
};

export type Phase = { slug: string; name: string; language: string };
export type Curriculum = { phases: Phase[]; weeks: Week[] };

export const dayId = (week: number, day: number) => `w${week}d${day}`;
export const dayHref = (week: number, day: number) => `/day/${week}/${day}`;

export function allDays(c: Curriculum): Day[] {
  return c.weeks.flatMap((w) => w.days);
}

export function itemsOf(day: Day, section: Section): Item[] {
  return day.items.filter((i) => i.section === section);
}

export function hostOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
