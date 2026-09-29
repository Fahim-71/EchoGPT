import { cn } from "@/lib/utils";

export interface MeterProps {
  /** 1–5. */
  value: number;
  max?: number;
  label: string;
  /** Text for the current value, e.g. "Instant" or "$$". */
  valueLabel: string;
  /** Higher is worse (cost, latency) — the bar tints warm as it fills. */
  inverse?: boolean;
  className?: string;
}

/**
 * A five-segment meter.
 *
 * The whole point of the model picker redesign is that "speed" and "cost" are
 * comparable at a glance, so these are discrete pips rather than a continuous
 * bar: five steps are countable, a percentage is not.
 */
export function Meter({
  value,
  max = 5,
  label,
  valueLabel,
  inverse,
  className,
}: MeterProps) {
  const filled = Math.max(0, Math.min(max, value));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="w-9 shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        role="meter"
        aria-label={`${label}: ${valueLabel}`}
        aria-valuenow={filled}
        aria-valuemin={1}
        aria-valuemax={max}
        aria-valuetext={valueLabel}
        className="flex items-center gap-[3px]"
      >
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "h-1.5 w-3 rounded-full transition-colors",
              i < filled
                ? inverse
                  ? "bg-warning/80"
                  : "bg-accent-500"
                : "bg-surface-3",
            )}
          />
        ))}
      </span>
      <span className="text-[10px] font-medium text-muted-foreground">
        {valueLabel}
      </span>
    </div>
  );
}

const SPEED_WORD = ["Instant", "Quick", "Steady", "Thorough", "Deliberate"];
const COST_WORD = ["Free tier", "$", "$$", "$$$", "$$$$"];

/** Latency is 1 = fastest, so the speed meter fills in reverse. */
export function speedFill(latency: number): number {
  return 6 - Math.min(5, Math.max(1, latency));
}
export function speedWord(latency: number): string {
  return SPEED_WORD[Math.min(4, Math.max(0, latency - 1))];
}
export function costWord(cost: number): string {
  return COST_WORD[Math.min(4, Math.max(0, cost - 1))];
}
