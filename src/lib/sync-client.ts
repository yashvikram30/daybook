"use client";
import { onPersist } from "./persist-bus";
import { isSyncKey, SYNC_KEYS, type SyncKey } from "./sync-keys";

/** What to do with one store when a user signs in, given the local text, the server text and what this device remembers. */
export type Action = "none" | "push" | "pull" | "pull-keep-local";

export function decide(opts: {
  local: string | null;
  server: string | null;
  /** This device has synced with this account before. */
  synced: boolean;
  /** This store changed here and has not reached the server yet. */
  dirty: boolean;
}): Action {
  const { local, server, synced, dirty } = opts;
  if (dirty) return "push";
  if (local === server) return "none";
  if (server === null) return "push";
  if (local === null || synced) return "pull";
  // First sign-in on a device that already has its own data, and the account has different data.
  return "pull-keep-local";
}

export type Status = "off" | "syncing" | "synced" | "error";

const UID = "csplan.sync-uid";
const DIRTY = "csplan.sync-dirty";
const KEPT = "csplan.sync-kept";

let status: Status = "off";
let activeUid: string | null = null;
let ready = false;
const statusListeners = new Set<() => void>();
const timers = new Map<SyncKey, ReturnType<typeof setTimeout>>();

function setStatus(s: Status) {
  status = s;
  statusListeners.forEach((l) => l());
}
export const subscribeStatus = (cb: () => void) => {
  statusListeners.add(cb);
  return () => statusListeners.delete(cb);
};
export const getStatus = () => status;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function dirtySet(): Set<string> {
  try {
    return new Set(JSON.parse(read(DIRTY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}
function markDirty(key: string, on: boolean) {
  const d = dirtySet();
  if (on) d.add(key);
  else d.delete(key);
  try {
    localStorage.setItem(DIRTY, JSON.stringify([...d]));
  } catch {}
}

async function put(key: SyncKey): Promise<boolean> {
  try {
    const res = await fetch("/api/sync", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: read(key) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function push(key: SyncKey) {
  const ok = await put(key);
  if (ok) {
    if (!timers.has(key)) markDirty(key, false);
    if (!timers.size && !dirtySet().size) setStatus("synced");
  } else setStatus("error");
}

function schedule(key: SyncKey) {
  clearTimeout(timers.get(key));
  timers.set(
    key,
    setTimeout(() => {
      timers.delete(key);
      void push(key);
    }, 1200),
  );
}

/** Send anything still waiting right now. */
export async function flush(): Promise<void> {
  const keys = [...timers.keys()];
  keys.forEach((k) => clearTimeout(timers.get(k)));
  timers.clear();
  await Promise.all(keys.map((k) => push(k)));
}

let stopWatching: (() => void) | null = null;

/**
 * Bring this device and the signed-in account into line, then keep saving changes to the server.
 * Resolves true when local storage was replaced with the account's data (the page should reload to show it).
 */
export async function startSync(uid: string): Promise<boolean> {
  if (activeUid === uid) return false;
  activeUid = uid;
  setStatus("syncing");
  let rows: Record<string, string>;
  try {
    const res = await fetch("/api/sync", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    rows = ((await res.json()) as { data: Record<string, string> }).data;
  } catch {
    activeUid = null;
    setStatus("error");
    return false;
  }

  const synced = read(UID) === uid;
  const dirty = synced ? dirtySet() : new Set<string>();
  const kept: Record<string, string> = {};
  let replaced = false;
  const pushes: SyncKey[] = [];

  for (const key of SYNC_KEYS) {
    const local = read(key);
    const action = decide({ local, server: rows[key] ?? null, synced, dirty: dirty.has(key) });
    if (action === "push") pushes.push(key);
    else if (action === "pull" || action === "pull-keep-local") {
      if (action === "pull-keep-local" && local !== null) kept[key] = local;
      try {
        localStorage.setItem(key, rows[key]);
        replaced = true;
      } catch {}
    }
  }
  try {
    if (Object.keys(kept).length) {
      // The account's data won; the data this device had before sign-in is parked, not thrown away.
      localStorage.setItem(KEPT, JSON.stringify({ at: Date.now(), data: kept }));
    }
    localStorage.setItem(UID, uid);
  } catch {}

  const results = await Promise.all(pushes.map((k) => put(k)));
  pushes.forEach((k, i) => markDirty(k, !results[i]));
  ready = true;
  setStatus(results.every(Boolean) ? "synced" : "error");

  stopWatching?.();
  stopWatching = onPersist((key) => {
    if (!ready || !isSyncKey(key)) return;
    markDirty(key, true);
    setStatus("syncing");
    schedule(key);
  });
  return replaced;
}

/** Flush, forget the account on this device and clear its data (a shared computer should not keep it). */
export async function stopSyncAndClear(): Promise<void> {
  await flush();
  stopWatching?.();
  stopWatching = null;
  ready = false;
  activeUid = null;
  setStatus("off");
  try {
    for (const k of SYNC_KEYS) localStorage.removeItem(k);
    localStorage.removeItem(UID);
    localStorage.removeItem(DIRTY);
  } catch {}
}

/** Stop syncing without clearing (used when the session simply is not there). */
export function idleSync() {
  stopWatching?.();
  stopWatching = null;
  ready = false;
  activeUid = null;
  setStatus("off");
}
