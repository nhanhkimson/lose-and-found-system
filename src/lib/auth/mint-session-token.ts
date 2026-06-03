import { encode } from "next-auth/jwt";
import type { UserRole } from "@prisma/client";
import { SESSION_TOKEN_SALT } from "@/lib/auth/session-cookie";

/**
 * Server-only: mints a JWT compatible with Auth.js session cookies (mobile Bearer token).
 */
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
