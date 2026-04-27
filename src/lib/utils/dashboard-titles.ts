const exactTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/items": "Browse Items",
  "/my-items": "My Items",
  "/claims": "My Claims",
  "/notifications": "Notifications",
  "/admin/dashboard": "Admin Dashboard",
  "/admin/claims": "Manage Claims",
  "/admin/items": "Manage Items",
  "/admin/users": "Manage Users",
  "/profile": "Profile",
  "/settings": "Settings",
};

const prefixFallback: { prefix: string; title: string }[] = [
  { prefix: "/admin", title: "Admin" },
  { prefix: "/items", title: "Browse Items" },
];

export function getDashboardTitle(pathname: string): string {
  if (exactTitles[pathname]) return exactTitles[pathname];
  for (const { prefix, title } of prefixFallback) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return title;
  }
  return "BIU Lost & Found";
}
