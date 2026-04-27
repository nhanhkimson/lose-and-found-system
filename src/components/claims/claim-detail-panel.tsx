"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { getAdminClaimForReview, reviewClaim } from "@/lib/actions/admin.actions";
import type { ClaimDetailPayload } from "@/lib/actions/admin.actions";
import { Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_LABEL, STATUS_LABEL, TYPE_LABEL } from "@/lib/utils/constants";

type ClaimDetailPanelProps = {
  claimId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ClaimDetailPanel({
  claimId,
  open,
  onOpenChange,
}: ClaimDetailPanelProps) {
  const router = useRouter();
  const [data, setData] = useState<ClaimDetailPayload | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || !claimId) {
      setData(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const row = await getAdminClaimForReview(claimId);
      if (!cancelled) {
        setData(row);
        setAdminNote(row?.claim.adminNote ?? "");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, claimId]);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const submit = useCallback(
    (decision: "APPROVE" | "REJECT") => {
      if (!claimId) return;
      startTransition(async () => {
        const res = await reviewClaim({
          claimId,
          decision,
          adminNote: adminNote.trim() || undefined,
        });
        if (res.success) {
          toast.success(decision === "APPROVE" ? "Claim approved" : "Claim rejected");
          close();
          router.refresh();
        } else {
          toast.error(res.error ?? "Could not update claim");
        }
      });
    },
    [claimId, adminNote, close, router],
  );

  const item = data?.item;
  const claim = data?.claim;
  const user = data?.user;
  const itemUrls = data?.itemGalleryUrls ?? [];
  const proofUrls = claim?.proofImageUrls ?? [];

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Review claim"
      side="right"
      contentClassName="w-[min(100vw,40rem)] max-w-full sm:max-w-2xl"
    >
      {!data ? (
        <div className="p-4 text-sm text-zinc-500">Loading…</div>
      ) : (
        <div className="space-y-6 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-zinc-500">
                Item photos
              </p>
              <div className="grid grid-cols-2 gap-2">
                {itemUrls.length === 0 ? (
                  <p className="text-sm text-zinc-500">No images</p>
                ) : (
                  itemUrls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </a>
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-zinc-500">
                Proof photos
              </p>
              <div className="grid grid-cols-2 gap-2">
                {proofUrls.length === 0 ? (
                  <p className="text-sm text-zinc-500">No proof images</p>
                ) : (
                  proofUrls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>

          <section className="space-y-1 text-sm">
            <h3 className="font-semibold text-biu-navy dark:text-zinc-100">
              {item?.title}
            </h3>
            <dl className="grid gap-1 text-zinc-700 dark:text-zinc-300">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-zinc-500">Type</dt>
                <dd>{item ? TYPE_LABEL[item.type] : "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-zinc-500">Category</dt>
                <dd>{item ? CATEGORY_LABEL[item.category] : "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-zinc-500">Building</dt>
                <dd>{item?.building}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-zinc-500">Status</dt>
                <dd>{item ? STATUS_LABEL[item.status] : "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-zinc-500">Description</dt>
                <dd className="whitespace-pre-wrap">{item?.description}</dd>
              </div>
            </dl>
          </section>

          <section>
            <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">
              Claimant
            </p>
            <p className="text-sm">
              {user?.name ?? "—"}{" "}
              <span className="text-zinc-500">({user?.email ?? "—"})</span>
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Submitted {format(new Date(claim!.createdAt), "PPpp")}
            </p>
          </section>

          <section>
            <p className="mb-1 text-xs font-semibold uppercase text-zinc-500">
              Claim message
            </p>
            <p className="whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200">
              {claim?.message}
            </p>
          </section>

          <section>
            <label className="mb-1 block text-xs font-semibold uppercase text-zinc-500">
              Admin note
            </label>
            <Textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder="Optional note (visible in audit context)"
              disabled={claim?.status !== "PENDING"}
            />
          </section>

          {claim?.status === "PENDING" ? (
            <div className="flex flex-wrap gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                disabled={pending}
                onClick={() => submit("APPROVE")}
              >
                Approve
              </button>
              <button
                type="button"
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200 disabled:opacity-50"
                disabled={pending}
                onClick={() => submit("REJECT")}
              >
                Reject
              </button>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              This claim is {claim?.status.toLowerCase()}.
              {claim?.adminNote ? (
                <>
                  <br />
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Note: {claim.adminNote}
                  </span>
                </>
              ) : null}
            </p>
          )}
        </div>
      )}
    </Sheet>
  );
}
