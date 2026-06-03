import { NextResponse, type NextRequest } from "next/server";
import { getApiSession } from "@/lib/auth/api-session";
import { getProfileFromRequest } from "@/lib/actions/profile.actions";

/**
 * Validates session (cookie or Bearer) and returns user + profile summary.
 */
export async function GET(request: NextRequest) {
  const session = await getApiSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfileFromRequest(request);

  return NextResponse.json({
    ok: true,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      image: session.user.image,
    },
    profile,
  });
}
