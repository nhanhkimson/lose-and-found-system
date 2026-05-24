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
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle-foreground"
        aria-hidden
      />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search title or description…"
        className={cn(
          "w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-foreground outline-none ring-primary/30 focus:border-primary focus:ring-2",
          "dark:border-border",
        )}
        autoComplete="off"
        aria-busy={isDebouncing}
      />
      {isDebouncing ? (
        <Loader2
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
