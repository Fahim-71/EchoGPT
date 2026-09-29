/**
 * The UX audit, as data. The showcase renders it and the README repeats it, so
 * the two can never disagree about what the redesign claims to fix.
 */

export interface RationaleItem {
  id: string;
  /** The problem in the shipping v1.0.5 extension. */
  problem: string;
  /** Why it costs the product something. */
  cost: string;
  /** What this redesign does instead. */
  fix: string;
  /** Where to look in the demo. */
  surface: string;
}

export const RATIONALE: RationaleItem[] = [
  {
    id: "signin-wall",
    problem: "Sign-in is a hard wall before any value is seen",
    cost:
      "The install → sign in → chat order charges the user their full cost before paying anything out. Anyone unsure whether the extension is good quits at a login form.",
    fix:
      "The popup opens straight into Quick Actions. Summarise, explain and translate all run unauthenticated against the current page. The account chip reads “Guest — local only”, and sign-in is offered as an upgrade (sync across devices, longer history) at the moment it would actually buy something, not before.",
    surface: "Popup",
  },
  {
    id: "api-endpoint",
    problem: "A custom API endpoint sits among the primary settings",
    cost:
      "It is a power-user escape hatch presented as a first-run decision. Every user has to read and dismiss a field that almost none of them should touch, and it makes the product look like infrastructure rather than a tool.",
    fix:
      "Settings are ordered by who needs them. Account, Models, Quick Actions, Appearance, Shortcuts and Privacy come first. The endpoint moved into Advanced, behind a closed disclosure with a plain-language warning and a Reset to default button.",
    surface: "Options → Advanced",
  },
  {
    id: "model-blindness",
    problem: "Model switching gives no signal about what each model is for",
    cost:
      "A list of names is a quiz. Without speed, cost or strengths, users either never switch or switch at random, and then blame the product for the result.",
    fix:
      "The model picker shows a vendor, a one-line blurb, capability chips, a speed meter, a cost meter, the context window and a Free badge. The chosen model's identity dot then follows it into the composer, each message and the Compare tab.",
    surface: "Side panel → composer",
  },
  {
    id: "buried-tools",
    problem: "Page tools live behind the sidebar, away from the user's attention",
    cost:
      "Explaining a paragraph means selecting it, finding the toolbar icon, opening the panel and re-establishing what you meant. The interaction costs more than the answer is worth.",
    fix:
      "A content script puts a selection tooltip on the selection itself — Ask, Summarise, Explain — rendered in a shadow root so no host page CSS can touch it. The same actions are registered as right-click context menu entries by the service worker.",
    surface: "Showcase → select text in the article",
  },
  {
    id: "no-history",
    problem: "No visible conversation history, and no way to resume a thread",
    cost:
      "Every session starts from zero. Work done on a page yesterday is unrecoverable, which quietly caps the product at one-off questions.",
    fix:
      "Threads are bound to the page that started them. The popup lists the last three with page favicons; the side panel has a History tab with search, pinning and a “on this page” filter so returning to an article resumes the conversation about it.",
    surface: "Side panel → History",
  },
  {
    id: "one-shortcut",
    problem: "One keyboard shortcut for the whole product, and nothing in-surface",
    cost:
      "A single global chord cannot address six actions and eight models, and nothing in the interface teaches the keyboard path, so the shortcut is used once and forgotten.",
    fix:
      "Ctrl/Cmd+Shift+E still opens the popup and a second command opens the side panel directly. Inside the composer, slash commands map to every quick action, and shortcut hints are printed where the action is, not only in Settings.",
    surface: "Side panel → type “/”",
  },
  {
    id: "surface-split",
    problem: "Popup and side panel have undefined, overlapping responsibilities",
    cost:
      "Two chat windows that do the same thing, one of which vanishes when you click the page. The user cannot predict which surface will hold their work.",
    fix:
      "The popup is a launcher: status, one input, six actions, three recent threads — it hands every conversation off to the side panel and closes. The side panel is the only place a conversation lives, because it is the only surface that survives a click on the page.",
    surface: "Showcase → both open at once",
  },
];
