"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useSyncExternalStore } from "react";
import { getStatus, stopSyncAndClear, subscribeStatus } from "@/lib/sync-client";

const LABEL = {
  off: "Not syncing",
  syncing: "Saving…",
  synced: "Saved to your account",
  error: "Could not reach the server. Changes are kept here and will retry.",
} as const;

export function AccountPanel() {
  const { data, status } = useSession();
  const sync = useSyncExternalStore(subscribeStatus, getStatus, () => "off" as const);
  if (status === "loading") return null;

  if (!data?.user) {
    return (
      <>
        <p>
          You are using Daybook as a guest, so everything stays in this browser. Sign in with GitHub or Google
          to save it to your account and open it on any device.
        </p>
        <div className="row-actions">
          <Link className="btn primary" href="/signin">
            Sign in
          </Link>
        </div>
      </>
    );
  }
  return (
    <>
      <p>
        Signed in as <b>{data.user.email || data.user.name}</b>. {LABEL[sync]}
      </p>
      <div className="row-actions">
        <button
          className="btn"
          type="button"
          onClick={async () => {
            // Push anything pending, then remove the account's data from this device before leaving.
            await stopSyncAndClear();
            await signOut({ redirectTo: "/" });
          }}
        >
          Sign out
        </button>
      </div>
      <p>
        <small>Signing out removes your progress from this device. It stays in your account.</small>
      </p>
    </>
  );
}
