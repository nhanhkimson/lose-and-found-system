import type { ItemListRow } from "@/types";
import { ItemCard } from "@/components/items/item-card";

type ItemListProps = {
  items: ItemListRow[];
};

export function ItemList({ items }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div
        className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/40"
        role="status"
      >
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          No items yet. Check back after the database is seeded or post the
          first listing.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}
