import { getItems, type ItemBrowseParams } from "@/lib/actions/item.actions";
import { ItemGrid } from "./item-grid";
import { ItemPagination } from "./item-pagination";

type ItemsResultsProps = {
  searchParams:
    | ItemBrowseParams
    | Record<string, string | string[] | undefined>;
};

export async function ItemsResults({ searchParams }: ItemsResultsProps) {
  const result = await getItems(searchParams);
  if (!result.success) {
    return (
      <div
        className="rounded-lg border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger"
        role="alert"
      >
        {result.error}
      </div>
    );
  }

  const { items, page, totalPages } = result.data;

  return (
    <>
      <ItemGrid items={items} />
      <ItemPagination
        page={page}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </>
  );
}
