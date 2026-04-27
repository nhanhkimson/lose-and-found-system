"use client";

import * as Pop from "@radix-ui/react-popover";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export const Popover = Pop.Root;
export const PopoverTrigger = Pop.Trigger;

export function PopoverContent({
  className,
  children,
  align = "end",
  ...props
}: React.ComponentProps<typeof Pop.Content> & { children: ReactNode }) {
  return (
    <Pop.Portal>
      <Pop.Content
        align={align}
        sideOffset={8}
        className={cn(
          "z-50 w-[min(100vw,22rem)] rounded-lg border border-zinc-200 bg-white p-0 shadow-lg dark:border-zinc-800 dark:bg-zinc-950",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          className,
        )}
        {...props}
      >
        {children}
      </Pop.Content>
    </Pop.Portal>
  );
}
