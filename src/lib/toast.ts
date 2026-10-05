"use client";
import { useSyncExternalStore } from "react";

// Tiny toast store: toast("Day marked complete") from anywhere; <Toaster /> renders it.
export type Toast = { id: number; message: string };
let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(message: string, ms = 3200) {
  const t = { id: nextId++, message };
  toasts = [...toasts, t].slice(-3);
  emit();
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id);
    emit();
  }, ms);
}

const EMPTY: Toast[] = [];
export function useToasts(): Toast[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => toasts,
    () => EMPTY,
  );
}
