"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { Segmented } from "@/components/ui/Segmented";
import { Skeleton } from "@/components/ui/Skeleton";

type ThemeChoice = "light" | "dark" | "system";

const OPTIONS = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
];

export interface ThemeToggleProps {
  /** Icon-only variant for the collapsed sidebar rail. */
  compact?: boolean;
  className?: string;
}

/**
 * Three-way theme control. The live app offers a single "Light Mode" link at
 * the bottom of the rail with no way to follow the OS, so "System" is a
 * first-class choice here rather than an implicit default.
 */
export function ThemeToggle({ compact = false, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes cannot know the resolved theme until after hydration.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Skeleton className={compact ? "h-8 w-8" : "h-10 w-full"} />;
  }

  const value = (theme ?? "system") as ThemeChoice;

  return (
    <Segmented
      value={value}
      onChange={(next) => setTheme(next)}
      options={OPTIONS}
      label="Colour theme"
      size="sm"
      iconOnly={compact}
      fullWidth
      className={className}
    />
  );
}
