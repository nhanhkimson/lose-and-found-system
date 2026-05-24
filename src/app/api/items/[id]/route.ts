import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { itemDetailPublicSelect } from "@/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * @swagger
 * /api/items/{id}:
 * get:
 * tags: [Items]
 * summary: Get item detail
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * - in: query
 * name: track
 * schema: { type: boolean, default: true }
 * description: Whether to increment viewCount.
 * responses:
 * 200:
 * description: Item detail.
 * 404:
 * description: Not found.
 * patch:
 * tags: [Items]
 * summary: Update item status
 * description: Owner or admin only.
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status:
 * type: string
 * enum: [OPEN, RESOLVED, CLOSED]
 * required: [status]
 * responses:
 * 200:
 * description: Updated item.
 * 401:
 * description: Unauthorized.
 * 403:
 * description: Forbidden.
 * 404:
 * description: Not found.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const track = request.nextUrl.searchParams.get("track") !== "false";

    if (track) {
      const exists = await prisma.item.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!exists) {
        return NextResponse.json({ error: "Item not found." }, { status: 404 });
      }
      const item = await prisma.item.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
        select: itemDetailPublicSelect,
      });
      return NextResponse.json(item);
    }

    const item = await prisma.item.findUnique({
      where: { id },
      select: itemDetailPublicSelect,
    });
    if (!item) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;
    const body = (await request.json()) as { status?: string };
    const status = body.status?.toUpperCase();
    if (!status || !["OPEN", "RESOLVED", "CLOSED"].includes(status)) {
      return NextResponse.json(
        { error: "status must be OPEN, RESOLVED, or CLOSED." },
        { status: 400 },
      );
    }

    const existing = await prisma.item.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    const isOwner = existing.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.item.update({
      where: { id },
      data: { status: status as "OPEN" | "RESOLVED" | "CLOSED" },
      select: itemDetailPublicSelect,
    });
    return NextResponse.json(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
