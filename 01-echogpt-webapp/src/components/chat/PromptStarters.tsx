"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  PROMPT_STARTERS,
  STARTER_CATEGORIES,
  type StarterCategory,
} from "@/data/promptStarters";
import { cn } from "@/lib/utils";

export interface PromptStartersProps {
  onPick: (prompt: string) => void;
  className?: string;
}

type Filter = StarterCategory | "all";

/**
 * Filterable one-line starters.
 *
 * The live app's four cards are each a paragraph, so you have to read all of
 * them to choose one. Here the label is the whole card, categories filter the
 * grid, and the long prompt only appears once it is in the composer.
 */
export function PromptStarters({ onPick, className }: PromptStartersProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();

  const visible =
    filter === "all"
      ? PROMPT_STARTERS.slice(0, 8)
      : PROMPT_STARTERS.filter((s) => s.category === filter);

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-label="Filter prompt starters"
        className="mb-3 flex flex-wrap items-center justify-center gap-1.5"
      >
        <StarterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All"
        />
        {STARTER_CATEGORIES.map((category) => (
          <StarterChip
            key={category.id}
            active={filter === category.id}
            onClick={() => setFilter(category.id)}
            label={category.label}
            accent={category.accent}
            icon={<category.icon aria-hidden className="size-3.5" />}
          />
        ))}
      </div>

      <motion.div layout={!reduce} className="grid gap-2 sm:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((starter) => {
            const meta = STARTER_CATEGORIES.find((c) => c.id === starter.category)!;
            const Icon = meta.icon;
            return (
              <motion.button
                key={starter.id}
                layout={!reduce}
                type="button"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onPick(starter.prompt)}
                className="group flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5 text-left transition-colors hover:border-border-strong hover:bg-surface-2"
              >
                <span
                  aria-hidden
                  className="flex size-7 shrink-0 items-center justify-center rounded-sm"
                  style={{ backgroundColor: `${meta.accent}1f`, color: meta.accent }}
                >
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {starter.label}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

interface StarterChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
  accent?: string;
  icon?: React.ReactNode;
}

function StarterChip({ active, onClick, label, accent, icon }: StarterChipProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors",
        active
          ? "border-transparent bg-foreground text-background"
          : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
      style={active && accent ? { backgroundColor: accent, color: "#fff" } : undefined}
    >
      {icon}
      {label}
    </button>
  );
}
