"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "xs" | "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-brand-700 dark:hover:bg-brand-400 shadow-soft",
  secondary:
    "bg-surface-2 text-foreground hover:bg-surface-3 border border-border",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-surface-2",
  outline:
    "border border-border-strong text-foreground hover:bg-surface-2 hover:border-brand-400",
  danger:
    "border border-danger/40 text-danger hover:bg-danger/10 hover:border-danger",
};

const SIZES: Record<Size, string> = {
  xs: "h-7 px-2.5 text-xs gap-1.5 rounded-sm",
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-sm",
  md: "h-9 px-4 text-sm gap-2 rounded-md",
};

const BASE =
  "inline-flex select-none items-center justify-center font-medium transition-colors duration-150 " +
  "disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Stretches to the container width. */
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "secondary", size = "sm", block, className, type, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          BASE,
          VARIANTS[variant],
          SIZES[size],
          block && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: these buttons have no visible text. */
  label: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const ICON_SIZES: Record<Size, string> = {
  xs: "h-6 w-6 rounded-xs [&_svg]:size-3.5",
  sm: "h-7 w-7 rounded-sm [&_svg]:size-4",
  md: "h-9 w-9 rounded-md [&_svg]:size-[18px]",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, variant = "ghost", size = "sm", className, children, type, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        aria-label={label}
        title={label}
        className={cn(BASE, VARIANTS[variant], ICON_SIZES[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
