"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <article>
      <h1>Something went wrong</h1>
      <p className="lead">The page failed to load. Your progress is safe in this browser. Try again.</p>
      <button className="btn primary" type="button" onClick={reset}>
        Try again
      </button>
    </article>
  );
}
