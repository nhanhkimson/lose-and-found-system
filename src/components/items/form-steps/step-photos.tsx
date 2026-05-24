"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ImageUpload } from "@/components/shared/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ItemReportFormValues } from "@/lib/validations/item-report.schema";

export function StepPhotos() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ItemReportFormValues>();
  const type = useWatch({ name: "type" });
  const isLost = type === "LOST";

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1.5 text-sm font-medium text-foreground">Photos</p>
        <Controller
          name="imageUrls"
          control={control}
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.imageUrls ? (
          <p className="mt-1 text-xs text-danger">
            {errors.imageUrls.message as string}
          </p>
        ) : null}
      </div>

      {isLost ? (
        <div>
          <Label htmlFor="reward">Reward (optional)</Label>
          <Input
            id="reward"
            placeholder="e.g. 20,000 KHR, coffee — anything honest"
            {...register("reward")}
          />
        </div>
      ) : null}

      <div className="space-y-3 rounded-lg border border-border p-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
            {...register("notifyOnMatch")}
          />
          <span>
            <span className="font-medium">
              Email me if a close match is posted
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              We use your account email for notifications.
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
            {...register("allowContact")}
          />
          <span>
            <span className="font-medium">
              Allow contact on the public listing
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              If unchecked, your email is not shown to other students.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
