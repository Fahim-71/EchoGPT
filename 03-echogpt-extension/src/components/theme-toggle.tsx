"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Segmented } from "@/components/ui/segmented";
import { useMounted } from "@/hooks/useMediaQuery";

type ThemeValue = "light" | "dark" | "system";

const OPTIONS = [
  { value: "light" as const, label: <Sun className="size-3.5" />, srLabel: "Light" },
  { value: "dark" as const, label: <Moon className="size-3.5" />, srLabel: "Dark" },
  { value: "system" as const, label: <Monitor className="size-3.5" />, srLabel: "System" },
];

export interface ThemeToggleProps {
  /** Shows the word next to the icon. Used on the options page. */
  withLabels?: boolean;
  className?: string;
}

/**
 * Theme control shared by all three surfaces. Renders a disabled placeholder
 * until mounted, because `resolvedTheme` is undefined during the static export
 * and swapping it in at hydration would shift layout.
 */
export function ThemeToggle({ withLabels, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const options = withLabels
    ? OPTIONS.map((o) => ({
        ...o,
        label: (
          <>
            {o.label}
            <span>{o.srLabel}</span>
          </>
        ),
      }))
    : OPTIONS;

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={className}
        style={{ width: withLabels ? 236 : 86, height: 32 }}
      />
    );
  }

  return (
    <Segmented<ThemeValue>
      ariaLabel="Colour theme"
      value={(theme as ThemeValue) ?? "system"}
      onChange={setTheme}
      options={options}
      className={className}
    />
  );
}
