"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-lg font-semibold text-biu-navy dark:text-zinc-100">
        Could not load this page
      </h2>
      <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        {error.message || "An unexpected error occurred in the app."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-biu-gold px-4 py-2 text-sm font-medium text-biu-navy transition hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
