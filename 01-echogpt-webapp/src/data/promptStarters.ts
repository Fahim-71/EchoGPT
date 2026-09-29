/**
 * Prompt starters.
 *
 * The live app shows four cards, each a 2–3 line paragraph — unscannable, and
 * you cannot tell at a glance what any of them will do. These are one-liners,
 * categorised so the grid can be filtered, with the full prompt kept separate
 * from the short label that gets rendered.
 */

import type { LucideIcon } from "lucide-react";
import { Code2, GraduationCap, PenLine, Rocket, Sparkles } from "lucide-react";

export type StarterCategory = "create" | "write" | "code" | "learn" | "plan";

export interface StarterCategoryMeta {
  id: StarterCategory;
  label: string;
  icon: LucideIcon;
  /** Identity colour for the card's icon tile. */
  accent: string;
}

export const STARTER_CATEGORIES: StarterCategoryMeta[] = [
  { id: "create", label: "Create", icon: Sparkles, accent: "#8347fb" },
  { id: "write", label: "Write", icon: PenLine, accent: "#06b6d4" },
  { id: "code", label: "Code", icon: Code2, accent: "#10b981" },
  { id: "learn", label: "Learn", icon: GraduationCap, accent: "#f59e0b" },
  { id: "plan", label: "Plan", icon: Rocket, accent: "#ec4899" },
];

export interface PromptStarter {
  id: string;
  category: StarterCategory;
  /** One scannable line — this is all the card shows. */
  label: string;
  /** The text actually dropped into the composer. */
  prompt: string;
}

export const PROMPT_STARTERS: PromptStarter[] = [
  {
    id: "brainstorm-names",
    category: "create",
    label: "Brainstorm 20 product names",
    prompt:
      "Brainstorm 20 product names for a privacy-first note-taking app. Group them by tone and flag any that are likely already taken.",
  },
  {
    id: "story-hook",
    category: "create",
    label: "Turn a dull idea into a hook",
    prompt:
      "Take this idea and write three opening hooks that would make someone keep reading: a guide to switching bank accounts.",
  },
  {
    id: "moodboard",
    category: "create",
    label: "Design a colour palette from a mood",
    prompt:
      "Design a colour palette for a brand that should feel calm, technical and slightly nocturnal. Give hex values and say where each colour is used.",
  },
  {
    id: "cover-letter",
    category: "write",
    label: "Write a cover letter from my CV",
    prompt:
      "Write a cover letter for a frontend engineer role. Keep it under 250 words, lead with impact rather than duties, and avoid filler phrases.",
  },
  {
    id: "shorten",
    category: "write",
    label: "Cut this email in half",
    prompt:
      "Rewrite the email I paste next at half the length without losing any commitment, date or number it contains.",
  },
  {
    id: "social",
    category: "write",
    label: "Draft a launch post that isn't hype",
    prompt:
      "Draft a launch announcement post for a small developer tool. Concrete, specific, no superlatives, no emoji.",
  },
  {
    id: "review-code",
    category: "code",
    label: "Review this function for bugs",
    prompt:
      "Review the function I paste next. Point out correctness bugs first, then performance, then style — and say which ones actually matter.",
  },
  {
    id: "explain-error",
    category: "code",
    label: "Explain a stack trace in plain English",
    prompt:
      "Explain the stack trace I paste next in plain English, then tell me the two most likely causes and how to tell them apart.",
  },
  {
    id: "write-tests",
    category: "code",
    label: "Write tests for an edge case",
    prompt:
      "Write unit tests for the function I paste next, focusing on the edge cases a reviewer would ask about rather than the happy path.",
  },
  {
    id: "explain-simply",
    category: "learn",
    label: "Explain a hard concept three ways",
    prompt:
      "Explain eventual consistency three times: once for a child, once for a product manager, and once for a backend engineer.",
  },
  {
    id: "compare-options",
    category: "learn",
    label: "Compare two options honestly",
    prompt:
      "Compare server components and client components honestly — including the cases where the newer option is the wrong choice.",
  },
  {
    id: "quiz-me",
    category: "learn",
    label: "Quiz me until I actually know it",
    prompt:
      "Quiz me on CSS layout. Ask one question at a time, get harder when I'm right, and explain properly when I'm wrong.",
  },
  {
    id: "week-plan",
    category: "plan",
    label: "Plan a realistic learning week",
    prompt:
      "Plan a realistic week of learning TypeScript around a full-time job. Assume 45 minutes a day and one bad day.",
  },
  {
    id: "decision",
    category: "plan",
    label: "Pressure-test a decision I've made",
    prompt:
      "I've decided to rewrite our design system in-house. Argue the strongest case against it, then tell me what would have to be true for it to be right.",
  },
  {
    id: "meeting-agenda",
    category: "plan",
    label: "Turn a vague goal into an agenda",
    prompt:
      "Turn 'we need to improve onboarding' into a 30-minute meeting agenda with a decision at the end, not just discussion.",
  },
];

export function startersByCategory(category: StarterCategory | "all"): PromptStarter[] {
  return category === "all"
    ? PROMPT_STARTERS
    : PROMPT_STARTERS.filter((s) => s.category === category);
}
