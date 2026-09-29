"use client";

import { useEffect, useState } from "react";
import { SidePanelShell } from "@/components/sidepanel/sidepanel-shell";
import { DEMO_PAGE_CONTEXT, getChrome, readActivePage, type PageContext } from "@/lib/env";
import { SELECTION_MESSAGE, type HandoffPayload } from "@/lib/handoff";

/**
 * `/sidepanel` → `sidepanel.html` in the extension bundle.
 *
 * Chrome renders this at whatever width the user has dragged the panel to, so
 * it fills its container rather than assuming 400px. It listens for messages
 * from the service worker: selections coming from the content script's tooltip
 * and from the right-click menu both arrive here.
 */
export default function SidePanelPage() {
  const [page, setPage] = useState<PageContext>(DEMO_PAGE_CONTEXT);
  const [handoff, setHandoff] = useState<HandoffPayload | null>(null);

  useEffect(() => {
    void readActivePage().then(setPage);
  }, []);

  // The service worker parks a payload in session storage before messaging,
  // because the panel may still be booting when a selection arrives and a
  // `sendMessage` with no receiver is simply dropped.
  useEffect(() => {
    const c = getChrome();
    const session = c?.storage?.session;
    if (!session) return;
    const key = "echogpt:pending";
    session.get(key, (got) => {
      const pending = (got as Record<string, HandoffPayload | undefined>)[key];
      if (pending) {
        setHandoff({ ...pending });
        session.remove(key);
      }
    });
  }, []);

  useEffect(() => {
    const c = getChrome();
    if (!c?.runtime?.onMessage) return;

    function onMessage(message: unknown) {
      if (
        typeof message !== "object" ||
        message === null ||
        !("type" in message) ||
        (message as { type: string }).type !== SELECTION_MESSAGE
      ) {
        return;
      }
      const payload = (message as { payload?: HandoffPayload }).payload;
      if (payload) setHandoff({ ...payload });
      void readActivePage().then(setPage);
    }

    c.runtime.onMessage.addListener(onMessage);
    return () => c.runtime.onMessage.removeListener(onMessage);
  }, []);

  return (
    <main className="h-screen w-full">
      <SidePanelShell page={page} handoff={handoff} />
    </main>
  );
}
