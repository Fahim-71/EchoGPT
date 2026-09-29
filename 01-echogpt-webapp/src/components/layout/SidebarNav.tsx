"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Kbd } from "@/components/ui/Kbd";
import { Tooltip } from "@/components/ui/Tooltip";
import type { NavGroup, NavItem } from "@/data/navigation";
import { cn } from "@/lib/utils";

export interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}

/** One nav row. Collapsed, it becomes an icon with a tooltip carrying the label. */
export function SidebarNavItem({ item, collapsed, onNavigate }: SidebarNavItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;
  // "/" is the chat route, which every "coming soon" tool also points at, so an
  // exact match on a real destination is the only thing that counts as active.
  const active = !item.soon && pathname === item.href;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center rounded-sm text-sm font-medium transition-colors duration-150",
        collapsed ? "h-9 w-9 justify-center" : "h-9 gap-2.5 px-2.5",
        active
          ? "bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-200"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute -left-2 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary"
        />
      ) : null}
      <Icon aria-hidden className="size-[1.0625rem] shrink-0" />
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.soon ? (
            <Badge tone="neutral" className="shrink-0">
              Soon
            </Badge>
          ) : item.shortcut ? (
            <Kbd
              keys={["G", item.shortcut]}
              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          ) : null}
        </>
      ) : null}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip side="right" content={item.label} hint={item.soon ? "Coming soon" : item.description}>
      {link}
    </Tooltip>
  );
}

export interface SidebarNavGroupProps {
  group: NavGroup;
  collapsed: boolean;
  onNavigate?: () => void;
}

/** A labelled, collapsible group of secondary tools. */
export function SidebarNavGroup({ group, collapsed, onNavigate }: SidebarNavGroupProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span aria-hidden className="my-1 h-px w-6 bg-border" />
        {group.items.map((item) => (
          <SidebarNavItem key={item.label} item={item} collapsed onNavigate={onNavigate} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-7 w-full items-center gap-1 rounded-xs px-2.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronRight
          aria-hidden
          className={cn("size-3 transition-transform duration-200", open && "rotate-90")}
        />
        {group.label}
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pt-0.5">
              {group.items.map((item) => (
                <SidebarNavItem
                  key={item.label}
                  item={item}
                  collapsed={false}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
