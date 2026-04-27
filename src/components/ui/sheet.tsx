"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title: string;
  side?: "left" | "right";
  /** Override panel width, e.g. `w-[min(100vw,28rem)]` for claim form */
  contentClassName?: string;
};

export function Sheet({
  open,
  onOpenChange,
  children,
  title,
  side = "left",
  contentClassName,
}: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed z-50 flex h-full w-[min(100vw,18rem)] flex-col bg-white shadow-lg outline-none dark:bg-zinc-950",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            side === "left" &&
              "inset-y-0 left-0 border-r border-zinc-200 data-[state=closed]:slide-out-to-left-4 data-[state=open]:slide-in-from-left-4 dark:border-zinc-800",
            side === "right" &&
              "inset-y-0 right-0 max-w-md border-l border-zinc-200 data-[state=closed]:slide-out-to-right-4 data-[state=open]:slide-in-from-right-4 dark:border-zinc-800",
            contentClassName,
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <Dialog.Title className="text-sm font-semibold text-biu-navy dark:text-zinc-100">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="rounded p-1 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
