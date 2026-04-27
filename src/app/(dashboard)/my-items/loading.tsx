import { ItemGridSkeletons } from "@/components/items/item-grid-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyItemsLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <Skeleton className="h-8 w-36" />
        <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      </div>
      <ItemGridSkeletons count={6} />
    </div>
  );
}
