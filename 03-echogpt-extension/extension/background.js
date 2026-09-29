/**
 * EchoGPT service worker (MV3).
 *
 * Three jobs, all of them in service of the audit:
 *
 *  - Own the side panel, so the popup and the keyboard command can both hand a
 *    conversation to it (audit item 7).
 *  - Register the quick actions as context-menu entries on text selection, so
 *    the page tools meet the user on the selection rather than behind a
 *    sidebar (audit item 4).
 *  - Relay selections from the content script's tooltip into the panel.
 *
 * A service worker is evicted when idle, so nothing is kept in module scope
 * that matters; anything durable goes through chrome.storage.
 */

const SELECTION_MESSAGE = "echogpt:selection";
const STORAGE_PREFIX = "echogpt:";

/**
 * Mirrors `src/data/quickActions.ts`. The two lists are duplicated rather than
 * imported because the service worker is plain JS outside the Next build — the
 * ids and prompts must stay in step, so both files say so.
 */
const QUICK_ACTIONS = [
  {
    id: "summarise",
    label: "Summarise page",
    scope: "page",
    prompt: "Summarise this page in five lines, leading with its main argument.",
  },
  {
    id: "explain",
    label: "Explain selection",
    scope: "selection",
    prompt: "Explain the selected text in plain language, and unpack any jargon.",
  },
  {
    id: "translate",
    label: "Translate",
    scope: "selection",
    prompt:
      "Translate the selected text into French, preserving tone and paragraph structure.",
  },
  {
    id: "key-points",
    label: "Key points",
    scope: "page",
    prompt: "Pull out the key points of this page as scannable bullets.",
  },
  {
    id: "tasks",
    label: "Extract tasks",
    scope: "page",
    prompt:
      "Extract every action item from this page as a checklist. Do not invent owners or dates.",
  },
  {
    id: "rewrite",
    label: "Rewrite selection",
    scope: "selection",
    prompt: "Rewrite the selected text to be tighter while keeping the meaning.",
  },
];

// --------------------------------------------------------------- side panel

// Clicking the toolbar icon opens the popup (default_popup), so the panel is
// opened explicitly — from the popup, the command, or a context-menu action.
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch(() => {});
  rebuildContextMenus();
});

chrome.runtime.onStartup?.addListener(rebuildContextMenus);

async function openPanel(windowId, tabId) {
  try {
    if (tabId !== undefined) {
      await chrome.sidePanel.setOptions({
        tabId,
        path: "sidepanel.html",
        enabled: true,
      });
    }
    await chrome.sidePanel.open(
      windowId !== undefined ? { windowId } : { tabId },
    );
    return true;
  } catch (error) {
    console.warn("[EchoGPT] could not open the side panel:", error);
    return false;
  }
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "open-side-panel") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await openPanel(tab?.windowId, tab?.id);
});

// --------------------------------------------------------------- messaging

/**
 * The panel may still be booting when a selection arrives, so the payload is
 * also parked in session storage; `sidepanel.html` drains it on mount.
 */
async function sendToPanel(payload) {
  try {
    await chrome.storage.session.set({ [`${STORAGE_PREFIX}pending`]: payload });
  } catch {
    /* session storage is unavailable in some channels — the message still goes */
  }
  try {
    await chrome.runtime.sendMessage({ type: SELECTION_MESSAGE, payload });
  } catch {
    // No receiver yet. The panel will pick the payload up from session storage.
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== "object") return undefined;

  if (message.type === "echogpt:handoff" || message.type === SELECTION_MESSAGE) {
    (async () => {
      const windowId = sender.tab?.windowId;
      const tabId = sender.tab?.id;
      await openPanel(windowId, tabId);
      await sendToPanel(message.payload ?? {});
      sendResponse({ ok: true });
    })();
    return true; // keep the channel open for the async response
  }

  if (message.type === "echogpt:open-panel") {
    (async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      sendResponse({ ok: await openPanel(tab?.windowId, tab?.id) });
    })();
    return true;
  }

  return undefined;
});

// ------------------------------------------------------------ context menus

/**
 * Rebuilt from scratch whenever the user's enabled/ordered action list
 * changes, so the right-click menu always matches the popup grid.
 */
async function rebuildContextMenus() {
  await chrome.contextMenus.removeAll();

  let enabled = QUICK_ACTIONS.map((a) => a.id);
  let order = enabled;
  try {
    const stored = await chrome.storage.sync.get([
      `${STORAGE_PREFIX}enabledActions`,
      `${STORAGE_PREFIX}actionOrder`,
    ]);
    enabled = stored[`${STORAGE_PREFIX}enabledActions`] ?? enabled;
    order = stored[`${STORAGE_PREFIX}actionOrder`] ?? order;
  } catch {
    /* first run, or storage not ready — fall back to every action */
  }

  chrome.contextMenus.create({
    id: "echogpt-ask",
    title: 'Ask EchoGPT about "%s"',
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: "echogpt-separator",
    type: "separator",
    contexts: ["selection"],
  });

  const ordered = order
    .map((id) => QUICK_ACTIONS.find((a) => a.id === id))
    .filter((a) => a && enabled.includes(a.id));

  for (const action of ordered) {
    chrome.contextMenus.create({
      id: `echogpt-${action.id}`,
      title: action.label,
      contexts: action.scope === "selection" ? ["selection"] : ["page", "selection"],
    });
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (
    `${STORAGE_PREFIX}enabledActions` in changes ||
    `${STORAGE_PREFIX}actionOrder` in changes
  ) {
    rebuildContextMenus();
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const id = String(info.menuItemId);
  if (!id.startsWith("echogpt-")) return;

  await openPanel(tab?.windowId, tab?.id);

  if (id === "echogpt-ask") {
    await sendToPanel({
      prompt: "About the text I selected: ",
      selection: info.selectionText ?? "",
      actionId: "ask",
      autoSend: false,
    });
    return;
  }

  const action = QUICK_ACTIONS.find((a) => `echogpt-${a.id}` === id);
  if (!action) return;

  await sendToPanel({
    prompt: action.prompt,
    selection: action.scope === "selection" ? (info.selectionText ?? "") : undefined,
    actionId: action.id,
    autoSend: true,
  });
});
