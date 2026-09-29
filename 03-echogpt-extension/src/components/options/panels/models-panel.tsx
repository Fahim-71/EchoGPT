"use client";

import { SettingCard, SettingLabel, SettingRow } from "@/components/options/section";
import { Badge, Dot } from "@/components/ui/badge";
import { Meter, costWord, speedFill, speedWord } from "@/components/ui/meter";
import { ModelPicker } from "@/components/ui/model-picker";
import { Switch } from "@/components/ui/switch";
import {
  useDefaultModel,
  useEnabledModels,
  usePageContextDefault,
  useStreamResponses,
} from "@/hooks/useSettings";
import { CAPABILITY_LABEL, MODELS, TIER_LABEL } from "@/lib/models";
import { cn } from "@/lib/utils";

/**
 * Audit item 3, at settings scale.
 *
 * The same anatomy as the in-composer picker — vendor, blurb, capabilities,
 * speed, cost, context — so the user learns one mental model and it holds
 * everywhere. Turning a model off here removes it from every switcher, which
 * is the real fix for "eight names I do not recognise".
 */
export function ModelsPanel() {
  const [defaultModel, setDefaultModel] = useDefaultModel();
  const [enabled, setEnabled] = useEnabledModels();
  const [contextDefault, setContextDefault] = usePageContextDefault();
  const [streaming, setStreaming] = useStreamResponses();

  function toggle(id: string, on: boolean) {
    setEnabled((prev) => {
      const next = on ? [...new Set([...prev, id])] : prev.filter((m) => m !== id);
      // Never let the user empty the switcher.
      return next.length ? next : prev;
    });
  }

  return (
    <div className="space-y-4">
      <SettingCard
        title="Default model"
        description="What a new conversation starts with. You can still switch per message."
      >
        <ModelPicker
          variant="chip"
          side="bottom"
          value={defaultModel}
          onChange={setDefaultModel}
          available={enabled}
        />
      </SettingCard>

      <SettingCard
        title="Models in the switcher"
        description="Turn off the ones you never reach for. At least one must stay on."
      >
        <ul className="space-y-2">
          {MODELS.map((model) => {
            const on = enabled.includes(model.id);
            return (
              <li
                key={model.id}
                className={cn(
                  "rounded-md border p-3 transition-colors",
                  on ? "border-border bg-surface-2" : "border-border bg-surface opacity-60",
                )}
              >
                <div className="flex items-start gap-2">
                  <Dot color={model.accent} className="mt-1.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[13px] font-semibold">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.vendor}</span>
                      <Badge micro>{TIER_LABEL[model.tier]}</Badge>
                      {model.free && (
                        <Badge micro tone="success">
                          Free
                        </Badge>
                      )}
                      {model.id === defaultModel && (
                        <Badge micro tone="brand">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{model.blurb}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {model.capabilities.map((cap) => (
                        <Badge key={cap} micro>
                          {CAPABILITY_LABEL[cap]}
                        </Badge>
                      ))}
                      <Badge micro tone="brand">
                        {model.contextK >= 1000 ? "1M" : `${model.contextK}K`} context
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
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
                  </div>
                  <Switch
                    hideLabel
                    label={`Show ${model.name} in the switcher`}
                    checked={on}
                    onChange={(next) => toggle(model.id, next)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </SettingCard>

      <SettingCard title="Defaults for new conversations">
        <SettingRow>
          <SettingLabel
            label="Use the current page as context"
            description="Sends the page's visible text with your message. The side panel shows the token estimate before you send, and you can flip it per conversation."
          />
          <Switch
            hideLabel
            label="Use the current page as context by default"
            checked={contextDefault}
            onChange={setContextDefault}
          />
        </SettingRow>
        <SettingRow>
          <SettingLabel
            label="Stream responses"
            description="Show tokens as they arrive instead of waiting for the whole reply. Turning this off can help on very slow connections."
          />
          <Switch
            hideLabel
            label="Stream responses"
            checked={streaming}
            onChange={setStreaming}
          />
        </SettingRow>
      </SettingCard>
    </div>
  );
}
