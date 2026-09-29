"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  MoreVertical,
  Plus,
  RotateCw,
  Star,
  X,
} from "lucide-react";
import type { ReactNode, RefObject } from "react";
import { Logo, SiteFavicon } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export interface BrowserMockProps {
  /** The fake web page. */
  children: ReactNode;
  /** Anchored under the toolbar icon. */
  popup?: ReactNode;
  /** Docked on the right. */
  sidePanel?: ReactNode;
  /** Full-tab surface (the options page) replacing the web page. */
  tabOverlay?: ReactNode;
  popupOpen: boolean;
  onToolbarClick: () => void;
  pageRef?: RefObject<HTMLDivElement | null>;
  /** Renders the viewport at 360px to prove the narrow layout. */
  narrow?: boolean;
  className?: string;
}

/**
 * Real DOM browser chrome.
 *
 * The whole point of the showcase is to place the three surfaces where they
 * actually live — a popup hanging off a toolbar icon, a panel docked to the
 * right edge, a settings page occupying a tab — because the relationship
 * between them is the thing being redesigned (audit item 7). A screenshot
 * could not show the selection tooltip working.
 */
export function BrowserMock({
  children,
  popup,
  sidePanel,
  tabOverlay,
  popupOpen,
  onToolbarClick,
  pageRef,
  narrow,
  className,
}: BrowserMockProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface-2 shadow-lift",
        className,
      )}
    >
      {/* Tab strip */}
      <div className="flex items-end gap-1 bg-surface-3 px-2 pt-2">
        <div className="flex h-8 min-w-0 max-w-[260px] flex-1 items-center gap-2 rounded-t-md bg-surface px-3">
          <SiteFavicon host="the-verge-like.com" size={13} />
          <span className="min-w-0 flex-1 truncate text-[11px] text-foreground">
            {tabOverlay ? "EchoGPT Settings" : "The quiet economics of browser extensions"}
          </span>
          <X aria-hidden className="size-3 shrink-0 text-muted-foreground" />
        </div>
        <div className="hidden h-7 w-40 items-center gap-2 rounded-t-md px-3 sm:flex">
          <SiteFavicon host="docs.internal" size={13} />
          <span className="truncate text-[11px] text-muted-foreground">Design notes</span>
        </div>
        <Plus aria-hidden className="mb-1.5 ml-1 size-3.5 shrink-0 text-muted-foreground" />
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-2.5 py-1.5">
        <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
          <ArrowLeft aria-hidden className="size-3.5" />
          <ArrowRight aria-hidden className="size-3.5 opacity-40" />
          <RotateCw aria-hidden className="size-3.5" />
        </span>
        <div className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-full bg-surface-2 px-3">
          <Lock aria-hidden className="size-3 shrink-0 text-success" />
          <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
            {tabOverlay
              ? "chrome-extension://echogpt/options.html"
              : "https://www.the-verge-like.com/2026/extensions-economics"}
          </span>
          <Star aria-hidden className="size-3 shrink-0 text-muted-foreground" />
        </div>

        {/* The toolbar icon the popup hangs off. */}
        <button
          type="button"
          onClick={onToolbarClick}
          aria-expanded={popupOpen}
          aria-label={popupOpen ? "Close the EchoGPT popup" : "Open the EchoGPT popup"}
          className={cn(
            "relative flex size-7 shrink-0 items-center justify-center rounded-sm transition-colors",
            popupOpen ? "bg-brand-500/15 ring-1 ring-brand-500/40" : "hover:bg-surface-2",
          )}
        >
          <Logo size={17} />
        </button>
        <MoreVertical aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
      </div>

      {/* Viewport */}
      <div className="relative flex h-[620px]">
        <div
          ref={pageRef}
          className={cn(
            "relative min-w-0 flex-1 overflow-hidden bg-white transition-all duration-300",
            narrow && "mx-auto max-w-[360px] border-x border-border",
          )}
        >
          {tabOverlay ?? children}
        </div>

        <AnimatePresence initial={false}>
          {sidePanel && (
            <motion.aside
              key="panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: narrow ? 320 : 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              aria-label="EchoGPT side panel"
              className="shrink-0 overflow-hidden border-l border-border bg-background"
            >
              <div style={{ width: narrow ? 320 : 400 }} className="h-full">
                {sidePanel}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* The popup, anchored under the toolbar icon. */}
        <AnimatePresence>
          {popupOpen && popup && (
            <motion.div
              key="popup"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-3 top-2 z-30 origin-top-right"
            >
              {popup}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status bar — names what you are looking at. */}
      <div className="flex items-center gap-2 border-t border-border bg-surface px-3 py-1.5 text-[10px] text-muted-foreground">
        <span className="size-1.5 rounded-full bg-success" />
        EchoGPT is active on this tab
        <span className="ml-auto font-mono">
          {narrow ? "360px viewport" : "1280px viewport"}
        </span>
      </div>
    </div>
  );
}
