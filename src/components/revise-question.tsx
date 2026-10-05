"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { SEC_LABEL, TYPE_LABEL, blankCount, type Code, type Question } from "@/data/revision/types";
import { answerText, grade, type Prepared, type Response, type Result } from "@/lib/revise-engine";

/** What the learner did with a question. `response` is null when they skipped it. */
export type Outcome = { response: Response | null; result: Result };

/** Text with `inline code` spans. Everything is rendered as elements, never as markup. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(`[^`\n]+`)/g)
        .map((part, i) =>
          part.length > 2 && part.startsWith("`") && part.endsWith("`") ? (
            <code key={i}>{part.slice(1, -1)}</code>
          ) : (
            <Fragment key={i}>{part}</Fragment>
          ),
        )}
    </>
  );
}

export function CodeBlock({ code }: { code: Code }) {
  return (
    <pre className="rv-code" data-lang={code.lang}>
      <code>{code.src}</code>
    </pre>
  );
}

const KEYS = "123456789";

type Props = {
  p: Prepared;
  position: number;
  total: number;
  isLast: boolean;
  onAnswer: (o: Outcome) => void;
  onNext: () => void;
};

export function QuestionCard({ p, position, total, isLast, onAnswer, onNext }: Props) {
  const q = p.q;
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [pick, setPick] = useState<number | null>(null);
  const [picks, setPicks] = useState<number[]>([]);
  const [texts, setTexts] = useState<string[]>(() => (q.t === "blank" ? q.answers.map(() => "") : []));
  const [seq, setSeq] = useState<number[]>(p.shown);
  const [mpicks, setMpicks] = useState<number[]>(() => (q.t === "match" ? q.pairs.map(() => -1) : []));
  const [revealed, setRevealed] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);

  const locked = outcome !== null;

  function finish(response: Response | null) {
    const result = response ? grade(q, response) : { ok: false };
    const o = { response, result };
    setOutcome(o);
    onAnswer(o);
    return o;
  }

  function response(): Response | null {
    switch (q.t) {
      case "mcq":
        return pick === null ? null : { t: "mcq", pick };
      case "tf":
        return pick === null ? null : { t: "tf", pick: pick === 1 };
      case "multi":
        return picks.length ? { t: "multi", picks } : null;
      case "blank":
        return texts.some((t) => t.trim()) ? { t: "blank", texts } : null;
      case "order":
        return { t: "order", seq };
      case "match":
        return mpicks.every((m) => m >= 0) ? { t: "match", picks: mpicks } : null;
      default:
        return null;
    }
  }

  function check() {
    const r = response();
    if (r) finish(r);
  }

  function rate(knew: boolean) {
    finish({ t: "card", knew });
    onNext();
  }

  function primary() {
    if (locked) onNext();
    else if (q.t === "card") setRevealed(true);
    else check();
  }

  // Keyboard: Enter checks or moves on, 1-9 choose an option, t/f answer true or false.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName ?? "";
      if (e.key === "Enter") {
        if (tag === "BUTTON" || tag === "SELECT" || tag === "A" || tag === "SUMMARY") return;
        e.preventDefault();
        primary();
        return;
      }
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || locked) return;
      if (q.t === "card" && revealed) {
        if (e.key === "y" || e.key === "1") rate(true);
        else if (e.key === "n" || e.key === "2") rate(false);
        return;
      }
      if (q.t === "mcq" || q.t === "multi") {
        const i = KEYS.indexOf(e.key);
        if (i >= 0 && i < p.shown.length) choose(p.shown[i]);
      } else if (q.t === "tf") {
        if (e.key === "t") setPick(1);
        else if (e.key === "f") setPick(0);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (outcome && q.t !== "card") nextRef.current?.focus();
  }, [outcome, q.t]);

  function choose(i: number) {
    if (locked) return;
    if (q.t === "multi") setPicks((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));
    else setPick(i);
  }

  function move(at: number, by: number) {
    setSeq((cur) => {
      const next = [...cur];
      [next[at], next[at + by]] = [next[at + by], next[at]];
      return next;
    });
  }

  const ok = outcome?.result.ok;
  const parts = outcome?.result.parts;

  return (
    <section className="rv-card" aria-label={`Question ${position + 1} of ${total}`}>
      <div className="rv-tags">
        <span className="rv-tag type">{TYPE_LABEL[q.t]}</span>
        <span className="rv-tag">Week {q.week}</span>
        <span className="rv-tag">{SEC_LABEL[q.sec]}</span>
      </div>

      {q.t === "card" ? (
        <>
          <p className="rv-q">
            <Rich text={q.front} />
          </p>
          {q.code && <CodeBlock code={q.code} />}
          <div className={"rv-flip" + (revealed ? " shown" : "")} aria-live="polite">
            {revealed ? (
              <p>
                <Rich text={q.back} />
              </p>
            ) : (
              <p className="quiet">Say your answer out loud first, then check it.</p>
            )}
          </div>
          <div className="rv-actions">
            {!revealed ? (
              <button className="btn primary" type="button" onClick={() => setRevealed(true)}>
                Show answer
              </button>
            ) : (
              <>
                <button className="btn primary" type="button" onClick={() => rate(true)}>
                  I knew it
                </button>
                <button className="btn" type="button" onClick={() => rate(false)}>
                  Not yet
                </button>
                <span className="rv-kbd">or press Y / N</span>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {q.t === "blank" ? (
            <BlankBody q={q} texts={texts} setTexts={setTexts} locked={locked} parts={parts} />
          ) : (
            <>
              <p className="rv-q">
                <Rich text={q.q} />
              </p>
              {q.code && <CodeBlock code={q.code} />}
            </>
          )}

          {(q.t === "mcq" || q.t === "multi") && (
            <ul className="rv-list" role={q.t === "multi" ? "group" : "radiogroup"} aria-label="Options">
              {p.shown.map((orig, slot) => {
                const chosen = q.t === "multi" ? picks.includes(orig) : pick === orig;
                const correct = q.t === "multi" ? q.answers.includes(orig) : q.answer === orig;
                const cls = locked ? (correct ? " right" : chosen ? " wrong" : "") : "";
                return (
                  <li key={orig}>
                    <button
                      type="button"
                      className={"rv-opt" + cls}
                      role={q.t === "multi" ? "checkbox" : "radio"}
                      aria-checked={chosen}
                      disabled={locked}
                      onClick={() => choose(orig)}
                    >
                      <span className="key" aria-hidden="true">
                        {slot + 1}
                      </span>
                      <span>
                        <Rich text={q.options[orig]} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {q.t === "tf" && (
            <ul className="rv-list" role="radiogroup" aria-label="True or false">
              {([1, 0] as const).map((v) => {
                const chosen = pick === v;
                const correct = (v === 1) === q.answer;
                const cls = locked ? (correct ? " right" : chosen ? " wrong" : "") : "";
                return (
                  <li key={v}>
                    <button
                      type="button"
                      className={"rv-opt" + cls}
                      role="radio"
                      aria-checked={chosen}
                      disabled={locked}
                      onClick={() => setPick(v)}
                    >
                      <span className="key" aria-hidden="true">
                        {v ? "T" : "F"}
                      </span>
                      <span>{v ? "True" : "False"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {q.t === "order" && (
            <ol className="rv-list rv-ord" aria-label="Arrange in order">
              {seq.map((item, at) => (
                <li key={item} className={locked && parts ? (parts[at] ? "right" : "wrong") : undefined}>
                  <span>
                    <Rich text={q.items[item]} />
                  </span>
                  <span className="mv">
                    <button
                      type="button"
                      className="rv-mini"
                      disabled={locked || at === 0}
                      aria-label={`Move up: ${q.items[item]}`}
                      onClick={() => move(at, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="rv-mini"
                      disabled={locked || at === seq.length - 1}
                      aria-label={`Move down: ${q.items[item]}`}
                      onClick={() => move(at, 1)}
                    >
                      ↓
                    </button>
                  </span>
                </li>
              ))}
            </ol>
          )}

          {q.t === "match" && (
            <ul className="rv-list rv-match" aria-label="Match each item">
              {q.pairs.map(([left], i) => (
                <li key={i} className={locked && parts ? (parts[i] ? "right" : "wrong") : undefined}>
                  <span>
                    <Rich text={left} />
                  </span>
                  <select
                    aria-label={`Match for ${left}`}
                    value={mpicks[i]}
                    disabled={locked}
                    onChange={(e) =>
                      setMpicks((cur) => cur.map((v, k) => (k === i ? Number(e.target.value) : v)))
                    }
                  >
                    <option value={-1}>Choose…</option>
                    {p.shown.map((orig) => (
                      <option key={orig} value={orig}>
                        {q.pairs[orig][1]}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          )}

          <div className="rv-actions">
            {!locked ? (
              <>
                <button className="btn primary" type="button" onClick={check} disabled={response() === null}>
                  Check
                </button>
                <button className="btn" type="button" onClick={() => finish(null)}>
                  Skip
                </button>
                <span className="rv-kbd">
                  {q.t === "mcq" || q.t === "multi"
                    ? "Press 1-" + p.shown.length + " to choose, Enter to check"
                    : q.t === "tf"
                      ? "Press T or F, Enter to check"
                      : "Enter to check"}
                </span>
              </>
            ) : (
              <button className="btn primary" type="button" onClick={onNext} ref={nextRef}>
                {isLast ? "See results" : "Next question"}
              </button>
            )}
          </div>

          {locked && (
            <div className={"rv-fb " + (ok ? "ok" : "no")} role="status">
              <b>{ok ? "Correct" : outcome.response ? "Not quite" : "Skipped"}</b>
              {!ok && (
                <p className="ans">
                  Answer: <Rich text={answerText(q)} />
                </p>
              )}
              {q.why && (
                <p>
                  <Rich text={q.why} />
                </p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

/** A fill-in-the-blank prompt and optional code, with an input in place of every `___`. */
function BlankBody({
  q,
  texts,
  setTexts,
  locked,
  parts,
}: {
  q: Extract<Question, { t: "blank" }>;
  texts: string[];
  setTexts: (f: (cur: string[]) => string[]) => void;
  locked: boolean;
  parts: boolean[] | undefined;
}) {
  const inPrompt = q.q.split("___").length - 1;
  const total = blankCount(q);

  function input(i: number) {
    const width = Math.min(18, Math.max(6, (q.answers[i][0]?.length ?? 6) + 2));
    return (
      <input
        key={"b" + i}
        className={"rv-blank" + (locked && parts ? (parts[i] ? " right" : " wrong") : "")}
        style={{ width: width + "ch" }}
        value={texts[i] ?? ""}
        readOnly={locked}
        autoFocus={i === 0}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label={`Blank ${i + 1} of ${total}`}
        onChange={(e) => {
          const v = e.target.value;
          setTexts((cur) => cur.map((t, k) => (k === i ? v : t)));
        }}
      />
    );
  }

  const promptPieces = q.q.split("___");
  const codePieces = q.code ? q.code.src.split("___") : [];
  return (
    <>
      <p className="rv-q rv-text">
        {promptPieces.map((piece, i) => (
          <Fragment key={i}>
            <Rich text={piece} />
            {i < promptPieces.length - 1 && input(i)}
          </Fragment>
        ))}
      </p>
      {q.code && (
        <pre className="rv-code" data-lang={q.code.lang}>
          <code>
            {codePieces.map((piece, i) => (
              <Fragment key={i}>
                {piece}
                {i < codePieces.length - 1 && input(inPrompt + i)}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </>
  );
}
