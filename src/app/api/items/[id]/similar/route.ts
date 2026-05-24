import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { itemListSelect } from "@/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * @swagger
 * /api/items/{id}/similar:
 * get:
 * tags: [Items]
 * summary: Get similar items by category
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema: { type: string }
 * responses:
 * 200:
 * description: Similar items.
 * 404:
 * description: Item not found.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const current = await prisma.item.findUnique({
      where: { id },
      select: { id: true, category: true },
    });
    if (!current) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    const similar = await prisma.item.findMany({
      where: {
        id: { not: id },
        category: current.category,
      },
      select: itemListSelect,
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return NextResponse.json({ items: similar });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load similar items.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
