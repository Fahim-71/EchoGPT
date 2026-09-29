"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Cpu, Keyboard, Palette, Shield, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { GeneralPanel } from "@/components/settings/GeneralPanel";
import { ModelsPanel } from "@/components/settings/ModelsPanel";
import { AppearancePanel } from "@/components/settings/AppearancePanel";
import { ShortcutsPanel } from "@/components/settings/ShortcutsPanel";
import { PrivacyPanel } from "@/components/settings/PrivacyPanel";
import { cn } from "@/lib/utils";

type TabId = "general" | "models" | "appearance" | "shortcuts" | "privacy";

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "general", label: "General", icon: SlidersHorizontal },
  { id: "models", label: "Models", icon: Cpu },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
  { id: "privacy", label: "Privacy", icon: Shield },
];

/** ARIA tab list with roving focus and arrow-key movement. */
export function SettingsTabs() {
  const [tab, setTab] = useState<TabId>("general");
  const listRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  function onKeyDown(event: React.KeyboardEvent) {
    const index = TABS.findIndex((t) => t.id === tab);
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;

    event.preventDefault();
    setTab(TABS[next].id);
    listRef.current?.querySelector<HTMLElement>(`#tab-${TABS[next].id}`)?.focus();
  }

  return (
    <>
      <TopBar title="Settings" subtitle="Preferences are saved to this browser as you change them" />

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-6">
          <div
            ref={listRef}
            role="tablist"
            aria-label="Settings sections"
            onKeyDown={onKeyDown}
            className="scrollbar-thin mb-5 flex gap-1 overflow-x-auto rounded-md border border-border bg-surface-2 p-1"
          >
            {TABS.map((item) => {
              const selected = item.id === tab;
              return (
                <button
                  key={item.id}
                  id={`tab-${item.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "relative inline-flex h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 text-sm font-medium transition-colors",
                    selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {selected ? (
                    <motion.span
                      aria-hidden
                      layoutId="settings-tab"
                      transition={
                        reduce ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 38 }
                      }
                      className="absolute inset-0 rounded-sm bg-surface shadow-soft ring-1 ring-border"
                    />
                  ) : null}
                  <item.icon aria-hidden className="relative size-4" />
                  <span className="relative hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              id={`panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              tabIndex={0}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pb-10 outline-none"
            >
              {tab === "general" ? <GeneralPanel /> : null}
              {tab === "models" ? <ModelsPanel /> : null}
              {tab === "appearance" ? <AppearancePanel /> : null}
              {tab === "shortcuts" ? <ShortcutsPanel /> : null}
              {tab === "privacy" ? <PrivacyPanel /> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
