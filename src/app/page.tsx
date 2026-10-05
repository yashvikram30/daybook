import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/icons";
import { TodayView } from "@/components/today-view";
import { getCurriculum } from "@/lib/curriculum";
import { allDays, dayHref, hostOf, itemsOf } from "@/lib/curriculum-types";
import { Markdown } from "@/lib/markdown";
import { planDays } from "@/lib/plan-days";

/** 0 for the first layer up to 1 for the last: drives the plum-to-mustard colour of stack and roadmap. */
const tone = (i: number, n: number): CSSProperties => {
  const t = n > 1 ? Math.round((i / (n - 1)) * 100) : 0;
  return { "--t": t, "--fg": t > 55 ? "#25261c" : "#fbf8f1" } as CSSProperties;
};

export default async function Home() {
  const c = await getCurriculum();
  const days = allDays(c);
  const sample = days.find((d) => d.id === "w3d2") ?? days[0];
  const sampleWeek = c.weeks.find((w) => w.number === sample.weekNumber)!;
  const learn = itemsOf(sample, "learn").slice(0, 3);
  const problems = itemsOf(sample, "dsa_problem").slice(0, 2);
  const layers = c.phases
    .map((p, i) => ({ p, i, weeks: c.weeks.filter((w) => w.phase === p.slug) }))
    .filter((l) => l.weeks.length > 0);
  const phaseIndex = new Map(layers.map((l) => [l.p.slug, l.i]));
  const question = days.find((d) => d.id === "w6d3")?.questions[0] ?? sample.questions[0];
  const vm = days.find((d) => d.id === "w2d2") ?? days[0];

  const resolve = (t: string) => {
    const d = days.find((x) => x.title.toLowerCase() === t.toLowerCase());
    return d
      ? { href: dayHref(d.weekNumber, d.numberInWeek), kind: "day" as const }
      : { href: "/notes", kind: "missing" as const };
  };
  const note = `Page tables are a **tree**, not an array: each level picks the next. Revisit [[${vm.title}]] before the TLB question.

- [x] Walk one address through by hand
- [ ] Explain a TLB miss out loud

#os #review`;

  const landing = (
    <div className="landing">
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Learn how computers really work.</h1>
            <p className="sub">
              Sixteen weeks that start at the machine and end at an AI system you built yourself. You write
              Python from the first day, and learn it as you go. Each day is a few short pages: something to
              learn, something to build, and a way to check you got it.
            </p>
            <div className="cta-row">
              <Link className="btn primary big" href="/start">
                Pick your start date
              </Link>
              <Link className="ulink" href="/day/1/1">
                Or look at day one
              </Link>
            </div>
          </div>
          <div>
            <ol className="stack" aria-label="The seven layers you will build up through">
              {[...layers].reverse().map((l, k) => (
                <li
                  key={l.p.slug}
                  style={{ ...tone(layers.length - 1 - k, layers.length), "--k": k } as CSSProperties}
                >
                  <Link href={`/week/${l.weeks[0].number}`}>
                    <b>{l.p.name}</b>
                    <span>
                      {l.weeks.length === 1
                        ? `Week ${l.weeks[0].number}`
                        : `Weeks ${l.weeks[0].number} to ${l.weeks[l.weeks.length - 1].number}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="stack-cap">Each layer sits on the one below. You build up from the bottom.</p>
          </div>
        </div>
      </section>

      <section className="section cream">
        <div className="wrap">
          <h2>One day, in five small pages.</h2>
          <p className="section-lead">
            No giant checklist. You open a day, see what it adds up to, and take one topic at a time.
          </p>
          <div className="demo" aria-label="A sample day from the plan">
            <div className="demo-q">
              {Icon.search}
              Week {sample.weekNumber}, day {sample.numberInWeek}: {sample.title}
            </div>
            <div className="demo-body">
              <div>
                <p className="eyebrow">Learn</p>
                <ul>
                  {learn.map((i) => (
                    <li key={i.key}>
                      <input className="ck" type="checkbox" tabIndex={-1} aria-hidden="true" readOnly />
                      <span>
                        {i.title}
                        <small>{hostOf(i.url)}</small>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow">Build</p>
                <h3>{sampleWeek.project}</h3>
                <p style={{ margin: "10px 0 0", color: "var(--muted)" }}>{sample.ship}</p>
                <p className="eyebrow" style={{ marginTop: 22 }}>
                  DSA, in Python
                </p>
                <ul>
                  {problems.map((p) => (
                    <li key={p.key}>
                      <span className={"diff " + p.difficulty} style={{ marginTop: 4 }}>
                        {p.difficulty}
                      </span>
                      <span>{p.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap feature">
          <div className="copy">
            <h2>Write it down and it stays.</h2>
            <p>
              Every day ends with a short journal. For bigger ideas there is a second brain: plain notes that
              link to each other and to any day, with tags, checklists and a search that finds them again.
            </p>
            <Link className="ulink" href="/notes">
              Open the notes
            </Link>
          </div>
          <div className="mock">
            <div className="mock-bar">
              <b>Page tables</b>
              <span>Today</span>
            </div>
            <Markdown text={note} resolve={resolve} />
            <div className="mock-foot">Linked from 2 notes</div>
          </div>
        </div>
      </section>

      <section className="section cream">
        <div className="wrap feature flip">
          <div className="mock round-mock" aria-hidden="true">
            <div className="round live">
              <div className="round-top">
                <span>Question 3 of 8</span>
                <span className="host">Review round</span>
              </div>
              <p className="round-q">{question}</p>
              <div className="round-actions">
                <span className="btn primary">I could explain it</span>
                <span className="btn">Not yet</span>
              </div>
            </div>
          </div>
          <div className="copy">
            <h2>A fifth day, if you want it.</h2>
            <p>
              Each week has an optional revision lab. It brings back questions you answered before, when you
              are about to forget them, and sets four hands-on exercises: break something, measure something,
              explain it from memory. Every month there is a longer review that also reaches back into the
              months before it.
            </p>
            <Link className="ulink" href="/week/1/lab">
              See a revision lab
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>Sixteen weeks, start to finish.</h2>
          <p className="section-lead">
            From machine code and assembly to databases, distributed systems and an AI system with retrieval,
            with Striver&apos;s DSA sheet running alongside.
          </p>
          <ol className="roadmap">
            {c.weeks.map((w) => (
              <li key={w.number} style={tone(phaseIndex.get(w.phase) ?? 0, c.phases.length)}>
                <Link href={`/week/${w.number}`} title={w.title}>
                  <b>{w.number}</b>
                  <span>{w.title}</span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="tiles">
            {layers.map((l) => (
              <Link key={l.p.slug} className="tile" href={`/week/${l.weeks[0].number}`}>
                <small>{l.p.language}</small>
                <b>{l.p.name}</b>
                <span>{l.weeks[0].project}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <div>
            <h2>Start with day one.</h2>
            <p>Pick a date and you will have a schedule in under a minute.</p>
          </div>
          <Link className="btn hot big" href="/start">
            Pick your start date
          </Link>
        </div>
      </section>
      <footer className="foot">
        <div className="wrap">
          <span>Daybook</span>
          <span>Free to follow. Your progress and notes stay in your browser.</span>
        </div>
      </footer>
    </div>
  );
  return <TodayView days={planDays(c)} landing={landing} />;
}
