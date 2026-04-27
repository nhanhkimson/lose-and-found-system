import Link from "next/link";
import { getData } from "@/lib/actions/item.actions";
import { auth } from "@/lib/auth";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/utils/constants";
import { ItemList } from "@/components/home/item-list";

export default async function Home() {
  const [result, session] = await Promise.all([getData(), auth()]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-biu-navy">
      <header className="border-b border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-biu-gold">
            Build Bright University
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-biu-navy dark:text-zinc-50 sm:text-4xl">
            {APP_NAME}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
            {APP_DESCRIPTION}
          </p>
          {session?.user ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Signed in as {session.user.email ?? session.user.name}
              </span>
              <Link
                href="/items/lost"
                className="inline-flex items-center justify-center rounded-lg border border-biu-gold/40 bg-biu-gold/10 px-3 py-1.5 text-sm font-semibold text-biu-navy transition hover:bg-biu-gold/20 dark:text-zinc-100"
              >
                Report lost
              </Link>
              <Link
                href="/items/found"
                className="inline-flex items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-500/20 dark:text-emerald-200"
              >
                Report found
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-biu-gold underline-offset-2 hover:underline"
              >
                Open dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/login"
                className="inline-flex rounded-lg bg-biu-gold px-4 py-2 text-sm font-semibold text-biu-navy transition hover:opacity-90"
              >
                Sign in to post
              </Link>
              <Link
                href="/register"
                className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-biu-navy dark:border-zinc-600 dark:text-zinc-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="mb-6 text-lg font-semibold text-biu-navy dark:text-zinc-100">
          Recent listings
        </h2>
        {result.success ? (
          <ItemList items={result.data} />
        ) : (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            <p className="font-medium">Could not load items</p>
            <p className="mt-1 text-red-700/90 dark:text-red-300/90">
              {result.error}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
