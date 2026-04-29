import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

/**
 * Shared options (no DB / Prisma here) so `middleware` stays Edge-safe.
 * Full stack (Credentials, Prisma adapter, callbacks) lives in `src/lib/auth.ts`.
 */
export const authBase: Pick<
  NextAuthConfig,
  "trustHost" | "secret" | "session" | "pages"
> = {
  trustHost: true,
  /** NextAuth v5 accepts AUTH_SECRET; many projects only set NEXTAUTH_SECRET. */
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
};

export const googleProvider = Google({
  clientId: process.env.AUTH_GOOGLE_ID ?? "",
  clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
});
