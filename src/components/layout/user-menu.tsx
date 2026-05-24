"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";

function initials(
  name: string | null | undefined,
  email: string | null | undefined,
) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "?";
}

export function UserMenu() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading" || !user) {
    return (
      <div
        className="h-9 w-9 animate-pulse rounded-full bg-surface-muted"
        aria-hidden
      />
    );
  }

  const label = initials(user.name, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-surface-muted text-xs font-semibold text-foreground",
            "outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary",
          )}
        >
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={36}
              height={36}
              className="h-full w-full object-cover"
              sizes="36px"
            />
          ) : (
            <span className="text-[11px] leading-none" aria-hidden>
              {label}
            </span>
          )}
          <span className="sr-only">Open user menu</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="end">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-medium text-foreground">
            {user.name || "User"}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex cursor-pointer items-center gap-2"
          >
            <User className="h-4 w-4" aria-hidden />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex cursor-pointer items-center gap-2"
          >
            <Settings className="h-4 w-4" aria-hidden />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-danger focus:text-danger"
          onSelect={() => void signOut({ callbackUrl: "/" })}
        >
          <span className="flex items-center gap-2">
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
