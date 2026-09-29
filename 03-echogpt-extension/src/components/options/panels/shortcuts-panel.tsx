"use client";

import { ExternalLink } from "lucide-react";
import { SettingCard } from "@/components/options/section";
import { Kbd } from "@/components/ui/kbd";
import { QUICK_ACTIONS } from "@/data/quickActions";
import { getChrome } from "@/lib/env";

interface Shortcut {
  keys: string[];
  label: string;
  detail: string;
}

/** Registered in manifest.json — Chrome owns these and the user can rebind them. */
const GLOBAL: Shortcut[] = [
  {
    keys: ["mod", "Shift", "E"],
    label: "Open the EchoGPT popup",
    detail: "Works on any tab. The original extension's only shortcut.",
  },
  {
    keys: ["mod", "Shift", "S"],
    label: "Open the side panel directly",
    detail: "Skips the launcher when you already know you want a conversation.",
  },
];

/** Handled by the surfaces themselves. */
const IN_PANEL: Shortcut[] = [
  { keys: ["mod", "K"], label: "Focus the composer", detail: "From anywhere in the panel." },
  { keys: ["mod", "Shift", "N"], label: "New conversation", detail: "Clears the thread." },
  { keys: ["/"], label: "Open the command menu", detail: "In an empty composer." },
  { keys: ["Enter"], label: "Send", detail: "Shift+Enter inserts a newline." },
  { keys: ["Esc"], label: "Close menus", detail: "Model picker, command menu, popovers." },
  { keys: ["↑", "↓"], label: "Move through commands", detail: "Tab or Enter accepts one." },
];

/**
 * Audit item 6. One global chord cannot address six actions and eight models,
 * so this page separates what Chrome owns (rebindable, global) from what the
 * surfaces own (in-panel), and lists the slash command for every action.
 */
export function ShortcutsPanel() {
  const canOpenChromeShortcuts = Boolean(getChrome()?.tabs?.create);

  return (
    <div className="space-y-4">
      <SettingCard
        title="Browser shortcuts"
        description="Chrome owns these. Rebind them at chrome://extensions/shortcuts."
      >
        <ul className="space-y-0">
          {GLOBAL.map((s) => (
            <Row key={s.label} shortcut={s} />
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            const c = getChrome();
            if (c?.tabs?.create) c.tabs.create({ url: "chrome://extensions/shortcuts" });
          }}
          disabled={!canOpenChromeShortcuts}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline disabled:cursor-default disabled:text-muted-foreground disabled:no-underline dark:text-brand-300"
        >
          <ExternalLink aria-hidden className="size-3" />
          {canOpenChromeShortcuts
            ? "Open Chrome's shortcut settings"
            : "Available when running as an installed extension"}
        </button>
      </SettingCard>

      <SettingCard
        title="Inside the side panel"
        description="Handled by EchoGPT itself, so they work the moment the panel has focus."
      >
        <ul className="space-y-0">
          {IN_PANEL.map((s) => (
            <Row key={s.label} shortcut={s} />
          ))}
        </ul>
      </SettingCard>

      <SettingCard
        title="Slash commands"
        description="Every quick action is also a command. Type the first few letters and press Tab."
      >
        <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {QUICK_ACTIONS.map((action) => (
            <li key={action.id} className="flex items-center gap-2">
              <code className="rounded-xs border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                {action.slash}
              </code>
              <span className="truncate text-xs text-muted-foreground">
                {action.label}
              </span>
            </li>
          ))}
        </ul>
      </SettingCard>
    </div>
  );
}

function Row({ shortcut }: { shortcut: Shortcut }) {
  return (
    <li className="flex items-start justify-between gap-4 border-t border-border py-2.5 first:border-t-0 first:pt-0">
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-foreground">
          {shortcut.label}
        </span>
        <span className="block text-xs text-muted-foreground">{shortcut.detail}</span>
      </span>
      <Kbd keys={shortcut.keys} className="shrink-0 pt-0.5" />
    </li>
  );
}
