import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { listAdminUsers } from "@/lib/actions/admin.actions";

export default async function AdminUsersPage() {
  const [session, users] = await Promise.all([auth(), listAdminUsers()]);
  if (!users || !session?.user?.id) {
    redirect("/dashboard");
  }
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-biu-navy dark:text-zinc-100">
          Manage users
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Assign student, staff, or admin roles. You cannot change your own role from here.
        </p>
      </div>
      <AdminUsersTable users={users} currentUserId={session.user.id} />
    </div>
  );
}
