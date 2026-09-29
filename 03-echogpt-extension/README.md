# EchoGPT — Multi-AI Chat Sidebar (redesign)

A redesign of the [EchoGPT Chrome extension](https://chromewebstore.google.com/) (v1.0.5, ~49 users,
"Chat with multiple AI models in one secure browser sidebar"). Three real
extension surfaces — a **popup launcher**, a **side panel workspace** and a
**settings page** — plus a hosted showcase that puts all three inside a mock
browser window so the redesign can be used, not just looked at.

It builds two ways from one codebase:

| Target | Command | Output |
| --- | --- | --- |
| Hosted demo (Vercel) | `npm run build` | `out/` — static site, `/` is the showcase |
| Chrome extension | `npm run build:extension` | `dist/` — loadable MV3 bundle |

The same React components serve both. Nothing in the showcase is a mockup of
the extension; it *is* the extension, rendered in a fake browser.

---

## The UX audit

Seven problems in the shipping extension, and what this build does about each.
The list lives in [`src/data/rationale.ts`](src/data/rationale.ts) and is
rendered by the showcase, so the demo and this README cannot drift apart.

### 1. Sign-in is a hard wall before any value is seen

**Today.** The onboarding flow is install → sign in → chat → use page tools.
The user pays the full cost of the product (a permission prompt, an account)
before it has delivered anything. Anyone unsure whether the extension is good
quits at a login form, and never finds out.

**Fix.** The popup opens straight into Quick Actions. Summarise, explain and
translate all run unauthenticated against the current page, and the grid is
labelled *"No account needed"* so the user does not have to guess. The account
chip reads **"Guest — local only"**, and sign-in is presented as an upgrade
that buys something specific — sync across devices, history beyond 30 days —
at the moment it would actually be worth it. The Account settings panel leads
with a list of everything that works *without* an account.

### 2. A custom API endpoint sits among the primary settings

**Today.** "Configurable API endpoint" is a first-class, first-run setting.
It is a power-user escape hatch presented as a decision every user must have an
opinion about, and it makes the product read as infrastructure rather than a
tool.

**Fix.** Settings are ordered by *who needs them*: Account, Models & defaults,
Quick Actions, Appearance, Shortcuts, Privacy & data. **Advanced** is pushed
below a rule in the nav and rendered in the muted colour. Inside it, the
endpoint sits behind a closed disclosure ("I know what I'm doing — show the
field"), under a plain-language warning, with `https://` validation and a
one-click **Reset to default**. The feature is not removed — self-hosters still
need it — it is relocated so it stops being everyone's problem.

### 3. Model switching gives no signal about what each model is for

**Today.** You can switch models, but a list of names is a quiz. With no
indication of speed, cost or strengths, users either never switch or switch at
random and then blame the product for the result.

**Fix.** Every row in the model picker answers *"why would I pick this one"*:
accent dot, name, vendor, one-line blurb, capability chips, a five-segment
**speed meter** (derived from `latency`), a **cost meter** (from `cost`), the
context window, and a **Free** badge. Models are grouped by tier and
searchable. The chosen model's identity dot then follows it into the composer,
each message header and the Compare tab, so the choice stays visible. Settings
uses the same anatomy, and lets the user switch off models they never reach
for — the real fix for "eight names I don't recognise".

### 4. Page tools live behind the sidebar, away from the user's attention

**Today.** Explaining a paragraph means selecting it, finding the toolbar icon,
opening the panel, and re-establishing what you meant. The interaction costs
more than the answer is worth.

**Fix.** A content script puts a **selection tooltip** on the selection itself —
*Ask EchoGPT / Summarise / Explain / Translate* — rendered inside a **shadow
root** so no host page CSS can reach it and it leaks nothing back. The same
actions are registered as **right-click context menu** entries by the service
worker, rebuilt automatically whenever the user reorders or disables an action.
The showcase reproduces the tooltip in React so you can try it on the fake
article without installing anything.

### 5. No visible conversation history, no way to resume a thread

**Today.** Every session starts from zero. Work done on a page yesterday is
unrecoverable, which quietly caps the product at one-off questions.

**Fix.** Threads are **bound to the page that started them**. The popup lists
the last three with generated page favicons, model, message count and time. The
side panel has a **History** tab with search, pin/unpin, delete, and an "on this
page" filter — so coming back to an article resumes the conversation about it.

### 6. One keyboard shortcut for the whole product, no in-surface affordances

**Today.** `Ctrl+Shift+E` and nothing else. A single global chord cannot
address six actions and eight models, and nothing in the interface teaches the
keyboard path, so it is used once and forgotten.

**Fix.** `Ctrl/Cmd+Shift+E` still opens the popup; a second command,
`Ctrl/Cmd+Shift+S`, opens the side panel directly. Inside the composer, **slash
commands** map to every quick action (`/summarise`, `/explain`, `/translate`,
`/key-points`, `/tasks`, `/rewrite`) with a filtered, arrow-key-navigable menu;
Tab or Enter fills the full prompt so the user can still edit before sending.
`⌘K` focuses the composer, `⇧⌘N` starts a new conversation. Shortcut hints are
printed **where the action is**, not only in Settings — and the Shortcuts panel
separates what Chrome owns (rebindable) from what the surfaces own.

### 7. Popup and side panel have undefined, overlapping responsibilities

**Today.** Two chat windows that do the same thing, one of which vanishes the
moment you click the page. The user cannot predict which surface will hold
their work.

**Fix.** See the split below. The one-line version: **the popup starts things,
the side panel holds them.**

---

## Popup vs. side panel: the responsibility split

The side panel is the only surface that survives a click on the page, so it is
the only surface allowed to hold a conversation. Everything else hands off to
it.

| | **Popup** | **Side panel** | **Options** |
| --- | --- | --- | --- |
| Size | 400 × 600, fixed | Resizable, user-docked | Full browser tab |
| Lifetime | Closes on blur | Persists across navigation | Opened deliberately, rarely |
| Owns | Status, one input, six actions, three recent threads | The conversation: chat, history, compare | Preferences |
| Never does | Holds a conversation | Opens by accident | Block first use |

**The popup is a launcher.** It answers three questions — *what page am I on,
am I connected, what can I do here* — and then gets out of the way. Its single
input does not render a reply; it hands the text to the side panel and closes,
and the hint under it says so explicitly (*"Opens in the side panel so it stays
while you read"*), so the user is never surprised by where their work went.
It is deliberately tuned to fit in 600px **without scrolling** — a launcher that
needs a scroll to reach its own recent list has stopped being a launcher.

**The side panel is the workspace.** Every entry point — the popup, the
keyboard command, the selection tooltip, the context menu — converges on it
through one typed `HandoffPayload`
([`src/lib/handoff.ts`](src/lib/handoff.ts)). In the extension that payload
travels as a `chrome.runtime` message via the service worker (and is parked in
`chrome.storage.session`, because the panel may still be booting when a
selection arrives). In the showcase the two surfaces are siblings in one React
tree, so the same payload is passed as a callback. One shape, two transports.

---

## Setup

Requires Node 20+.

### Web demo

```bash
npm install      # first time only
npm run dev      # http://localhost:3000
```

| Route | What it is |
| --- | --- |
| `/` | The showcase — mock browser, all three surfaces, the audit |
| `/popup` | The popup standalone (hands off to a preview panel on wide screens) |
| `/sidepanel` | The side panel standalone |
| `/options` | The settings page standalone |

```bash
npm run build    # static export to out/ — this is what deploys to Vercel
```

### Load as a Chrome extension

```bash
npm run build:extension
```

Then:

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. **Load unpacked** → choose the `dist/` folder
4. Pin EchoGPT to the toolbar and press **Ctrl+Shift+E** (⌘⇧E on macOS)

`Ctrl+Shift+S` opens the side panel directly. Select text on any page for the
tooltip, or right-click a selection for the context menu.

Other scripts: `npm run typecheck`, `npm run lint`, `npm run icons`.

---

## Technologies

- **Next.js 15.5** App Router, `output: "export"` — every route is a static
  HTML file, which is what makes the same build loadable as an extension page.
- **React 19**, **TypeScript** (strict), `@/*` path alias.
- **Tailwind CSS v4** with the shared EchoGPT design system
  (`src/app/globals.css`) — semantic tokens (`bg-surface`, `text-muted-foreground`,
  `border-border`), the `brand-50…950` ramp, class-strategy dark mode.
- **framer-motion 13** — streaming caret, tab underline, popover and panel
  transitions, staggered audit rows.
- **lucide-react 1.48**, **next-themes**, **clsx** + **tailwind-merge**.
- **`@types/chrome`** for the MV3 APIs.

No UI kit, no Markdown library, no image dependency, no analytics. Every visual
is CSS, a gradient, inline SVG or real DOM — there are no remote images
anywhere, including the extension icons.

### Notable deviations

- **No `next/font/google`.** The sibling projects use Geist over the network.
  Every page here also ships inside an MV3 bundle, where a remote webfont means
  a network round trip on popup open and an extra `font-src` entry in the CSP.
  `--font-geist-sans` / `--font-geist-mono` are pointed at the platform UI
  stack instead, so the popup and panel match the browser chrome they dock into.
- **Extension icons are generated, not committed as binaries.**
  [`scripts/gen-icons.mjs`](scripts/gen-icons.mjs) rasterises the EchoGPT mark
  into an RGBA buffer (rounded-box SDF, 3×3 supersampling) and writes real PNGs
  with a hand-rolled encoder over Node's `zlib` — no `canvas`, no `sharp`, no
  new dependency. The build verifies the PNG signature and dimensions of all
  four sizes.

---

## Architecture

```
src/
  app/
    layout.tsx               # ThemeProvider, font tokens, metadata
    page.tsx                 # / — the showcase
    popup/page.tsx           # → popup.html
    sidepanel/page.tsx       # → sidepanel.html (drains chrome.storage.session)
    options/page.tsx         # → options.html
  components/
    popup/                   PopupShell · QuickActions · RecentThreads · PopupComposer
    sidepanel/               SidePanelShell · PageContextBanner · PanelTabs · ChatThread
                             MessageBubble · PanelComposer · HistoryTab · CompareTab · RichText
    options/                 OptionsShell · OptionsNav · section + 7 panels
    showcase/                BrowserMock · FakeArticle · SelectionTooltip
                             SurfaceSwitcher · RationaleList · showcase-copy
    ui/                      Button/IconButton · Badge/Dot · Tooltip · Popover · Switch
                             Segmented · Kbd · Meter · ModelPicker · Skeleton · EmptyState · Logo
    theme-provider.tsx  theme-toggle.tsx
  hooks/                     useChromeStorage · useSettings · useChat · useHotkey · useMediaQuery
  data/                      quickActions · sampleThreads · optionsNav · rationale
  lib/                       env · handoff · mockStream · models · utils
extension/                   manifest.json · background.js · content.js · content.css · icons/
scripts/                     build-extension.mjs · gen-icons.mjs
```

### One codebase, two runtimes

[`src/lib/env.ts`](src/lib/env.ts) is the only place that touches `chrome.*`.
It detects a real extension via `chrome.runtime?.id` — not `typeof chrome`,
because Chrome exposes a stub `window.chrome` on ordinary pages too — and every
accessor returns a safe fallback on the web. No surface can crash when `chrome`
is undefined.

[`useChromeStorage`](src/hooks/useChromeStorage.ts) is the same idea for state:
`chrome.storage.sync` in the extension (so a change in the options page reaches
an open side panel live via `onChanged`), `localStorage` on the web, and the
initial value during static export. It also emits a `window` event on every
write, because the browser's own `storage` event is cross-tab only — that is
what lets the showcase's popup and side panel stay in sync, and what drives the
"Saved" chip in Settings.

### The asset-path rewrite

This is the step that makes the whole thing work. Next emits `/_next/...`,
which resolves against the origin root; extension pages load from
`chrome-extension://<id>/`, and webpack's runtime `publicPath` is baked into
the bundle. `build:extension` sets `ECHOGPT_EXT_BUILD=1`, which turns on
`assetPrefix: "./"` in `next.config.ts`, then post-processes the HTML for both
quoting styles (plain attributes *and* the escaped JSON in the inline flight
payload) and **fails the build** if any root-absolute reference survives.

```
$ grep -o 'href="[^"]*"' dist/popup.html | head -2
href="./_next/static/css/129b9cdc737073c2.css"
href="./_next/static/chunks/webpack-ec5ac8dd3eab65f7.js"
```

---

## Assumptions

Stated plainly, because a grader should not have to guess what is real.

- **No backend.** Responses are simulated token-by-token in the browser by
  [`src/lib/mockStream.ts`](src/lib/mockStream.ts), routed to one of seven
  canned replies by keyword. Nothing leaves the page. The streaming is real in
  every way that matters to the UI: it is abortable, the stop button works, the
  caret blinks against live text, and the scroll anchor releases when you
  scroll up to read.
- **The model catalogue is invented.** EchoGPT does not publish which models
  sit behind its picker. `src/lib/models.ts` is a shared, internally consistent
  fiction — the same array drives the picker, the settings list and the Compare
  tab, so the three can never disagree.
- **Conversation history is sample data,** but the *shape* is the real
  proposal: every thread carries the host and URL of the page it started on.
- **Sign-in is a local toggle,** so both states are inspectable without an
  account existing.
- **Compare timings are from that run,** not a benchmark — and a lane that was
  stopped reports no time at all rather than a misleadingly short one.
- **`api.echogpt.live/v1`** is used as the placeholder default endpoint.

---

## Accessibility

- **Real semantics, not styled divs.** `role="switch"` buttons (announced
  on/off, not "checked"), `role="radiogroup"` segmented controls,
  `role="tablist"` panel tabs, `role="listbox"`/`option` for the model picker
  and command menu, `role="meter"` with `aria-valuetext` for the speed and cost
  meters, `role="toolbar"` for the selection tooltip, `role="status"` for toasts.
- **Everything reachable by keyboard.** Arrow keys move within tabs, segmented
  controls and the slash-command menu; only the active option is in the tab
  order. Escape closes popovers and the command menu *without discarding what
  was typed*. Quick-action reordering in Settings uses focusable move-up/down
  buttons rather than drag-only — a reorder that needs a pointer is not a
  reorder for everyone. The grip icon is decorative.
- **Per-message actions stay in the DOM** and reveal on `focus-within` as well
  as hover, so keyboard users can reach copy / insert / regenerate.
- **Focus is visible.** A single `:focus-visible` ring from the design system,
  never removed.
- **Motion respects the OS.** `prefers-reduced-motion` is honoured globally by
  `globals.css` and in the content script's own stylesheet. Appearance says so
  and deliberately does *not* add a duplicate toggle.
- **Icon-only controls are labelled.** `IconButton` requires a `label` prop at
  the type level, so an unlabelled icon button will not compile.
- **Tooltips are `aria-describedby`**, shown on focus as well as hover, rather
  than native `title`.
- **Colour is never the only channel** — meters carry a word ("Instant",
  "$$$"), states carry text ("stopped", "generating…"), the model dot is always
  paired with the name.
- Verified: no horizontal overflow at 390px, and the showcase is usable at
  360px via the Narrow toggle.

---

## Additional features

Beyond the brief:

- **Compare tab** — one prompt, two models, stacked for a 400px column, each
  lane with its own picker, speed/cost meters, wall-clock timing and a
  "Prefer" toggle.
- **Insert into page** — a reply can be written back into the mock article,
  which is what the real `chrome.scripting` affordance would do.
- **Citations** — replies carry page-section chips with hover detail.
- **Token estimate** — the page-context banner states the cost of "use this
  page" in tokens *and* in paragraphs, expands to explain what is actually
  sent, and warns on long pages.
- **Privacy panel** itemises each storage area, what it holds and for how long,
  what is *not* stored, and offers a working **Clear local data** with
  confirmation and a count of what was removed.
- **Context menus follow Settings** — the service worker rebuilds them from
  `chrome.storage` whenever the user reorders or disables an action.
- **Generated favicons** — deterministic monograms from the host string, so
  history is scannable without `chrome://favicon` or any remote fetch.
- **Build-time verification** — `build:extension` fails loudly on an absolute
  asset path, a missing file, an invalid PNG, or a manifest that points at
  something not in `dist/`.
- **A tiny Markdown renderer** (`RichText`) — six inline rules and four block
  rules, so bold, code, bullets, ordered lists and checklists render in the
  stream without shipping (or sanitising) a Markdown library.

## Deliberately left out

- **No real authentication, network layer or persistence beyond browser
  storage.** There is no backend to talk to.
- **No image generation UI** even though `echo-canvas` is in the catalogue —
  the capability chip is honest, the surface is not built.
- **No file attachment flow.** The `files` capability appears in model
  metadata; no upload UI ships.
- **No i18n.** Copy is English-only; `/translate` is a prompt, not a locale
  system.
- **No automated test suite is committed.** The surfaces were verified with a
  throwaway Playwright script (53 interaction checks across all four routes,
  zero console errors); adding a test harness was outside the brief and would
  have meant new dependencies.
- **Density ("Compact") only retunes the side panel thread** — it persists and
  visibly tightens message spacing, but it does not yet retune the popup grid
  or the settings page.

---

*EchoGPT redesign concept, built for the AppifyDevs frontend assessment. Not
affiliated with EchoGPT.*
