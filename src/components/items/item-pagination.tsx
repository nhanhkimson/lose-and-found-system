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
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-6 sm:flex-row dark:border-zinc-800"
      aria-label="Pagination"
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Page <span className="font-medium text-zinc-900 dark:text-zinc-100">{page}</span>{" "}
        of <span className="font-medium text-zinc-900 dark:text-zinc-100">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        {prevHref ? (
          <Link
            href={prevHref}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50",
              "dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-800">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </span>
        )}
        {nextHref ? (
          <Link
            href={nextHref}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50",
              "dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800",
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-800">
            Next
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
