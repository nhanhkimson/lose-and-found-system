import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserNotifications } from "@/lib/actions/notification.actions";
import { NotificationsInbox } from "@/components/notifications/notifications-inbox";

export const metadata = {
  title: "Notifications",
  description: "Your BIU Lost & Found notifications",
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/notifications");
  }
  const rows = await getUserNotifications();
  if (rows == null) {
    redirect("/login?callbackUrl=/notifications");
  }

  const initial = rows.map((n) => ({
    id: n.id,
    kind: n.kind,
    link: n.link,
    title: n.title,
    message: n.message,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  }));

  return <NotificationsInbox initial={initial} />;
}
