"use client";

import { Archive, Pin, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { MODELS } from "@/lib/models";
import { cn } from "@/lib/utils";

export type HistoryScope = "all" | "pinned" | "archived";

export interface HistoryFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  scope: HistoryScope;
  onScopeChange: (scope: HistoryScope) => void;
  modelFilter: string | null;
  onModelFilterChange: (modelId: string | null) => void;
  /** Model ids that actually appear in the data, so no chip leads nowhere. */
  availableModelIds: string[];
  resultCount: number;
}

const SCOPES: { value: HistoryScope; label: string; icon?: typeof Pin }[] = [
  { value: "all", label: "All" },
  { value: "pinned", label: "Pinned", icon: Pin },
  { value: "archived", label: "Archived", icon: Archive },
];

/** Search, scope and model chips — the filtering the live "All" pill only implies. */
export function HistoryFilters({
  query,
  onQueryChange,
  scope,
  onScopeChange,
  modelFilter,
  onModelFilterChange,
  availableModelIds,
  resultCount,
}: HistoryFiltersProps) {
  const models = MODELS.filter((m) => availableModelIds.includes(m.id));

  return (
    <div className="space-y-2.5 border-t border-border px-3 py-3 sm:px-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <label htmlFor="history-search" className="sr-only">
            Search conversations
          </label>
          <input
            id="history-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search titles, previews and tags…"
            className="h-9 w-full rounded-md border border-border bg-input pl-9 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-border-strong"
          />
          {query ? (
            <span className="absolute right-1 top-1/2 -translate-y-1/2">
              <IconButton label="Clear search" icon={<X />} onClick={() => onQueryChange("")} />
            </span>
          ) : null}
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {resultCount} result{resultCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {SCOPES.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={scope === item.value}
            onClick={() => onScopeChange(item.value)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors",
              scope === item.value
                ? "border-transparent bg-foreground text-background"
                : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {item.icon ? <item.icon aria-hidden className="size-3" /> : null}
            {item.label}
          </button>
        ))}

        <span aria-hidden className="mx-1 h-4 w-px bg-border" />

        <button
          type="button"
          aria-pressed={modelFilter === null}
          onClick={() => onModelFilterChange(null)}
          className={cn(
            "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium transition-colors",
            modelFilter === null
              ? "border-transparent bg-surface-3 text-foreground"
              : "border-border bg-surface text-muted-foreground hover:text-foreground",
          )}
        >
          Any model
        </button>
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            aria-pressed={modelFilter === model.id}
            onClick={() => onModelFilterChange(modelFilter === model.id ? null : model.id)}
            className={cn(
              "rounded-full transition-opacity",
              modelFilter && modelFilter !== model.id && "opacity-55 hover:opacity-100",
            )}
          >
            <Badge
              tone={modelFilter === model.id ? "brand" : "neutral"}
              dot={model.accent}
              className="h-7 px-2.5"
            >
              {model.name}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
