"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DEFAULT_MODEL_ID, getModel } from "@/lib/models";
import type { AIModel } from "@/lib/models";
import { WORKSPACES } from "@/data/navigation";
import type { Workspace } from "@/data/navigation";

interface WorkspaceContextValue {
  model: AIModel;
  modelId: string;
  setModelId: (id: string) => void;
  workspace: Workspace;
  setWorkspaceId: (id: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  /** True once localStorage has been read, so we can avoid a collapse flash. */
  hydrated: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

/**
 * Holds the cross-route workspace state: selected model, active workspace,
 * sidebar collapse and the two overlays. Everything durable goes through
 * `useLocalStorage` so a reload lands you where you left off.
 */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [modelId, setModelId, modelHydrated] = useLocalStorage(
    "echogpt.model",
    DEFAULT_MODEL_ID,
  );
  const [workspaceId, setWorkspaceId] = useLocalStorage("echogpt.workspace", WORKSPACES[0].id);
  const [sidebarCollapsed, setSidebarCollapsed, sidebarHydrated] = useLocalStorage(
    "echogpt.sidebarCollapsed",
    false,
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      modelId,
      model: getModel(modelId),
      setModelId,
      workspace: WORKSPACES.find((w) => w.id === workspaceId) ?? WORKSPACES[0],
      setWorkspaceId,
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed),
      mobileNavOpen,
      setMobileNavOpen,
      paletteOpen,
      setPaletteOpen,
      hydrated: modelHydrated && sidebarHydrated,
    }),
    [
      modelId,
      setModelId,
      workspaceId,
      setWorkspaceId,
      sidebarCollapsed,
      setSidebarCollapsed,
      mobileNavOpen,
      paletteOpen,
      modelHydrated,
      sidebarHydrated,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return context;
}
