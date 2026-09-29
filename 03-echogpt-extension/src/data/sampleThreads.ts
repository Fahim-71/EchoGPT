/**
 * Conversation history. The current extension shows none at all, so the
 * redesign needs a concrete shape for it: every thread is bound to the page it
 * started on, which is what makes "resume where I was on this article" possible.
 */

export interface ThreadMessagePreview {
  role: "user" | "assistant";
  content: string;
}

export interface SampleThread {
  id: string;
  title: string;
  /** Host of the page the thread started on — drives the generated favicon. */
  host: string;
  url: string;
  /** Deterministic hue for the favicon monogram. */
  hue: number;
  modelId: string;
  pinned: boolean;
  /** Relative time, pre-formatted so the demo never drifts. */
  when: string;
  messageCount: number;
  preview: string;
  messages?: ThreadMessagePreview[];
}

export const SAMPLE_THREADS: SampleThread[] = [
  {
    id: "t-extensions",
    title: "Why installs aren't retention",
    host: "www.the-verge-like.com",
    url: "https://www.the-verge-like.com/2026/extensions-economics",
    hue: 264,
    modelId: "claude-sonnet",
    pinned: true,
    when: "2 min ago",
    messageCount: 6,
    preview: "Summarise this page in five lines, leading with its main argument.",
  },
  {
    id: "t-postgres",
    title: "Partial indexes vs. filtered queries",
    host: "www.postgresql.org",
    url: "https://www.postgresql.org/docs/current/indexes-partial.html",
    hue: 201,
    modelId: "o3-reasoning",
    pinned: true,
    when: "1 h ago",
    messageCount: 14,
    preview: "When does the planner actually choose a partial index over a full one?",
  },
  {
    id: "t-lease",
    title: "Break clause in the office lease",
    host: "drive.example.com",
    url: "https://drive.example.com/d/office-lease-2026",
    hue: 24,
    modelId: "gemini-pro",
    pinned: false,
    when: "Yesterday",
    messageCount: 9,
    preview: "Explain the selected text in plain language, and unpack any jargon.",
  },
  {
    id: "t-rust",
    title: "Lifetimes in a builder pattern",
    host: "doc.rust-lang.org",
    url: "https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html",
    hue: 12,
    modelId: "gpt-4o",
    pinned: false,
    when: "Yesterday",
    messageCount: 22,
    preview: "Why does the borrow checker reject the second builder call?",
  },
  {
    id: "t-pricing",
    title: "Competitor pricing page teardown",
    host: "linear.app",
    url: "https://linear.app/pricing",
    hue: 240,
    modelId: "echo-flash",
    pinned: false,
    when: "Mon",
    messageCount: 4,
    preview: "Pull out the key points of this page as scannable bullets.",
  },
  {
    id: "t-flights",
    title: "Baggage rules, three airlines",
    host: "www.skyscanner.net",
    url: "https://www.skyscanner.net/baggage",
    hue: 176,
    modelId: "echo-flash",
    pinned: false,
    when: "Last week",
    messageCount: 11,
    preview: "Compare the cabin baggage allowances on this page.",
  },
  {
    id: "t-release",
    title: "Draft the release note",
    host: "github.com",
    url: "https://github.com/echogpt/extension/releases",
    hue: 300,
    modelId: "mistral-large",
    pinned: false,
    when: "Last week",
    messageCount: 7,
    preview: "Rewrite the selected text to be tighter while keeping the meaning.",
  },
];

export const RECENT_THREADS = SAMPLE_THREADS.slice(0, 3);

/** Prompts used to seed the Compare tab. */
export const COMPARE_PROMPT =
  "Summarise this page in five lines, leading with its main argument.";
