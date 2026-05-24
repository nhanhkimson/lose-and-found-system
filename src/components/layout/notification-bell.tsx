"use client";

import { formatDistanceToNow } from "date-fns";
import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";
import { useNotificationInbox } from "./notification-stream-context";

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const { unreadCount, refresh } = useNotificationInbox();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    const data = (await res.json()) as { notifications: NotificationRow[] };
    setItems(data.notifications);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    void load();
  }, [open, load]);

  const markAllRead = async () => {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    await refresh();
    void load();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground outline-none transition hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="h-5 w-5" strokeWidth={2} />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-muted0 px-0.5 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <div className="border-b border-border px-3 py-2">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
        </div>
        <ul
          className="max-h-72 overflow-y-auto p-0"
          role="list"
          aria-live="polite"
        >
          {items.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No notifications yet.
            </li>
          ) : (
            items.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "border-b border-border-subtle px-3 py-2.5 last:border-0",
                  !n.read && "bg-primary/5",
                )}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      n.read ? "bg-subtle-foreground/40" : "bg-primary",
                    )}
                    aria-label={n.read ? "Read" : "Unread"}
                    title={n.read ? "Read" : "Unread"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {n.message}
                    </p>
                    <p className="mt-1 text-xs text-subtle-foreground">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="flex flex-col gap-1 border-t border-border p-2">
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="w-full rounded-md py-2 text-center text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              Mark all as read
            </button>
          ) : null}
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 rounded-md py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            View all
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
