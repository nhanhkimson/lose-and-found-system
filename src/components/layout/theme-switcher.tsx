"use client";

import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";

const OPTIONS = [
  { id: "system", label: "System", icon: Laptop },
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
] as const;

export function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const active = theme ?? "system";
  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Switch theme"
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-muted/80 text-foreground shadow-card transition",
            "hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
          )}
        >
          <CurrentIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onSelect={() => setTheme(option.id)}
            className="justify-between"
          >
            <span className="inline-flex items-center gap-2">
              <option.icon className="h-4 w-4" />
              {option.label}
            </span>
            {active === option.id ? (
              <Check className="h-4 w-4 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
