"use client";

import { Columns2, Play, Square, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { RichText } from "@/components/sidepanel/rich-text";
import { Badge, Dot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Meter, costWord, speedFill, speedWord } from "@/components/ui/meter";
import { ModelPicker } from "@/components/ui/model-picker";
import { COMPARE_PROMPT } from "@/data/sampleThreads";
import { getModel } from "@/lib/models";
import { replyFor, speedForLatency, streamText } from "@/lib/mockStream";
import { cn } from "@/lib/utils";

interface Lane {
  modelId: string;
  text: string;
  streaming: boolean;
  /** Milliseconds to the last token — the honest reason to prefer one model. */
  elapsed: number | null;
}

export interface CompareTabProps {
  availableModels?: string[];
  className?: string;
}

/**
 * Response comparison, which the shipping extension advertises but does not
 * really support in a way you can act on.
 *
 * At 400px the two answers stack rather than sit side by side, and each lane
 * reports its own wall-clock time so "which model should I use" has an answer
 * from this run rather than from a spec sheet.
 */
export function CompareTab({ availableModels, className }: CompareTabProps) {
  const [prompt, setPrompt] = useState(COMPARE_PROMPT);
  const [lanes, setLanes] = useState<Lane[]>([
    { modelId: "echo-flash", text: "", streaming: false, elapsed: null },
    { modelId: "claude-sonnet", text: "", streaming: false, elapsed: null },
  ]);
  const [winner, setWinner] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const busy = lanes.some((l) => l.streaming);

  const patch = useCallback((index: number, next: Partial<Lane>) => {
    setLanes((prev) => prev.map((l, i) => (i === index ? { ...l, ...next } : l)));
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
  }

  function run() {
    if (busy || !prompt.trim()) return;
    stop();
    const controller = new AbortController();
    abortRef.current = controller;
    setWinner(null);
    setLanes((prev) =>
      prev.map((l) => ({ ...l, text: "", streaming: true, elapsed: null })),
    );

    lanes.forEach((lane, index) => {
      const model = getModel(lane.modelId);
      const started = performance.now();
      void streamText(replyFor(prompt).text, {
        signal: controller.signal,
        speed: speedForLatency(model.latency),
        onToken: (accumulated) => patch(index, { text: accumulated }),
      }).then(() =>
        patch(index, {
          streaming: false,
          // A stopped run has no meaningful duration — reporting "0.4s" for a
          // lane the user cut short would be the most misleading number here.
          elapsed: controller.signal.aborted
            ? null
            : Math.round(performance.now() - started),
        }),
      );
    });
  }

  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden", className)}>
      <div className="space-y-2 border-b border-border px-3 py-2.5">
        <label
          htmlFor="compare-prompt"
          className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          One prompt, two models
        </label>
        <textarea
          id="compare-prompt"
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="scrollbar-thin block w-full resize-none rounded-sm border border-border bg-input px-2 py-1.5 text-[12px] leading-relaxed outline-none focus:border-brand-400"
        />
        <div className="flex items-center gap-2">
          {busy ? (
            <Button size="sm" variant="outline" onClick={stop} className="flex-1">
              <Square className="size-3 fill-current" />
              Stop both
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={run}
              disabled={!prompt.trim()}
              className="flex-1"
            >
              <Play className="size-3" />
              Run comparison
            </Button>
          )}
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-3">
        {lanes.map((lane, index) => {
          const model = getModel(lane.modelId);
          return (
            <section
              key={index}
              aria-label={`Lane ${index + 1}: ${model.name}`}
              className={cn(
                "overflow-hidden rounded-md border transition-colors",
                winner === index
                  ? "border-brand-500 bg-brand-500/5"
                  : "border-border bg-surface",
              )}
            >
              <header className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-2 py-1.5">
                <ModelPicker
                  variant="chip"
                  side="bottom"
                  value={lane.modelId}
                  available={availableModels}
                  onChange={(id) => patch(index, { modelId: id, text: "", elapsed: null })}
                />
                {lane.elapsed !== null && (
                  <Badge micro tone="accent">
                    {(lane.elapsed / 1000).toFixed(1)}s
                  </Badge>
                )}
                <button
                  type="button"
                  onClick={() => setWinner(winner === index ? null : index)}
                  aria-pressed={winner === index}
                  className={cn(
                    "ml-auto inline-flex h-6 items-center gap-1 rounded-full border px-1.5 text-[10px] font-medium transition-colors",
                    winner === index
                      ? "border-brand-500 bg-brand-500/15 text-brand-700 dark:text-brand-300"
                      : "border-border text-muted-foreground hover:border-brand-400",
                  )}
                >
                  <ThumbsUp aria-hidden className="size-2.5" />
                  {winner === index ? "Preferred" : "Prefer"}
                </button>
              </header>

              <div className="space-y-1 border-b border-border px-2 py-1.5">
                <Meter
                  label="Speed"
                  value={speedFill(model.latency)}
                  valueLabel={speedWord(model.latency)}
                />
                <Meter
                  label="Cost"
                  value={model.cost}
                  valueLabel={costWord(model.cost)}
                  inverse
                />
              </div>

              <div className="px-2.5 py-2">
                {lane.text ? (
                  <RichText content={lane.text} caret={lane.streaming} />
                ) : (
                  <p className="flex items-center gap-1.5 py-3 text-[11px] text-muted-foreground">
                    <Dot color={model.accent} pulse={lane.streaming} />
                    {lane.streaming ? "Waiting for the first token…" : "Not run yet."}
                  </p>
                )}
              </div>
            </section>
          );
        })}

        <p className="flex items-start gap-1.5 px-1 text-[10px] leading-snug text-muted-foreground">
          <Columns2 aria-hidden className="mt-px size-3 shrink-0" />
          Preferring a lane sets it as the default model for this kind of prompt.
          Timings are from this run, not a benchmark.
        </p>
      </div>
    </div>
  );
}
