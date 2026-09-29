import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "accent" | "success" | "warning" | "danger";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted-foreground border-border",
  brand: "bg-brand-500/12 text-brand-700 dark:text-brand-300 border-brand-500/30",
  accent:
    "bg-accent-500/12 text-accent-600 dark:text-accent-400 border-accent-500/30",
  success: "bg-success/12 text-success border-success/30",
  warning: "bg-warning/12 text-warning border-warning/30",
  danger: "bg-danger/12 text-danger border-danger/30",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** Tiny variant used inside dense lists such as capability chips. */
  micro?: boolean;
}

export function Badge({ children, tone = "neutral", micro, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border font-medium",
        micro ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-[11px]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface DotProps {
  color: string;
  className?: string;
  /** Adds a soft halo — used for the "connected"/"streaming" state. */
  pulse?: boolean;
}

/** The model identity dot, reused in the picker, composer and message meta. */
export function Dot({ color, pulse, className }: DotProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        pulse && "animate-pulse",
        className,
      )}
      style={{
        backgroundColor: color,
        boxShadow: pulse ? `0 0 0 3px ${color}33` : undefined,
      }}
    />
  );
}
