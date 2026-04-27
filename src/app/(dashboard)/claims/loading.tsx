import { Skeleton } from "@/components/ui/skeleton";

export default function MyClaimsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
