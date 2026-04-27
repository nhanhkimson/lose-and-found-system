"use client";

import type { UserRole } from "@prisma/client";
import { Sheet } from "@/components/ui/sheet";
import { DashboardNavList } from "./dashboard-nav-list";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRole;
};

export function MobileNav({ open, onOpenChange, role }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Navigation">
      <div className="p-3">
        <DashboardNavList
          role={role}
          onNavigate={() => onOpenChange(false)}
        />
      </div>
    </Sheet>
  );
}
