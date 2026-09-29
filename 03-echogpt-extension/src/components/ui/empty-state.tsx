import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** A single next step. Empty states without one are just apologies. */
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-6 py-8" : "gap-3 px-6 py-12",
        className,
      )}
    >
      <span
        aria-hidden
        className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted-foreground"
      >
        <Icon className="size-[18px]" />
      </span>
      <div className="space-y-1">
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        <p className="mx-auto max-w-[36ch] text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
