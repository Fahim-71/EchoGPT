"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { AccountPanel } from "@/components/options/panels/account-panel";
import { AdvancedPanel } from "@/components/options/panels/advanced-panel";
import { AppearancePanel } from "@/components/options/panels/appearance-panel";
import { ModelsPanel } from "@/components/options/panels/models-panel";
import { PrivacyPanel } from "@/components/options/panels/privacy-panel";
import { QuickActionsPanel } from "@/components/options/panels/quick-actions-panel";
import { ShortcutsPanel } from "@/components/options/panels/shortcuts-panel";
import { OptionsNav } from "@/components/options/options-nav";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { OPTIONS_NAV, type OptionsSectionId } from "@/data/optionsNav";
import { SETTINGS_SAVED_EVENT } from "@/hooks/useChromeStorage";
import { isExtension } from "@/lib/env";
import { cn } from "@/lib/utils";

const PANELS: Record<OptionsSectionId, () => React.ReactElement> = {
  account: AccountPanel,
  models: ModelsPanel,
  "quick-actions": QuickActionsPanel,
  appearance: AppearancePanel,
  shortcuts: ShortcutsPanel,
  privacy: PrivacyPanel,
  advanced: AdvancedPanel,
};

export interface OptionsShellProps {
  /** Starting section — the showcase uses it to deep-link to Advanced. */
  initialSection?: OptionsSectionId;
  /** Renders without the outer page padding, for the showcase mock. */
  embedded?: boolean;
  className?: string;
}

/**
 * The settings page.
 *
 * Everything persists through `useChromeStorage`, so a change made here is
 * visible in an open popup or side panel without a reload — the saved chip
 * confirms the write actually happened rather than just the click.
 */
export function OptionsShell({
  initialSection = "account",
  embedded,
  className,
}: OptionsShellProps) {
  const [section, setSection] = useState<OptionsSectionId>(initialSection);
  const [saved, setSaved] = useState(false);
  const meta = OPTIONS_NAV.find((s) => s.id === section)!;
  const Panel = PANELS[section];

  useEffect(() => setSection(initialSection), [initialSection]);

  // Settings save as you change them, so there is no Save button to confirm.
  // `useChromeStorage` emits this event after each successful write, which is
  // the only signal that fires for a write made in *this* tab — the browser's
  // own `storage` event is cross-tab only.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function onSaved() {
      setSaved(true);
      clearTimeout(timer);
      timer = setTimeout(() => setSaved(false), 1600);
    }
    window.addEventListener(SETTINGS_SAVED_EVENT, onSaved);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(SETTINGS_SAVED_EVENT, onSaved);
    };
  }, []);

  return (
    <div
      className={cn(
        "min-h-full bg-background-subtle text-foreground",
        embedded && "h-full overflow-hidden",
        className,
      )}
    >
      <header className="sticky top-0 z-20 border-b border-border surface-glass">
        <div className="mx-auto flex max-w-5xl items-center gap-2.5 px-5 py-3">
          <Logo size={22} />
          <span className="text-sm font-semibold tracking-tight">EchoGPT</span>
          <span className="text-sm text-muted-foreground">Settings</span>
          {!isExtension() && (
            <Badge micro tone="accent" className="ml-1">
              Web demo
            </Badge>
          )}
          {saved && (
            <Badge micro tone="success" className="ml-auto">
              <Check aria-hidden className="size-2.5" />
              Saved
            </Badge>
          )}
        </div>
      </header>

      <div
        className={cn(
          "mx-auto flex max-w-5xl gap-6 px-5 py-6",
          embedded && "h-[calc(100%-53px)] overflow-hidden py-4",
        )}
      >
        <aside className={cn("w-[184px] shrink-0", embedded && "overflow-y-auto")}>
          <div className="sticky top-[69px]">
            <OptionsNav value={section} onChange={setSection} />
          </div>
        </aside>

        <main
          className={cn(
            "min-w-0 flex-1 pb-12",
            embedded && "scrollbar-thin overflow-y-auto pb-4",
          )}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">{meta.label}</h2>
            <p className="mt-0.5 max-w-[62ch] text-[13px] leading-relaxed text-muted-foreground">
              {meta.description}
            </p>
          </div>
          <Panel />
        </main>
      </div>
    </div>
  );
}
