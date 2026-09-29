"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { NAV_LINKS } from "@/data/nav";
import { SITE } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { ChromeMark } from "@/components/ui/brand-icons";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeId: string | null;
  /** Id of the trigger button, for `aria-controls` round-tripping. */
  triggerId: string;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Slide-down mobile navigation.
 *
 * Behaves like a dialog: labelled, focus moved in on open, Tab wrapped inside
 * while it is open, Escape closes it and focus returns to the hamburger.
 * Background scroll is locked so the page underneath cannot move.
 */
export function MobileMenu({ open, onClose, activeId, triggerId }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // Focus the first link once the panel exists.
    const id = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 20);

    return () => {
      document.body.style.overflow = overflow;
      window.clearTimeout(id);
      document.getElementById(triggerId)?.focus();
    };
  }, [open, triggerId]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    const nodes = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
    );
    if (nodes.length === 0) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          id="mobile-menu-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          onKeyDown={onKeyDown}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full z-50 mx-4 mt-2 rounded-xl border border-border bg-surface p-4 shadow-lift md:hidden"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid size-8 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={onClose}
                    aria-current={activeId === link.id ? "true" : undefined}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-surface-2 aria-[current]:text-brand-600 dark:aria-[current]:text-brand-300"
                  >
                    {link.label}
                    {activeId === link.id ? (
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-500" />
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-3 grid gap-2 border-t border-border pt-3">
            <ButtonLink href={SITE.webApp} variant="secondary" size="md" onClick={onClose}>
              Open web app
            </ButtonLink>
            <ButtonLink href={SITE.chromeStore} variant="primary" size="md" onClick={onClose}>
              <ChromeMark className="size-4" />
              Add to Chrome
            </ButtonLink>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
