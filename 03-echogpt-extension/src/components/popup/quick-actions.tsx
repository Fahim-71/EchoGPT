"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { QuickAction } from "@/data/quickActions";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface QuickActionsProps {
  actions: QuickAction[];
  onRun: (action: QuickAction) => void;
  /** True when nothing is selected on the page — selection actions go dim. */
  hasSelection: boolean;
  /** False while chrome.storage.sync is still returning the user's order. */
  ready?: boolean;
  className?: string;
}

/**
 * The popup's centre of gravity.
 *
 * Audit item 1: this grid is what the user sees first, before any account
 * exists, because these six actions are the product's actual value. Audit item
 * 4: the same six actions are also on the selection tooltip and the right-click
 * menu, so the user meets them wherever their attention already is.
 */
export function QuickActions({
  actions,
  onRun,
  hasSelection,
  ready = true,
  className,
}: QuickActionsProps) {
  return (
    <section className={cn("px-3", className)} aria-labelledby="qa-heading">
      <div className="mb-1.5 flex items-baseline justify-between">
        <h2
          id="qa-heading"
          className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Quick actions
        </h2>
        <span className="text-[10px] text-muted-foreground">
          No account needed
        </span>
      </div>

      {/* `chrome.storage.sync` has no synchronous read, so a real popup opens
          before it knows the user's action order. Six placeholders hold the
          exact final layout — the grid never jumps once the values land. */}
      {!ready ? (
        <div className="grid grid-cols-2 gap-1.5" aria-hidden>
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-[52px] rounded-md" />
          ))}
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-1.5">
        {actions.map((action, index) => {
          const needsSelection = action.scope === "selection";
          const blocked = needsSelection && !hasSelection;
          const Icon = action.icon;

          const tile = (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 * index, duration: 0.18 }}
              onClick={() => !blocked && onRun(action)}
              aria-disabled={blocked}
              className={cn(
                "group relative w-full overflow-hidden rounded-md border px-2.5 py-2 text-left transition-all",
                blocked
                  ? "cursor-not-allowed border-border bg-surface-2/50 opacity-55"
                  : "border-border bg-surface-2 hover:-translate-y-px hover:border-border-strong hover:bg-surface-3 hover:shadow-soft",
              )}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${action.accent}, transparent)`,
                }}
              />
              {/* Icon and label share a line so the whole grid stays inside the
                  600px popup without scrolling — a launcher that needs a scroll
                  to reach its own recent list has stopped being a launcher. */}
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="flex size-5 shrink-0 items-center justify-center rounded-xs"
                  style={{
                    backgroundColor: `${action.accent}1f`,
                    color: action.accent,
                  }}
                >
                  <Icon className="size-3" />
                </span>
                <span className="truncate text-[12px] font-medium leading-tight text-foreground">
                  {action.label}
                </span>
              </span>
              <span className="mt-1 flex items-center gap-1 text-[10px] leading-tight text-muted-foreground">
                {blocked && <Lock aria-hidden className="size-2.5 shrink-0" />}
                <span className="truncate">
                  {blocked ? "Select text first" : action.hint}
                </span>
              </span>
            </motion.button>
          );

          return (
            <Tooltip
              key={action.id}
              side="bottom"
              className="w-full"
              content={
                blocked
                  ? "Highlight text on the page, then run this from here or from the selection tooltip."
                  : `${action.prompt} — also on ${action.slash}`
              }
            >
              {tile}
            </Tooltip>
          );
        })}
      </div>
      )}
    </section>
  );
}
