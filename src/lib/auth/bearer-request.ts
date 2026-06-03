import { SESSION_COOKIE_NAMES } from "@/lib/auth/session-cookie";
import type { NextRequest } from "next/server";
import { NextRequest as NextRequestCtor } from "next/server";

/**
 * Maps `Authorization: Bearer <jwt>` to a session cookie on the request
 * so Auth.js `auth()` and `getToken` work for mobile / external clients.
 */
export function withBearerSessionCookie(request: NextRequest): NextRequest {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.toLowerCase().startsWith("bearer ")) {
    return request;
  }

  const token = authHeader.slice(7).trim();
  if (!token) return request;

  const headers = new Headers(request.headers);
  const existing = headers.get("cookie") ?? "";
  const pair = `${SESSION_COOKIE_NAMES[2]}=${token}`;
  headers.set("cookie", existing ? `${existing}; ${pair}` : pair);

  return new NextRequestCtor(request.url, {
    headers,
    method: request.method,
    body: request.body,
  });
}
