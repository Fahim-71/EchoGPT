"use client";

import { Check, LogIn, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SettingCard, SettingLabel, SettingRow } from "@/components/options/section";
import { useSignedIn } from "@/hooks/useSettings";

const GUEST_INCLUDES = [
  "All six quick actions, on any page",
  "Every model in the switcher",
  "30 days of conversation history, stored on this device",
  "Selection tooltip and right-click menu",
];

const SYNC_ADDS = [
  "History on every device you are signed into",
  "History beyond 30 days",
  "Pinned threads shared across profiles",
];

/**
 * Audit item 1, stated as policy rather than implied.
 *
 * The panel leads with what already works without an account, so that signing
 * in reads as an upgrade with a named benefit rather than a toll gate.
 */
export function AccountPanel() {
  const [signedIn, setSignedIn] = useSignedIn();

  return (
    <div className="space-y-4">
      <SettingCard
        title={signedIn ? "Signed in as Fahim" : "You are using EchoGPT as a guest"}
        description={
          signedIn
            ? "fahim@example.com — connected via Google."
            : "Nothing is locked. Sign in only when you want your conversations on more than one machine."
        }
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{
              background: signedIn
                ? "linear-gradient(135deg,#a076ff,#06b6d4)"
                : "var(--surface-3)",
              color: signedIn ? "#fff" : "var(--muted-foreground)",
            }}
          >
            {signedIn ? "MF" : "G"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium">
              {signedIn ? "Mohammed Fahim" : "Guest — local only"}
            </p>
            <p className="text-xs text-muted-foreground">
              {signedIn ? "Sync is on" : "Everything is stored on this device"}
            </p>
          </div>
          <Button
            size="sm"
            variant={signedIn ? "outline" : "primary"}
            onClick={() => setSignedIn(!signedIn)}
          >
            {!signedIn && <LogIn className="size-3.5" />}
            {signedIn ? "Sign out" : "Sign in"}
          </Button>
        </div>
      </SettingCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <SettingCard title="Without an account">
          <ul className="space-y-1.5">
            {GUEST_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check aria-hidden className="mt-px size-3 shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </SettingCard>

        <SettingCard
          title={
            <span className="inline-flex items-center gap-1.5">
              Signing in adds
              <Badge tone="brand" micro>
                Sync
              </Badge>
            </span>
          }
        >
          <ul className="space-y-1.5">
            {SYNC_ADDS.map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check aria-hidden className="mt-px size-3 shrink-0 text-brand-500" />
                {item}
              </li>
            ))}
          </ul>
        </SettingCard>
      </div>

      <SettingCard>
        <SettingRow>
          <SettingLabel
            label="Token-based security"
            description="Sessions use short-lived bearer tokens over HTTPS only. The token never touches page JavaScript — it lives in extension storage and is attached by the service worker."
          />
          <ShieldCheck aria-hidden className="size-5 shrink-0 text-success" />
        </SettingRow>
      </SettingCard>
    </div>
  );
}
