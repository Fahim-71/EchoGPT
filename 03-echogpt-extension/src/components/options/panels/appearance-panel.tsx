"use client";

import { SettingCard, SettingLabel, SettingRow } from "@/components/options/section";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/segmented";
import { useDensity } from "@/hooks/useSettings";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Appearance. Short on purpose — a theme control, a density control, and an
 * honest statement that motion already follows the OS setting rather than a
 * toggle that duplicates it.
 */
export function AppearancePanel() {
  const [density, setDensity] = useDensity();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="space-y-4">
      <SettingCard
        title="Theme"
        description="Applies to the popup, the side panel and this page. System follows your OS."
      >
        <ThemeToggle withLabels />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ThemePreview label="Light" dark={false} />
          <ThemePreview label="Dark" dark />
        </div>
      </SettingCard>

      <SettingCard title="Layout">
        <SettingRow>
          <SettingLabel
            label="Density"
            description="Compact trims vertical padding in the side panel — useful when the panel is docked next to a long article."
          />
          <Segmented<"cosy" | "compact">
            ariaLabel="Density"
            value={density}
            onChange={setDensity}
            options={[
              { value: "cosy", label: "Cosy" },
              { value: "compact", label: "Compact" },
            ]}
          />
        </SettingRow>
        <SettingRow>
          <SettingLabel
            label="Motion"
            description={
              reducedMotion
                ? "Your system asks for reduced motion, so animations are already disabled. There is no separate switch here because the OS setting is the right place for it."
                : "Animations follow your system's “reduce motion” setting. Change it there and every EchoGPT surface follows."
            }
          />
          <Badge tone={reducedMotion ? "warning" : "neutral"} micro>
            {reducedMotion ? "Reduced" : "System"}
          </Badge>
        </SettingRow>
      </SettingCard>
    </div>
  );
}

/**
 * A static swatch of the token set, so the theme choice is visible up front.
 *
 * The dark swatch just adds `.dark`, which re-declares the tokens on that
 * subtree. The light swatch cannot do the mirror image — globals.css has no
 * `.light` class to undo `.dark` on <html> — so it pins the six tokens it
 * actually paints with inline, which is enough for a preview this small.
 */
const LIGHT_TOKENS = {
  "--background": "#ffffff",
  "--foreground": "#0d0b16",
  "--surface": "#ffffff",
  "--surface-2": "#f6f5fa",
  "--surface-3": "#eceaf3",
  "--border": "#e6e4ee",
  "--muted-foreground": "#63607a",
  "--primary": "#6d28f5",
} as React.CSSProperties;

function ThemePreview({ label, dark }: { label: string; dark: boolean }) {
  return (
    <div
      style={dark ? undefined : LIGHT_TOKENS}
      className={`${dark ? "dark" : ""} overflow-hidden rounded-md border border-border`}
    >
      <div className="bg-background p-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" />
          <span className="text-[11px] font-semibold text-foreground">{label}</span>
        </div>
        <div className="mt-2 space-y-1">
          <div className="h-1.5 w-full rounded-full bg-surface-3" />
          <div className="h-1.5 w-2/3 rounded-full bg-surface-2" />
        </div>
        <div className="mt-2 rounded-sm border border-border bg-surface px-1.5 py-1 text-[9px] text-muted-foreground">
          Message EchoGPT
        </div>
      </div>
    </div>
  );
}
