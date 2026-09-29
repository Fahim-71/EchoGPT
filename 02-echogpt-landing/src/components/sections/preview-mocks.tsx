import type { ReactNode } from "react";
import { CAPABILITY_LABEL, MODELS } from "@/lib/models";

/**
 * The four "screenshots" behind the product tabs. Every one is responsive DOM
 * inside a browser frame — no images anywhere — so they restack on a phone and
 * follow the active theme.
 */

const bar = "h-2 rounded-full bg-surface-3";

function Lines({ widths, tone = bar }: { widths: string[]; tone?: string }) {
  return (
    <div className="space-y-1.5">
      {widths.map((w, i) => (
        <span key={i} className={`block ${tone}`} style={{ width: w }} />
      ))}
    </div>
  );
}

function Bubble({
  side,
  children,
}: {
  side: "user" | "ai";
  children: ReactNode;
}) {
  return (
    <div className={side === "user" ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          side === "user"
            ? "max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3 py-2 text-[11px] leading-relaxed text-primary-foreground"
            : "max-w-[90%] rounded-xl rounded-bl-sm border border-border bg-surface-2 px-3 py-2 text-[11px] leading-relaxed text-foreground"
        }
      >
        {children}
      </div>
    </div>
  );
}

/** Full web app: rail, thread, composer. */
export function WebAppMock() {
  return (
    <div className="grid min-h-[22rem] grid-cols-1 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <aside className="hidden flex-col gap-1 border-r border-border bg-surface-2 p-3 sm:flex">
        <span className="rounded-md bg-primary px-2 py-1.5 text-[10px] font-semibold text-primary-foreground">
          + New chat
        </span>
        {["Chat", "Image Studio", "Video Studio", "Compare", "Connectors", "History", "Store"].map(
          (item, i) => (
            <span
              key={item}
              className={`rounded-md px-2 py-1.5 text-[10px] ${
                i === 0 ? "bg-surface-3 font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {item}
            </span>
          ),
        )}
      </aside>

      <div className="flex flex-col p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
          <span className="size-2 rounded-full" style={{ backgroundColor: "#10a37f" }} />
          <span className="text-[11px] font-semibold text-foreground">GPT-4o</span>
          <span className="rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
            switch model
          </span>
        </div>

        <div className="flex-1 space-y-3">
          <Bubble side="user">What changed in the Q3 pricing memo?</Bubble>
          <Bubble side="ai">
            <p className="mb-2">Three things moved:</p>
            <Lines widths={["100%", "92%", "70%"]} />
          </Bubble>
          <Bubble side="user">Now answer as if I'm the finance lead.</Bubble>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <span className="text-[11px] text-muted-foreground">Ask anything…</span>
          <span className="h-3.5 w-px bg-brand-500 animate-caret" />
          <span className="ml-auto rounded-md bg-primary px-2 py-1 text-[9px] font-semibold text-primary-foreground">
            Send
          </span>
        </div>
      </div>
    </div>
  );
}

/** Chrome sidebar docked beside an article. */
export function SidebarMock() {
  return (
    <div className="grid min-h-[22rem] grid-cols-1 sm:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="space-y-3 p-4">
        <span className="block h-3 w-2/3 rounded bg-surface-3" />
        <Lines widths={["100%", "96%", "88%", "100%", "74%", "92%", "60%"]} />
        <Lines widths={["100%", "84%", "94%", "68%"]} />
      </div>

      <div className="flex flex-col border-t border-border bg-surface-2 p-3 sm:border-l sm:border-t-0">
        <div className="flex items-center gap-2 pb-2.5">
          <span className="size-2 rounded-full bg-brand-500" />
          <span className="text-[10px] font-semibold text-foreground">EchoGPT</span>
          <span className="ml-auto font-mono text-[9px] text-muted-foreground">
            Ctrl+Shift+E
          </span>
        </div>
        <div className="mb-2.5 flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-[9px] text-muted-foreground">
          <span className="flex h-3 w-5 items-center rounded-full bg-brand-500 px-0.5">
            <span className="ml-auto size-2.5 rounded-full bg-white" />
          </span>
          Use this page as context
        </div>
        <div className="space-y-2.5">
          <Bubble side="user">Summarise this page</Bubble>
          <Bubble side="ai">
            <Lines
              widths={["100%", "90%", "96%", "62%"]}
              tone="h-1.5 rounded-full bg-brand-500/30"
            />
          </Bubble>
        </div>
      </div>
    </div>
  );
}

/** Two models answering the same prompt. */
export function CompareMock() {
  const pair = [MODELS[1], MODELS[2]];
  return (
    <div className="min-h-[22rem] p-3 sm:p-4">
      <div className="mb-3 rounded-lg border border-border bg-surface-2 px-3 py-2 text-[11px] text-foreground">
        “Draft a two-line answer to this RFP question, then flag anything risky.”
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {pair.map((model) => (
          <div key={model.id} className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: model.accent }}
              />
              <span className="text-[11px] font-semibold text-foreground">
                {model.name}
              </span>
              <span className="ml-auto rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
                {model.contextK}K ctx
              </span>
            </div>
            <div className="mt-2.5 space-y-2">
              <Lines widths={["100%", "94%", "88%", "72%"]} />
              <Lines widths={["96%", "80%"]} />
            </div>
            <div className="mt-3 flex gap-1.5">
              {model.capabilities.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground"
                >
                  {CAPABILITY_LABEL[c]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span className="rounded-md border border-brand-400/60 bg-brand-500/10 px-2 py-1 font-medium text-brand-600 dark:text-brand-300">
          Keep this one
        </span>
        <span>· continue the thread with the answer you preferred</span>
      </div>
    </div>
  );
}

/** Image Studio grid with a prompt row. */
export function StudioMock() {
  const gradients = [
    "from-brand-500 to-accent-400",
    "from-amber-400 to-rose-500",
    "from-emerald-400 to-cyan-500",
    "from-fuchsia-500 to-brand-600",
    "from-sky-400 to-indigo-500",
    "from-rose-400 to-orange-400",
  ];
  return (
    <div className="min-h-[22rem] p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2">
        <span className="text-[11px] text-foreground">
          “isometric illustration of a browser sidebar, violet and cyan”
        </span>
        <span className="ml-auto flex gap-1.5">
          {["1:1", "16:9", "4:5"].map((r, i) => (
            <span
              key={r}
              className={`rounded px-1.5 py-0.5 text-[9px] ${
                i === 1
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {r}
            </span>
          ))}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {gradients.map((g, i) => (
          <span
            key={i}
            className={`aspect-square rounded-lg bg-gradient-to-br ${g} opacity-85`}
          />
        ))}
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground">
        Video Studio sits on the same tab — same prompt box, same history.
      </p>
    </div>
  );
}
