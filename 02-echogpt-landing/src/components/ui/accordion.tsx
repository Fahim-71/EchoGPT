"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Id of the item expanded on first paint. */
  defaultOpenId?: string;
  className?: string;
}

/**
 * Single-open accordion. Each row is a real `<button aria-expanded>` that
 * controls a `role="region"` panel, so it is operable with Enter/Space and
 * announced correctly — no headings are nested inside the buttons, keeping the
 * page to one `h2` per section.
 */
export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const uid = useId();
  const reduce = useReducedMotion();

  return (
    <div className={cn("divide-y divide-border rounded-xl border border-border bg-card", className)}>
      {items.map((item) => {
        const open = openId === item.id;
        const buttonId = `${uid}-${item.id}-trigger`;
        const panelId = `${uid}-${item.id}-panel`;

        return (
          <div key={item.id}>
            <button
              id={buttonId}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-2 sm:px-6 sm:py-5"
            >
              <span className="text-[15px] font-medium text-foreground sm:text-base">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border border-border bg-surface-2 text-muted-foreground transition-transform duration-300",
                  open && "rotate-45 border-brand-400 bg-brand-500 text-white",
                )}
              >
                <Plus className="size-4" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pr-12 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
