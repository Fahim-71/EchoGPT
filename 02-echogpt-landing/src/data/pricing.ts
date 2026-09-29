export interface PricingTier {
  id: string;
  name: string;
  /** Monthly price in USD when billed monthly. 0 = free. */
  monthly: number;
  /** Monthly-equivalent price in USD when billed annually. */
  annual: number;
  tagline: string;
  cta: { label: string; href: string };
  popular?: boolean;
  features: string[];
  /** Per-tier caveat shown under the checklist. */
  note?: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: 0,
    tagline: "Everything you need to stop paying for three chatbots.",
    cta: { label: "Add to Chrome", href: "chrome" },
    features: [
      "Chrome sidebar on every site",
      "Free-tier models, unlimited chats",
      "Webpage summaries & explain selection",
      "Dark mode and keyboard shortcut",
      "Chat history on this device",
    ],
    note: "No card required. Free-tier models only.",
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 12,
    annual: 9,
    tagline: "The full model catalogue plus the studios.",
    cta: { label: "Start Pro", href: "web" },
    popular: true,
    features: [
      "Everything in Free",
      "All premium models (GPT-4o, Claude, Gemini, o3)",
      "Side-by-side Compare on every prompt",
      "Image Studio & Video Studio",
      "Connectors and file uploads",
      "Bring your own API endpoint",
      "Synced history across devices",
    ],
    note: "Fair-use limits apply to premium reasoning models.",
  },
  {
    id: "team",
    name: "Team",
    monthly: 24,
    annual: 19,
    tagline: "Shared prompts and one invoice for the whole team.",
    cta: { label: "Talk to us", href: "web" },
    features: [
      "Everything in Pro, per seat",
      "Shared prompt library and SOP Builder",
      "AI Job Analysis workspace",
      "Google Workspace sign-in",
      "Centralised billing and seat management",
      "Priority support",
    ],
    note: "Billed per seat, minimum three seats.",
  },
];

export const PRICING_FOOTNOTE =
  "Prices are illustrative for this assessment build — EchoGPT does not publish a public price sheet. Annual billing is shown as the monthly equivalent and charged once a year. The Chrome extension itself is free on the Web Store.";
