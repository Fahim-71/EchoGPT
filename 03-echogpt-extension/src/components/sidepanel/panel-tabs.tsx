"use client";

import { motion } from "framer-motion";
import { Columns2, History, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type PanelTab = "chat" | "history" | "compare";

const TABS: Array<{ id: PanelTab; label: string; icon: typeof MessageSquare }> = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "history", label: "History", icon: History },
  { id: "compare", label: "Compare", icon: Columns2 },
];

export interface PanelTabsProps {
  value: PanelTab;
  onChange: (next: PanelTab) => void;
  /** Count shown on the History tab. */
  historyCount?: number;
  className?: string;
}

/**
 * Three tabs, because three things happen in this panel and they need
 * different layouts: a conversation, a list, and a side-by-side. A real
 * `role="tablist"` so arrow keys move between them.
 */
export function PanelTabs({
  value,
  onChange,
  historyCount,
  className,
}: PanelTabsProps) {
  function onKeyDown(event: React.KeyboardEvent) {
    const delta =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const index = TABS.findIndex((t) => t.id === value);
    onChange(TABS[(index + delta + TABS.length) % TABS.length].id);
  }

  return (
    <div
      role="tablist"
      aria-label="Side panel sections"
      onKeyDown={onKeyDown}
      className={cn("flex items-stretch border-b border-border bg-surface", className)}
    >
      {TABS.map((tab) => {
        const active = tab.id === value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-1.5 py-2 text-[12px] font-medium transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon aria-hidden className="size-3.5" />
            {tab.label}
            {tab.id === "history" && historyCount !== undefined && (
              <span className="rounded-full bg-surface-3 px-1.5 text-[10px] font-semibold text-muted-foreground">
                {historyCount}
              </span>
            )}
            {active && (
              <motion.span
                layoutId="panel-tab-underline"
                aria-hidden
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
