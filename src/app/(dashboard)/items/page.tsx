import { Suspense } from "react";
import { ItemFilters } from "@/components/items/item-filters";
import { ItemSearch } from "@/components/items/item-search";
import { ItemsResults } from "@/components/items/items-results";
import { ItemGridSkeletons } from "@/components/items/item-grid-skeletons";
import type { ItemBrowseParams } from "@/lib/actions/item.actions";

type PageProps = {
  searchParams: Promise<
    ItemBrowseParams | Record<string, string | string[] | undefined>
  >;
};

export default async function ItemsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const suspenseKey = JSON.stringify(sp);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <ItemSearch />
      <ItemFilters />
      <Suspense key={suspenseKey} fallback={<ItemGridSkeletons count={12} />}>
        <ItemsResults searchParams={sp} />
      </Suspense>
    </div>
  );
}
