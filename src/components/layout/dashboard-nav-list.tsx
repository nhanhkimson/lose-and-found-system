"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@prisma/client";
import {
  adminNavItems,
  isNavActive,
  mainNavItems,
  type NavItem,
} from "@/lib/navigation/dashboard-nav";
import { cn } from "@/lib/utils/cn";
import { useNotificationInbox } from "./notification-stream-context";

type NavListProps = {
  role: UserRole;
  onNavigate?: () => void;
  /** When true, show badge count on Notifications row (from inbox context) */
  showNotificationBadge?: boolean;
};

function NavButton({
  item,
  active,
  badge,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-primary/12 text-primary"
          : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          active
            ? "text-primary"
            : "text-subtle-foreground group-hover:text-foreground",
        )}
        strokeWidth={active ? 2.25 : 2}
        aria-hidden
      />
      <span className="flex-1">{item.label}</span>
      {item.href === "/notifications" && badge ? (
        <span className="min-w-6 rounded-full bg-danger px-1.5 py-0.5 text-center text-xs font-bold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

export function DashboardNavList({
  role,
  onNavigate,
  showNotificationBadge = true,
}: NavListProps) {
  const pathname = usePathname();
  const { unreadCount } = useNotificationInbox();
  const notificationBadge =
    showNotificationBadge && unreadCount > 0 ? unreadCount : undefined;

  const showAdmin = role === "ADMIN";

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {mainNavItems.map((item) => (
        <NavButton
          key={item.href}
          item={item}
          active={isNavActive(pathname, item.href)}
          onClick={onNavigate}
          badge={item.href === "/notifications" ? notificationBadge : undefined}
        />
      ))}
      {showAdmin ? (
        <div
          className={
            pathname.startsWith("/admin")
              ? "mt-4 rounded-lg border border-primary/20 bg-primary/5 p-1"
              : "mt-4"
          }
        >
          <p className="mb-1 px-3 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Admin
          </p>
          {adminNavItems.map((item) => (
            <NavButton
              key={item.href}
              item={item}
              active={isNavActive(pathname, item.href)}
              onClick={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </nav>
  );
}
