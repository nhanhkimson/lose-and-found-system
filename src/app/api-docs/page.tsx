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
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <header className="border-b border-border bg-surface px-4 py-4/80 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              API reference (Swagger UI)
            </h1>
            <p className="text-sm text-muted-foreground">
              Spec served from{" "}
              <code className="rounded bg-surface-muted px-1.5 py-0.5 text-xs">
                /api/openapi
              </code>
              . “Try it out” only sends your browser&apos;s session cookies for
              this origin; server actions are not listed here.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-primary hover:underline"
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
