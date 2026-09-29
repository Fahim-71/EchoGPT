"use client";

import { History, Pin, PinOff, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Dot } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SiteFavicon } from "@/components/ui/logo";
import { Segmented } from "@/components/ui/segmented";
import { SAMPLE_THREADS, type SampleThread } from "@/data/sampleThreads";
import { getModel } from "@/lib/models";
import { cn } from "@/lib/utils";

type Filter = "all" | "page" | "pinned";

export interface HistoryTabProps {
  /** Host of the current page, for the "This page" filter. */
  currentHost: string;
  onOpen: (thread: SampleThread) => void;
  className?: string;
}

/**
 * Audit item 5, in full.
 *
 * Threads are keyed to the page they started on, which makes two things
 * possible that the shipping extension cannot do: come back to an article and
 * resume the conversation about it, and pin the two or three threads that are
 * actually live work.
 */
export function HistoryTab({ currentHost, onOpen, className }: HistoryTabProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pins, setPins] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SAMPLE_THREADS.map((t) => [t.id, t.pinned])),
  );
  const [removed, setRemoved] = useState<string[]>([]);

  const threads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_THREADS.filter((t) => !removed.includes(t.id))
      .filter((t) =>
        filter === "pinned"
          ? pins[t.id]
          : filter === "page"
            ? t.host === currentHost
            : true,
      )
      .filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.preview.toLowerCase().includes(q) ||
          t.host.toLowerCase().includes(q),
      )
      .sort((a, b) => Number(pins[b.id] ?? 0) - Number(pins[a.id] ?? 0));
  }, [query, filter, pins, removed, currentHost]);

  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden", className)}>
      <div className="space-y-2 border-b border-border px-3 py-2.5">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            aria-label="Search conversations"
            className="h-8 w-full rounded-sm border border-border bg-input pl-7 pr-2 text-xs outline-none placeholder:text-muted-foreground focus:border-brand-400"
          />
        </div>
        <Segmented<Filter>
          block
          ariaLabel="Filter conversations"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "page", label: "This page" },
            { value: "pinned", label: "Pinned" },
          ]}
        />
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <EmptyState
            icon={History}
            title="Nothing here yet"
            description={
              filter === "page"
                ? `No conversation has started on ${currentHost}. Run a quick action to begin one.`
                : "Pin a conversation to keep it at the top of this list."
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {threads.map((thread) => {
              const model = getModel(thread.modelId);
              const pinned = pins[thread.id];
              return (
                <li key={thread.id} className="group/row">
                  <div className="flex items-start gap-2 px-3 py-2.5 transition-colors hover:bg-surface-2">
                    <SiteFavicon host={thread.host} hue={thread.hue} size={20} />
                    <button
                      type="button"
                      onClick={() => onOpen(thread)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="flex items-center gap-1">
                        <span className="truncate text-[12px] font-medium text-foreground">
                          {thread.title}
                        </span>
                        {pinned && (
                          <Pin aria-label="Pinned" className="size-2.5 shrink-0 text-brand-500" />
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] leading-snug text-muted-foreground">
                        {thread.preview}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Dot color={model.accent} className="size-1.5" />
                        <span className="truncate">{model.name}</span>
                        <span aria-hidden>·</span>
                        <span className="truncate">{thread.host.replace(/^www\./, "")}</span>
                        <span aria-hidden>·</span>
                        <span className="shrink-0">{thread.when}</span>
                      </span>
                    </button>
                    <span className="flex shrink-0 flex-col gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover/row:opacity-100">
                      <IconButton
                        size="xs"
                        label={pinned ? "Unpin conversation" : "Pin conversation"}
                        onClick={() =>
                          setPins((p) => ({ ...p, [thread.id]: !p[thread.id] }))
                        }
                      >
                        {pinned ? <PinOff /> : <Pin />}
                      </IconButton>
                      <IconButton
                        size="xs"
                        label="Delete conversation"
                        onClick={() => setRemoved((r) => [...r, thread.id])}
                      >
                        <Trash2 />
                      </IconButton>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
