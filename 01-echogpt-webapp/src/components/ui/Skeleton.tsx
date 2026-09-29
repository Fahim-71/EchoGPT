import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
}

/** Shimmering placeholder block. Decorative — never announced. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "block rounded-sm bg-[linear-gradient(90deg,var(--surface-2)_25%,var(--surface-3)_50%,var(--surface-2)_75%)] bg-[length:200%_100%] animate-shimmer",
        className,
      )}
    />
  );
}

/** Three staggered lines, used while a model is still thinking. */
export function SkeletonLines({ className }: SkeletonProps) {
  return (
    <span className={cn("block space-y-2", className)}>
      <Skeleton className="h-3 w-[72%]" />
      <Skeleton className="h-3 w-[90%]" />
      <Skeleton className="h-3 w-[54%]" />
    </span>
  );
}
