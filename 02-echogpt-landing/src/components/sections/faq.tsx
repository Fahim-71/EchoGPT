import { FAQS } from "@/data/faq";
import { SITE } from "@/lib/site";
import { Accordion } from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-20 py-20 sm:py-24"
    >
      <Container size="narrow">
        <SectionHeading
          id="faq-title"
          eyebrow="FAQ"
          title="The questions people actually ask"
          description="Models, money, privacy and the keyboard shortcut — in that order."
        />

        <Reveal delay={1} className="mt-10">
          <Accordion items={FAQS} defaultOpenId={FAQS[0].id} />
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Still stuck?{" "}
            <a
              href={SITE.webApp}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-600 dark:text-brand-300"
            >
              Ask us in the web app
            </a>{" "}
            — the same sidebar, minus the extension.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
