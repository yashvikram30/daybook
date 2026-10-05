"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KIND_LABEL, type ExerciseKind } from "@/data/labs";
import { monthKey, type MonthReview } from "@/data/months";
import { createNote } from "@/lib/brain-store";
import { setItem, useGuestState } from "@/lib/guest-store";
import { useHydrated } from "@/lib/plan-store";
import { ExerciseRow, Redo, Round, type LabCard, type LabProblem } from "./lab-client";

export type SkippedExercise = { key: string; week: number; title: string; kind: ExerciseKind };

export function MonthClient({
  review,
  from,
  to,
  cards,
  problems,
  skipped,
}: {
  review: MonthReview;
  from: number;
  to: number;
  cards: LabCard[];
  problems: LabProblem[];
  skipped: SkippedExercise[];
}) {
  const hydrated = useHydrated();
  const guest = useGuestState();
  const router = useRouter();
  const m = review.month;
  const all = [...review.exercises, ...review.carry];
  const doneEx = all.filter((_, i) => guest.items[monthKey(m, i)]).length;
  const mine = problems.filter((p) => p.week >= from && p.week <= to);
  const open = mine.filter((p) => !guest.items[p.key]);
  const missedLabs = skipped.filter((e) => !guest.items[e.key]);

  function monthNote() {
    const weeks = Array.from({ length: to - from + 1 }, (_, i) => `- [[Week ${from + i}]]`);
    const body = [
      `## Month ${m}: ${review.title}`,
      "",
      "What I can do now that I could not a month ago:",
      "",
      "## The four weeks",
      ...weeks,
      "",
      ...(m > 1 ? ["## Still shaky from earlier months", "- [ ] ", ""] : []),
      "## Still shaky from this month",
      "- [ ] ",
      "",
      `#month-${m} #retrospective`,
      "",
    ].join("\n");
    router.push(`/notes?n=${createNote({ title: `Month ${m} retrospective`, body })}`);
  }

  return (
    <>
      <div className="lab-summary" aria-live="polite">
        <div>
          <b>{hydrated ? doneEx : 0}</b>
          <span>of {all.length} exercises</span>
        </div>
        <div>
          <b>{hydrated ? mine.length - open.length : 0}</b>
          <span>of {mine.length} problems this month</span>
        </div>
        <p>
          This review is optional and has no date. Do it when a month ends, or any time you want to see how
          much has stuck.
          {m > 1 ? " It also reaches back into every month before it." : ""}
        </p>
      </div>

      <h2 id="retrieval">Retrieval round</h2>
      <p className="sect-sub">
        A longer round: what is due first, then questions from weeks {from} to {to}
        {m > 1 ? ", then ones from earlier months" : ""}. Say each answer out loud before you grade yourself.
      </p>
      <p className="sect-sub">
        Want a wider mix?{" "}
        <Link href={`/revise?w=${Array.from({ length: to - from + 1 }, (_, i) => from + i).join(",")}`}>
          Quiz weeks {from} to {to}
        </Link>{" "}
        with multiple choice, fill-in-the-blank, code snippets and flashcards.
      </p>
      {hydrated ? (
        <Round
          cards={cards}
          inFocus={(c) => c.week >= from && c.week <= to}
          newLabel="new this month"
          noteTitle={`Month ${m} review gaps`}
          tag={`month-${m}`}
          size={12}
          dueFirst={7}
        />
      ) : null}

      <h2 id="hands-on">Put it together</h2>
      <p className="sect-sub">Exercises that join several weeks of this month into one piece of work.</p>
      <ul className="list">
        {review.exercises.map((ex, i) => (
          <ExerciseRow key={i} itemKey={monthKey(m, i)} tag={`month-${m}`} ex={ex} />
        ))}
      </ul>

      {review.carry.length > 0 && (
        <>
          <h2 id="carry">Bring back earlier months</h2>
          <p className="sect-sub">
            Two exercises that reopen work from before, so this month builds on it instead of replacing it.
          </p>
          <ul className="list">
            {review.carry.map((ex, i) => (
              <ExerciseRow
                key={i}
                itemKey={monthKey(m, review.exercises.length + i)}
                tag={`month-${m}`}
                ex={ex}
              />
            ))}
          </ul>
        </>
      )}

      {hydrated && missedLabs.length > 0 && (
        <>
          <h2 id="skipped">Weekly lab exercises you skipped</h2>
          <p className="sect-sub">From the revision labs of weeks 1 to {to}. Open one to do it there.</p>
          <ul className="list">
            {missedLabs.slice(0, 6).map((e) => (
              <li key={e.key} className="row">
                <div>
                  <div className="ttl">
                    <span className={"kind " + e.kind}>{KIND_LABEL[e.kind]}</span>
                    <Link href={`/week/${e.week}/lab#hands-on`}>{e.title}</Link>
                  </div>
                  <div className="host">Week {e.week}</div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 id="revisit">Problems to revisit</h2>
      {hydrated && open.length > 0 ? (
        <>
          <p className="sect-sub">
            Still unchecked from weeks {from} to {to}. Tick them here and they count in the days they belong
            to.
          </p>
          <ul className="list">
            {open.slice(0, 10).map((p) => (
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
                  <div className="host">
                    Week {p.week} · {p.topic}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : hydrated ? (
        <p className="sect-sub">Every problem from this month is checked off. Try one from scratch below.</p>
      ) : null}
      <Redo problems={problems} since={`month ${m}`} />

      <h2 id="wrap">Close the month</h2>
      <div className="wrap-up">
        <p>
          Write a short note in your second brain. It starts with links to the month&apos;s four weeks
          {m > 1 ? " and leaves room for what is still shaky from earlier months" : ""}.
        </p>
        <button className="btn primary" type="button" onClick={monthNote}>
          Write the month {m} note
        </button>
        <Link className="btn" href="/notes">
          Open second brain
        </Link>
      </div>
    </>
  );
}
