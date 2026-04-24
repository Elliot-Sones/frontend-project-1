---
title: Damasqas hero — notification stack redesign
date: 2026-04-24
status: approved (brainstorm)
supersedes: docs/superpowers/specs/2026-04-23-home-redesign-design.md (hero section only)
---

# Damasqas hero — notification stack redesign

## Goal

Replace the current Slack-card hero composition with a **dense, asymmetric 3D stack of iOS-17-style notifications** that each carry a real integration logo. The stack pops into view rapidly on page load (all 8 in ~1.35s), then holds with the "✓ Resolved" hero notification front-and-center until the loop fades and restarts.

## Why this replaces the previous hero

Last iteration's hero used generic Slack-card shells with single-letter avatars ("A" for AlertManager, "D" for Damasqas) alongside a log terminal, a graph, a Three.js orb, a commit badge, a ticker, emoji reactions, pulse rings, and dashed connectors. It felt like a chat-log transcript. The new direction is singular: **a pile of real notifications from your real stack**, arranged in 3D so one hero notification sits prominent beside the text and the rest overlap behind it.

## Scope

Phase 1 (this spec) — hero only. The new composition **replaces** `src/remotion/HeroComposition.tsx` and all components currently in `src/remotion/components/`. Everything else on the page (nav, §01–§04, footer) stays untouched.

---

## The 8 notifications

Ordered chronologically. Each has an integration source, a one-line title, an optional body, a time label, and a role in the 42-second incident story.

| # | Source | Title | Body | Time label | Role |
|---|---|---|---|---|---|
| 1 | **Datadog** | P1 · checkout 5xx spike | error rate **47%** · auth-svc | −42s | alert kicks off |
| 2 | **PagerDuty** | Incident #4821 ack'd | by **damasqas** · no page sent | −41s | relief |
| 3 | **Slack** | #ops-alerts thread opened | context shared, watchers added | −39s | transparency |
| 4 | **Jira** | INC-223 created | linked to `3f82a` | −37s | hygiene |
| 5 | **Damasqas** | Correlating 12 deploys | last 30min · auth, checkout, billing | −32s | intelligence |
| 6 | **GitHub** | Commit `3f82a` identified | `checkout.ts:142` · empty cart regression | −7s | RCA moment |
| 7 | **GitHub** | Revert PR #481 | rolling back `3f82a` | −2s | action |
| 8 | **Damasqas** (HERO) | ✓ Resolved in 42s | Rolled back `3f82a`. Error rate **0.4%**. | now | payoff |

Content is fixed. No typing animation, no text crossfades. Each card renders its final text the moment it enters.

## Visual language

**Every notification is the same component** with different props. Shared structure:

- Rounded 19px (iOS 17 radius)
- White background at 96% alpha, `backdrop-filter: blur(18px)`
- 1px border at `rgba(0,0,0,.05)`
- Layout: `[42×42 icon] [source + time · title · body]`
- Integration icon: 42×42 rounded 12px, gradient fill by source, 2-letter monogram in white
- Typography: -apple-system / SF Pro Text (matches real OS notifications)
- Title: 13.5px, weight 700, tight tracking
- Body: 12px, weight 400, `code` uses JetBrains Mono on warm beige

### Hero variant
Larger (340px vs 290px), bigger icon (52×52), tinted green-leaning background, 1px green-tinted border, title in dark green. Otherwise identical.

### Integration colors
- Datadog: `#8749c7 → #4e1f8f` (purple)
- PagerDuty: `#3ed878 → #1d9a55` (green)
- Slack: `#e0346a → #a51a4a` (magenta)
- Jira: `#4bc0f2 → #0b75ad` (cyan)
- GitHub: `#333 → #0a0a0a` (black)
- Damasqas: `#7c9ccf → #2e4b73` (indigo)

## Layout — dense asymmetric blob

Hero notification anchored **upper-left**, bleeding into the text column boundary to feel connected. 7 secondary notifications cluster down-right, filling the stage with heavy overlap and no visible gaps. Not symmetric, not Y-shaped.

Absolute positions (within a 1100×720 logical canvas, the hero aspect ratio is ~1100/720 ≈ 1.53):

| # | Source | left | top | Z | size | rotateY | rotateX | rotateZ | opacity | blur |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 8 | Hero | -30 | 36% | +170 | 340 | -5° | 2° | -3° | 1.00 | 0 |
| 6 | GH commit | 160 | 70% | +90 | 290 | -8° | -2° | 3° | 0.97 | 0 |
| 1 | Datadog | 220 | 22% | +70 | 275 | -10° | 8° | -5° | 0.95 | 0 |
| 5 | Inv | 370 | 50% | +10 | 260 | -14° | 2° | 2° | 0.90 | 0 |
| 2 | PagerDuty | 420 | 82% | -20 | 245 | -12° | -6° | -4° | 0.86 | 0 |
| 3 | Slack | 400 | 12% | -30 | 235 | -14° | 8° | 3° | 0.84 | 0 |
| 4 | Jira | 550 | 36% | -100 | 225 | -20° | 4° | -4° | 0.72 | 0.4px |
| 7 | GH PR | 570 | 68% | -170 | 210 | -24° | -6° | 4° | 0.58 | 0.9px |

Z-depth ramp: +170 → +90 → +70 → +10 → -20 → -30 → -100 → -170. Hero punches 340px forward from the back card.

Shadow intensity scales with Z (deeper = softer/smaller shadow). Hero gets a secondary green-tinted shadow layer.

## Animation — fast cascade

**5s loop** @ 30fps = 150 frames.

### Stagger — 150ms (4.5 frames) between cards

| Beat | Frame | Time | Event |
|---:|---:|---:|---|
| 1 | 0 | 0.00s | Datadog enters |
| 2 | 5 | 0.15s | PagerDuty enters |
| 3 | 9 | 0.30s | Slack enters |
| 4 | 14 | 0.45s | Jira enters |
| 5 | 18 | 0.60s | Damasqas (investigating) enters |
| 6 | 23 | 0.75s | GitHub (commit) enters |
| 7 | 27 | 0.90s | GitHub (PR) enters |
| 8 | 32 | 1.05s | Hero enters |
| — | 41 | 1.35s | Hero green bloom peaks |
| — | 57 | 1.90s | Green bloom decays to rest |
| — | 135 | 4.50s | Global fade-out begins |
| — | 150 | 5.00s | Loop restarts |

### Per-card entry
- Duration: ~250ms (7.5 frames)
- Scale: `0.5 → 1.0` via spring `{stiffness:120, damping:18}` (no overshoot, matches prior spec)
- Opacity: `0 → target`
- translateZ: target is fixed (already in resting transform). Scale-from-smaller creates the "pop forward from depth" perception without altering Z.
- Easing: `cubic-bezier(.16, 1, .3, 1)` for preview approximation; Remotion uses `spring()`

### Hero bloom (frames 41–57)
- At +32 frames: hero scale 1.04, box-shadow gains `0 24px 48px rgba(107,138,92,.45)` green glow
- At +48 frames: scale back to 1.0, glow decays to rest state (`rgba(107,138,92,.12)`)
- Linear interpolation between keyframes

### Global fade (frames 135–150)
- All cards: `opacity → 0` over 450ms
- No transform change during fade
- Loop restarts at frame 150; stage is momentarily empty

### No idle breathing (cut vs. earlier spec)
The previous version had CSS breathing on all cards. With a 5s loop and 3.5s of "everything visible" time, breathing adds jitter and fights the clean static end-state. Cut it. Loop's natural rhythm (fade + restart every 5s) is the motion.

## Component architecture

### What gets deleted
All existing Remotion components are deleted, replaced by a single notification component + helper utilities:

- ❌ `SlackCard.tsx`
- ❌ `LogTerminal.tsx`
- ❌ `GraphCard.tsx`
- ❌ `AgentOrb.tsx`
- ❌ `CommitBadge.tsx`
- ❌ `PulseRing.tsx`
- ❌ `TickerBadge.tsx`
- ❌ `Connector.tsx`
- ❌ `EmojiReactions.tsx`

### What gets created
- `src/remotion/components/NotificationCard.tsx` — one component, 8 instances
- `src/remotion/components/IntegrationIcon.tsx` — renders the 42×42 gradient tile + monogram for a given integration
- `src/remotion/notifications.ts` — the 8-notification data array (source, title, body, time, position, Z, rotation, opacity, blur, isHero)
- `src/remotion/HeroComposition.tsx` — rewritten to map over `notifications.ts` and render 8 NotificationCards with pop-in + hero bloom timing

### What stays
- `src/remotion/constants.ts` — reused but updated (new BEATS, new COMPOSITION size)
- `src/remotion/composition.module.css` — largely replaced with notification styles
- `src/app/_components/HeroPlayer.tsx` — unchanged (Player wrapper)
- `src/app/_components/HeroSection.tsx` — unchanged
- `src/app/_components/HeroSection.module.css` — unchanged

### `notifications.ts` shape

```typescript
export type Integration =
  | "datadog" | "pagerduty" | "slack" | "jira"
  | "github" | "damasqas";

export interface Notification {
  id: string;
  integration: Integration;
  title: string;
  body?: string;
  time: string;
  enterFrame: number;
  position: {
    left: number | string;  // px or %
    top: number | string;
    translateZ: number;
    rotateY: number;  // degrees
    rotateX: number;
    rotateZ: number;
    width: number;
    opacity: number;
    blur?: number;    // px, optional
  };
  isHero?: boolean;
}

export const NOTIFICATIONS: Notification[] = [ /* 8 entries */ ];
```

## Tech — Remotion

Remotion is already installed (`remotion`, `@remotion/player`). Three.js is **no longer used** for the hero — the dependency stays in `package.json` for potential later use but no hero code imports it.

### Composition props
- `fps: 30`, `durationInFrames: 150` (5s loop), `width: 1100`, `height: 720`

### Per-card timing helpers

```typescript
function cardAnim(frame: number, enterFrame: number, fps: number, target: { opacity: number }) {
  const local = frame - enterFrame;
  const s = spring({ frame: local, fps, config: { stiffness: 120, damping: 18, mass: 1 }, from: 0.5, to: 1 });
  const enter = local < 0 ? 0 : Math.min(1, local / 7);  // opacity ramp over ~230ms
  const globalFade = interpolate(frame, [135, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return {
    scale: local < 0 ? 0.5 : s,
    opacity: (local < 0 ? 0 : target.opacity * enter) * globalFade,
  };
}
```

### Hero bloom helper

```typescript
function heroBloom(frame: number, enterFrame: number) {
  const t = frame - enterFrame;
  // 0→9f ramp up, 9→25f decay
  return interpolate(t, [0, 9, 25], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
```

## Responsive

Unchanged from previous spec — the `HeroSection.module.css` responsive rules already collapse the grid to single column at `max-width: 1023px`. The composition's aspect-ratio carries; cards stay crisp when scaled down because each renders at its logical size and the Player scales uniformly.

On mobile (<768px) the Player still loads but at a smaller size. Future optimization (out of scope): pre-render a static poster PNG and swap in for mobile.

## Accessibility

- Player div keeps `role="img"` and `aria-label` describing the story: "Eight notifications from Datadog, PagerDuty, Slack, Jira, GitHub, and Damasqas pop into a stack; the final notification reads 'Resolved in 42 seconds', showing Damasqas triaged and fixed the incident autonomously."
- `prefers-reduced-motion: reduce` → render frame 60 statically (all cards visible, hero settled, no motion).
- Contrast ratios (AAA on white) preserved since cards stay white-on-white text; icons provide color.

## Removed features

These were in the prior hero but are not part of this design:
- Log terminal (no longer fits the notification theme)
- Error-rate graph card (ditto)
- Three.js agent orb
- Commit swap badge (replaced by the GitHub PR notification card)
- Pulse ring under alert
- Ticker badge top-right (time labels live on each card now)
- Emoji reactions row on resolved card
- Dashed connector SVG paths

## Success criteria

1. `/` loads; nav + hero both render; no console errors
2. 8 notifications cascade in within 1.35s of page load
3. Hero notification ("✓ Resolved in 42s") lands last with visible green glow that decays
4. All 8 hold for ~3 seconds, then fade together and loop restarts
5. Each notification shows its correct integration logo and color
6. `prefers-reduced-motion: reduce` shows all 8 statically with hero landed
7. `npx tsc --noEmit` clean, `npm run lint` clean, `npm run build` succeeds
8. Total client JS bundle for `/` remains under 250KB first-load (the Three.js removal should net savings)

## Out of scope

- Editing copy elsewhere on the page
- Changing other sections (Why, Stack, How it works, Audience)
- Adding new notification types or integrations
- Swappable/configurable notifications (this is a fixed marketing animation)
- Exporting to an MP4/poster (followup)
