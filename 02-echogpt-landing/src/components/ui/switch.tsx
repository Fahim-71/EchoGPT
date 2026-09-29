"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Visible label text; also the accessible name. */
  label: string;
  /** Hide the label visually but keep it for assistive tech. */
  hideLabel?: boolean;
  className?: string;
}

/**
 * `role="switch"` toggle. Native button underneath, so Space/Enter work for
 * free and the focus ring comes from the global `:focus-visible` rule.
 */
export function Switch({
  checked,
  onCheckedChange,
  label,
  hideLabel,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={hideLabel ? label : undefined}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200",
        checked
          ? "border-brand-600 bg-primary"
          : "border-border-strong bg-surface-3",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none ml-0.5 size-5 rounded-full bg-white shadow-soft transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}
