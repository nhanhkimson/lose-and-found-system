"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { getDashboardTitle } from "@/lib/utils/dashboard-titles";
import { NotificationBell } from "./notification-bell";
import { ThemeSwitcher } from "./theme-switcher";
import { UserMenu } from "./user-menu";

type TopbarProps = {
  onMenuOpen: () => void;
};

export function Topbar({ onMenuOpen }: TopbarProps) {
  const pathname = usePathname();
  const title = getDashboardTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-foreground outline-none ring-offset-2 transition hover:border-border hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-foreground">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeSwitcher />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
