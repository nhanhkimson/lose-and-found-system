import type { ItemListRow } from "@/types";
import { ItemCard } from "@/components/items/item-card";

type ItemListProps = {
  items: ItemListRow[];
};

export function ItemList({ items }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div
        className="rounded-xl border border-dashed border-border bg-surface-muted/80 px-6 py-16 text-center/40"
        role="status"
      >
        <p className="text-sm font-medium text-muted-foreground">
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
