import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

/**
 * @swagger
 * /api/notifications:
 * get:
 * tags: [Notifications]
 * summary: List notifications
 * description: Returns latest notifications for signed-in user.
 * parameters:
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * minimum: 1
 * maximum: 200
 * default: 5
 * description: Max notifications to return.
 * responses:
 * 200:
 * description: Notifications fetched.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/NotificationsListResponse'
 * 401:
 * description: Unauthorized.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
const notificationSelect = {
  id: true,
  kind: true,
  link: true,
  title: true,
  message: true,
  read: true,
  createdAt: true,
} as const;

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = Math.min(
    200,
    Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 5),
  );

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: notificationSelect,
    }),
    prisma.notification.count({
      where: { userId: session.user.id, read: false },
    }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}
