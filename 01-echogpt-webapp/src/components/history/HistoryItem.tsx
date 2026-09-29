"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Archive, ArchiveRestore, MessageSquare, Pin, PinOff, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Conversation } from "@/data/sampleConversations";
import { conversationTime } from "@/data/sampleConversations";
import { getModel } from "@/lib/models";
import { pluralize, relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface HistoryItemProps {
  conversation: Conversation;
  onTogglePin: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  /** Search term, highlighted in the title. */
  highlight?: string;
}

function Highlighted({ text, term }: { text: string; term?: string }) {
  if (!term?.trim()) return <>{text}</>;
  const index = text.toLowerCase().indexOf(term.toLowerCase().trim());
  if (index === -1) return <>{text}</>;
  const end = index + term.trim().length;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-[2px] bg-brand-200 px-0.5 text-brand-900 dark:bg-brand-800 dark:text-brand-100">
        {text.slice(index, end)}
      </mark>
      {text.slice(end)}
    </>
  );
}

export function HistoryItem({
  conversation,
  onTogglePin,
  onToggleArchive,
  onDelete,
  highlight,
}: HistoryItemProps) {
  const model = getModel(conversation.modelId);
  const reduce = useReducedMotion();
  const iso = conversationTime(conversation.hoursAgo);

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative rounded-md border border-border bg-surface transition-colors hover:border-border-strong hover:bg-surface-2",
        conversation.archived && "opacity-75",
      )}
    >
      <Link href="/" className="block p-3 pr-2">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-sm"
            style={{ backgroundColor: `${model.accent}1f`, color: model.accent }}
          >
            <MessageSquare className="size-3.5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {conversation.pinned ? (
                <Pin aria-hidden className="size-3 shrink-0 text-primary" />
              ) : null}
              <h3 className="min-w-0 truncate text-sm font-medium text-foreground">
                <Highlighted text={conversation.title} term={highlight} />
              </h3>
            </div>

            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {conversation.preview}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge tone="neutral" dot={model.accent}>
                {model.name}
              </Badge>
              <span className="text-[0.6875rem] text-muted-foreground">
                {pluralize(conversation.messageCount, "message")}
              </span>
              <span aria-hidden className="text-muted-foreground">
                ·
              </span>
              <time
                dateTime={iso}
                suppressHydrationWarning
                className="text-[0.6875rem] text-muted-foreground"
              >
                {relativeTime(iso)}
              </time>
              {conversation.tags.map((tag) => (
                <Badge key={tag} tone="neutral">
                  {tag}
                </Badge>
              ))}
              {conversation.archived ? <Badge tone="warning">Archived</Badge> : null}
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
        <Tooltip content={conversation.pinned ? "Unpin" : "Pin"}>
          <IconButton
            label={conversation.pinned ? `Unpin ${conversation.title}` : `Pin ${conversation.title}`}
            icon={conversation.pinned ? <PinOff /> : <Pin />}
            variant="subtle"
            onClick={onTogglePin}
          />
        </Tooltip>
        <Tooltip content={conversation.archived ? "Restore" : "Archive"}>
          <IconButton
            label={
              conversation.archived
                ? `Restore ${conversation.title}`
                : `Archive ${conversation.title}`
            }
            icon={conversation.archived ? <ArchiveRestore /> : <Archive />}
            variant="subtle"
            onClick={onToggleArchive}
          />
        </Tooltip>
        <Tooltip content="Delete">
          <IconButton
            label={`Delete ${conversation.title}`}
            icon={<Trash2 />}
            variant="subtle"
            onClick={onDelete}
            className="hover:text-danger"
          />
        </Tooltip>
      </div>
    </motion.li>
  );
}
