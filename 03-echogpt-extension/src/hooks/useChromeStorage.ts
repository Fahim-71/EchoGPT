"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getChrome, isBrowser } from "@/lib/env";

const PREFIX = "echogpt:";

/**
 * Dispatched on `window` after every successful write.
 *
 * The browser's own `storage` event only fires in *other* tabs, so a settings
 * page cannot use it to confirm its own save. This is the in-tab equivalent.
 */
export const SETTINGS_SAVED_EVENT = "echogpt:settings-saved";

/**
 * A `useState` that persists.
 *
 * - Inside the extension: `chrome.storage.sync`, so settings follow the user's
 *   Chrome profile across machines, and a change made in the options page is
 *   picked up live by an open side panel via the `onChanged` listener.
 * - On the web: `localStorage`, so the hosted demo behaves the same way.
 * - During SSR / static export: the initial value, with no access to either.
 *
 * The stored value always arrives asynchronously (chrome.storage has no sync
 * read), so `ready` lets callers avoid flashing a default over a saved value.
 */
export function useChromeStorage<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const storageKey = PREFIX + key;
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  // Keep the latest value out of the writer's dependency list.
  const valueRef = useRef(value);
  valueRef.current = value;

  // Hydrate once on mount.
  useEffect(() => {
    let cancelled = false;
    const c = getChrome();

    if (c?.storage?.sync) {
      c.storage.sync.get(storageKey, (got) => {
        if (cancelled) return;
        const stored = (got as Record<string, unknown>)[storageKey];
        if (stored !== undefined) setValue(stored as T);
        setReady(true);
      });
    } else if (isBrowser) {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw !== null) setValue(JSON.parse(raw) as T);
      } catch {
        /* private mode, quota, or corrupt JSON — fall back to `initial` */
      }
      setReady(true);
    } else {
      setReady(true);
    }

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  /**
   * Follow writes made by another instance of this hook in the same document.
   *
   * The showcase renders the popup and the side panel side by side, and both
   * read the default model. `chrome.storage.onChanged` covers that inside the
   * extension, but nothing covers it on the web — localStorage's own event is
   * cross-tab only — so the two surfaces would silently disagree.
   */
  useEffect(() => {
    function onSaved(event: Event) {
      const detail = (event as CustomEvent<{ key: string; value: unknown }>).detail;
      if (detail?.key === key) setValue(detail.value as T);
    }
    window.addEventListener(SETTINGS_SAVED_EVENT, onSaved);
    return () => window.removeEventListener(SETTINGS_SAVED_EVENT, onSaved);
  }, [key]);

  // Follow changes made in another extension surface (options ↔ side panel).
  useEffect(() => {
    const c = getChrome();
    if (!c?.storage?.onChanged) return;
    const listener = (
      changes: Record<string, { newValue?: unknown }>,
      area: string,
    ) => {
      if (area !== "sync") return;
      const hit = changes[storageKey];
      if (hit && "newValue" in hit) setValue(hit.newValue as T);
    };
    c.storage.onChanged.addListener(listener);
    return () => c.storage.onChanged.removeListener(listener);
  }, [storageKey]);

  const write = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(valueRef.current)
          : next;
      setValue(resolved);

      const c = getChrome();
      if (c?.storage?.sync) {
        c.storage.sync.set({ [storageKey]: resolved });
      } else if (isBrowser) {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(resolved));
        } catch {
          /* storage full or blocked — the in-memory value still updated */
        }
      }

      if (isBrowser) {
        window.dispatchEvent(
          new CustomEvent(SETTINGS_SAVED_EVENT, {
            detail: { key, value: resolved },
          }),
        );
      }
    },
    [storageKey, key],
  );

  return [value, write, ready];
}

/** Wipes every key this extension owns. Backs the "Clear local data" button. */
export async function clearEchoGptData(): Promise<number> {
  const c = getChrome();
  if (c?.storage?.sync) {
    const all = await c.storage.sync.get(null);
    const keys = Object.keys(all).filter((k) => k.startsWith(PREFIX));
    await c.storage.sync.remove(keys);
    if (c.storage.local) await c.storage.local.clear();
    return keys.length;
  }
  if (!isBrowser) return 0;
  try {
    const keys = Object.keys(window.localStorage).filter((k) =>
      k.startsWith(PREFIX),
    );
    keys.forEach((k) => window.localStorage.removeItem(k));
    return keys.length;
  } catch {
    return 0;
  }
}
