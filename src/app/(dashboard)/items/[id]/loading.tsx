import { Skeleton } from "@/components/ui/skeleton";

export default function ItemDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-1 sm:px-0">
      <Skeleton className="h-5 w-36" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start lg:gap-12">
        <div className="min-w-0 space-y-8">
          <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4 max-w-md" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="mt-4 h-10 w-full rounded-lg" />
          </div>
        </aside>
      </div>
      <div className="space-y-4 border-t border-border-subtle pt-10">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
