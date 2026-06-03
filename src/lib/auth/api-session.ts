import { getToken } from "next-auth/jwt";
import type { UserRole } from "@prisma/client";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import {
  SESSION_COOKIE_NAMES,
  SESSION_TOKEN_SALT,
} from "@/lib/auth/session-cookie";

function tokenToSession(
  token: Record<string, unknown> & { sub?: string },
): Session | null {
  const id = (token.sub ?? token.id) as string | undefined;
  if (!id) return null;
  return {
    user: {
      id,
      role: token.role as UserRole,
      email: (token.email as string | null | undefined) ?? null,
      name: (token.name as string | null | undefined) ?? null,
      image: (token.picture as string | null | undefined) ?? null,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Resolves session from Bearer JWT or Auth.js cookie (for API route handlers).
 */
export async function getApiSession(
  request?: Request,
): Promise<Session | null> {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) return auth();

  if (request) {
    const bearer = request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "")
      .trim();
    if (bearer) {
      for (const cookieName of SESSION_COOKIE_NAMES) {
        const fakeReq = new Request("https://session.local", {
          headers: {
            cookie: `${cookieName}=${encodeURIComponent(bearer)}`,
          },
        });
        const token = await getToken({
          req: fakeReq,
          secret,
          salt: SESSION_TOKEN_SALT,
        });
        const session = token ? tokenToSession(token) : null;
        if (session) return session;
      }
    }
  }

  return auth();
}
