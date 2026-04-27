import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    const h = await headers();
    const path = h.get("x-pathname") ?? "/dashboard";
    redirect(`/login?callbackUrl=${encodeURIComponent(path)}`);
  }

  return <DashboardShell>{children}</DashboardShell>;
}
