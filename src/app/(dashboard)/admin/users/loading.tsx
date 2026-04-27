import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-full max-w-2xl" />
      </div>
      <Skeleton className="h-10 w-full max-w-sm" />
      <div className="space-y-2 rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
