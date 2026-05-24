import Link from "next/link";
import { getData } from "@/lib/actions/item.actions";
import { auth } from "@/lib/auth";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/utils/constants";
import { ItemList } from "@/components/home/item-list";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

export default async function Home() {
  const [result, session] = await Promise.all([getData(), auth()]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Build Bright University
            </p>
            <ThemeSwitcher />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {APP_NAME}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {APP_DESCRIPTION}
          </p>
          <div className="h-px w-full bg-border-subtle" />
          {session?.user ? (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                Signed in as {session.user.email ?? session.user.name}
              </span>
              <Link
                href="/items/lost"
                className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary/20"
              >
                Report lost
              </Link>
              <Link
                href="/items/found"
                className="inline-flex items-center justify-center rounded-lg border border-found/30 bg-found-muted px-3 py-1.5 text-sm font-semibold text-found-foreground transition hover:bg-found-muted"
              >
                Report found
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-muted"
              >
                Open dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-1 flex flex-wrap gap-2">
              <Link
                href="/login"
                className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Sign in to post
              </Link>
              <Link
                href="/register"
                className="inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          Recent listings
        </h2>
        {result.success ? (
          <ItemList items={result.data} />
        ) : (
          <div
            className="rounded-xl border border-danger/30 bg-danger-muted px-4 py-6 text-sm text-danger"
            role="alert"
          >
            <p className="font-medium">Could not load items</p>
            <p className="mt-1 text-danger/90">{result.error}</p>
          </div>
        )}
      </main>
    </div>
  );
}
