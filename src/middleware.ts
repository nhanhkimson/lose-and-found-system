import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authBase, googleProvider } from "@/auth.config";
import { withBearerSessionCookie } from "@/lib/auth/bearer-request";
import {
  apiCorsPreflightResponse,
  applyApiCorsHeaders,
  isApiRoute,
} from "@/lib/api/cors";

/**
 * Edge-safe: no Prisma / Credentials provider here — only matches JWT + Google config
 * so the session cookie can be refreshed. Full auth lives in `src/lib/auth.ts`.
 * Sets `x-pathname` for server layouts (e.g. login `callbackUrl`).
 * API routes get configurable CORS (see API_CORS_* env vars).
 */
const { auth } = NextAuth({
  ...authBase,
  providers: [googleProvider],
});

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const request = withBearerSessionCookie(req);

  if (isApiRoute(pathname)) {
    if (request.method === "OPTIONS") {
      return apiCorsPreflightResponse(request);
    }

    const res = NextResponse.next({ request });
    applyApiCorsHeaders(request, res);
    res.headers.set("x-pathname", pathname);
    return res;
  }

  const res = NextResponse.next({ request });
  res.headers.set("x-pathname", pathname);
  return res;
});

export const config = {
  matcher: [
    /*
     * Keep auth refresh off static assets; run on app routes only.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
