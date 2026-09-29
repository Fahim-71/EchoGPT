"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Align = "start" | "center" | "end";
type Side = "top" | "bottom";

export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The trigger element. Wire `aria-expanded`/`aria-haspopup` on it yourself. */
  trigger: ReactNode;
  children: ReactNode;
  align?: Align;
  side?: Side;
  className?: string;
  /** Accessible name for the floating panel. */
  label?: string;
}

const ALIGN_CLASS: Record<Align, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

/**
 * Lightweight popover: an outside pointer-down or Escape closes it, and Escape
 * returns focus to the trigger. The panel renders immediately after the trigger
 * in the DOM, so Tab walks straight into it without focus being forced.
 */
export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
  align = "start",
  side = "bottom",
  className,
  label,
}: PopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const id = useId();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) onOpenChange(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={rootRef} className="relative">
      {trigger}
      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id={id}
            role="dialog"
            aria-label={label}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: side === "bottom" ? -6 : 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute z-50 overflow-hidden rounded-lg border border-border bg-surface shadow-lift",
              ALIGN_CLASS[align],
              side === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
              className,
            )}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
