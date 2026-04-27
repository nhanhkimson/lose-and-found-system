import type { Metadata } from "next";
import { FoundItemForm } from "@/components/items/found-item-form";

export const metadata: Metadata = {
  title: "Report found item",
  description: "Post something you found on campus in a few steps.",
};

export default function ReportFoundItemPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-biu-navy dark:text-zinc-100">
          Report a found item
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Describe the item and where you found it so the owner can claim it.
        </p>
      </div>
      <FoundItemForm />
    </div>
  );
}
