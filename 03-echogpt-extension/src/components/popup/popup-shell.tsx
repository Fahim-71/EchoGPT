"use client";

import { ChevronDown, PanelRight, Settings, Wifi } from "lucide-react";
import { useMemo, useState } from "react";
import { PopupComposer } from "@/components/popup/popup-composer";
import { QuickActions } from "@/components/popup/quick-actions";
import { RecentThreads } from "@/components/popup/recent-threads";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { Logo, SiteFavicon } from "@/components/ui/logo";
import { ModelPicker } from "@/components/ui/model-picker";
import { Popover } from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { RECENT_THREADS, type SampleThread } from "@/data/sampleThreads";
import type { QuickAction } from "@/data/quickActions";
import {
  resolveActions,
  useActionOrder,
  useDefaultModel,
  useEnabledActions,
  useEnabledModels,
  useSignedIn,
} from "@/hooks/useSettings";
import { DEMO_PAGE_CONTEXT, openOptions, openSidePanel, type PageContext } from "@/lib/env";
import type { HandoffPayload } from "@/lib/handoff";
import { cn } from "@/lib/utils";

export interface PopupShellProps {
  /** Receives everything the popup hands to the side panel. */
  onHandoff?: (payload: HandoffPayload) => void;
  page?: PageContext;
  /** Text selected on the page, if any. Unlocks the selection actions. */
  selection?: string;
  /** Standalone route adds its own frame; the showcase supplies one. */
  framed?: boolean;
  className?: string;
}

/**
 * The 400×600 launcher.
 *
 * Reading order is the whole argument: connection status, then one input, then
 * six actions that need no account, then three threads to resume, then
 * settings. Sign-in appears once, as an offer in the account chip — never as a
 * gate (audit item 1).
 */
export function PopupShell({
  onHandoff,
  page = DEMO_PAGE_CONTEXT,
  selection,
  framed,
  className,
}: PopupShellProps) {
  const [modelId, setModelId] = useDefaultModel();
  const [enabledModels] = useEnabledModels();
  const [order, , orderReady] = useActionOrder();
  const [enabled, , enabledReady] = useEnabledActions();
  const [signedIn, setSignedIn] = useSignedIn();
  const [accountOpen, setAccountOpen] = useState(false);

  const actions = useMemo(() => resolveActions(order, enabled), [order, enabled]);

  function handoff(payload: HandoffPayload) {
    onHandoff?.(payload);
    if (!onHandoff) void openSidePanel();
  }

  function runAction(action: QuickAction) {
    handoff({
      prompt: action.prompt,
      modelId,
      actionId: action.id,
      selection: action.scope === "selection" ? selection : undefined,
      autoSend: true,
    });
  }

  function openThread(thread: SampleThread) {
    handoff({ prompt: "", threadId: thread.id, modelId: thread.modelId });
  }

  return (
    <div
      className={cn(
        "flex h-[600px] w-[400px] flex-col overflow-hidden bg-background text-foreground",
        framed && "rounded-lg border border-border shadow-lift",
        className,
      )}
    >
      {/* Header — identity, connection, account. */}
      <header className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2.5">
        <Logo size={20} />
        <span className="text-[13px] font-semibold tracking-tight">EchoGPT</span>

        <Tooltip content="Connected over HTTPS to api.echogpt.live. No third-party analytics.">
          <Badge tone="success" micro className="ml-1">
            <Wifi aria-hidden className="size-2.5" />
            Connected
          </Badge>
        </Tooltip>

        <Popover
          open={accountOpen}
          onClose={() => setAccountOpen(false)}
          side="bottom"
          align="end"
          className="ml-auto"
          panelClassName="w-[248px] p-3"
          trigger={
            <button
              type="button"
              onClick={() => setAccountOpen((o) => !o)}
              aria-expanded={accountOpen}
              className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-surface-2 pl-1 pr-2 text-[11px] font-medium transition-colors hover:border-brand-400"
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white",
                  signedIn
                    ? "bg-gradient-to-br from-brand-400 to-accent-500"
                    : "bg-surface-3 text-muted-foreground",
                )}
              >
                {signedIn ? "MF" : "G"}
              </span>
              {signedIn ? "Fahim" : "Guest"}
              <ChevronDown aria-hidden className="size-2.5 opacity-60" />
            </button>
          }
        >
          <p className="text-[13px] font-semibold">
            {signedIn ? "Signed in" : "Guest — local only"}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {signedIn
              ? "Threads sync across every Chrome profile you are signed into."
              : "Everything works right now. Signing in only adds sync across devices and history beyond 30 days."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSignedIn(!signedIn);
              setAccountOpen(false);
            }}
            className={cn(
              "mt-2.5 h-8 w-full rounded-sm text-[12px] font-medium transition-colors",
              signedIn
                ? "border border-border text-muted-foreground hover:bg-surface-2"
                : "bg-primary text-primary-foreground hover:bg-brand-700 dark:hover:bg-brand-400",
            )}
          >
            {signedIn ? "Sign out" : "Sign in to sync"}
          </button>
        </Popover>
      </header>

      {/* Current page strip — what "this page" refers to. */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-1.5">
        <SiteFavicon host={page.host} size={14} />
        <span className="truncate text-[11px] text-muted-foreground">{page.title}</span>
        {selection && (
          <Badge tone="accent" micro className="ml-auto shrink-0">
            Selection ready
          </Badge>
        )}
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto py-2.5">
        <PopupComposer
          onSubmit={(text) =>
            handoff({ prompt: text, modelId, selection, autoSend: true })
          }
        />
        <QuickActions
          actions={actions}
          onRun={runAction}
          hasSelection={Boolean(selection)}
          ready={orderReady && enabledReady}
        />
        <RecentThreads
          threads={RECENT_THREADS}
          onOpen={openThread}
          onSeeAll={() => handoff({ prompt: "", actionId: "history" })}
        />
      </div>

      {/* Footer — model, settings, the two ways into the panel. */}
      <footer className="flex items-center gap-1.5 border-t border-border bg-surface px-2.5 py-2">
        <ModelPicker
          variant="chip"
          value={modelId}
          onChange={setModelId}
          available={enabledModels}
          side="top"
          align="start"
        />
        <span className="ml-auto flex items-center gap-1">
          <Tooltip content="Open the full side panel">
            <button
              type="button"
              onClick={() => handoff({ prompt: "", modelId })}
              className="inline-flex h-7 items-center gap-1 rounded-sm px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <PanelRight aria-hidden className="size-3.5" />
              Side panel
            </button>
          </Tooltip>
          <Tooltip content="Settings">
            <button
              type="button"
              onClick={openOptions}
              aria-label="Settings"
              className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Settings aria-hidden className="size-3.5" />
            </button>
          </Tooltip>
          <Kbd keys={["mod", "Shift", "E"]} className="ml-0.5" />
        </span>
      </footer>
    </div>
  );
}
