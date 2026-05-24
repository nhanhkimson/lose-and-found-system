"use client";

import Link from "next/link";
import type { UserRole } from "@prisma/client";
import { DashboardNavList } from "./dashboard-nav-list";

type SidebarProps = {
  role: UserRole;
};

export function Sidebar({ role }: SidebarProps) {
  return (
    <div className="flex h-full flex-col border-r border-border bg-surface/90 backdrop-blur-md">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 border-b border-border px-4 py-5"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-primary bg-primary/10 text-sm font-bold text-primary">
          BIU
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            Lost &amp; Found
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Build Bright University
          </p>
        </div>
      </Link>
      <div className="flex-1 overflow-y-auto p-3">
        <DashboardNavList role={role} />
      </div>
    </div>
  );
}
