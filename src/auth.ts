import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/**
 * Sign-in with GitHub or Google. Sessions are JWT cookies, so there is no session table; the user's
 * study data lives in MongoDB (see lib/mongo.ts) under the id set here.
 * Env: AUTH_SECRET, AUTH_GITHUB_ID/SECRET, AUTH_GOOGLE_ID/SECRET (read automatically by Auth.js).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    // "github:123" and "google:456" are different people-accounts, so ids never collide across providers.
    jwt({ token, account }) {
      if (account) token.uid = `${account.provider}:${account.providerAccountId}`;
      return token;
    },
    session({ session, token }) {
      if (typeof token.uid === "string") session.user.id = token.uid;
      return session;
    },
  },
});
