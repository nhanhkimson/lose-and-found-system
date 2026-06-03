import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth, signIn } from "@/lib/auth";
import { readSessionTokenFromCookies } from "@/lib/auth/session-cookie";
import { mintSessionToken } from "@/lib/auth/mint-session-token";
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

    const cookieStore = await cookies();
    let sessionToken = readSessionTokenFromCookies(cookieStore);
    if (!sessionToken) {
      sessionToken = await mintSessionToken({
        sub: session.user.id,
        id: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
      });
    }

    return NextResponse.json({
      ok: true,
      sessionToken,
      expiresIn: 30 * 24 * 60 * 60,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      message:
        "Use sessionToken as Authorization: Bearer <token> on mobile, or the session cookie in browsers.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
