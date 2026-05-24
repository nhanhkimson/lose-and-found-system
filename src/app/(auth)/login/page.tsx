import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginPageSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="h-6 w-32 rounded bg-surface-muted" />
      <div className="h-10 w-full rounded bg-surface-muted" />
      <div className="h-10 w-full rounded bg-surface-muted" />
      <div className="h-10 w-full rounded bg-surface-muted" />
    </div>
  );
}
