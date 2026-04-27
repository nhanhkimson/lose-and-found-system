import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  Layers,
  Package,
  PackageOpen,
  PackageSearch,
  Search,
  Shield,
  Users,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Report lost", href: "/items/lost", icon: PackageSearch },
  { label: "Report found", href: "/items/found", icon: PackageOpen },
  { label: "Browse Items", href: "/items", icon: Search },
  { label: "My Items", href: "/my-items", icon: Package },
  { label: "My Claims", href: "/claims", icon: FileCheck },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

export const adminNavItems: NavItem[] = [
  { label: "Admin Dashboard", href: "/admin/dashboard", icon: Shield },
  { label: "Manage Claims", href: "/admin/claims", icon: ClipboardList },
  { label: "Manage Items", href: "/admin/items", icon: Layers },
  { label: "Manage Users", href: "/admin/users", icon: Users },
];

export function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  // "Browse" is /items and /items/[id], not /items/lost or /items/found
  if (href === "/items") {
    if (pathname === "/items") return true;
    if (
      pathname.startsWith("/items/lost") ||
      pathname.startsWith("/items/found")
    ) {
      return false;
    }
    return pathname.startsWith("/items/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
