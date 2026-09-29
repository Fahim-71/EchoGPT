"use client";

import { useState } from "react";
import { Download, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Switch } from "@/components/ui/Switch";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { useSettings } from "@/hooks/useSettings";

export function PrivacyPanel() {
  const { settings, update, reset } = useSettings();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [exported, setExported] = useState(false);

  function exportData() {
    // Everything this build stores lives in localStorage, so the export is an
    // honest dump of exactly that — no server round trip involved.
    try {
      const payload: Record<string, unknown> = {};
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (!key?.startsWith("echogpt")) continue;
        try {
          payload[key] = JSON.parse(window.localStorage.getItem(key) ?? "null");
        } catch {
          payload[key] = window.localStorage.getItem(key);
        }
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "echogpt-local-data.json";
      anchor.click();
      URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => setExported(false), 2500);
    } catch {
      /* download blocked — nothing to clean up */
    }
  }

  function clearEverything() {
    try {
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key?.startsWith("echogpt")) keys.push(key);
      }
      keys.forEach((key) => window.localStorage.removeItem(key));
    } catch {
      /* storage may be blocked */
    }
    reset();
    setConfirmOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-success/25 bg-success/5 p-3.5">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
        <p className="text-xs leading-relaxed text-foreground">
          This is a front-end assessment build. There is no backend: every response is generated in
          your browser, and every preference is stored in this browser's localStorage. Nothing is
          transmitted anywhere.
        </p>
      </div>

      <SettingsSection title="Data" description="What this build keeps, and for how long.">
        <Switch
          label="Save chat history"
          description="Keep conversations in this browser so they appear under History."
          checked={settings.saveHistory}
          onCheckedChange={(value) => update("saveHistory", value)}
        />
        <Switch
          label="Share anonymous usage analytics"
          description="Would report feature usage, never message content. Inert in this build."
          checked={settings.shareAnalytics}
          onCheckedChange={(value) => update("shareAnalytics", value)}
        />
        <Switch
          label="Allow chats to improve models"
          description="Off by default. A real deployment should keep it that way until asked."
          checked={settings.trainOnChats}
          onCheckedChange={(value) => update("trainOnChats", value)}
        />
      </SettingsSection>

      <SettingsSection
        title="Your data"
        description="Export or erase everything this browser holds."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            leadingIcon={<Download aria-hidden className="size-4" />}
            onClick={exportData}
          >
            {exported ? "Downloaded" : "Export local data"}
          </Button>
          <Button
            variant="danger"
            leadingIcon={<Trash2 aria-hidden className="size-4" />}
            onClick={() => setConfirmOpen(true)}
          >
            Clear everything
          </Button>
        </div>
      </SettingsSection>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Clear all local data?"
        description="This removes every EchoGPT preference stored in this browser — theme, selected model, sidebar state and settings. It cannot be undone."
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={clearEverything}>
              Clear everything
            </Button>
          </div>
        }
      >
        <p className="px-5 py-4 text-sm text-muted-foreground">
          Sample conversations shown under History are fixture data and will reappear on reload.
        </p>
      </Dialog>
    </div>
  );
}
