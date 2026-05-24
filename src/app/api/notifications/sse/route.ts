import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * @swagger
 * /api/notifications/sse:
 * get:
 * tags: [Notifications]
 * summary: Notification unread count stream (SSE alias)
 * description: Alias of /api/notifications/stream. Returns text/event-stream with unread count updates.
 * responses:
 * 200:
 * description: SSE stream opened.
 * content:
 * text/event-stream:
 * schema:
 * type: string
 * example:"data: {\"type\":\"unread\",\"unreadCount\":3}"
 * 401:
 * description: Unauthorized.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const write = (obj: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };

      const sendUnread = async () => {
        const c = await prisma.notification.count({
          where: { userId, read: false },
        });
        write({ type: "unread", unreadCount: c });
      };

      await sendUnread();
      const interval = setInterval(() => {
        void sendUnread();
      }, 5000);

      const onAbort = () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // ignore
        }
      };

      req.signal.addEventListener("abort", onAbort, { once: true });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
