"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, PanelLeftClose, PanelLeftOpen, Plus, Search } from "lucide-react";
import { Kbd } from "@/components/ui/Kbd";
import { IconButton } from "@/components/ui/IconButton";
import { Tooltip } from "@/components/ui/Tooltip";
import { Logo } from "@/components/layout/Logo";
import { SidebarNavItem, SidebarNavGroup } from "@/components/layout/SidebarNav";
import { SidebarFooter } from "@/components/layout/SidebarFooter";
import { WorkspaceSwitcher } from "@/components/layout/WorkspaceSwitcher";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { PRIMARY_NAV, TOOL_GROUPS } from "@/data/navigation";
import { RECENT_CONVERSATIONS } from "@/data/sampleConversations";
import { getModel } from "@/lib/models";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  /** Inside the mobile sheet the rail is never collapsed and has no toggle. */
  variant?: "desktop" | "sheet";
  onNavigate?: () => void;
}

/**
 * The redesigned rail.
 *
 * Three tiers instead of one flat list: primary destinations pinned at the top,
 * secondary studios and tasks folded into collapsed groups, and support links
 * pushed into the footer's Help popover.
 */
export function Sidebar({ variant = "desktop", onNavigate }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar, setPaletteOpen } = useWorkspace();
  const reduce = useReducedMotion();
  const collapsed = variant === "desktop" && sidebarCollapsed;

  return (
    <div className="flex h-full min-h-0 flex-col bg-background-subtle">
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border",
          collapsed ? "justify-center p-2" : "px-3 py-3",
        )}
      >
        {!collapsed ? (
          <Link href="/" onClick={onNavigate} className="min-w-0 flex-1">
            <Logo />
          </Link>
        ) : (
          <Link href="/" onClick={onNavigate} aria-label="EchoGPT home">
            <Logo markOnly />
          </Link>
        )}
        {variant === "desktop" ? (
          <Tooltip
            side={collapsed ? "right" : "bottom"}
            content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconButton
              label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              onClick={toggleSidebar}
              className={collapsed ? "absolute -right-3 top-4 z-10 border border-border bg-surface shadow-soft" : ""}
            />
          </Tooltip>
        ) : null}
      </div>

      <div className={cn(collapsed ? "p-2" : "px-3 pt-3")}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <div className={cn("space-y-2", collapsed ? "p-2" : "px-3 pt-3")}>
        {collapsed ? (
          <Tooltip side="right" content="New chat">
            <Link
              href="/"
              onClick={onNavigate}
              aria-label="New chat"
              className="flex size-9 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors hover:bg-brand-700 dark:hover:bg-brand-400"
            >
              <Plus aria-hidden className="size-[1.0625rem]" />
            </Link>
          </Tooltip>
        ) : (
          <Link
            href="/"
            onClick={onNavigate}
            className="flex h-10 w-full items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-brand-700 dark:hover:bg-brand-400"
          >
            <Plus aria-hidden className="size-4" />
            New chat
          </Link>
        )}

        {collapsed ? (
          <Tooltip side="right" content="Search" hint="Opens the command palette">
            <IconButton
              label="Open command palette"
              icon={<Search />}
              size="md"
              variant="subtle"
              onClick={() => setPaletteOpen(true)}
            />
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 w-full items-center gap-2 rounded-md border border-border bg-surface-2 px-2.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Search aria-hidden className="size-4 shrink-0" />
            <span className="flex-1 text-left">Search</span>
            <Kbd keys={["Mod", "K"]} />
          </button>
        )}
      </div>

      <nav
        aria-label="Workspace"
        className={cn(
          "scrollbar-thin mt-3 min-h-0 flex-1 overflow-y-auto pb-4",
          collapsed ? "px-2" : "px-3",
        )}
      >
        <div className={cn("space-y-0.5", collapsed && "flex flex-col items-center")}>
          {PRIMARY_NAV.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className={cn("mt-4 space-y-1", collapsed && "flex flex-col items-center")}>
          {TOOL_GROUPS.map((group) => (
            <SidebarNavGroup
              key={group.id}
              group={group}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {!collapsed ? (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="mt-5"
          >
            <p className="px-2.5 pb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
              Recent
            </p>
            <ul className="space-y-0.5">
              {RECENT_CONVERSATIONS.map((conversation) => {
                const model = getModel(conversation.modelId);
                return (
                  <li key={conversation.id}>
                    <Link
                      href="/history"
                      onClick={onNavigate}
                      className="group flex h-8 items-center gap-2.5 rounded-sm px-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                    >
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: model.accent }}
                      />
                      <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/history"
              onClick={onNavigate}
              className="mt-1 flex h-8 items-center gap-2.5 rounded-sm px-2.5 text-xs font-medium text-primary transition-colors hover:bg-surface-2"
            >
              <MessageSquare aria-hidden className="size-3.5" />
              View all conversations
            </Link>
          </motion.div>
        ) : null}
      </nav>

      <SidebarFooter collapsed={collapsed} onNavigate={onNavigate} />
    </div>
  );
}
