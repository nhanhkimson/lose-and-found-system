import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 py-12 dark:bg-biu-navy">
      <div className="mb-8 flex flex-col items-center text-center">
        <div
          className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-biu-gold font-bold text-biu-gold"
          aria-hidden
        >
          <span className="text-2xl tracking-tight">BIU</span>
        </div>
        <h1 className="text-xl font-semibold text-biu-gold sm:text-2xl">
          BELTEI International University
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Lost &amp; Found sign in
        </p>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
        {children}
      </div>
    </div>
  );
}
