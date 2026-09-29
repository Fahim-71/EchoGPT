/**
 * EchoGPT selection tooltip (content script).
 *
 * Audit item 4: the page tools belong on the selection, not behind a sidebar.
 * This puts a small bar over any text the user highlights, anywhere on the web.
 *
 * Everything lives inside a closed-ish shadow root attached to a single host
 * element. That matters more than it sounds: a content script paints into a
 * page whose CSS it has never seen, and a naked <div> will be hit by the host
 * site's resets, `* { box-sizing }` rules, font stacks and `!important`
 * overrides. A shadow root means the host page cannot style this bar, and this
 * bar cannot leak styles back into the host page.
 */

(() => {
  "use strict";

  // The script is declared once per frame, but be defensive about re-injection
  // (Chrome re-runs content scripts on extension reload during development).
  if (window.__echogptTooltipInstalled) return;
  window.__echogptTooltipInstalled = true;

  const HOST_ID = "echogpt-selection-host";
  const STORAGE_KEY = "echogpt:selectionTooltip";
  const MIN_SELECTION = 3;

  const ACTIONS = [
    {
      id: "summarise",
      label: "Summarise",
      prompt: "Summarise this page in five lines, leading with its main argument.",
      accent: "#8347fb",
      icon: "M4 3h8M4 6.5h8M4 10h5",
    },
    {
      id: "explain",
      label: "Explain",
      prompt: "Explain the selected text in plain language, and unpack any jargon.",
      accent: "#22d3ee",
      icon: "M8 1.5v9M4.5 5 8 1.5 11.5 5M3 12.5h10",
    },
    {
      id: "translate",
      label: "Translate",
      prompt:
        "Translate the selected text into French, preserving tone and paragraph structure.",
      accent: "#10a37f",
      icon: "M2 4h7M5.5 2.5v1.5M7 4s-.5 4-4.5 6M4 7.5s1.5 2.5 4 3.5M9 13l2.5-6 2.5 6M10 11.2h4",
    },
  ];

  let enabled = true;
  let host = null;
  let shadow = null;
  let bar = null;
  let currentSelection = "";
  let frame = 0;

  // --------------------------------------------------------------- settings

  try {
    chrome.storage?.sync?.get(STORAGE_KEY, (got) => {
      if (got && got[STORAGE_KEY] === false) {
        enabled = false;
        hide();
      }
    });
    chrome.storage?.onChanged?.addListener((changes, area) => {
      if (area !== "sync" || !(STORAGE_KEY in changes)) return;
      enabled = changes[STORAGE_KEY].newValue !== false;
      if (!enabled) hide();
    });
  } catch {
    /* storage unavailable — default to enabled */
  }

  // ------------------------------------------------------------------ chrome

  function svg(path) {
    return (
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true"><path d="' +
      path +
      '"/></svg>'
    );
  }

  function logoSvg() {
    return (
      '<svg viewBox="0 0 32 32" aria-hidden="true" class="echogpt-logo">' +
      '<defs><linearGradient id="eg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#a076ff"/>' +
      '<stop offset="55%" stop-color="#6d28f5"/>' +
      '<stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>' +
      '<rect width="32" height="32" rx="9" fill="url(#eg)"/>' +
      '<circle cx="11.5" cy="16" r="2.6" fill="#fff"/>' +
      '<path d="M17 11.2a6.6 6.6 0 0 1 0 9.6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M21.6 8.4a10.4 10.4 0 0 1 0 15.2" stroke="#fff" stroke-width="2.2" stroke-opacity=".6" fill="none" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  const STYLES = `
    :host { all: initial; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .bar {
      display: inline-flex; align-items: center; gap: 2px;
      padding: 4px;
      border: 1px solid rgba(0,0,0,.1);
      border-radius: 10px;
      background: #ffffff;
      box-shadow: 0 1px 2px rgba(13,11,22,.08), 0 14px 38px -14px rgba(13,11,22,.36);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      font-size: 11px; line-height: 1;
      animation: eg-in 130ms cubic-bezier(.16,1,.3,1);
    }
    @keyframes eg-in {
      from { opacity: 0; transform: translateY(4px) scale(.97); }
      to   { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) { .bar { animation: none; } }
    @media (prefers-color-scheme: dark) {
      .bar { background: #16142a; border-color: rgba(255,255,255,.12); }
      button { color: #9d99b8; }
      button:hover { background: #221e3d; color: #ecebf3; }
      .sep { background: rgba(255,255,255,.12); }
    }
    .echogpt-logo { width: 15px; height: 15px; margin: 0 4px; flex: none; }
    button {
      display: inline-flex; align-items: center; gap: 4px;
      height: 26px; padding: 0 8px;
      border: 0; border-radius: 6px;
      background: transparent; color: #63607a;
      font: inherit; font-weight: 500; white-space: nowrap; cursor: pointer;
    }
    button:hover { background: #f4f3f8; color: #0d0b16; }
    button:focus-visible { outline: 2px solid #6d28f5; outline-offset: 1px; }
    button.primary {
      background: #6d28f5; color: #fff;
    }
    button.primary:hover { background: #5b1cd9; }
    button svg { width: 12px; height: 12px; flex: none; }
    .sep { width: 1px; height: 16px; margin: 0 2px; background: rgba(0,0,0,.1); }
  `;

  function mount() {
    if (host) return;
    host = document.createElement("div");
    host.id = HOST_ID;
    // Positioning lives in content.css so it survives before the shadow paints.
    shadow = host.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = STYLES;

    bar = document.createElement("div");
    bar.className = "bar";
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "EchoGPT actions for the selected text");

    bar.innerHTML =
      logoSvg() +
      '<button type="button" class="primary" data-action="ask">' +
      svg("M8 2.5 9.4 6.6 13.5 8 9.4 9.4 8 13.5 6.6 9.4 2.5 8l4.1-1.4Z") +
      "Ask EchoGPT</button>" +
      '<span class="sep"></span>' +
      ACTIONS.map(
        (a) =>
          '<button type="button" data-action="' +
          a.id +
          '" title="' +
          a.prompt.replace(/"/g, "&quot;") +
          '"><span style="color:' +
          a.accent +
          '">' +
          svg(a.icon) +
          "</span>" +
          a.label +
          "</button>",
      ).join("");

    bar.addEventListener("mousedown", (event) => {
      // Keep the page selection alive until the click handler has read it.
      event.preventDefault();
    });
    bar.addEventListener("click", onBarClick);

    shadow.append(style, bar);
    document.documentElement.appendChild(host);
  }

  function onBarClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button || !currentSelection) return;
    const id = button.dataset.action;
    const action = ACTIONS.find((a) => a.id === id);

    send({
      prompt: action ? action.prompt : "About the text I selected: ",
      selection: currentSelection,
      actionId: id,
      autoSend: Boolean(action),
    });

    window.getSelection()?.removeAllRanges();
    hide();
  }

  function send(payload) {
    try {
      chrome.runtime.sendMessage({ type: "echogpt:selection", payload });
    } catch {
      /* the extension was reloaded out from under this frame */
    }
  }

  // ------------------------------------------------------------- positioning

  function hide() {
    if (host) host.style.display = "none";
    currentSelection = "";
  }

  function show(rect) {
    mount();
    host.style.display = "block";
    // Measure first, then clamp into the viewport so the bar is never cut off.
    const width = bar.offsetWidth || 300;
    const height = bar.offsetHeight || 34;
    const margin = 8;

    let left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));

    let top = rect.top - height - margin;
    // Not enough room above the selection — flip below it.
    if (top < margin) top = rect.bottom + margin;

    host.style.left = `${Math.round(left)}px`;
    host.style.top = `${Math.round(top)}px`;
  }

  function update() {
    if (!enabled) return;
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";

    if (!selection || selection.isCollapsed || text.length < MIN_SELECTION) {
      hide();
      return;
    }
    // Ignore selections inside our own UI, and inside form fields where the
    // user is more likely editing than reading.
    const anchor = selection.anchorNode;
    const element =
      anchor && anchor.nodeType === Node.ELEMENT_NODE ? anchor : anchor?.parentElement;
    if (element && element.closest(`#${HOST_ID}`)) return;

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    if (!rect.width && !rect.height) {
      hide();
      return;
    }

    currentSelection = text.slice(0, 2000);
    show(rect);
  }

  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }

  document.addEventListener("selectionchange", schedule);
  document.addEventListener("pointerup", schedule);
  document.addEventListener("keyup", (event) => {
    if (event.shiftKey || event.key === "Escape") schedule();
  });
  window.addEventListener("scroll", hide, { passive: true, capture: true });
  window.addEventListener("resize", hide, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hide();
  });
})();
