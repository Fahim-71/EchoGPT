"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Sidebar } from "@/components/layout/Sidebar";
import { useFocusTrap } from "@/components/ui/Dialog";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";

/**
 * The rail as a slide-over sheet below `lg`. Focus is trapped inside while it
 * is open, Escape closes it, and tapping a destination dismisses it.
 */
export function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen } = useWorkspace();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const close = () => setMobileNavOpen(false);

  useFocusTrap(panelRef, mobileNavOpen, close);

  return (
    <AnimatePresence>
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
            className="absolute inset-0 bg-[#0d0b16]/55 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { x: "-100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "-100%" }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 left-0 flex w-[19rem] max-w-[86vw] flex-col border-r border-border bg-background-subtle shadow-lift"
          >
            <div className="absolute right-2 top-2.5 z-10">
              <IconButton label="Close navigation" icon={<X />} onClick={close} variant="subtle" />
            </div>
            <Sidebar variant="sheet" onNavigate={close} />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
