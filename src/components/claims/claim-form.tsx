"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createClaim } from "@/lib/actions/claim.actions";
import { cn } from "@/lib/utils/cn";
import { STATUS_LABEL } from "@/lib/utils/constants";
import { ClaimProofUploadButton } from "@/components/claims/claim-proof-upload-button";
import { Sheet } from "@/components/ui/sheet";
import type { ItemType, ItemStatus } from "@/types";

const claimFormSchema = z.object({
  message: z
    .string()
    .min(30, "Describe how you can prove this — at least 30 characters")
    .max(8000),
});
type FormValues = z.infer<typeof claimFormSchema>;

function pickProofUrl(
  f: { url?: string; ufsUrl?: string } & Record<string, unknown>,
): string {
  if (typeof f.url === "string") return f.url;
  if (typeof f.ufsUrl === "string") return f.ufsUrl;
  if (typeof f.fileUrl === "string") return f.fileUrl;
  return "";
}

type ClaimFormShellProps = {
  item: {
    id: string;
    type: ItemType;
    status: ItemStatus;
  };
  children: (open: () => void) => ReactNode;
};

export function ItemClaimCTAWithSheet({ item, children }: ClaimFormShellProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {children(() => setOpen(true))}
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={item.type === "LOST" ? "I Found It" : "It's Mine"}
        side="right"
        contentClassName="w-[min(100vw,30rem)] max-w-full sm:max-w-md"
      >
        <div className="p-4">
          <ClaimFormContent
            itemId={item.id}
            onSuccess={() => {
              setOpen(false);
            }}
          />
        </div>
      </Sheet>
    </>
  );
}

type ClaimFormContentProps = {
  itemId: string;
  onSuccess: () => void;
};

export function ClaimFormContent({ itemId, onSuccess }: ClaimFormContentProps) {
  const router = useRouter();
  const [proofUrls, setProofUrls] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: { message: "" },
  });

  const messageLen = watch("message")?.length ?? 0;
  const remaining = Math.max(0, 30 - messageLen);

  const onSubmit = handleSubmit(async (data) => {
    clearErrors();
    const res = await createClaim({
      itemId,
      message: data.message.trim(),
      proofImageUrls: proofUrls,
    });
    if (res.success) {
      toast.success("Claim submitted. Staff will review it soon.");
      onSuccess();
      router.refresh();
      return;
    }
    toast.error(res.error);
    if (
      res.error.toLowerCase().includes("signed in") ||
      res.error.toLowerCase().includes("sign in")
    ) {
      return;
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Describe how you can prove this is yours (or that you found the item). Be
        specific — e.g. serial numbers, marks, or where you last saw it.
      </p>
      <div>
        <label
          htmlFor="claim-message"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Your explanation
        </label>
        <textarea
          id="claim-message"
          rows={5}
          className={cn(
            "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-biu-gold/40 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            errors.message && "border-red-500 focus:ring-red-500/30",
          )}
          {...register("message")}
        />
        <div className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>{errors.message?.message as string | undefined}</span>
          {remaining > 0 ? <span>At least {remaining} more characters</span> : null}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Proof photos (optional, up to 3)
        </p>
        {proofUrls.length < 3 ? (
          <ClaimProofUploadButton
            endpoint="claimProof"
            onClientUploadComplete={(res) => {
              const next = res
                .map((f) => pickProofUrl(f as { url?: string; ufsUrl?: string }))
                .filter(Boolean);
              if (next.length === 0) return;
              setProofUrls((prev) => [...prev, ...next].slice(0, 3));
            }}
            onUploadError={(e) => {
              toast.error(e.message);
            }}
          />
        ) : null}
        {proofUrls.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {proofUrls.map((url) => (
              <li
                key={url}
                className="group relative h-20 w-24 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700"
              >
                <Image src={url} alt="" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => setProofUrls((p) => p.filter((u) => u !== url))}
                  className="absolute right-0 top-0 rounded-bl bg-black/50 px-1.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-1 text-xs text-zinc-500">JPEG or PNG, max 4MB each</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-biu-gold px-4 py-2.5 text-sm font-semibold text-biu-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Submit claim
      </button>
    </form>
  );
}

/** Sticky block: status, CTA, and sheet. */
type ItemClaimPanelProps = {
  item: { id: string; type: ItemType; status: ItemStatus };
};

export function ItemClaimPanel({ item }: ItemClaimPanelProps) {
  const isOpen = item.status === "OPEN";
  return (
    <div className="space-y-4">
      <div
        className={cn(
          "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
          isOpen
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
            : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
        )}
      >
        {STATUS_LABEL[item.status]}
      </div>

      {isOpen ? (
        <ItemClaimCTAWithSheet item={item}>
          {(open) => (
            <button
              type="button"
              onClick={open}
              className="w-full rounded-lg bg-biu-gold py-2.5 text-center text-sm font-semibold text-biu-navy transition hover:opacity-90"
            >
              {item.type === "LOST" ? "I Found It" : "It's Mine"}
            </button>
          )}
        </ItemClaimCTAWithSheet>
      ) : (
        <p className="text-sm text-zinc-500">Claims are closed for this listing.</p>
      )}
    </div>
  );
}
