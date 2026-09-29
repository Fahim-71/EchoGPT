"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Light/dark toggle. Renders a same-sized inert placeholder until mounted, so
 * the icon never flips after hydration and nothing shifts around it.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const shell =
    "inline-grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground transition-colors hover:bg-surface-3 hover:text-foreground";

  if (!mounted) {
    return <span aria-hidden="true" className={cn(shell, className)} />;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(shell, className)}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
