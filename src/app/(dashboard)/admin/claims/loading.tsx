import { Skeleton } from "@/components/ui/skeleton";

export default function AdminClaimsLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl" />
      </div>
      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Approved", "Rejected"].map((t) => (
          <Skeleton key={t} className="h-9 w-24" />
        ))}
      </div>
      <Skeleton className="h-10 w-full max-w-sm" />
      <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
