import { useId } from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  /** Pixel size of the square mark. */
  size?: number;
}

/**
 * The EchoGPT mark: a rounded square holding three nested "echo" arcs.
 *
 * Inline SVG rather than an image file, because the same shape is used in the
 * popup header, the side panel header, the showcase toolbar and — rasterised by
 * `scripts/gen-icons.mjs` — the extension's 16/32/48/128px PNG icons.
 */
export function Logo({ className, size = 22 }: LogoProps) {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="EchoGPT"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a076ff" />
          <stop offset="55%" stopColor="#6d28f5" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#g-${id})`} />
      <g
        fill="none"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeOpacity="0.95"
      >
        <circle cx="11.5" cy="16" r="2.6" fill="#ffffff" stroke="none" />
        <path d="M17 11.2a6.6 6.6 0 0 1 0 9.6" strokeWidth="2.2" />
        <path d="M21.6 8.4a10.4 10.4 0 0 1 0 15.2" strokeWidth="2.2" strokeOpacity="0.62" />
      </g>
    </svg>
  );
}

export interface SiteFaviconProps {
  host: string;
  hue?: number;
  size?: number;
  className?: string;
}

/**
 * A generated favicon: the site's initial on a hue derived from its host.
 *
 * No remote images anywhere in this project, and `chrome://favicon` is not
 * available to MV3 pages without an extra permission — a deterministic
 * monogram is honest about being a placeholder and costs nothing.
 */
export function SiteFavicon({ host, hue, size = 16, className }: SiteFaviconProps) {
  const clean = host.replace(/^www\./, "");
  const resolvedHue =
    hue ?? [...clean].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 360, 7);

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[4px] font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.56,
        background: `linear-gradient(135deg, hsl(${resolvedHue} 72% 58%), hsl(${(resolvedHue + 38) % 360} 68% 44%))`,
      }}
    >
      {clean.charAt(0).toUpperCase()}
    </span>
  );
}
