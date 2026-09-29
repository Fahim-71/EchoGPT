"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface FakeArticleProps {
  /** Text inserted by the side panel's "insert into page" action. */
  insertion?: string | null;
  className?: string;
}

/**
 * The page the extension is acting on.
 *
 * Real DOM, real selectable text — not a screenshot — because the selection
 * tooltip demo only means anything if the visitor can actually drag across a
 * sentence and watch the bar appear. Styled as generic editorial rather than
 * any real publication.
 */
export const FakeArticle = forwardRef<HTMLDivElement, FakeArticleProps>(
  function FakeArticle({ insertion, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "scrollbar-thin h-full overflow-y-auto bg-white text-[#1c1a24]",
          className,
        )}
      >
        <article className="mx-auto max-w-[620px] px-8 py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d28f5]">
            Analysis
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-[1.18] tracking-tight">
            The quiet economics of browser extensions
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-[#6b6880]">
            <span className="font-medium text-[#1c1a24]">Dana Iyer</span>
            <span aria-hidden>·</span>
            <span>12 min read</span>
            <span aria-hidden>·</span>
            <span>March 2026</span>
          </p>

          <div className="mt-6 space-y-4 text-[15px] leading-[1.75]">
            <p className="text-[17px] leading-[1.7] text-[#39364a]">
              Every extension store ranks by installs. It is the number on the
              listing, the number in the pitch deck, and the number nobody should
              be using — because it stops predicting anything roughly two weeks
              after launch.
            </p>
            <p>
              The number that survives is weekly active use, and the gap between
              the two opens almost immediately. In a sample of 340 productivity
              extensions, median week-four retention was 19 percent. The top
              decile held 61 percent. Those two groups did not differ much in
              what they could do. They differed in what they asked for first.
            </p>
            <p>
              Most extensions front-load their cost. A permissions prompt, then
              an account, then a settings screen with a field for an API
              endpoint. Each of those is a place to quit, and every one of them
              happens before the user has felt a single moment of value. The
              extension has charged its whole price and delivered nothing.
            </p>
            <blockquote className="border-l-2 border-[#6d28f5] pl-4 text-[#39364a] italic">
              "A sign-in wall in front of a summarise button is a toll booth on a
              road nobody has driven yet. You cannot price something the
              traveller has not seen."
            </blockquote>
            <p>
              The counter-example is dull and consistent. Extensions that retain
              put one genuinely useful act on the first screen — one summary, one
              conversion, one lookup — and defer every gate until the user has a
              reason to care about it. Sign-in then stops being a toll and starts
              being an upgrade: it buys sync, or history, or a shared workspace,
              and the user can see what they are buying.
            </p>
            <p>
              None of this holds for the categories whose whole value <em>is</em>{" "}
              configuration. A password manager that let you in without setting up
              a vault would be broken. A VPN with no server choice is not a VPN.
              Those products earn their setup screens because the setup is the
              product.
            </p>
            <h2 className="pt-2 text-[20px] font-semibold tracking-tight">
              Measuring the first ninety seconds
            </h2>
            <p>
              The metric that falls out of this is unglamorous: time to first
              useful output, in seconds, from the moment the extension is
              installed. Not activation. Not D1. Seconds. Instrument it, then walk
              your own install flow with a stopwatch and count the screens
              standing between the user and an answer.
            </p>

            {insertion && (
              <aside className="rounded-lg border-2 border-dashed border-[#6d28f5] bg-[#f5f2ff] p-4">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#6d28f5]">
                  Inserted by EchoGPT
                </p>
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#39364a]">
                  {insertion.slice(0, 420)}
                  {insertion.length > 420 && "…"}
                </p>
              </aside>
            )}

            <p>
              The extensions in that top decile were not better engineered. They
              were better ordered. That is a design decision, it is cheap to
              change, and almost nobody makes it deliberately.
            </p>
          </div>
        </article>
      </div>
    );
  },
);
