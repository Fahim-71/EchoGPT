"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Columns2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Kbd } from "@/components/ui/Kbd";
import { Tooltip } from "@/components/ui/Tooltip";
import { Badge } from "@/components/ui/Badge";
import { TopBar } from "@/components/layout/TopBar";
import { Composer } from "@/components/chat/Composer";
import { ChatStatusAnnouncer, MessageList } from "@/components/chat/MessageList";
import { PromptStarters } from "@/components/chat/PromptStarters";
import { useChat } from "@/hooks/useChat";
import { useSettings } from "@/hooks/useSettings";
import { useWorkspace } from "@/components/layout/WorkspaceProvider";
import { FONT_SCALE_CLASS } from "@/hooks/useSettings";
import { formatContext } from "@/lib/format";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The chat workspace: a greeting with scannable starters until the first
 * message, then the transcript. The composer is the one element that never
 * moves, so its position is learnable.
 */
export function ChatView() {
  const { modelId, setModelId, model } = useWorkspace();
  const { settings } = useSettings();
  const [draft, setDraft] = useState("");
  const reduce = useReducedMotion();
  const chat = useChat(modelId, { stream: settings.streamResponses });

  const empty = chat.messages.length === 0;

  return (
    <>
      <TopBar
        title={empty ? "New chat" : "Conversation"}
        subtitle={`${model.name} · ${formatContext(model.contextK)}`}
        actions={
          <>
            {!empty ? (
              <Tooltip content="Clear conversation">
                <IconButton
                  label="Clear conversation"
                  icon={<RotateCcw />}
                  size="md"
                  onClick={chat.reset}
                />
              </Tooltip>
            ) : null}
            <Tooltip content="Compare models">
              <Link
                href="/compare"
                aria-label="Compare models side by side"
                className="hidden size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground sm:flex"
              >
                <Columns2 aria-hidden className="size-[1.125rem]" />
              </Link>
            </Tooltip>
          </>
        }
      />

      <div className={cn("flex min-h-0 flex-1 flex-col", FONT_SCALE_CLASS[settings.fontScale])}>
        {/* Mounted for the whole session so the first announcement is not lost. */}
        <ChatStatusAnnouncer
          status={chat.status}
          lastRole={chat.messages[chat.messages.length - 1]?.role}
        />

        {empty ? (
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
            <div
              className={cn(
                "mx-auto flex w-full max-w-3xl flex-col items-center px-4 sm:px-6",
                settings.density === "compact" ? "py-8" : "py-12 sm:py-16",
              )}
            >
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <Badge tone="brand" dot={model.accent} className="mb-4">
                  <Sparkles aria-hidden className="size-3" />
                  {model.name} · {model.free ? "Free" : "Included in Pro"}
                </Badge>
                <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  What are we working on
                  <span className="text-gradient"> today</span>?
                </h2>
                <p className="mt-2 max-w-md text-balance text-sm leading-relaxed text-muted-foreground">
                  Pick a starter below or just start typing. Press{" "}
                  <Kbd keys={["Mod", "K"]} className="align-middle" /> to jump anywhere in the
                  workspace.
                </p>
              </motion.div>

              {settings.showPromptStarters ? (
                <motion.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 w-full"
                >
                  <PromptStarters onPick={(prompt) => setDraft(prompt)} />
                </motion.div>
              ) : (
                <Button
                  className="mt-8"
                  variant="secondary"
                  leadingIcon={<Sparkles aria-hidden className="size-4" />}
                  onClick={() => setDraft("Give me three things worth asking an AI assistant.")}
                >
                  Suggest something to ask
                </Button>
              )}
            </div>
          </div>
        ) : (
          <MessageList
            messages={chat.messages}
            status={chat.status}
            onRegenerate={chat.regenerate}
            onEditSubmit={chat.editAndResend}
            onVote={chat.vote}
          />
        )}

        {/* `dvh` on the shell plus this sticky footer keeps the composer above
            the on-screen keyboard on mobile. */}
        <div className="sticky bottom-0 shrink-0 bg-gradient-to-t from-background via-background to-transparent px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-4">
          <div className="mx-auto w-full max-w-4xl">
            <Composer
              modelId={modelId}
              onModelChange={setModelId}
              onSend={chat.send}
              onStop={chat.stop}
              busy={chat.isBusy}
              value={draft}
              onValueChange={setDraft}
            />
            <p className="mt-2 text-center text-[0.6875rem] text-muted-foreground">
              Responses in this build are simulated locally — no request leaves your browser.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
