"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

export type Density = "comfortable" | "compact";
export type FontScale = "sm" | "md" | "lg";
export type SendBehaviour = "enter" | "mod-enter";

export interface WorkspaceSettings {
  displayName: string;
  /** Prepended to every conversation in a real build. */
  systemPrompt: string;
  sendBehaviour: SendBehaviour;
  density: Density;
  fontScale: FontScale;
  reduceMotion: boolean;
  showTokenCounter: boolean;
  showPromptStarters: boolean;
  streamResponses: boolean;
  autoTitleChats: boolean;
  saveHistory: boolean;
  shareAnalytics: boolean;
  trainOnChats: boolean;
}

export const DEFAULT_SETTINGS: WorkspaceSettings = {
  displayName: "Guest",
  systemPrompt: "",
  sendBehaviour: "enter",
  density: "comfortable",
  fontScale: "md",
  reduceMotion: false,
  showTokenCounter: true,
  showPromptStarters: true,
  streamResponses: true,
  autoTitleChats: true,
  saveHistory: true,
  shareAnalytics: false,
  trainOnChats: false,
};

export const SETTINGS_KEY = "echogpt.settings";

/** Single settings object persisted under one key so resets are atomic. */
export function useSettings() {
  const [settings, setSettings, hydrated] = useLocalStorage<WorkspaceSettings>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS,
  );

  function update<K extends keyof WorkspaceSettings>(key: K, value: WorkspaceSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setSettings(DEFAULT_SETTINGS);
  }

  // Older persisted payloads may be missing newly added keys.
  return { settings: { ...DEFAULT_SETTINGS, ...settings }, update, reset, hydrated };
}

export const FONT_SCALE_CLASS: Record<FontScale, string> = {
  sm: "text-[0.9375rem]",
  md: "text-base",
  lg: "text-[1.0625rem]",
};
