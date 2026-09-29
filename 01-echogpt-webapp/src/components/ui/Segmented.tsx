"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

export interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  /** Accessible name for the group. */
  label: string;
  size?: "sm" | "md";
  className?: string;
  fullWidth?: boolean;
  /** Show only the icon; the label stays in the accessibility tree. */
  iconOnly?: boolean;
}

/**
 * Radio-group segmented control with a shared sliding indicator. Arrow keys
 * move between options because each segment is a real radio.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
  className,
  fullWidth,
  iconOnly,
}: SegmentedProps<T>) {
  const groupId = useId();
  const reduce = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-2 p-0.5",
        fullWidth && "w-full",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
              event.preventDefault();
              const index = options.findIndex((o) => o.value === value);
              const delta = event.key === "ArrowRight" ? 1 : -1;
              onChange(options[(index + delta + options.length) % options.length].value);
            }}
            className={cn(
              "relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm font-medium transition-colors duration-150",
              size === "sm" ? "h-7 px-2.5 text-xs" : "h-9 px-3.5 text-sm",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {selected ? (
              <motion.span
                aria-hidden
                layoutId={`segmented-${groupId}`}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 38 }
                }
                className="absolute inset-0 rounded-sm bg-surface shadow-soft ring-1 ring-border"
              />
            ) : null}
            {Icon ? <Icon aria-hidden className="relative size-4" /> : null}
            <span className={cn("relative", iconOnly && Icon && "sr-only")}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
