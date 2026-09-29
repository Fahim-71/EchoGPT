import { cn } from "@/lib/utils";

export interface StreamingCursorProps {
  className?: string;
}

/** Blinking caret appended to the streaming token, matching the text baseline. */
export function StreamingCursor({ className }: StreamingCursorProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-0.5 inline-block h-[1.05em] w-[0.4ch] translate-y-[0.14em] rounded-[1px] bg-primary align-baseline animate-caret",
        className,
      )}
    />
  );
}

export interface ThinkingDotsProps {
  className?: string;
  label?: string;
}

/** Pre-first-token state, shown while the model has not yet emitted anything. */
export function ThinkingDots({ className, label = "Generating" }: ThinkingDotsProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
      <span aria-hidden className="inline-flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-muted-foreground/70"
            style={{
              animation: "caret 1.1s ease-in-out infinite",
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </span>
      {label}
    </span>
  );
}
