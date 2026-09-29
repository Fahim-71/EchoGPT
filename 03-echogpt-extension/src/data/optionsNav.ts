import type { LucideIcon } from "lucide-react";
import {
  CircleUser,
  Cpu,
  Keyboard,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Wand2,
} from "lucide-react";

export type OptionsSectionId =
  | "account"
  | "models"
  | "quick-actions"
  | "appearance"
  | "shortcuts"
  | "privacy"
  | "advanced";

export interface OptionsSection {
  id: OptionsSectionId;
  label: string;
  /** One line under the heading — tells the user what decision lives here. */
  description: string;
  icon: LucideIcon;
  /** Advanced is visually demoted; it is not a first-run decision. */
  demoted?: boolean;
}

export const OPTIONS_NAV: OptionsSection[] = [
  {
    id: "account",
    label: "Account",
    description:
      "Sign in to sync threads across devices. Everything below works without it.",
    icon: CircleUser,
  },
  {
    id: "models",
    label: "Models & defaults",
    description:
      "Pick the model that opens by default, and which ones show in the switcher.",
    icon: Cpu,
  },
  {
    id: "quick-actions",
    label: "Quick Actions",
    description:
      "Reorder and toggle the actions that appear in the popup, the selection tooltip and the right-click menu.",
    icon: Wand2,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme, density and how much motion the interface uses.",
    icon: Palette,
  },
  {
    id: "shortcuts",
    label: "Shortcuts",
    description:
      "Keyboard shortcuts for the extension, and the slash commands inside the composer.",
    icon: Keyboard,
  },
  {
    id: "privacy",
    label: "Privacy & data",
    description:
      "Exactly what is stored, where it is stored, and how to delete it.",
    icon: ShieldCheck,
  },
  {
    id: "advanced",
    label: "Advanced",
    description:
      "Self-hosting and protocol-level options. You do not need anything here to use EchoGPT.",
    icon: SlidersHorizontal,
    demoted: true,
  },
];
