import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Highlighter,
  Languages,
  ListChecks,
  PencilLine,
  ClipboardList,
} from "lucide-react";

/**
 * The six page-level actions. These are the product's real value proposition —
 * in the current extension they are buried inside the sidebar, so here they are
 * surfaced in three places at once: the popup grid, the selection tooltip, and
 * the right-click context menu registered by the service worker.
 */
export type QuickActionScope = "page" | "selection";

export interface QuickAction {
  id: string;
  label: string;
  /** Shown in the popup tile and as the tooltip body. */
  hint: string;
  icon: LucideIcon;
  scope: QuickActionScope;
  /** Prefilled into the composer verbatim, so the user can edit before sending. */
  prompt: string;
  /** Slash command alias typed in the composer. */
  slash: string;
  /** Tile tint — a hue per action keeps the grid scannable at 400px. */
  accent: string;
  /** Whether it appears in the compact selection tooltip (max 3). */
  inTooltip?: boolean;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "summarise",
    label: "Summarise page",
    hint: "Five lines, argument first",
    icon: FileText,
    scope: "page",
    prompt: "Summarise this page in five lines, leading with its main argument.",
    slash: "/summarise",
    accent: "#8347fb",
    inTooltip: true,
  },
  {
    id: "explain",
    label: "Explain selection",
    hint: "Plain-language breakdown",
    icon: Highlighter,
    scope: "selection",
    prompt: "Explain the selected text in plain language, and unpack any jargon.",
    slash: "/explain",
    accent: "#22d3ee",
    inTooltip: true,
  },
  {
    id: "translate",
    label: "Translate",
    hint: "Keep tone and structure",
    icon: Languages,
    scope: "selection",
    prompt:
      "Translate the selected text into French, preserving tone and paragraph structure.",
    slash: "/translate",
    accent: "#10a37f",
    inTooltip: true,
  },
  {
    id: "key-points",
    label: "Key points",
    hint: "Scannable bullets",
    icon: ListChecks,
    scope: "page",
    prompt: "Pull out the key points of this page as scannable bullets.",
    slash: "/key-points",
    accent: "#f59e0b",
  },
  {
    id: "tasks",
    label: "Extract tasks",
    hint: "Action items only",
    icon: ClipboardList,
    scope: "page",
    prompt:
      "Extract every action item from this page as a checklist. Do not invent owners or dates.",
    slash: "/tasks",
    accent: "#ec4899",
  },
  {
    id: "rewrite",
    label: "Rewrite selection",
    hint: "Tighter, same meaning",
    icon: PencilLine,
    scope: "selection",
    prompt: "Rewrite the selected text to be tighter while keeping the meaning.",
    slash: "/rewrite",
    accent: "#0668e1",
  },
];

export const DEFAULT_ENABLED_ACTION_IDS = QUICK_ACTIONS.map((a) => a.id);

export function getQuickAction(id: string): QuickAction | undefined {
  return QUICK_ACTIONS.find((a) => a.id === id);
}

/**
 * Resolves a user-entered slash command to an action. Matches on prefix so
 * `/sum` finds `/summarise` while the user is still typing.
 */
export function matchSlash(input: string): QuickAction[] {
  const q = input.trim().toLowerCase();
  if (!q.startsWith("/")) return [];
  return QUICK_ACTIONS.filter((a) => a.slash.startsWith(q));
}
