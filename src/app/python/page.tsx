import type { Metadata } from "next";
import Link from "next/link";
import { PY_EXTRAS, PY_STAGES } from "@/data/py-path";
import { getCurriculum } from "@/lib/curriculum";
import { dayHref } from "@/lib/curriculum-types";

export const metadata: Metadata = {
  title: "Learn Python along the way",
  description:
    "How the plan teaches Python: one lesson a day for four weeks, then Python as the working language.",
};

export default async function PythonPage() {
  const c = await getCurriculum();
  const day = (w: number, d: number) =>
    c.weeks.find((x) => x.number === w)?.days.find((x) => x.numberInWeek === d);
  const first = PY_STAGES.map((_, i) => PY_STAGES.slice(0, i).reduce((n, s) => n + s.days.length, 0));

  return (
    <article>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/plan">Plan</Link>
        <i>/</i>
        <span>Learn Python</span>
      </nav>
      <h1>Learn Python along the way</h1>
      <p className="lead">
        You do not need to know Python, or any programming, first. The first three days start from the basics
        (values, strings, if and loops, functions, files) with a short warm-up each day. For the first four
        weeks every day opens with one Python lesson, and the day&apos;s build puts it straight to work. By
        week 5 Python is simply the language you write in. Python is the only language in the plan.
      </p>

      <h2 id="how">How a Python lesson works</h2>
      <ul className="plain">
        <li>
          It is the first item on the day&apos;s Learn page, titled &ldquo;Python lesson N&rdquo;, and takes
          about 25 minutes.
        </li>
        <li>The Build page uses it the same day, so you write Python before you forget it.</li>
        <li>Each stage below ends with a check you can do on your own, before you move on.</li>
        <li>The DSA track is in Python too, so the practice never stops.</li>
      </ul>

      <h2 id="stages">The stages</h2>
      <ol className="pystages">
        {PY_STAGES.map((s, i) => (
          <li key={s.title}>
            <h3>
              {i + 1}. {s.title}
            </h3>
            <p>{s.summary}</p>
            <ul className="plain">
              {s.days.map(([w, d], k) => {
                const x = day(w, d);
                if (!x) return null;
                return (
                  <li key={`${w}.${d}`}>
                    <Link href={`${dayHref(w, d)}/learn`}>
                      Lesson {first[i] + k + 1}: week {w}, day {d}
                    </Link>{" "}
                    <span className="quiet">{x.title}</span>
                  </li>
                );
              })}
            </ul>
            <p className="pysrc">
              {s.sources.map((r, k) => (
                <span key={r.url}>
                  {k > 0 ? ", " : ""}
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.title}
                  </a>
                </span>
              ))}
            </p>
            <p className="pyready">
              <b>Ready when:</b> {s.ready}
            </p>
          </li>
        ))}
        <li>
          <h3>{PY_STAGES.length + 1}. Python at work</h3>
          <p>
            From week 5 there are no more lessons. Python is the tool for networking, databases, distributed
            systems and the gateway service in the capstone, and new packages are introduced where you need
            them.
          </p>
          <p>
            <Link href="/week/5">Start with week 5</Link>
          </p>
        </li>
      </ol>

      <h2 id="more">If you want more</h2>
      <ul className="plain">
        {PY_EXTRAS.map((x) => (
          <li key={x.url}>
            <a href={x.url} target="_blank" rel="noopener noreferrer">
              {x.title}
            </a>{" "}
            <span className="quiet">{x.note}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
