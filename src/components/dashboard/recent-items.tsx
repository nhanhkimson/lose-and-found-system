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
    return { Icon: Gavel, className: "text-warning" };
  }
  return a.type === "LOST"
    ? { Icon: FileText, className: "text-danger" }
    : { Icon: Package, className: "text-found" };
}

export function RecentItems({ activity }: RecentItemsProps) {
  if (activity.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-foreground">
          Recent activity
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No recent listings or claims yet. Post a lost or found item to see
          activity here.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-xl border border-border bg-surface p-4"
      aria-label="Recent activity"
    >
      <h2 className="px-1 text-sm font-semibold text-foreground">
        Recent activity
      </h2>
      <ol className="relative mt-3 border-l border-border pl-4">
        {activity.map((a) => {
          const { Icon, className: iconCls } = iconFor(a);
          const href = `/items/${a.itemId}`;
          const title = a.kind === "item" ? a.title : `Claim: ${a.itemTitle}`;
          const when = a.at;
          return (
            <li key={a.id} className="mb-4 last:mb-0">
              <div className="absolute -left-[9px] mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-border bg-surface">
                <Icon className={cn("h-2.5 w-2.5", iconCls)} aria-hidden />
              </div>
              <div className="pl-2">
                <p className="text-xs text-muted-foreground">
                  {a.kind === "item" ? (
                    <span
                      className={cn(
                        "font-medium",
                        a.type === "LOST" ? "text-danger" : "text-found",
                      )}
                    >
                      {TYPE_LABEL[a.type]}
                    </span>
                  ) : (
                    <span className="font-medium text-warning">
                      Claim
                    </span>
                  )}
                  {""}·{""}
                  <time dateTime={when.toISOString()}>
                    {formatDistanceToNow(when, { addSuffix: true })}
                  </time>
                </p>
                <Link
                  href={href}
                  className="mt-0.5 line-clamp-2 text-sm font-medium text-foreground hover:text-primary hover:underline"
                >
                  {title}
                </Link>
                {a.kind === "item" ? (
                  <p className="text-xs text-muted-foreground">
                    Status: {a.status}
                  </p>
                ) : null}
                {a.kind === "claim" ? (
                  <p className="text-xs text-muted-foreground">
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
