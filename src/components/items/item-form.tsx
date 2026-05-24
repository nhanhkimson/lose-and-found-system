"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Link2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createItem } from "@/lib/actions/item.actions";
import { CAMPUS_BUILDINGS } from "@/lib/utils/constants";
import {
  itemReportFormSchema,
  type ItemReportFormValues,
} from "@/lib/validations/item-report.schema";
import { StepDetails } from "@/components/items/form-steps/step-details";
import { StepLocation } from "@/components/items/form-steps/step-location";
import { StepPhotos } from "@/components/items/form-steps/step-photos";
import { StepReview } from "@/components/items/form-steps/step-review";
import { cn } from "@/lib/utils/cn";
import type { ItemType } from "@/types";

const TOTAL_STEPS = 4;

function getDefaultValues(type: ItemType): ItemReportFormValues {
  return {
    type,
    title: "",
    description: "",
    category: "OTHER",
    color: "",
    brand: "",
    building: CAMPUS_BUILDINGS[0],
    roomHint: "",
    eventDate: new Date(),
    timeApprox: "",
    foundDisposition: type === "FOUND" ? "" : undefined,
    imageUrls: [],
    reward: "",
    notifyOnMatch: true,
    allowContact: true,
  };
}

function fieldNamesForStep(
  step: number,
  type: ItemType,
): (keyof ItemReportFormValues)[] {
  if (step === 0) {
    return ["title", "description", "category", "color", "brand"];
  }
  if (step === 1) {
    if (type === "LOST") {
      return ["building", "roomHint", "eventDate", "timeApprox"];
    }
    return ["building", "roomHint", "eventDate", "foundDisposition"];
  }
  if (step === 2) {
    const base: (keyof ItemReportFormValues)[] = [
      "imageUrls",
      "notifyOnMatch",
      "allowContact",
    ];
    if (type === "LOST") base.push("reward");
    return base;
  }
  return [];
}

type ItemFormProps = {
  type: ItemType;
};

export function ItemForm({ type }: ItemFormProps) {
  const [step, setStep] = useState(0);
  const [successId, setSuccessId] = useState<string | null>(null);
  const methods = useForm<ItemReportFormValues>({
    resolver: zodResolver(itemReportFormSchema),
    defaultValues: getDefaultValues(type),
    shouldUnregister: false,
    mode: "onChange",
  });

  const { handleSubmit, trigger, reset } = methods;

  const goNext = useCallback(async () => {
    const fields = fieldNamesForStep(step, type);
    const ok = await trigger(fields, { shouldFocus: true });
    if (!ok) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, [step, trigger, type]);

  const goPrev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const onFinal = useCallback(async (data: ItemReportFormValues) => {
    const res = await createItem(data);
    if (res.success) {
      setSuccessId(res.data.id);
      toast.success("Your listing is live.");
      return;
    }
    toast.error(res.error);
  }, []);

  const onSubmitItem = useCallback(() => {
    void handleSubmit(onFinal)();
  }, [handleSubmit, onFinal]);

  const resetForm = useCallback(() => {
    reset(getDefaultValues(type));
    setStep(0);
    setSuccessId(null);
  }, [reset, type]);

  const stepTitle = useMemo(
    () => ["Details", "Location", "Photos & options", "Review"] as const,
    [],
  );

  if (successId) {
    return (
      <ItemReportSuccessView itemId={successId} onCreateAnother={resetForm} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Step {step + 1} of {TOTAL_STEPS} — {stepTitle[step]}
        </p>
        <div
          className="flex flex-1 justify-end gap-1 sm:max-w-[12rem]"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step + 1}
          aria-label="Form progress"
        >
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i <= step ? "bg-primary" : "bg-surface-muted",
              )}
            />
          ))}
        </div>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-8"
          noValidate
        >
          {step === 0 && <StepDetails />}
          {step === 1 && <StepLocation />}
          {step === 2 && <StepPhotos />}
          {step === 3 && (
            <StepReview
              onEditStep={setStep}
              onSubmitItem={onSubmitItem}
              isSubmitting={methods.formState.isSubmitting}
            />
          )}

          {step < 3 ? (
            <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-6">
              <button
                type="button"
                onClick={goPrev}
                disabled={step === 0}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => void goNext()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Next
              </button>
            </div>
          ) : null}
        </form>
      </FormProvider>
    </div>
  );
}

type SuccessProps = {
  itemId: string;
  onCreateAnother: () => void;
};

function ItemReportSuccessView({ itemId, onCreateAnother }: SuccessProps) {
  const [copied, setCopied] = useState(false);
  const path = `/items/${itemId}`;

  return (
    <div className="mx-auto max-w-md rounded-xl border border-found/30 bg-found-muted p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-found-muted text-found-foreground">
        <Check className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Listing created
      </h2>
      <p className="mt-1 break-all text-sm text-muted-foreground">
        ID{""}
        <span className="font-mono text-foreground">{itemId}</span>
      </p>
      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={async () => {
            const origin =
              typeof window !== "undefined" ? window.location.origin : "";
            const full = `${origin}${path}`;
            try {
              await navigator.clipboard.writeText(full);
              setCopied(true);
              toast.success("Link copied to clipboard");
              setTimeout(() => setCopied(false), 2000);
            } catch {
              toast.error("Could not copy link");
            }
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground"
        >
          <Link2 className="h-4 w-4" />
          {copied ? "Copied" : "Copy link to listing"}
        </button>
        <Link
          href={path}
          className="block w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
        >
          View listing
        </Link>
        <div className="pt-1">
          <button
            type="button"
            onClick={onCreateAnother}
            className="text-sm font-medium text-muted-foreground underline"
          >
            Create another
          </button>
        </div>
      </div>
    </div>
  );
}
