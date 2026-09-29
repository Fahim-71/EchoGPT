/**
 * The popup → side panel handoff.
 *
 * The redesign's surface split (audit item 7) only works if the popup can pass
 * a started conversation to the panel and then get out of the way. In the
 * extension that travels as a `chrome.runtime` message picked up by
 * `background.js`; in the hosted showcase the two surfaces are siblings in one
 * React tree, so the same payload is passed as a callback.
 */

export const HANDOFF_MESSAGE = "echogpt:handoff";
export const SELECTION_MESSAGE = "echogpt:selection";

export interface HandoffPayload {
  /** Prefilled composer text. */
  prompt: string;
  /** Model to answer with, if the popup's chip was changed. */
  modelId?: string;
  /** Which quick action produced this, for analytics-free attribution in the UI. */
  actionId?: string;
  /** An existing thread to resume instead of starting a new one. */
  threadId?: string;
  /** Text the user had selected on the page. */
  selection?: string;
  /** Send immediately rather than just filling the composer. */
  autoSend?: boolean;
}
