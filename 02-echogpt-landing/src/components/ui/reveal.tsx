"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ElementType, type ReactNode, type Ref } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger index — multiplied by 60ms. */
  delay?: number;
  /** Travel distance in px before settling. */
  y?: number;
  as?: ElementType;
}

/**
 * Scroll-in wrapper. Animates transform + opacity only (never layout), fires
 * once, and collapses to a plain fade-free render when the user has asked for
 * reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduce) {
    const Tag = as as ElementType;
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.55,
        delay: delay * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
