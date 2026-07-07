import type { DecodedIdToken } from "firebase-admin/auth";
import type { User, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type FirebaseUserExtras = {
  studentId?: string;
  name?: string;
};

function normalizeEmail(email: string | undefined): string | null {
  const trimmed = email?.trim().toLowerCase();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function fallbackEmail(uid: string): string {
  return `${uid}@firebase.biu.local`;
}

/**
 * Resolves a Prisma user from a verified Firebase ID token.
 * Links by firebaseUid or email; creates a student account when missing.
 */
export async function resolveUserFromFirebaseToken(
  decoded: DecodedIdToken,
  extras: FirebaseUserExtras = {},
): Promise<User> {
  const firebaseUid = decoded.uid;
  const email = normalizeEmail(decoded.email) ?? fallbackEmail(firebaseUid);
  const displayName =
    extras.name?.trim() ||
    decoded.name?.trim() ||
    decoded.email?.split("@")[0] ||
    "Student";
  const image = decoded.picture ?? null;
  const studentId = extras.studentId?.trim() || null;

  const byUid = await prisma.user.findUnique({ where: { firebaseUid } });
  if (byUid) {
    return prisma.user.update({
      where: { id: byUid.id },
      data: {
        name: byUid.name ?? displayName,
        image: byUid.image ?? image,
        studentId: byUid.studentId ?? studentId,
        email: byUid.email ?? email,
      },
    });
  }

  if (normalizeEmail(decoded.email)) {
    const byEmail = await prisma.user.findUnique({
      where: { email: normalizeEmail(decoded.email)! },
    });
    if (byEmail) {
      return prisma.user.update({
        where: { id: byEmail.id },
        data: {
          firebaseUid,
          name: byEmail.name ?? displayName,
          image: byEmail.image ?? image,
          studentId: byEmail.studentId ?? studentId,
        },
      });
    }
  }

  return prisma.user.create({
    data: {
      firebaseUid,
      email,
      name: displayName,
      image,
      studentId,
      role: "STUDENT" satisfies UserRole,
    },
  });
}
