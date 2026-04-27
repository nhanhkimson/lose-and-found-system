"use client";

import { CategoryDonutChart } from "@/components/dashboard/charts/category-donut";
import { ItemsOverTimeChart } from "@/components/dashboard/charts/items-over-time";
import { ResolutionBarChart } from "@/components/dashboard/charts/resolution-bar";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminStatsPayload } from "@/lib/actions/admin.actions";

type Props = {
  stats: AdminStatsPayload;
};

export function AdminStatsDashboard({ stats }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-biu-navy dark:text-zinc-100">
          Admin dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Platform overview, resolution metrics, and trends.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="New items (this month)" value={stats.itemsThisMonth} />
        <StatCard title="Active lost" value={stats.activeLost} hint="OPEN" />
        <StatCard title="Active found" value={stats.activeFound} hint="OPEN" />
        <StatCard
          title="Resolution rate"
          value={`${stats.resolutionRatePercent}%`}
          hint="resolved / (resolved + active)"
        />
        <StatCard
          title="Avg. days to resolution"
          value={
            stats.avgDaysToResolution === null
              ? "—"
              : String(stats.avgDaysToResolution)
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ItemsOverTimeChart data={stats.itemsPerDay} />
        <CategoryDonutChart data={stats.itemsPerCategory} />
      </section>

      <section>
        <ResolutionBarChart data={stats.resolutionByCategory} />
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {title}
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-biu-navy dark:text-zinc-100">
          {value}
        </p>
        {hint ? <p className="mt-0.5 text-xs text-zinc-500">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
