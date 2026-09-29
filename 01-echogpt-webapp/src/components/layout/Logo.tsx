import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  /** Hide the wordmark, leaving only the mark. */
  markOnly?: boolean;
}

/**
 * EchoGPT mark — concentric arcs echoing outward from a core dot, drawn
 * entirely in SVG so it stays crisp and needs no network request.
 */
export function Logo({ className, markOnly }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        role="img"
        aria-label="EchoGPT"
        className="size-7 shrink-0"
      >
        <defs>
          <linearGradient id="echo-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8347fb" />
            <stop offset="55%" stopColor="#a076ff" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#echo-mark)" />
        <circle cx="16" cy="16" r="2.6" fill="#fff" />
        <path
          d="M21 11.2a7 7 0 0 1 0 9.6"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M24.6 7.8a12 12 0 0 1 0 16.4"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M11 20.8a7 7 0 0 1 0-9.6"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M7.4 24.2a12 12 0 0 1 0-16.4"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
      {!markOnly ? (
        <span className="text-[0.9375rem] font-semibold tracking-tight text-foreground">
          Echo<span className="text-gradient">GPT</span>
        </span>
      ) : null}
    </span>
  );
}
