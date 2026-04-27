"use client";

import { CATEGORY_LABEL } from "@/lib/utils/constants";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { AdminCategoryCount } from "@/lib/actions/admin.actions";

const COLORS = [
  "hsl(220, 70%, 50%)",
  "hsl(280, 65%, 55%)",
  "hsl(30, 90%, 55%)",
  "hsl(200, 80%, 50%)",
  "hsl(340, 70%, 50%)",
  "hsl(45, 95%, 55%)",
  "hsl(160, 60%, 42%)",
  "hsl(25, 85%, 55%)",
  "hsl(300, 55%, 50%)",
  "hsl(190, 75%, 45%)",
];

type CategoryDonutProps = {
  data: AdminCategoryCount[];
};

export function CategoryDonutChart({ data }: CategoryDonutProps) {
  const rows = data.map((d) => ({
    name: d.category,
    label: CATEGORY_LABEL[d.category] ?? d.category,
    value: d.count,
  }));
  const chartConfig: ChartConfig = data.reduce((acc, d, i) => {
    acc[d.category] = { label: CATEGORY_LABEL[d.category], color: COLORS[i % COLORS.length]! };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items by category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer id="cat-donut" config={chartConfig} className="h-[360px]">
          <div className="flex h-full flex-col gap-2 md:flex-row">
            <div className="h-[300px] min-w-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 14%, 90%)",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [
                      Number(value ?? 0),
                      "Items",
                    ]}
                  />
                  <Pie
                    data={rows}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={2}
                    label={({ percent }) =>
                      (percent ?? 0) > 0.05 ? `${((percent ?? 0) * 100).toFixed(0)}%` : ""
                    }
                  >
                    {rows.map((e, i) => (
                      <Cell
                        key={e.name}
                        fill={COLORS[i % COLORS.length]}
                        name={e.label as string}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex w-full max-w-xs shrink-0 flex-col justify-center gap-2 pl-0 md:pl-2">
              {rows.map((e, i) => (
                <div
                  key={e.name}
                  className="flex items-center justify-between gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="line-clamp-2">{e.label}</span>
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                    {e.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
