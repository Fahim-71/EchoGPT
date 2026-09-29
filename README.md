# EchoGPT — AppifyDevs Frontend Assessment

## The three tasks

| # | Task | Folder | What it is |
| --- | --- | --- | --- |
| 1 | Redesign the EchoGPT web app | [`01-echogpt-webapp/`](01-echogpt-webapp) | A keyboard-first AI chat workspace — chat, multi-model compare, searchable history, settings |
| 2 | Single-page EchoGPT website | [`02-echogpt-landing/`](02-echogpt-landing) | A 13-section marketing page built entirely from live DOM — no raster images anywhere |
| 3 | Redesign the Chrome extension | [`03-echogpt-extension/`](03-echogpt-extension) | Popup, side panel and settings surfaces that build **both** as a hosted demo and as a loadable MV3 bundle |

Each folder has its own README with the full write-up: the UX audit behind it,
the architecture, the assumptions, and what was deliberately left out.

---

## Live demos

| Project | URL |
| --- | --- |
| Web app redesign | _add Vercel URL_ |
| Landing page | _add Vercel URL_ |
| Extension showcase | _add Vercel URL_ |

Each folder deploys as its own Vercel project — import the repository three
times and set **Root Directory** to the folder. No environment variables are
required; no project has a backend.

---

## Running any of them

```bash
cd 01-echogpt-webapp    # or 02-echogpt-landing / 03-echogpt-extension
npm install
npm run dev             # http://localhost:3000
```

The extension project has one extra command:

```bash
cd 03-echogpt-extension
npm run build:extension   # → dist/, loadable via chrome://extensions → Load unpacked
```

Node 20+. No API keys, no `.env`, no services to start.

---

## What ties the three together

The brief asked for three separate artefacts. Shipping three separate *visual
languages* would have been the easy failure, so the first thing built was the
part none of the tasks asked for: a token layer that all three import unchanged.

**`src/app/globals.css`** is byte-identical across the three projects. It defines
semantic tokens (`--surface`, `--muted-foreground`, `--border-strong`, a brand
ramp, radii, shadows) on `:root`, redefines them under `.dark`, and exposes them
to Tailwind v4 through `@theme inline`. Components never reference a raw colour —
they use `bg-surface-2` or `text-muted-foreground`, so light and dark mode are
one definition rather than two sets of `dark:` overrides bolted on afterwards.

**`src/lib/models.ts`** is the single source of truth for the AI model
catalogue, also shared verbatim. The web app's model picker, the landing page's
"AI Models" section and the extension's model switcher all render from the same
array — so the marketing page cannot advertise a model the product does not
offer. Each model carries `latency` and `cost` on a 1–5 scale, which is what the
speed and cost meters render.

The practical result: the extension side panel and the web app composer are
visibly the same product at two densities, and adding a model to one array
updates all three surfaces.

---

## Stack

| | |
| --- | --- |
| Framework | Next.js 15.5 (App Router) · React 19 |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS v4 with CSS-variable design tokens |
| Animation | Framer Motion, every animation gated on `useReducedMotion()` |
| Icons | lucide-react, plus hand-drawn inline SVG for brand marks |
| Theming | next-themes — light / dark / **system**, not a binary toggle |
| Fonts | Geist, self-hosted (no font-CDN request on first paint) |

Total runtime dependencies per project: five. Nothing was reached for that a
component could do.

---

## Where to look first

If you have ten minutes:

1. **`01-echogpt-webapp`** — open the model picker in the composer, then press
   <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd>. The picker is the direct answer to the
   live app's unlabelled `EchoGPT ⌄` pill: every model shows what it is good at,
   how fast it is, what it costs, and whether it is free.
2. **`02-echogpt-landing`** — scroll to "AI Models" and "Four surfaces, one
   workspace". Neither is a screenshot; both are live components, which is why
   they are responsive and theme-aware.
3. **`03-echogpt-extension`** — the showcase at `/` renders the real popup and
   side panel inside a mock browser. Select text in the fake article to raise
   the selection tooltip. Then run `npm run build:extension` and load `dist/` in
   Chrome — it is the same code.

---

## Assumptions

Documented here and in each project's README, because several were unavoidable.

- **The model catalogue is invented.** EchoGPT does not publish which models sit
  behind its picker, so `src/lib/models.ts` is a plausible catalogue with
  invented 1–5 latency and cost scores. It is structured so swapping in real
  data is a one-file change.
- **All AI responses are simulated.** There is no API key and no backend.
  `mockStream.ts` streams canned replies token by token with a realistic
  cadence, including a working stop button. The web app says so in the composer
  footer rather than pretending otherwise.
- **Pricing and testimonials on the landing page are illustrative** and labelled
  as such on the page itself.
- **Product facts are researched, not invented.** The tagline, capabilities,
  `Ctrl+Shift+E` shortcut, privacy posture and store metadata (v1.0.5, 76 KB,
  Tools, 5.0★) come from the live site and the Chrome Web Store listing. The
  UX audits are based on the current interface as inspected in a browser.
- **No authentication.** Sign-in is presented as UI state only — which is itself
  part of the extension redesign's argument (see its README, problem 1).

---

## Verification

Each project was checked, not assumed:

- `npx tsc --noEmit` and `npm run build` are clean in all three.
- Every route was rendered in headless Chromium at **1440px and 390px**, in
  **both themes**: zero console errors and zero horizontal overflow.
- The extension build script **fails hard** if any root-absolute `/_next/`
  reference survives into the exported HTML, since that is the one thing that
  silently breaks a `chrome-extension://` page. It also verifies the icon PNGs
  and that every `manifest.json` reference resolves.
- The landing page ships a `<noscript>` override so scroll-reveal sections stay
  visible without JavaScript.

---

## Repository layout

```
.
├── 01-echogpt-webapp/      Task 1 — web app redesign
├── 02-echogpt-landing/     Task 2 — marketing landing page
├── 03-echogpt-extension/   Task 3 — Chrome extension redesign
└── _shared/                The canonical design tokens and model catalogue
                            that all three projects import
```

`_shared/` is the origin of the files that appear identically in each project.
It is kept as documentation of intent — the projects are independently
installable and deployable, so each carries its own copy rather than resolving
across folders.
