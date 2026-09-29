"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Dot } from "@/components/ui/badge";
import { Meter, costWord, speedFill, speedWord } from "@/components/ui/meter";
import { Popover } from "@/components/ui/popover";
import {
  CAPABILITY_LABEL,
  MODELS,
  TIER_LABEL,
  getModel,
  type AIModel,
  type ModelTier,
} from "@/lib/models";
import { cn } from "@/lib/utils";

export interface ModelPickerProps {
  value: string;
  onChange: (id: string) => void;
  /** Ids the user has enabled in Settings. Defaults to all. */
  available?: string[];
  side?: "top" | "bottom";
  align?: "start" | "end";
  /** Compact trigger for the popup header vs. full trigger in the composer. */
  variant?: "chip" | "inline";
  className?: string;
}

const TIER_ORDER: ModelTier[] = ["fast", "balanced", "reasoning", "creative"];

/**
 * The model switcher.
 *
 * Problem 3 in the audit: the shipping extension lets you change model but
 * tells you nothing about the trade-off. Every row here answers "why would I
 * pick this one" — vendor, one-line blurb, what it can do, how fast, how
 * expensive, how much context, and whether it costs anything.
 */
export function ModelPicker({
  value,
  onChange,
  available,
  side = "top",
  align = "start",
  variant = "inline",
  className,
}: ModelPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = getModel(value);

  const groups = useMemo(() => {
    const pool = MODELS.filter(
      (m) => !available || available.includes(m.id),
    ).filter((m) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.vendor.toLowerCase().includes(q) ||
        m.blurb.toLowerCase().includes(q)
      );
    });
    return TIER_ORDER.map((tier) => ({
      tier,
      models: pool.filter((m) => m.tier === tier),
    })).filter((g) => g.models.length > 0);
  }, [available, query]);

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      side={side}
      align={align}
      className={className}
      panelClassName="w-[336px] overflow-hidden"
      trigger={
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "inline-flex max-w-full items-center gap-1.5 font-medium transition-colors",
            variant === "chip"
              ? "h-7 rounded-full border border-border bg-surface-2 pl-2 pr-1.5 text-[11px] hover:border-brand-400"
              : "h-7 rounded-sm px-1.5 text-xs text-muted-foreground hover:bg-surface-2 hover:text-foreground",
          )}
        >
          <Dot color={selected.accent} />
          <span className="truncate">{selected.name}</span>
          <ChevronsUpDown aria-hidden className="size-3 shrink-0 opacity-60" />
        </button>
      }
    >
      <div className="border-b border-border p-2">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models"
            aria-label="Search models"
            className="h-8 w-full rounded-sm border border-border bg-input pl-7 pr-2 text-xs outline-none placeholder:text-muted-foreground focus:border-brand-400"
          />
        </div>
      </div>

      <div role="listbox" aria-label="Model" className="scrollbar-thin max-h-[330px] overflow-y-auto p-1">
        {groups.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No model matches “{query}”.
          </p>
        )}
        {groups.map((group) => (
          <div key={group.tier}>
            <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {TIER_LABEL[group.tier]}
            </p>
            {group.models.map((model) => (
              <ModelRow
                key={model.id}
                model={model}
                selected={model.id === value}
                onSelect={() => {
                  onChange(model.id);
                  setOpen(false);
                  setQuery("");
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </Popover>
  );
}

function ModelRow({
  model,
  selected,
  onSelect,
}: {
  model: AIModel;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "w-full rounded-sm px-2 py-2 text-left transition-colors",
        selected ? "bg-brand-500/10" : "hover:bg-surface-2",
      )}
    >
      <div className="flex items-center gap-2">
        <Dot color={model.accent} />
        <span className="truncate text-[13px] font-semibold text-foreground">
          {model.name}
        </span>
        <span className="truncate text-[11px] text-muted-foreground">
          {model.vendor}
        </span>
        {model.free && (
          <Badge tone="success" micro className="ml-auto">
            Free
          </Badge>
        )}
        {selected && (
          <Check
            aria-hidden
            className={cn("size-3.5 text-brand-600 dark:text-brand-300", !model.free && "ml-auto")}
          />
        )}
      </div>

      <p className="mt-0.5 pl-4 text-[11px] leading-snug text-muted-foreground">
        {model.blurb}
      </p>

      <div className="mt-1.5 flex flex-wrap gap-1 pl-4">
        {model.capabilities.map((cap) => (
          <Badge key={cap} micro>
            {CAPABILITY_LABEL[cap]}
          </Badge>
        ))}
        <Badge micro tone="brand">
          {model.contextK >= 1000 ? "1M" : `${model.contextK}K`} context
        </Badge>
      </div>

      <div className="mt-1.5 space-y-1 pl-4">
        <Meter
          label="Speed"
          value={speedFill(model.latency)}
          valueLabel={speedWord(model.latency)}
        />
        <Meter
          label="Cost"
          value={model.cost}
          valueLabel={costWord(model.cost)}
          inverse
        />
      </div>
    </button>
  );
}
