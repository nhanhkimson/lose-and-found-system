"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAdminUserColumns } from "@/components/admin/columns/admin-user-columns";
import { DataTable } from "@/components/shared/data-table";
import { adminUpdateUserRole } from "@/lib/actions/admin.actions";
import type { AdminUserRow } from "@/lib/actions/admin.actions";
import type { UserRole } from "@prisma/client";

type Props = {
  users: AdminUserRow[];
  currentUserId: string;
};

export function AdminUsersTable({ users, currentUserId }: Props) {
  const router = useRouter();

  const onChangeRole = useCallback(
    async (userId: string, role: UserRole) => {
      const res = await adminUpdateUserRole(userId, role);
      if (res.success) {
        toast.success("Role updated");
        router.refresh();
      } else {
        toast.error(res.error ?? "Could not update role");
      }
    },
    [router],
  );

  const columns = useAdminUserColumns(currentUserId, onChangeRole);

  return (
    <DataTable<AdminUserRow>
      columns={columns}
      data={users}
      getSearchableText={(u) => [u.name, u.email, u.studentId, u.role].filter(Boolean).join(" ")}
      searchPlaceholder="Search name, email, ID…"
      pageSize={12}
    />
  );
}
