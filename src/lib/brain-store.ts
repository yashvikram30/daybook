"use client";
import { createLocalStore, useLocalStore } from "./local-store";

/** A note in the second brain. Tags and links are read from the text, so there is nothing to keep in sync. */
export type Note = {
  id: string;
  title: string;
  body: string;
  /** The day this note is about, e.g. "w3d2", or null for a free note. */
  day: string | null;
  pinned: boolean;
  created: number;
  updated: number;
};
export type Brain = { notes: Note[] };

const EMPTY: Brain = { notes: [] };

export function normalizeBrain(raw: unknown): Brain {
  const list =
    raw && typeof raw === "object" && Array.isArray((raw as Brain).notes) ? (raw as Brain).notes : [];
  const notes: Note[] = [];
  const seen = new Set<string>();
  for (const n of list as Partial<Note>[]) {
    if (!n || typeof n.id !== "string" || seen.has(n.id)) continue;
    seen.add(n.id);
    notes.push({
      id: n.id,
      title: typeof n.title === "string" ? n.title : "",
      body: typeof n.body === "string" ? n.body : "",
      day: typeof n.day === "string" && /^w\d+d\d+$/.test(n.day) ? n.day : null,
      pinned: n.pinned === true,
      created: typeof n.created === "number" ? n.created : 0,
      updated: typeof n.updated === "number" ? n.updated : 0,
    });
  }
  return { notes };
}

const store = createLocalStore<Brain>("csplan.brain", EMPTY, normalizeBrain);
export const useBrain = () => useLocalStore(store);
export const getBrain = () => store.get();
export const setBrain = (b: Brain) => store.set(normalizeBrain(b));

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export function createNote(init: { title?: string; body?: string; day?: string | null } = {}): string {
  const now = Date.now();
  const note: Note = {
    id: newId(),
    title: init.title ?? "",
    body: init.body ?? "",
    day: init.day ?? null,
    pinned: false,
    created: now,
    updated: now,
  };
  store.set({ notes: [note, ...store.get().notes] });
  return note.id;
}

export function updateNote(id: string, patch: Partial<Pick<Note, "title" | "body" | "day" | "pinned">>) {
  store.set({
    notes: store.get().notes.map((n) => (n.id === id ? { ...n, ...patch, updated: Date.now() } : n)),
  });
}

export function deleteNote(id: string) {
  store.set({ notes: store.get().notes.filter((n) => n.id !== id) });
}

export function resetBrain() {
  store.set(EMPTY);
}

/** #tags in the text. A tag starts with a letter and may contain letters, digits, dashes and slashes. */
export function tagsOf(body: string): string[] {
  const out = new Set<string>();
  for (const m of body.replace(/```[\s\S]*?```/g, "").matchAll(/(?:^|[\s(])#([a-z][\w/-]*)/gi))
    out.add(m[1].toLowerCase());
  return [...out];
}

/** Targets of [[wiki links]] in the text. */
export function linksOf(body: string): string[] {
  const out = new Set<string>();
  for (const m of body.matchAll(/\[\[([^\]\n]+)\]\]/g)) out.add(m[1].trim().toLowerCase());
  return [...out];
}

export function titleOf(n: Pick<Note, "title" | "body">): string {
  if (n.title.trim()) return n.title.trim();
  const first = n.body.split("\n").find((l) => l.trim());
  return first ? first.replace(/^#+\s*/, "").slice(0, 60) : "Untitled";
}
