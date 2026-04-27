"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";
import type { AdminUserRow } from "@/lib/actions/admin.actions";
import type { UserRole } from "@prisma/client";

const ROLES: UserRole[] = ["STUDENT", "STAFF", "ADMIN"];

function RoleSelect({
  row,
  currentUserId,
  onChange,
}: {
  row: AdminUserRow;
  currentUserId: string;
  onChange: (userId: string, role: UserRole) => void;
}) {
  const disabled = row.id === currentUserId;
  return (
    <select
      className="max-w-full rounded border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
      value={row.role}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(row.id, e.target.value as UserRole)}
      aria-label={`Change role for ${row.name ?? row.email}`}
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {r.charAt(0) + r.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}

export function useAdminUserColumns(
  currentUserId: string,
  onChangeRole: (userId: string, role: UserRole) => void,
): ColumnDef<AdminUserRow>[] {
  return useMemo(
    () => [
      {
        id: "name",
        accessorFn: (r) => r.name ?? "—",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <RoleSelect
            row={row.original}
            currentUserId={currentUserId}
            onChange={onChangeRole}
          />
        ),
      },
      {
        accessorKey: "studentId",
        header: "Student ID",
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        accessorKey: "items",
        header: "Items",
      },
      {
        accessorKey: "claims",
        header: "Claims",
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
        sortingFn: (a, b, id) =>
          new Date(a.getValue(id) as string).getTime() -
          new Date(b.getValue(id) as string).getTime(),
      },
    ],
    [currentUserId, onChangeRole],
  );
}
