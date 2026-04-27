"use server";

import {
  type ItemCategory,
  type ItemStatus,
  type ItemType,
  type Prisma,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { auth } from "@/lib/auth";
import { sendMatchFoundEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { PAGINATION } from "@/lib/utils/constants";
import { itemReportFormSchema } from "@/lib/validations/item-report.schema";
import type { ActionResult, ItemDetailPublic, ItemListRow } from "@/types";
import { itemDetailPublicSelect, itemListSelect } from "@/types";

const ITEM_TYPES: ItemType[] = ["LOST", "FOUND"];
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
const STATUSES: ItemStatus[] = ["OPEN", "RESOLVED", "CLOSED"];

export type ItemBrowseParams = {
  page?: string | string[];
  q?: string | string[];
  type?: string | string[];
  category?: string | string[];
  building?: string | string[];
  status?: string | string[];
  dateFrom?: string | string[];
  dateTo?: string | string[];
};

function first(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export type GetItemsData = {
  items: ItemListRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getItems(
  raw: ItemBrowseParams | Record<string, string | string[] | undefined>,
): Promise<ActionResult<GetItemsData>> {
  try {
    const pageRaw = first(raw.page);
    const q = first(raw.q)?.trim() ?? "";
    const typeRaw = first(raw.type)?.toUpperCase();
    const categoryRaw = first(raw.category)?.toUpperCase();
    const building = first(raw.building)?.trim() ?? "";
    const statusRaw = first(raw.status)?.toUpperCase();
    const dateFrom = first(raw.dateFrom);
    const dateTo = first(raw.dateTo);

    const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1);
    const pageSize = PAGINATION.defaultPageSize;

    const typeFilter: ItemType | undefined =
      typeRaw && ITEM_TYPES.includes(typeRaw as ItemType)
        ? (typeRaw as ItemType)
        : undefined;

    const categoryFilter: ItemCategory | undefined =
      categoryRaw && CATEGORIES.includes(categoryRaw as ItemCategory)
        ? (categoryRaw as ItemCategory)
        : undefined;

    const statusFilter: ItemStatus | undefined =
      statusRaw && STATUSES.includes(statusRaw as ItemStatus)
        ? (statusRaw as ItemStatus)
        : undefined;

    const and: Prisma.ItemWhereInput[] = [];

    if (q) {
      and.push({
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      });
    }
    if (typeFilter) {
      and.push({ type: typeFilter });
    }
    if (categoryFilter) {
      and.push({ category: categoryFilter });
    }
    if (building) {
      and.push({ building });
    }
    if (statusFilter) {
      and.push({ status: statusFilter });
    }
    if (dateFrom) {
      try {
        const d = startOfDay(parseISO(dateFrom));
        and.push({ eventDate: { gte: d } });
      } catch {
        // ignore invalid
      }
    }
    if (dateTo) {
      try {
        const d = endOfDay(parseISO(dateTo));
        and.push({ eventDate: { lte: d } });
      } catch {
        // ignore invalid
      }
    }

    const where: Prisma.ItemWhereInput =
      and.length > 0 ? { AND: and } : {};

    const [total, rows] = await Promise.all([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        select: itemListSelect,
        orderBy: { eventDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      success: true,
      data: {
        items: rows,
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load items";
    return { success: false, error: message };
  }
}

/**
 * Home page: recent listings (unchanged behavior from earlier phase).
 */
export async function getData(): Promise<ActionResult<ItemListRow[]>> {
  try {
    const data = await prisma.item.findMany({
      select: itemListSelect,
      orderBy: { eventDate: "desc" },
      take: 20,
    });
    return { success: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load items";
    return { success: false, error: message };
  }
}

/**
 * Fetches a single item for the public detail page and increments the view count.
 */
export async function getItemById(
  id: string,
): Promise<ItemDetailPublic | null> {
  const existing = await prisma.item.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return null;
  }

  const item = await prisma.item.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    select: itemDetailPublicSelect,
  });
  return item;
}

/**
 * Read-only item fetch without bumping views (e.g. server components that re-render).
 */
export async function getItemByIdNoTrack(
  id: string,
): Promise<ItemDetailPublic | null> {
  return prisma.item.findUnique({
    where: { id },
    select: itemDetailPublicSelect,
  });
}

export async function getSimilarItems(
  excludeId: string,
  category: ItemCategory,
): Promise<ItemListRow[]> {
  return prisma.item.findMany({
    where: {
      id: { not: excludeId },
      category,
    },
    select: itemListSelect,
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}

/**
 * Create a new lost/found listing from the multi-step report form.
 */
export async function createItem(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to post a listing." };
  }

  const parsed = itemReportFormSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { success: false, error: first?.message ?? "Check the form and try again." };
  }
  const d = parsed.data;

  const name = session.user.name?.trim() || "BIU student";
  const contactEmail = session.user.email;
  const urls = d.imageUrls;
  const imageUrl = urls[0] ?? null;
  const imageRest = urls.length > 1 ? urls.slice(1) : [];

  try {
    const item = await prisma.item.create({
      data: {
        userId: session.user.id,
        type: d.type,
        status: "OPEN",
        title: d.title.trim(),
        description: d.description.trim(),
        category: d.category,
        color: d.color?.trim() || null,
        brand: d.brand?.trim() || null,
        building: d.building,
        roomHint: d.roomHint.trim(),
        contactName: name,
        contactEmail: d.allowContact ? contactEmail : null,
        contactPhone: null,
        imageUrl,
        imageUrls: imageRest,
        eventDate: d.eventDate,
        timeApprox: d.type === "LOST" ? (d.timeApprox?.trim() || null) : null,
        foundDisposition: d.type === "FOUND" ? d.foundDisposition! : null,
        reward: d.type === "LOST" ? (d.reward?.trim() || null) : null,
        notifyOnMatch: d.notifyOnMatch,
        allowContact: d.allowContact,
      },
    });
    revalidatePath("/items");
    revalidatePath("/my-items");
    revalidatePath("/dashboard");

    if (d.notifyOnMatch) {
      try {
        const match = await prisma.item.findFirst({
          where: {
            id: { not: item.id },
            status: "OPEN",
            category: item.category,
            type: d.type === "LOST" ? "FOUND" : "LOST",
          },
          orderBy: { createdAt: "desc" },
        });
        const poster = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { email: true },
        });
        if (match && poster?.email) {
          await sendMatchFoundEmail({
            to: poster.email,
            yourItemTitle: item.title,
            matchItemId: match.id,
            matchItemTitle: match.title,
            category: match.category,
            building: match.building,
          });
        }
      } catch (e) {
        console.error("[item] match notification email failed", e);
      }
    }

    return { success: true, data: { id: item.id } };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create listing";
    return { success: false, error: message };
  }
}
