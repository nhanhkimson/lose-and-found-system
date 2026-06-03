"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getApiSession } from "@/lib/auth/api-session";
import { prisma } from "@/lib/prisma";
import {
  profilePasswordChangeSchema,
  profileUpdateSchema,
} from "@/lib/validations/profile.schema";
import type { ActionResult } from "@/types";
import type { UserRole } from "@prisma/client";
import type { ActivityRow } from "@/lib/actions/dashboard.actions";

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
  hasPassword: boolean;
  stats: ProfileStats;
  recentActivity: ActivityRow[];
};

const profileSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  studentId: true,
  createdAt: true,
  password: true,
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

async function loadRecentActivity(userId: string): Promise<ActivityRow[]> {
  const [itemRows, claimRows] = await Promise.all([
    prisma.item.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        updatedAt: true,
      },
    }),
    prisma.claim.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        status: true,
        createdAt: true,
        item: { select: { id: true, title: true } },
      },
    }),
  ]);

  const activities: ActivityRow[] = [
    ...itemRows.map(
      (i): ActivityRow => ({
        kind: "item",
        id: `i-${i.id}`,
        itemId: i.id,
        title: i.title,
        type: i.type,
        status: i.status,
        at: i.updatedAt,
      }),
    ),
    ...claimRows.map(
      (c): ActivityRow => ({
        kind: "claim",
        id: `c-${c.id}`,
        itemId: c.item.id,
        itemTitle: c.item.title,
        claimStatus: c.status,
        at: c.createdAt,
      }),
    ),
  ];
  activities.sort((a, b) => b.at.getTime() - a.at.getTime());
  return activities.slice(0, 10);
}

async function buildProfile(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });
  if (!user) return null;

  const [stats, recentActivity] = await Promise.all([
    loadStats(userId),
    loadRecentActivity(userId),
  ]);

  const { password, ...rest } = user;
  return {
    ...rest,
    hasPassword: Boolean(password),
    stats,
    recentActivity,
  };
}

export async function getProfile(): Promise<UserProfile | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return buildProfile(session.user.id);
}

export async function getProfileFromRequest(
  request: Request,
): Promise<UserProfile | null> {
  const session = await getApiSession(request);
  if (!session?.user?.id) return null;
  return buildProfile(session.user.id);
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

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      studentId: studentId?.trim() ? studentId.trim() : null,
      image: imageValue,
    },
  });

  const profile = await buildProfile(session.user.id);
  if (!profile) {
    return { success: false, error: "Profile not found after update." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true, data: profile };
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

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      studentId: studentId?.trim() ? studentId.trim() : null,
      image: imageValue,
    },
  });

  const profile = await buildProfile(session.user.id);
  if (!profile) {
    return { success: false, error: "Profile not found after update." };
  }

  return { success: true, data: profile };
}

export async function changeProfilePasswordAction(
  input: unknown,
): Promise<ActionResult<{ ok: true }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = profilePasswordChangeSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Validation failed" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });
  if (!user?.password) {
    return {
      success: false,
      error:
        "This account uses social sign-in only. Set a password via register or contact support.",
    };
  }

  const ok = await bcrypt.compare(
    parsed.data.currentPassword,
    user.password,
  );
  if (!ok) {
    return { success: false, error: "Current password is incorrect." };
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return { success: true, data: { ok: true } };
}

export async function changeProfilePasswordFromRequest(
  request: Request,
  input: unknown,
): Promise<ActionResult<{ ok: true }>> {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = profilePasswordChangeSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Validation failed" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });
  if (!user?.password) {
    return {
      success: false,
      error:
        "This account uses social sign-in only and has no password to change.",
    };
  }

  const ok = await bcrypt.compare(
    parsed.data.currentPassword,
    user.password,
  );
  if (!ok) {
    return { success: false, error: "Current password is incorrect." };
  }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  });

  return { success: true, data: { ok: true } };
}
