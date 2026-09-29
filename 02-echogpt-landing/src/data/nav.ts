export interface NavLink {
  /** Section id the link scrolls to — also the scroll-spy key. */
  id: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { id: "features", label: "Features" },
  { id: "models", label: "Models" },
  { id: "preview", label: "Product" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

/** Ids the scroll-spy observes (nav targets plus the sections between them). */
export const SPY_IDS = NAV_LINKS.map((l) => l.id);

export interface FooterColumn {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "AI models", href: "#models" },
      { label: "Product tour", href: "#preview" },
      { label: "Pricing", href: "#pricing" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    title: "Surfaces",
    links: [
      { label: "Web app", href: "https://echogpt.live/", external: true },
      { label: "Image Studio", href: "https://echogpt.live/", external: true },
      { label: "Video Studio", href: "https://echogpt.live/", external: true },
      { label: "Model Compare", href: "https://echogpt.live/", external: true },
      { label: "API Platform", href: "https://echogpt.live/", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Connectors", href: "#features" },
      { label: "AI Job Analysis", href: "https://echogpt.live/", external: true },
      { label: "AI SOP Builder", href: "https://echogpt.live/", external: true },
      { label: "History & Store", href: "https://echogpt.live/", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About AppifyDevs", href: "https://echogpt.live/", external: true },
      { label: "Contact", href: "https://echogpt.live/", external: true },
      { label: "Privacy", href: "https://echogpt.live/", external: true },
      { label: "Terms", href: "https://echogpt.live/", external: true },
    ],
  },
];
