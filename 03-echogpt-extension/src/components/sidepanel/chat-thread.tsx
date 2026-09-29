"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/sidepanel/message-bubble";
import { EmptyState } from "@/components/ui/empty-state";
import { Kbd } from "@/components/ui/kbd";
import type { QuickAction } from "@/data/quickActions";
import type { ChatMessage } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export interface ChatThreadProps {
  messages: ChatMessage[];
  busy: boolean;
  onRegenerate: (id: string) => void;
  onInsert: (text: string) => void;
  /** Suggestions shown in the empty state, drawn from the enabled actions. */
  suggestions: QuickAction[];
  onSuggestion: (action: QuickAction) => void;
  /** Appearance → Density. Trims the thread's padding and gaps. */
  compact?: boolean;
  className?: string;
}

export function ChatThread({
  messages,
  busy,
  onRegenerate,
  onInsert,
  suggestions,
  onSuggestion,
  compact,
  className,
}: ChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Stop auto-scrolling once the user scrolls up to read something.
  const pinnedRef = useRef(true);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pinnedRef.current) {
      endRef.current?.scrollIntoView({ block: "end" });
    }
  }, [messages]);

  return (
    <div
      ref={scrollerRef}
      className={cn("scrollbar-thin flex-1 overflow-y-auto", className)}
    >
      {messages.length === 0 ? (
        <div className="flex h-full flex-col justify-center">
          <EmptyState
            icon={Sparkles}
            title="Ask about this page, or anything else"
            description="Nothing is sent until you send it. Page context is off by default on private hosts."
          />
          <div className="space-y-1.5 px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Try
            </p>
            {suggestions.slice(0, 3).map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => onSuggestion(action)}
                  className="flex w-full items-center gap-2 rounded-sm border border-border bg-surface px-2.5 py-2 text-left text-[12px] transition-colors hover:border-brand-400 hover:bg-surface-2"
                >
                  <Icon
                    aria-hidden
                    className="size-3.5 shrink-0"
                    style={{ color: action.accent }}
                  />
                  <span className="min-w-0 flex-1 truncate">{action.label}</span>
                  <code className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {action.slash}
                  </code>
                </button>
              );
            })}
            <p className="pt-1 text-center text-[10px] text-muted-foreground">
              Type <Kbd keys={["/"]} /> in the composer for all commands
            </p>
          </div>
        </div>
      ) : (
        <div className={cn("px-3 py-3", compact ? "space-y-2.5" : "space-y-4")}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              busy={busy}
              onRegenerate={onRegenerate}
              onInsert={onInsert}
            />
          ))}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
