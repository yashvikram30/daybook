"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

const ITEMS = [
  { href: "/foundations", label: "Part 0: Foundations", tag: "Optional", match: "prefix" },
  { href: "/python", label: "Learn Python", match: "exact" },
  { href: "/schedule", label: "Schedule", match: "exact" },
  { href: "/settings", label: "Settings", match: "exact" },
] as const;

/** The rarely used pages and actions, kept out of the header until asked for. */
export function MoreMenu({ onFocus }: { onFocus: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) {
    setSeen(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = ITEMS.some((i) =>
    i.match === "prefix" ? pathname.startsWith(i.href) : pathname === i.href,
  );

  return (
    <div className="more" ref={root}>
      <button
        type="button"
        className={"more-btn" + (active ? " on" : "")}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="more-pop"
        onClick={() => setOpen((v) => !v)}
      >
        More
        <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="more-pop" id="more-pop">
          {ITEMS.map((i) => {
            const on = i.match === "prefix" ? pathname.startsWith(i.href) : pathname === i.href;
            return (
              <Link
                key={i.href}
                href={i.href}
                className={on ? "on" : undefined}
                aria-current={on ? "page" : undefined}
              >
                {i.label}
                {"tag" in i && <small>{i.tag}</small>}
              </Link>
            );
          })}
          <hr />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onFocus();
            }}
          >
            {Icon.expand}
            Focus mode
            <kbd>F</kbd>
          </button>
        </div>
      )}
    </div>
  );
}
