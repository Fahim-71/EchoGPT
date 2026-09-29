"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cloneElement, useId, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

const SIDE_CLASS: Record<Side, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const OFFSET: Record<Side, { x: number; y: number }> = {
  top: { x: 0, y: 4 },
  bottom: { x: 0, y: -4 },
  left: { x: 4, y: 0 },
  right: { x: -4, y: 0 },
};

export interface TooltipProps {
  content: ReactNode;
  /** Optional second line, used for the honest "demo only" notes. */
  hint?: ReactNode;
  side?: Side;
  delay?: number;
  children: ReactElement<{ "aria-describedby"?: string }>;
  className?: string;
}

/**
 * Hover/focus tooltip. The trigger is described by the tooltip rather than
 * labelled by it, so icon buttons keep their own `aria-label` as the name.
 */
export function Tooltip({
  content,
  hint,
  side = "top",
  delay = 350,
  children,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const reduce = useReducedMotion();

  function show(immediate = false) {
    if (timer.current) clearTimeout(timer.current);
    if (immediate) {
      setOpen(true);
      return;
    }
    timer.current = setTimeout(() => setOpen(true), delay);
  }
  function hide() {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show()}
      onMouseLeave={hide}
      onFocusCapture={() => show(true)}
      onBlurCapture={hide}
      onKeyDown={(event) => {
        if (event.key === "Escape") hide();
      }}
    >
      {cloneElement(children, { "aria-describedby": open ? id : undefined })}
      <AnimatePresence>
        {open ? (
          <motion.span
            id={id}
            role="tooltip"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, ...OFFSET[side] }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={cn(
              "pointer-events-none absolute z-50 w-max max-w-56 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-center shadow-lift",
              SIDE_CLASS[side],
              className,
            )}
          >
            <span className="block text-xs font-medium text-foreground">{content}</span>
            {hint ? (
              <span className="mt-0.5 block text-[0.6875rem] leading-tight text-muted-foreground">
                {hint}
              </span>
            ) : null}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
