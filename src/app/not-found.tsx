import Link from "next/link";

export default function NotFound() {
  return (
    <article>
      <h1>That page does not exist</h1>
      <p className="lead">
        The link may be old, or the day number may be out of range. The plan has 16 weeks of 4 days each.
      </p>
      <p style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link className="btn primary" href="/">
          Go to Today
        </Link>
        <Link className="btn" href="/plan">
          Browse the plan
        </Link>
      </p>
    </article>
  );
}
