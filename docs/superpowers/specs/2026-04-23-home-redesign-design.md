---
title: Damasqas home page redesign
date: 2026-04-23
status: approved (brainstorm)
---

# Damasqas — home page redesign

## Goal

Restart the home page around a **unified white canvas** anchored by a Remotion-composed hero animation. Keep the product copy and the IA in spirit; modernize the visual language so the page earns its tagline — *"Incidents resolved. Before you open your laptop."* — at first glance.

## Scope

**Phase 1 (this spec, build first):** the hero.
**Phase 2 (next spec):** the remaining sections, redesigned around the new visual system.

Everything below Phase 1 is an outline — enough to orient the hero's design decisions, not enough to implement. A separate spec will detail Phase 2.

---

## Phase 1 — Hero

### Tagline and copy (unchanged)

- **H1 bold:** "Incidents resolved."
- **H1 italic:** "Before you open your laptop."
- **Sub:** "Damasqas is an AI agent built exclusively for site reliability. It connects to your monitoring, logs, and deployments, then **triages alerts, investigates incidents, and remediates autonomously**."
- **CTAs:** "Request a demo" (primary, → Cal.com) / "See how it works →" (ghost, → `#how`)
- **Eyebrow:** "AI SRE · BUILT FOR SLACK" with pulsing green status dot

### Layout

- Full-width, `min-height: 90vh`, unified white background across the whole hero. **No visible split** between text and composition.
- Desktop (≥1024px): grid `5fr / 7fr`, copy left, composition right, both on the same white canvas
- Tablet (768–1023px): stack vertically, composition below copy, composition reduces to a static poster (final "Resolved" frame)
- Mobile (<768px): hide full composition; show one static tilted "Resolved in 42s" card inline below the CTAs
- Subtle radial glow behind the composition (indigo + sage, <10% alpha) creates an implicit stage without a hard edge
- Subtle dotted grid pattern (0.045 alpha) masked to fade toward the copy side — creates depth without distraction

### The animation — concept

An 8-second infinite loop telling one incident end-to-end. Over that loop the viewer watches the full arc: alert fires → agent investigates → agent finds root cause → agent rolls back → resolved. The tagline and the animation say the same thing: *before you open your laptop, this is already done.*

### Animation — elements and beats

Composition runs on a fixed **30fps, 240-frame (8s)** Remotion timeline. "f" below = frame number.

| Element | Enters (f) | Holds (f) | Exits (f) | Notes |
|---|---|---|---|---|
| Pulse ring (under card 1) | 0–24 | — | 42 | Scales 0.3 → 3.0, fades over 18f |
| Card 1 — Alert (red) | 0–12 | 12–216 | 216–240 | Slams in from top-right, rotation settle, red border-left |
| Error graph (red line draws) | 18–60 | — | 192–216 | `strokeDashoffset` interpolation, 0.47 value |
| Card 2 — Investigating (thinking dots) | 42–54 | 54–216 | — | Slides in from right, Z-depth +20 |
| Agent orb (top-right) | 30–48 | 48–216 | 216–240 | Radial gradient sphere with conic glow halo, subtle rotation |
| Connector 1 (card1→card2) | 48–66 | — | 216 | Dashed line, draws via `clip-path: inset()` interpolation |
| Log terminal appears | 60–84 | 84–216 | 216–240 | Deep indigo `#0f1226`, perspective `rotateY(14deg) rotateX(-5deg)` |
| Log lines type in (3 lines, staggered) | 72–120 | — | — | Each line's width interpolates 0 → 100% via Remotion's `interpolate(frame, [72, 96])` for line 1, etc. |
| Card 3 — Root cause | 96–114 | 114–216 | — | Zooms from back, `scale(0.88 → 1.0)`, Z-depth 0 |
| Yellow bug-line highlight sweep | 108–144 | 144–216 | — | Background wash on the `TypeError` line, bloom via inset shadow |
| Commit badge (`3f82a → a91fe ✓`) | 114–132 | 132–216 | — | Strikethrough animates from 0 → full width |
| Connector 2 (log → commit) | 132–150 | — | — | |
| Graph morphs red → green | 150–180 | — | — | Red line strokes out leftward; green line draws in; value `0.47 → 0.04` crossfades |
| Card 4 — Resolved (green) | 162–180 | 180–216 | 216–240 | Swoops from bottom; green border-left; green glow bloom on box-shadow at f=180–192, decays by f=204 |
| Emoji reactions (🙏, ✅, 😴) | 180, 186, 192 | — | — | Each pops with spring overshoot (0 → 1.15 → 1.0) |
| Ticker text transitions (5 states) | 0, 54, 108, 144, 180 | — | — | "00:00 alert" → "00:12 investigating" → "00:28 root cause" → "00:35 rolling back" → "00:42 resolved" (green) |
| Global fade-out | 216–240 | — | — | All elements crossfade 1 → 0 |

### Interaction

- **Hover pause:** cursor over the composition pauses the `<Player>` at current frame
- **Click to restart:** click anywhere on composition jumps to frame 0
- **Reduced motion:** composition renders static final frame (frame 200) — all resolved state, no playback, no pulses. Ticker shows "00:42 resolved" statically.
- **Off-screen:** `IntersectionObserver` pauses playback when hero scrolls out; resumes on re-enter

### Tech

- **Remotion 4** (already installed) for composition and playback
- `@remotion/player` `<Player>` component embedded client-side
- Composition file: `src/remotion/HeroComposition.tsx`
- Registered in `src/remotion/Root.tsx` (Remotion's composition registry)
- Player wrapper: `src/app/_components/HeroPlayer.tsx` (client component, lazy-loaded)
- Primitives: `interpolate(frame, [in, out], [0, 1])`, `spring({ frame, fps, config: { damping: 18, stiffness: 120 } })`, `useCurrentFrame()`
- Three.js is **not** used for the hero. Available for potential later section if we add a real 3D element. (Pure 2.5D perspective via CSS `transform` is sufficient and smoother for this.)

### Motion quality — "smooth and clean"

- **Easing:** all enters use spring with `{ stiffness: 120, damping: 18, mass: 1 }` → no overshoot, single damped approach
- **Exits:** linear fade-outs, 24f (800ms)
- **Timing rhythm:** entries spaced on even beats (12f = 400ms rhythm), never concurrent collisions
- **No bounce:** avoid elastic/cubic overshoot — tagline is confident, not cartoony
- **Shadows:** all floating elements use the three-layer drop shadow (ambient + key + soft), colored-tint variant on the "resolved" state (sage green)
- **Anti-stutter:** `will-change: transform, opacity` on all animated elements; Remotion renders at 30fps deterministically so no frame drops

### Responsive spec

| Breakpoint | Behavior |
|---|---|
| ≥1280px | Full composition, all 8 element groups, Player autoplays |
| 1024–1279px | Full composition, fractionally scaled (0.92) |
| 768–1023px | Composition becomes a static poster PNG of frame 200; Player not loaded |
| <768px | Composition hidden; single tilted "Resolved in 42s" card inline below CTAs |

Poster PNG is pre-rendered via Remotion CLI (`npx remotion still`) and committed to `public/hero-poster.png`.

### Accessibility

- `<Player>` wrapped in `<div role="img" aria-label="Animation showing Damasqas resolving a production incident in 42 seconds: a P1 alert fires, the agent investigates, identifies a bad commit, rolls it back, and posts a resolved message to Slack." />`
- `prefers-reduced-motion: reduce` → static frame 200 via a fallback check in `HeroPlayer`
- Text contrast: all card text is WCAG AAA on white (cards stay white, text stays near-black)
- Keyboard: CTAs get standard focus rings (already in `globals.css`)
- The animation never flashes faster than 2Hz (no seizure risk)

### Color palette (this section, reusable)

- Canvas: `#FFFFFF`
- Canvas tint: `rgba(74, 107, 156, .06)` radial
- Ink: `#1A1814` (text), `#3D3A32` (sub), `#7A7466` (meta)
- Accents:
  - Indigo (agent, brand): `#4A6B9C`, `#2E4B73` (gradient on orb)
  - Red (alerts): `#D14A3A`, `#A8372A`
  - Green (resolved): `#6B8A5C`, `#4A7A3A`
  - Warm highlight: `#FFF4A3`
- Log terminal: `#0F1226` (near-black with indigo bias)

### Typography (unchanged from current site)

- Display italic: **Newsreader** 400 italic
- UI sans: **Instrument Sans** 400/500/600/700
- Mono: **JetBrains Mono** (new addition — replaces "Instrument Sans" for mono) for numeric/code in the composition

### Components (new for this phase)

1. `HeroPlayer` (client) — mounts Remotion `<Player>` with autoplay/loop/pause-on-hover, handles reduced-motion fallback, IntersectionObserver
2. `HeroComposition` — the Remotion composition itself, `fps=30, durationInFrames=240, width=760, height=660`
3. `HeroSection` — server component that renders left-side copy + `<HeroPlayer>` inside the unified white canvas
4. Composition sub-components (internal to `HeroComposition`):
   - `SlackCard` (with variants: `alert`, `neutral`, `ok`)
   - `LogTerminal`
   - `GraphCard`
   - `AgentOrb`
   - `CommitBadge`
   - `TickerBadge`
   - `PulseRing`
   - `Connector`

### Files changed / created

```
src/remotion/
  Root.tsx                       NEW  (composition registry)
  HeroComposition.tsx            NEW  (the 240-frame timeline)
  components/
    SlackCard.tsx                NEW
    LogTerminal.tsx              NEW
    GraphCard.tsx                NEW
    AgentOrb.tsx                 NEW
    CommitBadge.tsx              NEW
    TickerBadge.tsx              NEW
    PulseRing.tsx                NEW
    Connector.tsx                NEW
  constants.ts                   NEW  (timing constants, color tokens)

src/app/
  _components/
    HeroPlayer.tsx               NEW  (client, wraps @remotion/player)
    HeroSection.tsx              NEW  (server, layout + copy + player)
  page.tsx                       MODIFY  (replace current castle-video hero)
  home.body.html                 MODIFY  (strip the hero section; keep the rest for now)
  globals.css                    MODIFY  (add JetBrains Mono link; add hero-specific tokens)
  layout.tsx                     MODIFY  (preload JetBrains Mono font)

public/
  hero-poster.png                NEW  (pre-rendered frame 200 for mobile/tablet)

remotion.config.ts               NEW  (Remotion CLI config)
```

### Build commands

```bash
# Dev: Remotion studio preview (optional)
npx remotion studio src/remotion/index.ts

# Render poster for fallback
npx remotion still src/remotion/index.ts HeroComposition public/hero-poster.png --frame=200

# Next.js dev
npm run dev
```

### Success criteria

1. The hero replaces the castle-video hero at `/`
2. Animation runs smoothly at 30fps on mid-range laptop (tested in Chrome, Safari, Firefox)
3. Hover-pause works; click-to-restart works; reduced-motion shows static frame 200
4. Mobile (<768px) shows inline static "Resolved" card; no Remotion Player loaded (check network tab)
5. Bundle size added: `@remotion/player` + composition code; acceptable if ≤ 120KB gzipped client-side
6. Accessibility: screen reader reads the `aria-label`; page passes Lighthouse a11y 100
7. Animation feels "smooth and clean" — no stutter, no overshoot, no collision between elements

---

## Phase 2 — Rest of page (outline only)

Today's IA:
1. Hero
2. §01 Why Damasqas (before/after compare)
3. §02 Stack (pinned scrollytelling)
4. §03 How it works (numbered steps, Slack mocks)
5. §04 Audience (two cards)
6. CTA section
7. Wordmark
8. Footer

**Proposed IA after Phase 2** (subject to its own spec round):
1. Hero (built in Phase 1)
2. **Trust strip** — integration logos (Datadog, PagerDuty, GitHub, Slack, OpsGenie)
3. **Why Damasqas** — keep current before/after structure, restyle on white canvas
4. **How it works** — 4 steps, each with a mini Remotion composition (15s each, lighter weight)
5. **The stack** — keep current scrollytelling, restyle mock panels to match hero
6. **For who** — SRE / platform-eng cards, visual refresh
7. **FAQ** — NEW, addresses common buyer objections (safety, rollback limits, on-prem)
8. **CTA section**
9. **Wordmark**
10. **Footer**

The Phase 2 spec will detail each section, which ones re-use Phase 1 components, and what new components are needed.

---

## Open decisions deferred to implementation

1. Exact file path for Remotion composition entry: `src/remotion/index.ts` vs `src/remotion/Root.tsx` — will follow Remotion 4 convention
2. Whether to lazy-load `@remotion/player` with `next/dynamic` with `ssr: false` — likely yes, to avoid SSR of player
3. Exact poster render frame: currently 200 (after all beats settle, before fade-out)

## Out of scope for this spec

- Phase 2 sections
- Any blog redesign
- Nav or footer changes (beyond the hero section)
- Backend / integrations work
- Changes to copy elsewhere on the page
