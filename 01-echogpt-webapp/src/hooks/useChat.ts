"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mockStream, personaBody, reasoningTrace, thinkingSeconds } from "@/lib/mockStream";
import { getModel } from "@/lib/models";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  /** Model that produced an assistant turn, or was active when a user sent one. */
  modelId: string;
  createdAt: string;
  /** Visible only for reasoning-tier models. */
  reasoning?: string;
  thinkingSeconds?: number;
  /** Set when the user aborted the stream part-way. */
  stopped?: boolean;
  vote?: "up" | "down" | null;
}

let counter = 0;
function newId(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}-${Math.random().toString(36).slice(2, 8)}`;
}

export type ChatStatus = "idle" | "thinking" | "streaming";

/**
 * Drives one conversation against the mock stream.
 *
 * The streaming assistant message is held in local state and mutated in place
 * as tokens arrive, so `MessageList` re-renders only the last bubble.
 */
export interface UseChatOptions {
  /** When false, the whole reply lands at once (Settings → Models). */
  stream?: boolean;
}

export function useChat(modelId: string, { stream = true }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);
  const modelRef = useRef(modelId);
  modelRef.current = modelId;
  const streamRef = useRef(stream);
  streamRef.current = stream;

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async (prompt: string, useModelId: string) => {
    const model = getModel(useModelId);
    const controller = new AbortController();
    abortRef.current = controller;

    const assistantId = newId("a");
    const isReasoning = model.tier === "reasoning";

    setStatus("thinking");
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        modelId: useModelId,
        createdAt: new Date().toISOString(),
        reasoning: isReasoning ? reasoningTrace(prompt) : undefined,
        thinkingSeconds: isReasoning ? thinkingSeconds(useModelId) : undefined,
        vote: null,
      },
    ]);

    try {
      if (!streamRef.current) {
        // Non-streaming mode: one deliberate pause, then the complete answer.
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 400 + model.latency * 260);
          controller.signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(new DOMException("Aborted", "AbortError"));
            },
            { once: true },
          );
        });
        const body = personaBody(useModelId, prompt);
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: body } : m)),
        );
        return;
      }

      let started = false;
      for await (const chunk of mockStream(prompt, useModelId, controller.signal)) {
        if (!started) {
          started = true;
          setStatus("streaming");
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk.token } : m,
          ),
        );
      }
    } catch {
      // AbortError is the expected path when the stop button is pressed.
    } finally {
      if (controller.signal.aborted) {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, stopped: true } : m)),
        );
      }
      if (abortRef.current === controller) abortRef.current = null;
      setStatus("idle");
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      const prompt = text.trim();
      if (!prompt) return;
      setMessages((prev) => [
        ...prev,
        {
          id: newId("u"),
          role: "user",
          content: prompt,
          modelId: modelRef.current,
          createdAt: new Date().toISOString(),
        },
      ]);
      void run(prompt, modelRef.current);
    },
    [run],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  /** Drop the trailing assistant turn and re-run the prompt above it. */
  const regenerate = useCallback(
    (assistantMessageId: string) => {
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === assistantMessageId);
        if (index < 1) return prev;
        const prompt = prev[index - 1];
        if (prompt.role !== "user") return prev;
        queueMicrotask(() => void run(prompt.content, modelRef.current));
        return prev.slice(0, index);
      });
    },
    [run],
  );

  /** Rewrite a user turn and discard everything after it. */
  const editAndResend = useCallback(
    (userMessageId: string, nextContent: string) => {
      const prompt = nextContent.trim();
      if (!prompt) return;
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === userMessageId);
        if (index === -1) return prev;
        const next = prev.slice(0, index);
        next.push({ ...prev[index], content: prompt, createdAt: new Date().toISOString() });
        queueMicrotask(() => void run(prompt, modelRef.current));
        return next;
      });
    },
    [run],
  );

  const vote = useCallback((messageId: string, value: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, vote: m.vote === value ? null : value } : m,
      ),
    );
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStatus("idle");
  }, []);

  return {
    messages,
    status,
    isBusy: status !== "idle",
    send,
    stop,
    regenerate,
    editAndResend,
    vote,
    reset,
  };
}
