"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminItemRow } from "@/lib/actions/admin.actions";
import { CATEGORY_LABEL, STATUS_LABEL, TYPE_BADGE, TYPE_LABEL } from "@/lib/utils/constants";
import type { ItemStatus } from "@prisma/client";
import { cn } from "@/lib/utils/cn";

export function createAdminItemColumns(handlers: {
  onDelete: (row: AdminItemRow) => void;
  onSetStatus: (row: AdminItemRow, status: ItemStatus) => void;
}): ColumnDef<AdminItemRow>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link
          href={`/items/${row.original.id}`}
          className="font-medium text-biu-navy hover:text-biu-gold dark:text-zinc-100"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const t = row.original.type;
        return (
          <span
            className={cn(
              "inline-flex rounded px-2 py-0.5 text-xs font-medium",
              TYPE_BADGE[t].className,
            )}
          >
            {TYPE_LABEL[t]}
          </span>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => CATEGORY_LABEL[row.original.category],
    },
    {
      accessorKey: "building",
      header: "Building",
    },
    {
      accessorKey: "status",
      header: "Status",
      id: "status",
      filterFn: "equalsString",
      cell: ({ row }) => (
        <span className="text-sm">{STATUS_LABEL[row.original.status]}</span>
      ),
    },
    {
      id: "eventDate",
      accessorKey: "eventDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.eventDate), "MMM d, yyyy"),
      sortingFn: (a, b, id) => {
        return (
          new Date(a.getValue(id) as string).getTime() -
          new Date(b.getValue(id) as string).getTime()
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="text-right" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/items/${r.id}`}>View</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handlers.onSetStatus(r, "OPEN")}
                  disabled={r.status === "OPEN"}
                >
                  Set Open
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlers.onSetStatus(r, "RESOLVED")}
                  disabled={r.status === "RESOLVED"}
                >
                  Set Resolved
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlers.onSetStatus(r, "CLOSED")}
                  disabled={r.status === "CLOSED"}
                >
                  Set Closed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 dark:text-red-400"
                  onClick={() => handlers.onDelete(r)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
