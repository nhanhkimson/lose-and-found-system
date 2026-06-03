import type { NextResponse } from "next/server";
import { SESSION_COOKIE_NAMES } from "@/lib/auth/session-cookie";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

/** Sets the Auth.js session cookie on an API response (browser clients). */
export function setSessionCookieOnResponse(
  response: NextResponse,
  sessionToken: string,
): void {
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1";
  const name = secure
    ? SESSION_COOKIE_NAMES[0]
    : SESSION_COOKIE_NAMES[2];

  response.cookies.set(name, sessionToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}
