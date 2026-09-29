"use client";

import { useEffect, useRef } from "react";

export interface HotkeySpec {
  /** Single character or a `KeyboardEvent.key` value such as "Escape". */
  key: string;
  mod?: boolean;
  shift?: boolean;
  alt?: boolean;
  /** Fire even while a text field has focus. Off by default. */
  allowInInput?: boolean;
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * Binds a keyboard shortcut to the document.
 *
 * `mod` means Cmd on macOS and Ctrl elsewhere, which is the only correct way to
 * express a shortcut that has to feel native on both.
 */
export function useHotkey(
  spec: HotkeySpec | null,
  handler: (event: KeyboardEvent) => void,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  // Callers pass an object literal, so `spec` is a new identity every render.
  // Depending on its fields rather than the object keeps the listener attached
  // once instead of being torn down and re-added on every render.
  const key = spec?.key;
  const mod = spec?.mod ?? false;
  const shift = spec?.shift ?? false;
  const alt = spec?.alt ?? false;
  const allowInInput = spec?.allowInInput ?? false;

  useEffect(() => {
    if (!key) return;
    const wanted = key.toLowerCase();

    function onKeyDown(event: KeyboardEvent) {
      if (!allowInInput && isEditable(event.target)) return;
      const modPressed = event.metaKey || event.ctrlKey;
      if (mod !== modPressed) return;
      if (shift !== event.shiftKey) return;
      if (alt !== event.altKey) return;
      if (event.key.toLowerCase() !== wanted) return;
      event.preventDefault();
      handlerRef.current(event);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [key, mod, shift, alt, allowInInput]);
}

/** "⌘" on Apple platforms, "Ctrl" everywhere else. Safe before hydration. */
export function modKeyLabel(): string {
  if (typeof navigator === "undefined") return "Ctrl";
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? navigator.platform;
  return /mac|iphone|ipad/i.test(platform ?? "") ? "⌘" : "Ctrl";
}
