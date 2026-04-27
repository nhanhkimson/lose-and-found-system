"use client";

import { isThisWeek, isToday } from "date-fns";
import { Bell, FileText, Gavel, Link2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { markAllAsRead, markAsRead } from "@/lib/actions/notification.actions";
import { useNotificationInbox } from "@/components/layout/notification-stream-context";
import { useNotificationStore } from "@/store/notification-store";
import { cn } from "@/lib/utils/cn";
import type { NotificationKind } from "@prisma/client";

export type InboxItem = {
  id: string;
  kind: NotificationKind;
  link: string | null;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const KIND_ICON: Record<
  NotificationKind,
  typeof MessageSquare
> = {
  SYSTEM: Bell,
  MATCH: Link2,
  CLAIM: Gavel,
  ITEM: FileText,
};

function groupLabel(date: Date): "today" | "week" | "older" {
  if (isToday(date)) return "today";
  if (isThisWeek(date, { weekStartsOn: 1 })) return "week";
  return "older";
}

type NotificationsInboxProps = {
  initial: InboxItem[];
};

export function NotificationsInbox({ initial }: NotificationsInboxProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const { refresh } = useNotificationInbox();
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const markAllStore = useNotificationStore((s) => s.markAllRead);
  const storeItems = useNotificationStore((s) => s.notifications);

  useEffect(() => {
    setNotifications(
      initial.map((i) => ({
        ...i,
        createdAt:
          typeof i.createdAt === "string"
            ? i.createdAt
            : new Date(i.createdAt as unknown as Date).toISOString(),
      })),
    );
  }, [initial, setNotifications]);

  const items = storeItems.length > 0 ? storeItems : initial;

  const byToday = items.filter(
    (n) => groupLabel(new Date(n.createdAt)) === "today",
  );
  const byWeek = items.filter((n) => {
    const d = new Date(n.createdAt);
    return !isToday(d) && isThisWeek(d, { weekStartsOn: 1 });
  });
  const byOlder = items.filter((n) => {
    const d = new Date(n.createdAt);
    return !isThisWeek(d, { weekStartsOn: 1 });
  });

  const onMarkAll = () => {
    start(async () => {
      const res = await markAllAsRead();
      if (res.success) {
        markAllStore();
        await refresh();
        toast.success("All notifications marked as read");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  const onRowClick = (n: InboxItem) => {
    start(async () => {
      if (!n.read) {
        const res = await markAsRead(n.id);
        if (res.success) {
          useNotificationStore.getState().markRead(n.id);
          await refresh();
        }
      }
      router.push(n.link || "/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-biu-navy dark:text-zinc-100">
          Notifications
        </h1>
        <button
          type="button"
          onClick={onMarkAll}
          disabled={pending || !items.some((i) => !i.read)}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Mark all as read
        </button>
      </div>

      <InboxGroup title="Today" items={byToday} onRowClick={onRowClick} />
      <InboxGroup title="This week" items={byWeek} onRowClick={onRowClick} />
      <InboxGroup title="Older" items={byOlder} onRowClick={onRowClick} />

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">You have no notifications yet.</p>
      ) : null}
    </div>
  );
}

function InboxGroup({
  title,
  items,
  onRowClick,
}: {
  title: string;
  items: InboxItem[];
  onRowClick: (n: InboxItem) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h2>
      <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200/80 dark:divide-zinc-800 dark:border-zinc-800">
        {items.map((n) => {
          const Icon = KIND_ICON[n.kind] ?? Bell;
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => onRowClick(n)}
                className={cn(
                  "flex w-full gap-3 px-4 py-3 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-900/80",
                  !n.read && "bg-biu-gold/5",
                )}
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  <Icon className="h-4 w-4" />
                  {!n.read ? (
                    <span
                      className="absolute right-0 top-0 h-2 w-2 rounded-full bg-biu-gold"
                      aria-label="Unread"
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-sm font-semibold text-biu-navy dark:text-zinc-100">
                    {n.title}
                  </span>
                  <span className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {n.message}
                  </span>
                  <time
                    className="mt-1 block text-xs text-zinc-400"
                    dateTime={n.createdAt}
                  >
                    {new Date(n.createdAt).toLocaleString()}
                  </time>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
