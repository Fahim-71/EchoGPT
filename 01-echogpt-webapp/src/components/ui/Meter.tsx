import { cn } from "@/lib/utils";

export interface MeterProps {
  /** 1–5 on the model catalogue's scale. */
  value: number;
  max?: number;
  label: string;
  /** Text shown next to the bars, e.g. "Instant" or "Premium". */
  valueLabel?: string;
  tone?: "brand" | "accent" | "warning";
  className?: string;
}

const TONES = {
  brand: "bg-brand-500",
  accent: "bg-accent-500",
  warning: "bg-warning",
} as const;

/**
 * Discrete 5-segment meter used for a model's speed and cost. Segments are
 * decorative; the real value is announced through the wrapper's aria attributes.
 */
export function Meter({
  value,
  max = 5,
  label,
  valueLabel,
  tone = "brand",
  className,
}: MeterProps) {
  return (
    <span
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={1}
      aria-valuemax={max}
      aria-valuetext={valueLabel ? `${label}: ${valueLabel}` : undefined}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      <span aria-hidden className="inline-flex items-center gap-[0.1875rem]">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 w-1 rounded-full transition-colors",
              i < value ? TONES[tone] : "bg-border-strong",
            )}
          />
        ))}
      </span>
      {valueLabel ? (
        <span aria-hidden className="text-[0.6875rem] text-muted-foreground">
          {valueLabel}
        </span>
      ) : null}
    </span>
  );
}

/** Latency 1–5 → a word a human can act on. */
export const SPEED_LABEL: Record<number, string> = {
  1: "Instant",
  2: "Fast",
  3: "Steady",
  4: "Slower",
  5: "Deliberate",
};

export const COST_LABEL: Record<number, string> = {
  1: "Lowest",
  2: "Low",
  3: "Standard",
  4: "High",
  5: "Premium",
};

/** Speed reads inversely to latency: latency 1 is the fastest. */
export function speedScore(latency: number): number {
  return 6 - latency;
}
