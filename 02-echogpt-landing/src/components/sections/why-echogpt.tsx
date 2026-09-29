import { Check, Minus, X } from "lucide-react";
import {
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  STATS,
  type CellState,
  type ComparisonCell,
  type ComparisonRow,
} from "@/data/comparison";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const MARKS: Record<CellState, { Icon: typeof Check; className: string; label: string }> = {
  yes: {
    Icon: Check,
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    label: "Yes",
  },
  partial: {
    Icon: Minus,
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    label: "Partly",
  },
  no: {
    Icon: X,
    className: "bg-red-500/15 text-red-700 dark:text-red-400",
    label: "No",
  },
};

function Mark({ cell }: { cell: ComparisonCell }) {
  const { Icon, className, label } = MARKS[cell.state];
  return (
    <span className="flex items-start gap-2">
      <span
        className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", className)}
      >
        <Icon className="size-3.5" aria-hidden="true" />
        <span className="sr-only">{label}:</span>
      </span>
      <span className="text-sm leading-snug text-muted-foreground">{cell.text}</span>
    </span>
  );
}

export function WhyEchoGPT() {
  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="scroll-mt-20 border-y border-border bg-background-subtle py-20 sm:py-24"
    >
      <Container size="wide">
        <SectionHeading
          id="why-title"
          eyebrow="Why EchoGPT"
          title="The alternative isn't 'no AI'. It's three invoices and twelve tabs."
          description="Most people already use more than one model. The question is what that costs you in money and in attention."
        />

        {/* Desktop: a real table. Screen readers get proper row/column headers. */}
        <Reveal delay={1} className="mt-12 hidden lg:block">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                EchoGPT compared with paying for one subscription per model and
                with switching between vendor tabs.
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[26%] px-5 py-4 text-sm font-semibold">
                    What you're comparing
                  </th>
                  {COMPARISON_COLUMNS.map((column) => (
                    <th
                      key={column.id}
                      scope="col"
                      className={cn(
                        "px-5 py-4 text-sm font-semibold",
                        column.highlight &&
                          "bg-brand-50 text-brand-800 dark:bg-brand-950/50 dark:text-brand-200",
                      )}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <th
                      scope="row"
                      className="px-5 py-4 align-top text-sm font-medium text-foreground"
                    >
                      {row.criterion}
                    </th>
                    <td className="bg-brand-50/50 px-5 py-4 align-top dark:bg-brand-950/25">
                      <Mark cell={row.echogpt} />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <Mark cell={row.subscriptions} />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <Mark cell={row.tabs} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Mobile: the same data as stacked cards, one per criterion. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:hidden">
          {COMPARISON_ROWS.map((row, index) => (
            <Reveal key={row.id} delay={index % 2}>
              <StackedRow row={row} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {STATS.map((stat, index) => (
            <Reveal key={stat.id} delay={index}>
              <div className="h-full rounded-xl border border-border bg-card p-6 text-center shadow-soft">
                <p className="text-4xl font-semibold tracking-tight text-gradient">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {stat.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StackedRow({ row }: { row: ComparisonRow }) {
  const cells: { label: string; cell: ComparisonCell; highlight?: boolean }[] = [
    { label: "EchoGPT", cell: row.echogpt, highlight: true },
    { label: "One subscription per model", cell: row.subscriptions },
    { label: "Switching tabs all day", cell: row.tabs },
  ];

  return (
    <div className="h-full rounded-xl border border-border bg-card p-5 shadow-soft">
      <h3 className="text-sm font-semibold text-foreground">{row.criterion}</h3>
      <dl className="mt-4 space-y-3">
        {cells.map(({ label, cell, highlight }) => (
          <div
            key={label}
            className={cn(
              "rounded-lg px-3 py-2.5",
              highlight
                ? "bg-brand-50 dark:bg-brand-950/40"
                : "bg-surface-2",
            )}
          >
            <dt
              className={cn(
                "text-[11px] font-semibold uppercase tracking-wide",
                highlight
                  ? "text-brand-700 dark:text-brand-300"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </dt>
            <dd className="mt-1.5">
              <Mark cell={cell} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
