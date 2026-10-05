"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createNote, titleOf, useBrain } from "@/lib/brain-store";
import { toast } from "@/lib/toast";
import { checkedCount, setDayDone, setItem, setNote, useGuestState } from "@/lib/guest-store";
import { hostOf, type Item } from "@/lib/curriculum-types";

export function ItemRow({ item }: { item: Item }) {
  const guest = useGuestState();
  const checked = !!guest.items[item.key];
  const id = "ck-" + item.key.replace(/[^a-z0-9]/gi, "_");
  const host = hostOf(item.url);
  return (
    <li className={"row" + (checked ? " is-done" : "")}>
      <input
        id={id}
        className="ck"
        type="checkbox"
        checked={checked}
        aria-labelledby={id + "-l"}
        onChange={(e) => setItem(item.key, e.target.checked)}
      />
      <div id={id + "-l"}>
        {item.section === "build" ? (
          <span className="task">{item.title}</span>
        ) : (
          <div className="ttl">
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            ) : (
              <span>{item.title}</span>
            )}
            {item.difficulty ? (
              <span
                className={"diff " + item.difficulty}
                title={{ E: "Easy", M: "Medium", H: "Hard" }[item.difficulty]}
              >
                {item.difficulty}
              </span>
            ) : null}
            {host && <span className="host">{host}</span>}
            {item.note && <span className="note">{item.note}</span>}
          </div>
        )}
      </div>
    </li>
  );
}

export function CompleteBar({
  dayId,
  total,
  next,
}: {
  dayId: string;
  total: number;
  next: { href: string; title: string } | null;
}) {
  const guest = useGuestState();
  const done = !!guest.done[dayId];
  const checked = checkedCount(guest, dayId);
  return (
    <div className="complete-bar">
      <div className="cb-progress">
        <span aria-live="polite">
          {checked} of {total} items checked
        </span>
        <div className="bar" aria-hidden="true">
          <span style={{ width: `${(checked / total) * 100}%` }} />
        </div>
      </div>
      <div className="cb-actions">
        {done && next && (
          <Link className="btn" href={next.href}>
            Next day
          </Link>
        )}
        <button
          className={"btn primary" + (done ? " on" : "")}
          type="button"
          aria-pressed={done}
          onClick={() => {
            setDayDone(dayId, !done);
            toast(done ? "Day marked incomplete" : "Day marked complete");
          }}
        >
          {done ? "Day complete" : "Mark day complete"}
        </button>
      </div>
    </div>
  );
}

const DAY_PROMPTS = ["What I learned", "What broke", "What to revisit"];

export function Notes({ dayId }: { dayId: string }) {
  const guest = useGuestState();
  const brain = useBrain();
  const router = useRouter();
  const saved = guest.notes[dayId] ?? "";
  // Local draft so typing never fights the store; saved after a short pause.
  const [draft, setDraft] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [status, setStatus] = useState("");
  useEffect(() => () => clearTimeout(timer.current), []);
  const text = draft ?? saved;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const linked = brain.notes.filter((n) => n.day === dayId);

  function change(v: string) {
    setDraft(v);
    setStatus("Saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setNote(dayId, v);
      setDraft(null);
      setStatus("Saved on this device");
    }, 400);
  }

  return (
    <div className="daynotes">
      <label className="field-label" htmlFor="notes">
        Today&apos;s journal
      </label>
      {!text && (
        <div className="tpl-row">
          <span>Start from</span>
          {DAY_PROMPTS.map((p) => (
            <button key={p} type="button" onClick={() => change(`## ${p}\n`)}>
              {p}
            </button>
          ))}
          <button type="button" onClick={() => change(DAY_PROMPTS.map((p) => `## ${p}\n\n`).join(""))}>
            All three
          </button>
        </div>
      )}
      <textarea
        id="notes"
        className="notes"
        placeholder="In your own words: what clicked, what broke, what to come back to. Markdown works."
        value={text}
        onChange={(e) => change(e.target.value)}
      />
      <p className="host" aria-live="polite">
        {status || "Saves automatically on this device."}{" "}
        {words > 0 && `· ${words} ${words === 1 ? "word" : "words"}`}
      </p>
      <div className="daynotes-brain">
        <div>
          <h3>In your second brain</h3>
          {linked.length > 0 ? (
            <ul>
              {linked.map((n) => (
                <li key={n.id}>
                  <Link href={`/notes?n=${n.id}`}>{titleOf(n)}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="host">
              No linked notes yet. A longer idea, a diagram or a question deserves its own note.
            </p>
          )}
        </div>
        <div className="daynotes-actions">
          <button
            className="btn"
            type="button"
            onClick={() => router.push(`/notes?n=${createNote({ day: dayId })}`)}
          >
            New note about this day
          </button>
          {saved && (
            <Link className="linkbtn" href={`/notes?n=day:${dayId}`}>
              Preview this journal
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
