"use client";
import { signIn } from "next-auth/react";

export function SignInButtons() {
  return (
    <div className="row-actions">
      <button className="btn primary" type="button" onClick={() => signIn("google", { redirectTo: "/" })}>
        Continue with Google
      </button>
    </div>
  );
}
