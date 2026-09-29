"use client";

import { ArrowRight, MessageSquare, Pin } from "lucide-react";
import { Dot } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SiteFavicon } from "@/components/ui/logo";
import type { SampleThread } from "@/data/sampleThreads";
import { getModel } from "@/lib/models";
import { cn } from "@/lib/utils";

export interface RecentThreadsProps {
  threads: SampleThread[];
  onOpen: (thread: SampleThread) => void;
  onSeeAll: () => void;
  className?: string;
}

/**
 * Audit item 5: the shipping extension shows no history at all, so work done
 * on a page yesterday is unrecoverable. Three threads is the right number for a
 * launcher — enough to recognise one, few enough not to become a list to read.
 * Each carries the favicon of the page it started on, because that is how
 * people actually remember a conversation.
 */
export function RecentThreads({
  threads,
  onOpen,
  onSeeAll,
  className,
}: RecentThreadsProps) {
  return (
    <section className={cn("px-3", className)} aria-labelledby="rt-heading">
      <div className="mb-1.5 flex items-baseline justify-between">
        <h2
          id="rt-heading"
          className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Recent
        </h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="inline-flex items-center gap-0.5 text-[10px] font-medium text-brand-600 hover:underline dark:text-brand-300"
        >
          All threads
          <ArrowRight aria-hidden className="size-2.5" />
        </button>
      </div>

      {threads.length === 0 ? (
        <EmptyState
          compact
          icon={MessageSquare}
          title="No conversations yet"
          description="Run a quick action above and it will show up here, tied to the page it started on."
        />
      ) : (
        <ul className="space-y-0.5">
          {threads.map((thread) => {
            const model = getModel(thread.modelId);
            return (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => onOpen(thread)}
                  className="group flex w-full items-center gap-2 rounded-sm border border-transparent px-2 py-1 text-left transition-colors hover:border-border hover:bg-surface-2"
                >
                  <SiteFavicon host={thread.host} hue={thread.hue} size={18} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1">
                      <span className="truncate text-[12px] font-medium text-foreground">
                        {thread.title}
                      </span>
                      {thread.pinned && (
                        <Pin
                          aria-label="Pinned"
                          className="size-2.5 shrink-0 text-brand-500"
                        />
                      )}
                    </span>
                    <span className="mt-px flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Dot color={model.accent} className="size-1.5" />
                      <span className="truncate">{model.name}</span>
                      <span aria-hidden>·</span>
                      <span className="shrink-0">{thread.messageCount} msgs</span>
                      <span aria-hidden>·</span>
                      <span className="shrink-0">{thread.when}</span>
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
