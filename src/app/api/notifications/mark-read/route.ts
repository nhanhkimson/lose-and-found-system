import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/notifications/mark-read:
 *   post:
 *     tags: [Notifications]
 *     summary: Mark notifications as read
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarkReadRequest'
 *           examples:
 *             markAll:
 *               value:
 *                 all: true
 *             markByIds:
 *               value:
 *                 ids: ["clx123", "clx456"]
 *     responses:
 *       200:
 *         description: Read state updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *               required: [ok]
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { all?: boolean; ids?: string[] };

  if (body.all) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });
  } else if (body.ids?.length) {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        id: { in: body.ids },
      },
      data: { read: true },
    });
  }

  return NextResponse.json({ ok: true });
}
