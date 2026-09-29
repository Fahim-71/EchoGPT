import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SettingCardProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A grouped block of related settings. */
export function SettingCard({
  title,
  description,
  children,
  className,
}: SettingCardProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface p-4 shadow-soft",
        className,
      )}
    >
      {(title || description) && (
        <div className="mb-3">
          {title && (
            <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
          )}
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export interface SettingRowProps {
  children: ReactNode;
  className?: string;
}

/** A divided row inside a card. */
export function SettingRow({ children, className }: SettingRowProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface SettingLabelProps {
  label: string;
  description?: ReactNode;
  htmlFor?: string;
}

export function SettingLabel({ label, description, htmlFor }: SettingLabelProps) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <span className="min-w-0">
      <Tag
        {...(htmlFor ? { htmlFor } : {})}
        className="block text-[13px] font-medium text-foreground"
      >
        {label}
      </Tag>
      {description && (
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      )}
    </span>
  );
}
