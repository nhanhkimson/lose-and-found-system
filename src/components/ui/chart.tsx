"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

/** Label + color for shadcn-style chart keys (e.g. `lost`, `found`, category keys). */
export type ChartConfig = Record<
  string,
  { label?: string; color?: string }
>;

type ChartContainerProps = React.PropsWithChildren<{
  id: string;
  className?: string;
  config: ChartConfig;
}>;

/**
 * shadcn-style chart shell: sets `data-chart` and maps `config` to CSS `color: var(--color-*)` on a wrapper for Recharts strokes/fills.
 */
export function ChartContainer({ id, className, config, children }: ChartContainerProps) {
  const style = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(config).map(([k, v]) => [
          `--color-${k}` as const,
          v.color ?? "hsl(220, 10%, 45%)",
        ]),
      ) as React.CSSProperties,
    [config],
  );

  return (
    <div
      data-chart={id}
      className={cn("flex w-full flex-col gap-2", className)}
      style={style}
    >
      {children}
    </div>
  );
}
