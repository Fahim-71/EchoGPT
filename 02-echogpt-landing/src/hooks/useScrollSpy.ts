"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently under the viewport's reading line.
 *
 * Uses a single IntersectionObserver with a top-biased root margin rather than
 * a scroll listener, so it costs nothing on the main thread while scrolling.
 */
export function useScrollSpy(
  ids: readonly string[],
  rootMargin = "-45% 0px -50% 0px",
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Keep document order so the topmost visible section wins.
        const next = ids.find((id) => visible.has(id)) ?? null;
        setActiveId((prev) => next ?? prev);
      },
      { rootMargin, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}
