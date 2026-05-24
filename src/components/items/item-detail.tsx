import { format } from "date-fns";
import { Eye } from "lucide-react";
import {
  CATEGORY_LABEL,
  STATUS_LABEL,
  TYPE_BADGE,
  TYPE_LABEL,
} from "@/lib/utils/constants";
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {item.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Listed {format(toDate(item.createdAt), "MMM d, yyyy")}
        </p>
      </div>

      {item.description ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {item.description}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-border-subtle last:border-0"
              >
                <th className="w-[34%] bg-surface-muted/80 px-3 py-2.5 font-medium text-muted-foreground/50">
                  {row.label}
                </th>
                <td className="px-3 py-2.5 text-foreground">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-1 border-t border-border-subtle pt-4">
        <p className="text-sm text-foreground">
          <span className="font-medium text-foreground">Reported by</span>
          {""}
          Student{" "}
          <span className="font-mono text-muted-foreground">
            #{reporterCode}
          </span>
        </p>
        <p className="inline-flex items-center gap-1.5 text-xs text-subtle-foreground">
          <Eye className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          {item.viewCount} {item.viewCount === 1 ? "view" : "views"}
        </p>
      </div>
    </div>
  );
}
