"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { PRICING_FOOTNOTE, PRICING_TIERS, type PricingTier } from "@/data/pricing";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ChromeMark } from "@/components/ui/brand-icons";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Switch } from "@/components/ui/switch";

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="scroll-mt-20 py-20 sm:py-24"
    >
      <Container size="wide">
        <SectionHeading
          id="pricing-title"
          eyebrow="Pricing"
          title="Start free. Upgrade when one model stops being enough."
          description="The Chrome extension is free on the Web Store, and the free tier is a real product rather than a trial with a timer on it."
        />

        <Reveal delay={1} className="mt-10 flex items-center justify-center gap-3">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              annual ? "text-muted-foreground" : "text-foreground",
            )}
          >
            Monthly
          </span>
          <Switch
            checked={annual}
            onCheckedChange={setAnnual}
            label="Bill annually and save 25%"
            hideLabel
          />
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              annual ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Annual
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            Save 25%
          </span>
        </Reveal>

        <div className="mt-10 grid items-start gap-5 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, index) => (
            <Reveal key={tier.id} delay={index} className="flex">
              <TierCard tier={tier} annual={annual} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={3}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
            {PRICING_FOOTNOTE}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

interface TierCardProps {
  tier: PricingTier;
  annual: boolean;
}

function TierCard({ tier, annual }: TierCardProps) {
  const price = annual ? tier.annual : tier.monthly;
  const href = tier.cta.href === "chrome" ? SITE.chromeStore : SITE.webApp;

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col rounded-xl border bg-card p-6 shadow-soft",
        tier.popular
          ? "border-brand-400 shadow-lift ring-1 ring-brand-500/30"
          : "border-border",
      )}
    >
      {tier.popular ? (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
          Most popular
        </span>
      ) : null}

      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {tier.name}
      </h3>
      <p className="mt-1.5 min-h-10 text-sm leading-relaxed text-muted-foreground">
        {tier.tagline}
      </p>

      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
          {price === 0 ? "Free" : `$${price}`}
        </span>
        {price > 0 ? (
          <span className="text-sm text-muted-foreground">
            / {tier.id === "team" ? "seat / month" : "month"}
          </span>
        ) : null}
      </p>
      <p className="mt-1 min-h-5 text-xs text-muted-foreground">
        {price > 0 && annual
          ? `Billed $${price * 12} once a year`
          : price > 0
            ? "Billed monthly, cancel any time"
            : "No card required"}
      </p>

      <ButtonLink
        href={href}
        variant={tier.popular ? "primary" : "secondary"}
        size="md"
        className="mt-6 w-full"
      >
        {tier.cta.href === "chrome" ? <ChromeMark className="size-4" /> : null}
        {tier.cta.label}
      </ButtonLink>

      <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-border pt-6">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <span className="text-sm leading-snug text-muted-foreground">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {tier.note ? (
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          {tier.note}
        </p>
      ) : null}
    </div>
  );
}
