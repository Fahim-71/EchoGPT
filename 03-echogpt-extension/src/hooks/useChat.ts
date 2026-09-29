"use client";

import { useCallback, useRef, useState } from "react";
import { DEFAULT_MODEL_ID, getModel } from "@/lib/models";
import { replyFor, speedForLatency, streamText, type MockSource } from "@/lib/mockStream";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelId: string;
  /** Still receiving tokens. Drives the caret and the stop button. */
  streaming?: boolean;
  /** The user pressed stop before the reply finished. */
  stopped?: boolean;
  sources?: MockSource[];
  /** Attached page selection, shown as a chip above the user's text. */
  attachment?: string;
  /** True when the message used the page as context. */
  usedPageContext?: boolean;
}

export interface SendOptions {
  modelId?: string;
  attachment?: string;
  usedPageContext?: boolean;
}

let seq = 0;
const nextId = () => `m${++seq}-${Date.now().toString(36)}`;

/**
 * Chat state machine over the simulated stream.
 *
 * Deliberately owns abort, regenerate and edit-last so that every affordance in
 * the composer and the message toolbar has real behaviour behind it — a dead
 * regenerate button is worse than no regenerate button.
 */
export function useChat(initial: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  // Mirrors `messages` so callbacks can read the latest thread without taking
  // it as a dependency (and without doing lookups inside a state updater).
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const patch = useCallback((id: string, next: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...next } : m)),
    );
  }, []);

  const run = useCallback(
    async (prompt: string, modelId: string, replyId: string) => {
      const model = getModel(modelId);
      const reply = replyFor(prompt);
      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);

      // A beat before the first token, so the "thinking" state is visible.
      await new Promise((r) => setTimeout(r, 160 + model.latency * 90));

      const result = await streamText(reply.text, {
        signal: controller.signal,
        speed: speedForLatency(model.latency),
        onToken: (accumulated) => patch(replyId, { content: accumulated }),
      });

      patch(replyId, {
        streaming: false,
        stopped: result.stopped,
        sources: result.stopped ? undefined : reply.sources,
      });
      setIsStreaming(false);
      abortRef.current = null;
    },
    [patch],
  );

  const send = useCallback(
    (text: string, options: SendOptions = {}) => {
      const body = text.trim();
      if (!body || abortRef.current) return;
      const modelId = options.modelId ?? DEFAULT_MODEL_ID;
      const replyId = nextId();

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "user",
          content: body,
          modelId,
          attachment: options.attachment,
          usedPageContext: options.usedPageContext,
        },
        { id: replyId, role: "assistant", content: "", modelId, streaming: true },
      ]);

      void run(body, modelId, replyId);
    },
    [run],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  /**
   * Re-runs the prompt that produced a given assistant message.
   *
   * The lookup reads from a ref rather than from inside a `setMessages`
   * updater: an updater must be pure, and React invokes it twice under
   * StrictMode — which would start two competing streams into one bubble.
   */
  const regenerate = useCallback(
    (assistantId: string, modelId?: string) => {
      if (abortRef.current) return;
      const current = messagesRef.current;
      const index = current.findIndex((m) => m.id === assistantId);
      if (index < 1) return;

      const prompt = current[index - 1]?.content ?? "";
      const model = modelId ?? current[index].modelId;

      setMessages((prev) =>
        prev.slice(0, index + 1).map((m, i) =>
          i === index
            ? {
                ...m,
                content: "",
                streaming: true,
                stopped: false,
                sources: undefined,
                modelId: model,
              }
            : m,
        ),
      );
      void run(prompt, model, assistantId);
    },
    [run],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setMessages([]);
  }, []);

  return { messages, isStreaming, send, stop, regenerate, reset };
}
