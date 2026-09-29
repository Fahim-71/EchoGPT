"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { Archive, MessageSquarePlus, Pin, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TopBar } from "@/components/layout/TopBar";
import { EmptyState } from "@/components/chat/EmptyState";
import { HistoryFilters } from "@/components/history/HistoryFilters";
import type { HistoryScope } from "@/components/history/HistoryFilters";
import { HistoryItem } from "@/components/history/HistoryItem";
import {
  SAMPLE_CONVERSATIONS,
  conversationTime,
  type Conversation,
} from "@/data/sampleConversations";
import { DATE_GROUP_ORDER, dateGroup, fuzzyScore } from "@/lib/format";
import { PROMPT_STARTERS } from "@/data/promptStarters";

/**
 * Searchable history.
 *
 * Replaces "Empty Chat History" with three distinct empty states: nothing yet,
 * nothing matching the search, and nothing in this scope — each with a way out.
 */
export function HistoryList() {
  const [conversations, setConversations] = useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<HistoryScope>("all");
  const [modelFilter, setModelFilter] = useState<string | null>(null);

  const availableModelIds = useMemo(
    () => Array.from(new Set(conversations.map((c) => c.modelId))),
    [conversations],
  );

  const filtered = useMemo(() => {
    let list = conversations;
    if (scope === "pinned") list = list.filter((c) => c.pinned);
    else if (scope === "archived") list = list.filter((c) => c.archived);
    else list = list.filter((c) => !c.archived);

    if (modelFilter) list = list.filter((c) => c.modelId === modelFilter);

    if (query.trim()) {
      list = list
        .map((c) => ({
          c,
          score: fuzzyScore(`${c.title} ${c.preview} ${c.tags.join(" ")}`, query),
        }))
        .filter((entry) => entry.score >= 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.c);
    }
    return list;
  }, [conversations, scope, modelFilter, query]);

  /** Grouped by recency, except while searching where relevance order wins. */
  const groups = useMemo(() => {
    if (query.trim()) return [["Best matches", filtered] as const];
    const map = new Map<string, Conversation[]>();
    for (const conversation of filtered) {
      const key = dateGroup(conversationTime(conversation.hoursAgo));
      const bucket = map.get(key);
      if (bucket) bucket.push(conversation);
      else map.set(key, [conversation]);
    }
    return [...map.entries()].sort(
      (a, b) =>
        DATE_GROUP_ORDER.indexOf(a[0] as (typeof DATE_GROUP_ORDER)[number]) -
        DATE_GROUP_ORDER.indexOf(b[0] as (typeof DATE_GROUP_ORDER)[number]),
    );
  }, [filtered, query]);

  function mutate(id: string, patch: Partial<Conversation>) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  const hasAny = conversations.length > 0;
  const isSearching = query.trim().length > 0;

  return (
    <>
      <TopBar
        title="Chat history"
        subtitle="Everything you have asked, across every model"
        actions={
          <Link
            href="/"
            className="hidden h-8 items-center gap-1.5 rounded-sm bg-primary px-3 text-xs font-medium text-primary-foreground shadow-soft transition-colors hover:bg-brand-700 dark:hover:bg-brand-400 sm:inline-flex"
          >
            <MessageSquarePlus aria-hidden className="size-3.5" />
            New chat
          </Link>
        }
      >
        <HistoryFilters
          query={query}
          onQueryChange={setQuery}
          scope={scope}
          onScopeChange={setScope}
          modelFilter={modelFilter}
          onModelFilterChange={setModelFilter}
          availableModelIds={availableModelIds}
          resultCount={filtered.length}
        />
      </TopBar>

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-3 py-4 sm:px-4">
          {filtered.length === 0 ? (
            !hasAny ? (
              <EmptyState
                icon={MessageSquarePlus}
                title="No conversations yet"
                description="Once you start chatting, every conversation lands here — searchable, filterable by model, and pinnable."
                actions={
                  <Link
                    href="/"
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-brand-700 dark:hover:bg-brand-400"
                  >
                    <MessageSquarePlus aria-hidden className="size-4" />
                    Start your first chat
                  </Link>
                }
              >
                <div className="rounded-md border border-border bg-surface p-3 text-left">
                  <p className="mb-2 text-xs font-semibold text-foreground">Try one of these</p>
                  <ul className="space-y-1.5">
                    {PROMPT_STARTERS.slice(0, 3).map((starter) => (
                      <li key={starter.id}>
                        <Link
                          href="/"
                          className="block truncate rounded-sm px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                        >
                          {starter.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </EmptyState>
            ) : isSearching ? (
              <EmptyState
                icon={SearchX}
                title={`Nothing matches “${query}”`}
                description="Try a shorter term, or clear the model and scope filters — one of them may be hiding the conversation you want."
                actions={
                  <>
                    <Button onClick={() => setQuery("")}>Clear search</Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setQuery("");
                        setScope("all");
                        setModelFilter(null);
                      }}
                    >
                      Reset all filters
                    </Button>
                  </>
                }
              />
            ) : (
              <EmptyState
                icon={scope === "pinned" ? Pin : Archive}
                title={scope === "pinned" ? "Nothing pinned yet" : "Nothing archived"}
                description={
                  scope === "pinned"
                    ? "Pin a conversation from its row and it will stay at the top of this list, whatever else you ask."
                    : "Archived conversations stay searchable but drop out of the main list. Nothing has been archived yet."
                }
                actions={<Button onClick={() => setScope("all")}>Show all conversations</Button>}
              />
            )
          ) : (
            groups.map(([label, items]) => (
              <section key={label} className="mb-5 last:mb-0">
                <h2 className="sticky top-0 z-10 bg-background/90 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
                  {label}
                </h2>
                <ul className="space-y-2">
                  <AnimatePresence initial={false}>
                    {items.map((conversation) => (
                      <HistoryItem
                        key={conversation.id}
                        conversation={conversation}
                        highlight={query}
                        onTogglePin={() => mutate(conversation.id, { pinned: !conversation.pinned })}
                        onToggleArchive={() =>
                          mutate(conversation.id, { archived: !conversation.archived })
                        }
                        onDelete={() =>
                          setConversations((prev) => prev.filter((c) => c.id !== conversation.id))
                        }
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              </section>
            ))
          )}
        </div>
      </div>
    </>
  );
}
