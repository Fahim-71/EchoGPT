/**
 * Sample conversation history.
 *
 * Timestamps are stored as an offset in hours and resolved against a single
 * module-level reference time, so the same list groups identically on the
 * server and on the client instead of drifting with every render.
 */

export interface Conversation {
  id: string;
  title: string;
  /** First line of the last assistant turn — used as the list preview. */
  preview: string;
  modelId: string;
  messageCount: number;
  hoursAgo: number;
  pinned?: boolean;
  archived?: boolean;
  tags: string[];
}

export const REFERENCE_NOW = Date.now();

export function conversationTime(hoursAgo: number): string {
  return new Date(REFERENCE_NOW - hoursAgo * 3_600_000).toISOString();
}

export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "c-1",
    title: "Migrating the design system to Tailwind v4",
    preview:
      "The @theme inline block is the piece most migrations miss — it's what makes your CSS variables reachable as utilities.",
    modelId: "claude-sonnet",
    messageCount: 24,
    hoursAgo: 1.5,
    pinned: true,
    tags: ["Frontend", "Design system"],
  },
  {
    id: "c-2",
    title: "Why is my streaming response buffering?",
    preview:
      "Almost always the proxy. Check whether anything between you and the client is setting a content-length header.",
    modelId: "echo-flash",
    messageCount: 8,
    hoursAgo: 4,
    tags: ["Debugging"],
  },
  {
    id: "c-3",
    title: "Cover letter — senior frontend role",
    preview:
      "Here's a tightened version. I cut the opening paragraph entirely; it was doing the job the subject line already did.",
    modelId: "gpt-4o",
    messageCount: 12,
    hoursAgo: 7,
    tags: ["Writing", "Career"],
  },
  {
    id: "c-4",
    title: "Planning a four-week TypeScript ramp",
    preview:
      "Week one is about friction, not progress. Pick the version of the habit you genuinely cannot fail at.",
    modelId: "o3-reasoning",
    messageCount: 18,
    hoursAgo: 26,
    pinned: true,
    tags: ["Learning", "Planning"],
  },
  {
    id: "c-5",
    title: "Naming ideas for a privacy-first notes app",
    preview:
      "Grouped by tone. The 'quiet' cluster is strongest — it signals the positioning without explaining it.",
    modelId: "gemini-pro",
    messageCount: 6,
    hoursAgo: 30,
    tags: ["Branding"],
  },
  {
    id: "c-6",
    title: "Explain eventual consistency three ways",
    preview:
      "For the product manager version: the database always agrees with itself eventually, just not at the same instant everywhere.",
    modelId: "claude-sonnet",
    messageCount: 10,
    hoursAgo: 52,
    tags: ["Learning", "Backend"],
  },
  {
    id: "c-7",
    title: "Accessibility audit of the checkout flow",
    preview:
      "Three blockers, four warnings. The blockers are all focus management — the modal never returns focus to its trigger.",
    modelId: "gpt-4o",
    messageCount: 22,
    hoursAgo: 74,
    tags: ["Accessibility", "Frontend"],
  },
  {
    id: "c-8",
    title: "Rewriting the onboarding emails",
    preview:
      "Email two is doing too much. Split the account setup out and let the welcome email only welcome.",
    modelId: "mistral-large",
    messageCount: 14,
    hoursAgo: 120,
    tags: ["Writing", "Growth"],
  },
  {
    id: "c-9",
    title: "Storyboard for the product launch clip",
    preview:
      "Six frames. The reveal lands better at frame four than frame six — the current cut buries it.",
    modelId: "echo-canvas",
    messageCount: 9,
    hoursAgo: 210,
    archived: true,
    tags: ["Creative", "Video"],
  },
  {
    id: "c-10",
    title: "Open-source licence comparison",
    preview:
      "If you want contributions from companies, MPL is the pragmatic middle. AGPL will cost you most of them.",
    modelId: "llama-3-70b",
    messageCount: 7,
    hoursAgo: 340,
    tags: ["Legal", "Open source"],
  },
  {
    id: "c-11",
    title: "Pressure-testing the in-house design system call",
    preview:
      "The strongest case against: you'd be buying maintenance forever to avoid a theming problem you could solve in a week.",
    modelId: "o3-reasoning",
    messageCount: 31,
    hoursAgo: 600,
    archived: true,
    tags: ["Planning", "Design system"],
  },
  {
    id: "c-12",
    title: "Weekly meal plan on a £40 budget",
    preview:
      "Batch the base on Sunday and the weekday cooking drops to fifteen minutes. Shopping list is at the bottom.",
    modelId: "echo-flash",
    messageCount: 5,
    hoursAgo: 900,
    tags: ["Personal"],
  },
];

/** The handful shown in the sidebar's "Recent" section. */
export const RECENT_CONVERSATIONS = SAMPLE_CONVERSATIONS.filter((c) => !c.archived).slice(0, 6);

export const ALL_TAGS = Array.from(
  new Set(SAMPLE_CONVERSATIONS.flatMap((c) => c.tags)),
).sort();
