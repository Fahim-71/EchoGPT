"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUp, Mic, Paperclip, Plug, Slash, Square } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Kbd } from "@/components/ui/Kbd";
import { Tooltip } from "@/components/ui/Tooltip";
import { ModelPicker } from "@/components/chat/ModelPicker";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";
import { estimateTokens, formatTokens } from "@/lib/format";
import { getModel } from "@/lib/models";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

const SLASH_COMMANDS = [
  { command: "/summarise", hint: "Condense a long passage" },
  { command: "/explain", hint: "Break something down step by step" },
  { command: "/rewrite", hint: "Rework text in a different register" },
  { command: "/code", hint: "Ask for an implementation" },
];

export interface ComposerProps {
  modelId: string;
  onModelChange: (id: string) => void;
  onSend: (text: string) => void;
  onStop: () => void;
  busy: boolean;
  /** Seeded from a prompt starter or the compare board. */
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Composer.
 *
 * Everything the live version hides is surfaced: which model will answer and
 * what it costs, how to send versus newline, how much of the context window the
 * draft uses, and what slash commands exist.
 */
export function Composer({
  modelId,
  onModelChange,
  onSend,
  onStop,
  busy,
  value,
  onValueChange,
  placeholder = "Ask anything, or press / for commands…",
  className,
  autoFocus,
}: ComposerProps) {
  const [internal, setInternal] = useState("");
  const text = value ?? internal;
  const setText = onValueChange ?? setInternal;
  const { ref } = useAutosizeTextarea(text);
  const { settings } = useSettings();
  const model = getModel(modelId);

  const tokens = useMemo(() => estimateTokens(text), [text]);
  const limit = model.contextK * 1000;
  const ratio = tokens / limit;
  const nearLimit = ratio > 0.8;
  const overLimit = ratio >= 1;

  const showSlash = text.startsWith("/") && !text.includes(" ");
  const matchingCommands = SLASH_COMMANDS.filter((c) => c.command.startsWith(text.toLowerCase()));

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus, ref]);

  function submit() {
    if (busy || !text.trim() || overLimit) return;
    onSend(text);
    setText("");
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const modEnter = event.key === "Enter" && (event.metaKey || event.ctrlKey);
    const plainEnter = event.key === "Enter" && !event.shiftKey && !event.metaKey && !event.ctrlKey;

    if (settings.sendBehaviour === "enter" ? plainEnter : modEnter) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className={cn("relative", className)}>
      {showSlash && matchingCommands.length > 0 ? (
        <div className="absolute bottom-full left-0 mb-2 w-full max-w-sm overflow-hidden rounded-md border border-border bg-surface shadow-lift">
          <p className="border-b border-border px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Commands
          </p>
          {matchingCommands.map((command) => (
            <button
              key={command.command}
              type="button"
              onClick={() => {
                setText(`${command.command} `);
                ref.current?.focus();
              }}
              className="flex w-full items-baseline gap-2 px-3 py-2 text-left transition-colors hover:bg-surface-2"
            >
              <span className="font-mono text-xs font-medium text-primary">{command.command}</span>
              <span className="text-xs text-muted-foreground">{command.hint}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          "rounded-xl border bg-surface p-2 shadow-lift transition-colors",
          overLimit ? "border-danger" : "border-border focus-within:border-border-strong",
        )}
      >
        <div className="flex items-end gap-2">
          <Tooltip content="Attach a file" hint="Demo build — files are not uploaded" side="top">
            <IconButton label="Attach a file" icon={<Paperclip />} size="md" />
          </Tooltip>

          <label htmlFor="composer-input" className="sr-only">
            Message {model.name}
          </label>
          <textarea
            id="composer-input"
            ref={ref}
            rows={1}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-describedby="composer-hints"
            className="scrollbar-thin max-h-52 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
          />

          <Tooltip content="Voice input" hint="Demo build — no microphone access" side="top">
            <IconButton label="Start voice input" icon={<Mic />} size="md" />
          </Tooltip>

          {busy ? (
            <Tooltip content="Stop generating" side="top">
              <IconButton
                label="Stop generating"
                icon={<Square className="fill-current" />}
                variant="solid"
                size="md"
                onClick={onStop}
              />
            </Tooltip>
          ) : (
            <IconButton
              label="Send message"
              icon={<ArrowUp />}
              variant="primary"
              size="md"
              disabled={!text.trim() || overLimit}
              onClick={submit}
              className="rounded-full"
            />
          )}
        </div>

        <div
          id="composer-hints"
          className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border px-1 pt-2"
        >
          <ModelPicker value={modelId} onChange={onModelChange} side="top" align="start" />

          <Tooltip content="Connectors" hint="Demo build — no services linked" side="top">
            <IconButton label="Manage connectors" icon={<Plug />} variant="subtle" />
          </Tooltip>

          <span className="hidden items-center gap-1.5 text-[0.6875rem] text-muted-foreground sm:flex">
            <Kbd keys={settings.sendBehaviour === "enter" ? ["Enter"] : ["Mod", "Enter"]} /> send
            <Kbd keys={["Shift", "Enter"]} className="ml-1.5" /> newline
          </span>

          <span className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1 text-[0.6875rem] text-muted-foreground md:flex">
              <Slash aria-hidden className="size-3" />
              commands
            </span>
            {settings.showTokenCounter ? (
              <span
                className={cn(
                  "font-mono text-[0.6875rem] tabular-nums",
                  overLimit
                    ? "text-danger"
                    : nearLimit
                      ? "text-warning"
                      : "text-muted-foreground",
                )}
                title={`${tokens} of ~${limit} tokens in ${model.name}'s context window`}
              >
                {formatTokens(tokens)} / {formatTokens(limit)}
              </span>
            ) : null}
          </span>
        </div>
      </div>

      {overLimit ? (
        <p role="alert" className="mt-1.5 px-1 text-xs text-danger">
          This draft exceeds {model.name}'s {formatTokens(limit)}-token context window. Shorten it
          or switch to a model with more room.
        </p>
      ) : null}
    </div>
  );
}
