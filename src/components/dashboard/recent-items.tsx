import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileText, Gavel, Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TYPE_LABEL } from "@/lib/utils/constants";
import type { ActivityRow } from "@/lib/actions/dashboard.actions";

type RecentItemsProps = {
  activity: ActivityRow[];
};

function iconFor(a: ActivityRow) {
  if (a.kind === "claim") {
    return { Icon: Gavel, className: "text-amber-600 dark:text-amber-400" };
  }
  return a.type === "LOST"
    ? { Icon: FileText, className: "text-red-600 dark:text-red-400" }
    : { Icon: Package, className: "text-emerald-600 dark:text-emerald-400" };
}

export function RecentItems({ activity }: RecentItemsProps) {
  if (activity.length === 0) {
    return (
      <section className="rounded-xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-biu-navy dark:text-zinc-100">
          Recent activity
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          No recent listings or claims yet. Post a lost or found item to see activity
          here.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
      aria-label="Recent activity"
    >
      <h2 className="px-1 text-sm font-semibold text-biu-navy dark:text-zinc-100">
        Recent activity
      </h2>
      <ol className="relative mt-3 border-l border-zinc-200 pl-4 dark:border-zinc-800">
        {activity.map((a) => {
          const { Icon, className: iconCls } = iconFor(a);
          const href = `/items/${a.itemId}`;
          const title =
            a.kind === "item" ? a.title : `Claim: ${a.itemTitle}`;
          const when = a.at;
          return (
            <li key={a.id} className="mb-4 last:mb-0">
              <div className="absolute -left-[9px] mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950">
                <Icon className={cn("h-2.5 w-2.5", iconCls)} aria-hidden />
              </div>
              <div className="pl-2">
                <p className="text-xs text-zinc-500">
                  {a.kind === "item" ? (
                    <span
                      className={cn(
                        "font-medium",
                        a.type === "LOST"
                          ? "text-red-600 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      {TYPE_LABEL[a.type]}
                    </span>
                  ) : (
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      Claim
                    </span>
                  )}{" "}
                  ·{" "}
                  <time dateTime={when.toISOString()}>
                    {formatDistanceToNow(when, { addSuffix: true })}
                  </time>
                </p>
                <Link
                  href={href}
                  className="mt-0.5 line-clamp-2 text-sm font-medium text-biu-navy hover:underline dark:text-zinc-100"
                >
                  {title}
                </Link>
                {a.kind === "item" ? (
                  <p className="text-xs text-zinc-500">Status: {a.status}</p>
                ) : null}
                {a.kind === "claim" ? (
                  <p className="text-xs text-zinc-500">
                    Status: {a.claimStatus}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
