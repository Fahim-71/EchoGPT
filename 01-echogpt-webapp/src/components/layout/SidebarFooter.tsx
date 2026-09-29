"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, HelpCircle, LogIn, Settings } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { Popover } from "@/components/ui/Popover";
import { Tooltip } from "@/components/ui/Tooltip";
import { Kbd } from "@/components/ui/Kbd";
import { ThemeToggle } from "@/components/theme-toggle";
import { SETTINGS_NAV, SUPPORT_LINKS } from "@/data/navigation";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

export interface SidebarFooterProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

/**
 * Account, settings, theme and help.
 *
 * The five support destinations that the live app lists as top-level rail items
 * are collapsed into this single Help popover, which is what they are worth:
 * occasional, one-time trips out of the product.
 */
export function SidebarFooter({ collapsed, onNavigate }: SidebarFooterProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const { settings } = useSettings();

  const helpTrigger = (
    <button
      type="button"
      onClick={() => setHelpOpen((v) => !v)}
      aria-haspopup="dialog"
      aria-expanded={helpOpen}
      aria-label="Help and support links"
      className={cn(
        "flex items-center rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
        collapsed ? "size-9 justify-center" : "h-9 w-full gap-2.5 px-2.5",
      )}
    >
      <HelpCircle aria-hidden className="size-[1.0625rem] shrink-0" />
      {!collapsed ? <span>Help & support</span> : null}
    </button>
  );

  return (
    <div className={cn("border-t border-border", collapsed ? "space-y-1 p-2" : "space-y-2 p-3")}>
      <Popover
        open={helpOpen}
        onOpenChange={setHelpOpen}
        side="top"
        align="start"
        label="Help and support"
        className="w-60"
        trigger={
          collapsed ? (
            <Tooltip side="right" content="Help & support">
              {helpTrigger}
            </Tooltip>
          ) : (
            helpTrigger
          )
        }
      >
        <div className="p-1.5">
          {SUPPORT_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setHelpOpen(false)}
              className="flex items-start gap-2.5 rounded-sm px-2 py-2 transition-colors hover:bg-surface-2"
            >
              <link.icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">{link.label}</span>
                <span className="block text-[0.6875rem] text-muted-foreground">
                  {link.description}
                </span>
              </span>
              <ExternalLink aria-hidden className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </Popover>

      {collapsed ? (
        <div className="flex flex-col items-center gap-1">
          <Tooltip side="right" content="Settings">
            <Link
              href={SETTINGS_NAV.href}
              onClick={onNavigate}
              aria-label="Settings"
              className="flex size-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Settings aria-hidden className="size-[1.0625rem]" />
            </Link>
          </Tooltip>
          <Tooltip side="right" content="Sign in" hint="Demo build — no account needed">
            <IconButton label="Sign in" icon={<LogIn />} size="md" />
          </Tooltip>
        </div>
      ) : (
        <>
          <Link
            href={SETTINGS_NAV.href}
            onClick={onNavigate}
            className="group flex h-9 items-center gap-2.5 rounded-sm px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Settings aria-hidden className="size-[1.0625rem] shrink-0" />
            <span className="flex-1">Settings</span>
            <Kbd
              keys={["Mod", ","]}
              className="opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>

          <ThemeToggle />

          <div className="flex items-center gap-2.5 rounded-md border border-border bg-surface-2 px-2 py-2">
            <Avatar initials={settings.displayName || "G"} size="sm" status="online" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                {settings.displayName || "Guest"}
              </span>
              <span className="block truncate text-[0.6875rem] text-muted-foreground">
                Not signed in
              </span>
            </span>
            <Tooltip content="Sign in" hint="Demo build — no backend">
              <IconButton label="Sign in" icon={<LogIn />} variant="solid" />
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
}
