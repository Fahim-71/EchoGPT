"use client";

import { useEffect, useState } from "react";

/**
 * Matches a media query on the client. Returns `false` during SSR and the first
 * paint so server and client markup agree, then settles on the real value.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Tailwind's `lg` breakpoint — the point where the sidebar stops being a sheet. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
