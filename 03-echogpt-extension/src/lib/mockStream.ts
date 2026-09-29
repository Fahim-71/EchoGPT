/**
 * Simulated token-by-token streaming.
 *
 * There is no backend in this assessment, but "streaming" is the single most
 * load-bearing interaction in a chat UI — it is what makes a stop button, a
 * caret, a scroll-anchor and a regenerate action meaningful. So rather than
 * dropping canned text in at once, we emit it in token-sized slices on a timer
 * with a little jitter, behind an AbortSignal.
 */

export interface StreamOptions {
  signal?: AbortSignal;
  /** Called with the accumulated text after every token. */
  onToken: (accumulated: string) => void;
  /** Average milliseconds between tokens. */
  speed?: number;
}

/** Splits into "tokens" that look like a real tokeniser's output. */
function tokenise(text: string): string[] {
  return text.match(/\s*\S+/g) ?? [text];
}

export async function streamText(
  text: string,
  { signal, onToken, speed = 18 }: StreamOptions,
): Promise<{ text: string; stopped: boolean }> {
  const tokens = tokenise(text);
  let acc = "";

  for (const token of tokens) {
    if (signal?.aborted) return { text: acc, stopped: true };
    acc += token;
    onToken(acc);
    // Punctuation gets a longer beat; it reads like the model thinking.
    const pause = /[.!?:]$/.test(token) ? speed * 6 : speed + Math.random() * speed;
    await sleep(pause, signal);
  }
  return { text: acc, stopped: Boolean(signal?.aborted) };
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve();
    const id = setTimeout(done, ms);
    function done() {
      clearTimeout(id);
      signal?.removeEventListener("abort", done);
      resolve();
    }
    signal?.addEventListener("abort", done, { once: true });
  });
}

export interface MockSource {
  label: string;
  detail: string;
}

export interface MockReply {
  text: string;
  sources?: MockSource[];
}

const SUMMARY: MockReply = {
  text: `Here is the page in five lines.

**What it argues.** Browser extensions are judged on install count, but the number that actually predicts survival is weekly active use — and the two diverge almost immediately after launch.

**The mechanism.** Most extensions front-load their cost: a permissions prompt, an account, a settings screen. Each one is a place to quit before any value has been felt.

**The counter-example.** The extensions that retain put one useful act on the first screen and defer everything else until the user has a reason to care.

**The caveat.** This does not hold for extensions whose whole value is configuration — password managers and VPNs earn their setup screens.

**So what.** Measure the first ninety seconds, not the install.`,
  sources: [
    { label: "Section 2", detail: "“Installs are a vanity number”" },
    { label: "Section 5", detail: "Retention cohort chart" },
  ],
};

const EXPLAIN: MockReply = {
  text: `In plain terms: the passage is saying that the *cost* of an extension is paid up front and the *value* arrives later, so anything you put between install and first value is charged at full price.

Three things are packed into it:

1. **"Front-loaded cost"** — permission prompts, sign-in walls and settings screens all happen before the user knows whether the thing is any good.
2. **"Deferred value"** — the actual payoff (a good summary, a fast answer) can only land after that.
3. **The asymmetry** — a user who quits at step one never finds out about step two, so the ordering matters far more than the quality of either step.

The practical rule the author draws from it: move one genuinely useful action in front of every gate you can.`,
  sources: [{ label: "Selection", detail: "Paragraph 3, sentence 2" }],
};

const KEY_POINTS: MockReply = {
  text: `**Key points**

- Install count and weekly active use decouple within the first two weeks.
- The drop-off concentrates in the first session, not over time.
- Sign-in walls cost roughly a third of first-session users in the author's sample.
- Extensions with a zero-config first action retain about twice as well.
- Configuration-heavy categories (password managers, VPNs) are the exception.
- The author's recommended metric is "time to first useful output", in seconds.`,
};

const TASKS: MockReply = {
  text: `**Tasks extracted from this page**

- [ ] Instrument "time to first useful output" as a funnel metric
- [ ] Audit every gate between install and first value
- [ ] Move sign-in behind the first successful action
- [ ] Split settings into first-run vs. power-user tiers
- [ ] Re-run the retention cohort with the new ordering

Nothing here has an owner or a date on the page — I have left those blank rather than inventing them.`,
};

const TRANSLATE: MockReply = {
  text: `**Français**

Les extensions de navigateur sont jugées sur leur nombre d'installations, mais le chiffre qui prédit réellement leur survie est l'usage hebdomadaire actif — et les deux divergent presque immédiatement après le lancement.

La plupart des extensions concentrent leur coût au départ : une demande d'autorisation, un compte, un écran de réglages. Chacun est une occasion d'abandonner avant d'avoir ressenti le moindre bénéfice.

*Translated from English. Tone and paragraph structure preserved; the idiom "front-loaded" has been rendered as "concentrent leur coût au départ", which is closer to the sense than a literal translation.*`,
};

const REWRITE: MockReply = {
  text: `**Rewritten — tighter, same meaning**

Extensions get judged on installs. Survival is predicted by weekly active use, and the two numbers separate almost as soon as you launch.

The reason is ordering. Most extensions charge their whole cost up front — a permission prompt, an account, a settings screen — and only pay out later. Every gate is a place to quit before the value shows up.

*Cut 38% of the words. I kept the two technical terms ("weekly active use", "permission prompt") and dropped the hedging clauses.*`,
};

const DEFAULT: MockReply = {
  text: `Happy to help with that.

I am the demo build of the EchoGPT side panel, so this reply is simulated rather than generated — but everything around it is real UI: the streaming you just watched, the stop button, the model picker, copy, regenerate and insert-into-page all work.

Try a slash command (\`/summarise\`, \`/explain\`, \`/translate\`), switch models in the composer to see how the picker compares speed and cost, or turn on **Use this page as context** in the banner above to see the token estimate change.`,
};

const ROUTES: Array<{ test: RegExp; reply: MockReply }> = [
  { test: /summar|tl;?dr|recap|digest/i, reply: SUMMARY },
  { test: /explain|what does|simpler|plain english|eli5/i, reply: EXPLAIN },
  { test: /key ?points?|bullet|main ideas/i, reply: KEY_POINTS },
  { test: /task|action item|to-?do/i, reply: TASKS },
  { test: /translat|français|spanish|german/i, reply: TRANSLATE },
  { test: /rewrit|rephrase|tighten|shorten|edit this/i, reply: REWRITE },
];

/** Picks a canned reply from the prompt. Deterministic, so demos repeat. */
export function replyFor(prompt: string): MockReply {
  return ROUTES.find((r) => r.test.test(prompt))?.reply ?? DEFAULT;
}

/** Per-model flavour: reasoning models are slower, fast models are quicker. */
export function speedForLatency(latency: number): number {
  return [10, 14, 20, 30, 44][Math.min(4, Math.max(0, latency - 1))];
}
