import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  CATEGORY_LABEL,
  TYPE_BADGE,
  TYPE_LABEL,
} from "@/lib/utils/constants";
import type { ItemListRow } from "@/types";

type ItemCardProps = {
  item: ItemListRow;
};

function toDate(value: ItemListRow["eventDate"]): Date {
  return value instanceof Date ? value : new Date(value);
}

export function ItemCard({ item }: ItemCardProps) {
  const categoryLabel = CATEGORY_LABEL[item.category];
  const typeLabel = TYPE_LABEL[item.type];
  const badge = TYPE_BADGE[item.type];
  const eventDate = toDate(item.eventDate);

  return (
    <Link
      href={`/items/${item.id}`}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm",
        "transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-biu-gold/50",
      )}
    >
    <article className="flex flex-col">
      <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-900">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-biu-gold/40">
            <MapPin className="h-14 w-14" strokeWidth={1.25} aria-hidden />
          </div>
        )}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            badge.className,
          )}
        >
          {typeLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-biu-navy dark:text-zinc-100">
          {item.title}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {categoryLabel}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-zinc-100 pt-3 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-biu-gold" aria-hidden />
            <span className="line-clamp-1">{item.building}</span>
            {item.roomHint ? (
              <span className="text-zinc-500">· {item.roomHint}</span>
            ) : null}
          </span>
          <span className="text-zinc-400">·</span>
          <time dateTime={eventDate.toISOString()}>
            {format(eventDate, "MMM d, yyyy")}
          </time>
        </div>
      </div>
    </article>
    </Link>
  );
}
