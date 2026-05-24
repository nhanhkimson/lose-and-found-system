import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CATEGORY_LABEL } from "@/lib/utils/constants";
import { confidenceBadgeClass } from "@/lib/utils/match-score";
import { cn } from "@/lib/utils/cn";
import type { MatchSuggestionRow } from "@/lib/actions/dashboard.actions";

type MatchSuggestionsProps = {
  items: MatchSuggestionRow[];
};

export function MatchSuggestions({ items }: MatchSuggestionsProps) {
  if (items.length === 0) {
    return (
      <section
        className="rounded-xl border border-dashed border-border bg-surface-muted/50 p-6 text-sm text-muted-foreground"
        aria-label="Match suggestions"
      >
        <p className="font-medium text-foreground">No match suggestions yet</p>
        <p className="mt-1">
          When you post a lost or found item, we will look for open listings in
          the same category to show here.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label="Match suggestions">
      <div
        className={cn(
          "flex flex-col gap-2 rounded-xl border border-found/30 bg-gradient-to-r from-found-muted to-surface p-4",
        )}
      >
        <div className="flex items-center gap-2 text-found-foreground">
          <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
          <p className="text-sm font-semibold">
            We found {items.length} potential{""}
            {items.length === 1 ? "match" : "matches"} for your items
          </p>
        </div>
        <p className="text-xs text-found-foreground">
          Based on category, building, and title similarity. Open a listing to
          compare details.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((m) => (
          <li key={m.id}>
            <Link
              href={`/items/${m.otherItemId}`}
              className={cn(
                "flex h-full flex-col gap-2 rounded-xl border border-border bg-surface p-4 shadow-card transition",
                "hover:border-primary/50 hover:shadow",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm font-semibold text-foreground">
                  {m.otherTitle}
                </p>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                    confidenceBadgeClass(m.confidence),
                  )}
                >
                  {m.confidence}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {CATEGORY_LABEL[m.category]} · {m.building}
              </p>
              <p className="text-xs text-muted-foreground">
                Your {m.mySide === "LOST" ? "lost" : "found"}:{""}
                <span className="line-clamp-1 text-foreground">
                  {m.myItemTitle}
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
