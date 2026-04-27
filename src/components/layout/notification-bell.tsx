"use client";

import { formatDistanceToNow } from "date-fns";
import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 outline-none transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-biu-gold dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="h-5 w-5" strokeWidth={2} />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
          <p className="text-sm font-semibold text-biu-navy dark:text-zinc-100">
            Notifications
          </p>
        </div>
        <ul
          className="max-h-72 overflow-y-auto p-0"
          role="list"
          aria-live="polite"
        >
          {items.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">
              No notifications yet.
            </li>
          ) : (
            items.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "border-b border-zinc-100 px-3 py-2.5 last:border-0 dark:border-zinc-800",
                  !n.read && "bg-biu-gold/5",
                )}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      n.read ? "bg-zinc-300 dark:bg-zinc-600" : "bg-biu-gold",
                    )}
                    aria-label={n.read ? "Read" : "Unread"}
                    title={n.read ? "Read" : "Unread"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {n.message}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="flex flex-col gap-1 border-t border-zinc-200 p-2 dark:border-zinc-800">
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="w-full rounded-md py-2 text-center text-sm font-medium text-biu-gold transition hover:bg-biu-gold/10"
            >
              Mark all as read
            </button>
          ) : null}
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 rounded-md py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            View all
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
