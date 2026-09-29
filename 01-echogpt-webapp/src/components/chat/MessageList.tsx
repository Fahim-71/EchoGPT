"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageBubble } from "@/components/chat/MessageBubble";
import type { ChatMessage, ChatStatus } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export interface MessageListProps {
  messages: ChatMessage[];
  status: ChatStatus;
  onRegenerate: (id: string) => void;
  onEditSubmit: (id: string, content: string) => void;
  onVote: (id: string, value: "up" | "down") => void;
  className?: string;
}

/**
 * Status announcer.
 *
 * Kept separate from the transcript and mounted for the whole session: a live
 * region has to exist before its content changes, or the first announcement is
 * silently dropped. It also spares screen readers a reading per streamed token.
 */
export function ChatStatusAnnouncer({
  status,
  lastRole,
}: {
  status: ChatStatus;
  lastRole?: "user" | "assistant";
}) {
  const text =
    status === "thinking"
      ? "Generating a response"
      : status === "streaming"
        ? "Response in progress"
        : lastRole === "assistant"
          ? "Response complete"
          : "";

  return (
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {text}
    </p>
  );
}

/**
 * Scrolling transcript.
 *
 * Auto-scroll only follows the stream while the user is already near the
 * bottom, so scrolling up to re-read something is not fought by every token.
 */
export function MessageList({
  messages,
  status,
  onRegenerate,
  onEditSubmit,
  onVote,
  className,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true);
  const lastId = messages[messages.length - 1]?.id;
  const streamingId = status !== "idle" ? lastId : undefined;

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    function onScroll() {
      if (!node) return;
      pinnedRef.current = node.scrollHeight - node.scrollTop - node.clientHeight < 120;
    }
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!pinnedRef.current) return;
    const node = scrollRef.current;
    node?.scrollTo({ top: node.scrollHeight, behavior: "auto" });
  });

  return (
    <div
      ref={scrollRef}
      className={cn("scrollbar-thin min-h-0 flex-1 overflow-y-auto", className)}
    >
      <div
        className="mx-auto w-full max-w-4xl space-y-6 px-3 py-6 sm:px-6"
        aria-live="polite"
        aria-relevant="additions text"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              streaming={message.id === streamingId && status === "streaming"}
              pending={message.id === streamingId && status === "thinking"}
              busy={status !== "idle"}
              onRegenerate={() => onRegenerate(message.id)}
              onEditSubmit={(content) => onEditSubmit(message.id, content)}
              onVote={(value) => onVote(message.id, value)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
