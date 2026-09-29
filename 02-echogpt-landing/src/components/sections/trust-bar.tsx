import { MODEL_VENDORS } from "@/data/features";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/**
 * Vendor wordmarks as text chips. No logo images — partly because remote
 * images are off the table here, and partly because vendor logos carry
 * trademark baggage that plain text does not.
 */
export function TrustBar() {
  return (
    <section
      aria-labelledby="trust-bar-title"
      className="border-y border-border bg-background-subtle py-10"
    >
      <Container size="wide">
        <Reveal className="flex flex-col items-center gap-6">
          <h2
            id="trust-bar-title"
            className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            One picker, models from
          </h2>
          <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {MODEL_VENDORS.map((vendor) => (
              <li key={vendor}>
                <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold tracking-tight text-foreground/80 shadow-soft transition-colors hover:border-border-strong hover:text-foreground">
                  {vendor}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
