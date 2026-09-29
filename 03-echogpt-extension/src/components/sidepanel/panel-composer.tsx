"use client";

import { ArrowUp, Highlighter, Slash, Square, X } from "lucide-react";
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import { Kbd } from "@/components/ui/kbd";
import { ModelPicker } from "@/components/ui/model-picker";
import { matchSlash, type QuickAction } from "@/data/quickActions";
import { cn } from "@/lib/utils";

export interface PanelComposerHandle {
  /** Fills the composer and focuses it. Used by quick actions and handoffs. */
  fill: (text: string) => void;
  focus: () => void;
}

export interface PanelComposerProps {
  onSend: (text: string) => void;
  onStop: () => void;
  busy: boolean;
  modelId: string;
  onModelChange: (id: string) => void;
  availableModels?: string[];
  /** Selected page text attached to the next message. */
  attachment?: string;
  onClearAttachment?: () => void;
  ref?: Ref<PanelComposerHandle>;
}

/**
 * The composer.
 *
 * Audit item 6: one global shortcut cannot address six actions, so slash
 * commands live here. Typing "/" opens a filtered menu; Enter or Tab accepts
 * the highlighted one and replaces the text with its full prompt, so the user
 * can still edit before sending rather than firing a black box.
 */
export function PanelComposer({
  onSend,
  onStop,
  busy,
  modelId,
  onModelChange,
  availableModels,
  attachment,
  onClearAttachment,
  ref,
}: PanelComposerProps) {
  const [value, setValue] = useState("");
  const [highlight, setHighlight] = useState(0);
  // Escape closes the command menu without destroying what was typed. Reset
  // whenever the text changes, so typing brings the menu straight back.
  const [dismissed, setDismissed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const matches = matchSlash(value);
  const menuOpen = matches.length > 0 && !dismissed;

  useImperativeHandle(ref, () => ({
    fill: (text: string) => {
      setValue(text);
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        el?.focus();
        el?.setSelectionRange(text.length, text.length);
      });
    },
    focus: () => textareaRef.current?.focus(),
  }));

  // Auto-grow up to six lines, then scroll.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [value]);

  useEffect(() => {
    setHighlight(0);
    setDismissed(false);
  }, [value]);

  function accept(action: QuickAction) {
    setValue(action.prompt);
    textareaRef.current?.focus();
  }

  function submit() {
    const text = value.trim();
    if (!text || busy) return;
    onSend(text);
    setValue("");
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (menuOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        setHighlight((h) => (h + delta + matches.length) % matches.length);
        return;
      }
      if (event.key === "Tab" || event.key === "Enter") {
        event.preventDefault();
        accept(matches[highlight]);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setDismissed(true);
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="relative border-t border-border bg-surface px-2.5 pb-2 pt-2">
      {menuOpen && (
        <div
          role="listbox"
          aria-label="Slash commands"
          className="absolute inset-x-2.5 bottom-full z-30 mb-1 overflow-hidden rounded-md border border-border bg-surface shadow-lift"
        >
          <p className="flex items-center gap-1 border-b border-border px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            <Slash aria-hidden className="size-2.5" />
            Commands
          </p>
          {matches.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                role="option"
                aria-selected={index === highlight}
                onMouseEnter={() => setHighlight(index)}
                onClick={() => accept(action)}
                className={cn(
                  "flex w-full items-center gap-2 px-2 py-1.5 text-left",
                  index === highlight ? "bg-brand-500/10" : "hover:bg-surface-2",
                )}
              >
                <Icon
                  aria-hidden
                  className="size-3.5 shrink-0"
                  style={{ color: action.accent }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-medium">
                    {action.label}
                  </span>
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {action.hint}
                  </span>
                </span>
                <code className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {action.slash}
                </code>
              </button>
            );
          })}
        </div>
      )}

      {attachment && (
        <div className="mb-1.5 flex items-center gap-1 rounded-sm border border-accent-500/30 bg-accent-500/10 px-2 py-1">
          <Highlighter aria-hidden className="size-3 shrink-0 text-accent-600 dark:text-accent-400" />
          <span className="min-w-0 flex-1 truncate text-[11px] text-foreground">
            “{attachment}”
          </span>
          <button
            type="button"
            onClick={onClearAttachment}
            aria-label="Remove attached selection"
            className="shrink-0 rounded-xs p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden className="size-3" />
          </button>
        </div>
      )}

      <div className="rounded-md border border-border bg-input shadow-soft transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Message EchoGPT, or / for commands"
          aria-label="Message"
          className="scrollbar-thin block w-full resize-none bg-transparent px-2.5 pb-1 pt-2 text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-1 px-1.5 pb-1.5">
          <ModelPicker
            value={modelId}
            onChange={onModelChange}
            available={availableModels}
            side="top"
            align="start"
          />
          <span className="ml-auto flex items-center gap-1.5">
            <Kbd keys={["Shift", "Enter"]} />
            <span className="text-[10px] text-muted-foreground">newline</span>
            {busy ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generating"
                className="inline-flex h-7 items-center gap-1 rounded-sm border border-border-strong px-2 text-[11px] font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                <Square aria-hidden className="size-2.5 fill-current" />
                Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!value.trim()}
                aria-label="Send message"
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-sm transition-colors",
                  value.trim()
                    ? "bg-primary text-primary-foreground hover:bg-brand-700 dark:hover:bg-brand-400"
                    : "bg-surface-2 text-muted-foreground",
                )}
              >
                <ArrowUp aria-hidden className="size-4" />
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
