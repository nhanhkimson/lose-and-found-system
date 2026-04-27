import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getDashboardStats,
  getMatchSuggestions,
  getRecentActivity,
} from "@/lib/actions/dashboard.actions";
import { MatchSuggestions } from "@/components/dashboard/match-suggestions";
import { RecentItems } from "@/components/dashboard/recent-items";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [stats, matchSuggestions, recentActivity] = await Promise.all([
    getDashboardStats(),
    getMatchSuggestions(),
    getRecentActivity(),
  ]);
  const potentialCount = matchSuggestions.length;

  if (!stats) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-biu-navy dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Overview of your listings, claims, and suggested matches.
        </p>
      </div>

      <section aria-label="Stats">
        <StatsCards stats={stats} />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-biu-navy dark:text-zinc-200">
          Potential matches
        </h2>
        {potentialCount > 0 ? (
          <p className="text-xs text-zinc-500">
            {potentialCount} suggested pairing
            {potentialCount === 1 ? "" : "s"} from open listings in the last 90 days.
          </p>
        ) : null}
        <MatchSuggestions items={matchSuggestions} />
      </section>

      <section>
        <RecentItems activity={recentActivity} />
      </section>
    </div>
  );
}
