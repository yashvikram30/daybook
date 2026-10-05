"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

export function Toc() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    let io: IntersectionObserver | undefined;
    let raf = 0;
    // Re-read the page's headings whenever the article changes (navigation, or focus mode swapping sections).
    const scan = () => {
      // Next keeps the previous page's DOM hidden for fast back navigation, so only count headings you can see,
      // and never list the same id twice.
      const seen = new Set<string>();
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("article h2[id]")).filter((n) => {
        if (seen.has(n.id) || n.getClientRects().length === 0) return false;
        seen.add(n.id);
        return true;
      });
      setHeadings((prev) => {
        const next = nodes.map((n) => ({ id: n.id, text: n.dataset.toc ?? n.textContent ?? "" }));
        return prev.length === next.length && prev.every((h, i) => h.id === next[i].id) ? prev : next;
      });
      setActive((a) => (nodes.some((n) => n.id === a) ? a : (nodes[0]?.id ?? "")));
      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]) setActive(visible[0].target.id);
        },
        { rootMargin: "-80px 0px -65% 0px" },
      );
      nodes.forEach((n) => io!.observe(n));
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    };
    schedule();
    const mo = new MutationObserver(schedule);
    const main = document.getElementById("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io?.disconnect();
    };
  }, [pathname]);

  if (headings.length < 2) return null;
  return (
    <>
      <h2>On this page</h2>
      <ul>
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className={h.id === active ? "on" : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
