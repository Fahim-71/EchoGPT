/**
 * Shared AI model catalogue.
 *
 * The public EchoGPT surfaces do not document which models sit behind the
 * "EchoGPT" pill in the composer, so this catalogue is a documented assumption
 * (see each project's README). It is deliberately data-driven: every surface
 * — web app model picker, landing page "AI Models" section, extension model
 * switcher — renders from this one array, so the three projects can never
 * drift out of sync.
 */

export type ModelTier = "fast" | "balanced" | "reasoning" | "creative";

export type ModelCapability =
  | "text"
  | "vision"
  | "code"
  | "web"
  | "files"
  | "image-gen";

export interface AIModel {
  id: string;
  name: string;
  vendor: string;
  /** Short line shown under the name in pickers. */
  blurb: string;
  tier: ModelTier;
  /** Context window in thousands of tokens. */
  contextK: number;
  /** Relative latency, 1 (instant) – 5 (deliberate). Drives the speed meter. */
  latency: 1 | 2 | 3 | 4 | 5;
  /** Relative cost, 1 (cheapest) – 5 (premium). */
  cost: 1 | 2 | 3 | 4 | 5;
  capabilities: ModelCapability[];
  /** Available without a paid subscription. */
  free: boolean;
  /** Tailwind-safe hex used for the model's identity dot. */
  accent: string;
}

export const MODELS: AIModel[] = [
  {
    id: "echo-flash",
    name: "Echo Flash",
    vendor: "EchoGPT",
    blurb: "Instant answers for everyday questions",
    tier: "fast",
    contextK: 32,
    latency: 1,
    cost: 1,
    capabilities: ["text", "code"],
    free: true,
    accent: "#22d3ee",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    vendor: "OpenAI",
    blurb: "Fast multimodal all-rounder",
    tier: "balanced",
    contextK: 128,
    latency: 2,
    cost: 3,
    capabilities: ["text", "vision", "code", "files"],
    free: false,
    accent: "#10a37f",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    vendor: "Anthropic",
    blurb: "Long documents and careful writing",
    tier: "balanced",
    contextK: 200,
    latency: 2,
    cost: 3,
    capabilities: ["text", "vision", "code", "files"],
    free: false,
    accent: "#d97757",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    vendor: "Google",
    blurb: "Huge context with live web grounding",
    tier: "balanced",
    contextK: 1000,
    latency: 3,
    cost: 3,
    capabilities: ["text", "vision", "web", "files"],
    free: false,
    accent: "#4285f4",
  },
  {
    id: "o3-reasoning",
    name: "o3 Reasoning",
    vendor: "OpenAI",
    blurb: "Thinks step by step before answering",
    tier: "reasoning",
    contextK: 128,
    latency: 5,
    cost: 5,
    capabilities: ["text", "code"],
    free: false,
    accent: "#8347fb",
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    vendor: "Meta",
    blurb: "Open-weight, generous free tier",
    tier: "fast",
    contextK: 64,
    latency: 2,
    cost: 1,
    capabilities: ["text", "code"],
    free: true,
    accent: "#0668e1",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    vendor: "Mistral",
    blurb: "Efficient European model, strong at code",
    tier: "fast",
    contextK: 128,
    latency: 2,
    cost: 2,
    capabilities: ["text", "code"],
    free: true,
    accent: "#fa520f",
  },
  {
    id: "echo-canvas",
    name: "Echo Canvas",
    vendor: "EchoGPT",
    blurb: "Image generation and editing",
    tier: "creative",
    contextK: 16,
    latency: 4,
    cost: 4,
    capabilities: ["text", "image-gen"],
    free: false,
    accent: "#ec4899",
  },
];

export const DEFAULT_MODEL_ID = "echo-flash";

export function getModel(id: string): AIModel {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

export const TIER_LABEL: Record<ModelTier, string> = {
  fast: "Fast",
  balanced: "Balanced",
  reasoning: "Reasoning",
  creative: "Creative",
};

export const CAPABILITY_LABEL: Record<ModelCapability, string> = {
  text: "Text",
  vision: "Vision",
  code: "Code",
  web: "Web search",
  files: "File upload",
  "image-gen": "Image generation",
};
