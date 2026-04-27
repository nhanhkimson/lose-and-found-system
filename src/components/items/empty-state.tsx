import { PackageOpen } from "lucide-react";

export function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/40"
      role="status"
    >
      <PackageOpen
        className="mb-3 h-12 w-12 text-zinc-400 dark:text-zinc-500"
        strokeWidth={1.25}
        aria-hidden
      />
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        No items match your filters.
      </p>
      <p className="mt-1 max-w-sm text-xs text-zinc-500">
        Try clearing filters or searching with different keywords.
      </p>
    </div>
  );
}
