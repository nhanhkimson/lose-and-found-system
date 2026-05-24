import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ItemNotFound() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Item not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This listing may have been removed or the link is incorrect.
      </p>
      <Link
        href="/items"
        className="mt-8 inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back to listings
      </Link>
    </div>
  );
}
