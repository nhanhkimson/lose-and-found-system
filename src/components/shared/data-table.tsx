"use client";

import {
  flexRender,
  filterFns,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export type DataTableFilterOption = {
  columnId: string;
  label: string;
  options: { label: string; value: string }[];
};

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  /** Single column key to search (string value), or use getSearchableText for multiple fields */
  searchKey?: keyof TData & string;
  getSearchableText?: (row: TData) => string;
  searchPlaceholder?: string;
  filterOptions?: DataTableFilterOption[];
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  emptyMessage?: string;
};

export function DataTable<TData>({
  columns,
  data,
  searchKey,
  getSearchableText,
  searchPlaceholder = "Search…",
  filterOptions,
  pageSize = 10,
  onRowClick,
  emptyMessage = "No results.",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const globalFilterFn = useMemo(() => {
    return (row: { original: TData }, _colId: string, filterValue: string) => {
      const q = filterValue.trim().toLowerCase();
      if (!q) return true;
      if (getSearchableText) {
        return getSearchableText(row.original).toLowerCase().includes(q);
      }
      if (searchKey) {
        const v = row.original[searchKey];
        return String(v ?? "")
          .toLowerCase()
          .includes(q);
      }
      return true;
    };
  }, [getSearchableText, searchKey]);

  const table = useReactTable({
    data,
    columns,
    filterFns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: searchKey || getSearchableText ? globalFilterFn : undefined,
    initialState: { pagination: { pageSize } },
  });

  const showSearch = Boolean(searchKey || getSearchableText);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        {showSearch ? (
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
            aria-label="Search table"
          />
        ) : null}
        {filterOptions?.map((fo) => (
          <label key={fo.columnId} className="flex flex-col gap-1 text-xs">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">{fo.label}</span>
            <select
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              value={(table.getColumn(fo.columnId)?.getFilterValue() as string) ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                table.getColumn(fo.columnId)?.setFilterValue(v || undefined);
              }}
            >
              <option value="">All</option>
              {fo.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr
                key={hg.id}
                className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-3 py-2.5 font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    {h.isPlaceholder ? null : h.column.getCanSort() ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-biu-gold"
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                      </button>
                    ) : (
                      flexRender(h.column.columnDef.header, h.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-zinc-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onRowClick(row.original);
                          }
                        }
                      : undefined
                  }
                  className={cn(
                    "border-b border-zinc-100 last:border-0 dark:border-zinc-800/80",
                    onRowClick ? "cursor-pointer hover:bg-biu-gold/5" : undefined,
                  )}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? "button" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-middle text-zinc-700 dark:text-zinc-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
          {table.getFilteredRowModel().rows.length} row(s)
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
          </button>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 text-xs dark:border-zinc-700"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
