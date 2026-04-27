"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { loginSchema, type LoginInput } from "@/lib/validations/auth.schema";

const googleIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (registered === "1") {
      toast.success("Account created. Sign in with your email and password.");
      router.replace("/login", { scroll: false });
    }
  }, [registered, router]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      toast.error("Invalid email or password.");
      return;
    }
    if (res?.ok) {
      const next = searchParams.get("callbackUrl") ?? "/";
      router.push(next);
      router.refresh();
    }
  });

  const onGoogle = () => {
    const next = searchParams.get("callbackUrl") ?? "/";
    void signIn("google", { callbackUrl: next });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-biu-navy dark:text-zinc-100">
          Sign in
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Use your campus email or Google.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={cn(
              "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-biu-gold/40 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
              errors.email && "border-red-500 focus:ring-red-500/30",
            )}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={cn(
              "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-biu-gold/40 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
              errors.password && "border-red-500 focus:ring-red-500/30",
            )}
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-biu-gold py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          Sign in
        </button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onGoogle}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        <span className="text-zinc-700 dark:text-zinc-200">{googleIcon}</span>
        Sign in with Google
      </button>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        No account?{" "}
        <Link
          href="/register"
          className="font-semibold text-biu-gold hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
