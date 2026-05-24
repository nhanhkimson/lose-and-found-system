"use client";

import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils/cn";
import "react-day-picker/style.css";

export function Calendar({ className, ...props }: DayPickerProps) {
  return (
    <DayPicker
      className={cn("rdp-root p-2", className)}
      classNames={{
        root: "rdp",
        month_caption:
          "flex h-8 items-center justify-center text-sm font-medium text-foreground",
        button_next:
          "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-surface-muted",
        button_previous:
          "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-surface-muted",
        day_button:
          "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-foreground hover:bg-primary/12",
        selected: "!bg-primary !text-white hover:!bg-primary hover:!text-white",
        today: "font-bold text-primary",
      }}
      {...props}
    />
  );
}
