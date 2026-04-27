"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { getDashboardTitle } from "@/lib/utils/dashboard-titles";
import { NotificationBell } from "./notification-bell";
import { UserMenu } from "./user-menu";

type TopbarProps = {
  onMenuOpen: () => void;
};

export function Topbar({ onMenuOpen }: TopbarProps) {
  const pathname = usePathname();
  const title = getDashboardTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-700 outline-none ring-offset-2 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-biu-gold lg:hidden dark:text-zinc-200 dark:hover:bg-zinc-800"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-biu-navy dark:text-zinc-100">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
