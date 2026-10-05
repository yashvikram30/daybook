"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition, useCallback, useEffect, useState } from "react";
import { AccountLink } from "./account-link";
import { Icon } from "./icons";
import { MoreMenu } from "./more-menu";
import { NavTree, type NavPhase } from "./nav-tree";
import { QuickCapture } from "./quick-capture";
import { SearchDialog, type SearchEntry } from "./search-dialog";
import { SyncManager } from "./sync-manager";
import { ThemeToggle } from "./theme-toggle";
import { Toaster } from "./toaster";
import { Toc } from "./toc";

export function AppShell({
  phases,
  search,
  children,
}: {
  phases: NavPhase[];
  search: SearchEntry[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const closeNav = useCallback(() => setNavOpen(false), []);

  // Focus mode hides everything but the page; where the browser allows it, it also goes full screen.
  const toggleFocus = useCallback(() => {
    setFocus((on) => {
      const next = !on;
      try {
        if (next) void document.documentElement.requestFullscreen?.()?.catch(() => {});
        else if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
      } catch {
        // No Fullscreen API (some phones): the focused layout still works.
      }
      return next;
    });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "f" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        toggleFocus();
      } else if (e.key === "Escape") {
        setNavOpen(false);
      }
    }
    // Leaving browser full screen with Esc leaves focus mode too.
    function onFullscreen() {
      if (!document.fullscreenElement) setFocus(false);
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [toggleFocus]);

  return (
    <SyncManager>
      <div className="shell" data-focus={focus ? "on" : undefined}>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="top">
          <button
            className="icon-btn menu-btn"
            type="button"
            aria-label="Open navigation"
            aria-expanded={navOpen}
            aria-controls="nav"
            onClick={() => setNavOpen((v) => !v)}
          >
            {Icon.menu}
          </button>
          <Link className="brand" href="/">
            <span className="logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M6 4.5h10.5a1.5 1.5 0 0 1 1.5 1.5v13H7.5A1.5 1.5 0 0 1 6 17.5v-13Z" fill="#fbf8f1" />
                <path d="M13 4.5v7l2-1.4 2 1.4v-7h-4Z" fill="#f4c84a" />
              </svg>
            </span>
            Daybook
          </Link>
          <button
            className="search-btn"
            type="button"
            aria-label="Search the plan"
            onClick={() => setSearchOpen(true)}
          >
            {Icon.search}
            <span>Search</span>
            <kbd>/</kbd>
          </button>
          <span className="grow" />
          <nav className="top-links" aria-label="Sections">
            <Link href="/plan" className={pathname === "/plan" ? "on" : undefined}>
              Plan
            </Link>
            <Link href="/revise" className={pathname === "/revise" ? "on" : undefined}>
              Revise
            </Link>
            <Link href="/notes" className={pathname === "/notes" ? "on" : undefined}>
              Notes
            </Link>
            <MoreMenu onFocus={toggleFocus} />
          </nav>
          <ThemeToggle />
          <AccountLink />
        </header>
        {focus && (
          <button
            className="focus-exit"
            type="button"
            aria-label="Exit focus mode"
            title="Exit focus mode (F)"
            onClick={toggleFocus}
          >
            {Icon.collapse}
            <span>Exit focus</span>
          </button>
        )}
        <div className="layout">
          <nav className={"nav" + (navOpen ? " open" : "")} id="nav" aria-label="Plan navigation">
            <NavTree phases={phases} onNavigate={closeNav} />
          </nav>
          <main id="main" tabIndex={-1}>
            <ViewTransition default="page">{children}</ViewTransition>
          </main>
          <aside className="toc" aria-label="On this page">
            <Toc />
          </aside>
        </div>
        <div className={"scrim" + (navOpen ? " open" : "")} onClick={closeNav} />
        <Toaster />
        <QuickCapture />
        <SearchDialog entries={search} open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </SyncManager>
  );
}
