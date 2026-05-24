import { PackageOpen } from "lucide-react";

export function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/80 px-6 py-16 text-center/40"
      role="status"
    >
      <PackageOpen
        className="mb-3 h-12 w-12 text-subtle-foreground"
        strokeWidth={1.25}
        aria-hidden
      />
      <p className="text-sm font-medium text-muted-foreground">
        No items match your filters.
      </p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Try clearing filters or searching with different keywords.
      </p>
    </div>
  );
}
