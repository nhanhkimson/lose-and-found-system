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
