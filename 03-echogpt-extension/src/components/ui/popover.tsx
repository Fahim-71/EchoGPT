"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  /** The element the popover is anchored to. Must be position-relative. */
  trigger: ReactNode;
  children: ReactNode;
  /** Which corner the panel grows from. */
  align?: "start" | "end";
  side?: "top" | "bottom";
  className?: string;
  panelClassName?: string;
}

/**
 * A small anchored panel with outside-click and Escape handling.
 *
 * Deliberately not a portal: inside a 400px extension panel there is no
 * z-index war to win, and keeping the panel in the DOM tree means focus order
 * stays correct without a focus trap.
 */
export function Popover({
  open,
  onClose,
  trigger,
  children,
  align = "start",
  side = "top",
  className,
  panelClassName,
}: PopoverProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) onClose();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: side === "top" ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute z-40 rounded-lg border border-border bg-surface shadow-lift",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2",
              align === "start" ? "left-0" : "right-0",
              panelClassName,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
