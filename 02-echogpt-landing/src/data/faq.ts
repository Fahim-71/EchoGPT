export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: "models",
    question: "Which AI models can I use?",
    answer:
      "EchoGPT fans out to models from OpenAI, Anthropic, Google, Meta and Mistral alongside its own Echo models, and you switch between them from the picker in the composer without starting a new conversation. The catalogue on this page is the same data the app renders from, so what you see here is what shows up in the picker.",
  },
  {
    id: "free",
    question: "Is it free?",
    answer:
      "The Chrome extension is free on the Chrome Web Store and the free tier gives you unlimited chats on the fast models, webpage summaries and explain-selection. Paid tiers exist for the premium models, Compare and the Image and Video Studios.",
  },
  {
    id: "training",
    question: "Is my data used to train models?",
    answer:
      "No. EchoGPT ships no third-party analytics, your preferences are stored locally in the browser rather than on a server, and all traffic is HTTPS only with token-based authentication. Your conversations are used to answer you, not to train anything.",
  },
  {
    id: "any-site",
    question: "Does the sidebar work on any website?",
    answer:
      "Yes. The sidebar opens alongside whatever tab you are on, so you can summarise a long article, an internal wiki page or a dense PDF viewer without copying anything out. Passing the current page as context is optional and off unless you ask for it.",
  },
  {
    id: "shortcut",
    question: "What is the keyboard shortcut?",
    answer:
      "Ctrl+Shift+E on Windows and Linux, Cmd+Shift+E on macOS. It toggles the sidebar open and closed, and you can remap it from chrome://extensions/shortcuts if it clashes with something else you use.",
  },
  {
    id: "api-key",
    question: "Can I use my own API key or endpoint?",
    answer:
      "Yes. The extension exposes a configurable API endpoint in its settings, so you can point it at your own gateway or a self-hosted deployment instead of the default EchoGPT backend. That is the same setting teams use to keep traffic inside their own network.",
  },
  {
    id: "mobile",
    question: "Is there mobile support?",
    answer:
      "The web app at echogpt.live is responsive and works in a mobile browser. The sidebar extension is desktop-only, because Chrome on Android and iOS does not support extensions — that is a Chrome limitation rather than an EchoGPT one.",
  },
  {
    id: "uninstall",
    question: "How do I uninstall it?",
    answer:
      "Right-click the EchoGPT icon in the Chrome toolbar and choose Remove from Chrome, or open chrome://extensions and remove it there. Locally stored preferences go with it; nothing is left behind on your machine.",
  },
];
