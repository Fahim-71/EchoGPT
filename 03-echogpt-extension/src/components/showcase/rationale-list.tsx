"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { RATIONALE } from "@/data/rationale";
import { cn } from "@/lib/utils";

export interface RationaleListProps {
  className?: string;
}

/**
 * The audit, rendered from `src/data/rationale.ts` — the same array the README
 * is written from, so the demo and the write-up cannot disagree about what was
 * claimed.
 */
export function RationaleList({ className }: RationaleListProps) {
  return (
    <ol className={cn("space-y-3", className)}>
      {RATIONALE.map((item, index) => (
        <RationaleRow key={item.id} index={index} item={item} />
      ))}
    </ol>
  );
}

function RationaleRow({
  item,
  index,
}: {
  item: (typeof RATIONALE)[number];
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.32, delay: Math.min(index, 4) * 0.04 }}
      className="overflow-hidden rounded-lg border border-border bg-surface shadow-soft"
    >
      <div className="grid gap-px bg-border md:grid-cols-2">
        {/* Problem */}
        <div className="bg-surface p-4">
          <div className="flex items-start gap-2.5">
            <span
              aria-hidden
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-danger/12 text-[10px] font-bold text-danger"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-danger">
                <X aria-hidden className="size-3" />
                Today
              </p>
              <h3 className="mt-1 text-[14px] font-semibold leading-snug tracking-tight text-foreground">
                {item.problem}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {item.cost}
              </p>
            </div>
          </div>
        </div>

        {/* Fix */}
        <div className="bg-surface p-4">
          <div className="flex items-start gap-2.5">
            <ArrowRight
              aria-hidden
              className="mt-0.5 hidden size-4 shrink-0 text-brand-500 md:block"
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-success">
                <Check aria-hidden className="size-3" />
                In this redesign
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/90">
                {item.fix}
              </p>
              <Badge tone="brand" micro className="mt-2">
                {item.surface}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
