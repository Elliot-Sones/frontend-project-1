# How It Works — §03 redesign

**Date:** 2026-04-24
**Scope:** Replace the static "§03 How it works" section on the home page with an animated, reveal-on-scroll version featuring a sticky timeline rail and three live animated stages.

---

## Goals

- Make §03 feel motivating and modern without being a scroll-hijack.
- Three animated stages, each reinforcing the step's claim: *connect*, *ask*, *proactive*.
- No new dependencies. No Remotion, no Framer Motion, no GSAP.
- Must degrade cleanly under `prefers-reduced-motion`.
- Mobile stacks cleanly; rail is desktop-only.

## Non-goals

- Not touching the hero, §01 (pain), §02 (solution), §04 (audience), or any other section.
- Not changing global tokens, type scale, nav, or footer.
- Not adding a new icon system; logo SVGs are local to this feature.
- Not changing the section's copy strategy (headlines, step titles, descriptions stay on message; minor edits only).

---

## Current state

§03 lives in `src/app/home.body.html` lines 370–438 as a static `<section class="section section-warm" id="how">`:

- Three `.how-step` rows in a CSS grid (`3fr 5fr 4fr` on desktop).
- Each row: a `.step-numeral`, a `.step-text` block (h3 + p), and a `.step-mock` with static mock content (datadog log for step 1, two Slack messages for step 2, one SLO warning for step 3).
- Styling in `src/app/globals.css` lines 750–801.

The home page is a client component (`src/app/page.tsx`) that reads `home.body.html` as raw HTML. We will replace the §03 block in the HTML with a mount point, then render a React component in its place.

## Approach

A React client component owns the whole section. Stages animate in place when scrolled into view, driven by CSS keyframes. A sticky timeline rail on the left shows progress; its fill line tracks scroll position through the section.

### Interaction model

- **Reveal-on-scroll per step.** Each stage's animation is gated behind an `IntersectionObserver`. Once the stage has entered the viewport, a class is added to start its keyframe loop. The loop runs on an 8-second clock and continues while the section is in view.
- **No scroll pinning.** Scroll behaves normally; nothing is hijacked.
- **Rail progress.** A single scroll listener computes `progress ∈ [0, 1]` based on section scroll position and writes it to a CSS variable (`--how-progress`) on the section root. The rail fill's `scaleY` is driven by that variable.

### Copy

Headlines and step titles carry over from the current section, minor tightening only:

- Section label: `03 / How it works`
- H2: **Three steps.** <span class="muted">Then it runs on its own.</span>
- Step 01 title: **Connect your stack**
  - Body: "Add monitoring, logging, deployment platforms, and repos. Damasqas connects via MCP servers, read-only by default. It learns your services, your topology, your SLOs."
  - Caption under stage: *datadog · github · railway · pagerduty — grafana, aws, kubernetes soon*
- Step 02 title: **Ask reliability questions in Slack**
  - Body: "Not 'write me a function.' Real infrastructure questions. Damasqas understands deployment state, service health, and change history."
- Step 03 title: **Proactive monitoring + remediation**
  - Body: "Damasqas learns your service topology and auto-configures monitoring: SLOs, error budgets, deployment health, and dependency status, all tailored to your architecture."

### Layout

#### Desktop (≥900px)

- Section constrained to `max-width: 1100px` (matches hero width), centered.
- Section background: true white (drops `section-warm` tint). Inherits site background.
- Outer grid: `grid-template-columns: 120px 1fr; column-gap: 48px;`
- **Left column: sticky rail.** `position: sticky; top: 120px; align-self: start;` Contains:
  - Three numbered nodes (01 / 02 / 03) as `<ol><li>` styled as circles.
  - A vertical hairline connecting them.
  - A scroll-fill line overlaid, `transform-origin: top; transform: scaleY(var(--how-progress));`
  - Nodes switch from outlined to solid black when their step crosses the viewport midpoint (tracked per-step with the same IntersectionObserver pattern).
- **Right column: steps.** Three rows stacked vertically.
  - Each row: `grid-template-columns: 1fr 1fr; gap: 48px; padding: 80px 0; border-top: 1px solid var(--hairline);`
  - Left sub-column: step heading + description.
  - Right sub-column: the animated stage.
- **Stage container:** `aspect-ratio: 4/3; border-radius: 14px; background: #fafaf9; border: 1px solid var(--hairline); overflow: hidden; position: relative;`

#### Mobile (<900px)

- Rail collapses; no sticky behavior.
- Each step becomes a stacked block:
  1. A small circled numeral at the top.
  2. Step heading.
  3. Description.
  4. Stage (full width, `aspect-ratio: 4/3`).
- Stages still trigger their loop on enter.
- Row padding compresses to `48px 0`, border-top hairline retained.

### Motion choreography

All loops run on an **8.0s clock**. All animations use `transform` + `opacity` only. Each stage's keyframes are enabled by an `.is-playing` class added after `IntersectionObserver` first-enter.

#### Step 01 — Connect (stage: `ConnectStage.tsx`)

- 0.0–1.5s: four logo tiles (Datadog, GitHub, Railway, PagerDuty) fade + scale-up from 0.6 to 1.0 at the four corners of the stage; staggered 300ms.
- 1.5–3.5s: four SVG lines (one from each tile) draw to the central Damasqas core using `stroke-dashoffset` 140→0; staggered 400ms.
- 3.5–5.5s: core emits a soft pulse ring every ~2s (box-shadow keyframe).
- 5.5–8.0s: hold, then lines and tiles fade slightly; restart.

Static fallback (reduced motion): all four tiles and all four lines visible and connected; core shown; no pulse.

#### Step 02 — Slack (stage: `SlackStage.tsx`)

- 0.0–0.2s: user avatar + "Shalin" name appear.
- 0.2–2.2s: user's message types character-by-character via CSS `width: Nch; steps(N)`. Blinking caret on the right edge.
- 2.4–3.4s: three tool-use pills (📊 datadog, 🐙 github, 🚂 railway) pop in one by one with `translateY(4px)` → `translateY(0)` + opacity; staggered 300ms.
- 3.6–3.8s: bot avatar + "damasqas" name appear.
- 3.8–6.5s: bot answer types out: *"Pool exhausted after deploy #138. PR #92 opened to restore pool size."*
- 6.5–8.0s: hold, fade, restart.

Static fallback: all three messages fully rendered, pills visible, no caret, no fade.

#### Step 03 — Proactive (stage: `MonitorStage.tsx`)

Single Slack-style notification card from Damasqas with an embedded burn-rate graph. Production layout places notification body text on the left (~55%) and the embedded graph on the right (~45%); the narrow preview mockup stacked them, the real frame does not.

- 0.0–0.4s: card slides up 12px + fades in (`translateY(12px) scale(0.97)` → `translateY(0) scale(1)`).
- 0.4–2.0s: burn-rate line draws left-to-right in the embedded graph (`stroke-dashoffset: 300 → 0`).
- 2.0–2.4s: gradient area-fill under the line fades in (`opacity: 0 → 0.35`).
- 2.4–2.8s: "⚠ SLO 73%" chip pops (scale `0.9 → 1`, opacity `0 → 1`); dashed threshold line visible.
- 2.8–7.0s: hold.
- 7.0–8.0s: fade, restart.

Card content (copy):

- Avatar: "d" on black.
- Header: "damasqas · 12:04 PM"
- Title: "⚠ SLO Warning · payments-api"
- Body: "Error budget **73%** consumed · breaches in ~6 days. Top contributor: `/v1/charges` timeouts."

Static fallback: card fully present, line fully drawn, fill fully visible, chip visible.

---

## Component architecture

New files under `src/app/_components/how-it-works/`:

```
how-it-works/
├── HowItWorks.tsx           -- top-level section; owns grid, rail, scroll-progress, renders stages
├── HowItWorks.module.css    -- layout, rail, grid, responsive, reduced-motion
├── useInView.ts             -- hook wrapping IntersectionObserver; returns { ref, hasEntered }
├── stages/
│   ├── ConnectStage.tsx     -- step 01 animation
│   ├── ConnectStage.module.css
│   ├── SlackStage.tsx       -- step 02 animation
│   ├── SlackStage.module.css
│   ├── MonitorStage.tsx     -- step 03 animation
│   ├── MonitorStage.module.css
│   └── logos.tsx            -- inline SVG logo marks (Datadog, GitHub, Railway, PagerDuty, core)
```

Each stage mounts its own component; each has its own `useInView` and its own keyframe module. This keeps stages independently editable — one change doesn't cascade.

### `HowItWorks.tsx`

- `"use client"`.
- Renders `<section id="how">` containing:
  - A header block (label, H2).
  - A grid with:
    - The timeline rail (`<ol class="rail">` with three `<li>` nodes + a scroll-fill `<div>`).
    - A column of three `<article class="step">` rows.
- Attaches a passive `scroll` event listener on `window` (rAF-throttled) that computes scroll progress of the section and writes it to `--how-progress` on the section's DOM node.
- Listener is cleaned up on unmount.

### `useInView.ts`

```ts
function useInView<T extends Element>(options?: IntersectionObserverInit): {
  ref: RefObject<T>;
  hasEntered: boolean;
};
```

- Creates an `IntersectionObserver` with `threshold: 0.25` by default.
- Sets `hasEntered` to `true` once the observed element is first at least 25% visible.
- Never resets to `false` (ensures animations don't flicker if the user scrolls back and forth).
- Cleans up observer on unmount.

### Stage components

Each stage:

- Uses `useInView` on its root `<div>`.
- Renders its content unconditionally; adds `.is-playing` to the root when `hasEntered === true`.
- All `@keyframes` rules are gated in CSS behind `.is-playing`: without the class, elements render in their static fallback state (identical to reduced-motion state).

---

## HTML / mount integration

The current `home.body.html` contains the §03 block inline. Replace that block with a mount marker:

```html
<!-- §03 HOW IT WORKS -->
<div id="how-it-works-mount"></div>
```

Update `src/app/page.tsx` (or wherever `home.body.html` is rendered) to:

1. Continue rendering `home.body.html` as before for the other sections.
2. After the HTML mounts, mount `<HowItWorks />` into the `#how-it-works-mount` node via a portal, **or** (preferred) split the HTML string around the mount marker and render `<HowItWorks />` as a sibling element between the two halves.

The preferred approach avoids portals. Exact pattern to match the existing `HeroSection` integration in `src/app/_components/HeroSection.tsx`.

The inline CSS for `.how-steps`, `.how-step`, `.step-numeral`, `.step-mock`, `.slack-msg`, `.slack-avatar`, `.slack-name`, `.slack-content` in `globals.css` (lines 750–801 plus any §03-only Slack styles) becomes dead once §03 is gone; remove those rules.

---

## Accessibility

- `prefers-reduced-motion: reduce` disables every `@keyframes` rule in the feature's CSS. Stages render their static fallback state (fully populated).
- Rail numerals: `<ol class="rail"><li>…</li>…</ol>` — real ordered list, CSS-styled into circles.
- Stage markup is decorative; add `aria-hidden="true"` on the stage container so screen readers skip it. The step's heading + description carry the meaning.
- Color: warning chip and SLO text use enough contrast against `#fafaf9` to clear WCAG AA (verify: orange `#9a3412` on `#fff7ed` for the chip; body text `#555` on `#fafaf9`). If any fail, shift to brand-equivalent tokens from existing CSS vars.
- Keyboard: nothing interactive on this section — no focus traps, no focus changes.

## Performance

- All transitions use `transform` and `opacity`; no layout-triggering properties.
- Scroll handler is rAF-throttled and passive.
- SVGs inlined (logos small, 4 of them, <2KB total).
- No images. No fonts beyond the site's existing stack.
- First paint renders static server-side HTML with step copy visible; animations attach only after hydration — SSR/prerender is unaffected.

---

## Edge cases & fallbacks

- **JS disabled:** static HTML renders copy + stage containers. Stages appear in their static fallback state because the `.is-playing` class never attaches; animations never start. Fully readable and usable.
- **Reduced motion:** identical to JS-disabled behavior for the stages; scroll-progress rail fill is also disabled (rail shows fully filled OR fully empty — pick fully empty to avoid implying progress that isn't earned; numerals still light up on enter).
- **Very short viewport (<500px tall):** sticky rail would overflow; disable sticky below that height via media query, fall back to static rail.
- **Very wide viewport (>1600px):** section remains `max-width: 1100px`, centered. Stages don't grow past their aspect ratio.

## Testing

- Visual check on desktop Chrome + Safari at 1440×900: rail sticks; fill grows with scroll; each stage animates once on first enter; loops continue; all three stages eventually visible.
- Mobile emulation at 390×844 (iPhone 14): rail gone; steps stacked; stages animate on enter.
- Toggle `prefers-reduced-motion` in devtools: stages static, no movement, all content present.
- Toggle JS off: same as reduced motion.
- Lighthouse: no new CLS, no new LCP regression.

## Out of scope / future

- Not adding controls (play/pause, skip).
- Not instrumenting analytics on stage play events.
- Not adding theming variants.
- If we want to introduce click-to-play-sound or expand-to-see-full-Slack-thread interactions later, the stage components have enough isolation to bolt that on without restructuring.
