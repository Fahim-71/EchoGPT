"use client";

import { ArrowUp, PanelRight } from "lucide-react";
import { useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export interface PopupComposerProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * One line, one job.
 *
 * Audit item 7: the popup is a launcher, not a chat window. This input never
 * renders a reply — it hands the text to the side panel and the popup closes.
 * The hint under it says so explicitly, so the user is never surprised by which
 * surface their conversation ends up in.
 */
export function PopupComposer({
  onSubmit,
  placeholder = "Ask anything about this page…",
  className,
}: PopupComposerProps) {
  const [value, setValue] = useState("");

  function submit() {
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setValue("");
  }

  return (
    <form
      className={cn("px-3", className)}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="group relative flex items-center rounded-md border border-border bg-input shadow-soft transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Ask anything"
          className="h-10 w-full bg-transparent pl-3 pr-10 text-[13px] outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Send to side panel"
          title="Send to side panel"
          className={cn(
            "absolute right-1.5 inline-flex size-7 items-center justify-center rounded-sm transition-all",
            value.trim()
              ? "bg-primary text-primary-foreground hover:bg-brand-700 dark:hover:bg-brand-400"
              : "bg-surface-2 text-muted-foreground",
          )}
        >
          <ArrowUp aria-hidden className="size-4" />
        </button>
      </div>
      <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
        <PanelRight aria-hidden className="size-2.5" />
        Opens in the side panel so it stays while you read.
        <Kbd keys={["Enter"]} className="ml-auto" />
      </p>
    </form>
  );
}
