# EchoGPT — Web App Redesign

A redesign of the [EchoGPT](https://echogpt.live) chat product as a calm, keyboard-first AI
workspace. Built for the AppifyDevs frontend assessment (Task 1).

The brief was not "make it prettier". The live app works, but it spends the user's attention badly:
fifteen destinations compete in one rail, the model you are talking to is an unlabelled pill, and
the suggestion cards are paragraphs you have to read in full before you can choose one. This
redesign is organised around fixing those specific problems, and every change below is traceable to
one of them.

---

## Contents

- [Quick start](#quick-start)
- [UX audit — seven problems and what was done about each](#ux-audit--seven-problems-and-what-was-done-about-each)
- [Routes](#routes)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Accessibility](#accessibility)
- [Assumptions](#assumptions)
- [Additional features](#additional-features)
- [What was deliberately left out](#what-was-deliberately-left-out)

---

## Quick start

```bash
npm install     # first time only
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint    # eslint
npx tsc --noEmit
```

Requires Node 18.18+ (Node 20+ recommended). There is no backend, no API key and no `.env` — the
app runs entirely in the browser.

---

## UX audit — seven problems and what was done about each

### 1. Fifteen-plus destinations in one flat rail

**Observed.** The live sidebar lists `New Chat`, then an `ENGAGEMENT` group (Image Studio, Video
Studio, Compare, Connectors, History, Store), an `AI TASKS` group (AI Job Analysis, AI SOP Builder),
a `HELP & SUPPORT` group (Support, Subscriptions, API Platform, Discord, Website), then Share,
Settings and a Light Mode toggle. Every item is the same size, the same weight and the same colour,
so "Discord" competes for attention with "New Chat". Support links — which a user clicks at most
once — occupy the same real estate as the surfaces they use every session.

**Fixed.** The rail is now three explicit tiers, defined in `src/data/navigation.ts`:

| Tier | Contents | Treatment |
| --- | --- | --- |
| `PRIMARY_NAV` | New chat, Compare, History | Always visible, pinned at the top, active item gets a brand rail marker |
| `TOOL_GROUPS` | Studios (Image, Video, Connectors, Store), AI tasks (Job Analysis, SOP Builder) | Collapsible groups, collapsed by default, quieter type |
| `SUPPORT_LINKS` | Help centre, API platform, Docs, Discord, Website | Removed from the rail entirely — one **Help & support** button in the footer opens them in a popover |

Above the nav sit a workspace switcher, a full-width **New chat** button and a search field that
opens the command palette. Below it, recent conversations and the account/theme block. The whole
rail collapses to a 60px icon rail (state persisted to `localStorage`), where every icon carries a
tooltip with its label and description.

### 2. The model switcher tells you nothing

**Observed.** The model is a small pill reading "EchoGPT" with a chevron, tucked inside the
composer. You cannot tell what any model is good at, how fast it is, how much it costs, or whether
it is included in your plan.

**Fixed.** `src/components/chat/ModelPicker.tsx` is a real picker. It is searchable across name,
vendor, blurb, tier and capability; grouped by tier using `TIER_LABEL`; and each row shows:

- the model's accent dot and name, with its vendor beside it
- a one-line blurb of what it is actually for
- capability chips from `CAPABILITY_LABEL` (Text, Vision, Code, Web search, File upload, Image
  generation)
- a **speed meter** derived from `latency` and labelled in words (Instant → Deliberate)
- a **cost meter** derived from `cost` (Lowest → Premium)
- the context window, and a green **Free** badge where `free` is true

Arrow keys move the highlight, Enter selects, Escape closes and returns focus to the trigger. A
footer note states plainly that speed and cost are relative ratings, not billing figures — the
picker should not imply precision it does not have.

### 3. Suggestion cards are paragraphs

**Observed.** Four cards — "Unlock Your Creative Flow", "Build a Resume That Shines", "Set a
Challenge That Transforms You", "Write Irresistible Social Content" — each carrying two or three
lines of body copy. You must read roughly 120 words to pick one, and the titles are aspirational
rather than descriptive, so they do not tell you what will actually be sent.

**Fixed.** `src/data/promptStarters.ts` holds fifteen starters across five categories (Create,
Write, Code, Learn, Plan). Each has a **short label** — the entire card — and a separate **full
prompt** that only appears once it lands in the composer. Labels are concrete and verb-led:
"Review this function for bugs", "Cut this email in half", "Pressure-test a decision I've made".
Category chips filter the grid, with animated reflow.

### 4. "Empty Chat History" is a dead end

**Observed.** The history panel's empty state is the literal string "Empty Chat History". No
explanation of what would appear there, and no way forward.

**Fixed.** A shared `EmptyState` component backs every empty surface, and `/history` has three
distinct ones rather than a single catch-all:

- **No conversations at all** — explains what history will do for you once populated, offers a
  primary "Start your first chat" action, and lists three real prompt starters as links.
- **Nothing matches the search** — names the query back, suggests shortening it, and offers both
  "Clear search" and "Reset all filters", since the filters may be what is hiding the result.
- **Nothing in this scope** — different copy for Pinned versus Archived, each explaining what the
  scope is for, with a way back to all conversations.

The same component gives the compare board an empty state when every column is removed.

### 5. The theme toggle is buried, and there is no system option

**Observed.** A "Light Mode" text link at the very bottom of the rail. Two states only — no way to
follow the operating system, which is what most people want.

**Fixed.** A three-way segmented control (Light / Dark / System) built on the existing
`ThemeProvider`, with `defaultTheme="system"`. It appears in the sidebar footer *and* on
Settings → Appearance, and all three options are reachable from the command palette. The control is
a real `radiogroup` with arrow-key navigation and a shared sliding indicator.

### 6. No keyboard affordances anywhere

**Observed.** No command palette, no visible shortcut hints, nothing discoverable by keyboard.

**Fixed.**

- **Command palette** on <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> (and <kbd>/</kbd>), fuzzy-filtering over
  actions, every navigation destination, all eight models, recent conversations and the three theme
  options. Fully keyboard driven — arrows, Home/End, Enter, Escape — with `role="listbox"`,
  `aria-activedescendant` and a live result count.
- <kbd>⌘,</kbd> opens Settings from anywhere.
- Shortcut hints are rendered inline as `Kbd` caps: next to Search in the rail, in the top bar, on
  Settings in the footer, and under the composer. The `Kbd` component resolves a platform-neutral
  `"Mod"` token to ⌘ or Ctrl, so hints are correct on every OS without callers branching.
- Settings → **Shortcuts** is a complete reference for every binding in the build.

### 7. Messages have no actions and no streaming feedback

**Observed.** Once a reply lands there is nothing you can do with it — no copy, no regenerate, no
edit, no feedback — and nothing indicates progress while it is being produced.

**Fixed.**

- **Streaming** — `src/lib/mockStream.ts` yields token by token with a jittered cadence that pauses
  longer at sentence punctuation and scales time-to-first-token with the model's `latency`. A
  blinking caret trails the text; a **Stop** button replaces Send and genuinely aborts via
  `AbortController`, and the interrupted message is marked "Stopped by you".
- **Model persona** — the reply reflects the selected model. Echo Flash answers tersely, Claude
  Sonnet writes more prose and offers a follow-up, and reasoning-tier models render a collapsible
  **"Thought for Ns"** block above the answer.
- **Message actions** appear on hover or keyboard focus: copy (with a confirmation state),
  regenerate, thumbs up/down, and edit-and-resend on your own messages, which truncates the thread
  at that point and re-runs it.

---

## Routes

| Route | What it is |
| --- | --- |
| `/` | Chat workspace. Greeting with filterable starters → transcript. The composer never moves. |
| `/compare` | Up to three models answer one prompt in parallel columns, each streaming on its own clock with its own abort control, per-column model swap and a "winner" pin. |
| `/history` | Searchable history grouped by date, with scope chips (All / Pinned / Archived), model filter chips, live result count, search-term highlighting and working pin / archive / delete. |
| `/settings` | Five tabs — General, Models, Appearance, Shortcuts, Privacy — all persisted. |

The compare board is where the model catalogue earns its keep: because latency drives the stream
cadence, Echo Flash visibly finishes while o3 Reasoning is still going, which is the whole point of
the surface.

---

## Architecture

```
src/
  app/
    layout.tsx              ThemeProvider, AppShell, metadata, viewport, skip link
    page.tsx                /         chat workspace
    compare/page.tsx        /compare
    history/page.tsx        /history
    settings/page.tsx       /settings
    globals.css             shared design system (not modified)

  components/
    layout/
      AppShell.tsx          shell, global hotkeys, MotionConfig, animated rail width
      WorkspaceProvider.tsx cross-route state: model, workspace, sidebar, overlays
      Sidebar.tsx           the three-tier rail
      SidebarNav.tsx        nav item + collapsible nav group
      SidebarFooter.tsx     help popover, settings, theme, account
      WorkspaceSwitcher.tsx workspace picker
      MobileNav.tsx         slide-over sheet with focus trap
      TopBar.tsx            sticky header with per-route actions
      Logo.tsx              inline SVG mark

    chat/
      ChatView.tsx          empty state ↔ transcript, status announcer
      MessageList.tsx       scroll container + ChatStatusAnnouncer
      MessageBubble.tsx     bubble, reasoning trace, inline edit
      MessageActions.tsx    copy / regenerate / edit / vote
      Composer.tsx          autosize, token meter, slash hints, stop
      ModelPicker.tsx       searchable, grouped, metered picker
      PromptStarters.tsx    filterable one-line starters
      StreamingCursor.tsx   caret + thinking dots
      EmptyState.tsx        shared empty state

    compare/                CompareBoard, CompareColumn
    history/                HistoryList, HistoryItem, HistoryFilters
    settings/               SettingsTabs + General/Models/Appearance/Shortcuts/Privacy panels
    ui/                     Button, IconButton, Badge, Tooltip, Popover, Dialog,
                            CommandPalette, Switch, Segmented, Kbd, Avatar, Skeleton, Meter
    theme-provider.tsx      (not modified)
    theme-toggle.tsx        3-way segmented theme control

  hooks/
    useChat.ts              conversation state, streaming, regenerate, edit, vote, abort
    useLocalStorage.ts      SSR-safe persistence with cross-tab sync
    useMediaQuery.ts        + useIsDesktop
    useHotkey.ts            + useModKey (⌘ vs Ctrl)
    useAutosizeTextarea.ts
    useSettings.ts          one settings object under one key

  data/
    navigation.ts           the corrected hierarchy + workspaces
    promptStarters.ts       categorised starters
    sampleConversations.ts  history fixtures

  lib/
    utils.ts                cn()                       (not modified)
    models.ts               model catalogue            (not modified)
    mockStream.ts           token streaming + personas
    format.ts               tokens, dates, fuzzy matching
```

**Conventions.** TypeScript strict throughout, every component has a typed props interface, static
content lives in `src/data/*.ts`, and files stay small — the largest is ~300 lines. Server
components are used for the four route files; everything interactive is `"use client"`.

**State.** `WorkspaceProvider` holds what crosses routes (selected model, workspace, sidebar
collapse, palette and mobile-nav visibility). `useChat` owns one conversation. `useSettings` owns
preferences. Selected model, sidebar state, theme, workspace, compare line-up and all settings
persist to `localStorage`.

### Design system

`src/app/globals.css`, `src/lib/utils.ts`, `src/lib/models.ts` and `src/components/theme-provider.tsx`
are the shared system across the three assessment projects and were **not modified**. Every colour
in this app comes from a semantic token (`bg-surface`, `text-muted-foreground`, `border-border`,
the `brand-*` ramp) so light and dark are correct by construction rather than by patching.

---

## Technologies

| | |
| --- | --- |
| **Next.js 15.5** | App Router, all four routes statically prerendered |
| **React 19** | |
| **TypeScript 5** | `strict: true`, no `any`, no non-null assertions except one exhaustive lookup |
| **Tailwind CSS v4** | `@theme inline` tokens, `.dark` class strategy |
| **framer-motion 13** | message entrance, sidebar width, popover/dialog/palette transitions, shared-layout indicators |
| **lucide-react 1.48** | icons |
| **next-themes** | light / dark / system |
| **clsx + tailwind-merge** | `cn()` |

No dependencies were added.

---

## Accessibility

- **Skip link** to `#main`, visible on focus.
- **Live regions.** `ChatStatusAnnouncer` is mounted for the whole session — a live region must
  exist *before* its content changes or the first announcement is dropped — and announces
  "Generating a response" → "Response in progress" → "Response complete". It is deliberately
  separate from the transcript so screen readers get one clean update instead of a reading per
  streamed token. The transcript itself is `aria-live="polite"` with `aria-relevant="additions text"`.
- **Focus management.** `useFocusTrap` traps Tab inside the command palette, dialogs and the mobile
  sheet, and restores focus to the trigger on close. Escape closes every overlay.
- **Keyboard.** Palette, model picker, settings tabs and segmented controls are all arrow-key
  navigable with roving `tabIndex` and correct `role` / `aria-selected` / `aria-activedescendant`.
- **Names.** Every icon-only control takes a required `label` prop that becomes its `aria-label` —
  it is not optional in the type, so an unnamed icon button will not compile. Tooltips use
  `aria-describedby`, never `aria-label`, so they supplement the name instead of replacing it.
- **Focus visibility.** The shared `:focus-visible` outline from `globals.css` is never removed.
- **Motion.** Every animation is gated on `useReducedMotion()`, and `MotionConfig` maps the in-app
  Appearance toggle onto the same signal, so one switch covers OS preference and manual override.
- **Honest tooltips.** Attach, mic and connector buttons say "Demo build — files are not uploaded"
  rather than pretending to work.
- **Mobile.** The shell is `100dvh`, not `vh`, so the composer stays above the on-screen keyboard;
  `viewportFit: "cover"` plus `env(safe-area-inset-bottom)` keeps it clear of the home indicator.
  Message and history actions are always visible below `sm`, since hover does not exist there.

---

## Assumptions

These are documented rather than hidden, because each one is a place where a real implementation
would differ.

1. **No backend.** Nothing leaves the browser. This is stated in the UI itself — under the composer
   and on Settings → Privacy — rather than only here.
2. **Simulated streaming.** `mockStream.ts` draws from a small canned corpus keyed loosely off
   keywords in the prompt, then re-voices it per model persona. Replies are plausible but not real;
   the *timing* is modelled honestly, driven by each model's `latency` rating.
3. **Invented model catalogue.** EchoGPT does not publish which models sit behind its "EchoGPT"
   pill, so `src/lib/models.ts` is a documented assumption shared across all three assessment
   projects. Speed and cost are **relative 1–5 ratings**, not benchmarks or prices, and the UI says
   so where they appear.
4. **Fixture history.** The twelve conversations on `/history` are fixtures. Pin, archive and delete
   mutate real state and behave correctly, but reload restores the fixtures. Timestamps are stored
   as hour offsets against a single module-level reference so server and client group identically.
5. **Coming-soon surfaces.** Image Studio, Video Studio, Connectors, Store, Job Analysis and SOP
   Builder are shown with a "Soon" badge and route to `/`. They are in the nav because the
   hierarchy argument needs them present; building six more surfaces was out of scope.
6. **Fonts.** The build environment for this assessment blocks `fonts.googleapis.com`, so
   `next/font/google` cannot run. `app/layout.tsx` declares `--font-geist-sans` / `--font-geist-mono`
   as plain font stacks instead: Geist is used when present, the platform UI face otherwise. This
   also makes the build hermetic — no network fetch at build time. Swapping in `next/font/local`
   with self-hosted `woff2` files is a one-block change, marked with a comment.
7. **No auth.** "Sign in" is present for layout fidelity and labelled as a demo.

---

## Additional features

Beyond the brief:

- **Workspace switcher** with three workspaces, persisted, with CSS-gradient monogram tiles.
- **Slash commands** — typing `/` in the composer filters a command list inline.
- **Token meter** — live estimate against the selected model's real context window, amber past 80%,
  red and send-blocking past 100%, with an explanatory `role="alert"`.
- **Search-term highlighting** in history results, with `<mark>` styled for both themes.
- **Per-column timing** on the compare board — each column reports how long it actually took.
- **Data export / erase** on Settings → Privacy. Export dumps every `echogpt.*` localStorage key as
  JSON; erase is behind a confirmation dialog. Both are honest about operating on local data only.
- **Appearance controls that do something** — density and text size apply live to the transcript
  and have their own preview block.
- **Cross-tab sync** — `useLocalStorage` listens for `storage` events, so changing the theme or
  model in one tab updates the others.
- **Live preview of settings** — the Shortcuts reference reflects the send-behaviour choice made on
  the General tab rather than going stale.

---

## What was deliberately left out

Stated plainly rather than left for the reviewer to discover:

- **The six "coming soon" surfaces** (Image Studio, Video Studio, Connectors, Store, Job Analysis,
  SOP Builder). Present in the nav, badged, not built.
- **Real conversation persistence.** Chats are not written to `localStorage` between reloads —
  `/history` is fixture-backed. The `saveHistory` switch exists and persists, but has no store
  behind it.
- **Markdown and syntax highlighting** in replies. Messages render as pre-wrapped plain text.
  A markdown renderer would have meant adding a dependency, which the brief forbade.
- **Branching conversations.** Edit-and-resend truncates the thread rather than forking it; a real
  branch UI needs a tree model and a switcher that would not have fitted the file budget.
- **Shortcut remapping.** The Shortcuts tab is a reference, not an editor.
- **Virtualised lists.** With a dozen conversations and short transcripts it would be unjustified
  complexity; it is the right call at a few thousand rows.
- **Tests.** No test runner is installed and dependencies were frozen. `tsc --noEmit` and ESLint
  both pass clean.

---

## Verification

```
npx tsc --noEmit   ✓ clean
npm run lint       ✓ clean
npm run build      ✓ 4 routes prerendered, 103 kB shared JS
```
