"use client";

import { format, parseISO } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { ItemCategory, ItemStatus, ItemType } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CAMPUS_BUILDINGS,
  CATEGORIES,
  STATUS_FILTER_OPTIONS,
  TYPE_LABEL,
} from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { withItemsParams } from "@/lib/utils/item-url";

const TABS: { key: "all" | ItemType; label: string; param: string | null }[] = [
  { key: "all", label: "All", param: null },
  { key: "LOST", label: TYPE_LABEL.LOST, param: "LOST" },
  { key: "FOUND", label: TYPE_LABEL.FOUND, param: "FOUND" },
];

function useUpdateQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (updates: Record<string, string | null | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === undefined || v === "") {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    }
    next.set("page", "1");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };
}

export function ItemFilters() {
  const searchParams = useSearchParams();
  const update = useUpdateQuery();

  const typeParam = searchParams.get("type")?.toUpperCase() as ItemType | undefined;
  const activeTab =
    typeParam === "LOST" || typeParam === "FOUND" ? typeParam : "all";

  const category = (searchParams.get("category") ?? "") as ItemCategory | "";
  const building = searchParams.get("building") ?? "";
  const status = (searchParams.get("status") ?? "") as ItemStatus | "";
  const dateFromStr = searchParams.get("dateFrom");
  const dateToStr = searchParams.get("dateTo");

  const dateFrom = dateFromStr ? parseISO(dateFromStr) : undefined;
  const dateTo = dateToStr ? parseISO(dateToStr) : undefined;

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Item type">
        {TABS.map((tab) => {
          const selected =
            tab.key === "all"
              ? activeTab === "all"
              : activeTab === tab.key;
          const href =
            tab.param === null
              ? withItemsParams(searchParams, { type: null, page: "1" })
              : withItemsParams(searchParams, { type: tab.param, page: "1" });
          return (
            <Link
              key={tab.key}
              href={href}
              role="tab"
              aria-selected={selected}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                selected
                  ? "bg-biu-gold/15 text-biu-gold ring-2 ring-biu-gold/40"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Category
          <select
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={category}
            onChange={(e) =>
              update({
                category: e.target.value || null,
              })
            }
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Building
          <select
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={building}
            onChange={(e) =>
              update({
                building: e.target.value || null,
              })
            }
          >
            <option value="">All buildings</option>
            {CAMPUS_BUILDINGS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Status
          <select
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={status}
            onChange={(e) =>
              update({
                status: e.target.value || null,
              })
            }
          >
            <option value="">All statuses</option>
            {STATUS_FILTER_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Date range
          </span>
          <div className="flex flex-wrap gap-2">
            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex min-w-[8.5rem] items-center justify-start gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-left text-sm dark:border-zinc-700 dark:bg-zinc-900",
                    !dateFrom && "text-zinc-500",
                  )}
                >
                  <CalendarIcon className="h-4 w-4 shrink-0 text-biu-gold" />
                  {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(d) => {
                    update({
                      dateFrom: d ? format(d, "yyyy-MM-dd") : null,
                    });
                    setFromOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex min-w-[8.5rem] items-center justify-start gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-left text-sm dark:border-zinc-700 dark:bg-zinc-900",
                    !dateTo && "text-zinc-500",
                  )}
                >
                  <CalendarIcon className="h-4 w-4 shrink-0 text-biu-gold" />
                  {dateTo ? format(dateTo, "MMM d, yyyy") : "To"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(d) => {
                    update({
                      dateTo: d ? format(d, "yyyy-MM-dd") : null,
                    });
                    setToOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Link>
      </div>
    </div>
  );
}
