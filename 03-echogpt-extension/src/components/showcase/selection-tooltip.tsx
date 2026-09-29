"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useState, type RefObject } from "react";
import { Logo } from "@/components/ui/logo";
import { QUICK_ACTIONS, type QuickAction } from "@/data/quickActions";

interface Anchor {
  x: number;
  y: number;
  text: string;
  /** Container width, used to keep the bar inside the mock viewport. */
  max: number;
}

export interface SelectionTooltipProps {
  /** The scroll container the selection happens inside. */
  containerRef: RefObject<HTMLElement | null>;
  onAction: (action: QuickAction | "ask", selection: string) => void;
  enabled?: boolean;
}

const TOOLTIP_ACTIONS = QUICK_ACTIONS.filter((a) => a.inTooltip);

/**
 * The showcase's mirror of `extension/content.js`.
 *
 * The shipped content script renders the same bar into a shadow root on a real
 * page; this React version exists so the hosted demo can show the interaction
 * without asking the visitor to install anything. Both are driven by the same
 * `QUICK_ACTIONS` data, so they cannot drift apart.
 */
export function SelectionTooltip({
  containerRef,
  onAction,
  enabled = true,
}: SelectionTooltipProps) {
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const update = useCallback(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const selection = window.getSelection();
    const text = selection?.toString().trim() ?? "";

    if (!selection || selection.isCollapsed || text.length < 3) {
      setAnchor(null);
      return;
    }
    // Only react to selections made inside the mock page.
    if (!container.contains(selection.anchorNode)) {
      setAnchor(null);
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const host = container.getBoundingClientRect();

    // A selection scrolled out of the mock viewport should not leave its
    // tooltip floating over the browser chrome.
    if (rect.bottom < host.top || rect.top > host.bottom) {
      setAnchor(null);
      return;
    }

    setAnchor({
      x: rect.left + rect.width / 2 - host.left,
      y: rect.top - host.top,
      text,
      max: host.width,
    });
  }, [containerRef, enabled]);

  useEffect(() => {
    if (!enabled) {
      setAnchor(null);
      return;
    }
    // `selectionchange` fires mid-drag, so debounce to the end of the gesture.
    let frame = 0;
    function onChange() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    document.addEventListener("selectionchange", onChange);
    document.addEventListener("pointerup", onChange);
    // The article scrolls inside the container, not the container itself, and
    // scroll does not bubble — so listen in the capture phase to catch it.
    const container = containerRef.current;
    container?.addEventListener("scroll", onChange, {
      passive: true,
      capture: true,
    });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("selectionchange", onChange);
      document.removeEventListener("pointerup", onChange);
      container?.removeEventListener("scroll", onChange, { capture: true });
    };
  }, [update, enabled, containerRef]);

  function run(action: QuickAction | "ask") {
    if (!anchor) return;
    onAction(action, anchor.text);
    window.getSelection()?.removeAllRanges();
    setAnchor(null);
  }

  return (
    <AnimatePresence>
      {anchor && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 2, scale: 0.98 }}
          transition={{ duration: 0.13, ease: [0.16, 1, 0.3, 1] }}
          role="toolbar"
          aria-label="EchoGPT actions for the selected text"
          // Pointer events off on the wrapper so the transform origin does not
          // eat clicks near the edges; the inner bar takes them back.
          className="pointer-events-none absolute z-40"
          // The bar is ~300px wide and centred on the selection, so clamp its
          // centre to half that from each edge of the mock viewport.
          style={{
            left: Math.max(156, Math.min(anchor.x, Math.max(156, anchor.max - 156))),
            top: Math.max(8, anchor.y - 8),
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-lg border border-border bg-surface p-1 shadow-lift">
            <Logo size={15} className="mx-1" />
            <button
              type="button"
              onClick={() => run("ask")}
              className="inline-flex h-7 items-center gap-1 rounded-sm bg-primary px-2 text-[11px] font-medium text-primary-foreground transition-colors hover:bg-brand-700 dark:hover:bg-brand-400"
            >
              <Sparkles aria-hidden className="size-3" />
              Ask EchoGPT
            </button>
            <span aria-hidden className="mx-0.5 h-4 w-px bg-border" />
            {TOOLTIP_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => run(action)}
                  title={action.hint}
                  className="inline-flex h-7 items-center gap-1 rounded-sm px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  <Icon aria-hidden className="size-3" style={{ color: action.accent }} />
                  {action.label.replace(" selection", "").replace(" page", "")}
                </button>
              );
            })}
          </div>
          <span
            aria-hidden
            className="mx-auto block size-2 -translate-y-1 rotate-45 border-b border-r border-border bg-surface"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
