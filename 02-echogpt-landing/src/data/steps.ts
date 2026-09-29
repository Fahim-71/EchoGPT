export interface Step {
  id: string;
  title: string;
  body: string;
  /** Monospace hint rendered under the copy — a shortcut, click target or URL. */
  hint: string;
}

export const STEPS: Step[] = [
  {
    id: "install",
    title: "Add it to Chrome",
    body: "76 KB from the Chrome Web Store. No account needed to install, and nothing to configure before your first question.",
    hint: "chromewebstore.google.com → Add to Chrome",
  },
  {
    id: "open",
    title: "Open the sidebar anywhere",
    body: "Press the shortcut on any tab and EchoGPT slides in beside the page. Passing that page as context is one toggle, and it's off until you ask.",
    hint: "Ctrl+Shift+E  /  Cmd+Shift+E",
  },
  {
    id: "ask",
    title: "Pick a model and ask",
    body: "Choose the model that fits the job — fast for a quick lookup, reasoning for the hard one — and switch mid-thread whenever the question changes shape.",
    hint: "Composer → model picker → Send",
  },
];
