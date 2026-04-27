import { CheckCircle2, FileCheck, Package, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";
import type { DashboardStats } from "@/lib/actions/dashboard.actions";

const CARDS: {
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "myLost", label: "My lost", icon: Search },
  { key: "myFound", label: "My found", icon: Package },
  { key: "myClaims", label: "My claims", icon: FileCheck },
  { key: "myResolved", label: "Resolved", icon: CheckCircle2 },
];

type StatsCardsProps = {
  stats: DashboardStats;
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon }) => (
        <li key={key}>
          <div
            className={cn(
              "flex flex-col gap-2 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm",
              "dark:border-zinc-800 dark:bg-zinc-950",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {label}
              </span>
              <Icon
                className="h-5 w-5 text-biu-gold"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
            <p className="text-3xl font-bold text-biu-navy tabular-nums dark:text-zinc-100">
              {stats[key]}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StatsCardsSkeleton() {
  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-hidden
    >
      {["a", "b", "c", "d"].map((k) => (
        <li key={k}>
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-14" />
          </div>
        </li>
      ))}
    </ul>
  );
}
