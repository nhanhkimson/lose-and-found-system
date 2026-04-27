import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
