"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Pencil, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Tooltip } from "@/components/ui/Tooltip";
import type { ChatMessage } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export interface MessageActionsProps {
  message: ChatMessage;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onVote?: (value: "up" | "down") => void;
  /** Hidden until the bubble is hovered or anything inside it is focused. */
  className?: string;
  disabled?: boolean;
}

/**
 * Per-message controls. The live app has none of these — once a reply lands
 * there is nothing you can do with it.
 */
export function MessageActions({
  message,
  onRegenerate,
  onEdit,
  onVote,
  className,
  disabled,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
    } catch {
      // Clipboard can be blocked by permissions; fail quietly rather than
      // claiming a copy that did not happen.
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 transition-opacity duration-150",
        "opacity-0 focus-within:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100",
        "max-sm:opacity-100",
        className,
      )}
    >
      <Tooltip content={copied ? "Copied" : "Copy"}>
        <IconButton
          label={copied ? "Copied to clipboard" : "Copy message"}
          icon={copied ? <Check className="text-success" /> : <Copy />}
          size="xs"
          onClick={copy}
        />
      </Tooltip>

      {isUser && onEdit ? (
        <Tooltip content="Edit & resend">
          <IconButton
            label="Edit and resend message"
            icon={<Pencil />}
            size="xs"
            onClick={onEdit}
            disabled={disabled}
          />
        </Tooltip>
      ) : null}

      {!isUser && onRegenerate ? (
        <Tooltip content="Regenerate">
          <IconButton
            label="Regenerate response"
            icon={<RefreshCw />}
            size="xs"
            onClick={onRegenerate}
            disabled={disabled}
          />
        </Tooltip>
      ) : null}

      {!isUser && onVote ? (
        <>
          <Tooltip content="Good response">
            <IconButton
              label="Rate this response as good"
              icon={<ThumbsUp />}
              size="xs"
              active={message.vote === "up"}
              aria-pressed={message.vote === "up"}
              onClick={() => onVote("up")}
            />
          </Tooltip>
          <Tooltip content="Needs work">
            <IconButton
              label="Rate this response as poor"
              icon={<ThumbsDown />}
              size="xs"
              active={message.vote === "down"}
              aria-pressed={message.vote === "down"}
              onClick={() => onVote("down")}
            />
          </Tooltip>
        </>
      ) : null}
    </div>
  );
}
