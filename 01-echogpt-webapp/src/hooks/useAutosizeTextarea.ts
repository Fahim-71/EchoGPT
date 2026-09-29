"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Grows a textarea with its content up to `maxHeight`, then lets it scroll.
 * Measuring requires collapsing the height first, which is why this runs
 * synchronously after layout rather than in a plain effect.
 */
export function useAutosizeTextarea(value: string, maxHeight = 208) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [maxHeight]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  return { ref, resize };
}
