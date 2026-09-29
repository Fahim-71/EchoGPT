import { cn } from "@/lib/utils";

interface MeterProps {
  label: string;
  /** Filled steps. */
  value: number;
  /** Total steps. */
  max?: number;
  /** Text read out next to the label ("Instant", "$$$"). */
  valueLabel: string;
  tone?: "brand" | "accent" | "amber";
  className?: string;
}

const TONES = {
  brand: "bg-brand-500",
  accent: "bg-accent-500",
  amber: "bg-amber-500",
} as const;

/**
 * Discrete segmented meter. Uses `role="meter"` with explicit aria values so a
 * screen reader gets "Speed, 4 of 5" rather than a row of empty divs.
 */
export function Meter({
  label,
  value,
  max = 5,
  valueLabel,
  tone = "brand",
  className,
}: MeterProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="w-10 shrink-0 text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <div
        role="meter"
        aria-label={`${label}: ${valueLabel}`}
        aria-valuenow={value}
        aria-valuemin={1}
        aria-valuemax={max}
        aria-valuetext={valueLabel}
        className="flex flex-1 items-center gap-1"
      >
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i < value ? TONES[tone] : "bg-surface-3",
            )}
          />
        ))}
      </div>
      <span className="w-14 shrink-0 text-right text-[11px] font-medium text-foreground">
        {valueLabel}
      </span>
    </div>
  );
}
