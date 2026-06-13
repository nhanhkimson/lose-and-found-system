import { NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/api-session";
import {
  fetchDashboardStats,
  fetchMatchSuggestions,
  fetchRecentActivity,
} from "@/lib/dashboard/dashboard-data";

/**
 * GET /api/dashboard — stats, match suggestions, recent activity (mobile + API clients).
 */
export async function GET(request: Request) {
  try {
    const session = await getApiSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const [stats, matches, activity] = await Promise.all([
      fetchDashboardStats(userId),
      fetchMatchSuggestions(userId),
      fetchRecentActivity(userId),
    ]);

    return NextResponse.json({
      ok: true,
      stats,
      matches,
      activity,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load dashboard.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
