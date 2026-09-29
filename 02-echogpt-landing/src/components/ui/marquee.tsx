"use client";

import { useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  /** Accessible name for the scrolling region. */
  "aria-label"?: string;
}

/**
 * Transform-only infinite marquee.
 *
 * Lazy-mounted: the duplicated track and the animation only exist once the
 * strip scrolls into view, so it costs nothing on first paint. Pauses on hover
 * and on focus-within (keyboard users can read a card without it sliding
 * away), and degrades to a plain scrollable row under reduced motion.
 */
export function Marquee({
  children,
  duration = 46,
  reverse = false,
  className,
  "aria-label": ariaLabel,
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const reduce = usePrefersReducedMotion();
  const animate = inView && !reduce;

  return (
    <div
      ref={ref}
      aria-label={ariaLabel}
      role={ariaLabel ? "group" : undefined}
      className={cn("group relative overflow-hidden", className)}
    >
      {/* React 19 hoists and de-duplicates this by href, so two marquees on the
          page still ship one copy of the keyframes. */}
      <style href="echo-marquee" precedence="default">{
        "@keyframes echo-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}" +
        "@keyframes echo-marquee-rev{from{transform:translate3d(-50%,0,0)}to{transform:translate3d(0,0,0)}}"
      }</style>

      {animate ? (
        <div
          className="flex w-max gap-4 will-change-transform [animation-play-state:running] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
          style={{
            animationName: reverse ? "echo-marquee-rev" : "echo-marquee",
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          <div className="flex shrink-0 gap-4">{children}</div>
          <div aria-hidden="true" className="flex shrink-0 gap-4">
            {children}
          </div>
        </div>
      ) : (
        <div className="scrollbar-thin flex w-full gap-4 overflow-x-auto pb-3">
          {children}
        </div>
      )}
    </div>
  );
}
