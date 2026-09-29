"use client";

import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  Check,
  Copy,
  Highlighter,
  Quote,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Badge, Dot } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { RichText } from "@/components/sidepanel/rich-text";
import type { ChatMessage } from "@/hooks/useChat";
import { getModel } from "@/lib/models";
import { cn } from "@/lib/utils";

export interface MessageBubbleProps {
  message: ChatMessage;
  onRegenerate: (id: string) => void;
  onInsert: (text: string) => void;
  /** Disables destructive actions while another reply is streaming. */
  busy: boolean;
}

export function MessageBubble({
  message,
  onRegenerate,
  onInsert,
  busy,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const model = getModel(message.modelId);
  const isUser = message.role === "user";

  async function copy() {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch {
      /* clipboard blocked (no user gesture, or insecure context) */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="flex flex-col items-end gap-1"
      >
        {message.attachment && (
          <span className="flex max-w-[85%] items-center gap-1 rounded-sm border border-accent-500/30 bg-accent-500/10 px-1.5 py-0.5 text-[10px] text-accent-600 dark:text-accent-400">
            <Highlighter aria-hidden className="size-2.5 shrink-0" />
            <span className="truncate">“{message.attachment}”</span>
          </span>
        )}
        <div className="max-w-[88%] rounded-lg rounded-br-xs bg-brand-500/12 px-3 py-2 text-[13px] leading-relaxed text-foreground">
          {message.content}
        </div>
        {message.usedPageContext && (
          <span className="text-[10px] text-muted-foreground">
            Sent with page context
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="group/msg flex flex-col gap-1.5"
    >
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Dot color={model.accent} pulse={message.streaming} className="size-1.5" />
        <span className="font-medium text-foreground/80">{model.name}</span>
        <span aria-hidden>·</span>
        <span>{model.vendor}</span>
        {message.streaming && (
          <span className="ml-1 text-brand-500">generating…</span>
        )}
        {message.stopped && <span className="ml-1 text-warning">stopped</span>}
      </div>

      <div className="rounded-lg rounded-tl-xs border border-border bg-surface px-3 py-2.5">
        {message.content ? (
          <RichText content={message.content} caret={message.streaming} />
        ) : (
          <span className="flex items-center gap-1" aria-label="Thinking">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="size-1.5 rounded-full bg-muted-foreground"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.16 }}
              />
            ))}
          </span>
        )}

        {message.sources && message.sources.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1 border-t border-border pt-2">
            <span className="text-[10px] text-muted-foreground">Cited from page:</span>
            {message.sources.map((source) => (
              <Tooltip key={source.label} content={source.detail}>
                <Badge micro tone="brand" className="cursor-help">
                  <Quote aria-hidden className="size-2" />
                  {source.label}
                </Badge>
              </Tooltip>
            ))}
          </div>
        )}
      </div>

      {/* Per-message actions. Always in the DOM for keyboard users; fades in on hover. */}
      {!message.streaming && message.content && (
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover/msg:opacity-100">
          <IconButton size="xs" label={copied ? "Copied" : "Copy reply"} onClick={copy}>
            {copied ? <Check className="text-success" /> : <Copy />}
          </IconButton>
          <IconButton
            size="xs"
            label="Insert into the page"
            onClick={() => onInsert(message.content)}
          >
            <ArrowDownToLine />
          </IconButton>
          <IconButton
            size="xs"
            label="Regenerate"
            disabled={busy}
            onClick={() => onRegenerate(message.id)}
          >
            <RefreshCw />
          </IconButton>
          <span
            className={cn(
              "ml-1 text-[10px] text-muted-foreground",
              copied ? "opacity-100" : "opacity-0",
            )}
          >
            Copied
          </span>
        </div>
      )}
    </motion.div>
  );
}
