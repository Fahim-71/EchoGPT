import type { ReactElement } from "react";
import type { FeatureVisual } from "@/data/features";

const PICKER: { name: string; color: string; active?: boolean }[] = [
  { name: "GPT-4o", color: "#10a37f", active: true },
  { name: "Claude Sonnet", color: "#d97757" },
  { name: "Gemini Pro", color: "#4285f4" },
  { name: "Llama 3 70B", color: "#0668e1" },
  { name: "Mistral Large", color: "#fa520f" },
  { name: "Echo Flash", color: "#22d3ee" },
];

const PRIVACY_ROWS: { label: string; on: boolean }[] = [
  { label: "HTTPS only", on: true },
  { label: "Preferences stored locally", on: true },
  { label: "Third-party analytics", on: false },
];

const COMPARE_COLUMNS: { name: string; color: string; widths: string[] }[] = [
  { name: "GPT-4o", color: "#10a37f", widths: ["100%", "78%"] },
  { name: "Claude", color: "#d97757", widths: ["86%", "96%"] },
];

/**
 * The tiny live mock-ups inside each bento card. Every one is real DOM —
 * gradients, borders and text — so they inherit the theme and scale with the
 * card instead of being a fixed-size screenshot. All decorative, so the whole
 * set is hidden from assistive tech; the card's title and benefit carry the
 * meaning.
 */
export function FeatureVisual({ kind }: { kind: FeatureVisual }) {
  return (
    <div aria-hidden="true" className="mt-5">
      {RENDERERS[kind]()}
    </div>
  );
}

const shell =
  "rounded-lg border border-border bg-background-subtle p-3 overflow-hidden";

const RENDERERS: Record<FeatureVisual, () => ReactElement> = {
  models: () => (
    <div className={shell}>
      <div className="flex flex-wrap gap-1.5">
        {PICKER.map((m) => (
          <span
            key={m.name}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium ${
              m.active
                ? "border-brand-400 bg-brand-500/10 text-foreground"
                : "border-border bg-surface text-muted-foreground"
            }`}
          >
            <span className="size-1.5 rounded-full" style={{ backgroundColor: m.color }} />
            {m.name}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-2">
        <span className="text-[10px] text-muted-foreground">
          …still the same conversation
        </span>
        <span className="ml-auto h-3 w-px bg-brand-500 animate-caret" />
      </div>
    </div>
  ),

  privacy: () => (
    <div className={shell}>
      <ul className="space-y-2">
        {PRIVACY_ROWS.map((row) => (
          <li key={row.label} className="flex items-center gap-2 text-[11px]">
            <span
              className={`grid size-4 shrink-0 place-items-center rounded-full text-[9px] font-bold ${
                row.on
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/15 text-red-600 dark:text-red-400"
              }`}
            >
              {row.on ? "✓" : "✕"}
            </span>
            <span
              className={
                row.on ? "text-foreground" : "text-muted-foreground line-through"
              }
            >
              {row.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ),

  sidebar: () => (
    <div className={`${shell} flex gap-2 p-2`}>
      <div className="flex-1 space-y-1.5 rounded-md bg-surface p-2">
        {["88%", "100%", "72%", "94%", "60%"].map((w, i) => (
          <span key={i} className="block h-1.5 rounded-full bg-surface-3" style={{ width: w }} />
        ))}
      </div>
      <div className="w-[38%] shrink-0 rounded-md border border-brand-400/50 bg-brand-500/5 p-2">
        <span className="text-[9px] font-semibold text-brand-600 dark:text-brand-300">
          Summary
        </span>
        <div className="mt-1.5 space-y-1">
          {["100%", "84%", "92%"].map((w, i) => (
            <span
              key={i}
              className="block h-1.5 rounded-full bg-brand-500/35"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </div>
  ),

  explain: () => (
    <div className={shell}>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        …the licensee shall{" "}
        <mark className="rounded bg-brand-500/25 px-1 text-foreground">
          indemnify and hold harmless
        </mark>{" "}
        the licensor…
      </p>
      <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-medium text-foreground shadow-soft">
        <span className="size-1.5 rounded-full bg-brand-500" />
        Explain with EchoGPT
      </div>
    </div>
  ),

  compare: () => (
    <div className={`${shell} grid grid-cols-2 gap-2 p-2`}>
      {COMPARE_COLUMNS.map(({ name, color, widths }) => (
        <div key={name} className="rounded-md bg-surface p-2">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-semibold text-foreground">{name}</span>
          </div>
          <div className="mt-1.5 space-y-1">
            {widths.map((w, i) => (
              <span key={i} className="block h-1.5 rounded-full bg-surface-3" style={{ width: w }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),

  studio: () => (
    <div className={`${shell} grid grid-cols-4 gap-2 p-2`}>
      {[
        "from-brand-500 to-accent-400",
        "from-amber-400 to-rose-500",
        "from-emerald-400 to-cyan-500",
        "from-fuchsia-500 to-brand-600",
      ].map((g, i) => (
        <span
          key={i}
          className={`aspect-square rounded-md bg-gradient-to-br ${g} opacity-80`}
        />
      ))}
    </div>
  ),

  connectors: () => (
    <div className={shell}>
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-[9px] text-muted-foreground">
          POST /v1/chat
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-brand-500/60 to-accent-400/60" />
        <span className="rounded-md border border-brand-400/50 bg-brand-500/10 px-2 py-1 text-[9px] font-semibold text-brand-600 dark:text-brand-300">
          your endpoint
        </span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {["Drive", "Notion", "Slack", "GitHub"].map((c) => (
          <span
            key={c}
            className="rounded border border-border bg-surface px-1.5 py-0.5 text-[9px] text-muted-foreground"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  ),
};
