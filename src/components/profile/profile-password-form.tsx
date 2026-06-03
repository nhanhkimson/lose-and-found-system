"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changeProfilePasswordAction } from "@/lib/actions/profile.actions";
import { cn } from "@/lib/utils/cn";
import {
  profilePasswordChangeSchema,
  type ProfilePasswordChangeInput,
} from "@/lib/validations/profile.schema";

type ProfilePasswordFormProps = {
  hasPassword: boolean;
};

export function ProfilePasswordForm({ hasPassword }: ProfilePasswordFormProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfilePasswordChangeInput>({
    resolver: zodResolver(profilePasswordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!hasPassword) {
    return (
      <p className="text-sm text-muted-foreground">
        You signed in with Google. Password change is not available for this
        account.
      </p>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    const result = await changeProfilePasswordAction(data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Password updated");
    reset();
    setOpen(false);
  });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-primary hover:underline"
      >
        Change password
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="current-password"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Current password
        </label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          className={cn(
            "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm",
            errors.currentPassword && "border-danger",
          )}
          {...register("currentPassword")}
        />
        {errors.currentPassword ? (
          <p className="mt-1 text-sm text-danger">
            {errors.currentPassword.message}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="new-password"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          New password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          className={cn(
            "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm",
            errors.newPassword && "border-danger",
          )}
          {...register("newPassword")}
        />
        {errors.newPassword ? (
          <p className="mt-1 text-sm text-danger">{errors.newPassword.message}</p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="confirm-new-password"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Confirm new password
        </label>
        <input
          id="confirm-new-password"
          type="password"
          autoComplete="new-password"
          className={cn(
            "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm",
            errors.confirmPassword && "border-danger",
          )}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-sm text-danger">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          Update password
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
