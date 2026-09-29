import { STEPS } from "@/data/steps";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="scroll-mt-20 py-20 sm:py-24"
    >
      <Container>
        <SectionHeading
          id="how-it-works-title"
          eyebrow="How it works"
          title="Three steps, about ninety seconds"
          description="No workspace to configure, no API key to paste before you can ask your first question."
        />

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* The connecting line — decorative, and only where there is room. */}
          <span
            aria-hidden="true"
            className="absolute left-5 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-500/60 via-brand-400/40 to-transparent sm:block md:left-0 md:top-5 md:h-px md:w-full md:bg-gradient-to-r md:from-brand-500/50 md:via-brand-400/50 md:to-transparent"
          />

          {STEPS.map((step, index) => (
            <Reveal key={step.id} delay={index} as="li" className="relative pl-16 sm:pl-16 md:pl-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-brand-300 bg-background text-sm font-semibold text-brand-700 shadow-soft dark:border-brand-700 dark:text-brand-300 md:relative md:mb-5"
              >
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
              <p className="mt-4 inline-block rounded-md border border-border bg-surface-2 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">
                {step.hint}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
