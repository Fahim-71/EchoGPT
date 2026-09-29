"use client";

import { Check, Database, Trash2, X } from "lucide-react";
import { useState } from "react";
import { SettingCard } from "@/components/options/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clearEchoGptData } from "@/hooks/useChromeStorage";
import { isExtension } from "@/lib/env";

const STORED = [
  {
    what: "Your preferences",
    where: "chrome.storage.sync",
    detail: "Default model, quick action order, theme, density. Follows your Chrome profile.",
  },
  {
    what: "Conversation history",
    where: "chrome.storage.local",
    detail: "Thread titles, messages and the page each started on. This device only, 30 days, unless you sign in.",
  },
  {
    what: "Session token",
    where: "chrome.storage.session",
    detail: "Only while signed in. Cleared when Chrome closes; never readable by page JavaScript.",
  },
];

const NOT_STORED = [
  "No third-party analytics, ad or tracking SDKs — none are bundled",
  "No page content is sent anywhere unless you turn on page context for that message",
  "No browsing history: EchoGPT only ever sees the tab you explicitly act on",
  "No keystroke logging — the content script listens for selection events only",
];

/**
 * The privacy section states what is stored, where, for how long, and gives a
 * real button to delete it. "Preferences stored locally, no third-party
 * analytics" is a claim; this is the same claim itemised so it can be checked.
 */
export function PrivacyPanel() {
  const [cleared, setCleared] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function clear() {
    const count = await clearEchoGptData();
    setCleared(count);
    setConfirming(false);
    setTimeout(() => setCleared(null), 4000);
  }

  return (
    <div className="space-y-4">
      <SettingCard
        title="What EchoGPT stores"
        description={
          isExtension()
            ? "Running as an installed extension — these are the real storage areas in use."
            : "Running as a hosted demo, so all of this is mapped onto localStorage in your browser."
        }
      >
        <ul className="space-y-2">
          {STORED.map((row) => (
            <li
              key={row.what}
              className="flex items-start gap-2.5 rounded-md border border-border bg-surface-2 p-3"
            >
              <Database aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[13px] font-medium">{row.what}</span>
                  <Badge micro>
                    <code className="font-mono">
                      {isExtension() ? row.where : "localStorage"}
                    </code>
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {row.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </SettingCard>

      <SettingCard title="What it does not store">
        <ul className="space-y-1.5">
          {NOT_STORED.map((line) => (
            <li key={line} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <X aria-hidden className="mt-px size-3 shrink-0 text-danger" />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Check aria-hidden className="mt-px size-3 shrink-0 text-success" />
          All requests go over HTTPS. The manifest declares no{" "}
          <code className="font-mono text-[11px]">http:</code> host permission, so a
          plaintext endpoint cannot be reached even if one were configured.
        </p>
      </SettingCard>

      <SettingCard
        title="Clear local data"
        description="Removes every preference and conversation stored by EchoGPT on this device. It cannot be undone, and it does not touch a signed-in account's synced copy."
      >
        {cleared !== null ? (
          <p className="flex items-center gap-1.5 text-[13px] text-success">
            <Check aria-hidden className="size-4" />
            Cleared {cleared} stored {cleared === 1 ? "key" : "keys"}. Settings are back
            to their defaults.
          </p>
        ) : confirming ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] text-foreground">
              Delete everything stored on this device?
            </span>
            <Button size="sm" variant="danger" onClick={clear}>
              <Trash2 className="size-3.5" />
              Yes, clear it
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setConfirming(true)}>
            <Trash2 className="size-3.5" />
            Clear local data
          </Button>
        )}
      </SettingCard>
    </div>
  );
}
