import type { Metadata } from "next";
import Link from "next/link";
import { SwaggerUIClient } from "@/components/api-docs/swagger-ui-client";

export const metadata: Metadata = {
  title: "API reference",
  description: "OpenAPI 3 documentation for public HTTP API routes",
  robots: { index: false, follow: false },
};

export default function ApiDocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-biu-navy dark:text-zinc-100">
              API reference (Swagger UI)
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Spec served from <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">/api/openapi</code>
              . “Try it out” only sends your browser&apos;s session cookies for this origin; server actions
              are not listed here.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-biu-gold hover:underline"
          >
            ← Back to app
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <SwaggerUIClient url="/api/openapi" />
      </main>
    </div>
  );
}
