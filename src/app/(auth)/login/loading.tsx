export default function LoginLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="h-6 w-32 rounded bg-surface-muted" />
      <div className="h-4 w-48 rounded bg-surface-muted" />
      <div className="h-10 w-full rounded bg-surface-muted" />
      <div className="h-10 w-full rounded bg-surface-muted" />
      <div className="h-10 w-full rounded bg-surface-muted" />
    </div>
  );
}
