import { redirect } from "next/navigation";
import { AdminStatsDashboard } from "@/components/admin/admin-stats-dashboard";
import { getAdminStats } from "@/lib/actions/admin.actions";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  if (!stats) {
    redirect("/dashboard");
  }
  return <AdminStatsDashboard stats={stats} />;
}
