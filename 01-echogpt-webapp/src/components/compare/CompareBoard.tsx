"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Columns2, Plus, Square, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TopBar } from "@/components/layout/TopBar";
import { Composer } from "@/components/chat/Composer";
import { EmptyState } from "@/components/chat/EmptyState";
import { CompareColumn } from "@/components/compare/CompareColumn";
import type { CompareColumnState } from "@/components/compare/CompareColumn";
import { mockStream } from "@/lib/mockStream";
import { MODELS, getModel } from "@/lib/models";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const MAX_COLUMNS = 3;
const DEFAULT_MODEL_IDS = ["echo-flash", "claude-sonnet", "o3-reasoning"];

function makeColumn(modelId: string): CompareColumnState {
  return {
    key: `col-${modelId}-${Math.random().toString(36).slice(2, 7)}`,
    modelId,
    content: "",
    status: "idle",
    elapsedMs: null,
  };
}

/**
 * Multi-model comparison.
 *
 * One prompt fans out to every column at once; each runs its own `mockStream`
 * with its own AbortController, so the fast model visibly finishes while the
 * reasoning model is still going — which is the entire point of the surface.
 */
export function CompareBoard() {
  const [modelIds, setModelIds] = useLocalStorage<string[]>(
    "echogpt.compareModels",
    DEFAULT_MODEL_IDS,
  );
  const [columns, setColumns] = useState<CompareColumnState[]>(() =>
    DEFAULT_MODEL_IDS.map(makeColumn),
  );
  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const controllers = useRef(new Map<string, AbortController>());
  const reduce = useReducedMotion();

  // Adopt the persisted line-up once localStorage has been read.
  const applied = useRef(false);
  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    if (modelIds.join() !== DEFAULT_MODEL_IDS.join()) {
      setColumns(modelIds.map(makeColumn));
    }
  }, [modelIds]);

  useEffect(() => {
    const map = controllers.current;
    return () => map.forEach((controller) => controller.abort());
  }, []);

  const patch = useCallback((key: string, next: Partial<CompareColumnState>) => {
    setColumns((prev) => prev.map((c) => (c.key === key ? { ...c, ...next } : c)));
  }, []);

  const runColumn = useCallback(
    async (column: CompareColumnState, text: string) => {
      controllers.current.get(column.key)?.abort();
      const controller = new AbortController();
      controllers.current.set(column.key, controller);
      const startedAt = performance.now();

      patch(column.key, { content: "", status: "thinking", elapsedMs: null });

      try {
        let first = true;
        for await (const chunk of mockStream(text, column.modelId, controller.signal)) {
          if (first) {
            first = false;
            patch(column.key, { status: "streaming" });
          }
          setColumns((prev) =>
            prev.map((c) => (c.key === column.key ? { ...c, content: c.content + chunk.token } : c)),
          );
        }
        if (!controller.signal.aborted) {
          patch(column.key, { status: "done", elapsedMs: performance.now() - startedAt });
        }
      } catch {
        // Aborted — the finally block records the state.
      } finally {
        if (controller.signal.aborted) {
          patch(column.key, { status: "stopped", elapsedMs: performance.now() - startedAt });
        }
        if (controllers.current.get(column.key) === controller) {
          controllers.current.delete(column.key);
        }
      }
    },
    [patch],
  );

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLastPrompt(trimmed);
    setWinner(null);
    columns.forEach((column) => void runColumn(column, trimmed));
  }

  function stopAll() {
    controllers.current.forEach((controller) => controller.abort());
  }

  function swapModel(key: string, modelId: string) {
    setColumns((prev) => {
      const next = prev.map((c) => (c.key === key ? { ...c, modelId } : c));
      setModelIds(next.map((c) => c.modelId));
      return next;
    });
    controllers.current.get(key)?.abort();
    const column = columns.find((c) => c.key === key);
    if (column && lastPrompt) {
      void runColumn({ ...column, modelId, content: "" }, lastPrompt);
    } else {
      patch(key, { content: "", status: "idle", elapsedMs: null });
    }
  }

  function addColumn() {
    const used = new Set(columns.map((c) => c.modelId));
    const candidate = MODELS.find((m) => !used.has(m.id)) ?? MODELS[0];
    setColumns((prev) => {
      const next = [...prev, makeColumn(candidate.id)];
      setModelIds(next.map((c) => c.modelId));
      return next;
    });
  }

  function removeColumn(key: string) {
    controllers.current.get(key)?.abort();
    setColumns((prev) => {
      const next = prev.filter((c) => c.key !== key);
      setModelIds(next.map((c) => c.modelId));
      return next;
    });
    if (winner === key) setWinner(null);
  }

  const anyRunning = columns.some((c) => c.status === "thinking" || c.status === "streaming");
  const winnerModel = winner ? getModel(columns.find((c) => c.key === winner)?.modelId ?? "") : null;

  return (
    <>
      <TopBar
        title="Compare models"
        subtitle="One prompt, every model, side by side"
        actions={
          <>
            {anyRunning ? (
              <Button
                size="sm"
                variant="secondary"
                leadingIcon={<Square aria-hidden className="size-3.5 fill-current" />}
                onClick={stopAll}
              >
                Stop all
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="secondary"
              leadingIcon={<Plus aria-hidden className="size-3.5" />}
              onClick={addColumn}
              disabled={columns.length >= MAX_COLUMNS}
            >
              Add model
            </Button>
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <AnimatePresence>
          {winnerModel ? (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              className="overflow-hidden border-b border-border bg-brand-50/60 dark:bg-brand-950/40"
            >
              <p className="flex items-center gap-2 px-4 py-2 text-xs text-foreground sm:px-6">
                <Trophy aria-hidden className="size-3.5 text-primary" />
                <span className="font-medium">{winnerModel.name}</span> pinned as the winner for
                this prompt.
                <Badge tone="brand" dot={winnerModel.accent} className="ml-1">
                  {winnerModel.vendor}
                </Badge>
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {columns.length === 0 ? (
          <EmptyState
            icon={Columns2}
            title="No models in the line-up"
            description="Add at least one model to start comparing answers side by side."
            actions={
              <Button variant="primary" leadingIcon={<Plus aria-hidden className="size-4" />} onClick={addColumn}>
                Add a model
              </Button>
            }
          />
        ) : (
          <div
            className={cn(
              "scrollbar-thin min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-3 py-4 sm:px-6",
            )}
          >
            <div className="flex h-full min-h-0 gap-3">
              {columns.map((column) => (
                <CompareColumn
                  key={column.key}
                  column={column}
                  isWinner={winner === column.key}
                  canRemove={columns.length > 1}
                  onModelChange={(modelId) => swapModel(column.key, modelId)}
                  onPinWinner={() => setWinner((w) => (w === column.key ? null : column.key))}
                  onRemove={() => removeColumn(column.key)}
                  onStop={() => controllers.current.get(column.key)?.abort()}
                />
              ))}
            </div>
          </div>
        )}

        <div className="sticky bottom-0 shrink-0 bg-gradient-to-t from-background via-background to-transparent px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-4">
          <div className="mx-auto w-full max-w-4xl">
            <Composer
              modelId={columns[0]?.modelId ?? MODELS[0].id}
              onModelChange={(id) => columns[0] && swapModel(columns[0].key, id)}
              onSend={send}
              onStop={stopAll}
              busy={anyRunning}
              value={prompt}
              onValueChange={setPrompt}
              placeholder="Ask all columns the same question…"
            />
          </div>
        </div>
      </div>
    </>
  );
}
