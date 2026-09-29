"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Brain, ChevronRight, CircleStop } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { MessageActions } from "@/components/chat/MessageActions";
import { StreamingCursor, ThinkingDots } from "@/components/chat/StreamingCursor";
import type { ChatMessage } from "@/hooks/useChat";
import { getModel } from "@/lib/models";
import { formatClock } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  message: ChatMessage;
  /** The last assistant message while the stream is still running. */
  streaming?: boolean;
  /** True before the first token has arrived. */
  pending?: boolean;
  busy?: boolean;
  onRegenerate?: () => void;
  onEditSubmit?: (content: string) => void;
  onVote?: (value: "up" | "down") => void;
}

export function MessageBubble({
  message,
  streaming,
  pending,
  busy,
  onRegenerate,
  onEditSubmit,
  onVote,
}: MessageBubbleProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [traceOpen, setTraceOpen] = useState(false);
  const reduce = useReducedMotion();
  const isUser = message.role === "user";
  const model = getModel(message.modelId);

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      aria-label={isUser ? "Your message" : `${model.name} response`}
      className={cn("group flex gap-3 px-1", isUser && "flex-row-reverse")}
    >
      <span className="mt-0.5 shrink-0">
        {isUser ? (
          <Avatar initials="YO" background="linear-gradient(135deg,#64748b,#334155)" size="sm" />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-sm border border-border bg-surface">
            <Logo markOnly className="[&_svg]:size-5" />
          </span>
        )}
      </span>

      <div className={cn("min-w-0 max-w-[min(46rem,100%)] flex-1", isUser && "flex flex-col items-end")}>
        <div className={cn("mb-1 flex items-center gap-2", isUser && "flex-row-reverse")}>
          <span className="text-xs font-semibold text-foreground">
            {isUser ? "You" : model.name}
          </span>
          {!isUser ? (
            <Badge tone="neutral" dot={model.accent}>
              {model.vendor}
            </Badge>
          ) : null}
          <time
            dateTime={message.createdAt}
            suppressHydrationWarning
            className="text-[0.6875rem] text-muted-foreground"
          >
            {formatClock(message.createdAt)}
          </time>
        </div>

        {/* Reasoning models expose their scratchpad; everything else does not. */}
        {!isUser && message.reasoning ? (
          <div className="mb-2 w-full overflow-hidden rounded-md border border-border bg-surface-2">
            <button
              type="button"
              onClick={() => setTraceOpen((v) => !v)}
              aria-expanded={traceOpen}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Brain aria-hidden className="size-3.5" />
              Thought for {message.thinkingSeconds ?? 4}s
              <ChevronRight
                aria-hidden
                className={cn("ml-auto size-3.5 transition-transform", traceOpen && "rotate-90")}
              />
            </button>
            {traceOpen ? (
              <p className="whitespace-pre-wrap border-t border-border px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                {message.reasoning}
              </p>
            ) : null}
          </div>
        ) : null}

        {editing ? (
          <div className="w-full rounded-md border border-border-strong bg-surface p-2">
            <label htmlFor={`edit-${message.id}`} className="sr-only">
              Edit your message
            </label>
            <textarea
              id={`edit-${message.id}`}
              autoFocus
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="scrollbar-thin w-full resize-y bg-transparent text-sm text-foreground outline-none"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setDraft(message.content);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  onEditSubmit?.(draft);
                  setEditing(false);
                }}
              >
                Send
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "w-fit max-w-full rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
              isUser
                ? "rounded-tr-xs bg-primary text-primary-foreground"
                : "rounded-tl-xs border border-border bg-surface text-foreground",
            )}
          >
            {pending && !message.content ? (
              <ThinkingDots label={model.tier === "reasoning" ? "Thinking" : "Generating"} />
            ) : (
              <div className="space-y-3 whitespace-pre-wrap break-words">
                {message.content}
                {streaming ? <StreamingCursor /> : null}
              </div>
            )}
            {message.stopped ? (
              <p className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 text-[0.6875rem] text-muted-foreground">
                <CircleStop aria-hidden className="size-3" />
                Stopped by you
              </p>
            ) : null}
          </div>
        )}

        {!editing && !pending ? (
          <MessageActions
            message={message}
            disabled={busy}
            onRegenerate={onRegenerate}
            onEdit={isUser ? () => setEditing(true) : undefined}
            onVote={onVote}
            className={cn("mt-1", isUser && "flex-row-reverse")}
          />
        ) : null}
      </div>
    </motion.article>
  );
}
