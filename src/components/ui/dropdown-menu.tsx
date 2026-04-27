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
          "z-50 min-w-[10rem] overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 text-sm shadow-md dark:border-zinc-800 dark:bg-zinc-950",
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
        "cursor-pointer rounded px-2 py-2 text-zinc-800 outline-none select-none",
        "focus:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "dark:text-zinc-200 dark:focus:bg-zinc-800",
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
    className={cn("-mx-1 my-1 h-px bg-zinc-200 dark:bg-zinc-800", className)}
    {...props}
  />
);

type DropdownSubProps = { children: ReactNode };
export const DropdownMenuLabel = (props: DropdownSubProps) => (
  <div className="px-2 py-1.5 text-xs font-medium text-zinc-500" {...props} />
);
