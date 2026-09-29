import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
}

/** Shimmering placeholder block. Uses the shared `animate-shimmer` keyframe. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "block rounded-sm bg-surface-2 animate-shimmer",
        "bg-[linear-gradient(90deg,var(--surface-2)_0%,var(--surface-3)_40%,var(--surface-2)_80%)]",
        "bg-[length:200%_100%]",
        className,
      )}
    />
  );
}

/** Three staggered lines, sized like a paragraph of streamed text. */
export function SkeletonLines({ lines = 3 }: { lines?: number }) {
  const widths = ["w-full", "w-[92%]", "w-[74%]", "w-[85%]", "w-[60%]"];
  return (
    <span className="flex flex-col gap-1.5" aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-3", widths[i % widths.length])} />
      ))}
    </span>
  );
}
