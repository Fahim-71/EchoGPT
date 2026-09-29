export type CellState = "yes" | "no" | "partial";

export interface ComparisonCell {
  state: CellState;
  /** Short qualifier shown next to the mark. */
  text: string;
}

export interface ComparisonRow {
  id: string;
  criterion: string;
  echogpt: ComparisonCell;
  subscriptions: ComparisonCell;
  tabs: ComparisonCell;
}

export const COMPARISON_COLUMNS = [
  { id: "echogpt", label: "EchoGPT", highlight: true },
  { id: "subscriptions", label: "One subscription per model", highlight: false },
  { id: "tabs", label: "Switching tabs all day", highlight: false },
] as const;

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    id: "breadth",
    criterion: "Access to models from several vendors",
    echogpt: { state: "yes", text: "One picker, one thread" },
    subscriptions: { state: "partial", text: "Yes — at three prices" },
    tabs: { state: "partial", text: "Yes, if you keep the tabs open" },
  },
  {
    id: "context",
    criterion: "Keeps context when you change model",
    echogpt: { state: "yes", text: "Same conversation carries over" },
    subscriptions: { state: "no", text: "Re-paste into the other app" },
    tabs: { state: "no", text: "Re-paste into the other tab" },
  },
  {
    id: "onpage",
    criterion: "Works on the page you're already reading",
    echogpt: { state: "yes", text: "Sidebar on any site" },
    subscriptions: { state: "no", text: "Copy the page out first" },
    tabs: { state: "no", text: "Copy the page out first" },
  },
  {
    id: "compare",
    criterion: "Compare two answers to the same prompt",
    echogpt: { state: "yes", text: "Built in, side by side" },
    subscriptions: { state: "partial", text: "Manually, across two apps" },
    tabs: { state: "partial", text: "Manually, across two tabs" },
  },
  {
    id: "cost",
    criterion: "Monthly cost for multi-vendor access",
    echogpt: { state: "yes", text: "One plan, free tier included" },
    subscriptions: { state: "no", text: "Three plans, three invoices" },
    tabs: { state: "partial", text: "Free tiers, heavily rate-limited" },
  },
  {
    id: "privacy",
    criterion: "No third-party analytics",
    echogpt: { state: "yes", text: "Preferences stay local" },
    subscriptions: { state: "partial", text: "Varies per vendor" },
    tabs: { state: "partial", text: "Varies per vendor" },
  },
  {
    id: "studios",
    criterion: "Image and video generation in the same place",
    echogpt: { state: "yes", text: "Image & Video Studio" },
    subscriptions: { state: "partial", text: "Another subscription" },
    tabs: { state: "no", text: "Another tab" },
  },
];

export interface Stat {
  id: string;
  value: string;
  label: string;
  detail: string;
}

export const STATS: Stat[] = [
  {
    id: "models",
    value: "8+",
    label: "models in one picker",
    detail: "Across OpenAI, Anthropic, Google, Meta, Mistral and EchoGPT.",
  },
  {
    id: "analytics",
    value: "0",
    label: "third-party analytics scripts",
    detail: "HTTPS only, preferences stored locally in your browser.",
  },
  {
    id: "size",
    value: "76 KB",
    label: "extension download",
    detail: "Version 1.0.5, rated 5.0 in the Tools category.",
  },
];
