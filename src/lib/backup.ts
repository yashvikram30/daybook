"use client";
import { getBrain, resetBrain, setBrain } from "./brain-store";
import { exportGuestState, importGuestState, resetGuestState } from "./guest-store";
import { getClips, resetClips, setClips } from "./clips-store";
import { getCards, resetCards, setCards } from "./lab-store";
import { getRevise, resetRevise, setRevise } from "./revise-store";

/** One file with everything stored on this device: progress, day journals, second-brain notes, quick captures, review cards and revision history. */
export function exportBackup(): string {
  return JSON.stringify(
    {
      ...JSON.parse(exportGuestState()),
      brain: getBrain().notes,
      cards: getCards().cards,
      clips: getClips().clips,
      revise: getRevise(),
    },
    null,
    2,
  );
}

/** Restore a backup. Older backups without notes or cards leave those untouched. */
export function importBackup(json: string) {
  importGuestState(json);
  const raw = JSON.parse(json) as { brain?: unknown; cards?: unknown; clips?: unknown; revise?: unknown };
  if (Array.isArray(raw.brain)) setBrain({ notes: raw.brain as never });
  if (Array.isArray(raw.clips)) setClips({ clips: raw.clips as never });
  if (raw.cards && typeof raw.cards === "object") setCards({ cards: raw.cards as never });
  if (raw.revise && typeof raw.revise === "object") setRevise(raw.revise as never);
}

export function resetEverything() {
  resetGuestState();
  resetBrain();
  resetCards();
  resetClips();
  resetRevise();
}
