import { NextResponse } from "next/server";
import { changeProfilePasswordFromRequest } from "@/lib/actions/profile.actions";

/**
 * POST /api/profile/password — change password (credentials accounts only)
 */
export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    const result = await changeProfilePasswordFromRequest(request, payload);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to change password.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
