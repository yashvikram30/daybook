"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { idleSync, startSync } from "@/lib/sync-client";
import { toast } from "@/lib/toast";

function Sync() {
  const { data, status } = useSession();
  const uid = data?.user?.id;

  useEffect(() => {
    if (status === "unauthenticated") idleSync();
    if (status !== "authenticated" || !uid) return;
    let live = true;
    void startSync(uid).then((replaced) => {
      if (!live || !replaced) return;
      toast("Loaded your saved progress");
      // The stores read localStorage once, so a reload is how the account's data shows up everywhere.
      setTimeout(() => location.reload(), 600);
    });
    return () => {
      live = false;
    };
  }, [status, uid]);

  return null;
}

/** Provides the sign-in session to the app and keeps a signed-in user's data saved to the server. */
export function SyncManager({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <Sync />
      {children}
    </SessionProvider>
  );
}
