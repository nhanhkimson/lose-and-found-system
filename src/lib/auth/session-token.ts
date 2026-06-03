import { encode } from "@auth/core/jwt";
import type { UserRole } from "@prisma/client";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/** Cookie names Auth.js v5 may use (HTTPS uses __Secure- prefix). */
export const SESSION_COOKIE_NAMES = [
  "__Secure-authjs.session-token",
  "__Host-authjs.session-token",
  "authjs.session-token",
] as const;

export const SESSION_TOKEN_SALT = "authjs.session-token";

export function readSessionTokenFromCookies(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
): string | undefined {
  for (const name of SESSION_COOKIE_NAMES) {
    const value = cookieStore.get(name)?.value;
    if (value) return value;
  }
  return undefined;
}

export async function mintSessionToken(input: {
  sub: string;
  id: string;
  role: UserRole;
  email?: string | null;
  name?: string | null;
}): Promise<string> {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET must be set.");
  }

  return encode({
    token: {
      sub: input.sub,
      id: input.id,
      role: input.role,
      email: input.email ?? undefined,
      name: input.name ?? undefined,
    },
    secret,
    maxAge: 30 * 24 * 60 * 60,
    salt: SESSION_TOKEN_SALT,
  });
}
