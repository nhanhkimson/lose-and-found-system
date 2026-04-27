"use server";

import { revalidatePath } from "next/cache";
import type {
  ClaimStatus,
  ItemCategory,
  ItemStatus,
  ItemType,
  UserRole,
} from "@prisma/client";
import { differenceInCalendarDays, endOfMonth, format, startOfDay, startOfMonth, subDays } from "date-fns";
import { z } from "zod";
import { auth } from "@/lib/auth";
import {
  sendClaimApprovedEmail,
  sendClaimRejectedEmail,
} from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { buildGalleryUrls } from "@/lib/utils/item-gallery";
import type { ActionResult } from "@/types";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

const CATEGORIES: ItemCategory[] = [
  "ELECTRONICS",
  "DOCUMENTS",
  "KEYS",
  "CLOTHING",
  "BOOKS",
  "ACCESSORIES",
  "SPORTS",
  "STATIONERY",
  "BAGS",
  "OTHER",
];

// ——— Admin dashboard stats ———

export type AdminCategoryCount = { category: ItemCategory; count: number };
export type AdminDailyTypeCount = { date: string; lost: number; found: number };
export type AdminCategoryResolution = {
  category: ItemCategory;
  ratePercent: number;
  resolved: number;
  open: number;
};

export type AdminStatsPayload = {
  itemsThisMonth: number;
  activeLost: number;
  activeFound: number;
  resolutionRatePercent: number;
  avgDaysToResolution: number | null;
  itemsPerCategory: AdminCategoryCount[];
  itemsPerDay: AdminDailyTypeCount[];
  resolutionByCategory: AdminCategoryResolution[];
};

export async function getAdminStats(): Promise<AdminStatsPayload | null> {
  if (!(await assertAdmin())) return null;
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const day0 = startOfDay(subDays(now, 29));

  const [
    itemsThisMonth,
    activeLost,
    activeFound,
    resolvedCount,
    openCount,
    resolvedItems,
    perCategory,
    recentItems,
  ] = await Promise.all([
    prisma.item.count({
      where: { createdAt: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.item.count({ where: { type: "LOST", status: "OPEN" } }),
    prisma.item.count({ where: { type: "FOUND", status: "OPEN" } }),
    prisma.item.count({ where: { status: "RESOLVED" } }),
    prisma.item.count({ where: { status: "OPEN" } }),
    prisma.item.findMany({
      where: { status: "RESOLVED" },
      select: { createdAt: true, updatedAt: true },
    }),
    prisma.item.groupBy({
      by: ["category"],
      _count: { id: true },
    }),
    prisma.item.findMany({
      where: { createdAt: { gte: day0 } },
      select: { createdAt: true, type: true },
    }),
  ]);

  const denom = resolvedCount + openCount;
  const resolutionRatePercent =
    denom === 0 ? 0 : Math.round((resolvedCount / denom) * 1000) / 10;

  const avgDaysToResolution =
    resolvedItems.length === 0
      ? null
      : Math.round(
          (resolvedItems.reduce(
            (s, it) => s + differenceInCalendarDays(it.updatedAt, it.createdAt),
            0,
          ) /
            resolvedItems.length) *
            10,
        ) / 10;

  const dayMap = new Map<string, { lost: number; found: number }>();
  for (let i = 0; i < 30; i += 1) {
    const d = format(startOfDay(subDays(now, 29 - i)), "yyyy-MM-dd");
    dayMap.set(d, { lost: 0, found: 0 });
  }
  for (const it of recentItems) {
    const key = format(startOfDay(it.createdAt), "yyyy-MM-dd");
    if (!dayMap.has(key)) continue;
    const b = dayMap.get(key)!;
    if (it.type === "LOST") b.lost += 1;
    if (it.type === "FOUND") b.found += 1;
  }
  const itemsPerDay: AdminDailyTypeCount[] = Array.from(dayMap.entries()).map(
    ([date, v]) => ({ date, ...v }),
  );

  const itemsPerCategory: AdminCategoryCount[] = perCategory.map((g) => ({
    category: g.category,
    count: g._count.id,
  }));

  const resolutionByCategory: AdminCategoryResolution[] = await Promise.all(
    CATEGORIES.map(async (category) => {
      const [r, o] = await Promise.all([
        prisma.item.count({ where: { category, status: "RESOLVED" } }),
        prisma.item.count({ where: { category, status: "OPEN" } }),
      ]);
      const d = r + o;
      return {
        category,
        resolved: r,
        open: o,
        ratePercent: d === 0 ? 0 : Math.round((r / d) * 1000) / 10,
      };
    }),
  );

  return {
    itemsThisMonth,
    activeLost,
    activeFound,
    resolutionRatePercent,
    avgDaysToResolution,
    itemsPerCategory,
    itemsPerDay,
    resolutionByCategory,
  };
}

// ——— Claims ———

export type AdminClaimRow = {
  id: string;
  status: ClaimStatus;
  message: string;
  createdAt: Date;
  itemId: string;
  itemTitle: string;
  userId: string;
  claimantName: string | null;
  claimantEmail: string | null;
};

export async function listAdminClaims(
  status?: ClaimStatus | "ALL",
): Promise<AdminClaimRow[] | null> {
  if (!(await assertAdmin())) return null;
  const where =
    status && status !== "ALL" ? { status } : undefined;
  const rows = await prisma.claim.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      item: { select: { id: true, title: true } },
    },
  });
  return rows.map((c) => ({
    id: c.id,
    status: c.status,
    message: c.message,
    createdAt: c.createdAt,
    itemId: c.itemId,
    itemTitle: c.item.title,
    userId: c.userId,
    claimantName: c.user.name,
    claimantEmail: c.user.email,
  }));
}

export type ClaimDetailPayload = {
  claim: {
    id: string;
    status: ClaimStatus;
    message: string;
    type: import("@prisma/client").ClaimType;
    proofImageUrls: string[];
    adminNote: string | null;
    createdAt: Date;
  };
  item: {
    id: string;
    title: string;
    description: string;
    type: ItemType;
    category: ItemCategory;
    building: string;
    status: ItemStatus;
    imageUrl: string | null;
    imageUrls: string[];
  };
  itemGalleryUrls: string[];
  user: { name: string | null; email: string | null };
};

export async function getAdminClaimForReview(
  claimId: string,
): Promise<ClaimDetailPayload | null> {
  if (!(await assertAdmin())) return null;
  const row = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      user: { select: { name: true, email: true } },
      item: {
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          category: true,
          building: true,
          status: true,
          imageUrl: true,
          imageUrls: true,
        },
      },
    },
  });
  if (!row) return null;
  return {
    claim: {
      id: row.id,
      status: row.status,
      message: row.message,
      type: row.type,
      proofImageUrls: row.proofImageUrls,
      adminNote: row.adminNote,
      createdAt: row.createdAt,
    },
    item: row.item,
    itemGalleryUrls: buildGalleryUrls(row.item),
    user: { name: row.user.name, email: row.user.email },
  };
}

const reviewSchema = z.object({
  claimId: z.string().min(1),
  decision: z.enum(["APPROVE", "REJECT"]),
  adminNote: z.string().max(2000).optional(),
});

export async function reviewClaim(
  input: unknown,
): Promise<ActionResult<void>> {
  const session = await assertAdmin();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid request" };
  }
  const { claimId, decision, adminNote } = parsed.data;
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      item: true,
      user: { select: { email: true, name: true } },
    },
  });
  if (!claim) {
    return { success: false, error: "Claim not found" };
  }
  if (claim.status !== "PENDING") {
    return { success: false, error: "Claim is no longer pending" };
  }

  const newStatus: ClaimStatus = decision === "APPROVE" ? "APPROVED" : "REJECTED";
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.claim.update({
      where: { id: claimId },
      data: {
        status: newStatus,
        adminNote: adminNote?.trim() || null,
        reviewedAt: now,
      },
    });
    if (decision === "APPROVE") {
      await tx.item.update({
        where: { id: claim.itemId },
        data: { status: "RESOLVED" },
      });
      await tx.claim.updateMany({
        where: {
          itemId: claim.itemId,
          id: { not: claimId },
          status: "PENDING",
        },
        data: {
          status: "REJECTED",
          adminNote: "Closed: another claim was approved.",
          reviewedAt: now,
        },
      });
    }
  });

  revalidatePath("/admin/claims");
  revalidatePath("/claims");
  revalidatePath(`/items/${claim.itemId}`);

  try {
    const email = claim.user.email;
    if (email) {
      if (decision === "APPROVE") {
        await sendClaimApprovedEmail({
          to: email,
          itemId: claim.itemId,
          itemTitle: claim.item.title,
          recipientName: claim.user.name,
        });
      } else {
        await sendClaimRejectedEmail({
          to: email,
          itemTitle: claim.item.title,
          recipientName: claim.user.name,
          adminNote: adminNote?.trim() || null,
        });
      }
    }
  } catch (e) {
    console.error("[admin] claim review email failed", e);
  }

  return { success: true, data: undefined };
}

// ——— Items ———

export type AdminItemRow = {
  id: string;
  title: string;
  type: ItemType;
  category: ItemCategory;
  building: string;
  status: ItemStatus;
  eventDate: Date;
  createdAt: Date;
};

export async function listAdminItems(): Promise<AdminItemRow[] | null> {
  if (!(await assertAdmin())) return null;
  return prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      id: true,
      title: true,
      type: true,
      category: true,
      building: true,
      status: true,
      eventDate: true,
      createdAt: true,
    },
  });
}

export async function adminDeleteItem(
  itemId: string,
): Promise<ActionResult<void>> {
  if (!(await assertAdmin())) {
    return { success: false, error: "Unauthorized" };
  }
  await prisma.item.delete({ where: { id: itemId } });
  revalidatePath("/admin/items");
  revalidatePath("/items");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function adminSetItemStatus(
  itemId: string,
  status: ItemStatus,
): Promise<ActionResult<void>> {
  if (!(await assertAdmin())) {
    return { success: false, error: "Unauthorized" };
  }
  await prisma.item.update({
    where: { id: itemId },
    data: { status },
  });
  revalidatePath("/admin/items");
  revalidatePath("/items");
  revalidatePath(`/items/${itemId}`);
  return { success: true, data: undefined };
}

// ——— Users ———

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  studentId: string | null;
  items: number;
  claims: number;
  createdAt: Date;
};

export async function listAdminUsers(): Promise<AdminUserRow[] | null> {
  if (!(await assertAdmin())) return null;
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      studentId: true,
      createdAt: true,
      _count: { select: { items: true, claims: true } },
    },
  });
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    studentId: u.studentId,
    items: u._count.items,
    claims: u._count.claims,
    createdAt: u.createdAt,
  }));
}

export async function adminUpdateUserRole(
  userId: string,
  role: UserRole,
): Promise<ActionResult<void>> {
  const session = await assertAdmin();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }
  if (userId === session.user.id) {
    return { success: false, error: "You cannot change your own role from here" };
  }
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin/users");
  return { success: true, data: undefined };
}
