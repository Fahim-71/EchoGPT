import type { Metadata } from "next";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "General, model, appearance, shortcut and privacy preferences, saved to this browser.",
};

export default function SettingsPage() {
  return <SettingsTabs />;
}
