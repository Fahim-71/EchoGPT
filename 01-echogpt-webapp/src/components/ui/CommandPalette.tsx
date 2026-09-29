"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  CornerDownLeft,
  MessageSquare,
  Moon,
  MessageSquarePlus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Monitor,
} from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Kbd } from "@/components/ui/Kbd";
import { Badge } from "@/components/ui/Badge";
import { fuzzyFilter } from "@/lib/format";
import { MODELS } from "@/lib/models";
import { PRIMARY_NAV, SETTINGS_NAV, TOOL_GROUPS } from "@/data/navigation";
import { RECENT_CONVERSATIONS } from "@/data/sampleConversations";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  group: string;
  /** Extra words folded into the fuzzy match but not displayed. */
  keywords?: string;
  hint?: string;
  dot?: string;
  icon?: React.ReactNode;
  run: () => void;
}

const GROUP_ORDER = ["Actions", "Go to", "Switch model", "Recent chats", "Appearance"];

/**
 * ⌘K palette. Every destination, model and recent chat in one keyboard-driven
 * list — the affordance the live app has no equivalent of.
 */
export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setModelId, modelId } = useWorkspace();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => setPaletteOpen(false);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      router.push(href);
      close();
    };

    const navItems = [...PRIMARY_NAV, SETTINGS_NAV, ...TOOL_GROUPS.flatMap((g) => g.items)];

    return [
      {
        id: "new-chat",
        label: "Start a new chat",
        group: "Actions",
        keywords: "compose fresh blank",
        hint: "N",
        icon: <MessageSquarePlus aria-hidden className="size-4" />,
        run: go("/"),
      },
      {
        id: "compare",
        label: "Compare models side by side",
        group: "Actions",
        keywords: "versus parallel columns",
        icon: <Sparkles aria-hidden className="size-4" />,
        run: go("/compare"),
      },
      {
        id: "settings",
        label: "Open settings",
        group: "Actions",
        keywords: "preferences options config",
        icon: <Settings aria-hidden className="size-4" />,
        run: go("/settings"),
      },
      ...navItems.map((item, index) => ({
        id: `nav-${item.label}-${index}`,
        label: item.label,
        group: "Go to",
        keywords: item.description ?? "",
        icon: <item.icon aria-hidden className="size-4" />,
        run: go(item.href),
      })),
      ...MODELS.map((model) => ({
        id: `model-${model.id}`,
        label: `Switch to ${model.name}`,
        group: "Switch model",
        keywords: `${model.vendor} ${model.blurb} ${model.tier}`,
        hint: model.id === modelId ? "Current" : model.vendor,
        dot: model.accent,
        run: () => {
          setModelId(model.id);
          close();
        },
      })),
      ...RECENT_CONVERSATIONS.map((conversation) => ({
        id: `chat-${conversation.id}`,
        label: conversation.title,
        group: "Recent chats",
        keywords: conversation.tags.join(" "),
        icon: <MessageSquare aria-hidden className="size-4" />,
        run: go("/history"),
      })),
      {
        id: "theme-light",
        label: "Use light theme",
        group: "Appearance",
        icon: <Sun aria-hidden className="size-4" />,
        run: () => {
          setTheme("light");
          close();
        },
      },
      {
        id: "theme-dark",
        label: "Use dark theme",
        group: "Appearance",
        icon: <Moon aria-hidden className="size-4" />,
        run: () => {
          setTheme("dark");
          close();
        },
      },
      {
        id: "theme-system",
        label: "Match system theme",
        group: "Appearance",
        keywords: "auto os preference",
        icon: <Monitor aria-hidden className="size-4" />,
        run: () => {
          setTheme("system");
          close();
        },
      },
    ];
    // `close` is stable via setPaletteOpen; router/setTheme are stable too.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, setTheme, setModelId, modelId]);

  const results = useMemo(
    () => fuzzyFilter(commands, query, (c) => `${c.label} ${c.group} ${c.keywords ?? ""}`),
    [commands, query],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const command of results) {
      const bucket = map.get(command.group);
      if (bucket) bucket.push(command);
      else map.set(command.group, [command]);
    }
    return [...map.entries()].sort(
      (a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]),
    );
  }, [results]);

  /** Flat order matching what is rendered, so arrow keys track the visible list. */
  const flat = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!paletteOpen) setQuery("");
  }, [paletteOpen]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      flat[activeIndex]?.run();
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(0, flat.length - 1));
    }
  }

  return (
    <Dialog open={paletteOpen} onClose={close} title="Command palette" bare className="max-w-xl">
      <div onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands, models and chats…"
            aria-label="Search commands"
            aria-controls="command-results"
            aria-activedescendant={flat[activeIndex] ? `command-${flat[activeIndex].id}` : undefined}
            role="combobox"
            aria-expanded
            className="h-14 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Kbd keys={["Esc"]} />
        </div>

        <div
          ref={listRef}
          id="command-results"
          role="listbox"
          aria-label="Commands"
          className="scrollbar-thin max-h-[52dvh] overflow-y-auto p-2"
        >
          {flat.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">
              Nothing matches “{query}”. Try a model name, a page, or “theme”.
            </p>
          ) : (
            grouped.map(([group, items]) => (
              <div key={group} className="mb-1 last:mb-0">
                <p className="px-3 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </p>
                {items.map((command) => {
                  const index = flat.indexOf(command);
                  const active = index === activeIndex;
                  return (
                    <div
                      key={command.id}
                      id={`command-${command.id}`}
                      data-index={index}
                      role="option"
                      aria-selected={active}
                      tabIndex={-1}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={command.run}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                        active ? "bg-surface-2 text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {command.dot ? (
                        <span
                          aria-hidden
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: command.dot }}
                        />
                      ) : (
                        <span className="shrink-0 text-muted-foreground">{command.icon}</span>
                      )}
                      <span className="min-w-0 flex-1 truncate text-foreground">
                        {command.label}
                      </span>
                      {command.hint ? (
                        <Badge tone={command.hint === "Current" ? "brand" : "neutral"}>
                          {command.hint}
                        </Badge>
                      ) : null}
                      {active ? (
                        <ArrowRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border bg-surface-2 px-4 py-2.5 text-[0.6875rem] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Kbd keys={["↑", "↓"]} /> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <CornerDownLeft aria-hidden className="size-3" /> select
          </span>
          <span>{results.length} result{results.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </Dialog>
  );
}
