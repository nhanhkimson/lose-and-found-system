import { format } from "date-fns";
import { Eye } from "lucide-react";
import { CATEGORY_LABEL, STATUS_LABEL, TYPE_BADGE, TYPE_LABEL } from "@/lib/utils/constants";
import { getReporterAnonCode } from "@/lib/utils/reporter-id";
import { cn } from "@/lib/utils/cn";
import type { ItemDetailPublic } from "@/types";

type ItemDetailProps = {
  item: ItemDetailPublic;
};

function toDate(value: ItemDetailPublic["eventDate"]): Date {
  return value instanceof Date ? value : new Date(value);
}

export function ItemDetail({ item }: ItemDetailProps) {
  const eventDate = toDate(item.eventDate);
  const reporterCode = getReporterAnonCode(item.id);
  const typeBadge = TYPE_BADGE[item.type];
  const typeLabel = TYPE_LABEL[item.type];

  const rows: { label: string; value: string }[] = [
    { label: "Category", value: CATEGORY_LABEL[item.category] },
    { label: "Building", value: item.building },
    {
      label: "Date",
      value: format(eventDate, "MMMM d, yyyy"),
    },
    {
      label: "Color",
      value: item.color?.trim() || "—",
    },
    {
      label: "Brand",
      value: item.brand?.trim() || "—",
    },
    { label: "Status", value: STATUS_LABEL[item.status] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
              typeBadge.className,
            )}
          >
            {typeLabel}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-biu-navy dark:text-zinc-100">
          {item.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Listed {format(toDate(item.createdAt), "MMM d, yyyy")}
        </p>
      </div>

      {item.description ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {item.description}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
              >
                <th className="w-[34%] bg-zinc-50/80 px-3 py-2.5 font-medium text-zinc-500 dark:bg-zinc-900/50 dark:text-zinc-400">
                  {row.label}
                </th>
                <td className="px-3 py-2.5 text-zinc-900 dark:text-zinc-100">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-1 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          <span className="font-medium text-biu-navy dark:text-zinc-200">
            Reported by
          </span>{" "}
          Student <span className="font-mono text-zinc-600 dark:text-zinc-400">#{reporterCode}</span>
        </p>
        <p className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          <Eye className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          {item.viewCount} {item.viewCount === 1 ? "view" : "views"}
        </p>
      </div>
    </div>
  );
}
