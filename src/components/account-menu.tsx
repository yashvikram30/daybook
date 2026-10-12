"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOutAndClear } from "@/lib/sign-out";
import { usePopover } from "@/lib/use-popover";
import { Avatar } from "./avatar";

/**
 * Header entry for the account: the user's photo or initial once signed in, a person icon for guests.
 * It opens a small menu with Profile and Settings, and Sign in or Sign out.
 */
export function AccountMenu() {
  const { data, status } = useSession();
  const pathname = usePathname();
  const { open, setOpen, root } = usePopover(pathname);
  if (status === "loading") return null;

  const user = data?.user;
  const name = user?.name || user?.email || null;
  const links = [
    { href: "/profile", label: "Profile" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <div className="more acct" ref={root}>
      <button
        type="button"
        className={"icon-btn account-dot" + (user ? "" : " guest")}
        aria-label={user ? `Account menu for ${name}` : "Account menu"}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="account-pop"
        title={name ?? "Guest"}
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar name={name} image={user?.image} />
      </button>
      {open && (
        <div className="more-pop acct-pop" id="account-pop">
          <div className="acct-head">
            <Avatar name={name} image={user?.image} />
            <div>
              <b>{name ?? "Guest"}</b>
              <small>{user ? (user.name ? user.email : "Signed in") : "Saved in this browser only"}</small>
            </div>
          </div>
          <hr />
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "on" : undefined}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <hr />
          {user ? (
            <button type="button" onClick={() => void signOutAndClear()}>
              Sign out
            </button>
          ) : (
            <Link href="/signin">Sign in</Link>
          )}
        </div>
      )}
    </div>
  );
}
