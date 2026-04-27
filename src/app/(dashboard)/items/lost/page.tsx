import type { Metadata } from "next";
import { LostItemForm } from "@/components/items/lost-item-form";

export const metadata: Metadata = {
  title: "Report lost item",
  description: "File a lost item report in a few steps.",
};

export default function ReportLostItemPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-biu-navy dark:text-zinc-100">
          Report a lost item
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Tell us what you lost, where, and when — add photos to help people recognize it.
        </p>
      </div>
      <LostItemForm />
    </div>
  );
}
