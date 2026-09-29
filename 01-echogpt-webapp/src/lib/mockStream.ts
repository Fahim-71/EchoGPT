/**
 * Simulated model streaming.
 *
 * There is no backend in this assessment build, so replies come from a small
 * canned corpus keyed loosely off the prompt and then re-voiced in the selected
 * model's persona. Tokens are yielded with a jittered cadence that pauses longer
 * at sentence punctuation, which reads far more like a real stream than a fixed
 * interval would.
 */

import { getModel } from "@/lib/models";

export interface StreamChunk {
  /** The next slice of text (includes its trailing space). */
  token: string;
}

interface CannedReply {
  /** Lower-case keywords that route a prompt to this reply. */
  match: string[];
  body: string;
}

const CANNED: CannedReply[] = [
  {
    match: ["code", "bug", "function", "typescript", "javascript", "react", "debug", "refactor"],
    body: `Here's how I'd approach it.

Start by isolating the smallest reproduction you can — a single component with hard-coded props usually surfaces the real culprit within a minute or two. Once it reproduces reliably, the fix is almost always mechanical.

The three things worth checking first: whether state is being mutated rather than replaced, whether an effect is missing a dependency it silently closes over, and whether the render is keyed on something unstable like an array index. In my experience those three account for most of the "it works locally but not in production" class of problem.

If none of those land, add a temporary log at the boundary between your data layer and your view layer. The gap between what you think you're passing and what actually arrives is where the bug usually lives.`,
  },
  {
    match: ["write", "email", "draft", "post", "copy", "blog", "article", "content"],
    body: `Happy to draft that.

A good first paragraph does one job: it tells the reader why this is worth their next thirty seconds. Everything else — context, caveats, background — can wait until after you've earned the attention.

From there, keep each paragraph to a single idea and let the structure carry the argument rather than the transitions. Readers skim; a piece that survives skimming is a piece that got its hierarchy right.

Close by telling them exactly what happens next. A piece that ends on a summary feels finished; a piece that ends on an action feels useful.`,
  },
  {
    match: ["plan", "learn", "study", "roadmap", "schedule", "habit", "goal", "routine"],
    body: `Let's make this concrete rather than aspirational.

Week one is about reducing friction, not making progress. Pick the smallest version of the habit that you genuinely cannot fail at — five minutes, one paragraph, one exercise — and do only that. The goal is to prove to yourself that the slot in your day exists.

Weeks two and three are where you add volume. Keep the time slot fixed and let the amount grow naturally. Fixed time with variable effort survives a bad week; variable time with fixed effort does not.

By week four you'll have enough data to know whether the slot is right. If you've missed it more than twice, move the slot rather than blaming the willpower.`,
  },
  {
    match: ["explain", "what is", "how does", "why", "difference", "compare", "meaning"],
    body: `The short version first, then the detail.

At its core this is a trade-off between two things that both sound good in isolation: doing the work up front so it's cheap later, or deferring the work so you never pay for what you don't use. Almost every design argument you'll hear about it reduces to which side of that line the speaker's workload sits on.

The reason it feels confusing is that the vocabulary borrowed from one field carries different connotations in another, so two people can agree completely about the mechanism while disagreeing about the name.

If you only remember one thing: ask what happens on the second call. The answer to that separates the approaches more cleanly than any definition will.`,
  },
  {
    match: ["image", "design", "logo", "illustration", "visual", "brand", "colour", "color"],
    body: `Here's the direction I'd take.

Start from constraints rather than inspiration. Decide the one place this will be seen smallest — a favicon, a phone notification, a business card — and design for that first. Anything that survives at sixteen pixels will look deliberate at sixteen hundred.

For palette, one saturated brand colour plus a neutral ramp gets you further than a five-colour system. Reserve the saturated colour for the single most important action on any given screen and let everything else be neutral.

Contrast is the accessibility floor and the aesthetic ceiling at the same time. If it passes 4.5:1 it will also, almost always, look better.`,
  },
];

const FALLBACK: CannedReply = {
  match: [],
  body: `Good question — let me work through it.

There are really two ways to read what you're asking, and they lead somewhere quite different, so I'll take the more useful one and flag the other at the end.

Taken practically, the answer is that the constraint you're describing is rarely the binding one. When people hit this, the thing actually limiting them is usually one layer up: the decision that made the constraint necessary in the first place. Relax that and the original problem often stops being a problem.

Taken literally, there is a direct answer, and it's yes — with the caveat that it only holds while the inputs stay in the range you've described.

Tell me which reading you meant and I'll go deeper on that one.`,
};

function pickReply(prompt: string): string {
  const lower = prompt.toLowerCase();
  let best: CannedReply | null = null;
  let bestHits = 0;
  for (const reply of CANNED) {
    const hits = reply.match.filter((keyword) => lower.includes(keyword)).length;
    if (hits > bestHits) {
      best = reply;
      bestHits = hits;
    }
  }
  return (best ?? FALLBACK).body;
}

/** Re-voice the canned body in the selected model's persona. */
export function personaBody(modelId: string, prompt: string): string {
  const model = getModel(modelId);
  const body = pickReply(prompt);
  const paragraphs = body.split("\n\n");

  if (model.id === "echo-flash") {
    // Terse: opening line plus the single most load-bearing paragraph.
    return [paragraphs[0], paragraphs[1]].filter(Boolean).join("\n\n");
  }
  if (model.id === "claude-sonnet") {
    return `${body}\n\nIf it helps, I can turn any one of those into a worked example — just say which.`;
  }
  if (model.tier === "reasoning") {
    return body;
  }
  if (model.tier === "creative") {
    return `${paragraphs[0]}\n\n${paragraphs.slice(1, 3).join("\n\n")}`;
  }
  return body;
}

/** The collapsible "Thought for Ns" block shown only by reasoning models. */
export function reasoningTrace(prompt: string): string {
  return `The user is asking about "${prompt.slice(0, 64)}${prompt.length > 64 ? "…" : ""}".

First, decide whether this is a factual lookup or a judgement call — the two want very different answers. The phrasing reads as a judgement call, so a single confident number would be misleading.

Second, check for an unstated constraint. Most questions in this shape carry one, and answering without naming it produces advice that collapses on contact with the real situation.

Third, structure the reply so the actionable part comes first and the caveats come after, rather than burying the answer under qualifications.`;
}

export function thinkingSeconds(modelId: string): number {
  const model = getModel(modelId);
  return Math.max(1, Math.round(model.latency * 1.4));
}

/** Split into tokens that keep their trailing whitespace, like a real stream. */
function tokenize(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [];
}

function delayFor(token: string, latency: number): number {
  const base = 14 + latency * 7;
  const jitter = Math.random() * base * 0.9;
  const trimmed = token.trimEnd();
  let punctuation = 0;
  if (/[.!?]$/.test(trimmed)) punctuation = 170;
  else if (/[,;:]$/.test(trimmed)) punctuation = 70;
  if (token.includes("\n\n")) punctuation += 190;
  return base + jitter + punctuation;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Yields the reply token by token. Aborting the signal ends the generator, so
 * the stop button in the composer genuinely stops the stream mid-sentence.
 */
export async function* mockStream(
  prompt: string,
  modelId: string,
  signal?: AbortSignal,
): AsyncGenerator<StreamChunk> {
  const model = getModel(modelId);
  const tokens = tokenize(personaBody(modelId, prompt));

  // Time-to-first-token scales with the model's latency rating.
  await sleep(120 + model.latency * 110, signal);

  for (const token of tokens) {
    if (signal?.aborted) return;
    yield { token };
    await sleep(delayFor(token, model.latency), signal);
  }
}
