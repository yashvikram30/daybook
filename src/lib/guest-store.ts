"use client";
import { useSyncExternalStore } from "react";
import { notifyPersist } from "./persist-bus";
import { todayIn } from "./schedule";

// Guest progress lives in localStorage under the same key and shape the old static site used,
// so existing progress carries over: items by item key, completed days by day id, notes by day id.
export type GuestState = {
  items: Record<string, boolean>;
  done: Record<string, boolean>;
  notes: Record<string, string>;
  /** Count of check-offs, completions and note saves per calendar date; the source for streaks. */
  activity: Record<string, number>;
};

const KEY = "csplan.v1";
const EMPTY: GuestState = { items: {}, done: {}, notes: {}, activity: {} };

let snapshot: GuestState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

export function normalize(raw: unknown): GuestState {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof GuestState, unknown>>;
  const obj = (v: unknown) =>
    v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
  const bools = (v: unknown) =>
    Object.fromEntries(Object.entries(obj(v)).filter(([, x]) => x === true)) as Record<string, boolean>;
  const notes = Object.fromEntries(
    Object.entries(obj(r.notes)).filter(([, x]) => typeof x === "string" && x !== ""),
  );
  const activity = Object.fromEntries(
    Object.entries(obj(r.activity)).filter(
      ([k, x]) => /^\d{4}-\d{2}-\d{2}$/.test(k) && typeof x === "number" && x > 0,
    ),
  );
  return {
    items: bools(r.items),
    done: bools(r.done),
    notes: notes as Record<string, string>,
    activity: activity as Record<string, number>,
  };
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    snapshot = normalize(raw);
  } catch {
    snapshot = EMPTY;
  }
}

function commit(next: GuestState) {
  snapshot = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked or full: keep the in-memory state for this session.
  }
  listeners.forEach((l) => l());
  notifyPersist(KEY);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  load();
  return snapshot;
};
const getServerSnapshot = () => EMPTY;

export function useGuestState(): GuestState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function bump(activity: Record<string, number>): Record<string, number> {
  const d = todayIn();
  return { ...activity, [d]: (activity[d] ?? 0) + 1 };
}

export function setItem(key: string, checked: boolean) {
  load();
  const items = { ...snapshot.items };
  if (checked) items[key] = true;
  else delete items[key];
  commit({ ...snapshot, items, activity: checked ? bump(snapshot.activity) : snapshot.activity });
}

export function setDayDone(id: string, done: boolean) {
  load();
  const next = { ...snapshot.done };
  if (done) next[id] = true;
  else delete next[id];
  commit({ ...snapshot, done: next, activity: done ? bump(snapshot.activity) : snapshot.activity });
}

export function setNote(id: string, text: string) {
  load();
  const notes = { ...snapshot.notes };
  if (text) notes[id] = text;
  else delete notes[id];
  commit({ ...snapshot, notes, activity: text ? bump(snapshot.activity) : snapshot.activity });
}

export function resetGuestState() {
  load();
  commit(EMPTY);
}

export type DayStatus = "todo" | "started" | "done";
export function dayStatus(state: GuestState, dayId: string): DayStatus {
  if (state.done[dayId]) return "done";
  const prefix = dayId + ":";
  for (const k in state.items) if (state.items[k] && k.startsWith(prefix)) return "started";
  return "todo";
}

export function checkedCount(state: GuestState, dayId: string): number {
  const prefix = dayId + ":";
  let n = 0;
  for (const k in state.items) if (state.items[k] && k.startsWith(prefix)) n++;
  return n;
}

/** Replace all progress with an imported backup. Throws on input that is not a progress backup. */
export function importGuestState(json: string) {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("That file is not valid JSON.");
  }
  if (!raw || typeof raw !== "object" || !("items" in raw || "done" in raw))
    throw new Error("That file is not a progress backup.");
  load();
  commit(normalize(raw));
}

export function exportGuestState(): string {
  load();
  return JSON.stringify(snapshot, null, 2);
}
