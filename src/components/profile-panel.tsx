"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSyncExternalStore } from "react";
import { useGuestState } from "@/lib/guest-store";
import { useBrain } from "@/lib/brain-store";
import { useHydrated, usePlan, useToday } from "@/lib/plan-store";
import { bestStreak, currentStreak } from "@/lib/streak";
import { signOutAndClear } from "@/lib/sign-out";
import { getStatus, subscribeStatus } from "@/lib/sync-client";
import { Avatar } from "./avatar";

const SYNC = {
  off: "Not syncing",
  syncing: "Saving…",
  synced: "Saved to your account",
  error: "Cannot reach the server. Changes are kept here and will retry.",
} as const;

// The pill beside your name needs a short label; the Storage row below has the full sentence.
const SYNC_SHORT = {
  off: "Not syncing",
  syncing: "Saving…",
  synced: "Saved to your account",
  error: "Offline, will retry",
} as const;

const PROVIDERS: Record<string, string> = { google: "Google", github: "GitHub" };

function Stat({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="pf-stat">
      <small>{label}</small>
      <b>{value}</b>
      {note && <span>{note}</span>}
    </div>
  );
}

/** Who you are and how far along you are. Plan, theme and backups live in Settings. */
export function ProfilePanel({ totalDays }: { totalDays: number }) {
  const { data, status } = useSession();
  const sync = useSyncExternalStore(subscribeStatus, getStatus, () => "off" as const);
  const hydrated = useHydrated();
  const guest = useGuestState();
  const brain = useBrain();
  const plan = usePlan();
  const today = useToday();
  if (status === "loading" || !hydrated) return null;

  const user = data?.user;
  const done = Object.keys(guest.done).length;
  const checked = Object.keys(guest.items).length;
  const pct = totalDays ? Math.min(100, Math.round((done / totalDays) * 100)) : 0;
  const streak = plan && today ? currentStreak(guest.activity, plan.studyDays, today) : 0;
  const best = plan ? Math.max(streak, bestStreak(guest.activity, plan.studyDays)) : 0;
  const provider = user?.id ? (PROVIDERS[user.id.split(":")[0]] ?? "your account") : null;

  return (
    <div className="pf">
      <section className="pf-hero">
        <span className="pf-avatar">
          <Avatar name={user?.name || user?.email} image={user?.image} />
        </span>
        <div className="pf-id">
          <h2>{user ? user.name || user.email : "Guest"}</h2>
          <p>{user ? (user.name ? user.email : null) : "Everything is saved in this browser only."}</p>
        </div>
        {user ? (
          <span className="pf-sync" data-state={sync} role="status">
            <i aria-hidden="true" />
            {SYNC_SHORT[sync]}
          </span>
        ) : (
          <Link className="btn primary" href="/signin">
            Sign in
          </Link>
        )}
      </section>

      <section className="pf-progress" aria-label="Progress">
        <div className="pf-bar-head">
          <b>
            {done} of {totalDays} days complete
          </b>
          <span>{pct}%</span>
        </div>
        <div className="pf-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section className="pf-stats" aria-label="Activity">
        <Stat
          label="Streak"
          value={plan ? `${streak} ${streak === 1 ? "day" : "days"}` : "–"}
          note={plan ? `Best ${best}` : "Set a plan to track"}
        />
        <Stat label="Items checked" value={checked} />
        <Stat label="Notes" value={brain.notes.length} note="In your second brain" />
      </section>

      {user ? (
        <section className="st-card">
          <div className="st-head">
            <div>
              <h2>Account</h2>
              <p>Your progress and notes are saved to this account and follow you to any device.</p>
            </div>
          </div>
          <dl className="pf-facts">
            <div>
              <dt>Email</dt>
              <dd>{user.email ?? "–"}</dd>
            </div>
            <div>
              <dt>Signed in with</dt>
              <dd>{provider}</dd>
            </div>
            <div>
              <dt>Storage</dt>
              <dd>{SYNC[sync]}</dd>
            </div>
          </dl>
          <div className="st-foot">
            <button className="btn" type="button" onClick={() => void signOutAndClear()}>
              Sign out
            </button>
            <small>Signing out removes your progress from this device. It stays in your account.</small>
          </div>
        </section>
      ) : (
        <section className="st-card pf-guest">
          <h2>Keep your progress safe</h2>
          <p>
            As a guest, your progress and notes live in this browser, and clearing site data would remove
            them. Sign in with Google to save them to an account and pick up on any device.
          </p>
          <div className="st-foot">
            <Link className="btn primary" href="/signin">
              Sign in with Google
            </Link>
            <small>
              Or <Link href="/settings#data">download a backup</Link> from Settings.
            </small>
          </div>
        </section>
      )}

      <p className="pf-more">
        <Link href="/settings">Plan, appearance and backups are in Settings →</Link>
      </p>
    </div>
  );
}
