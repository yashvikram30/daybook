import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthGate, AuthSkeleton } from "@/components/auth-gate";
import { SignInButtons } from "@/components/signin-buttons";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <AuthGate>
        <main className="auth">
          <aside className="auth-aside">
            <Link className="auth-brand" href="/">
              <span className="logo" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <path
                    d="M6 4.5h10.5a1.5 1.5 0 0 1 1.5 1.5v13H7.5A1.5 1.5 0 0 1 6 17.5v-13Z"
                    fill="#fbf8f1"
                  />
                  <path d="M13 4.5v7l2-1.4 2 1.4v-7h-4Z" fill="#f4c84a" />
                </svg>
              </span>
              Daybook
            </Link>
            <div className="auth-pitch">
              <h2>
                Learn how computers <em>really</em> work.
              </h2>
              <ul className="auth-points">
                <li>A free 16-week plan: architecture, OS, networking, databases, ML and GenAI.</li>
                <li>Your progress, notes and revision history saved to your account.</li>
                <li>Pick up on any device, right where you left off.</li>
              </ul>
            </div>
            <p className="auth-foot">Free and open. No password to remember.</p>
          </aside>

          <section className="auth-main" aria-labelledby="auth-h">
            <div className="auth-card">
              <h1 id="auth-h">Sign in or create an account</h1>
              {/* useSearchParams (for ?next) needs a Suspense boundary so the page can still prerender. */}
              <Suspense fallback={null}>
                <SignInButtons />
              </Suspense>
              <p className="auth-note">Without an account, everything stays in this browser.</p>
            </div>
          </section>
        </main>
      </AuthGate>
    </Suspense>
  );
}
