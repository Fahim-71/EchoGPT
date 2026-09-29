"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  panel: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  className?: string;
  panelClassName?: string;
  "aria-label": string;
}

/**
 * WAI-ARIA tablist with manual activation semantics but automatic selection on
 * arrow keys (the panels are static DOM, so there is no cost to switching).
 * Home/End jump to the ends; only the active tab is in the tab order.
 */
export function Tabs({
  items,
  className,
  panelClassName,
  "aria-label": ariaLabel,
}: TabsProps) {
  const [active, setActive] = useState(items[0]?.id);
  const uid = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusTab = (id: string) => {
    setActive(id);
    refs.current[id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next !== null) {
      event.preventDefault();
      focusTab(items[next].id);
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className="scrollbar-thin mx-auto flex w-full max-w-full snap-x gap-1 overflow-x-auto rounded-full border border-border bg-surface-2 p-1 sm:w-fit"
      >
        {items.map((item, index) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[item.id] = el;
              }}
              id={`${uid}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${uid}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                "inline-flex shrink-0 snap-start items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          id={`${uid}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${item.id}`}
          tabIndex={0}
          hidden={item.id !== active}
          className={cn("focus-visible:outline-none", panelClassName)}
        >
          {item.id === active ? item.panel : null}
        </div>
      ))}
    </div>
  );
}
