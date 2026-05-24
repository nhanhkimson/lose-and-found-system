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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--overlay)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed z-50 flex h-full w-[min(100vw,18rem)] flex-col bg-surface shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            side === "left" &&
              "inset-y-0 left-0 border-r border-border data-[state=closed]:slide-out-to-left-4 data-[state=open]:slide-in-from-left-4",
            side === "right" &&
              "inset-y-0 right-0 max-w-md border-l border-border data-[state=closed]:slide-out-to-right-4 data-[state=open]:slide-in-from-right-4",
            contentClassName,
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Dialog.Title className="text-sm font-semibold text-foreground">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="rounded p-1 text-muted-foreground transition hover:bg-surface-muted"
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
