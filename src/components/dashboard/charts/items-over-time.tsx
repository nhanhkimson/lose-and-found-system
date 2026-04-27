"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { AdminDailyTypeCount } from "@/lib/actions/admin.actions";

const chartConfig = {
  lost: { label: "Lost", color: "hsl(0, 72%, 51%)" },
  found: { label: "Found", color: "hsl(142, 71%, 36%)" },
} satisfies ChartConfig;

type ItemsOverTimeProps = {
  data: AdminDailyTypeCount[];
};

export function ItemsOverTimeChart({ data }: ItemsOverTimeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New listings (last 30 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer id="items-time" config={chartConfig} className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => (typeof v === "string" && v.length >= 10 ? v.slice(5) : String(v))}
                stroke="hsl(220, 9%, 46%)"
              />
              <YAxis allowDecimals={false} width={32} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 14%, 90%)",
                  borderRadius: "8px",
                }}
                labelFormatter={(l) => `Date: ${l}`}
              />
              <Legend />
              <Line
                dataKey="lost"
                name="Lost"
                type="monotone"
                stroke="var(--color-lost, hsl(0, 72%, 51%))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                dataKey="found"
                name="Found"
                type="monotone"
                stroke="var(--color-found, hsl(142, 71%, 36%))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
