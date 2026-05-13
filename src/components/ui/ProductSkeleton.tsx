export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-ink-900/10 bg-white shadow-[0_18px_50px_rgba(36,30,22,0.08)]">
      <div className="h-80 animate-pulse bg-ink-900/10" />
      <div className="space-y-4 p-4">
        <div className="h-4 w-28 animate-pulse rounded-full bg-ink-900/10" />
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-ink-900/10" />
        <div className="h-4 w-full animate-pulse rounded-full bg-ink-900/10" />
        <div className="h-11 w-full animate-pulse rounded-full bg-ink-900/10" />
      </div>
    </div>
  );
}
