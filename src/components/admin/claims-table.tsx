"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { ClaimDetailPanel } from "@/components/claims/claim-detail-panel";
import { DataTable } from "@/components/shared/data-table";
import { reviewClaim } from "@/lib/actions/admin.actions";
import type { ClaimStatus } from "@prisma/client";
import { createClaimColumns, type ClaimRow } from "./columns/claim-columns";

type ClaimsTableProps = {
  initialRows: ClaimRow[];
};

export function ClaimsTable({ initialRows }: ClaimsTableProps) {
  const router = useRouter();
  const [tab, setTab] = useState<ClaimStatus | "ALL">("ALL");
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (tab === "ALL") return initialRows;
    return initialRows.filter((r) => r.status === tab);
  }, [initialRows, tab]);

  const openPanel = useCallback((id: string) => {
    setSelectedId(id);
    setPanelOpen(true);
  }, []);

  const quickReview = useCallback(
    async (row: ClaimRow, decision: "APPROVE" | "REJECT") => {
      if (row.status !== "PENDING") return;
      const ok = window.confirm(
        decision === "APPROVE"
          ? "Approve this claim? The item will be marked resolved and other pending claims on this item will be rejected."
          : "Reject this claim?",
      );
      if (!ok) return;
      const res = await reviewClaim({
        claimId: row.id,
        decision,
      });
      if (res.success) {
        toast.success(decision === "APPROVE" ? "Claim approved" : "Claim rejected");
        router.refresh();
      } else {
        toast.error(res.error ?? "Something went wrong");
      }
    },
    [router],
  );

  const columns = useMemo(
    () =>
      createClaimColumns({
        onView: (r) => openPanel(r.id),
        onApprove: (r) => quickReview(r, "APPROVE"),
        onReject: (r) => quickReview(r, "REJECT"),
      }),
    [openPanel, quickReview],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {(
          [
            ["ALL", "All"],
            ["PENDING", "Pending"],
            ["APPROVED", "Approved"],
            ["REJECTED", "Rejected"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            className={
              tab === value
                ? "rounded-lg bg-biu-gold px-3 py-1.5 text-sm font-semibold text-biu-navy"
                : "rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <DataTable<ClaimRow>
        columns={columns}
        data={filtered}
        getSearchableText={(r) =>
          [r.id, r.itemTitle, r.claimantName, r.claimantEmail, r.status]
            .filter(Boolean)
            .join(" ")
        }
        searchPlaceholder="Search claims, items, claimants…"
        pageSize={12}
        onRowClick={(row) => openPanel(row.id)}
      />

      <ClaimDetailPanel
        claimId={selectedId}
        open={panelOpen}
        onOpenChange={(o) => {
          setPanelOpen(o);
          if (!o) setSelectedId(null);
        }}
      />
    </div>
  );
}
