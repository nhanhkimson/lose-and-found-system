import { ItemGridSkeletons } from "@/components/items/item-grid-skeletons";

export default function ItemsLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <div className="h-5 w-40 animate-pulse rounded bg-surface-muted" />
        <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-surface-muted" />
      </div>
      <div className="h-10 w-full max-w-2xl animate-pulse rounded-lg bg-surface-muted" />
      <div className="h-48 w-full animate-pulse rounded-xl bg-surface-muted" />
      <ItemGridSkeletons count={12} />
    </div>
  );
}
