import { Skeleton } from "@/components/ui/skeleton";

/** Matches dashboard shell: top padding + main content area */
export default function DashboardSegmentLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-full max-w-md" />
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </div>
  );
}
