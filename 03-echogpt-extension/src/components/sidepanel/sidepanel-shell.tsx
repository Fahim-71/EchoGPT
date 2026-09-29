"use client";

import { PenSquare, Settings, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatThread } from "@/components/sidepanel/chat-thread";
import { CompareTab } from "@/components/sidepanel/compare-tab";
import { HistoryTab } from "@/components/sidepanel/history-tab";
import { PageContextBanner } from "@/components/sidepanel/page-context-banner";
import { PanelComposer, type PanelComposerHandle } from "@/components/sidepanel/panel-composer";
import { PanelTabs, type PanelTab } from "@/components/sidepanel/panel-tabs";
import { IconButton } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Tooltip } from "@/components/ui/tooltip";
import { SAMPLE_THREADS, type SampleThread } from "@/data/sampleThreads";
import type { QuickAction } from "@/data/quickActions";
import { useChat } from "@/hooks/useChat";
import { useHotkey } from "@/hooks/useHotkey";
import {
  resolveActions,
  useActionOrder,
  useDefaultModel,
  useDensity,
  useEnabledActions,
  useEnabledModels,
  usePageContextDefault,
} from "@/hooks/useSettings";
import { DEMO_PAGE_CONTEXT, type PageContext } from "@/lib/env";
import type { HandoffPayload } from "@/lib/handoff";
import { cn } from "@/lib/utils";

export interface SidePanelShellProps {
  page?: PageContext;
  /** A payload handed over by the popup or the selection tooltip. */
  handoff?: HandoffPayload | null;
  /** Shown only when the panel is dockable (the showcase mock). */
  onClose?: () => void;
  /** Fires when a reply is inserted into the page. */
  onInsert?: (text: string) => void;
  framed?: boolean;
  className?: string;
}

/**
 * The side panel: the only surface where a conversation lives.
 *
 * It is the only one that survives a click on the page, so every other surface
 * hands off to it rather than duplicating it (audit item 7).
 */
export function SidePanelShell({
  page = DEMO_PAGE_CONTEXT,
  handoff,
  onClose,
  onInsert,
  framed,
  className,
}: SidePanelShellProps) {
  const [tab, setTab] = useState<PanelTab>("chat");
  const [modelId, setModelId] = useDefaultModel();
  const [enabledModels] = useEnabledModels();
  const [order] = useActionOrder();
  const [enabledActions] = useEnabledActions();
  const [contextDefault] = usePageContextDefault();
  const [density] = useDensity();
  const [useContext, setUseContext] = useState(true);
  const [attachment, setAttachment] = useState<string | undefined>();
  const [toast, setToast] = useState<string | null>(null);

  const composerRef = useRef<PanelComposerHandle>(null);
  const { messages, isStreaming, send, stop, regenerate, reset } = useChat();

  const actions = useMemo(
    () => resolveActions(order, enabledActions),
    [order, enabledActions],
  );

  useEffect(() => setUseContext(contextDefault), [contextDefault]);

  const submit = useCallback(
    (text: string) => {
      send(text, {
        modelId,
        attachment,
        usedPageContext: useContext,
      });
      setAttachment(undefined);
    },
    [send, modelId, attachment, useContext],
  );

  // Anything handed over from the popup, the tooltip or the context menu.
  useEffect(() => {
    if (!handoff) return;
    setTab(handoff.actionId === "history" ? "history" : "chat");
    if (handoff.modelId) setModelId(handoff.modelId);
    if (handoff.selection) setAttachment(handoff.selection);
    if (!handoff.prompt) {
      composerRef.current?.focus();
      return;
    }
    if (handoff.autoSend) {
      send(handoff.prompt, {
        modelId: handoff.modelId ?? modelId,
        attachment: handoff.selection,
        usedPageContext: useContext,
      });
    } else {
      composerRef.current?.fill(handoff.prompt);
    }
    // Intentionally keyed on the payload identity only: a new object means a
    // new handoff, and re-running on modelId changes would resend the prompt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handoff]);

  useHotkey({ key: "k", mod: true, allowInInput: true }, () =>
    composerRef.current?.focus(),
  );
  useHotkey({ key: "n", mod: true, shift: true }, () => {
    reset();
    setTab("chat");
  });

  function runAction(action: QuickAction) {
    setTab("chat");
    composerRef.current?.fill(action.prompt);
  }

  function openThread(thread: SampleThread) {
    setTab("chat");
    reset();
    setModelId(thread.modelId);
    requestAnimationFrame(() => composerRef.current?.fill(thread.preview));
    flash(`Resumed “${thread.title}”`);
  }

  function insert(text: string) {
    onInsert?.(text);
    flash(`Inserted ${text.split(/\s+/).length} words into the page`);
  }

  function flash(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }

  const historyCount = SAMPLE_THREADS.length;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden bg-background text-foreground",
        framed && "border-l border-border",
        className,
      )}
    >
      <header className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
        <Logo size={18} />
        <span className="text-[12px] font-semibold tracking-tight">EchoGPT</span>
        <span className="ml-auto flex items-center gap-0.5">
          <Tooltip content="New conversation — ⇧⌘N">
            <IconButton
              size="xs"
              label="New conversation"
              onClick={() => {
                reset();
                setTab("chat");
              }}
            >
              <PenSquare />
            </IconButton>
          </Tooltip>
          <Tooltip content="Settings">
            <IconButton size="xs" label="Settings" onClick={() => flash("Opens the options page")}>
              <Settings />
            </IconButton>
          </Tooltip>
          {onClose && (
            <IconButton size="xs" label="Close side panel" onClick={onClose}>
              <X />
            </IconButton>
          )}
        </span>
      </header>

      <PanelTabs value={tab} onChange={setTab} historyCount={historyCount} />

      {tab === "chat" && (
        <>
          <PageContextBanner
            page={page}
            enabled={useContext}
            onToggle={setUseContext}
          />
          <div
            role="tabpanel"
            id="panel-chat"
            aria-labelledby="tab-chat"
            className="flex flex-1 flex-col overflow-hidden"
          >
            <ChatThread
              messages={messages}
              busy={isStreaming}
              onRegenerate={regenerate}
              onInsert={insert}
              suggestions={actions}
              onSuggestion={runAction}
              compact={density === "compact"}
            />
            <PanelComposer
              ref={composerRef}
              onSend={submit}
              onStop={stop}
              busy={isStreaming}
              modelId={modelId}
              onModelChange={setModelId}
              availableModels={enabledModels}
              attachment={attachment}
              onClearAttachment={() => setAttachment(undefined)}
            />
          </div>
        </>
      )}

      {tab === "history" && (
        <div
          role="tabpanel"
          id="panel-history"
          aria-labelledby="tab-history"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <HistoryTab currentHost={page.host} onOpen={openThread} />
        </div>
      )}

      {tab === "compare" && (
        <div
          role="tabpanel"
          id="panel-compare"
          aria-labelledby="tab-compare"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <CompareTab availableModels={enabledModels} />
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="pointer-events-none absolute inset-x-3 bottom-20 z-40 rounded-sm border border-border bg-surface-3 px-2.5 py-1.5 text-center text-[11px] text-foreground shadow-lift"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
