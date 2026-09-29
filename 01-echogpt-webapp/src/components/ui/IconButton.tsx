"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type IconButtonVariant = "ghost" | "solid" | "subtle" | "primary";
export type IconButtonSize = "xs" | "sm" | "md";

const VARIANTS: Record<IconButtonVariant, string> = {
  ghost: "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
  subtle: "bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground",
  solid: "bg-surface-3 text-foreground hover:bg-border",
  primary: "bg-primary text-primary-foreground hover:bg-brand-700 dark:hover:bg-brand-400",
};

const SIZES: Record<IconButtonSize, string> = {
  xs: "size-7 rounded-xs [&_svg]:size-3.5",
  sm: "size-8 rounded-sm [&_svg]:size-4",
  md: "size-10 rounded-md [&_svg]:size-[1.125rem]",
};

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required — every icon-only control needs an accessible name. */
  label: string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Renders the pressed state for toggles. */
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, icon, variant = "ghost", size = "sm", active, className, type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={cn(
          "inline-flex shrink-0 items-center justify-center transition-colors duration-150",
          "disabled:pointer-events-none disabled:opacity-40",
          VARIANTS[variant],
          SIZES[size],
          active && "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
          className,
        )}
        {...props}
      >
        {icon}
      </button>
    );
  },
);
