"use client";

import { Segmented } from "@/components/ui/Segmented";
import { Switch } from "@/components/ui/Switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingRow, SettingsSection } from "@/components/settings/SettingsSection";
import { FONT_SCALE_CLASS, useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

export function AppearancePanel() {
  const { settings, update } = useSettings();

  return (
    <div className="space-y-4">
      <SettingsSection
        title="Theme"
        description="System follows your operating system and switches with it."
      >
        <ThemeToggle />
      </SettingsSection>

      <SettingsSection title="Layout" description="Density and type size for the transcript.">
        <SettingRow
          label="Density"
          description="Compact tightens vertical spacing throughout."
          control={
            <Segmented
              value={settings.density}
              onChange={(value) => update("density", value)}
              label="Layout density"
              size="sm"
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
            />
          }
        />

        <SettingRow
          label="Text size"
          description="Applies to message content, not the interface chrome."
          control={
            <Segmented
              value={settings.fontScale}
              onChange={(value) => update("fontScale", value)}
              label="Text size"
              size="sm"
              options={[
                { value: "sm", label: "Small" },
                { value: "md", label: "Default" },
                { value: "lg", label: "Large" },
              ]}
            />
          }
        />

        <div className="rounded-md border border-border bg-surface-2 p-3">
          <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Preview
          </p>
          <p
            className={cn(
              "leading-relaxed text-foreground",
              FONT_SCALE_CLASS[settings.fontScale],
              settings.density === "compact" ? "py-0.5" : "py-2",
            )}
          >
            The quick brown fox jumps over the lazy dog — and then explains, at some length, exactly
            why it bothered.
          </p>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Motion"
        description="Your operating system's reduce-motion setting is always respected; this adds an in-app override."
      >
        <Switch
          label="Reduce interface motion"
          description="Disables entrance animations and the sidebar slide."
          checked={settings.reduceMotion}
          onCheckedChange={(value) => update("reduceMotion", value)}
        />
      </SettingsSection>
    </div>
  );
}
