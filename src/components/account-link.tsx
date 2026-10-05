"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

/** Header entry: "Sign in" for guests, the user's initial (linking to the account settings) once signed in. */
export function AccountLink() {
  const { data, status } = useSession();
  if (status === "loading") return null;
  if (!data?.user) {
    return (
      <Link className="btn account-btn" href="/signin">
        Sign in
      </Link>
    );
  }
  const name = data.user.name || data.user.email || "Account";
  return (
    <Link
      className="icon-btn account-dot"
      href="/settings#account"
      aria-label={`Signed in as ${name}`}
      title={name}
    >
      {name.trim().charAt(0).toUpperCase()}
    </Link>
  );
}
