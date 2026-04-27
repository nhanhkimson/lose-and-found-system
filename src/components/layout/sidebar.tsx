"use client";

import Link from "next/link";
import type { UserRole } from "@prisma/client";
import { DashboardNavList } from "./dashboard-nav-list";

type SidebarProps = {
  role: UserRole;
};

export function Sidebar({ role }: SidebarProps) {
  return (
    <div className="flex h-full flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 border-b border-zinc-200 px-4 py-5 dark:border-zinc-800"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-biu-gold text-sm font-bold text-biu-gold">
          BIU
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-biu-navy dark:text-zinc-100">
            Lost &amp; Found
          </p>
          <p className="truncate text-xs text-zinc-500">Build Bright University</p>
        </div>
      </Link>
      <div className="flex-1 overflow-y-auto p-3">
        <DashboardNavList role={role} />
      </div>
    </div>
  );
}
