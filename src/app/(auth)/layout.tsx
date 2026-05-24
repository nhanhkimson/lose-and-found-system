import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <div
          className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary bg-primary/10 font-bold text-primary"
          aria-hidden
        >
          <span className="text-2xl tracking-tight">BIU</span>
        </div>
        <h1 className="text-xl font-semibold text-primary sm:text-2xl">
          BELTEI International University
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lost &amp; Found sign in
        </p>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
        {children}
      </div>
    </div>
  );
}
