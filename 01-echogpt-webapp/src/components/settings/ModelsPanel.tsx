"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { COST_LABEL, Meter, SPEED_LABEL, speedScore } from "@/components/ui/Meter";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { CAPABILITY_LABEL, MODELS, TIER_LABEL } from "@/lib/models";
import type { ModelTier } from "@/lib/models";
import { formatContext } from "@/lib/format";
import { useSettings } from "@/hooks/useSettings";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { cn } from "@/lib/utils";

const TIER_ORDER: ModelTier[] = ["fast", "balanced", "reasoning", "creative"];

/** The full catalogue, laid out so choosing a default is an informed decision. */
export function ModelsPanel() {
  const { modelId, setModelId } = useWorkspace();
  const { settings, update } = useSettings();

  return (
    <div className="space-y-4">
      <SettingsSection
        title="Default model"
        description="Used for every new chat and for the first column on the compare board."
      >
        <div className="space-y-4">
          {TIER_ORDER.map((tier) => {
            const models = MODELS.filter((m) => m.tier === tier);
            if (models.length === 0) return null;
            return (
              <div key={tier}>
                <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  {TIER_LABEL[tier]}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {models.map((model) => {
                    const selected = model.id === modelId;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setModelId(model.id)}
                        className={cn(
                          "rounded-md border p-3 text-left transition-colors",
                          selected
                            ? "border-primary bg-brand-50/60 dark:bg-brand-950/40"
                            : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: model.accent }}
                          />
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                            {model.name}
                          </span>
                          {model.free ? <Badge tone="success">Free</Badge> : null}
                          {selected ? (
                            <Check aria-hidden className="size-4 shrink-0 text-primary" />
                          ) : null}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {model.vendor} · {model.blurb}
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
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
                        </span>
                        <span className="mt-1.5 flex flex-wrap gap-1">
                          {model.capabilities.map((capability) => (
                            <Badge key={capability} tone="neutral">
                              {CAPABILITY_LABEL[capability]}
                            </Badge>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection title="Generation" description="How responses arrive.">
        <Switch
          label="Stream responses"
          description="Show tokens as they arrive rather than waiting for the whole reply."
          checked={settings.streamResponses}
          onCheckedChange={(value) => update("streamResponses", value)}
        />
        <Switch
          label="Show token counter"
          description="Display draft length against the selected model's context window."
          checked={settings.showTokenCounter}
          onCheckedChange={(value) => update("showTokenCounter", value)}
        />
      </SettingsSection>
    </div>
  );
}
