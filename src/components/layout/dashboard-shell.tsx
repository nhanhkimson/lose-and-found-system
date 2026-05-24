"use client";

import { useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { UserRole } from "@prisma/client";
import { MobileNav } from "./mobile-nav";
import { NotificationStreamProvider } from "./notification-stream-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role: UserRole = session?.user?.role ?? "STUDENT";

  return (
    <NotificationStreamProvider>
      <div className="min-h-screen bg-transparent">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block">
          {status === "loading" ? (
            <div className="h-full border-r border-border bg-surface/90 backdrop-blur-md" />
          ) : (
            <Sidebar role={role} />
          )}
        </aside>
        <div className="min-h-screen lg:pl-60">
          <Topbar onMenuOpen={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-[1200px] p-4 sm:p-6">
            {children}
          </main>
        </div>
        <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} role={role} />
      </div>
    </NotificationStreamProvider>
  );
}
