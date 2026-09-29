import type { SVGProps } from "react";

/**
 * Hand-drawn marks. `lucide-react@1` dropped every brand icon (there is no
 * `Chrome` export), and remote images are off the table, so these are inline
 * SVG paths that inherit `currentColor` and therefore follow the theme.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true as const,
  focusable: "false" as const,
};

export function ChromeMark(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.9 4.02L3.6 5.5A9.98 9.98 0 0 1 12 2Zm-9.42 5.3 3.5 6.07A5 5 0 0 0 10.6 16.9l-2.9 5.03A10 10 0 0 1 2.58 7.3ZM12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm9.6 0A10 10 0 0 1 12.2 22l3.53-6.12A5 5 0 0 0 16.2 8.5h5.4Z" />
    </svg>
  );
}

export function XMark(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M17.53 3h3.17l-6.93 7.92L21.94 21h-6.4l-5-6.54L4.78 21H1.6l7.41-8.47L2 3h6.56l4.52 5.98L17.53 3Zm-1.11 16.1h1.75L7.66 4.8H5.78l10.64 14.3Z" />
    </svg>
  );
}

export function GitHubMark(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function DiscordMark(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19.3 5.34A16.9 16.9 0 0 0 15.1 4l-.2.4c1.4.35 2.6.94 3.7 1.75a13.9 13.9 0 0 0-13.2 0A11.6 11.6 0 0 1 9.1 4.4L8.9 4a16.9 16.9 0 0 0-4.2 1.34C2.1 9.2 1.4 13 1.7 16.7a17 17 0 0 0 5.2 2.6l1.1-1.7c-.6-.24-1.2-.53-1.7-.88l.4-.3a12.1 12.1 0 0 0 10.6 0l.4.3c-.5.35-1.1.64-1.7.88l1.1 1.7a17 17 0 0 0 5.2-2.6c.4-4.3-.7-8.05-2.9-11.36ZM8.6 14.5c-1 0-1.9-.94-1.9-2.1s.9-2.1 1.9-2.1 1.9.95 1.9 2.1-.85 2.1-1.9 2.1Zm6.8 0c-1.05 0-1.9-.94-1.9-2.1s.85-2.1 1.9-2.1 1.9.95 1.9 2.1-.85 2.1-1.9 2.1Z" />
    </svg>
  );
}

/** The EchoGPT mark: concentric "echo" arcs inside a brand-gradient tile. */
export function EchoLogo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={
        "grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 text-white shadow-soft " +
        (className ?? "")
      }
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M8.5 9.5a4.5 4.5 0 0 1 0 5" opacity="0.55" />
        <path d="M12 7a8 8 0 0 1 0 10" opacity="0.8" />
        <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}
