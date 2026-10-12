"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const VID_KEY = "csplan.vid";
const SID_KEY = "csplan.sid";

function id(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

/** Reads an id from the store, creating it the first time. `fresh` is true when it was just made. */
function stored(store: Storage, key: string): { value: string; fresh: boolean } {
  try {
    const have = store.getItem(key);
    if (have) return { value: have, fresh: false };
    const value = id();
    store.setItem(key, value);
    return { value, fresh: true };
  } catch {
    // Storage blocked: every view then looks like a new visitor, which is better than none.
    return { value: id(), fresh: true };
  }
}

let last = { path: "", at: 0 };

/**
 * Sends one page view per route change to /api/track, for the owner-only dashboard at /analytics.
 * No third party is involved. Respects Do Not Track and Global Privacy Control.
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/analytics")) return;
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
    // Strict Mode runs effects twice in development.
    const now = Date.now();
    if (last.path === pathname && now - last.at < 1000) return;
    last = { path: pathname, at: now };

    const vid = stored(localStorage, VID_KEY).value;
    const session = stored(sessionStorage, SID_KEY);
    void fetch("/api/track", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vid,
        sid: session.value,
        path: pathname,
        // The referrer only describes how the session began.
        ref: session.fresh ? document.referrer || null : null,
        lang: navigator.language,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
