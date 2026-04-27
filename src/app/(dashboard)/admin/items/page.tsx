import { redirect } from "next/navigation";
import { AdminItemsTable } from "@/components/admin/admin-items-table";
import { listAdminItems } from "@/lib/actions/admin.actions";

export default async function AdminItemsPage() {
  const items = await listAdminItems();
  if (!items) {
    redirect("/dashboard");
  }
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-biu-navy dark:text-zinc-100">
          Manage items
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          View, update status, or remove any listing.
        </p>
      </div>
      <AdminItemsTable items={items} />
    </div>
  );
}
