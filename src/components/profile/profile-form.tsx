"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ProfileStatsGrid } from "@/components/profile/profile-stats";
import { updateProfileAction } from "@/lib/actions/profile.actions";
import type { UserProfile } from "@/lib/actions/profile.actions";
import { cn } from "@/lib/utils/cn";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations/profile.schema";

type ProfileFormProps = {
  profile: UserProfile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: profile.name ?? "",
      studentId: profile.studentId ?? "",
      image: profile.image ?? "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const result = await updateProfileAction(data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Profile updated");
    router.refresh();
  });

  const roleLabel =
    profile.role === "ADMIN"
      ? "Administrator"
      : profile.role === "STAFF"
        ? "Staff"
        : "Student";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-muted text-2xl font-semibold text-primary"
          aria-hidden
        >
          {profile.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            (profile.name?.[0] ?? profile.email?.[0] ?? "?").toUpperCase()
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {profile.name ?? "Your profile"}
          </h1>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">
            {roleLabel}
          </p>
          <p className="mt-1 text-xs text-subtle-foreground">
            Member since{" "}
            {new Intl.DateTimeFormat("en", {
              month: "short",
              year: "numeric",
            }).format(profile.createdAt)}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Your activity
        </h2>
        <ProfileStatsGrid stats={profile.stats} />
      </section>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">Edit profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update how you appear on listings and claims.
        </p>
        <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
          <div>
            <label
              htmlFor="profile-name"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Full name
            </label>
            <input
              id="profile-name"
              type="text"
              autoComplete="name"
              className={cn(
                "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none ring-primary/40 focus:ring-2",
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
              htmlFor="profile-student-id"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Student ID
            </label>
            <input
              id="profile-student-id"
              type="text"
              className={cn(
                "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none ring-primary/40 focus:ring-2",
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
              htmlFor="profile-image"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Avatar URL
            </label>
            <input
              id="profile-image"
              type="url"
              placeholder="https://..."
              className={cn(
                "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground outline-none ring-primary/40 focus:ring-2",
                errors.image && "border-danger",
              )}
              {...register("image")}
            />
            {errors.image ? (
              <p className="mt-1 text-sm text-danger" role="alert">
                {errors.image.message}
              </p>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            Email ({profile.email}) is managed by your account sign-in and
            cannot be changed here.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
