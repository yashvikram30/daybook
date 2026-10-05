"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "@/data/revision";
import { QUESTION_TYPES, SECTIONS } from "@/data/revision/meta";
import { SEC_LABEL, TYPE_LABEL, type Question } from "@/data/revision/types";
import { WEEKS_PER_MONTH } from "@/data/months";
import { createNote } from "@/lib/brain-store";
import { useGuestState } from "@/lib/guest-store";
import {
  answerText,
  interleave,
  matching,
  pickQuestions,
  prepare,
  type Config,
  type Prepared,
} from "@/lib/revise-engine";
import { recordAnswers, savePrefs, useRevise } from "@/lib/revise-store";
import { toast } from "@/lib/toast";
import { QuestionCard, Rich, type Outcome } from "./revise-question";

export type ReviseWeek = { number: number; title: string; phase: string; days: string[] };
export type RevisePhase = { slug: string; name: string };

const SIZES = [10, 20, 30, 50, 0];
const DEFAULT_SIZE = 20;

type Session = { items: Prepared[]; answers: Outcome[]; pos: number };

function parseWeeks(raw: string | null, max: number): number[] | null {
  if (!raw) return null;
  const out = raw
    .split(",")
    .map((s) => Number(s))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= max);
  return out.length ? [...new Set(out)].sort((a, b) => a - b) : null;
}

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function ReviseClient({ weeks, phases }: { weeks: ReviseWeek[]; phases: RevisePhase[] }) {
  const params = useSearchParams();
  const stored = useRevise();
  const guest = useGuestState();
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  const maxWeek = weeks.length;
  const doneWeeks = weeks.filter((w) => w.days.some((d) => guest.done[d])).map((w) => w.number);
  const base: Config = {
    weeks: parseWeeks(params.get("w"), maxWeek) ?? stored.prefs.weeks ?? doneWeeks,
    secs: stored.prefs.secs ?? [...SECTIONS],
    types: stored.prefs.types ?? [...QUESTION_TYPES],
    size: stored.prefs.size ?? DEFAULT_SIZE,
  };
  const [draft, setDraft] = useState<Config | null>(null);
  const cfg = draft ?? base;
  const patch = (p: Partial<Config>) => setDraft({ ...cfg, ...p });

  const [session, setSession] = useState<Session | null>(null);

  const pool = matching(QUESTIONS, cfg);
  const missed = pool.filter((q) => stored.stats[q.id] && !stored.stats[q.id].lastOk);
  const sessionSize = cfg.size > 0 ? Math.min(cfg.size, pool.length) : pool.length;

  const pos = session?.pos;
  useEffect(() => {
    if (pos !== undefined) topRef.current?.scrollIntoView({ block: "nearest" });
  }, [pos]);

  function begin(items: Question[]) {
    savePrefs(cfg);
    setSession({ items: items.map((q) => prepare(q)), answers: [], pos: 0 });
  }

  function start() {
    begin(pickQuestions(QUESTIONS, cfg, stored.stats));
  }

  function startMissed() {
    begin(pickQuestions(missed, { ...cfg, size: 0 }, stored.stats));
  }

  function onAnswer(o: Outcome) {
    if (!session) return;
    recordAnswers([{ id: session.items[session.pos].q.id, ok: o.result.ok }]);
    setSession((s) => (s ? { ...s, answers: [...s.answers, o] } : s));
  }

  function onNext() {
    setSession((s) => (s ? { ...s, pos: s.pos + 1 } : s));
  }

  function endNow() {
    setSession((s) => (s ? { ...s, pos: s.items.length } : s));
  }

  if (session && session.pos < session.items.length) {
    const { items, answers, pos: at } = session;
    const right = answers.filter((a) => a.result.ok).length;
    return (
      <div ref={topRef}>
        <div className="rv-top">
          <b>
            Question {at + 1} of {items.length}
          </b>
          <span>{right} right so far</span>
          <span className="grow" />
          <button className="linkbtn" type="button" onClick={endNow}>
            End session
          </button>
        </div>
        <div
          className="rv-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={at}
          aria-label="Session progress"
        >
          <i style={{ width: (at / items.length) * 100 + "%" }} />
        </div>
        <QuestionCard
          key={at}
          p={items[at]}
          position={at}
          total={items.length}
          isLast={at === items.length - 1}
          onAnswer={onAnswer}
          onNext={onNext}
        />
      </div>
    );
  }

  if (session) {
    return (
      <Results
        session={session}
        weeks={weeks}
        onRetry={(qs) => begin(interleave(qs))}
        onAgain={start}
        onChange={() => setSession(null)}
        onNote={(title, body) => {
          router.push(`/notes?n=${createNote({ title, body })}`);
          toast("Saved to your second brain");
        }}
      />
    );
  }

  const countFor = (week: number) => matching(QUESTIONS, { ...cfg, weeks: [week] }).length;
  const solid = (week: number) => {
    const qs = QUESTIONS.filter((q) => q.week === week);
    const good = qs.filter((q) => stored.stats[q.id]?.lastOk).length;
    return qs.length ? good / qs.length : 0;
  };

  return (
    <div className="rv-pick">
      <section className="rv-group" aria-labelledby="rv-w">
        <h2 id="rv-w">1. Choose the weeks</h2>
        <div className="rv-quick">
          <button className="btn" type="button" onClick={() => patch({ weeks: weeks.map((w) => w.number) })}>
            All weeks
          </button>
          {Array.from({ length: Math.ceil(maxWeek / WEEKS_PER_MONTH) }, (_, m) => {
            const from = m * WEEKS_PER_MONTH + 1;
            const to = Math.min(maxWeek, from + WEEKS_PER_MONTH - 1);
            return (
              <button
                key={m}
                className="btn"
                type="button"
                onClick={() => patch({ weeks: Array.from({ length: to - from + 1 }, (_, i) => from + i) })}
              >
                Weeks {from}-{to}
              </button>
            );
          })}
          {doneWeeks.length > 0 && (
            <button className="btn" type="button" onClick={() => patch({ weeks: doneWeeks })}>
              Weeks I have started
            </button>
          )}
          <button className="btn" type="button" onClick={() => patch({ weeks: [] })}>
            Clear
          </button>
        </div>
        {phases.map((ph) => {
          const ws = weeks.filter((w) => w.phase === ph.slug);
          if (!ws.length) return null;
          return (
            <div key={ph.slug} style={{ marginBottom: 18 }}>
              <h3>{ph.name}</h3>
              <div className="rv-weeks">
                {ws.map((w) => {
                  const n = countFor(w.number);
                  const s = solid(w.number);
                  return (
                    <label key={w.number} className="rv-week">
                      <input
                        type="checkbox"
                        checked={cfg.weeks.includes(w.number)}
                        onChange={() => patch({ weeks: toggle(cfg.weeks, w.number).sort((a, b) => a - b) })}
                      />
                      <b>Week {w.number}</b>
                      <span>{w.title}</span>
                      <span className="rv-meta">
                        <span>{n} questions</span>
                        {s > 0 && <span>{Math.round(s * 100)}% solid</span>}
                      </span>
                      <span className="rv-bar" aria-hidden="true">
                        <i style={{ width: s * 100 + "%" }} />
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      <section className="rv-group" aria-labelledby="rv-s">
        <h2 id="rv-s">2. Which parts of the day</h2>
        <div className="rv-opts">
          {SECTIONS.map((s) => (
            <label key={s} className="rv-toggle">
              <input
                type="checkbox"
                checked={cfg.secs.includes(s)}
                onChange={() => patch({ secs: toggle(cfg.secs, s) })}
              />
              {SEC_LABEL[s]}
            </label>
          ))}
        </div>
      </section>

      <section className="rv-group" aria-labelledby="rv-t">
        <h2 id="rv-t">3. Which kinds of question</h2>
        <div className="rv-opts">
          {QUESTION_TYPES.map((t) => (
            <label key={t} className="rv-toggle">
              <input
                type="checkbox"
                checked={cfg.types.includes(t)}
                onChange={() => patch({ types: toggle(cfg.types, t) })}
              />
              {TYPE_LABEL[t]}
            </label>
          ))}
        </div>
      </section>

      <section className="rv-group" aria-labelledby="rv-n">
        <h2 id="rv-n">4. How many</h2>
        <div className="rv-opts" role="radiogroup" aria-label="Session length">
          {SIZES.map((n) => (
            <label key={n} className="rv-toggle">
              <input
                type="radio"
                name="rv-size"
                checked={cfg.size === n}
                onChange={() => patch({ size: n })}
              />
              {n === 0 ? "Everything" : n}
            </label>
          ))}
        </div>
      </section>

      <div className="rv-start">
        <p aria-live="polite">
          {cfg.weeks.length === 0 ? (
            "Pick at least one week to begin."
          ) : pool.length === 0 ? (
            "Nothing matches these choices. Turn on more parts of the day or kinds of question."
          ) : (
            <>
              <b>{pool.length}</b> questions match. This session asks <b>{sessionSize}</b>, shared evenly
              across {cfg.weeks.length} {cfg.weeks.length === 1 ? "week" : "weeks"}, with new and missed ones
              first.
            </>
          )}
        </p>
        {missed.length > 0 && (
          <button className="btn" type="button" onClick={startMissed}>
            Practise the {missed.length} I missed
          </button>
        )}
        <button className="btn primary big" type="button" onClick={start} disabled={pool.length === 0}>
          Start revising
        </button>
      </div>
    </div>
  );
}

function pct(n: number, d: number) {
  return d ? Math.round((n / d) * 100) : 0;
}

function Results({
  session,
  weeks,
  onRetry,
  onAgain,
  onChange,
  onNote,
}: {
  session: Session;
  weeks: ReviseWeek[];
  onRetry: (qs: Question[]) => void;
  onAgain: () => void;
  onChange: () => void;
  onNote: (title: string, body: string) => void;
}) {
  const rows = session.answers.map((a, i) => ({ q: session.items[i].q, a }));
  const right = rows.filter((r) => r.a.result.ok).length;
  const wrong = rows.filter((r) => !r.a.result.ok);
  const score = pct(right, rows.length);

  const byWeek = [...new Set(rows.map((r) => r.q.week))]
    .sort((a, b) => a - b)
    .map((w) => {
      const mine = rows.filter((r) => r.q.week === w);
      return { label: `Week ${w}`, good: mine.filter((r) => r.a.result.ok).length, total: mine.length };
    });
  const byType = [...new Set(rows.map((r) => r.q.t))].map((t) => {
    const mine = rows.filter((r) => r.q.t === t);
    return { label: TYPE_LABEL[t], good: mine.filter((r) => r.a.result.ok).length, total: mine.length };
  });

  function saveNote() {
    const lines = wrong.map(
      (r) =>
        `- [ ] Week ${r.q.week}: ${r.q.t === "card" ? r.q.front : r.q.q}\n  - Answer: ${answerText(r.q)}`,
    );
    const tags = [...new Set(wrong.map((r) => `#week-${r.q.week}`))].join(" ");
    onNote("Revision gaps", `## Questions I missed\n${lines.join("\n")}\n\n${tags} #revision\n`);
  }

  if (rows.length === 0)
    return (
      <div className="rv-score">
        <p>You ended the session before answering anything.</p>
        <button className="btn primary" type="button" onClick={onChange}>
          Back to setup
        </button>
      </div>
    );

  return (
    <>
      <div className="rv-score" role="status">
        <div>
          <b>
            {right}/{rows.length}
          </b>
          <span>{score}% right</span>
        </div>
        <p>
          {score >= 90
            ? "Solid. These weeks are in good shape."
            : score >= 70
              ? "Good. A few gaps worth closing below."
              : score >= 40
                ? "Patchy. Reread the days behind the misses, then try again."
                : "Rough one, and that is useful: you now know where to look."}
        </p>
      </div>

      <div className="rv-breakdown">
        <Breakdown title="By week" rows={byWeek} />
        <Breakdown title="By kind of question" rows={byType} />
      </div>

      <div className="rv-actions" style={{ marginBottom: 24 }}>
        {wrong.length > 0 && (
          <button className="btn primary" type="button" onClick={() => onRetry(wrong.map((r) => r.q))}>
            Retry the {wrong.length} I missed
          </button>
        )}
        <button className="btn" type="button" onClick={onAgain}>
          New questions, same setup
        </button>
        <button className="btn" type="button" onClick={onChange}>
          Change the weeks
        </button>
        {wrong.length > 0 && (
          <button className="linkbtn" type="button" onClick={saveNote}>
            Save the gaps as a note
          </button>
        )}
      </div>

      {wrong.length > 0 && (
        <>
          <h2 id="missed">What you missed</h2>
          <div className="rv-missed">
            {wrong.map((r) => (
              <details key={r.q.id}>
                <summary>
                  <Rich text={r.q.t === "card" ? r.q.front : r.q.q} />
                  <small>
                    Week {r.q.week} · {weeks.find((w) => w.number === r.q.week)?.title}
                  </small>
                </summary>
                <p>
                  <b>Answer:</b> <Rich text={answerText(r.q)} />
                </p>
                {r.q.t !== "card" && r.q.why && (
                  <p>
                    <Rich text={r.q.why} />
                  </p>
                )}
              </details>
            ))}
          </div>
        </>
      )}
      <p className="quiet">
        Missed questions come back first next time. <Link href="/plan">Back to the plan</Link>
      </p>
    </>
  );
}

function Breakdown({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; good: number; total: number }[];
}) {
  return (
    <div className="rv-break">
      <h3>{title}</h3>
      <ul>
        {rows.map((r) => {
          const p = pct(r.good, r.total);
          return (
            <li key={r.label}>
              <span>{r.label}</span>
              <span className="rv-bar" aria-hidden="true">
                <i className={p < 60 ? "low" : undefined} style={{ width: p + "%" }} />
              </span>
              <span>
                {r.good}/{r.total}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
