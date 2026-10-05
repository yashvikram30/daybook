"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { KIND_LABEL, labKey, type LabExercise } from "@/data/labs";
import { createNote } from "@/lib/brain-store";
import { setItem, useGuestState } from "@/lib/guest-store";
import { gradeCard, isDue, useCards } from "@/lib/lab-store";
import { useHydrated, useToday } from "@/lib/plan-store";
import { toast } from "@/lib/toast";

export type LabCard = { id: string; q: string; week: number; dayTitle: string; href: string };
export type LabProblem = {
  key: string;
  title: string;
  url: string | null;
  difficulty: "E" | "M" | "H" | null;
  week: number;
  topic: string;
};
type LabDay = { id: string; title: string; href: string };

const ROUND = 8;

function shuffle<T>(a: T[]): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function LabClient({
  week,
  weekTitle,
  exercises,
  cards,
  problems,
  days,
}: {
  week: number;
  weekTitle: string;
  exercises: LabExercise[];
  cards: LabCard[];
  problems: LabProblem[];
  days: LabDay[];
}) {
  const hydrated = useHydrated();
  const guest = useGuestState();
  const router = useRouter();
  const doneEx = exercises.filter((_, i) => guest.items[labKey(week, i)]).length;
  const mine = problems.filter((p) => p.week === week);
  const open = mine.filter((p) => !guest.items[p.key]);

  function weekNote() {
    const body = [
      `## Week ${week}: ${weekTitle}`,
      "",
      "What I can do now that I could not a week ago:",
      "",
      "## Connections",
      ...days.map((d) => `- [[${d.title}]]`),
      "",
      "## Still shaky",
      "- [ ] ",
      "",
      `#week-${week} #retrospective`,
      "",
    ].join("\n");
    router.push(`/notes?n=${createNote({ title: `Week ${week} retrospective`, body })}`);
  }

  return (
    <>
      <div className="lab-summary" aria-live="polite">
        <div>
          <b>{hydrated ? doneEx : 0}</b>
          <span>of {exercises.length} exercises</span>
        </div>
        <div>
          <b>{hydrated ? mine.length - open.length : 0}</b>
          <span>of {mine.length} problems this week</span>
        </div>
        <p>
          This day is optional and has no date. Take it on a rest day, or skip it when you are short of time.
          The review round is worth doing even alone.
        </p>
      </div>

      <h2 id="retrieval">Retrieval round</h2>
      <p className="sect-sub">
        Questions from this week and earlier ones, picked by what is due. Say each answer out loud before you
        grade yourself.
      </p>
      <p className="sect-sub">
        Want a wider mix? <Link href={`/revise?w=${week}`}>Quiz this week</Link> with multiple choice,
        fill-in-the-blank, code snippets and flashcards.
      </p>
      {hydrated ? (
        <Round
          cards={cards}
          inFocus={(c) => c.week === week}
          newLabel="new this week"
          noteTitle={`Week ${week} review gaps`}
          tag={`week-${week}`}
        />
      ) : null}

      <h2 id="hands-on">Hands-on exercises</h2>
      <ul className="list">
        {exercises.map((ex, i) => (
          <ExerciseRow key={i} itemKey={labKey(week, i)} tag={`week-${week}`} ex={ex} />
        ))}
      </ul>

      <h2 id="revisit">Problems to revisit</h2>
      {hydrated && open.length > 0 ? (
        <>
          <p className="sect-sub">
            Still unchecked from this week. Tick them here and they count in the days they belong to.
          </p>
          <ul className="list">
            {open.slice(0, 8).map((p) => (
              <li key={p.key} className="row">
                <input
                  id={"rv-" + p.key.replace(/[^a-z0-9]/gi, "_")}
                  className="ck"
                  type="checkbox"
                  checked={!!guest.items[p.key]}
                  aria-label={p.title}
                  onChange={(e) => setItem(p.key, e.target.checked)}
                />
                <div>
                  <div className="ttl">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        {p.title}
                      </a>
                    ) : (
                      <span>{p.title}</span>
                    )}
                    {p.difficulty && <span className={"diff " + p.difficulty}>{p.difficulty}</span>}
                  </div>
                  <div className="host">{p.topic}</div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : hydrated ? (
        <p className="sect-sub">Every problem from this week is checked off. Try one from scratch below.</p>
      ) : null}
      <Redo problems={problems} since={`week ${week}`} />

      <h2 id="wrap">Close the week</h2>
      <div className="wrap-up">
        <p>
          Write a short note in your second brain. It starts with links to this week&apos;s four days, so the
          week stays connected to what you wrote later.
        </p>
        <button className="btn primary" type="button" onClick={weekNote}>
          Write the week {week} note
        </button>
        <Link className="btn" href="/notes">
          Open second brain
        </Link>
      </div>
    </>
  );
}

export function ExerciseRow({ itemKey: key, tag, ex }: { itemKey: string; tag: string; ex: LabExercise }) {
  const guest = useGuestState();
  const router = useRouter();
  const checked = !!guest.items[key];
  const id = "ex-" + key.replace(/[^a-z0-9]/gi, "_");
  return (
    <li className={"row ex" + (checked ? " is-done" : "")}>
      <input
        id={id}
        className="ck"
        type="checkbox"
        checked={checked}
        aria-labelledby={id + "-l"}
        onChange={(e) => setItem(key, e.target.checked)}
      />
      <div id={id + "-l"}>
        <div className="ttl">
          <span className={"kind " + ex.kind}>{KIND_LABEL[ex.kind]}</span>
          <strong>{ex.title}</strong>
          <span className="host">{ex.minutes} min</span>
        </div>
        <p className="ex-prompt">{ex.prompt}</p>
        <button
          className="linkbtn"
          type="button"
          onClick={() => {
            const body = `## The exercise\n${ex.prompt}\n\n## What I found\n\n## What surprised me\n\n#lab #${tag}\n`;
            router.push(`/notes?n=${createNote({ title: ex.title, body })}`);
          }}
        >
          Write up what you found
        </button>
      </div>
    </li>
  );
}

/** A spaced-review round. Cards that are due come first, then new ones from the focus, then new earlier ones. */
export function Round({
  cards,
  inFocus,
  newLabel,
  noteTitle,
  tag,
  size = ROUND,
  dueFirst = 5,
}: {
  cards: LabCard[];
  inFocus: (c: LabCard) => boolean;
  newLabel: string;
  noteTitle: string;
  tag: string;
  size?: number;
  dueFirst?: number;
}) {
  const stored = useCards().cards;
  const today = useToday();
  const router = useRouter();
  const [queue, setQueue] = useState<LabCard[] | null>(null);
  const [pos, setPos] = useState(0);
  const [missed, setMissed] = useState<LabCard[]>([]);
  const [recalled, setRecalled] = useState(0);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());

  const due = today ? cards.filter((c) => isDue(stored[c.id], today)) : [];
  const fresh = cards.filter((c) => !stored[c.id]);
  const freshInFocus = fresh.filter(inFocus).length;

  function start() {
    const sortedDue = [...due].sort((a, b) => stored[a.id].due.localeCompare(stored[b.id].due));
    const pick = sortedDue.slice(0, dueFirst);
    for (const c of shuffle(fresh.filter(inFocus))) if (pick.length < size) pick.push(c);
    for (const c of shuffle(fresh.filter((c) => !inFocus(c)))) if (pick.length < size) pick.push(c);
    for (const c of sortedDue.slice(dueFirst)) if (pick.length < size) pick.push(c);
    setQueue(shuffle(pick));
    setPos(0);
    setMissed([]);
    setRecalled(0);
    setRequeued(new Set());
  }

  function answer(card: LabCard, ok: boolean) {
    gradeCard(card.id, ok);
    if (ok) setRecalled((n) => n + 1);
    else {
      setMissed((m) => (m.some((x) => x.id === card.id) ? m : [...m, card]));
      // A missed card comes back once more in the same round.
      if (!requeued.has(card.id)) {
        setRequeued(new Set(requeued).add(card.id));
        setQueue((q) => (q ? [...q, card] : q));
      }
    }
    setPos((p) => p + 1);
  }

  function saveMissed() {
    const lines = missed.map((c) => `- [ ] ${c.q} ([[${c.dayTitle}]])`);
    const body = `## Questions I could not answer\n${lines.join("\n")}\n\n#${tag} #review\n`;
    router.push(`/notes?n=${createNote({ title: noteTitle, body })}`);
    toast("Saved to your second brain");
  }

  if (!queue) {
    const total = Math.min(size, due.length + fresh.length);
    return (
      <div className="round idle">
        <div>
          <b>{due.length}</b>
          <span>due for review</span>
        </div>
        <div>
          <b>{freshInFocus}</b>
          <span>{newLabel}</span>
        </div>
        <button className="btn primary" type="button" onClick={start} disabled={total === 0}>
          {total === 0 ? "All caught up" : `Start a round of ${total}`}
        </button>
        <p>A card you recall comes back after 1, 3, 7, then 14 days. One you miss comes back today.</p>
      </div>
    );
  }

  const card = queue[pos];
  if (!card) {
    return (
      <div className="round done">
        <h3>
          {recalled} recalled, {missed.length} to revisit
        </h3>
        {missed.length > 0 && (
          <ul>
            {missed.map((c) => (
              <li key={c.id}>
                <Link href={c.href}>{c.dayTitle}</Link>
                <span>{c.q}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="round-actions">
          {missed.length > 0 && (
            <button className="btn primary" type="button" onClick={saveMissed}>
              Save the gaps as a note
            </button>
          )}
          <button className="btn" type="button" onClick={() => setQueue(null)}>
            Finish
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="round live" key={card.id + ":" + pos}>
      <div className="round-top">
        <span>
          Question {pos + 1} of {queue.length}
        </span>
        <span className="host">
          Week {card.week}: {card.dayTitle}
        </span>
      </div>
      <p className="round-q">{card.q}</p>
      <div className="round-actions">
        <button className="btn primary" type="button" onClick={() => answer(card, true)}>
          I could explain it
        </button>
        <button className="btn" type="button" onClick={() => answer(card, false)}>
          Not yet
        </button>
        <Link className="linkbtn" href={card.href} target="_blank">
          Reopen that day
        </Link>
      </div>
    </div>
  );
}

export function Redo({ problems, since }: { problems: LabProblem[]; since: string }) {
  const guest = useGuestState();
  const [pick, setPick] = useState<LabProblem | null>(null);
  function choose() {
    const solved = problems.filter((p) => guest.items[p.key] && p.key !== pick?.key);
    const pool = solved.length ? solved : problems.filter((p) => p.key !== pick?.key);
    setPick(pool[Math.floor(Math.random() * pool.length)] ?? null);
  }
  return (
    <div className="redo">
      <div>
        <h3>Redo one from scratch</h3>
        <p>
          Pick a problem you already solved in {since} or earlier. Set 25 minutes and write it again without
          looking. If you cannot, that is the one to revisit.
        </p>
      </div>
      <button className="btn" type="button" onClick={choose}>
        {pick ? "Another one" : "Pick one for me"}
      </button>
      {pick && (
        <div className="redo-pick" aria-live="polite">
          {pick.url ? (
            <a href={pick.url} target="_blank" rel="noopener noreferrer">
              {pick.title}
            </a>
          ) : (
            <b>{pick.title}</b>
          )}
          {pick.difficulty && <span className={"diff " + pick.difficulty}>{pick.difficulty}</span>}
          <span className="host">
            Week {pick.week} · {pick.topic}
          </span>
        </div>
      )}
    </div>
  );
}
