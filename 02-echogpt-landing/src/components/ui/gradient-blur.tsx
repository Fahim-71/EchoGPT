import { cn } from "@/lib/utils";

interface GradientBlurProps {
  className?: string;
  /** Tailwind colour utility for the blob, e.g. `bg-brand-500/25`. */
  tone?: string;
  /** Adds the shared float animation (CSS-only, respects reduce-motion). */
  float?: boolean;
}

/**
 * Decorative out-of-flow colour wash. Pure CSS — no images, no layout impact,
 * and `aria-hidden` because it carries no meaning.
 */
export function GradientBlur({
  className,
  tone = "bg-brand-500/25",
  float,
}: GradientBlurProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl will-change-transform",
        tone,
        float && "animate-float",
        className,
      )}
    />
  );
}

/** Faint square grid used behind the hero. */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 70%, transparent) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 75%)",
      }}
    />
  );
}
