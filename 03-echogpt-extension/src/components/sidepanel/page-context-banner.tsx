"use client";

import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SiteFavicon } from "@/components/ui/logo";
import { Switch } from "@/components/ui/switch";
import type { PageContext } from "@/lib/env";
import { cn } from "@/lib/utils";

export interface PageContextBannerProps {
  page: PageContext;
  enabled: boolean;
  onToggle: (next: boolean) => void;
  className?: string;
}

function formatTokens(tokens: number): string {
  return tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}K` : String(tokens);
}

/**
 * "Use this page as context", made legible.
 *
 * The shipping extension has an "include webpage context" option with no
 * indication of what it costs. Sending a page is the difference between a
 * cheap question and an expensive one, so the estimate is stated in tokens
 * *and* in plain words, and the banner expands to say exactly what gets sent.
 */
export function PageContextBanner({
  page,
  enabled,
  onToggle,
  className,
}: PageContextBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const heavy = page.tokens > 6000;

  return (
    <div className={cn("border-b border-border bg-surface-2", className)}>
      <div className="flex items-center gap-2 px-3 py-2">
        <SiteFavicon host={page.host} size={16} />
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-1 text-left"
        >
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-medium leading-tight text-foreground">
              {page.title}
            </span>
            <span className="block truncate text-[10px] leading-tight text-muted-foreground">
              {page.host}
            </span>
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>

        <Badge tone={enabled ? (heavy ? "warning" : "brand") : "neutral"} micro>
          ~{formatTokens(page.tokens)} tok
        </Badge>

        <Switch
          hideLabel
          label="Use this page as context"
          checked={enabled}
          onChange={onToggle}
        />
      </div>

      {expanded && (
        <div className="space-y-1.5 border-t border-border px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
          <p className="flex items-start gap-1.5">
            <FileText aria-hidden className="mt-px size-3 shrink-0" />
            <span>
              {enabled ? (
                <>
                  The page's visible text (about{" "}
                  <strong className="font-medium text-foreground">
                    {formatTokens(page.tokens)} tokens
                  </strong>
                  , roughly {Math.round(page.tokens / 250)} paragraphs) is sent with
                  each message. Images, ads and navigation are stripped first.
                </>
              ) : (
                <>
                  Context is off. Questions are answered from the model's own
                  knowledge — faster and cheaper, but it cannot see this page.
                </>
              )}
            </span>
          </p>
          {enabled && heavy && (
            <p className="text-warning">
              This is a long page. Expect a slower first token on reasoning models.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
