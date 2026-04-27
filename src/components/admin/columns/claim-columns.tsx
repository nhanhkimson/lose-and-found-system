"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminClaimRow } from "@/lib/actions/admin.actions";

export type ClaimRow = AdminClaimRow & { createdAt: Date | string };

export function createClaimColumns(handlers: {
  onView: (row: ClaimRow) => void;
  onApprove: (row: ClaimRow) => void;
  onReject: (row: ClaimRow) => void;
}): ColumnDef<ClaimRow>[] {
  return [
    {
      accessorKey: "id",
      header: "Claim ID",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <span
            className="font-mono text-xs text-zinc-600 dark:text-zinc-400"
            title={id}
          >
            {id.length > 14 ? `${id.slice(0, 12)}…` : id}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "itemTitle",
      header: "Item",
      cell: ({ row }) => (
        <Link
          href={`/items/${row.original.itemId}`}
          className="text-biu-navy underline decoration-biu-gold/40 hover:text-biu-gold dark:text-zinc-100"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.itemTitle}
        </Link>
      ),
    },
    {
      id: "claimant",
      accessorFn: (r) => r.claimantName ?? r.claimantEmail ?? "—",
      header: "Claimant",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const d = row.original.createdAt;
        const date = typeof d === "string" ? new Date(d) : d;
        return format(date, "MMM d, yyyy HH:mm");
      },
      sortingFn: (a, b, id) => {
        const da = new Date(a.getValue(id) as string | Date).getTime();
        const db = new Date(b.getValue(id) as string | Date).getTime();
        return da - db;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const cls =
          s === "PENDING"
            ? "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
            : s === "APPROVED"
              ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-200"
              : "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
        return (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
            {s}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const r = row.original;
        const pending = r.status === "PENDING";
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
                <DropdownMenuItem onClick={() => handlers.onView(r)}>
                  View
                </DropdownMenuItem>
                {pending ? (
                  <>
                    <DropdownMenuItem
                      className="text-green-700 dark:text-green-400"
                      onClick={() => handlers.onApprove(r)}
                    >
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-700 dark:text-red-400"
                      onClick={() => handlers.onReject(r)}
                    >
                      Reject
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
