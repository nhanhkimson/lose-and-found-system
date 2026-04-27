import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ItemNotFound() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h1 className="text-2xl font-semibold text-biu-navy dark:text-zinc-100">
        Item not found
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        This listing may have been removed or the link is incorrect.
      </p>
      <Link
        href="/items"
        className="mt-8 inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-biu-navy transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back to listings
      </Link>
    </div>
  );
}
