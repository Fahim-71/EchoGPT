import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  /** Text shown in the fake address bar. */
  url: string;
  children: ReactNode;
  className?: string;
  /** Right-hand slot in the chrome bar, e.g. a fake extension pin. */
  action?: ReactNode;
}

/**
 * Chrome-like window shell. Everything inside is real, responsive DOM — there
 * is no screenshot anywhere on this page, so the mock-ups reflow and follow the
 * theme like the rest of the site.
 */
export function BrowserFrame({ url, children, className, action }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface shadow-lift",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-surface-2 px-3 py-2.5">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-background px-3 py-1">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-3 shrink-0 text-emerald-500"
            fill="currentColor"
          >
            <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm3 8H9V6a3 3 0 1 1 6 0v3Z" />
          </svg>
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {url}
          </span>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </div>
  );
}
