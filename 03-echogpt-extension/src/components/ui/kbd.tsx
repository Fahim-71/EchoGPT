"use client";

import { modKeyLabel } from "@/hooks/useHotkey";
import { useMounted } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export interface KbdProps {
  /** Keys in order, e.g. ["mod", "Shift", "E"]. "mod" renders ⌘ or Ctrl. */
  keys: string[];
  className?: string;
}

/**
 * A key-cap row. The `mod` token resolves to ⌘ on Apple platforms and Ctrl
 * elsewhere, but only after mount — reading `navigator` during the static
 * export would bake one platform's label into the HTML.
 */
export function Kbd({ keys, className }: KbdProps) {
  const mounted = useMounted();
  const mod = mounted ? modKeyLabel() : "Ctrl";

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {keys.map((key, index) => (
        <kbd
          key={`${key}-${index}`}
          className={cn(
            "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-xs",
            "border border-border-strong bg-surface-2 px-1",
            "font-sans text-[10px] font-medium leading-none text-muted-foreground",
          )}
        >
          {key === "mod" ? mod : key}
        </kbd>
      ))}
    </span>
  );
}
