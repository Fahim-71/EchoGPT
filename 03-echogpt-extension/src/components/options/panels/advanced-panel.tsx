"use client";

import { ChevronDown, RotateCcw, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { SettingCard, SettingLabel, SettingRow } from "@/components/options/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_ENDPOINT, useCustomEndpoint } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

/**
 * Audit item 2, resolved.
 *
 * The custom API endpoint is a real feature and self-hosters need it, so it is
 * not removed — it is *relocated*. It now sits at the bottom of the demoted
 * section, inside a collapsed disclosure, behind a warning written in plain
 * language, with a one-click way back to the default. A user who does not know
 * what it is will never be asked to have an opinion about it.
 */
export function AdvancedPanel() {
  const [endpoint, setEndpoint] = useCustomEndpoint();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(endpoint);
  const [debug, setDebug] = useState(false);

  const invalid = draft.length > 0 && !/^https:\/\/.+/i.test(draft);
  const active = endpoint.length > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-warning/30 bg-warning/8 p-3">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-foreground">
          <TriangleAlert aria-hidden className="mt-px size-4 shrink-0 text-warning" />
          <span>
            Nothing on this page is needed to use EchoGPT. These options exist for
            self-hosting and debugging, and a wrong value here will stop replies from
            arriving at all.
          </span>
        </p>
      </div>

      <SettingCard>
        <div className="flex items-start justify-between gap-4">
          <SettingLabel
            label="Custom API endpoint"
            description="Point EchoGPT at your own deployment instead of api.echogpt.live. Your conversations then never reach EchoGPT's servers — and EchoGPT cannot help if yours is down."
          />
          {active && (
            <Badge tone="warning" micro className="shrink-0">
              Custom
            </Badge>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown
            aria-hidden
            className={cn("size-3.5 transition-transform", open && "rotate-180")}
          />
          {open ? "Hide" : "I know what I'm doing — show the field"}
        </button>

        {open && (
          <div className="mt-3 space-y-2 border-t border-border pt-3">
            <label
              htmlFor="endpoint"
              className="block text-xs font-medium text-foreground"
            >
              Base URL
            </label>
            <input
              id="endpoint"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={DEFAULT_ENDPOINT}
              spellCheck={false}
              aria-invalid={invalid}
              aria-describedby="endpoint-help"
              className={cn(
                "h-9 w-full rounded-sm border bg-input px-2.5 font-mono text-xs outline-none transition-colors",
                invalid ? "border-danger" : "border-border focus:border-brand-400",
              )}
            />
            <p id="endpoint-help" className="text-xs text-muted-foreground">
              {invalid ? (
                <span className="text-danger">
                  Must start with <code className="font-mono">https://</code>. Plaintext
                  endpoints are refused by the manifest's host permissions.
                </span>
              ) : (
                <>
                  Leave empty to use the default, <code className="font-mono">{DEFAULT_ENDPOINT}</code>.
                  Must be OpenAI-compatible at <code className="font-mono">/chat/completions</code>.
                </>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                size="sm"
                variant="primary"
                disabled={invalid || draft === endpoint}
                onClick={() => setEndpoint(draft)}
              >
                Save endpoint
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={!active && draft === ""}
                onClick={() => {
                  setDraft("");
                  setEndpoint("");
                }}
              >
                <RotateCcw className="size-3.5" />
                Reset to default
              </Button>
            </div>
          </div>
        )}
      </SettingCard>

      <SettingCard title="Diagnostics">
        <SettingRow>
          <SettingLabel
            label="Verbose logging"
            description="Writes request timings and stream events to the service worker console. Off by default; it is noisy and it stays on until you turn it off."
          />
          <Switch hideLabel label="Verbose logging" checked={debug} onChange={setDebug} />
        </SettingRow>
        <SettingRow>
          <SettingLabel
            label="Extension build"
            description="EchoGPT redesign · Manifest V3 · side panel + content script + service worker."
          />
          <Badge micro>v2.0.0-demo</Badge>
        </SettingRow>
      </SettingCard>
    </div>
  );
}
