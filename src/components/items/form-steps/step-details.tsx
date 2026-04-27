"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import type { ItemReportFormValues } from "@/lib/validations/item-report.schema";

export function StepDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ItemReportFormValues>();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" required>
          Title
        </Label>
        <Input
          id="title"
          autoComplete="off"
          aria-invalid={!!errors.title}
          className={cn(errors.title && "border-red-500 focus:ring-red-500/30")}
          {...register("title")}
        />
        {errors.title ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.title.message as string}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="description" required>
          Description
        </Label>
        <Textarea
          id="description"
          rows={5}
          aria-invalid={!!errors.description}
          className={cn(errors.description && "border-red-500 focus:ring-red-500/30")}
          {...register("description")}
        />
        {errors.description ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.description.message as string}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="category" required>
          Category
        </Label>
        <SelectNative
          id="category"
          aria-invalid={!!errors.category}
          className={cn(errors.category && "border-red-500 focus:ring-red-500/30")}
          {...register("category")}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </SelectNative>
        {errors.category ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.category.message as string}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            placeholder="e.g. black, red trim"
            {...register("color")}
          />
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            placeholder="e.g. Apple, generic"
            {...register("brand")}
          />
        </div>
      </div>
    </div>
  );
}
