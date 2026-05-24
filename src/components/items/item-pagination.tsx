import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ItemPaginationProps = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
};

function toQueryString(
  sp: Record<string, string | string[] | undefined>,
  page: number,
) {
  const next = new URLSearchParams();
  for (const [k, raw] of Object.entries(sp)) {
    if (k === "page") continue;
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (v) {
      next.set(k, v);
    }
  }
  next.set("page", String(page));
  const qs = next.toString();
  return qs ? `/items?${qs}` : `/items?page=${page}`;
}

export function ItemPagination({
  page,
  totalPages,
  searchParams,
}: ItemPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  const prevHref = prev ? toQueryString(searchParams, prev) : null;
  const nextHref = next ? toQueryString(searchParams, next) : null;

  return (
    <nav
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span>
        {""}
        of <span className="font-medium text-foreground">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        {prevHref ? (
          <Link
            href={prevHref}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted",
              "dark:border-border",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-subtle-foreground">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </span>
        )}
        {nextHref ? (
          <Link
            href={nextHref}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted",
              "dark:border-border",
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-subtle-foreground">
            Next
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
