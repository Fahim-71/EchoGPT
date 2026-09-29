"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const PROMPT = "Summarise this page and compare the two answers";

const COLUMNS = [
  {
    model: "GPT-4o",
    vendor: "OpenAI",
    accent: "#10a37f",
    lines: [
      "The page argues that multi-model access",
      "beats a single subscription, and backs it",
      "with three cost comparisons.",
    ],
    widths: ["100%", "94%", "62%"],
  },
  {
    model: "Claude Sonnet",
    vendor: "Anthropic",
    accent: "#d97757",
    lines: [
      "Main claim: tab-switching is the real cost.",
      "Evidence is anecdotal but the pricing",
      "table is concrete and checkable.",
    ],
    widths: ["96%", "100%", "58%"],
  },
];

/** ms per character — fast enough to feel typed, slow enough to read. */
const TYPE_MS = 45;
const HOLD_MS = 2600;

/**
 * The hero product shot: a mock EchoGPT surface where the prompt types itself
 * out and two model columns stream a reply.
 *
 * Built from real DOM rather than an image so it reflows at every breakpoint
 * and follows the theme. The whole thing is `aria-hidden` — it is decoration,
 * and the headline beside it already carries the message — and it renders the
 * finished state with no animation when the user prefers reduced motion.
 */
export function HeroVisual() {
  const reduce = usePrefersReducedMotion();
  const [typed, setTyped] = useState(0);
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    if (reduce) {
      setTyped(PROMPT.length);
      setAnswering(true);
      return;
    }

    let timer: number;
    let cancelled = false;

    const run = (index: number) => {
      if (cancelled) return;
      if (index <= PROMPT.length) {
        setTyped(index);
        timer = window.setTimeout(() => run(index + 1), TYPE_MS);
        return;
      }
      setAnswering(true);
      timer = window.setTimeout(() => {
        setAnswering(false);
        setTyped(0);
        run(0);
      }, HOLD_MS);
    };

    timer = window.setTimeout(() => run(0), 600);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduce]);

  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lift"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="ml-2 truncate font-mono text-[10px] text-muted-foreground sm:text-[11px]">
          echogpt.live / compare
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Live
        </span>
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        {/* Composer with the typewriter */}
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-surface-3 text-[10px] font-semibold text-muted-foreground">
              You
            </span>
            <p className="min-h-[2.5rem] text-[13px] leading-relaxed text-foreground sm:text-sm">
              {PROMPT.slice(0, typed)}
              <span
                className={cn(
                  "ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-brand-500",
                  !reduce && "animate-caret",
                )}
              />
            </p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-2.5">
            <Chip label="2 models" dot="#8347fb" />
            <Chip label="Page context on" dot="#22d3ee" />
            <span className="ml-auto rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
              Send
            </span>
          </div>
        </div>

        {/* Two answering columns */}
        <div className="grid gap-3 sm:grid-cols-2">
          {COLUMNS.map((col, colIndex) => (
            <div
              key={col.model}
              className="rounded-lg border border-border bg-background p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: col.accent }}
                />
                <span className="text-[11px] font-semibold text-foreground">
                  {col.model}
                </span>
                <span className="text-[10px] text-muted-foreground">{col.vendor}</span>
              </div>

              <div className="mt-2.5 space-y-1.5">
                {col.lines.map((line, i) => (
                  <div key={line} className="relative">
                    {answering ? (
                      <p
                        className="text-[11px] leading-relaxed text-muted-foreground transition-opacity duration-500"
                        style={{
                          opacity: 1,
                          transitionDelay: reduce
                            ? "0ms"
                            : `${colIndex * 140 + i * 220}ms`,
                        }}
                      >
                        {line}
                      </p>
                    ) : (
                      <span
                        className="block h-3 rounded bg-gradient-to-r from-surface-3 via-surface-2 to-surface-3 bg-[length:200%_100%] animate-shimmer"
                        style={{ width: col.widths[i] }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({ label, dot }: { label: string; dot: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2 py-1 text-[10px] font-medium text-muted-foreground">
      <span className="size-1.5 rounded-full" style={{ backgroundColor: dot }} />
      {label}
    </span>
  );
}
