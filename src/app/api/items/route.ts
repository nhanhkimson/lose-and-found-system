import { type ItemCategory, type ItemStatus, type ItemType, type Prisma } from "@prisma/client";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PAGINATION } from "@/lib/utils/constants";
import { itemReportFormSchema } from "@/lib/validations/item-report.schema";
import { itemListSelect } from "@/types";

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

/**
 * @swagger
 * /api/items:
 *   get:
 *     tags: [Items]
 *     summary: List items
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [LOST, FOUND] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: building
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [OPEN, RESOLVED, CLOSED] }
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Paginated item list.
 *   post:
 *     tags: [Items]
 *     summary: Create item listing
 *     description: Requires authenticated session cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Item created.
 *       401:
 *         description: Unauthorized.
 *       400:
 *         description: Validation error.
 */
export async function GET(request: NextRequest) {
  try {
    const pageRaw = request.nextUrl.searchParams.get("page");
    const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    const typeRaw = request.nextUrl.searchParams.get("type")?.toUpperCase();
    const categoryRaw = request.nextUrl.searchParams.get("category")?.toUpperCase();
    const building = request.nextUrl.searchParams.get("building")?.trim() ?? "";
    const statusRaw = request.nextUrl.searchParams.get("status")?.toUpperCase();
    const dateFrom = request.nextUrl.searchParams.get("dateFrom");
    const dateTo = request.nextUrl.searchParams.get("dateTo");

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
    if (typeFilter) and.push({ type: typeFilter });
    if (categoryFilter) and.push({ category: categoryFilter });
    if (building) and.push({ building });
    if (statusFilter) and.push({ status: statusFilter });
    if (dateFrom) {
      try {
        and.push({ eventDate: { gte: startOfDay(parseISO(dateFrom)) } });
      } catch {
        // ignore invalid date
      }
    }
    if (dateTo) {
      try {
        and.push({ eventDate: { lte: endOfDay(parseISO(dateTo)) } });
      } catch {
        // ignore invalid date
      }
    }

    const where: Prisma.ItemWhereInput = and.length > 0 ? { AND: and } : {};
    const [total, items] = await Promise.all([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        select: itemListSelect,
        orderBy: { eventDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch items.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: unknown = await request.json();
    const parsed = itemReportFormSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid payload." },
        { status: 400 },
      );
    }

    const d = parsed.data;
    const imageUrl = d.imageUrls[0] ?? null;
    const imageUrls = d.imageUrls.length > 1 ? d.imageUrls.slice(1) : [];

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
        contactName: session.user.name?.trim() || "BIU student",
        contactEmail: d.allowContact ? (session.user.email ?? null) : null,
        contactPhone: null,
        imageUrl,
        imageUrls,
        eventDate: d.eventDate,
        timeApprox: d.type === "LOST" ? (d.timeApprox?.trim() || null) : null,
        foundDisposition: d.type === "FOUND" ? d.foundDisposition! : null,
        reward: d.type === "LOST" ? (d.reward?.trim() || null) : null,
        notifyOnMatch: d.notifyOnMatch,
        allowContact: d.allowContact,
      },
      select: { id: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
