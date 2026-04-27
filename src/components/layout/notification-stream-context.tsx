"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { useNotificationStore } from "@/store/notification-store";

type NotificationStreamValue = {
  unreadCount: number;
  refresh: () => Promise<void>;
};

const Ctx = createContext<NotificationStreamValue | null>(null);

export function useNotificationInbox() {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error("useNotificationInbox must be used within NotificationStreamProvider");
  }
  return v;
}

export function NotificationStreamProvider({ children }: { children: ReactNode }) {
  const { refetch } = useNotifications();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const value = useMemo(
    () => ({
      unreadCount,
      refresh: refetch,
    }),
    [unreadCount, refetch],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
