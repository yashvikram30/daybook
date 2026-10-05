"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type SearchEntry = { href: string; title: string; sub: string; text: string };

export function SearchDialog({
  entries,
  open,
  onClose,
}: {
  entries: SearchEntry[];
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return entries.filter((e) => e.sub === "Page").slice(0, 8);
    return entries
      .map((e) => {
        const hay = (e.title + " " + e.text).toLowerCase();
        if (!terms.every((t) => hay.includes(t))) return null;
        const inTitle = terms.every((t) => e.title.toLowerCase().includes(t));
        return { e, score: inTitle ? 0 : 1 };
      })
      .filter((r): r is { e: SearchEntry; score: number } => r !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, 30)
      .map((r) => r.e);
  }, [entries, query]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[sel]) {
      e.preventDefault();
      go(results[sel].href);
    }
  }

  return (
    <dialog
      ref={ref}
      className="search-dlg"
      aria-label="Search"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <input
        type="search"
        placeholder="Search days, topics and links"
        autoComplete="off"
        aria-label="Search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSel(0);
        }}
        onKeyDown={onKeyDown}
      />
      <ul role="listbox">
        {results.length === 0 && (
          <li className="none">
            No matches. Try a topic like &ldquo;virtual memory&rdquo; or &ldquo;raft&rdquo;.
          </li>
        )}
        {results.map((r, i) => (
          <li key={r.href + r.title} role="option" aria-selected={i === sel}>
            <a
              href={r.href}
              className={i === sel ? "sel" : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(r.href);
              }}
            >
              {r.title}
              <small>{r.sub}</small>
            </a>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
