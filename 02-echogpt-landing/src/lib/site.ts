/**
 * Single source of truth for outbound URLs and headline numbers.
 * Everything that appears in more than one section lives here so the
 * Chrome Web Store link can never drift between the nav, hero and footer.
 */
export const SITE = {
  name: "EchoGPT",
  company: "AppifyDevs",
  /** Used for canonical / OG / sitemap. Overridable at deploy time. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://echogpt.live",
  webApp: "https://echogpt.live/",
  chromeStore:
    "https://chromewebstore.google.com/detail/echogpt-multi-ai-chat-sid/negimdcamohmoheiifgecbjgjepkcfhj",
  tagline:
    "Chat with multiple AI models in one secure browser sidebar. Summarize webpages and explain text instantly.",
  extension: {
    version: "1.0.5",
    size: "76 KB",
    category: "Tools",
    rating: 5.0,
  },
  shortcut: { win: "Ctrl+Shift+E", mac: "Cmd+Shift+E" },
} as const;
