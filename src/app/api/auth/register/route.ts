import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { mintSessionToken } from "@/lib/auth/mint-session-token";
import { setSessionCookieOnResponse } from "@/lib/auth/set-session-cookie";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth.schema";

/**
 * Mobile-friendly registration (mirrors registerAction).
 */
export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Validation failed." },
        { status: 400 },
      );
    }

    const { name, email, studentId, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 },
      );
    }

    const trimmedStudent = studentId?.trim();
    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        studentId: trimmedStudent ? trimmedStudent : null,
        password: hashed,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        studentId: true,
      },
    });

    const sessionToken = await mintSessionToken({
      sub: user.id,
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        ok: true,
        sessionToken,
        expiresIn: 30 * 24 * 60 * 60,
        user,
        message:
          "Account created. Use sessionToken as Authorization: Bearer <token> on mobile.",
      },
      { status: 201 },
    );
    setSessionCookieOnResponse(response, sessionToken);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
