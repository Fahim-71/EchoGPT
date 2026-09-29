"use client";

import { useState } from "react";
import { PopupShell } from "@/components/popup/popup-shell";
import { SidePanelShell } from "@/components/sidepanel/sidepanel-shell";
import type { HandoffPayload } from "@/lib/handoff";
import { isExtension } from "@/lib/env";

/**
 * `/popup` → `popup.html` in the extension bundle.
 *
 * Inside Chrome this renders at exactly 400×600 in the action popup and hands
 * off to the real side panel. On the web there is no side panel to hand off
 * to, so the handoff opens a preview beside the popup — otherwise the primary
 * interaction of this surface would be a dead end in the hosted demo.
 */
export default function PopupPage() {
  const [handoff, setHandoff] = useState<HandoffPayload | null>(null);
  const inExtension = isExtension();

  return (
    <main className="flex min-h-screen items-start justify-center gap-6 bg-background-subtle p-0 sm:p-8">
      <PopupShell
        framed
        onHandoff={inExtension ? undefined : setHandoff}
      />

      {!inExtension && handoff && (
        <div className="hidden h-[600px] w-[400px] overflow-hidden rounded-lg border border-border shadow-lift lg:block">
          <SidePanelShell
            handoff={handoff}
            onClose={() => setHandoff(null)}
          />
        </div>
      )}
    </main>
  );
}
