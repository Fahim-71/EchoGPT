"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Popover } from "@/components/ui/Popover";
import { Tooltip } from "@/components/ui/Tooltip";
import { WORKSPACES } from "@/data/navigation";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { cn } from "@/lib/utils";

export interface WorkspaceSwitcherProps {
  collapsed: boolean;
}

/** Workspace picker pinned to the top of the rail. */
export function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const { workspace, setWorkspaceId } = useWorkspace();
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={`Workspace: ${workspace.name}. Switch workspace`}
      className={cn(
        "flex items-center rounded-md border border-transparent transition-colors hover:border-border hover:bg-surface-2",
        collapsed ? "size-9 justify-center" : "w-full gap-2.5 px-2 py-1.5",
      )}
    >
      <Avatar initials={workspace.initials} background={workspace.gradient} size={collapsed ? "sm" : "sm"} />
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-semibold text-foreground">
              {workspace.name}
            </span>
            <span className="block truncate text-[0.6875rem] text-muted-foreground">
              {workspace.plan}
            </span>
          </span>
          <ChevronsUpDown aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
        </>
      ) : null}
    </button>
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="Switch workspace"
      align="start"
      className="w-64"
      trigger={
        collapsed ? (
          <Tooltip side="right" content={workspace.name} hint={workspace.plan}>
            {trigger}
          </Tooltip>
        ) : (
          trigger
        )
      }
    >
      <div className="p-1.5">
        <p className="px-2 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspaces
        </p>
        {WORKSPACES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setWorkspaceId(item.id);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-surface-2"
          >
            <Avatar initials={item.initials} background={item.gradient} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">
                {item.name}
              </span>
              <span className="block truncate text-[0.6875rem] text-muted-foreground">
                {item.plan}
              </span>
            </span>
            {item.id === workspace.id ? (
              <Check aria-hidden className="size-4 shrink-0 text-primary" />
            ) : null}
          </button>
        ))}
        <div className="my-1.5 h-px bg-border" />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <Plus aria-hidden className="size-4" />
          Create workspace
          <span className="ml-auto text-[0.6875rem]">Demo</span>
        </button>
      </div>
    </Popover>
  );
}
