"use client";

import { OPTIONS_NAV, type OptionsSectionId } from "@/data/optionsNav";
import { cn } from "@/lib/utils";

export interface OptionsNavProps {
  value: OptionsSectionId;
  onChange: (next: OptionsSectionId) => void;
  className?: string;
}

/**
 * The left rail.
 *
 * Audit item 2: order is the argument here. The six sections a normal user
 * might touch come first; Advanced is pushed below a rule and rendered in the
 * muted colour, so nothing about it reads as a first-run decision.
 */
export function OptionsNav({ value, onChange, className }: OptionsNavProps) {
  const primary = OPTIONS_NAV.filter((s) => !s.demoted);
  const demoted = OPTIONS_NAV.filter((s) => s.demoted);

  function item(section: (typeof OPTIONS_NAV)[number]) {
    const active = section.id === value;
    const Icon = section.icon;
    return (
      <li key={section.id}>
        <button
          type="button"
          onClick={() => onChange(section.id)}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-[13px] font-medium transition-colors",
            active
              ? "bg-brand-500/12 text-brand-700 dark:text-brand-200"
              : section.demoted
                ? "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                : "text-foreground/80 hover:bg-surface-2 hover:text-foreground",
          )}
        >
          <Icon aria-hidden className="size-4 shrink-0" />
          <span className="truncate">{section.label}</span>
        </button>
      </li>
    );
  }

  return (
    <nav aria-label="Settings sections" className={cn("space-y-1", className)}>
      <ul className="space-y-0.5">{primary.map(item)}</ul>
      <div className="!mt-3 border-t border-border pt-3">
        <ul className="space-y-0.5">{demoted.map(item)}</ul>
      </div>
    </nav>
  );
}
