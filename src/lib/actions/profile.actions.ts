"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getApiSession } from "@/lib/auth/api-session";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validations/profile.schema";
import type { ActionResult } from "@/types";
import type { UserRole } from "@prisma/client";

export type ProfileStats = {
  myLost: number;
  myFound: number;
  myClaims: number;
  myResolved: number;
};

export type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  studentId: string | null;
  createdAt: Date;
  stats: ProfileStats;
};

const profileSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  studentId: true,
  createdAt: true,
} as const;

async function loadStats(userId: string): Promise<ProfileStats> {
  const [myLost, myFound, myClaims, myResolved] = await Promise.all([
    prisma.item.count({ where: { userId, type: "LOST" } }),
    prisma.item.count({ where: { userId, type: "FOUND" } }),
    prisma.claim.count({ where: { userId } }),
    prisma.item.count({ where: { userId, status: "RESOLVED" } }),
  ]);
  return { myLost, myFound, myClaims, myResolved };
}

export async function getProfile(): Promise<UserProfile | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: profileSelect,
  });
  if (!user) return null;

  const stats = await loadStats(user.id);
  return { ...user, stats };
}

export async function getProfileFromRequest(
  request: Request,
): Promise<UserProfile | null> {
  const session = await getApiSession(request);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: profileSelect,
  });
  if (!user) return null;

  const stats = await loadStats(user.id);
  return { ...user, stats };
}

export async function updateProfileAction(
  input: unknown,
): Promise<ActionResult<UserProfile>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = profileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Validation failed" };
  }

  const { name, studentId, image } = parsed.data;
  const imageValue = image?.trim() ? image.trim() : null;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      studentId: studentId?.trim() ? studentId.trim() : null,
      image: imageValue,
    },
    select: profileSelect,
  });

  const stats = await loadStats(updated.id);
  revalidatePath("/profile");
  return { success: true, data: { ...updated, stats } };
}

export async function updateProfileFromRequest(
  request: Request,
  input: unknown,
): Promise<ActionResult<UserProfile>> {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = profileUpdateSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Validation failed" };
  }

  const { name, studentId, image } = parsed.data;
  const imageValue = image?.trim() ? image.trim() : null;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      studentId: studentId?.trim() ? studentId.trim() : null,
      image: imageValue,
    },
    select: profileSelect,
  });

  const stats = await loadStats(updated.id);
  return { success: true, data: { ...updated, stats } };
}
