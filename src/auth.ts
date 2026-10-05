import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Sign-in with Google (GitHub is off for now: add `GitHub` from next-auth/providers/github back to `providers`). Sessions are JWT cookies, so there is no session table; the user's
 * study data lives in MongoDB (see lib/mongo.ts) under the id set here.
 * Env: AUTH_SECRET, AUTH_GOOGLE_ID/SECRET (read automatically by Auth.js).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    // Ids are "<provider>:<account id>", so they never collide if another provider is added later.
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
