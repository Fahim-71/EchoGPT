"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Popover } from "@/components/ui/Popover";
import { COST_LABEL, Meter, SPEED_LABEL, speedScore } from "@/components/ui/Meter";
import { CAPABILITY_LABEL, MODELS, TIER_LABEL, getModel } from "@/lib/models";
import type { AIModel, ModelTier } from "@/lib/models";
import { formatContext, fuzzyFilter } from "@/lib/format";
import { cn } from "@/lib/utils";

const TIER_ORDER: ModelTier[] = ["fast", "balanced", "reasoning", "creative"];

export interface ModelPickerProps {
  value: string;
  onChange: (modelId: string) => void;
  /** `pill` sits in the composer; `compact` sits in a compare column header. */
  variant?: "pill" | "compact";
  align?: "start" | "end";
  side?: "top" | "bottom";
  className?: string;
  label?: string;
}

/**
 * The fix for the unlabelled model pill.
 *
 * Every row states what the model is for, how fast it is, what it costs and
 * whether it is free — the four things the live composer's tiny chevron hides.
 * Arrow keys move, Enter selects, Escape closes.
 */
export function ModelPicker({
  value,
  onChange,
  variant = "pill",
  align = "start",
  side = "top",
  className,
  label = "Model",
}: ModelPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const selected = getModel(value);

  const results = useMemo(
    () =>
      fuzzyFilter(
        MODELS,
        query,
        (m) => `${m.name} ${m.vendor} ${m.blurb} ${TIER_LABEL[m.tier]} ${m.capabilities.join(" ")}`,
      ),
    [query],
  );

  const grouped = useMemo(() => {
    return TIER_ORDER.map((tier) => [tier, results.filter((m) => m.tier === tier)] as const).filter(
      ([, items]) => items.length > 0,
    );
  }, [results]);

  const flat = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    setActiveIndex(Math.max(0, MODELS.findIndex((m) => m.id === value)));
  }, [open, value]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function choose(model: AIModel) {
    onChange(model.id);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const model = flat[activeIndex];
      if (model) choose(model);
    }
  }

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={`${label}: ${selected.name}. Change model`}
      className={cn(
        "group flex items-center gap-2 rounded-md border border-border bg-surface-2 transition-colors hover:border-border-strong hover:bg-surface-3",
        variant === "pill" ? "h-9 pl-2.5 pr-2" : "h-8 w-full pl-2 pr-1.5",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-2.5 shrink-0 rounded-full ring-2 ring-inset ring-white/25"
        style={{ backgroundColor: selected.accent }}
      />
      <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground">
        {selected.name}
      </span>
      {variant === "pill" ? (
        <span className="hidden text-[0.6875rem] text-muted-foreground sm:inline">
          {selected.vendor}
        </span>
      ) : null}
      <ChevronDown
        aria-hidden
        className={cn(
          "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
          open && "rotate-180",
        )}
      />
    </button>
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      align={align}
      side={side}
      label="Choose a model"
      className="w-[min(23rem,calc(100vw-2rem))]"
    >
      <div onKeyDown={onKeyDown}>
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search models, vendors, capabilities…"
            aria-label="Search models"
            role="combobox"
            aria-expanded
            aria-controls="model-list"
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div
          ref={listRef}
          id="model-list"
          role="listbox"
          aria-label="Models"
          className="scrollbar-thin max-h-[22rem] overflow-y-auto p-1.5"
        >
          {flat.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No model matches “{query}”.
            </p>
          ) : (
            grouped.map(([tier, items]) => (
              <div key={tier} className="mb-1 last:mb-0">
                <p className="px-2 pb-1 pt-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  {TIER_LABEL[tier]}
                </p>
                {items.map((model) => {
                  const index = flat.indexOf(model);
                  const active = index === activeIndex;
                  const isSelected = model.id === value;
                  return (
                    <div
                      key={model.id}
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => choose(model)}
                      className={cn(
                        "cursor-pointer rounded-sm px-2 py-2 transition-colors",
                        active && "bg-surface-2",
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          aria-hidden
                          className="mt-1.5 size-2.5 shrink-0 rounded-full ring-2 ring-inset ring-white/25"
                          style={{ backgroundColor: model.accent }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-foreground">
                              {model.name}
                            </span>
                            <span className="shrink-0 text-[0.6875rem] text-muted-foreground">
                              {model.vendor}
                            </span>
                            {model.free ? (
                              <Badge tone="success" className="shrink-0">
                                Free
                              </Badge>
                            ) : null}
                            {isSelected ? (
                              <Check aria-hidden className="ml-auto size-4 shrink-0 text-primary" />
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                            {model.blurb}
                          </p>

                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            {model.capabilities.map((capability) => (
                              <Badge key={capability} tone="neutral">
                                {CAPABILITY_LABEL[capability]}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <Meter
                              label={`${model.name} speed`}
                              value={speedScore(model.latency)}
                              valueLabel={SPEED_LABEL[model.latency]}
                              tone="accent"
                            />
                            <Meter
                              label={`${model.name} cost`}
                              value={model.cost}
                              valueLabel={COST_LABEL[model.cost]}
                              tone="warning"
                            />
                            <span className="text-[0.6875rem] text-muted-foreground">
                              {formatContext(model.contextK)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <p className="flex items-center gap-1.5 border-t border-border bg-surface-2 px-3 py-2 text-[0.6875rem] text-muted-foreground">
          <Sparkles aria-hidden className="size-3" />
          Speed and cost are relative ratings, not billing figures.
        </p>
      </div>
    </Popover>
  );
}
