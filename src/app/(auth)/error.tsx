"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AuthError({
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
        Sign-in error
      </h2>
      <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        {error.message || "Something went wrong on this page."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-biu-gold px-4 py-2 text-sm font-medium text-biu-navy transition hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-800 dark:border-zinc-600 dark:text-zinc-200"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
