import type { ItemListRow } from "@/types";
import { ItemCard } from "./item-card";
import { EmptyState } from "./empty-state";

type ItemGridProps = {
  items: ItemListRow[];
};

export function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}
