import { type ClaimType, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
export async function POST(request: Request) {
  try {
    const session = await auth();
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
