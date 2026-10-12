import { signOut } from "next-auth/react";
import { stopSyncAndClear } from "./sync-client";

/** Pushes anything pending, removes the account's data from this device, then signs out. */
export async function signOutAndClear() {
  await stopSyncAndClear();
  await signOut({ redirectTo: "/" });
}
