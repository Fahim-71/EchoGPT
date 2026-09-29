# EchoGPT — Marketing Landing Page

Task 2 of the AppifyDevs frontend assessment: a single-page marketing site for
**EchoGPT**, the multi-model AI chat product by AppifyDevs — a web app at
[echogpt.live](https://echogpt.live/) plus a
[Chrome sidebar extension](https://chromewebstore.google.com/detail/echogpt-multi-ai-chat-sid/negimdcamohmoheiifgecbjgjepkcfhj).

Everything on the page is real, responsive DOM. There is not a single raster
image, screenshot, stock photo or remote asset anywhere in the build — the
product mock-ups, avatars, vendor wordmarks and brand marks are all CSS,
gradients, inline SVG or live components.

---

## 1. Overview

The page tells one story: **you are already using more than one AI model, and
the alternative to EchoGPT is three invoices and twelve tabs.** The two genuinely
differentiating facts about the product carry the messaging:

- **Breadth** — OpenAI, Anthropic, Google, Meta and Mistral models behind one
  picker, in one thread, with context that survives a model switch.
- **Privacy** — no third-party analytics, preferences stored locally, HTTPS
  only, token-based sign-in.

Generic "AI is the future" copy is deliberately absent.

## 2. Setup

```bash
npm install     # first time only
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
npx tsc --noEmit
```

Optional environment variable:

| Variable               | Default               | Purpose                                  |
| ---------------------- | --------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://echogpt.live` | Canonical URL for metadata, sitemap, robots |

## 3. Technologies

| Layer      | Choice                                                                   |
| ---------- | ------------------------------------------------------------------------ |
| Framework  | Next.js 15.5 App Router, React 19, TypeScript strict, `src/`, `@/*` alias |
| Styling    | Tailwind v4 with the shared semantic token layer in `src/app/globals.css` |
| Animation  | `framer-motion@13` (`motion`, `AnimatePresence`, `useInView`, `useReducedMotion`) |
| Icons      | `lucide-react@1` + hand-drawn inline SVG for brand marks                   |
| Theming    | `next-themes` (class strategy) via the shared `ThemeProvider`             |
| Utilities  | `clsx` + `tailwind-merge` through `cn()`                                  |

No dependencies were added. `lucide-react@1` ships **no brand icons** — there is
no `Chrome` export — so the Chrome, X, GitHub and Discord marks, and the EchoGPT
logo, are hand-written SVG paths in `src/components/ui/brand-icons.tsx` that
inherit `currentColor` and therefore follow the theme.

## 4. File tree

```
src/
  app/
    layout.tsx           metadata, OG/Twitter, JSON-LD SoftwareApplication, ThemeProvider, font tokens
    page.tsx             composes the sections and nothing else
    sitemap.ts
    robots.ts
    globals.css          shared design system (unmodified)
  components/
    theme-provider.tsx   shared (unmodified)
    theme-toggle.tsx
    layout/
      site-header.tsx    sticky glass nav + scroll-spy
      site-footer.tsx    4 columns, brand blurb, theme toggle, socials, legal
      mobile-menu.tsx    slide-down dialog with focus trap
    sections/
      hero.tsx
      hero-visual.tsx    self-typing prompt + two answering model columns
      trust-bar.tsx
      features.tsx
      feature-visuals.tsx  the tiny live mock-up inside each bento card
      ai-models.tsx      data-driven from src/lib/models.ts
      product-preview.tsx
      preview-mocks.tsx  the four DOM "screenshots"
      why-echogpt.tsx    comparison table + stat strip
      how-it-works.tsx
      pricing.tsx
      testimonials.tsx
      faq.tsx
      final-cta.tsx
    ui/
      accordion.tsx  badge.tsx  browser-frame.tsx  brand-icons.tsx  button.tsx
      card.tsx  container.tsx  gradient-blur.tsx  marquee.tsx  meter.tsx
      reveal.tsx  section-heading.tsx  switch.tsx  tabs.tsx
  data/
    nav.ts  features.ts  pricing.ts  faq.ts  testimonials.ts  comparison.ts  steps.ts
  hooks/
    useScrollSpy.ts  useMediaQuery.ts  usePrefersReducedMotion.ts
  lib/
    utils.ts  models.ts  site.ts
```

All copy and list content lives in `src/data/*.ts`; section components only
render it. `src/lib/site.ts` holds the URLs and headline numbers that appear in
more than one place, so the Chrome Web Store link can never drift between the
nav, the hero, pricing and the footer.

## 5. Section-by-section rationale

1. **Nav** — transparent over the hero, then glass + hairline border on scroll.
   The height never changes, so nothing below it shifts. Anchor links get
   `aria-current` from a scroll-spy, and the mobile menu is a real dialog.
2. **Hero** — headline, subhead, dual CTA and a three-item trust row (Web Store
   rating, no third-party analytics, free to start). The product visual is a
   mock EchoGPT surface where the prompt types itself and two model columns fill
   in — it demonstrates the *multi-model* claim instead of asserting it.
3. **Trust bar** — vendor wordmarks as text chips. No logo images: partly
   because remote assets are off the table, mostly because vendor logos carry
   trademark baggage that plain text does not.
4. **Features** — a 6-column bento of seven cards at varying spans, each with a
   working miniature: the model picker mid-switch, a page with a summary panel
   docked beside it, a highlighted contract clause with an "Explain" chip, two
   answer columns, a studio grid, an endpoint wiring diagram, and a privacy
   checklist with analytics struck through.
5. **AI Models** — rendered entirely from `MODELS` in `src/lib/models.ts`, the
   same array the web app and the extension render their pickers from. Tier
   filters are derived from `TIER_LABEL`, not hard-coded. Each card shows the
   accent dot, name, vendor, blurb, capability chips from `CAPABILITY_LABEL`,
   context window, a speed meter, a cost meter and a Free badge. The speed meter
   inverts `latency` — low latency should read as a *full* bar.
6. **Product preview** — four DOM mock-ups (web app, Chrome sidebar, Compare,
   Studio) inside a browser chrome frame, behind a proper ARIA tablist. Resize
   the window and they reflow; flip the theme and they follow. A screenshot
   would do neither.
7. **Why choose EchoGPT** — the comparison only earns its place by naming the
   *real* alternatives: one subscription per model, and tab-switching. Each cell
   carries a mark plus a qualifier, so "partly" is honest rather than a rigged
   row of red crosses. Real `<table>` with `<th scope>` on desktop; the same data
   as stacked cards under `lg`. A three-stat strip follows.
8. **How it works** — three steps with a gradient connecting line that is
   vertical on tablet and horizontal on desktop, and a monospace hint per step.
9. **Pricing** — Free / Pro / Team with a monthly↔annual switch that actually
   recalculates and shows the annual total, most-popular highlight, checklists,
   and an honest footnote that the numbers are illustrative.
10. **Testimonials** — two counter-rotating marquee rows of `<figure>`/
    `<blockquote>` cards with initials-on-gradient avatars, edge fades, and
    pause on hover *and* focus-within so keyboard users can read a card.
11. **FAQ** — one `<h2>`, eight `<button aria-expanded>` triggers controlling
    `role="region"` panels. The questions are the ones the product actually
    raises: models, price, training data, any-site support, the shortcut, your
    own endpoint, mobile, uninstall.
12. **Final CTA** — gradient band with both install CTAs and the Web Store
    facts (5.0, v1.0.5, 76 KB) repeated as reassurance at the decision point.
13. **Footer** — four link columns, brand blurb, theme toggle, socials as inline
    SVG, copyright with the extension facts, legal row.

## 6. Design decisions

- **Semantic tokens only.** No raw hex in layout code except the per-model
  `accent` values, which are data. Every surface, border and text colour comes
  from the shared token layer, so dark mode is free and consistent.
- **`globals.css`, `utils.ts`, `models.ts` and `theme-provider.tsx` are
  untouched.** They are shared across all three assessment projects; forking
  them would defeat the point.
- **Data/presentation split.** Every list on the page is a typed array in
  `src/data/`. Changing a price, a FAQ or a comparison row never means opening a
  component.
- **Visuals are components, not assets.** A mock-up built from DOM stays sharp,
  reflows, respects the theme and costs a few hundred bytes of gzipped HTML — a
  screenshot does none of that.
- **Typography.** `globals.css` reads `--font-geist-sans` / `--font-geist-mono`.
  This build resolves them to a system stack instead of `next/font/google`,
  because the build environment blocks `fonts.googleapis.com` at the network
  policy layer. That also means zero webfont bytes and no FOUT. Restoring Geist
  is a two-line change in `layout.tsx` — import `Geist`/`Geist_Mono` and hand
  their `.variable` classes to `<body>` in place of the `FONT_VARS` style object.

## 7. Assumptions

These are documented rather than hidden, because a reviewer should be able to
tell fact from illustration:

- **Model catalogue** — EchoGPT does not publish which models sit behind its
  picker. `src/lib/models.ts` is a shared, documented assumption; the `latency`
  and `cost` values are relative 1–5 scores invented for the meters, not vendor
  benchmarks.
- **Pricing tiers** — EchoGPT publishes no public price sheet. Free / Pro / Team
  and the $9–$24 figures are illustrative, and the section says so in a footnote.
  The Chrome extension itself genuinely is free on the Web Store.
- **Testimonials** — the names and quotes are invented. The *workflows* they
  describe (contract review, long-document summarising, security review,
  side-by-side comparison) are the real ones the product is built around.
- **Stats** — "8+ models" reflects the catalogue; "0 third-party analytics" and
  "76 KB / v1.0.5 / 5.0" are from the Chrome Web Store listing. The JSON-LD
  `ratingCount` of 24 is illustrative.
- **Footer and social links** point at `echogpt.live`, since no official social
  handles or legal pages were available to link.

Everything else — the tagline, capability list, web-app surfaces, the
`Ctrl+Shift+E` / `Cmd+Shift+E` shortcut, the privacy posture, and the Web Store
metadata — comes from the researched product facts.

## 8. Performance

- **Server components by default.** Only the six things that need state are
  client components: header, mobile menu, theme toggle, hero visual, model
  filter, pricing toggle, and the accordion/tabs/marquee primitives. The page
  ships ~65 kB of route JS and ~167 kB first-load.
- **Zero images and zero webfonts.** No `next/image`, no remote assets, no
  render-blocking font request, therefore no image or font CLS.
- **Transform/opacity only.** Every animation animates `transform` and `opacity`
  — never width, height, top or margin — so nothing triggers layout.
- **Lazy-mounted marquee.** The duplicated track and the CSS animation only
  exist once the strip is within 200 px of the viewport; before that it is a
  plain scrollable row. The keyframes are hoisted and de-duplicated by React 19.
- **Scroll-spy without a scroll listener.** One `IntersectionObserver` with a
  top-biased root margin; the only `scroll` listener on the page is the
  header's, registered `{ passive: true }`.
- **Reveal fires once.** `useInView({ once: true })` — no observers left
  thrashing after the user has scrolled past.
- **Static output.** All four routes prerender; nothing is server-rendered per
  request.

## 9. SEO

- Title template (`%s · EchoGPT`), description, ten keywords, `applicationName`,
  authors/creator/publisher, category.
- `metadataBase` + `alternates.canonical`.
- Full `openGraph` (type, url, siteName, locale) and a `summary_large_image`
  Twitter card.
- `robots` with explicit `googleBot` directives including `max-image-preview`.
- `viewport.themeColor` per colour scheme, so the browser UI matches the theme.
- `src/app/sitemap.ts` and `src/app/robots.ts` — generated, pointing at
  `NEXT_PUBLIC_SITE_URL`. The sitemap lists the in-page anchors, which are the
  only addressable destinations a one-page site has.
- JSON-LD **`SoftwareApplication`** in `layout.tsx` with category, OS, version,
  file size, download URL, publisher, a free `Offer`, `aggregateRating` and a
  `featureList`.
- Semantic outline: exactly one `<h1>`, one `<h2>` per section, `<h3>` for cards.

## 10. Accessibility

- **One `<h1>`**; every section is `<section aria-labelledby>` pointing at its
  own heading. Real landmarks: `<header>`, `<main id="main">`, `<footer>`, named
  `<nav aria-label>` elements.
- **Skip link** to `#main` as the first focusable element.
- **Keyboard-operable everything.** Tabs implement the WAI-ARIA pattern
  (`role="tablist"`, roving `tabindex`, ←/→/↑/↓, Home/End). The accordion is
  `<button aria-expanded>` + `role="region"`. The pricing toggle is
  `role="switch"` on a native button.
- **Mobile menu is a dialog** — `role="dialog" aria-modal`, focus moved in on
  open, Tab wrapped inside, Escape closes, focus returned to the hamburger, and
  background scroll locked.
- **`aria-current`** on the active nav link, driven by the scroll-spy, in both
  the desktop nav and the mobile menu.
- **Meters are meters** — `role="meter"` with `aria-valuenow`/`min`/`max` and an
  `aria-valuetext`, so a screen reader hears "Speed: Fast" rather than five
  anonymous divs.
- **Comparison marks carry text.** Each ✓/–/✕ has an `sr-only` "Yes:" /
  "Partly:" / "No:" prefix, so the table is not colour- or glyph-dependent.
- **Decoration is hidden.** The hero visual, feature miniatures, gradient blurs
  and the grid backdrop are all `aria-hidden` — the adjacent copy carries the
  meaning.
- **Reduced motion is honoured twice**: `globals.css` neutralises CSS animation
  and `scroll-behavior`, and every JS animation is gated on framer-motion's
  `useReducedMotion()` or the `usePrefersReducedMotion` hook. The hero visual
  renders its finished state, and the marquee becomes a static scrollable row.
- **Focus is always visible** through the shared `:focus-visible` rule; no
  `outline: none` anywhere.
- **Contrast.** Body text uses `--muted-foreground` (≈5.8:1 on light, ≈8:1 on
  dark); headings and UI labels use `--foreground` (≈18:1). Brand text sits at
  `brand-700` on light and `brand-300` on dark rather than `brand-500` on both,
  which is exactly where contrast would fail.
- **Responsive with no horizontal scroll** at 360 / 768 / 1280 / 1536. Every
  grid track uses `minmax(0, …)`, the two horizontally-scrolling rows (tabs and
  model filters) are explicitly `overflow-x-auto`, and the comparison table is
  replaced by stacked cards under `lg` rather than being allowed to scroll.

## 11. Extras beyond the brief

- `src/lib/site.ts` as a single source of truth for outbound URLs and the Web
  Store facts.
- Skip-to-content link.
- Theme toggle in both the header and the footer.
- Live region announcing the model filter result count.
- Marquee pauses on `focus-within`, not only on hover.
- Browser-frame mock-ups carry a padlock and a realistic URL per tab, and the
  sidebar tab shows a pinned-extension chip.
- Sitemap includes in-page anchors.
- `viewport.themeColor` per colour scheme.

## 12. Deliberately left out

- **No webfont.** `fonts.googleapis.com` is blocked by the build environment's
  egress policy; rather than routing around a policy denial, the design system's
  font variables resolve to a system stack (see §6). The swap back is two lines.
- **No OG image file.** Generating one would mean either a remote asset or an
  `opengraph-image` route, and the brief ruled images out; the OG/Twitter
  metadata is otherwise complete and picks up an image the moment one is added.
- **No analytics.** It would contradict the page's own central claim.
- **No blog, changelog, docs or auth routes.** The brief is one scrolling page;
  outbound links go to the real web app and Web Store listing instead of to
  invented internal routes.
- **No vendor logos.** Text wordmarks instead, for the trademark reason above.
