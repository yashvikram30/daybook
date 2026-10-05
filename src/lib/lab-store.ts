"use client";
import { addDays, isISODate, todayIn } from "./schedule";
import { createLocalStore, useLocalStore } from "./local-store";

/** Spaced review of the daily "check yourself" questions, in three boxes of growing gaps. */
export type Card = { box: number; due: string };
export type Cards = { cards: Record<string, Card> };

export const GAPS = [0, 1, 3, 7, 14];
const EMPTY: Cards = { cards: {} };

export function normalizeCards(raw: unknown): Cards {
  const src = raw && typeof raw === "object" ? (raw as Cards).cards : null;
  const cards: Record<string, Card> = {};
  if (src && typeof src === "object")
    for (const [id, c] of Object.entries(src)) {
      const box = (c as Card)?.box;
      if (Number.isInteger(box) && box >= 1 && box < GAPS.length && isISODate((c as Card).due))
        cards[id] = { box, due: (c as Card).due };
    }
  return { cards };
}

const store = createLocalStore<Cards>("csplan.cards", EMPTY, normalizeCards);
export const useCards = () => useLocalStore(store);
export const getCards = () => store.get();
export const setCards = (c: Cards) => store.set(normalizeCards(c));
export const resetCards = () => store.set(EMPTY);

/** Record an answer. A recalled card moves up a box and waits longer; a missed one drops to box 1. */
export function gradeCard(id: string, recalled: boolean) {
  const cur = store.get().cards[id];
  const box = recalled ? Math.min((cur?.box ?? 0) + 1, GAPS.length - 1) : 1;
  const today = todayIn();
  store.set({
    cards: { ...store.get().cards, [id]: { box, due: addDays(today, recalled ? GAPS[box] : 0) } },
  });
}

export function isDue(c: Card | undefined, today: string) {
  return !!c && c.due <= today;
}
