"use client";

import { useMemo, useState } from "react";
import {
  CAPABILITY_LABEL,
  MODELS,
  TIER_LABEL,
  type AIModel,
  type ModelTier,
} from "@/lib/models";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Meter } from "@/components/ui/meter";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

type Filter = ModelTier | "all";

const SPEED_LABEL = ["Instant", "Fast", "Steady", "Thorough", "Deliberate"];
const COST_LABEL = ["$", "$$", "$$$", "$$$$", "$$$$$"];

const TIERS = Object.keys(TIER_LABEL) as ModelTier[];

function formatContext(contextK: number) {
  return contextK >= 1000 ? `${contextK / 1000}M` : `${contextK}K`;
}

/**
 * Data-driven model catalogue. Every card — and the filter row — is derived
 * from `MODELS` in `src/lib/models.ts`, the same array the web app and the
 * extension render their pickers from, so the three surfaces cannot drift.
 */
export function AiModels() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => (filter === "all" ? MODELS : MODELS.filter((m) => m.tier === filter)),
    [filter],
  );

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All models", count: MODELS.length },
    ...TIERS.map((tier) => ({
      id: tier as Filter,
      label: TIER_LABEL[tier],
      count: MODELS.filter((m) => m.tier === tier).length,
    })),
  ];

  return (
    <section
      id="models"
      aria-labelledby="models-title"
      className="scroll-mt-20 border-y border-border bg-background-subtle py-20 sm:py-24"
    >
      <Container size="wide">
        <SectionHeading
          id="models-title"
          eyebrow="AI models"
          title="Pick the model that fits the question"
          description="Fast for a quick lookup, reasoning for the hard one, creative for the visuals. Switch mid-thread and the conversation comes with you."
        />

        <Reveal delay={1} className="mt-10">
          <div
            role="group"
            aria-label="Filter models by tier"
            className="scrollbar-thin mx-auto flex w-full snap-x gap-2 overflow-x-auto pb-2 sm:w-fit sm:justify-center sm:pb-0"
          >
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "inline-flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-brand-500 bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px] font-semibold",
                      active ? "bg-white/20" : "bg-surface-3 text-muted-foreground",
                    )}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((model, index) => (
            <li key={model.id} className="flex">
              <Reveal delay={index % 3} className="flex w-full">
                <ModelCard model={model} />
              </Reveal>
            </li>
          ))}
        </ul>

        <p aria-live="polite" className="sr-only">
          Showing {visible.length} of {MODELS.length} models.
        </p>
      </Container>
    </section>
  );
}

function ModelCard({ model }: { model: AIModel }) {
  return (
    <Card interactive className="flex w-full flex-col p-5">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-1.5 size-2.5 shrink-0 rounded-full ring-4"
          style={{
            backgroundColor: model.accent,
            boxShadow: `0 0 0 4px color-mix(in oklab, ${model.accent} 18%, transparent)`,
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
              {model.name}
            </h3>
            {model.free ? <Badge tone="success">Free</Badge> : null}
          </div>
          <p className="text-xs text-muted-foreground">{model.vendor}</p>
        </div>
        <Badge tone="brand" className="shrink-0">
          {TIER_LABEL[model.tier]}
        </Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {model.blurb}
      </p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {model.capabilities.map((capability) => (
          <li key={capability}>
            <Badge>{CAPABILITY_LABEL[capability]}</Badge>
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Context window</span>
          <span className="font-mono font-medium text-foreground">
            {formatContext(model.contextK)} tokens
          </span>
        </div>
        <Meter
          label="Speed"
          // Low latency should read as a *full* speed meter.
          value={6 - model.latency}
          valueLabel={SPEED_LABEL[model.latency - 1]}
          tone="accent"
        />
        <Meter
          label="Cost"
          value={model.cost}
          valueLabel={COST_LABEL[model.cost - 1]}
          tone="amber"
        />
      </div>
    </Card>
  );
}
