import { cn } from "@/lib/utils";

export interface AvatarProps {
  /** Monogram — every avatar here is drawn in CSS, never fetched. */
  initials: string;
  /** Any CSS background value: a solid colour or a gradient. */
  background?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  /** Small status pip in the corner. */
  status?: "online" | "busy" | null;
  title?: string;
}

const SIZES = {
  xs: "size-6 text-[0.625rem] rounded-xs",
  sm: "size-8 text-xs rounded-sm",
  md: "size-10 text-sm rounded-md",
  lg: "size-12 text-base rounded-md",
} as const;

export function Avatar({
  initials,
  background = "linear-gradient(135deg, #8347fb, #22d3ee)",
  size = "sm",
  className,
  status = null,
  title,
}: AvatarProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        title={title}
        aria-hidden
        className={cn(
          "inline-flex items-center justify-center font-semibold uppercase tracking-wide text-white ring-1 ring-inset ring-white/15",
          SIZES[size],
        )}
        style={{ background }}
      >
        {initials.slice(0, 2)}
      </span>
      {status ? (
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-surface",
            status === "online" ? "bg-success" : "bg-warning",
          )}
        />
      ) : null}
    </span>
  );
}
