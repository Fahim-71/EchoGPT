"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  /** Hides the text and applies it as an accessible name instead. */
  hideLabel?: boolean;
  className?: string;
}

/**
 * A real `role="switch"` button rather than a styled checkbox, so screen
 * readers announce "on"/"off" instead of "checked". The whole row is the hit
 * target, which matters at 400px.
 */
export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  hideLabel,
  className,
}: SwitchProps) {
  const id = useId();

  const control = (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={hideLabel && typeof label === "string" ? label : undefined}
      aria-describedby={description ? `${id}-d` : undefined}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200",
        "disabled:cursor-not-allowed disabled:opacity-45",
        checked
          ? "border-transparent bg-primary"
          : "border-border-strong bg-surface-3",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none ml-0.5 size-4 rounded-full bg-white shadow-soft transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );

  if (hideLabel) return <span className={className}>{control}</span>;

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <label
          htmlFor={id}
          className={cn(
            "block text-[13px] font-medium text-foreground",
            !disabled && "cursor-pointer",
          )}
        >
          {label}
        </label>
        {description && (
          <p id={`${id}-d`} className="mt-0.5 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {control}
    </div>
  );
}
