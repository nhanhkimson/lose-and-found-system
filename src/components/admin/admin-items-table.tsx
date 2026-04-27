"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { createAdminItemColumns } from "@/components/admin/columns/admin-item-columns";
import { DataTable } from "@/components/shared/data-table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminDeleteItem, adminSetItemStatus } from "@/lib/actions/admin.actions";
import type { AdminItemRow } from "@/lib/actions/admin.actions";
import type { ItemStatus } from "@prisma/client";
import { STATUS_LABEL } from "@/lib/utils/constants";

type Props = { items: AdminItemRow[] };

export function AdminItemsTable({ items }: Props) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<AdminItemRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const onRequestDelete = useCallback((row: AdminItemRow) => {
    setDeleteTarget(row);
  }, []);

  const onConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await adminDeleteItem(deleteTarget.id);
      if (res.success) {
        toast.success("Item removed");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error ?? "Delete failed");
      }
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, router]);

  const onSetStatus = useCallback(
    async (row: AdminItemRow, status: ItemStatus) => {
      const res = await adminSetItemStatus(row.id, status);
      if (res.success) {
        toast.success(`Status set to ${STATUS_LABEL[status]}`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Update failed");
      }
    },
    [router],
  );

  const columns = useMemo(
    () => createAdminItemColumns({ onDelete: onRequestDelete, onSetStatus }),
    [onRequestDelete, onSetStatus],
  );

  return (
    <>
      <DataTable<AdminItemRow>
        columns={columns}
        data={items}
        searchKey="title"
        searchPlaceholder="Search by title…"
        filterOptions={[
          {
            columnId: "status",
            label: "Status",
            options: [
              { value: "OPEN", label: STATUS_LABEL.OPEN },
              { value: "RESOLVED", label: STATUS_LABEL.RESOLVED },
              { value: "CLOSED", label: STATUS_LABEL.CLOSED },
            ],
          },
        ]}
        pageSize={12}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will permanently remove “${deleteTarget.title}”. This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={deleting}>
              Cancel
            </AlertDialogCancel>
            <button
              type="button"
              disabled={deleting}
              onClick={() => void onConfirmDelete()}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "…" : "Delete"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
