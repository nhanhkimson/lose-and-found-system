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
        month_caption: "flex h-8 items-center justify-center text-sm font-medium text-biu-navy dark:text-zinc-100",
        button_next: "inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800",
        button_previous:
          "inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800",
        day_button:
          "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-zinc-800 hover:bg-biu-gold/15 dark:text-zinc-200",
        selected:
          "!bg-biu-gold !text-white hover:!bg-biu-gold hover:!text-white",
        today: "font-bold text-biu-gold",
      }}
      {...props}
    />
  );
}
