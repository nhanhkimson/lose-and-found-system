import { AuthError } from "next-auth";
import { NextResponse } from "next/server";
import { auth, signIn } from "@/lib/auth";
import { authLoginSchema } from "@/lib/validations/auth-login.schema";

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    const parsed = authLoginSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid request body." },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 },
        );
      }
      throw error;
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sign-in succeeded but session was not created." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      message:
        "Session cookie set. Protected endpoints on this origin will use it automatically.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
