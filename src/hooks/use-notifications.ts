"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useNotificationStore, type InboxNotification } from "@/store/notification-store";

type StreamPayload = {
  type: "unread" | "ping";
  unreadCount?: number;
};

function toInboxList(
  rows: {
    id: string;
    kind: InboxNotification["kind"];
    link: string | null;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }[],
): InboxNotification[] {
  return rows.map((r) => ({
    ...r,
    link: r.link,
    createdAt: r.createdAt,
  }));
}

/**
 * Fetches notifications, subscribes to `/api/notifications/sse` for unread count,
 * and syncs the Zustand {@link useNotificationStore}.
 */
export function useNotifications() {
  const { status } = useSession();
  const enabled = status === "authenticated";
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const reset = useNotificationStore((s) => s.reset);
  const esRef = useRef<EventSource | null>(null);

  const refetch = useCallback(async () => {
    const res = await fetch("/api/notifications?limit=200");
    if (!res.ok) return;
    const data = (await res.json()) as {
      notifications: {
        id: string;
        kind: InboxNotification["kind"];
        link: string | null;
        title: string;
        message: string;
        read: boolean;
        createdAt: string;
      }[];
      unreadCount: number;
    };
    setNotifications(
      toInboxList(
        data.notifications.map((n) => ({
          ...n,
          createdAt:
            typeof n.createdAt === "string"
              ? n.createdAt
              : (n.createdAt as unknown as Date).toISOString(),
        })),
      ),
    );
    setUnreadCount(data.unreadCount);
  }, [setNotifications, setUnreadCount]);

  useEffect(() => {
    if (!enabled) {
      reset();
      return;
    }
    void refetch();
  }, [enabled, refetch, reset]);

  useEffect(() => {
    if (!enabled) {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      return;
    }
    const source = new EventSource("/api/notifications/sse");
    esRef.current = source;
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as StreamPayload;
        if (data.type === "unread" && typeof data.unreadCount === "number") {
          setUnreadCount(data.unreadCount);
        }
      } catch {
        // ignore
      }
    };
    return () => {
      source.close();
      esRef.current = null;
    };
  }, [enabled, setUnreadCount]);

  return { refetch };
}
