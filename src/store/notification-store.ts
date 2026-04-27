import { create } from "zustand";
import type { NotificationKind } from "@prisma/client";

export type InboxNotification = {
  id: string;
  kind: NotificationKind;
  link: string | null;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type State = {
  notifications: InboxNotification[];
  unreadCount: number;
  addNotification: (n: InboxNotification) => void;
  setNotifications: (list: InboxNotification[]) => void;
  setUnreadCount: (n: number | ((prev: number) => number)) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  reset: () => void;
};

export const useNotificationStore = create<State>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications].filter(
        (x, i, arr) => arr.findIndex((y) => y.id === x.id) === i,
      ),
      unreadCount: n.read ? s.unreadCount : s.unreadCount + 1,
    })),
  setNotifications: (list) =>
    set(() => ({
      notifications: list,
      unreadCount: list.filter((x) => !x.read).length,
    })),
  setUnreadCount: (n) =>
    set((s) => ({
      unreadCount: typeof n === "function" ? n(s.unreadCount) : n,
    })),
  markRead: (id) =>
    set((s) => {
      const wasUnread = s.notifications.some((x) => x.id === id && !x.read);
      return {
        notifications: s.notifications.map((x) =>
          x.id === id ? { ...x, read: true } : x,
        ),
        unreadCount: wasUnread ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
      };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((x) => ({ ...x, read: true })),
      unreadCount: 0,
    })),
  reset: () => set({ notifications: [], unreadCount: 0 }),
}));
