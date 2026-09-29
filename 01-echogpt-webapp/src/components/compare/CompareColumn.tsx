"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Square, Trophy, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Tooltip } from "@/components/ui/Tooltip";
import { COST_LABEL, Meter, SPEED_LABEL, speedScore } from "@/components/ui/Meter";
import { ModelPicker } from "@/components/chat/ModelPicker";
import { StreamingCursor, ThinkingDots } from "@/components/chat/StreamingCursor";
import { getModel } from "@/lib/models";
import { formatContext } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ColumnStatus = "idle" | "thinking" | "streaming" | "done" | "stopped";

export interface CompareColumnState {
  key: string;
  modelId: string;
  content: string;
  status: ColumnStatus;
  /** Milliseconds from send to last token — the honest per-model timing. */
  elapsedMs: number | null;
}

export interface CompareColumnProps {
  column: CompareColumnState;
  isWinner: boolean;
  canRemove: boolean;
  onModelChange: (modelId: string) => void;
  onPinWinner: () => void;
  onRemove: () => void;
  onStop: () => void;
}

/** One model's lane. Each streams on its own clock, independent of its siblings. */
export function CompareColumn({
  column,
  isWinner,
  canRemove,
  onModelChange,
  onPinWinner,
  onRemove,
  onStop,
}: CompareColumnProps) {
  const model = getModel(column.modelId);
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const running = column.status === "thinking" || column.status === "streaming";

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    const node = bodyRef.current;
    if (node && column.status === "streaming") node.scrollTop = node.scrollHeight;
  }, [column.content, column.status]);

  return (
    <section
      aria-label={`${model.name} response`}
      className={cn(
        "flex min-h-0 w-[min(22rem,84vw)] shrink-0 flex-col overflow-hidden rounded-lg border bg-surface transition-colors lg:w-auto lg:flex-1",
        isWinner ? "border-primary shadow-lift" : "border-border",
      )}
    >
      <header className="shrink-0 border-b border-border p-2.5">
        <div className="flex items-center gap-1.5">
          <div className="min-w-0 flex-1">
            <ModelPicker
              value={column.modelId}
              onChange={onModelChange}
              variant="compact"
              side="bottom"
              align="start"
              label="Column model"
            />
          </div>
          <Tooltip content={isWinner ? "Unpin winner" : "Pin as winner"}>
            <IconButton
              label={isWinner ? `Unpin ${model.name} as winner` : `Pin ${model.name} as winner`}
              icon={<Trophy />}
              active={isWinner}
              aria-pressed={isWinner}
              onClick={onPinWinner}
            />
          </Tooltip>
          {canRemove ? (
            <Tooltip content="Remove column">
              <IconButton label={`Remove ${model.name} column`} icon={<X />} onClick={onRemove} />
            </Tooltip>
          ) : null}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Meter
            label={`${model.name} speed`}
            value={speedScore(model.latency)}
            valueLabel={SPEED_LABEL[model.latency]}
            tone="accent"
          />
          <Meter
            label={`${model.name} cost`}
            value={model.cost}
            valueLabel={COST_LABEL[model.cost]}
            tone="warning"
          />
          <span className="text-[0.6875rem] text-muted-foreground">
            {formatContext(model.contextK)}
          </span>
          {model.free ? <Badge tone="success">Free</Badge> : null}
        </div>
      </header>

      <div
        ref={bodyRef}
        className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-3 text-sm leading-relaxed"
      >
        {column.status === "idle" ? (
          <p className="py-8 text-center text-xs text-muted-foreground">
            Waiting for a prompt. Send one below and every column answers at once.
          </p>
        ) : column.status === "thinking" ? (
          <ThinkingDots label={model.tier === "reasoning" ? "Thinking" : "Generating"} />
        ) : (
          <div className="whitespace-pre-wrap break-words text-foreground">
            {column.content}
            {column.status === "streaming" ? <StreamingCursor /> : null}
          </div>
        )}
      </div>

      <footer className="flex shrink-0 items-center gap-2 border-t border-border bg-surface-2 px-2.5 py-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[0.6875rem]",
            running ? "text-accent-600 dark:text-accent-400" : "text-muted-foreground",
          )}
        >
          {running ? (
            <span aria-hidden className="size-1.5 rounded-full bg-accent-500 animate-caret" />
          ) : null}
          {column.status === "done"
            ? `Finished in ${((column.elapsedMs ?? 0) / 1000).toFixed(1)}s`
            : column.status === "stopped"
              ? "Stopped"
              : running
                ? "Streaming…"
                : "Idle"}
        </span>

        <span className="ml-auto flex items-center gap-0.5">
          {running ? (
            <Tooltip content="Stop this column">
              <IconButton
                label={`Stop ${model.name}`}
                icon={<Square className="fill-current" />}
                size="xs"
                onClick={onStop}
              />
            </Tooltip>
          ) : null}
          <Tooltip content={copied ? "Copied" : "Copy answer"}>
            <IconButton
              label={`Copy ${model.name} answer`}
              icon={copied ? <Check className="text-success" /> : <Copy />}
              size="xs"
              disabled={!column.content}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(column.content);
                  setCopied(true);
                } catch {
                  /* clipboard may be blocked */
                }
              }}
            />
          </Tooltip>
        </span>
      </footer>
    </section>
  );
}
