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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Report a lost item
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us what you lost, where, and when — add photos to help people
          recognize it.
        </p>
      </div>
      <LostItemForm />
    </div>
  );
}
