"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** One or two real next steps — never a dead end. */
  actions?: ReactNode;
  /** Extra content below the actions, e.g. a list of suggestions. */
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Shared empty state. Every surface that can be empty uses this, so none of
 * them bottom out at bare text the way "Empty Chat History" does today.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  children,
  className,
  size = "md",
}: EmptyStateProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "md" ? "px-6 py-16" : "px-4 py-10",
        className,
      )}
    >
      <span
        aria-hidden
        className="relative mb-4 flex size-14 items-center justify-center rounded-lg border border-border bg-surface shadow-soft"
      >
        <span className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_30%_20%,var(--brand-500),transparent_70%)] opacity-15" />
        <Icon className="relative size-6 text-primary" />
      </span>

      <h2
        className={cn(
          "font-semibold text-foreground",
          size === "md" ? "text-base" : "text-sm",
        )}
      >
        {title}
      </h2>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {actions ? <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div> : null}
      {children ? <div className="mt-6 w-full max-w-md">{children}</div> : null}
    </motion.div>
  );
}
