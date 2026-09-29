"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * Wrapper around the OS "reduce motion" setting for the hand-rolled animations
 * (typewriter, marquee) that don't go through framer-motion's own
 * `useReducedMotion`.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
