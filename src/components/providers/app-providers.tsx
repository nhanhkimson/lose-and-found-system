"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SessionProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </SessionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
