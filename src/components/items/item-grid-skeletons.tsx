import { ItemCardSkeleton } from "./item-card-skeleton";

type ItemGridSkeletonsProps = {
  count: number;
};

export function ItemGridSkeletons({ count }: ItemGridSkeletonsProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <ItemCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
