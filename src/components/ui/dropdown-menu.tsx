"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export const DropdownMenu = Dropdown.Root;
export const DropdownMenuTrigger = Dropdown.Trigger;
export const DropdownMenuContent = ({
  className,
  children,
  align = "end",
  ...props
}: React.ComponentProps<typeof Dropdown.Content>) => {
  return (
    <Dropdown.Portal>
      <Dropdown.Content
        align={align}
        sideOffset={6}
        className={cn(
          "z-50 min-w-[10rem] overflow-hidden rounded-lg border border-border bg-surface p-1 text-sm shadow-card",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        {children}
      </Dropdown.Content>
    </Dropdown.Portal>
  );
};

export function DropdownMenuItem({
  asChild = false,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Dropdown.Item> & { asChild?: boolean }) {
  return (
    <Dropdown.Item
      asChild={asChild}
      className={cn(
        "cursor-pointer rounded px-2 py-2 text-foreground outline-none select-none",
        "focus:bg-surface-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        asChild && "[&>a]:flex [&>a]:w-full [&>a]:items-center",
        className,
      )}
      {...props}
    >
      {children}
    </Dropdown.Item>
  );
}

export const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof Dropdown.Separator>) => (
  <Dropdown.Separator
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
);

type DropdownSubProps = { children: ReactNode };
export const DropdownMenuLabel = (props: DropdownSubProps) => (
  <div
    className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
    {...props}
  />
);
