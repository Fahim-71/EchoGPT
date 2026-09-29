"use client";

import { useEffect, useRef, useState } from "react";

export interface HotkeyOptions {
  /** Require Cmd on macOS / Ctrl elsewhere. */
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  /** Fire even while a text field has focus. Off by default. */
  allowInInput?: boolean;
  enabled?: boolean;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/**
 * Binds a single document-level keyboard shortcut.
 *
 * `meta` maps to Cmd on Apple platforms and Ctrl everywhere else, so ⌘K and
 * Ctrl+K resolve to the same binding without the caller branching.
 */
export function useHotkey(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {},
): void {
  const { meta = false, shift = false, alt = false, allowInInput = false, enabled = true } = options;
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      const metaPressed = event.metaKey || event.ctrlKey;
      if (meta !== metaPressed) return;
      if (shift !== event.shiftKey) return;
      if (alt !== event.altKey) return;
      if (!allowInInput && isEditable(event.target)) return;
      handlerRef.current(event);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key, meta, shift, alt, allowInInput, enabled]);
}

/**
 * The modifier glyph for this platform: ⌘ on Apple, Ctrl elsewhere.
 *
 * Detection runs in an effect rather than during render so the server and the
 * first client render agree; the label settles immediately after hydration.
 */
export function useModKey(): string {
  const [key, setKey] = useState("⌘");

  useEffect(() => {
    const ua = navigator.userAgent;
    setKey(/Mac|iPhone|iPad|iPod/.test(ua) ? "⌘" : "Ctrl");
  }, []);

  return key;
}
