"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { CATEGORY_LABEL } from "@/lib/utils/constants";
import type { AdminCategoryResolution } from "@/lib/actions/admin.actions";
const chartConfig = {
  rate: { label: "Resolution %", color: "hsl(220, 70%, 45%)" },
} satisfies ChartConfig;

type ResolutionBarProps = {
  data: AdminCategoryResolution[];
};

export function ResolutionBarChart({ data }: ResolutionBarProps) {
  const rows = data.map((d) => ({
    key: d.category,
    label: CATEGORY_LABEL[d.category] ?? d.category,
    rate: d.ratePercent,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resolution rate by category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer id="res-bar" config={chartConfig} className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
              <YAxis
                type="category"
                dataKey="label"
                width={100}
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => (String(v).length > 14 ? `${String(v).slice(0, 12)}…` : v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 14%, 90%)",
                  borderRadius: "8px",
                }}
                formatter={(v) => [`${Number(v ?? 0)}%`, "Resolution"]}
                labelFormatter={(_, p) => String((p?.[0]?.payload as { label?: string })?.label ?? "")}
              />
              <Bar
                dataKey="rate"
                name="Resolution %"
                fill="var(--color-rate, hsl(220, 70%, 45%))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
