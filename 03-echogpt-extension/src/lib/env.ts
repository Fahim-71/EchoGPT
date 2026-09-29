/**
 * Runtime environment detection.
 *
 * Every surface in this project renders in two very different places:
 *
 *  1. As a hosted web page (the Vercel showcase, and the standalone
 *     /popup, /sidepanel and /options routes) where `chrome` is undefined.
 *  2. As a real MV3 extension page, where `chrome.runtime.id` exists and
 *     `chrome.storage` / `chrome.tabs` are available.
 *
 * Nothing in `src/` may touch `chrome.*` without going through here, so a
 * missing `chrome` global can never throw.
 */

/** The subset of the chrome API this project actually uses. */
type ChromeLike = typeof chrome;

function rawChrome(): ChromeLike | undefined {
  if (typeof globalThis === "undefined") return undefined;
  const c = (globalThis as { chrome?: ChromeLike }).chrome;
  return c ?? undefined;
}

/**
 * True only inside a real extension context. `chrome` alone is not enough —
 * Chrome exposes a stub `window.chrome` on ordinary https pages too, so we
 * check for `runtime.id`, which only extension pages and content scripts get.
 */
export function isExtension(): boolean {
  try {
    const c = rawChrome();
    return Boolean(c?.runtime?.id);
  } catch {
    return false;
  }
}

/** The chrome API, or `undefined` on the web. Never throws. */
export function getChrome(): ChromeLike | undefined {
  return isExtension() ? rawChrome() : undefined;
}

export function hasChromeStorage(): boolean {
  return Boolean(getChrome()?.storage?.sync);
}

export function hasChromeTabs(): boolean {
  return Boolean(getChrome()?.tabs?.query);
}

/** Server-safe `window` check, for anything that must wait for hydration. */
export const isBrowser = typeof window !== "undefined";

export interface PageContext {
  title: string;
  url: string;
  /** Host only, e.g. "www.nature.com" — used for the favicon monogram. */
  host: string;
  /** Rough token count for "use this page as context". */
  tokens: number;
  /** Text the user had selected when the surface opened, if any. */
  selection?: string;
}

/** What the demo pretends the active tab is, when there is no real tab. */
export const DEMO_PAGE_CONTEXT: PageContext = {
  title: "The quiet economics of browser extensions",
  url: "https://www.the-verge-like.com/2026/extensions-economics",
  host: "www.the-verge-like.com",
  tokens: 2840,
};

/**
 * Reads the active tab in an extension, and falls back to the demo context on
 * the web. Always resolves — never rejects — so callers need no try/catch.
 */
export async function readActivePage(): Promise<PageContext> {
  const c = getChrome();
  if (!c?.tabs?.query) return DEMO_PAGE_CONTEXT;
  try {
    const [tab] = await c.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) return DEMO_PAGE_CONTEXT;
    const url = new URL(tab.url);
    return {
      title: tab.title ?? url.hostname,
      url: tab.url,
      host: url.hostname,
      // ~4 characters per token is the usual back-of-envelope; we have no page
      // text here, so scale from the title as a visible placeholder.
      tokens: Math.max(400, (tab.title?.length ?? 40) * 38),
    };
  } catch {
    return DEMO_PAGE_CONTEXT;
  }
}

/** Opens the side panel from the popup, where the API allows it. */
export async function openSidePanel(): Promise<boolean> {
  const c = getChrome();
  if (!c?.windows || !("sidePanel" in c)) return false;
  try {
    const win = await c.windows.getCurrent();
    if (win.id === undefined) return false;
    await (c as unknown as {
      sidePanel: { open: (o: { windowId: number }) => Promise<void> };
    }).sidePanel.open({ windowId: win.id });
    return true;
  } catch {
    return false;
  }
}

/** Opens the options page, or navigates there on the web. */
export function openOptions(): void {
  const c = getChrome();
  if (c?.runtime?.openOptionsPage) {
    c.runtime.openOptionsPage();
    return;
  }
  if (isBrowser) window.location.href = "/options";
}
