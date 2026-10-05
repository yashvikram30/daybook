import { describe, expect, it, beforeAll } from "vitest";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { PGlite } from "@electric-sql/pglite";
import { count, eq, sql } from "drizzle-orm";
import path from "node:path";
import { loadLegacyCurriculum, type Curriculum } from "./lib/legacy";
import { seedCurriculum, type Db } from "../src/db/seed";
import * as schema from "../src/db/schema";

let c: Curriculum;
beforeAll(() => {
  c = loadLegacyCurriculum();
});

describe("legacy curriculum loader", () => {
  it("has 16 weeks and 64 days in order", () => {
    expect(c.weeks.map((w) => w.number)).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
    const days = c.weeks.flatMap((w) => w.days);
    expect(days).toHaveLength(64);
    expect(days.map((d) => d.globalIndex)).toEqual(Array.from({ length: 64 }, (_, i) => i));
    for (const w of c.weeks) expect(w.days).toHaveLength(4);
  });
  it("has 7 phases and every week references a known one", () => {
    expect(c.phases.map((p) => p.slug)).toEqual(["arch", "os", "net", "db", "dist", "swe", "ml"]);
    for (const w of c.weeks) expect(c.phases.some((p) => p.slug === w.phase)).toBe(true);
  });
  it("item keys are unique and use the legacy w{n}d{d}:x format", () => {
    const keys = c.weeks.flatMap((w) => w.days.flatMap((d) => d.items.map((i) => i.key)));
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of keys) expect(k).toMatch(/^w\d+d\d:(m\d+|b\d+|dl\d*|p\d+|s)$/);
  });
  it("every day has the full set of sections and questions", () => {
    for (const d of c.weeks.flatMap((w) => w.days)) {
      const sections = new Set(d.items.map((i) => i.section));
      expect([...sections].sort()).toEqual(["build", "dsa_learn", "dsa_problem", "learn", "swe"]);
      expect(d.questions.length).toBeGreaterThan(0);
    }
  });
  it("every link is http(s), only known sites are plain http, and every problem has a difficulty", () => {
    // These two sites do not serve TLS at all (checked 2026-10-05).
    const plainHttpOk = ["http://neuralnetworksanddeeplearning.com/", "http://deeplearning.stanford.edu/"];
    for (const i of c.weeks.flatMap((w) => w.days.flatMap((d) => d.items))) {
      if (i.url?.startsWith("http://")) expect(plainHttpOk.some((p) => i.url!.startsWith(p))).toBe(true);
      else if (i.url) expect(i.url).toMatch(/^https:\/\//);
      if (i.section === "dsa_problem") expect(["E", "M", "H"]).toContain(i.difficulty);
    }
  });
});

describe("curriculum quality", () => {
  const days = () => c.weeks.flatMap((w) => w.days);
  const of = (d: (typeof c.weeks)[number]["days"][number], section: string) =>
    d.items.filter((i) => i.section === section);

  it("groups hold several links, and no link is listed twice on a day", () => {
    for (const d of days()) {
      const urls: string[] = [];
      for (const i of of(d, "learn")) {
        if (i.links) {
          expect(i.links.length, `day ${d.globalIndex + 1} ${i.title}`).toBeGreaterThanOrEqual(2);
          expect(i.url).toBeNull();
          urls.push(...i.links.map((l) => l.url));
        } else if (i.url) urls.push(i.url);
      }
      expect(new Set(urls).size, `day ${d.globalIndex + 1} repeats a link`).toBe(urls.length);
    }
  });

  it("every day has enough to learn, build and check", () => {
    for (const d of days()) {
      const where = `week day ${d.globalIndex + 1}: ${d.title}`;
      expect(of(d, "learn").length, `${where} learn`).toBeGreaterThanOrEqual(2);
      expect(of(d, "build").length, `${where} build`).toBeGreaterThanOrEqual(3);
      expect(d.questions.length, `${where} questions`).toBeGreaterThanOrEqual(2);
      expect(d.ship.length, `${where} ship`).toBeGreaterThan(10);
      expect(of(d, "swe")).toHaveLength(1);
    }
  });

  it("DSA comes from Striver's A2Z sheet: 3 to 6 problems a day, ~270 in total, none repeated", () => {
    const urls = new Set<string>();
    let total = 0;
    for (const d of days()) {
      const probs = of(d, "dsa_problem");
      expect(probs.length, d.dsaTitle).toBeGreaterThanOrEqual(3);
      expect(probs.length, d.dsaTitle).toBeLessThanOrEqual(6);
      expect(of(d, "dsa_learn").length, d.dsaTitle).toBeGreaterThanOrEqual(1);
      for (const p of probs) {
        expect(p.url, p.title).toMatch(
          /^https:\/\/(leetcode\.com\/problems\/[a-z0-9-]+\/|takeuforward\.org\/practice\/dsa\/.+)$/,
        );
        expect(urls.has(p.url!), `duplicate problem ${p.title}`).toBe(false);
        urls.add(p.url!);
        total++;
      }
    }
    expect(total).toBeGreaterThanOrEqual(270);
  });

  it("DSA follows the sheet's topic order, with hashing pulled forward and advanced graphs saved for last", () => {
    const topics = days().map((d) => d.dsaTitle.split(":")[0].replace(/ on strings| on the answer/, ""));
    const runs = topics.filter((t, i) => t !== topics[i - 1]);
    expect(runs).toEqual([
      "Sorting",
      "Arrays",
      "Hashing",
      "Arrays",
      "Binary search",
      "Strings",
      "Greedy",
      "Sliding window",
      "Stacks and queues",
      "Binary trees",
      "Binary search trees",
      "Graphs",
      "Dynamic programming",
      "Graphs",
    ]);
  });

  it("every DSA day has the lesson it depends on before it", () => {
    const at = (re: RegExp) => days().findIndex((d) => re.test(d.dsaTitle));
    expect(at(/^Hashing/)).toBeLessThan(at(/Two Sum/));
    const learn = (i: number) => of(days()[i], "dsa_learn").map((l) => l.url);
    expect(learn(at(/^Binary trees: traversals/)).some((u) => u?.includes("69ZCDFy-OUo"))).toBe(true);
    expect(learn(at(/Dijkstra/)).some((u) => u?.includes("heapq"))).toBe(true);
    expect(at(/^Dynamic programming: 1D/)).toBeLessThan(at(/disjoint sets|Bellman-Ford/));
  });

  it("lists rendered by title are free of duplicates, so React keys stay unique", () => {
    for (const w of c.weeks) {
      const dsa = w.days.map((d) => d.dsaTitle);
      const swe = w.days.map((d) => d.sweTitle);
      expect(new Set(dsa).size, `week ${w.number} DSA titles`).toBe(dsa.length);
      expect(new Set(swe).size, `week ${w.number} engineering titles`).toBe(swe.length);
      for (const d of w.days)
        expect(new Set(d.questions).size, `day ${d.globalIndex + 1} questions`).toBe(d.questions.length);
    }
  });

  it("generative AI and RAG weeks exist", () => {
    const titles = c.weeks.map((w) => w.title);
    expect(titles).toContain("Building software on LLMs");
    expect(titles).toContain("Retrieval-augmented generation");
  });
});

describe("seed into Postgres (PGlite)", () => {
  let db: Db;
  beforeAll(async () => {
    const pg = drizzle(new PGlite(), { schema });
    await migrate(pg, { migrationsFolder: path.resolve(process.cwd(), "drizzle") });
    db = pg as unknown as Db;
  });

  it("loads everything and the counts match the source", async () => {
    const expected = {
      weeks: 16,
      days: 64,
      items: c.weeks.flatMap((w) => w.days).reduce((n, d) => n + d.items.length, 0),
      questions: c.weeks.flatMap((w) => w.days).reduce((n, d) => n + d.questions.length, 0),
    };
    expect(await seedCurriculum(db, c)).toEqual(expected);
    expect((await db.select({ n: count() }).from(schema.items))[0].n).toBe(expected.items);
  });
  it("joins resolve: week 1 day 1 has its learn items in order", async () => {
    const rows = await db
      .select({ key: schema.items.key, title: schema.items.title })
      .from(schema.items)
      .innerJoin(schema.days, eq(schema.items.dayId, schema.days.id))
      .where(sql`${schema.days.globalIndex} = 0 and ${schema.items.section} = 'learn'`)
      .orderBy(schema.items.position);
    expect(rows.map((r) => r.key)).toEqual(["w1d1:m0", "w1d1:m1", "w1d1:m4"]);
  });
  it("refuses to seed a non-empty database", async () => {
    await expect(seedCurriculum(db, c)).rejects.toThrow(/not empty/);
  });
});
