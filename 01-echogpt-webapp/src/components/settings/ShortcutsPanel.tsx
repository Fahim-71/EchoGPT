"use client";

import { Kbd } from "@/components/ui/Kbd";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { useSettings } from "@/hooks/useSettings";

interface Shortcut {
  keys: string[];
  action: string;
}

const GROUPS: { title: string; description: string; shortcuts: Shortcut[] }[] = [
  {
    title: "Global",
    description: "Work anywhere in the workspace.",
    shortcuts: [
      { keys: ["Mod", "K"], action: "Open the command palette" },
      { keys: ["/"], action: "Open the palette in search mode" },
      { keys: ["Mod", ","], action: "Open settings" },
      { keys: ["Esc"], action: "Close any overlay" },
    ],
  },
  {
    title: "Composer",
    description: "While the message field has focus.",
    shortcuts: [
      { keys: ["Shift", "Enter"], action: "Insert a newline" },
      { keys: ["/"], action: "Show slash commands" },
    ],
  },
  {
    title: "Lists and menus",
    description: "Inside the palette, the model picker and every popover.",
    shortcuts: [
      { keys: ["↑", "↓"], action: "Move between options" },
      { keys: ["Enter"], action: "Choose the highlighted option" },
      { keys: ["Home"], action: "Jump to the first option" },
      { keys: ["End"], action: "Jump to the last option" },
      { keys: ["Tab"], action: "Move focus, trapped inside dialogs" },
    ],
  },
];

/**
 * The shortcut reference the live app has no equivalent of — every binding in
 * the build, in one place, rather than hidden until discovered.
 */
export function ShortcutsPanel() {
  const { settings } = useSettings();

  const sendKeys = settings.sendBehaviour === "enter" ? ["Enter"] : ["Mod", "Enter"];

  return (
    <div className="space-y-4">
      <SettingsSection
        title="Send"
        description="Configured on the General tab; shown here so the reference stays accurate."
      >
        <Row keys={sendKeys} action="Send the message" />
      </SettingsSection>

      {GROUPS.map((group) => (
        <SettingsSection key={group.title} title={group.title} description={group.description}>
          <div className="space-y-2.5">
            {group.shortcuts.map((shortcut) => (
              <Row key={shortcut.action} keys={shortcut.keys} action={shortcut.action} />
            ))}
          </div>
        </SettingsSection>
      ))}

      <p className="px-1 text-xs text-muted-foreground">
        Key caps above already match your platform. Shortcuts are fixed in this build; remapping
        would be a natural next step.
      </p>
    </div>
  );
}

function Row({ keys, action }: Shortcut) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-foreground">{action}</span>
      <Kbd keys={keys} size="sm" />
    </div>
  );
}
