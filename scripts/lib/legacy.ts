// Reads the original static-site data files (data/legacy/*.js) into plain typed objects.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export type Kind = "read" | "video" | "docs" | "lab";
export type SeedItem = {
  key: string;
  section: "learn" | "build" | "dsa_learn" | "dsa_problem" | "swe";
  kind: Kind | "task" | "problem";
  title: string;
  url: string | null;
  note: string | null;
  difficulty: "E" | "M" | "H" | null;
  position: number;
};
export type SeedDay = {
  globalIndex: number;
  numberInWeek: number;
  title: string;
  why: string;
  ship: string;
  dsaTitle: string;
  sweTitle: string;
  items: SeedItem[];
  questions: string[];
};
export type SeedWeek = {
  number: number;
  phase: string;
  title: string;
  summary: string;
  project: string;
  days: SeedDay[];
};
export type SeedPhase = { slug: string; name: string; language: string; position: number };
export type Curriculum = { phases: SeedPhase[]; weeks: SeedWeek[] };

const FILES = ["core", "weeks-01-04", "weeks-05-08", "weeks-09-11", "weeks-12-16", "dsa"];

export function loadLegacyCurriculum(dir = path.resolve(process.cwd(), "data/legacy")): Curriculum {
  const ctx: Record<string, unknown> = {};
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const f of FILES)
    vm.runInContext(fs.readFileSync(path.join(dir, f + ".js"), "utf8"), ctx, { filename: f });

  const rawPhases = ctx.PHASES as Record<string, { name: string; lang: string }>;
  const phases = Object.entries(rawPhases).map(([slug, p], position) => ({
    slug,
    name: p.name,
    language: p.lang,
    position,
  }));

  type L = { k: Kind; t: string; u: string; n?: string };
  type RawDay = {
    t: string;
    why: string;
    ship: string;
    ask: string[];
    main: L[];
    build: string[];
    swe: { t: string; link: L };
  };
  type RawProb = { t: string; u: string; d: "E" | "M" | "H" };
  type RawDsa = { t: string; learn: L | L[]; probs: RawProb[] };
  type RawWeek = {
    n: number;
    phase: string;
    title: string;
    summary: string;
    project: string;
    days: RawDay[];
  };
  const dsa = ctx.DSA as RawDsa[];
  const weeks = (ctx.WEEKS as RawWeek[]).map((w): SeedWeek => ({
    number: w.n,
    phase: w.phase,
    title: w.title,
    summary: w.summary,
    project: w.project,
    days: w.days.map((d, i): SeedDay => {
      const id = `w${w.n}d${i + 1}`;
      const items: SeedItem[] = [];
      const link = (key: string, section: SeedItem["section"], l: L, position: number) =>
        items.push({
          key,
          section,
          kind: l.k,
          title: l.t,
          url: l.u,
          note: l.n ?? null,
          difficulty: null,
          position,
        });
      d.main.forEach((l: L, j: number) => link(`${id}:m${j}`, "learn", l, j));
      d.build.forEach((t: string, j: number) =>
        items.push({
          key: `${id}:b${j}`,
          section: "build",
          kind: "task",
          title: t,
          url: null,
          note: null,
          difficulty: null,
          position: j,
        }),
      );
      const globalIndex = (w.n - 1) * 4 + i;
      const day = dsa[globalIndex];
      if (!day) throw new Error(`No DSA block for day ${globalIndex + 1}`);
      [day.learn].flat().forEach((l, j) => link(`${id}:dl${j === 0 ? "" : j}`, "dsa_learn", l, j));
      day.probs.forEach((p, j) =>
        items.push({
          key: `${id}:p${j}`,
          section: "dsa_problem",
          kind: "problem",
          title: p.t,
          url: p.u,
          note: p.d === "H" ? "Stretch" : null,
          difficulty: p.d,
          position: j,
        }),
      );
      link(`${id}:s`, "swe", d.swe.link, 0);
      return {
        globalIndex,
        numberInWeek: i + 1,
        title: d.t,
        why: d.why,
        ship: d.ship,
        dsaTitle: day.t,
        sweTitle: d.swe.t,
        items,
        questions: d.ask,
      };
    }),
  }));
  return { phases, weeks };
}
