/**
 * Navigation hierarchy.
 *
 * The live EchoGPT rail puts fifteen-plus destinations in one flat list, so
 * "Discord" reads as loudly as "New Chat". Here they are split into three
 * tiers: `primary` is pinned to the rail, `tools` is a collapsible group, and
 * `support` is demoted entirely into a help popover in the sidebar footer.
 */

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Braces,
  Columns2,
  History,
  Image,
  LifeBuoy,
  MessageCircle,
  MessageSquarePlus,
  Plug,
  Settings,
  Store,
  Video,
  Briefcase,
  FileText,
  Globe,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Shown as a keyboard hint in the sidebar and command palette. */
  shortcut?: string;
  /** Surfaces not built in this assessment render a "Soon" pill. */
  soon?: boolean;
  description?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
  /** Collapsible groups remember their open state. */
  collapsible?: boolean;
}

/** Always visible — the surfaces people actually use every session. */
export const PRIMARY_NAV: NavItem[] = [
  {
    label: "New chat",
    href: "/",
    icon: MessageSquarePlus,
    shortcut: "N",
    description: "Start a fresh conversation",
  },
  {
    label: "Compare",
    href: "/compare",
    icon: Columns2,
    shortcut: "C",
    description: "Run one prompt across several models",
  },
  {
    label: "History",
    href: "/history",
    icon: History,
    shortcut: "H",
    description: "Search past conversations",
  },
];

/** Secondary creative tools — grouped, collapsible, visually quieter. */
export const TOOL_GROUPS: NavGroup[] = [
  {
    id: "studios",
    label: "Studios",
    collapsible: true,
    items: [
      { label: "Image Studio", href: "/", icon: Image, soon: true, description: "Generate and edit images" },
      { label: "Video Studio", href: "/", icon: Video, soon: true, description: "Storyboard and render clips" },
      { label: "Connectors", href: "/", icon: Plug, soon: true, description: "Link Drive, Notion and Slack" },
      { label: "Store", href: "/", icon: Store, soon: true, description: "Browse community characters" },
    ],
  },
  {
    id: "tasks",
    label: "AI tasks",
    collapsible: true,
    items: [
      { label: "Job Analysis", href: "/", icon: Briefcase, soon: true, description: "Match a CV to a posting" },
      { label: "SOP Builder", href: "/", icon: FileText, soon: true, description: "Turn a process into a document" },
    ],
  },
];

/**
 * Demoted out of the rail entirely — these are one-time destinations, not daily
 * workspace surfaces, so they live behind a single "Help" button.
 */
export const SUPPORT_LINKS: NavItem[] = [
  { label: "Help centre", href: "/", icon: LifeBuoy, description: "Guides and troubleshooting" },
  { label: "API platform", href: "/", icon: Braces, description: "Keys, usage and docs" },
  { label: "Documentation", href: "/", icon: BookOpen, description: "Reference for every surface" },
  { label: "Community Discord", href: "/", icon: MessageCircle, description: "Ask other builders" },
  { label: "echogpt.live", href: "/", icon: Globe, description: "Marketing site" },
];

export const SETTINGS_NAV: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
  shortcut: ",",
  description: "Preferences, models and privacy",
};

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  /** Two-letter monogram rendered as a CSS gradient tile — no remote images. */
  initials: string;
  gradient: string;
}

export const WORKSPACES: Workspace[] = [
  {
    id: "personal",
    name: "Personal",
    plan: "Free plan",
    initials: "PE",
    gradient: "linear-gradient(135deg, #8347fb, #22d3ee)",
  },
  {
    id: "appify",
    name: "AppifyDevs",
    plan: "Team · 8 seats",
    initials: "AD",
    gradient: "linear-gradient(135deg, #f97316, #ec4899)",
  },
  {
    id: "research",
    name: "Research lab",
    plan: "Pro plan",
    initials: "RL",
    gradient: "linear-gradient(135deg, #10b981, #0ea5e9)",
  },
];
