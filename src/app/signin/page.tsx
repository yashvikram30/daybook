import type { Metadata } from "next";
import { SignInButtons } from "@/components/signin-buttons";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <article className="prose">
      <h1>Sign in</h1>
      <p>
        Sign in to save your progress, notes, captures and revision history to your account, and pick up on
        any device. Without an account everything stays in this browser.
      </p>
      <SignInButtons />
    </article>
  );
}
