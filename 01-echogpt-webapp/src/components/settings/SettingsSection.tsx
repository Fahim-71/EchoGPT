import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** Shared card wrapper so every settings panel reads the same. */
export function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section className={cn("rounded-lg border border-border bg-surface", className)}>
      <header className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}

export interface SettingRowProps {
  label: string;
  description?: string;
  htmlFor?: string;
  control: ReactNode;
  /** Stack the control under the label instead of beside it. */
  stacked?: boolean;
}

export function SettingRow({ label, description, htmlFor, control, stacked }: SettingRowProps) {
  return (
    <div
      className={cn(
        stacked ? "space-y-2" : "flex flex-wrap items-start justify-between gap-4",
      )}
    >
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className={cn(stacked ? "w-full" : "shrink-0")}>{control}</div>
    </div>
  );
}
