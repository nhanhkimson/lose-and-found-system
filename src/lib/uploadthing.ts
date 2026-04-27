import { createUploadthing, type FileRouter } from "uploadthing/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

/**
 * File router for the UploadThing API route (`/api/uploadthing`).
 * - `imageUploader` — item report photos (max 5 × 4MB)
 * - `claimProof` — claim submission proof (max 3 × 4MB)
 */
export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("You must be signed in to upload images.");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async () => {
      return { ok: true as const };
    }),

  claimProof: f({
    image: { maxFileSize: "4MB", maxFileCount: 3 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("You must be signed in to upload proof images.");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async () => {
      return { ok: true as const };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
