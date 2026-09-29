"use client";

import { useModKey } from "@/hooks/useHotkey";
import { cn } from "@/lib/utils";

export interface KbdProps {
  /**
   * Key caps to render, e.g. `["Mod", "K"]` or `["Shift", "Enter"]`.
   * The literal `"Mod"` is resolved per platform: ⌘ on Apple, Ctrl elsewhere,
   * so no caller has to branch on the operating system.
   */
  keys: string[];
  className?: string;
  size?: "xs" | "sm";
}

export function Kbd({ keys, className, size = "xs" }: KbdProps) {
  const mod = useModKey();

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {keys.map((key, index) => (
        <kbd
          key={`${key}-${index}`}
          className={cn(
            "inline-flex items-center justify-center rounded-xs border border-border bg-surface-2 font-sans font-medium text-muted-foreground",
            size === "xs"
              ? "h-5 min-w-5 px-1 text-[0.625rem]"
              : "h-6 min-w-6 px-1.5 text-xs",
          )}
        >
          {key === "Mod" ? mod : key}
        </kbd>
      ))}
    </span>
  );
}
