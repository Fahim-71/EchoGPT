"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

/** Labelled toggle built on a native button with `role="switch"`. */
export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
  className,
}: SwitchProps) {
  const id = useId();
  return (
    <div className={cn("flex items-start justify-between gap-6", className)}>
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200",
          "disabled:pointer-events-none disabled:opacity-40",
          checked
            ? "border-transparent bg-primary"
            : "border-border-strong bg-surface-3",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute size-[1.125rem] rounded-full bg-white shadow-soft transition-transform duration-200",
            checked ? "translate-x-[1.4375rem]" : "translate-x-[0.1875rem]",
          )}
        />
      </button>
    </div>
  );
}
