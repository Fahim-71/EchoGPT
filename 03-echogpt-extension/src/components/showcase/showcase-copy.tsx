"use client";

import { MousePointerClick, PanelRight, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { Logo } from "@/components/ui/logo";

const SPLIT = [
  {
    icon: MousePointerClick,
    title: "Popup — the launcher",
    size: "400 × 600, closes on blur",
    does: [
      "Says what page you are on and whether you are connected",
      "One input, six quick actions, three recent threads",
      "Hands every conversation to the side panel, then closes",
    ],
    doesNot: "Never holds a conversation. Nothing is lost when it closes.",
  },
  {
    icon: PanelRight,
    title: "Side panel — the workspace",
    size: "Resizable, survives page clicks",
    does: [
      "The only place a conversation lives",
      "Chat, History and Compare, with page context and citations",
      "Receives selections from the tooltip and the right-click menu",
    ],
    doesNot: "Not opened by accident: it only appears once you have asked something.",
  },
  {
    icon: Settings,
    title: "Options — the rarely-visited tab",
    size: "Full browser tab",
    does: [
      "Ordered by who needs it, not by what is easiest to build",
      "Quick Actions reorder here and change all three surfaces",
      "Privacy itemises storage; Advanced hides the endpoint field",
    ],
    doesNot: "Nothing here is required before first use.",
  },
];

/** The header above the mock. */
export function ShowcaseIntro() {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-3">
        <Logo size={40} />
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
            EchoGPT, <span className="text-gradient">rebuilt around the first 90 seconds</span>
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
            <Badge micro tone="brand">Redesign concept</Badge>
            <span>Multi-AI Chat Sidebar · Manifest V3 · popup, side panel, settings</span>
          </p>
        </div>
      </div>

      <p className="mt-5 max-w-[70ch] text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        The shipping extension can already do the useful things — summarise a
        page, explain a selection, switch between models. It just asks for an
        account before it will show you any of them, buries the page tools
        behind a sidebar, and puts a custom API endpoint in front of every user.
        This is the same product with the order changed.
      </p>

      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Press</span>
        <Kbd keys={["mod", "Shift", "E"]} />
        <span>in the real extension, or use the toolbar icon in the mock below.</span>
      </p>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {SPLIT.map((card) => {
          const Icon = card.icon;
          return (
            <section
              key={card.title}
              className="rounded-lg border border-border bg-surface p-4 shadow-soft"
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="flex size-7 items-center justify-center rounded-sm bg-brand-500/12 text-brand-600 dark:text-brand-300"
                >
                  <Icon className="size-4" />
                </span>
                <h2 className="text-[13px] font-semibold tracking-tight">{card.title}</h2>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {card.size}
              </p>
              <ul className="mt-2.5 space-y-1">
                {card.does.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-500"
                    />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 border-t border-border pt-2 text-xs italic leading-relaxed text-muted-foreground">
                {card.doesNot}
              </p>
            </section>
          );
        })}
      </div>
    </header>
  );
}

const ASSUMPTIONS = [
  "Responses are simulated token-by-token in the browser. There is no backend, and no request leaves the page.",
  "The model catalogue is invented but internally consistent: one array drives the picker, the settings list and the Compare tab.",
  "Conversation history is sample data. The shape is real — every thread is bound to the page it started on.",
  "Sign-in is a local toggle, so you can see both states without an account existing.",
];

/** The footer below the audit. */
export function ShowcaseOutro() {
  return (
    <footer className="mt-16 border-t border-border pt-8">
      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold tracking-tight">
            What is real and what is mocked
          </h2>
          <ul className="mt-3 space-y-2">
            {ASSUMPTIONS.map((line) => (
              <li
                key={line}
                className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground"
              >
                <span
                  aria-hidden
                  className="mt-[7px] size-1 shrink-0 rounded-full bg-muted-foreground"
                />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-tight">
            It is also a real extension
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            These three routes are statically exported and repackaged as{" "}
            <code className="font-mono text-xs">popup.html</code>,{" "}
            <code className="font-mono text-xs">sidepanel.html</code> and{" "}
            <code className="font-mono text-xs">options.html</code> alongside a
            Manifest V3 service worker and a content script. Run{" "}
            <code className="rounded-xs border border-border bg-surface-2 px-1 py-px font-mono text-xs">
              npm run build:extension
            </code>{" "}
            and load the <code className="font-mono text-xs">dist/</code> folder
            through chrome://extensions → Load unpacked. Every surface detects{" "}
            <code className="font-mono text-xs">chrome.runtime.id</code> and
            switches between <code className="font-mono text-xs">chrome.storage</code>{" "}
            and localStorage, so the same build runs in both places.
          </p>
        </section>
      </div>

      <p className="mt-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Logo size={16} />
        EchoGPT redesign concept — built for the AppifyDevs frontend assessment.
        Not affiliated with EchoGPT.
      </p>
    </footer>
  );
}
