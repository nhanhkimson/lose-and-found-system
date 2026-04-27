"use client";

import { format } from "date-fns";
import { Check, Loader2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { CATEGORY_LABEL } from "@/lib/utils/constants";
import { FOUND_DISPOSITION_OPTIONS } from "@/lib/utils/found-disposition";
import { cn } from "@/lib/utils/cn";
import type { ItemReportFormValues } from "@/lib/validations/item-report.schema";

const STEP_LABELS = ["Details", "Location", "Photos", "Review"] as const;

type StepReviewProps = {
  onEditStep: (index: number) => void;
  onSubmitItem: () => void;
  isSubmitting: boolean;
};

function dispositionLabel(v: unknown) {
  if (v == null || v === "") return "—";
  return (
    FOUND_DISPOSITION_OPTIONS.find((o) => o.value === v)?.label ?? String(v)
  );
}

export function StepReview({
  onEditStep,
  onSubmitItem,
  isSubmitting,
}: StepReviewProps) {
  const { control } = useFormContext<ItemReportFormValues>();
  const values = useWatch({ control });
  const isLost = values.type === "LOST";

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/40"
        role="region"
        aria-label="Summary"
      >
        <dl className="space-y-3">
          <ReviewRow
            label="Title"
            value={values.title}
            onEdit={() => onEditStep(0)}
            stepName={STEP_LABELS[0]}
          />
          <ReviewRow
            label="Description"
            value={values.description}
            onEdit={() => onEditStep(0)}
            stepName={STEP_LABELS[0]}
            multiline
          />
          <ReviewRow
            label="Category"
            value={values.category ? CATEGORY_LABEL[values.category] : "—"}
            onEdit={() => onEditStep(0)}
            stepName={STEP_LABELS[0]}
          />
          <ReviewRow
            label="Color / brand"
            value={
              [values.color?.trim(), values.brand?.trim()].filter(Boolean).join(" · ") ||
              "—"
            }
            onEdit={() => onEditStep(0)}
            stepName={STEP_LABELS[0]}
          />
          <ReviewRow
            label="Building"
            value={values.building}
            onEdit={() => onEditStep(1)}
            stepName={STEP_LABELS[1]}
          />
          <ReviewRow
            label="Location detail"
            value={values.roomHint}
            onEdit={() => onEditStep(1)}
            stepName={STEP_LABELS[1]}
            multiline
          />
          <ReviewRow
            label={isLost ? "Date lost" : "Date found"}
            value={
              values.eventDate
                ? format(
                    values.eventDate instanceof Date
                      ? values.eventDate
                      : new Date(String(values.eventDate)),
                    "PPP",
                  )
                : "—"
            }
            onEdit={() => onEditStep(1)}
            stepName={STEP_LABELS[1]}
          />
          {isLost ? (
            <ReviewRow
              label="Approx. time"
              value={values.timeApprox?.trim() || "—"}
              onEdit={() => onEditStep(1)}
              stepName={STEP_LABELS[1]}
            />
          ) : (
            <ReviewRow
              label="Item is now"
              value={dispositionLabel(values.foundDisposition)}
              onEdit={() => onEditStep(1)}
              stepName={STEP_LABELS[1]}
            />
          )}
          <ReviewRow
            label="Photos"
            value={`${values.imageUrls?.length ?? 0} photo(s)`}
            onEdit={() => onEditStep(2)}
            stepName={STEP_LABELS[2]}
          />
          {isLost && values.reward?.trim() ? (
            <ReviewRow
              label="Reward"
              value={values.reward}
              onEdit={() => onEditStep(2)}
              stepName={STEP_LABELS[2]}
            />
          ) : null}
          <ReviewRow
            label="Match notifications"
            value={values.notifyOnMatch ? "On" : "Off"}
            onEdit={() => onEditStep(2)}
            stepName={STEP_LABELS[2]}
          />
          <ReviewRow
            label="Public contact"
            value={values.allowContact ? "Allowed" : "Hidden"}
            onEdit={() => onEditStep(2)}
            stepName={STEP_LABELS[2]}
          />
        </dl>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
          By submitting, you confirm the information is honest to the best of your
          knowledge.
        </p>
        <button
          type="button"
          onClick={onSubmitItem}
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-biu-gold px-4 py-2.5 text-sm font-semibold text-biu-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Publish listing
        </button>
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  onEdit,
  stepName,
  multiline,
}: {
  label: string;
  value: string | undefined;
  onEdit: () => void;
  stepName: string;
  multiline?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-b border-zinc-200/80 pb-3 last:border-0 last:pb-0 dark:border-zinc-800/80",
        multiline && "sm:grid sm:grid-cols-[7rem,1fr,auto] sm:gap-2",
        !multiline && "flex flex-wrap items-baseline justify-between gap-2",
      )}
    >
      <dt className="font-medium text-zinc-600 dark:text-zinc-400">{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-zinc-900 dark:text-zinc-100",
          multiline && "col-span-1 col-start-2 sm:col-start-2",
        )}
      >
        {multiline ? (
          <span className="whitespace-pre-wrap">{value ?? "—"}</span>
        ) : (
          (value ?? "—")
        )}
      </dd>
      <dd className="shrink-0 sm:ml-auto">
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-biu-gold hover:underline"
        >
          Edit {stepName}
        </button>
      </dd>
    </div>
  );
}
