"use client";

import { MousePointerClick, PanelRight, Settings, Smartphone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Segmented } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export type ShowcaseSurface = "popup" | "sidepanel" | "options";

export interface SurfaceSwitcherProps {
  surface: ShowcaseSurface;
  onSurfaceChange: (next: ShowcaseSurface) => void;
  narrow: boolean;
  onNarrowChange: (next: boolean) => void;
  className?: string;
}

/**
 * The visitor's control strip.
 *
 * Sticky, because the mock below it is tall and the controls have to stay
 * reachable while you scroll through the surfaces.
 */
export function SurfaceSwitcher({
  surface,
  onSurfaceChange,
  narrow,
  onNarrowChange,
  className,
}: SurfaceSwitcherProps) {
  return (
    <div
      className={cn(
        "sticky top-3 z-30 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-border px-3 py-2.5 shadow-soft surface-glass",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <Logo size={18} />
        <span className="text-[13px] font-semibold tracking-tight">Try a surface</span>
      </span>

      <Segmented<ShowcaseSurface>
        size="md"
        ariaLabel="Which surface to show"
        value={surface}
        onChange={onSurfaceChange}
        options={[
          {
            value: "popup",
            label: (
              <>
                <MousePointerClick className="size-3.5" />
                Popup
              </>
            ),
          },
          {
            value: "sidepanel",
            label: (
              <>
                <PanelRight className="size-3.5" />
                Side panel
              </>
            ),
          },
          {
            value: "options",
            label: (
              <>
                <Settings className="size-3.5" />
                Settings
              </>
            ),
          },
        ]}
      />

      <div className="ml-auto flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <Smartphone aria-hidden className="size-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Narrow</span>
          <Switch
            hideLabel
            label="Narrow 360px viewport"
            checked={narrow}
            onChange={onNarrowChange}
          />
        </label>
        <ThemeToggle />
      </div>
    </div>
  );
}
