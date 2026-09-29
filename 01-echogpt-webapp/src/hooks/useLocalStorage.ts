"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * localStorage-backed state that is SSR-safe.
 *
 * The first client render deliberately returns `initialValue` so it matches the
 * server HTML, then the stored value is applied in an effect. `hydrated` is
 * exposed so callers can hold back layout that would otherwise flash.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const initialRef = useRef(initialValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // Private mode, blocked storage or corrupt JSON — keep the default.
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Persisting is best-effort; the in-memory value still updates.
        }
        return resolved;
      });
    },
    [key],
  );

  // Keep tabs in sync when the same key changes elsewhere.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== key) return;
      try {
        setValue(event.newValue === null ? initialRef.current : (JSON.parse(event.newValue) as T));
      } catch {
        /* ignore malformed cross-tab payloads */
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [value, update, hydrated];
}
