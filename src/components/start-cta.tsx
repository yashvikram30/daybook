"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * "Pick your start date" button. The user stays on the page while the session is being checked,
 * then goes to /start (signed in) or /signin (signed out), so neither page flashes by.
 */
export function StartCta({ className, children }: { className: string; children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useSession();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!clicked || status === "loading") return;
    router.push(status === "authenticated" ? "/start" : "/signin?next=/start");
  }, [clicked, status, router]);

  return (
    <Link
      className={className}
      href="/start"
      aria-busy={clicked}
      onClick={(e) => {
        e.preventDefault();
        setClicked(true);
      }}
      style={clicked ? { opacity: 0.7, pointerEvents: "none" } : undefined}
    >
      {children}
    </Link>
  );
}
