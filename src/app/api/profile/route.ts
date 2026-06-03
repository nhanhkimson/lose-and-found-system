import { NextResponse } from "next/server";
import {
  getProfileFromRequest,
  updateProfileFromRequest,
} from "@/lib/actions/profile.actions";

/**
 * GET /api/profile — current user profile + activity stats
 * PATCH /api/profile — update name, studentId, image URL
 * Auth: session cookie or Authorization: Bearer <sessionToken>
 */
export async function GET(request: Request) {
  try {
    const profile = await getProfileFromRequest(request);
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ profile });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload: unknown = await request.json();
    const result = await updateProfileFromRequest(request, payload);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 },
      );
    }
    return NextResponse.json({ profile: result.data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
