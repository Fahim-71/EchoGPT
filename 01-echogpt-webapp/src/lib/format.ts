/**
 * Small formatting helpers shared across the workspace. Kept dependency-free so
 * they can run on the server during the initial render as well as in the client.
 */

/** Rough token estimate. Good enough for a live composer counter. */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.trim().length / 4);
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return String(n);
}

/** "128K context" style label from the model's contextK field. */
export function formatContext(contextK: number): string {
  return contextK >= 1000 ? `${contextK / 1000}M context` : `${contextK}K context`;
}

const RELATIVE_UNITS: [limitSeconds: number, divisor: number, unit: Intl.RelativeTimeFormatUnit][] = [
  [60, 1, "second"],
  [3600, 60, "minute"],
  [86400, 3600, "hour"],
  [604800, 86400, "day"],
  [2629800, 604800, "week"],
  [31557600, 2629800, "month"],
  [Infinity, 31557600, "year"],
];

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "3 hours ago" — stable between server and client because `now` is injected. */
export function relativeTime(iso: string, now: number = Date.now()): string {
  const diffSeconds = (new Date(iso).getTime() - now) / 1000;
  const abs = Math.abs(diffSeconds);
  for (const [limit, divisor, unit] of RELATIVE_UNITS) {
    if (abs < limit) return rtf.format(Math.round(diffSeconds / divisor), unit);
  }
  return new Date(iso).toLocaleDateString();
}

export type DateGroup = "Today" | "Yesterday" | "Previous 7 days" | "Previous 30 days" | "Older";

export function dateGroup(iso: string, now: number = Date.now()): DateGroup {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const then = new Date(iso).getTime();
  const days = Math.floor((startOfToday.getTime() - then) / 86_400_000);
  if (days < 0) return "Today";
  if (days < 1) return "Yesterday";
  if (days < 7) return "Previous 7 days";
  if (days < 30) return "Previous 30 days";
  return "Older";
}

export const DATE_GROUP_ORDER: DateGroup[] = [
  "Today",
  "Yesterday",
  "Previous 7 days",
  "Previous 30 days",
  "Older",
];

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Forgiving subsequence match used by the command palette and model search:
 * "cmpr" matches "Compare models". Returns a score so better matches sort first,
 * or -1 when the needle is not contained at all.
 */
export function fuzzyScore(haystack: string, needle: string): number {
  if (!needle) return 0;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase().trim();
  if (!n) return 0;

  const direct = h.indexOf(n);
  if (direct === 0) return 1000;
  if (direct > 0) return 800 - direct;

  let score = 0;
  let hIndex = 0;
  let streak = 0;
  for (const char of n) {
    const found = h.indexOf(char, hIndex);
    if (found === -1) return -1;
    streak = found === hIndex ? streak + 1 : 0;
    score += 10 + streak * 4 - Math.min(found - hIndex, 8);
    hIndex = found + 1;
  }
  return score;
}

/** Filter + rank a list by a fuzzy query over a derived search string. */
export function fuzzyFilter<T>(items: T[], query: string, toText: (item: T) => string): T[] {
  if (!query.trim()) return items;
  return items
    .map((item) => ({ item, score: fuzzyScore(toText(item), query) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
