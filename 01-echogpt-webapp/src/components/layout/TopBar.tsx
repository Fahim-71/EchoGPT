"use client";

import type { ReactNode } from "react";
import { Menu, Search } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Kbd } from "@/components/ui/Kbd";
import { Tooltip } from "@/components/ui/Tooltip";
import { Logo } from "@/components/layout/Logo";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { cn } from "@/lib/utils";

export interface TopBarProps {
  title: string;
  subtitle?: string;
  /** Route-specific controls rendered on the right. */
  actions?: ReactNode;
  /** Extra row below the title, e.g. history filters. */
  children?: ReactNode;
  className?: string;
}

/**
 * Sticky header. It carries the page identity and the route's own controls;
 * global navigation stays in the rail rather than being duplicated here.
 */
export function TopBar({ title, subtitle, actions, children, className }: TopBarProps) {
  const { setMobileNavOpen, setPaletteOpen } = useWorkspace();

  return (
    <header
      className={cn(
        "surface-glass sticky top-0 z-30 border-b border-border",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
        <IconButton
          label="Open navigation"
          icon={<Menu />}
          size="md"
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden"
        />
        <span className="lg:hidden">
          <Logo markOnly />
        </span>

        <div className="ml-1 min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-foreground">{title}</h1>
          {subtitle ? (
            <p className="hidden truncate text-xs text-muted-foreground sm:block">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {actions}
          <Tooltip content="Command palette" hint="Search everything">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className="hidden h-9 items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground lg:flex"
            >
              <Search aria-hidden className="size-3.5" />
              <Kbd keys={["Mod", "K"]} />
            </button>
          </Tooltip>
          <IconButton
            label="Open command palette"
            icon={<Search />}
            size="md"
            onClick={() => setPaletteOpen(true)}
            className="lg:hidden"
          />
        </div>
      </div>
      {children}
    </header>
  );
}
