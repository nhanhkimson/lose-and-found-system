import { type ClaimStatus, type ClaimType, Prisma } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getApiSession } from "@/lib/auth/api-session";
import { prisma } from "@/lib/prisma";
import { PAGINATION } from "@/lib/utils/constants";
import { createClaimInputSchema } from "@/lib/validations/claim.schema";

function mapItemTypeToClaimType(type: "LOST" | "FOUND"): ClaimType {
  return type === "LOST" ? "FINDER" : "OWNER";
}

/**
 * @swagger
 * /api/claims:
 * post:
 * tags: [Claims]
 * summary: Create claim for item
 * description: Requires authenticated session cookie.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * itemId: { type: string }
 * message: { type: string }
 * proofImageUrls:
 * type: array
 * items: { type: string }
 * required: [itemId, message]
 * responses:
 * 201:
 * description: Claim created.
 * 400:
 * description: Validation or business error.
 * 401:
 * description: Unauthorized.
 */
const CLAIM_STATUSES: ClaimStatus[] = ["PENDING", "APPROVED", "REJECTED"];

/**
 * GET /api/claims — current user's claims (paginated).
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getApiSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = Math.max(
      1,
      Number.parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1,
    );
    const statusRaw = request.nextUrl.searchParams
      .get("status")
      ?.toUpperCase();
    const statusFilter: ClaimStatus | undefined =
      statusRaw && CLAIM_STATUSES.includes(statusRaw as ClaimStatus)
        ? (statusRaw as ClaimStatus)
        : undefined;

    const pageSize = PAGINATION.defaultPageSize;
    const where: Prisma.ClaimWhereInput = {
      userId: session.user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    };

    const [total, claims] = await Promise.all([
      prisma.claim.count({ where }),
      prisma.claim.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          status: true,
          type: true,
          message: true,
          proofImageUrls: true,
          adminNote: true,
          createdAt: true,
          reviewedAt: true,
          item: {
            select: {
              id: true,
              title: true,
              type: true,
              status: true,
              imageUrl: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      claims,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch claims.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getApiSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: unknown = await request.json();
    const parsed = createClaimInputSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid payload." },
        { status: 400 },
      );
    }

    const { itemId, message, proofImageUrls } = parsed.data;
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, type: true, status: true },
    });
    if (!item) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }
    if (item.status !== "OPEN") {
      return NextResponse.json(
        { error: "This item is not accepting new claims." },
        { status: 400 },
      );
    }

    const approved = await prisma.claim.findFirst({
      where: { itemId, status: "APPROVED" },
      select: { id: true },
    });
    if (approved) {
      return NextResponse.json(
        { error: "This item already has an approved claim." },
        { status: 400 },
      );
    }

    const created = await prisma.claim.create({
      data: {
        itemId,
        userId: session.user.id,
        type: mapItemTypeToClaimType(item.type),
        message,
        proofImageUrls,
      },
      select: { id: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "You already submitted a claim for this item." },
        { status: 400 },
      );
    }
    const message =
      error instanceof Error ? error.message : "Failed to create claim.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
