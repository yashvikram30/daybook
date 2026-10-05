"use client";
import { createLocalStore, useLocalStore } from "./local-store";
import type { Config, Stats } from "./revise-engine";
import { QUESTION_TYPES, SECTIONS } from "@/data/revision/meta";

/** What the revision section remembers on this device: per-question history and the last setup used. */
export type Revise = { stats: Stats; prefs: Partial<Config> };
const EMPTY: Revise = { stats: {}, prefs: {} };

const ints = (v: unknown, max: number) =>
  Array.isArray(v)
    ? [...new Set(v.filter((x): x is number => Number.isInteger(x) && x >= 1 && x <= max))]
    : undefined;
const strs = <T extends string>(v: unknown, ok: readonly T[]) =>
  Array.isArray(v) ? v.filter((x): x is T => ok.includes(x as T)) : undefined;

export function normalizeRevise(raw: unknown): Revise {
  const r = (raw && typeof raw === "object" ? raw : {}) as { stats?: unknown; prefs?: unknown };
  const stats: Stats = {};
  if (r.stats && typeof r.stats === "object")
    for (const [id, s] of Object.entries(r.stats)) {
      const x = s as Stats[string];
      if (Number.isInteger(x?.seen) && x.seen > 0 && Number.isInteger(x?.miss) && x.miss >= 0)
        stats[id] = { seen: x.seen, miss: x.miss, lastOk: x.lastOk === true };
    }
  const p = (r.prefs && typeof r.prefs === "object" ? r.prefs : {}) as Record<string, unknown>;
  const prefs: Partial<Config> = {};
  const weeks = ints(p.weeks, 99);
  if (weeks?.length) prefs.weeks = weeks;
  const secs = strs(p.secs, SECTIONS);
  if (secs?.length) prefs.secs = secs;
  const types = strs(p.types, QUESTION_TYPES);
  if (types?.length) prefs.types = types;
  if (typeof p.size === "number" && p.size >= 0 && p.size <= 500) prefs.size = Math.floor(p.size);
  return { stats, prefs };
}

const store = createLocalStore<Revise>("csplan.revise", EMPTY, normalizeRevise);
export const useRevise = () => useLocalStore(store);
export const getRevise = () => store.get();
export const setRevise = (r: Revise) => store.set(normalizeRevise(r));
export const resetRevise = () => store.set(EMPTY);

export function recordAnswers(results: { id: string; ok: boolean }[]) {
  const cur = store.get();
  const stats = { ...cur.stats };
  for (const { id, ok } of results) {
    const s = stats[id];
    stats[id] = { seen: (s?.seen ?? 0) + 1, miss: (s?.miss ?? 0) + (ok ? 0 : 1), lastOk: ok };
  }
  store.set({ ...cur, stats });
}

export function savePrefs(prefs: Partial<Config>) {
  const cur = store.get();
  store.set({ ...cur, prefs });
}
