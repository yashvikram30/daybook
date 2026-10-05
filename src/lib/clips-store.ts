"use client";
import { createLocalStore, useLocalStore } from "./local-store";

/**
 * A quick capture made while studying a day: a bit of text, a link or a pasted image. Clips are filed under
 * the day they were taken on and show up day by day in the second brain.
 */
export type Clip = {
  id: string;
  /** The day this was captured on, e.g. "w3d2". */
  day: string;
  kind: "text" | "link" | "image";
  /** The text, the link address, or an optional caption for an image. */
  text: string;
  /** A downscaled data: URL, for images only. */
  img?: string;
  created: number;
};
export type Clips = { clips: Clip[] };

const EMPTY: Clips = { clips: [] };
const DAY = /^w\d+d\d+$/;

export function normalizeClips(raw: unknown): Clips {
  const list =
    raw && typeof raw === "object" && Array.isArray((raw as Clips).clips) ? (raw as Clips).clips : [];
  const clips: Clip[] = [];
  const seen = new Set<string>();
  for (const c of list as Partial<Clip>[]) {
    if (!c || typeof c.id !== "string" || seen.has(c.id)) continue;
    if (typeof c.day !== "string" || !DAY.test(c.day)) continue;
    if (c.kind !== "text" && c.kind !== "link" && c.kind !== "image") continue;
    const text = typeof c.text === "string" ? c.text : "";
    const img = typeof c.img === "string" && c.img.startsWith("data:image/") ? c.img : undefined;
    if (c.kind === "image" && !img) continue;
    if (c.kind !== "image" && !text.trim()) continue;
    if (c.kind === "link" && !isUrl(text)) continue;
    seen.add(c.id);
    clips.push({
      id: c.id,
      day: c.day,
      kind: c.kind,
      text,
      ...(c.kind === "image" ? { img } : {}),
      created: typeof c.created === "number" ? c.created : 0,
    });
  }
  return { clips };
}

const store = createLocalStore<Clips>("csplan.clips", EMPTY, normalizeClips);
export const useClips = () => useLocalStore(store);
export const getClips = () => store.get();
export const setClips = (c: Clips) => store.set(normalizeClips(c));
export const resetClips = () => store.set(EMPTY);

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** The day id for a page address: /day/3/2 and /day/3/2/practice are both "w3d2". */
export function dayFromPath(pathname: string | null): string | null {
  const m = /^\/day\/(\d+)\/(\d+)(?:\/|$)/.exec(pathname ?? "");
  return m ? `w${Number(m[1])}d${Number(m[2])}` : null;
}

export function isUrl(s: string): boolean {
  return /^https?:\/\/[^\s]+$/i.test(s.trim());
}

/** Whether the browser actually kept what we just wrote (storage may be full, or blocked). */
function persisted(): boolean {
  try {
    return localStorage.getItem("csplan.clips") === JSON.stringify(store.get());
  } catch {
    return false;
  }
}

/** Add a clip. A single link becomes a link clip. Returns false when it could not be stored on this device. */
export function addClip(day: string, input: { text?: string; img?: string }): boolean {
  const text = (input.text ?? "").trim();
  if (!DAY.test(day) || (!text && !input.img)) return false;
  const before = store.get();
  const clip: Clip = {
    id: newId(),
    day,
    kind: input.img ? "image" : isUrl(text) ? "link" : "text",
    text,
    ...(input.img ? { img: input.img } : {}),
    created: Date.now(),
  };
  store.set({ clips: [...before.clips, clip] });
  if (persisted()) return true;
  store.set(before);
  return false;
}

export function deleteClip(id: string) {
  store.set({ clips: store.get().clips.filter((c) => c.id !== id) });
}

export function clipsOn(all: readonly Clip[], day: string): Clip[] {
  return all.filter((c) => c.day === day).sort((a, b) => a.created - b.created);
}

/** Read an image file and shrink it so a few dozen fit in browser storage. Resolves to a data: URL. */
export async function shrinkImage(file: Blob, maxSide = 1280, quality = 0.78): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const url = canvas.toDataURL("image/webp", quality);
  return url.startsWith("data:image/webp") ? url : canvas.toDataURL("image/jpeg", quality);
}
