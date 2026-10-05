import { describe, expect, it } from "vitest";
import { backlinksTo, makeResolver, type DayRef } from "./brain-links";
import { linksOf, normalizeBrain, tagsOf, titleOf, type Note } from "./brain-store";
import { toggleTask } from "./markdown";
import { normalizeCards } from "./lab-store";

const note = (id: string, title: string, body = "", day: string | null = null): Note => ({
  id,
  title,
  body,
  day,
  pinned: false,
  created: 1,
  updated: 1,
});
const days: DayRef[] = [
  { id: "w3d2", week: 3, day: 2, title: "Scheduling and context switching", href: "/day/3/2" },
  { id: "w3d3", week: 3, day: 3, title: "Build a shell, part 1", href: "/day/3/3" },
];

describe("brain text helpers", () => {
  it("reads tags from text but not from code blocks", () => {
    expect(tagsOf("Notes #os and #Raft/log, not C# or ```\n#hidden\n```")).toEqual(["os", "raft/log"]);
  });
  it("reads wiki links, trimmed and lower-cased", () => {
    expect(linksOf("See [[ Page Tables ]] and [[Day 2]].")).toEqual(["page tables", "day 2"]);
  });
  it("titles fall back to the first line, then Untitled", () => {
    expect(titleOf({ title: "", body: "\n## Hello there\nmore" })).toBe("Hello there");
    expect(titleOf({ title: "", body: "" })).toBe("Untitled");
  });
  it("drops malformed notes and bad day ids when loading", () => {
    const b = normalizeBrain({ notes: [{ id: "a", title: 5, day: "nope" }, { id: "a" }, null, { x: 1 }] });
    expect(b.notes).toHaveLength(1);
    expect(b.notes[0]).toMatchObject({ id: "a", title: "", day: null });
    expect(normalizeBrain("junk").notes).toEqual([]);
  });
  it("flips one task box by source line", () => {
    expect(toggleTask("- [ ] a\n- [x] b", 0)).toBe("- [x] a\n- [x] b");
    expect(toggleTask("- [ ] a\n- [x] b", 1)).toBe("- [ ] a\n- [ ] b");
  });
});

describe("wiki link resolution", () => {
  const notes = [note("n1", "Page tables"), note("n2", "Raft notes", "see [[page tables]]")];
  const r = makeResolver(notes, days);
  it("prefers a note, then a day, then a week", () => {
    expect(r("page tables")).toEqual({ href: "/notes?n=n1", kind: "note" });
    expect(r("Scheduling and context switching")).toEqual({ href: "/day/3/2", kind: "day" });
    expect(r("w3d3").href).toBe("/day/3/3");
    expect(r("Day 1").href).toBe("/day/3/2");
    expect(r("Week 3")).toEqual({ href: "/week/3", kind: "day" });
  });
  it("sends unknown targets to a new note with that title", () => {
    expect(r("Brand new idea")).toEqual({ href: "/notes?new=1&title=Brand%20new%20idea", kind: "missing" });
    expect(r("Week 99").kind).toBe("missing");
  });
  it("finds backlinks", () => {
    expect(backlinksTo(notes[0], notes, linksOf).map((n) => n.id)).toEqual(["n2"]);
    expect(backlinksTo(notes[1], notes, linksOf)).toEqual([]);
  });
});

describe("spaced review cards", () => {
  it("rejects bad stored cards", () => {
    expect(
      normalizeCards({
        cards: {
          a: { box: 2, due: "2026-01-02" },
          b: { box: 9, due: "2026-01-02" },
          c: { box: 1, due: "x" },
        },
      }).cards,
    ).toEqual({
      a: { box: 2, due: "2026-01-02" },
    });
  });
});
