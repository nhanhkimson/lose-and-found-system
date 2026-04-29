import { getToken } from "next-auth/jwt";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { authBase } from "@/auth.config";

const f = createUploadthing();

/** Match Auth.js cookie prefix (secure name when request is HTTPS). */
function secureSessionCookieForRequest(req: Request): boolean {
  try {
    const url = new URL(req.url);
    if (url.protocol === "https:") return true;
  } catch {
    /* relative or missing URL — fall through to forwarded header */
  }
  return req.headers.get("x-forwarded-proto") === "https";
}

/**
 * UploadThing runs `.middleware()` inside an Effect `tryPromise`. That path does not
 * preserve Next.js request AsyncLocalStorage, so `auth()` without arguments often
 * sees no cookies. Always derive the user id from this request's Cookie header.
 */
async function requireUserId(req: Request, notSignedInMessage: string): Promise<string> {
  const secret =
    authBase.secret ??
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error(
      "Server misconfiguration: set AUTH_SECRET or NEXTAUTH_SECRET.",
    );
  }

  const token = await getToken({
    req,
    secret,
    secureCookie: secureSessionCookieForRequest(req),
  });

  const userId =
    (typeof token?.id === "string" && token.id) ||
    (typeof token?.sub === "string" && token.sub) ||
    null;

  if (!userId) {
    throw new Error(notSignedInMessage);
  }

  return userId;
}

/**
 * File router for the UploadThing API route (`/api/uploadthing`).
 * - `imageUploader` — item report photos (max 5 × 4MB)
 * - `claimProof` — claim submission proof (max 3 × 4MB)
 */
export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      const userId = await requireUserId(
        req,
        "You must be signed in to upload images.",
      );
      return { userId };
    })
    .onUploadComplete(async () => {
      return { ok: true as const };
    }),

  claimProof: f({
    image: { maxFileSize: "4MB", maxFileCount: 3 },
  })
    .middleware(async ({ req }) => {
      const userId = await requireUserId(
        req,
        "You must be signed in to upload proof images.",
      );
      return { userId };
    })
    .onUploadComplete(async () => {
      return { ok: true as const };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
