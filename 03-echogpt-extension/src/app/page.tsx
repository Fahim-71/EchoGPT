"use client";

import { useCallback, useRef, useState } from "react";
import { BrowserMock } from "@/components/showcase/browser-mock";
import { FakeArticle } from "@/components/showcase/fake-article";
import { RationaleList } from "@/components/showcase/rationale-list";
import {
  SelectionTooltip,
  type SelectionTooltipProps,
} from "@/components/showcase/selection-tooltip";
import {
  SurfaceSwitcher,
  type ShowcaseSurface,
} from "@/components/showcase/surface-switcher";
import { OptionsShell } from "@/components/options/options-shell";
import { PopupShell } from "@/components/popup/popup-shell";
import { SidePanelShell } from "@/components/sidepanel/sidepanel-shell";
import { ShowcaseIntro, ShowcaseOutro } from "@/components/showcase/showcase-copy";
import { DEMO_PAGE_CONTEXT } from "@/lib/env";
import type { HandoffPayload } from "@/lib/handoff";

/**
 * `/` — the hosted showcase, and the route deployed to Vercel.
 *
 * All three surfaces are the *same components* the extension bundle ships, not
 * mockups of them, so anything broken here is broken in the extension too.
 */
export default function ShowcasePage() {
  const [surface, setSurface] = useState<ShowcaseSurface>("popup");
  const [narrow, setNarrow] = useState(false);
  const [popupOpen, setPopupOpen] = useState(true);
  const [handoff, setHandoff] = useState<HandoffPayload | null>(null);
  const [insertion, setInsertion] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const panelOpen = surface === "sidepanel" || handoff !== null;

  /** Everything that starts a conversation routes through here. */
  const receiveHandoff = useCallback((payload: HandoffPayload) => {
    setHandoff({ ...payload });
    setPopupOpen(false);
    setSurface("sidepanel");
  }, []);

  const onSelectionAction: SelectionTooltipProps["onAction"] = useCallback(
    (action, selection) => {
      receiveHandoff({
        prompt:
          action === "ask"
            ? "About the text I selected: "
            : action.prompt,
        selection,
        actionId: action === "ask" ? "ask" : action.id,
        autoSend: action !== "ask",
      });
    },
    [receiveHandoff],
  );

  return (
    <main className="min-h-screen bg-background-subtle">
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-12">
        <ShowcaseIntro />

        {/* The switcher is sticky, but a sticky element is bounded by its
            containing block — wrapping it with the mock means it unsticks once
            the demo scrolls away instead of floating over the audit below. */}
        <section className="mt-10">
        <SurfaceSwitcher
          className="mb-4"
          surface={surface}
          onSurfaceChange={(next) => {
            setSurface(next);
            setPopupOpen(next === "popup");
            if (next !== "sidepanel") setHandoff(null);
          }}
          narrow={narrow}
          onNarrowChange={setNarrow}
        />

        <BrowserMock
          narrow={narrow}
          pageRef={pageRef}
          popupOpen={popupOpen && surface !== "options"}
          onToolbarClick={() => {
            setPopupOpen((o) => !o);
            if (surface === "options") setSurface("popup");
          }}
          tabOverlay={
            surface === "options" ? (
              <OptionsShell embedded initialSection="account" />
            ) : undefined
          }
          popup={
            <PopupShell
              framed
              page={DEMO_PAGE_CONTEXT}
              selection={handoff?.selection}
              onHandoff={receiveHandoff}
            />
          }
          sidePanel={
            panelOpen ? (
              <SidePanelShell
                framed
                page={DEMO_PAGE_CONTEXT}
                handoff={handoff}
                onInsert={setInsertion}
                onClose={() => {
                  setHandoff(null);
                  setSurface("popup");
                  setPopupOpen(true);
                }}
              />
            ) : undefined
          }
        >
          <>
            <FakeArticle insertion={insertion} />
            <SelectionTooltip
              containerRef={pageRef}
              onAction={onSelectionAction}
            />
          </>
        </BrowserMock>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Everything above is live. Select a sentence in the article to raise the
          tooltip, run a quick action from the popup, or type <code className="font-mono">/</code>{" "}
          in the side panel composer.
        </p>
        </section>

        <section className="mt-16" aria-labelledby="audit-heading">
          <h2
            id="audit-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Seven problems, seven fixes
          </h2>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-muted-foreground">
            The audit below is what the redesign is for. Each row is a real
            behaviour of the shipping v1.0.5 extension, what it costs, and what
            this build does instead.
          </p>
          <RationaleList className="mt-6" />
        </section>

        <ShowcaseOutro />
      </div>
    </main>
  );
}
