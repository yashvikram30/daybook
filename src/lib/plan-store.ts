"use client";
import { useSyncExternalStore } from "react";
import { notifyPersist } from "./persist-bus";
import { isISODate, normalizeStudyDays, todayIn, type Plan } from "./schedule";

// A guest's plan (start date, study days, catch-up anchors) lives in localStorage.
const KEY = "csplan.plan";
let snapshot: Plan | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function parse(raw: string | null): Plan | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    if (!isISODate(p?.startDate) || !Array.isArray(p.studyDays)) return null;
    const anchors = Array.isArray(p.anchors)
      ? p.anchors.filter(
          (a: { index: unknown; date: unknown }) => Number.isInteger(a?.index) && isISODate(a?.date),
        )
      : [];
    return { startDate: p.startDate, studyDays: normalizeStudyDays(p.studyDays), anchors };
  } catch {
    return null;
  }
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    snapshot = parse(localStorage.getItem(KEY));
  } catch {
    snapshot = null;
  }
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

export function usePlan(): Plan | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return snapshot;
    },
    () => null,
  );
}

/** False during server render and hydration, true afterwards. Lets pages tell "no plan" from "not loaded yet". */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** The browser's calendar date, or null on the server. */
export function useToday(): string | null {
  return useSyncExternalStore(
    () => () => {},
    () => todayIn(),
    () => null,
  );
}

export function savePlan(plan: Plan | null) {
  snapshot = plan;
  loaded = true;
  try {
    if (plan) localStorage.setItem(KEY, JSON.stringify(plan));
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
  notifyPersist(KEY);
}
