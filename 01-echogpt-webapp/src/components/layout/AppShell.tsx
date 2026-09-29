"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { WorkspaceProvider, useWorkspace } from "@/components/layout/WorkspaceProvider";
import { useHotkey } from "@/hooks/useHotkey";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

const EXPANDED = 272;
const COLLAPSED = 60;

function ShellInner({ children }: { children: ReactNode }) {
  const { sidebarCollapsed, setPaletteOpen, paletteOpen, mobileNavOpen, setMobileNavOpen, hydrated } =
    useWorkspace();
  const reduce = useReducedMotion();
  const router = useRouter();
  const isDesktop = useIsDesktop();

  // The sheet only exists below `lg`; rotating a phone should not strand it open.
  useEffect(() => {
    if (isDesktop && mobileNavOpen) setMobileNavOpen(false);
  }, [isDesktop, mobileNavOpen, setMobileNavOpen]);

  useHotkey("k", (event) => {
    event.preventDefault();
    setPaletteOpen(!paletteOpen);
  }, { meta: true, allowInInput: true });

  useHotkey("/", (event) => {
    event.preventDefault();
    setPaletteOpen(true);
  });

  useHotkey(",", (event) => {
    event.preventDefault();
    router.push("/settings");
  }, { meta: true, allowInInput: true });

  useHotkey("Escape", () => setMobileNavOpen(false));

  const width = sidebarCollapsed ? COLLAPSED : EXPANDED;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <motion.aside
        aria-label="Sidebar"
        // Animate only after localStorage has been read, so a persisted
        // collapsed rail does not slide in from the expanded width on load.
        initial={false}
        animate={{ width }}
        transition={reduce || !hydrated ? { duration: 0 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden shrink-0 border-r border-border lg:block"
      >
        <Sidebar />
      </motion.aside>

      <MobileNav />

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>

      <CommandPalette />
    </div>
  );
}

export interface AppShellProps {
  children: ReactNode;
  className?: string;
}

/** Wraps every route: provider, rail, mobile sheet and the command palette. */
function MotionGate({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  // "user" honours the OS setting; "always" is the in-app override from
  // Settings → Appearance, which every `useReducedMotion()` call then reads.
  return (
    <MotionConfig reducedMotion={settings.reduceMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <MotionGate>
      <WorkspaceProvider>
        <ShellInner>
          <main id="main" className={cn("flex min-h-0 flex-1 flex-col", className)}>
            {children}
          </main>
        </ShellInner>
      </WorkspaceProvider>
    </MotionGate>
  );
}
