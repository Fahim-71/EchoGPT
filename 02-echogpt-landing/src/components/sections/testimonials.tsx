import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "@/components/ui/section-heading";

/** Avatar gradients, indexed by the testimonial's `accent`. */
const AVATAR_GRADIENTS = [
  "from-brand-500 to-accent-400",
  "from-amber-400 to-rose-500",
  "from-emerald-400 to-cyan-500",
  "from-fuchsia-500 to-brand-600",
  "from-sky-400 to-indigo-500",
  "from-rose-400 to-orange-400",
] as const;

export function Testimonials() {
  // Split into two rows so the marquee reads as a wall, not a queue.
  const rowOne = TESTIMONIALS.slice(0, 3);
  const rowTwo = TESTIMONIALS.slice(3);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="scroll-mt-20 overflow-hidden border-y border-border bg-background-subtle py-20 sm:py-24"
    >
      <Container size="wide">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Testimonials"
          title="What people do with it once it's installed"
          description="Illustrative quotes for this build — the workflows they describe are the ones EchoGPT is actually designed around."
        />
      </Container>

      <div className="relative mt-12 space-y-4">
        {/* Edge fades so cards enter and leave instead of being cut off. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background-subtle to-transparent sm:w-24"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background-subtle to-transparent sm:w-24"
        />

        <Marquee aria-label="Customer quotes, row one" duration={52}>
          {rowOne.map((item) => (
            <QuoteCard key={item.id} item={item} />
          ))}
        </Marquee>
        <Marquee aria-label="Customer quotes, row two" duration={64} reverse>
          {rowTwo.map((item) => (
            <QuoteCard key={item.id} item={item} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function QuoteCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col rounded-xl border border-border bg-card p-5 shadow-soft sm:w-[22rem]">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5 text-brand-400"
        fill="currentColor"
      >
        <path d="M9.5 5C6.46 5 4 7.46 4 10.5S6.46 16 9.5 16c.17 0 .34 0 .5-.03C9.3 17.8 7.6 19 5.5 19v2c4.14 0 7.5-3.36 7.5-7.5v-3C13 7.46 10.54 5 9.5 5Zm10 0C16.46 5 14 7.46 14 10.5S16.46 16 19.5 16c.17 0 .34 0 .5-.03-.7 1.83-2.4 3.03-4.5 3.03v2c4.14 0 7.5-3.36 7.5-7.5v-3C23 7.46 20.54 5 19.5 5Z" />
      </svg>
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
        {item.quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <span
          aria-hidden="true"
          className={`grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${
            AVATAR_GRADIENTS[item.accent]
          } text-xs font-semibold text-white`}
        >
          {item.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">
            {item.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {item.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
