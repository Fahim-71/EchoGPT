import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "accent";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-muted-foreground border-border",
  brand: "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:border-brand-800",
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warning/10 text-warning border-warning/25",
  danger: "bg-danger/10 text-danger border-danger/25",
  accent: "bg-accent-500/10 text-accent-600 border-accent-500/25 dark:text-accent-400",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  /** Small leading dot, e.g. a model's identity colour. */
  dot?: string;
}

export function Badge({ children, tone = "neutral", className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium leading-4",
        TONES[tone],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: dot }}
        />
      ) : null}
      {children}
    </span>
  );
}
