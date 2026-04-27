"use client";

import { format, startOfDay } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectNative } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { CAMPUS_BUILDINGS } from "@/lib/utils/constants";
import { FOUND_DISPOSITION_OPTIONS } from "@/lib/utils/found-disposition";
import { cn } from "@/lib/utils/cn";
import type { ItemReportFormValues } from "@/lib/validations/item-report.schema";

export function StepLocation() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ItemReportFormValues>();
  const type = useWatch({ name: "type" });
  const isLost = type === "LOST";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="building" required>
          Building / area
        </Label>
        <SelectNative
          id="building"
          aria-invalid={!!errors.building}
          className={cn(errors.building && "border-red-500 focus:ring-red-500/30")}
          {...register("building")}
        >
          {CAMPUS_BUILDINGS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </SelectNative>
        {errors.building ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.building.message as string}
          </p>
        ) : null}
      </div>

      <div>
        <Label htmlFor="roomHint" required>
          Specific location
        </Label>
        <Textarea
          id="roomHint"
          rows={3}
          placeholder="e.g. 2nd floor corridor near the elevator, east stairwell, Lab B-12"
          aria-invalid={!!errors.roomHint}
          className={cn(errors.roomHint && "border-red-500 focus:ring-red-500/30")}
          {...register("roomHint")}
        />
        {errors.roomHint ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.roomHint.message as string}
          </p>
        ) : null}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {isLost ? "Date lost" : "Date found"}{" "}
          <span className="text-red-500">*</span>
        </span>
        <Controller
          name="eventDate"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex w-full max-w-xs items-center justify-start gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-left text-sm dark:border-zinc-700 dark:bg-zinc-900",
                    !field.value && "text-zinc-500",
                    errors.eventDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="h-4 w-4 shrink-0 text-biu-gold" />
                  {field.value
                    ? format(
                        field.value instanceof Date
                          ? field.value
                          : new Date(String(field.value)),
                        "PPP",
                      )
                    : "Pick a date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    field.value
                      ? field.value instanceof Date
                        ? field.value
                        : new Date(String(field.value))
                      : undefined
                  }
                  onSelect={(d) => field.onChange(d ?? new Date())}
                  disabled={(date) => startOfDay(date) > startOfDay(new Date())}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.eventDate ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.eventDate.message as string}
          </p>
        ) : null}
      </div>

      {isLost ? (
        <div>
          <Label htmlFor="timeApprox" required>
            Approximate time
          </Label>
          <div className="relative">
            <Clock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-biu-gold"
              aria-hidden
            />
            <Input
              id="timeApprox"
              className={cn("pl-9", errors.timeApprox && "border-red-500 focus:ring-red-500/30")}
              placeholder="e.g. 2:30 PM, or between 12–1 PM"
              {...register("timeApprox")}
            />
          </div>
          {errors.timeApprox ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.timeApprox.message as string}
            </p>
          ) : null}
        </div>
      ) : (
        <div>
          <Label htmlFor="foundDisposition" required>
            Where is the item now?
          </Label>
          <SelectNative
            id="foundDisposition"
            aria-invalid={!!errors.foundDisposition}
            className={cn(
              errors.foundDisposition && "border-red-500 focus:ring-red-500/30",
            )}
            {...register("foundDisposition", {
              setValueAs: (v: string) => (v === "" ? undefined : v),
            })}
          >
            <option value="" disabled>
              Select an option
            </option>
            {FOUND_DISPOSITION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectNative>
          {errors.foundDisposition ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.foundDisposition.message as string}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
