"use client";

import { ChevronDown, ChevronUp, GripVertical, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { SettingCard, SettingLabel, SettingRow } from "@/components/options/section";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_ENABLED_ACTION_IDS,
  QUICK_ACTIONS,
  getQuickAction,
} from "@/data/quickActions";
import {
  useActionOrder,
  useEnabledActions,
  useSelectionTooltipEnabled,
} from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

/**
 * Reordering without a drag library.
 *
 * `framer-motion` can do drag-and-drop, but a settings list also has to be
 * operable from the keyboard, and a reorder that only works with a pointer is
 * not really a reorder. Move-up / move-down buttons are focusable, announced,
 * and work identically for everyone; the grip is a visual affordance only.
 */
export function QuickActionsPanel() {
  const [order, setOrder] = useActionOrder();
  const [enabled, setEnabled] = useEnabledActions();
  const [tooltipOn, setTooltipOn] = useSelectionTooltipEnabled();

  const rows = useMemo(() => {
    const seen = order.filter((id) => getQuickAction(id));
    const missing = QUICK_ACTIONS.filter((a) => !seen.includes(a.id)).map((a) => a.id);
    return [...seen, ...missing];
  }, [order]);

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  function toggle(id: string, on: boolean) {
    setEnabled((prev) =>
      on ? [...new Set([...prev, id])] : prev.filter((a) => a !== id),
    );
  }

  const dirty =
    rows.join() !== DEFAULT_ENABLED_ACTION_IDS.join() ||
    enabled.length !== DEFAULT_ENABLED_ACTION_IDS.length;

  return (
    <div className="space-y-4">
      <SettingCard
        title="Order and visibility"
        description="This order is used in the popup grid, the selection tooltip and the right-click menu. Disabled actions disappear from all three."
      >
        <ul className="space-y-1.5">
          {rows.map((id, index) => {
            const action = getQuickAction(id);
            if (!action) return null;
            const on = enabled.includes(id);
            const Icon = action.icon;

            return (
              <li
                key={id}
                className={cn(
                  "flex items-center gap-2 rounded-md border p-2.5 transition-colors",
                  on ? "border-border bg-surface-2" : "border-border bg-surface opacity-60",
                )}
              >
                <GripVertical aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                <span
                  aria-hidden
                  className="flex size-7 shrink-0 items-center justify-center rounded-sm"
                  style={{ backgroundColor: `${action.accent}1f`, color: action.accent }}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-medium">{action.label}</span>
                    <code className="font-mono text-[10px] text-muted-foreground">
                      {action.slash}
                    </code>
                    {action.scope === "selection" && (
                      <Badge micro tone="accent">
                        Needs selection
                      </Badge>
                    )}
                    {action.inTooltip && <Badge micro>In tooltip</Badge>}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {action.prompt}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col">
                  <IconButton
                    size="xs"
                    label={`Move ${action.label} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ChevronUp />
                  </IconButton>
                  <IconButton
                    size="xs"
                    label={`Move ${action.label} down`}
                    disabled={index === rows.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ChevronDown />
                  </IconButton>
                </span>
                <Switch
                  hideLabel
                  label={`Enable ${action.label}`}
                  checked={on}
                  onChange={(next) => toggle(id, next)}
                />
              </li>
            );
          })}
        </ul>

        {dirty && (
          <Button
            size="sm"
            variant="ghost"
            className="mt-3"
            onClick={() => {
              setOrder(DEFAULT_ENABLED_ACTION_IDS);
              setEnabled(DEFAULT_ENABLED_ACTION_IDS);
            }}
          >
            <RotateCcw className="size-3.5" />
            Reset to defaults
          </Button>
        )}
      </SettingCard>

      <SettingCard title="Where actions appear">
        <SettingRow>
          <SettingLabel
            label="Selection tooltip"
            description="Shows a small Ask / Summarise / Explain bar when you highlight text on a page. Rendered in a shadow root, so no page styling can reach it and it cannot reach the page."
          />
          <Switch
            hideLabel
            label="Selection tooltip"
            checked={tooltipOn}
            onChange={setTooltipOn}
          />
        </SettingRow>
        <SettingRow>
          <SettingLabel
            label="Right-click menu"
            description="The enabled actions above are registered as context-menu items on text selection. Managed by the extension's service worker; it follows the list automatically."
          />
          <Badge tone="success" micro>
            Always on
          </Badge>
        </SettingRow>
      </SettingCard>
    </div>
  );
}
