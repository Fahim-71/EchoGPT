import { Star } from "lucide-react";
import { SITE } from "@/lib/site";
import { ChromeMark } from "@/components/ui/brand-icons";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function FinalCta() {
  return (
    <section
      id="get-started"
      aria-labelledby="final-cta-title"
      className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <Container size="wide" className="px-0 sm:px-0 lg:px-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-6 py-14 text-center shadow-lift sm:px-10 sm:py-20">
            {/* Decorative wash + grid, both CSS only. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-20 size-72 rounded-full bg-white/15 blur-3xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-10 size-80 rounded-full bg-accent-400/25 blur-3xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, black 10%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, black 10%, transparent 70%)",
              }}
            />

            <div className="relative mx-auto max-w-2xl">
              <h2
                id="final-cta-title"
                className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              >
                Stop paying three times to ask the same question
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/85">
                Add the sidebar to Chrome in one click, or open the web app and
                start in the browser you already have. Free to start, no card,
                no third-party analytics.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink href={SITE.chromeStore} variant="inverse" size="lg">
                  <ChromeMark className="size-5" />
                  Add to Chrome — free
                </ButtonLink>
                <ButtonLink
                  href={SITE.webApp}
                  size="lg"
                  className="border border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                >
                  Open the web app
                </ButtonLink>
              </div>

              <p className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-white/80">
                <Star aria-hidden="true" className="size-3.5 fill-amber-300 text-amber-300" />
                {SITE.extension.rating.toFixed(1)} on the Chrome Web Store ·
                v{SITE.extension.version} · {SITE.extension.size}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
