"use client";

import { Segmented } from "@/components/ui/Segmented";
import { Switch } from "@/components/ui/Switch";
import { SettingRow, SettingsSection } from "@/components/settings/SettingsSection";
import { useSettings } from "@/hooks/useSettings";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { WORKSPACES } from "@/data/navigation";

export function GeneralPanel() {
  const { settings, update } = useSettings();
  const { workspace, setWorkspaceId } = useWorkspace();

  return (
    <div className="space-y-4">
      <SettingsSection
        title="Profile"
        description="Used for the avatar monogram and how the assistant addresses you."
      >
        <SettingRow
          label="Display name"
          htmlFor="setting-name"
          description="Stored in this browser only."
          stacked
          control={
            <input
              id="setting-name"
              value={settings.displayName}
              onChange={(event) => update("displayName", event.target.value)}
              maxLength={40}
              className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none transition-colors focus:border-border-strong"
            />
          }
        />

        <SettingRow
          label="Active workspace"
          htmlFor="setting-workspace"
          description="Switches the rail, recents and defaults."
          stacked
          control={
            <select
              id="setting-workspace"
              value={workspace.id}
              onChange={(event) => setWorkspaceId(event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none transition-colors focus:border-border-strong"
            >
              {WORKSPACES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.plan}
                </option>
              ))}
            </select>
          }
        />
      </SettingsSection>

      <SettingsSection
        title="Conversations"
        description="How new chats behave before you have typed anything."
      >
        <SettingRow
          label="System prompt"
          htmlFor="setting-system"
          description="Prepended to every new conversation. Left empty, the model uses its own default."
          stacked
          control={
            <textarea
              id="setting-system"
              rows={3}
              value={settings.systemPrompt}
              onChange={(event) => update("systemPrompt", event.target.value)}
              placeholder="e.g. Answer concisely and show your working for anything numerical."
              className="scrollbar-thin w-full resize-y rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-border-strong"
            />
          }
        />

        <SettingRow
          label="Send with"
          description="Choose whether Enter sends or inserts a newline."
          control={
            <Segmented
              value={settings.sendBehaviour}
              onChange={(value) => update("sendBehaviour", value)}
              label="Send behaviour"
              size="sm"
              options={[
                { value: "enter", label: "Enter" },
                { value: "mod-enter", label: "Cmd/Ctrl + Enter" },
              ]}
            />
          }
        />

        <Switch
          label="Show prompt starters"
          description="The filterable suggestion grid on an empty chat."
          checked={settings.showPromptStarters}
          onCheckedChange={(value) => update("showPromptStarters", value)}
        />

        <Switch
          label="Name chats automatically"
          description="Derive a title from the first exchange instead of leaving it untitled."
          checked={settings.autoTitleChats}
          onCheckedChange={(value) => update("autoTitleChats", value)}
        />
      </SettingsSection>
    </div>
  );
}
