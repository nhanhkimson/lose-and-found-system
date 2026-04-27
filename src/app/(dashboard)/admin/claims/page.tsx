import { redirect } from "next/navigation";
import { ClaimsTable } from "@/components/admin/claims-table";
import { listAdminClaims } from "@/lib/actions/admin.actions";

export default async function AdminClaimsPage() {
  const rows = await listAdminClaims("ALL");
  if (!rows) {
    redirect("/dashboard");
  }
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-biu-navy dark:text-zinc-100">
          Manage claims
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Review, approve, or reject ownership claims. Row click opens the detail panel.
        </p>
      </div>
      <ClaimsTable initialRows={rows} />
    </div>
  );
}
