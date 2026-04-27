import { ItemGridSkeletons } from "@/components/items/item-grid-skeletons";

export default function ItemsLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <div className="h-5 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      </div>
      <div className="h-10 w-full max-w-2xl animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-48 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <ItemGridSkeletons count={12} />
    </div>
  );
}
