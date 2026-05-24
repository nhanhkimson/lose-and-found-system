import type { LucideIcon } from "lucide-react";
import { Bell, FileCheck, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const PRESETS: Record<
  "no-items" | "no-claims" | "no-notifications" | "no-matches",
  { title: string; description: string; icon: LucideIcon }
> = {
  "no-items": {
    title: "No items found",
    description: "Try different filters or search terms, or check back later.",
    icon: Search,
  },
  "no-claims": {
    title: "No claims yet",
    description: "When you submit a claim on a listing, it will appear here.",
    icon: FileCheck,
  },
  "no-notifications": {
    title: "All caught up",
    description:
      "You have no new notifications. We will notify you about matches and updates.",
    icon: Bell,
  },
  "no-matches": {
    title: "No matches found",
    description:
      "We could not find counterpart listings that fit your items yet. Keep your listings updated.",
    icon: Search,
  },
};

type EmptyStateProps = {
  variant?: keyof typeof PRESETS;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  variant,
  title,
  description,
  icon: IconOverride,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  const preset = variant ? PRESETS[variant] : null;
  const Icon = IconOverride ?? preset?.icon ?? Search;
  const head = title ?? preset?.title ?? "Nothing here";
  const body = description ?? preset?.description ?? "";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/80 px-6 py-12 text-center/40",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/12 text-primary">
        <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{head}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
