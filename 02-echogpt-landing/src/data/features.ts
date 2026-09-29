/**
 * Bento grid content. `visual` picks which tiny live mock-up the card renders
 * (see `FeatureVisual`), `span` drives the grid layout at lg and up.
 */
export type FeatureVisual =
  | "models"
  | "sidebar"
  | "explain"
  | "compare"
  | "studio"
  | "connectors"
  | "privacy";

export type FeatureIcon =
  | "layers"
  | "panel"
  | "text-select"
  | "columns"
  | "image"
  | "plug"
  | "shield";

export interface Feature {
  id: string;
  icon: FeatureIcon;
  title: string;
  benefit: string;
  visual: FeatureVisual;
  /** Column span on the lg 6-column grid. */
  span: 2 | 3 | 4;
}

export const FEATURES: Feature[] = [
  {
    id: "multi-model",
    icon: "layers",
    title: "Every model, one thread",
    benefit:
      "Switch models mid-conversation without losing the thread or re-pasting context.",
    visual: "models",
    span: 4,
  },
  {
    id: "privacy",
    icon: "shield",
    title: "No third-party analytics",
    benefit:
      "HTTPS only, preferences stored locally on your machine, token-based sign-in.",
    visual: "privacy",
    span: 2,
  },
  {
    id: "sidebar",
    icon: "panel",
    title: "Summarise any page",
    benefit:
      "Open the sidebar on the page you're already reading and get the gist in seconds.",
    visual: "sidebar",
    span: 2,
  },
  {
    id: "explain",
    icon: "text-select",
    title: "Explain selected text",
    benefit:
      "Highlight a clause, a stack trace or a paragraph of jargon and ask right there.",
    visual: "explain",
    span: 2,
  },
  {
    id: "compare",
    icon: "columns",
    title: "Compare answers side by side",
    benefit:
      "Send one prompt to two models and judge the answers against each other.",
    visual: "compare",
    span: 2,
  },
  {
    id: "studio",
    icon: "image",
    title: "Image & Video Studio",
    benefit:
      "Generate and iterate on visuals in the same workspace as your chats.",
    visual: "studio",
    span: 3,
  },
  {
    id: "connectors",
    icon: "plug",
    title: "Connectors & your own endpoint",
    benefit:
      "Point EchoGPT at a configurable API endpoint, or wire in the tools you already use.",
    visual: "connectors",
    span: 3,
  },
];

/** Wordmark chips for the trust bar — text only, deliberately no logo images. */
export const MODEL_VENDORS: string[] = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Meta",
  "Mistral",
  "EchoGPT",
];
