import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLayoutLoading() {
  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
