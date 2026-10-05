"use client";
import { useSyncExternalStore } from "react";
import { notifyPersist } from "./persist-bus";

export type LocalStore<T> = {
  subscribe: (cb: () => void) => () => void;
  get: () => T;
  getServer: () => T;
  set: (next: T) => void;
};

/** A small localStorage-backed store: same value on the server, read once on the client, synced across tabs. */
export function createLocalStore<T>(key: string, empty: T, normalize: (raw: unknown) => T): LocalStore<T> {
  let snapshot = empty;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded) return;
    loaded = true;
    try {
      snapshot = normalize(JSON.parse(localStorage.getItem(key) ?? "null"));
    } catch {
      snapshot = empty;
    }
  }

  return {
    subscribe(cb) {
      listeners.add(cb);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
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
    },
    get() {
      load();
      return snapshot;
    },
    getServer: () => empty,
    set(next) {
      load();
      snapshot = next;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage blocked or full: keep the in-memory value for this session.
      }
      listeners.forEach((l) => l());
      notifyPersist(key);
    },
  };
}

export function useLocalStore<T>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}
