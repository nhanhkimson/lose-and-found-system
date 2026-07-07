import { NextResponse } from "next/server";
import { resolveUserFromFirebaseToken } from "@/lib/auth/firebase-user";
import { mintSessionToken } from "@/lib/auth/mint-session-token";
import { setSessionCookieOnResponse } from "@/lib/auth/set-session-cookie";
import { getFirebaseAuth } from "@/lib/firebase/admin";
import { firebaseAuthSchema } from "@/lib/validations/firebase-auth.schema";

/**
 * Exchange a Firebase ID token (mobile Facebook / legacy Firebase sign-in)
 * for a DLFS session token used on all protected REST endpoints.
 */
export async function POST(request: Request) {
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      return NextResponse.json(
        {
          error:
            "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
        },
        { status: 503 },
      );
    }

    const payload: unknown = await request.json();
    const parsed = firebaseAuthSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid request body." },
        { status: 400 },
      );
    }

    const { idToken, studentId, name } = parsed.data;
    const decoded = await auth.verifyIdToken(idToken);
    const user = await resolveUserFromFirebaseToken(decoded, { studentId, name });

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
        studentId: user.studentId,
      },
      message:
        "Use sessionToken as Authorization: Bearer <token> on subsequent API calls.",
    });
    setSessionCookieOnResponse(response, sessionToken);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Firebase sign-in failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
