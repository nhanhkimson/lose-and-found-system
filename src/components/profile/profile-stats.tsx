import { CheckCircle2, FileCheck, Package, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ProfileStats } from "@/lib/actions/profile.actions";

const CARDS: {
  key: keyof ProfileStats;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "myLost", label: "Lost posts", icon: Search },
  { key: "myFound", label: "Found posts", icon: Package },
  { key: "myClaims", label: "Claims", icon: FileCheck },
  { key: "myResolved", label: "Resolved", icon: CheckCircle2 },
];

type ProfileStatsProps = {
  stats: ProfileStats;
};

export function ProfileStatsGrid({ stats }: ProfileStatsProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon }) => (
        <li key={key}>
          <div
            className={cn(
              "flex flex-col gap-1 rounded-xl border border-border bg-surface p-3",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {label}
              </span>
              <Icon className="h-4 w-4 text-primary" aria-hidden />
            </div>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {stats[key]}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
