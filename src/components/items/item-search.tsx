"use client";

import { Loader2, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils/cn";

export function ItemSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlQ = searchParams.get("q") ?? "";

  const [value, setValue] = useState(urlQ);
  const debounced = useDebounce(value, 300);
  const isDebouncing = value !== debounced;

  useEffect(() => {
    setValue(urlQ);
  }, [urlQ]);

  useEffect(() => {
    if (debounced === urlQ) {
      return;
    }
    const next = new URLSearchParams(searchParams.toString());
    if (debounced) {
      next.set("q", debounced);
    } else {
      next.delete("q");
    }
    next.set("page", "1");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [debounced, urlQ, pathname, router, searchParams]);

  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        aria-hidden
      />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search title or description…"
        className={cn(
          "w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none ring-biu-gold/30 focus:border-biu-gold focus:ring-2",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
        )}
        autoComplete="off"
        aria-busy={isDebouncing}
      />
      {isDebouncing ? (
        <Loader2
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-biu-gold"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
