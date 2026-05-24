"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerAction } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils/cn";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (data) => {
    const result = await registerAction(data);
    if (!result.success) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          const k = key as keyof RegisterInput;
          if (messages[0]) {
            setError(k, { message: messages[0] });
          }
        }
      }
      toast.error(result.error);
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Create an account
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use your student email. You can sign in with Google later from the
          login page.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={cn(
              "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none ring-primary/40 focus:ring-2",
              errors.name && "border-danger",
            )}
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-sm text-danger" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="reg-email"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            className={cn(
              "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none ring-primary/40 focus:ring-2",
              errors.email && "border-danger",
            )}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-danger" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="studentId"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Student ID{""}
            <span className="font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <input
            id="studentId"
            type="text"
            className={cn(
              "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none ring-primary/40 focus:ring-2",
              errors.studentId && "border-danger",
            )}
            {...register("studentId")}
          />
          {errors.studentId ? (
            <p className="mt-1 text-sm text-danger" role="alert">
              {errors.studentId.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="reg-password"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            className={cn(
              "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none ring-primary/40 focus:ring-2",
              errors.password && "border-danger",
            )}
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-1 text-sm text-danger" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className={cn(
              "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none ring-primary/40 focus:ring-2",
              errors.confirmPassword && "border-danger",
            )}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="mt-1 text-sm text-danger" role="alert">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          Register
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{""}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
