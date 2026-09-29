"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  /** The tooltip body. Keep it to one short line. */
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  /** Applied to the wrapper — pass `w-full` when the child is a block. */
  className?: string;
  /** Applied to the floating bubble. */
  panelClassName?: string;
}

const SIDES = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
} as const;

/**
 * A CSS-only tooltip: shown on hover and on focus, so it is reachable by
 * keyboard. Wired with `aria-describedby` rather than `title`, which screen
 * readers announce inconsistently and which cannot be styled.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  className,
  panelClassName,
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined} className="inline-flex w-full">
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        hidden={!open}
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-56 rounded-sm border border-border",
          "bg-surface-3 px-2 py-1 text-[11px] leading-snug text-foreground shadow-lift",
          SIDES[side],
          panelClassName,
        )}
      >
        {content}
      </span>
    </span>
  );
}
