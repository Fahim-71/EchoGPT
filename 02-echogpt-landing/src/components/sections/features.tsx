import {
  Columns2,
  ImageIcon,
  Layers,
  PanelRight,
  Plug,
  ShieldCheck,
  TextSelect,
  type LucideIcon,
} from "lucide-react";
import { FEATURES, type FeatureIcon } from "@/data/features";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { FeatureVisual } from "./feature-visuals";

const ICONS: Record<FeatureIcon, LucideIcon> = {
  layers: Layers,
  panel: PanelRight,
  "text-select": TextSelect,
  columns: Columns2,
  image: ImageIcon,
  plug: Plug,
  shield: ShieldCheck,
};

/** Column spans on the lg 6-track grid, kept out of the data file. */
const SPANS: Record<2 | 3 | 4, string> = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
};

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-20 py-20 sm:py-24"
    >
      <Container size="wide">
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title="Built for the way you actually work"
          description="Not a chat box in a tab you forgot about — a sidebar that shows up on the page you're already reading, with every model behind one picker."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {FEATURES.map((feature, index) => {
            const Icon = ICONS[feature.icon];
            return (
              <Reveal
                key={feature.id}
                delay={index}
                className={cn("flex", SPANS[feature.span])}
              >
                <article className="group flex w-full flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift sm:p-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.benefit}
                  </p>
                  <div className="mt-auto">
                    <FeatureVisual kind={feature.visual} />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
