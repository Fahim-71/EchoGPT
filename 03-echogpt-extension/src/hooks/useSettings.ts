"use client";

import { DEFAULT_ENABLED_ACTION_IDS, QUICK_ACTIONS } from "@/data/quickActions";
import { useChromeStorage } from "@/hooks/useChromeStorage";
import { DEFAULT_MODEL_ID, MODELS } from "@/lib/models";

/**
 * The persisted preference surface, in one place.
 *
 * Every one of these is written by the options page and read live by the popup
 * and side panel — inside the extension that round trip goes through
 * `chrome.storage.sync`, so a change on one surface lands on the other without
 * a reload.
 */
export const DEFAULT_ENDPOINT = "https://api.echogpt.live/v1";

export function useDefaultModel() {
  return useChromeStorage<string>("defaultModel", DEFAULT_MODEL_ID);
}

/** Order is meaningful: it is the order shown in the popup grid. */
export function useActionOrder() {
  return useChromeStorage<string[]>("actionOrder", DEFAULT_ENABLED_ACTION_IDS);
}

export function useEnabledActions() {
  return useChromeStorage<string[]>("enabledActions", DEFAULT_ENABLED_ACTION_IDS);
}

export function useEnabledModels() {
  return useChromeStorage<string[]>(
    "enabledModels",
    MODELS.map((m) => m.id),
  );
}

export function usePageContextDefault() {
  return useChromeStorage<boolean>("pageContextDefault", true);
}

export function useSelectionTooltipEnabled() {
  return useChromeStorage<boolean>("selectionTooltip", true);
}

export function useDensity() {
  return useChromeStorage<"cosy" | "compact">("density", "cosy");
}

export function useCustomEndpoint() {
  return useChromeStorage<string>("customEndpoint", "");
}

export function useStreamResponses() {
  return useChromeStorage<boolean>("streamResponses", true);
}

export function useSignedIn() {
  return useChromeStorage<boolean>("signedIn", false);
}

/** Resolves the stored order + enabled set into the list a surface renders. */
export function resolveActions(order: string[], enabled: string[]) {
  const known = new Map(QUICK_ACTIONS.map((a) => [a.id, a]));
  const ordered = order.map((id) => known.get(id)).filter((a) => a !== undefined);
  // Anything added by a later release that the stored order has never seen.
  const missing = QUICK_ACTIONS.filter((a) => !order.includes(a.id));
  return [...ordered, ...missing].filter((a) => enabled.includes(a.id));
}
