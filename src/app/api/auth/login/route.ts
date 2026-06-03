import { NextResponse } from "next/server";
import { mintSessionToken } from "@/lib/auth/mint-session-token";
import { setSessionCookieOnResponse } from "@/lib/auth/set-session-cookie";
import { verifyCredentials } from "@/lib/auth/verify-credentials";
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
    const user = await verifyCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const sessionToken = await mintSessionToken({
      sub: user.id,
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      ok: true,
      sessionToken,
      expiresIn: 30 * 24 * 60 * 60,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
      message:
        "Use sessionToken as Authorization: Bearer <token> on mobile, or the session cookie in browsers.",
    });
    setSessionCookieOnResponse(response, sessionToken);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
