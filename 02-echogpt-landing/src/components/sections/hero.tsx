import { ShieldCheck, Sparkles, Star } from "lucide-react";
import { SITE } from "@/lib/site";
import { ChromeMark } from "@/components/ui/brand-icons";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { GradientBlur, GridBackdrop } from "@/components/ui/gradient-blur";
import { Reveal } from "@/components/ui/reveal";
import { HeroVisual } from "./hero-visual";

const TRUST = [
  {
    icon: <Star className="size-3.5 fill-amber-400 text-amber-400" />,
    text: `${SITE.extension.rating.toFixed(1)} on the Chrome Web Store`,
  },
  {
    icon: <ShieldCheck className="size-3.5 text-emerald-500" />,
    text: "No third-party analytics",
  },
  {
    icon: <Sparkles className="size-3.5 text-brand-500" />,
    text: "Free to start, no card",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
    >
      <GridBackdrop />
      <GradientBlur className="-left-24 top-0 size-[28rem]" tone="bg-brand-500/20" float />
      <GradientBlur
        className="-right-20 top-40 size-[24rem]"
        tone="bg-accent-400/20"
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
          <div className="flex flex-col items-start">
            <Reveal>
              <a
                href="#models"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 py-1 pl-1 pr-3 text-xs font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
              >
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  New
                </span>
                Compare two models on the same prompt
              </a>
            </Reveal>

            <Reveal delay={1}>
              <h1
                id="hero-title"
                className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
              >
                Every AI model,{" "}
                <span className="text-gradient">one secure sidebar</span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                EchoGPT puts OpenAI, Anthropic, Google, Meta and Mistral models
                behind one picker — right beside the page you're reading.
                Summarise a long article, explain what you've highlighted, and
                compare two answers without a single third-party tracker.
              </p>
            </Reveal>

            <Reveal delay={3} className="mt-8 w-full">
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={SITE.chromeStore} size="lg" className="sm:w-auto">
                  <ChromeMark className="size-5" />
                  Add to Chrome — it's free
                </ButtonLink>
                <ButtonLink href={SITE.webApp} variant="outline" size="lg">
                  Open the web app
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={4} className="mt-7 w-full">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {TRUST.map((item) => (
                  <li
                    key={item.text}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                  >
                    {item.icon}
                    {item.text}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={3} y={24} className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-500/10 via-transparent to-accent-400/10 blur-2xl" />
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
