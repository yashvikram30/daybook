"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { safeNext } from "./signin-buttons";

/** Placeholder with the same split layout as the sign-in screen, shown while the session is checked. */
export function AuthSkeleton() {
  return (
    <div className="auth auth-skel" role="status" aria-label="Checking your session">
      <div className="auth-aside" />
      <div className="auth-main">
        <div className="auth-card">
          <span className="skel skel-title" />
          <span className="skel skel-btn" />
          <span className="skel skel-line" />
        </div>
      </div>
    </div>
  );
}

/**
 * Shows a skeleton while the session loads, then either the sign-in screen (signed out)
 * or a redirect to `?next` (signed in), so a signed-in user never sees the sign-in page flash by.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useSession();
  const dest = safeNext(useSearchParams().get("next") ?? undefined);

  useEffect(() => {
    if (status === "authenticated") router.replace(dest);
  }, [status, dest, router]);

  if (status !== "unauthenticated") return <AuthSkeleton />;
  return <>{children}</>;
}
