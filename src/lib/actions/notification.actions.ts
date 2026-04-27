"use server";

import { revalidatePath } from "next/cache";
import type { NotificationKind } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types";

export type NotificationRow = {
  id: string;
  kind: NotificationKind;
  link: string | null;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

const notificationSelect = {
  id: true,
  kind: true,
  link: true,
  title: true,
  message: true,
  read: true,
  createdAt: true,
} as const;

export async function getUserNotifications(): Promise<NotificationRow[] | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: notificationSelect,
  });
}

type CreateInput = {
  userId: string;
  kind?: NotificationKind;
  link?: string | null;
  title: string;
  message: string;
};

export async function createNotification(
  input: CreateInput,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  if (input.userId !== session.user.id && session.user.role !== "ADMIN") {
    return { success: false, error: "Cannot create notification for another user" };
  }
  const row = await prisma.notification.create({
    data: {
      userId: input.userId,
      kind: input.kind ?? "SYSTEM",
      link: input.link ?? null,
      title: input.title,
      message: input.message,
    },
    select: { id: true },
  });
  revalidatePath("/notifications");
  revalidatePath("/dashboard");
  return { success: true, data: { id: row.id } };
}

export async function markAsRead(
  id: string,
): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const res = await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { read: true },
  });
  if (res.count === 0) {
    return { success: false, error: "Not found" };
  }
  revalidatePath("/notifications");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function markAllAsRead(): Promise<ActionResult<void>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/notifications");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}
