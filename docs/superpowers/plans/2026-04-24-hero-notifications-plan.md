# Hero Notification Stack — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Slack-card Remotion composition with a dense 3D stack of 8 iOS-17 style notification cards (Datadog, PagerDuty, Slack, Jira, GitHub ×2, Damasqas ×2) that pop in rapidly on load over a 5-second loop.

**Architecture:** Delete the current 9 Remotion components (SlackCard, LogTerminal, GraphCard, AgentOrb, CommitBadge, PulseRing, TickerBadge, EmojiReactions, Connector). Replace with one data-driven `NotificationCard` component + small `IntegrationIcon` helper, fed by a static `notifications.ts` array describing all 8 cards (source, content, position, timing). The composition file becomes a thin loop that maps over the array.

**Tech Stack:** Next.js 16 (App Router), React 19, Remotion 4 (`@remotion/player`), TypeScript, CSS Modules. No test runner in this project — verification is `npx tsc --noEmit` + `npm run lint` + manual browser check at `/mockups/hero-preview` and `/`.

**Source of truth:** `docs/superpowers/specs/2026-04-24-hero-notifications-design.md`. When tables, positions, or content here conflict with the spec, the spec wins.

**Verification loop per task:**
1. Task edits files as described
2. Run `npx tsc --noEmit` — no new errors
3. For visual tasks, reload `http://localhost:3000/mockups/hero-preview` (or `/`) in browser
4. Commit

Start the dev server once if it's not running: `npm run dev`. Leave it running the whole session.

---

## Phase 0 — Orientation

### Task 0: Baseline check

**Files:** none (sanity check)

- [ ] **Step 1: Confirm branch**

Run: `git branch --show-current`
Expected: `landing-mockups-modern-animations`

- [ ] **Step 2: Confirm dev server responds**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/mockups/hero-preview`
Expected: `200`. If not, start dev server with `npm run dev`.

- [ ] **Step 3: Open baseline in browser**

Visit `http://localhost:3000/mockups/hero-preview`. Note the current state (Slack-card style cards cascading, log terminal, graph, orb, commit badge, ticker) — this is what we are replacing.

---

## Phase 1 — Prep (sequential, me)

### Task 1: Rewrite `constants.ts` with new dimensions and beats

**Files:**
- Modify: `src/remotion/constants.ts`

Current beats are for the 16-beat Slack-card cascade. Replace with the new notification beats per spec.

- [ ] **Step 1: Overwrite `src/remotion/constants.ts`**

```typescript
// Hero notification stack — 5s loop at 30fps = 150 frames.
// 8 notifications cascade in with 150ms (4.5 frame) stagger.
export const FPS = 30;
export const DURATION_FRAMES = 150;

// Logical canvas size — the Player scales this to fit the DOM element.
export const COMPOSITION_WIDTH = 1100;
export const COMPOSITION_HEIGHT = 720;

// Per-card entry frames (when the card starts popping in).
// Stagger = 4.5 frames (150ms @ 30fps). Hero gets a tiny extra pause before entry.
export const BEATS = {
  datadogEnter: 0,
  pagerdutyEnter: 5,
  slackEnter: 9,
  jiraEnter: 14,
  investigatingEnter: 18,
  githubCommitEnter: 23,
  githubPrEnter: 27,
  heroEnter: 32,
  heroBloomPeak: 41,     // +9f after hero enters
  heroBloomRest: 57,     // +25f after hero enters
  globalFadeStart: 135,
  loopEnd: 150,
} as const;

// Spring physics: damped approach, no overshoot.
export const SPRING_CONFIG = {
  damping: 18,
  stiffness: 120,
  mass: 1,
} as const;

// Color tokens — used by NotificationCard styles and hero bloom shadow.
export const COLORS = {
  canvas: "#FFFFFF",
  ink100: "#1A1814",
  ink80: "#3D3A32",
  ink60: "#7A7466",
  heroGreen: "#6B8A5C",
  heroGreenGlow: "rgba(107, 138, 92, 0.45)",
  heroGreenRest: "rgba(107, 138, 92, 0.12)",
} as const;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: TypeScript errors will appear in `HeroComposition.tsx` (it imports old BEATS keys that no longer exist). **This is expected.** We'll fix that in Task 6. Ignore for now.

- [ ] **Step 3: Commit**

```bash
git add src/remotion/constants.ts
git commit -m "remotion: rewrite constants for 5s notification loop (150 frames)"
```

---

### Task 2: Replace `composition.module.css` with notification styles

**Files:**
- Modify: `src/remotion/composition.module.css` (full replace)

- [ ] **Step 1: Overwrite `src/remotion/composition.module.css`**

```css
/* Styles for the hero notification stack. Rendered inside <HeroComposition />. */

/* ============= Notification card base (iOS 17 style) ============= */
.card {
  position: absolute;
  display: flex;
  gap: 11px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 19px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transform-style: preserve-3d;
  font-family: -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif;
  will-change: transform, opacity;
}

.body {
  min-width: 0;
  flex: 1;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3px;
  gap: 8px;
}

.src {
  font-size: 12px;
  font-weight: 800;
  color: #1a1814;
  letter-spacing: -0.01em;
}

.time {
  font-size: 10.5px;
  color: #8a857c;
  flex-shrink: 0;
  font-family: ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, monospace;
}

.title {
  font-size: 13.5px;
  font-weight: 700;
  color: #111;
  line-height: 1.3;
  letter-spacing: -0.015em;
  margin-bottom: 2px;
}

.text {
  font-size: 12px;
  color: #3d3a32;
  line-height: 1.4;
}

.text code {
  background: #f4efe2;
  padding: 1px 5px;
  border-radius: 3px;
  font-family: ui-monospace, "JetBrains Mono", SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  color: #8a6e4f;
  font-weight: 600;
}

.text b {
  font-weight: 800;
  color: #1a1814;
}

/* ============= Hero variant ============= */
.cardHero {
  padding: 17px 19px;
  border: 1px solid rgba(107, 138, 92, 0.3);
  background: rgba(253, 255, 250, 0.98);
}

.cardHero .src {
  font-size: 13px;
}

.cardHero .title {
  font-size: 15px;
  color: #1e3a14;
}

.cardHero .text {
  font-size: 12.5px;
}

/* ============= Integration icon ============= */
.icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: -0.02em;
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.22),
    inset 0 -2px 4px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.iconHero {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  font-size: 17px;
}

/* Integration gradients */
.gradDatadog { background: linear-gradient(135deg, #8749c7, #4e1f8f); }
.gradPagerduty { background: linear-gradient(135deg, #3ed878, #1d9a55); }
.gradSlack { background: linear-gradient(135deg, #e0346a, #a51a4a); }
.gradJira { background: linear-gradient(135deg, #4bc0f2, #0b75ad); }
.gradGithub { background: linear-gradient(135deg, #333, #0a0a0a); }
.gradDamasqas { background: linear-gradient(135deg, #7c9ccf, #2e4b73); }
```

- [ ] **Step 2: Commit**

```bash
git add src/remotion/composition.module.css
git commit -m "remotion: replace composition styles with notification card styles"
```

---

## Phase 2 — Data + components (parallelizable)

These three files are independent. In subagent-driven mode they can be built in parallel.

### Task 3: Create `notifications.ts` data file

**Files:**
- Create: `src/remotion/notifications.ts`

The static array describing all 8 notifications — their content, final position (within the 1100×720 canvas), 3D transform values, opacity, and which frame they enter. This is the single source of truth for the composition.

- [ ] **Step 1: Write `src/remotion/notifications.ts`**

```typescript
import { BEATS } from "./constants";

export type Integration =
  | "datadog"
  | "pagerduty"
  | "slack"
  | "jira"
  | "github"
  | "damasqas";

export interface NotificationPosition {
  /** CSS left value — number = px, string = % */
  left: number | string;
  /** CSS top value */
  top: number | string;
  /** translateZ in px (depth — higher = closer) */
  translateZ: number;
  /** tilt around Y in degrees */
  rotateY: number;
  /** tilt around X in degrees */
  rotateX: number;
  /** in-plane rotation in degrees */
  rotateZ: number;
  /** final card width in px */
  width: number;
  /** target opacity once entered (0–1) */
  opacity: number;
  /** optional blur for deep-back cards */
  blur?: number;
  /** z-index (rendering order) */
  zIndex: number;
}

export interface Notification {
  id: string;
  integration: Integration;
  title: string;
  body?: string;
  time: string;
  enterFrame: number;
  position: NotificationPosition;
  isHero?: boolean;
}

/** 8 notifications in the hero stack, in chronological order of entry. */
export const NOTIFICATIONS: Notification[] = [
  {
    id: "datadog-alert",
    integration: "datadog",
    title: "P1 · checkout 5xx spike",
    body: "error rate <b>47%</b> · auth-svc",
    time: "−42s",
    enterFrame: BEATS.datadogEnter,
    position: {
      left: 220, top: "22%",
      translateZ: 70, rotateY: -10, rotateX: 8, rotateZ: -5,
      width: 275, opacity: 0.95, zIndex: 15,
    },
  },
  {
    id: "pagerduty-ack",
    integration: "pagerduty",
    title: "Incident #4821 ack'd",
    body: "by <b>damasqas</b> · no page sent",
    time: "−41s",
    enterFrame: BEATS.pagerdutyEnter,
    position: {
      left: 420, top: "82%",
      translateZ: -20, rotateY: -12, rotateX: -6, rotateZ: -4,
      width: 245, opacity: 0.86, zIndex: 8,
    },
  },
  {
    id: "slack-thread",
    integration: "slack",
    title: "#ops-alerts thread opened",
    body: "context shared, watchers added",
    time: "−39s",
    enterFrame: BEATS.slackEnter,
    position: {
      left: 400, top: "12%",
      translateZ: -30, rotateY: -14, rotateX: 8, rotateZ: 3,
      width: 235, opacity: 0.84, zIndex: 7,
    },
  },
  {
    id: "jira-ticket",
    integration: "jira",
    title: "INC-223 created",
    body: "linked to <code>3f82a</code>",
    time: "−37s",
    enterFrame: BEATS.jiraEnter,
    position: {
      left: 550, top: "36%",
      translateZ: -100, rotateY: -20, rotateX: 4, rotateZ: -4,
      width: 225, opacity: 0.72, blur: 0.4, zIndex: 5,
    },
  },
  {
    id: "damasqas-investigating",
    integration: "damasqas",
    title: "Correlating 12 deploys",
    body: "last 30min · auth, checkout, billing",
    time: "−32s",
    enterFrame: BEATS.investigatingEnter,
    position: {
      left: 370, top: "50%",
      translateZ: 10, rotateY: -14, rotateX: 2, rotateZ: 2,
      width: 260, opacity: 0.9, zIndex: 11,
    },
  },
  {
    id: "github-commit",
    integration: "github",
    title: "Commit <code>3f82a</code> identified",
    body: "<code>checkout.ts:142</code> · empty cart regression",
    time: "−7s",
    enterFrame: BEATS.githubCommitEnter,
    position: {
      left: 160, top: "70%",
      translateZ: 90, rotateY: -8, rotateX: -2, rotateZ: 3,
      width: 290, opacity: 0.97, zIndex: 17,
    },
  },
  {
    id: "github-pr",
    integration: "github",
    title: "Revert PR #481",
    body: "rolling back <code>3f82a</code>",
    time: "−2s",
    enterFrame: BEATS.githubPrEnter,
    position: {
      left: 570, top: "68%",
      translateZ: -170, rotateY: -24, rotateX: -6, rotateZ: 4,
      width: 210, opacity: 0.58, blur: 0.9, zIndex: 3,
    },
  },
  {
    id: "damasqas-resolved",
    integration: "damasqas",
    title: "✓ Resolved in 42s",
    body: "Rolled back <code>3f82a</code>. Error rate <b>0.4%</b>.",
    time: "now",
    enterFrame: BEATS.heroEnter,
    position: {
      left: -30, top: "36%",
      translateZ: 170, rotateY: -5, rotateX: 2, rotateZ: -3,
      width: 340, opacity: 1, zIndex: 20,
    },
    isHero: true,
  },
];
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors in `notifications.ts` itself. Pre-existing errors in `HeroComposition.tsx` remain.

- [ ] **Step 3: Commit**

```bash
git add src/remotion/notifications.ts
git commit -m "remotion: add 8-notification data array for hero stack"
```

---

### Task 4: Create `IntegrationIcon.tsx`

**Files:**
- Create: `src/remotion/components/IntegrationIcon.tsx`

Renders the 42×42 (or 52×52 for hero) gradient tile with a 2-letter monogram for a given integration.

- [ ] **Step 1: Write `src/remotion/components/IntegrationIcon.tsx`**

```typescript
import styles from "../composition.module.css";
import type { Integration } from "../notifications";

const MONOGRAMS: Record<Integration, string> = {
  datadog: "DD",
  pagerduty: "PD",
  slack: "SL",
  jira: "JR",
  github: "GH",
  damasqas: "D",
};

const GRADIENT_CLASS: Record<Integration, string> = {
  datadog: styles.gradDatadog,
  pagerduty: styles.gradPagerduty,
  slack: styles.gradSlack,
  jira: styles.gradJira,
  github: styles.gradGithub,
  damasqas: styles.gradDamasqas,
};

export interface IntegrationIconProps {
  integration: Integration;
  isHero?: boolean;
}

export function IntegrationIcon({ integration, isHero = false }: IntegrationIconProps) {
  const sizeClass = isHero ? styles.iconHero : "";
  return (
    <div
      className={`${styles.icon} ${GRADIENT_CLASS[integration]} ${sizeClass}`}
      aria-hidden="true"
    >
      {MONOGRAMS[integration]}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors in `IntegrationIcon.tsx`. (Pre-existing errors remain.)

- [ ] **Step 3: Commit**

```bash
git add src/remotion/components/IntegrationIcon.tsx
git commit -m "remotion: add IntegrationIcon with gradient + monogram per source"
```

---

### Task 5: Create `NotificationCard.tsx`

**Files:**
- Create: `src/remotion/components/NotificationCard.tsx`

The single card component. Receives a `Notification` plus the current frame, computes its own pop-in scale/opacity and (for the hero) the green bloom on its box-shadow, renders itself positioned in 3D space.

- [ ] **Step 1: Write `src/remotion/components/NotificationCard.tsx`**

```typescript
import { interpolate, spring, useVideoConfig } from "remotion";
import { BEATS, COLORS, SPRING_CONFIG } from "../constants";
import type { Notification } from "../notifications";
import { IntegrationIcon } from "./IntegrationIcon";
import styles from "../composition.module.css";

export interface NotificationCardProps {
  notification: Notification;
  frame: number;
}

/** Compute scale + opacity for a card at a given frame. */
function useCardMotion(
  frame: number,
  enterFrame: number,
  targetOpacity: number,
  fps: number
) {
  const local = frame - enterFrame;

  // Scale: 0.5 → 1.0 via spring once entered
  const scale =
    local < 0
      ? 0.5
      : spring({
          frame: local,
          fps,
          config: SPRING_CONFIG,
          from: 0.5,
          to: 1,
        });

  // Opacity: linear ramp 0 → targetOpacity over 7 frames (~230ms)
  const entryOpacity =
    local < 0 ? 0 : Math.min(1, local / 7) * targetOpacity;

  // Global fade: all cards fade 1 → 0 over the last 15 frames
  const globalFade = interpolate(
    frame,
    [BEATS.globalFadeStart, BEATS.loopEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    scale,
    opacity: entryOpacity * globalFade,
  };
}

/** Hero-only: green bloom intensity 0→1→0.15 across its entry window. Pure function, not a hook. */
function heroBloom(frame: number): number {
  const t = frame - BEATS.heroEnter;
  return interpolate(
    t,
    [0, BEATS.heroBloomPeak - BEATS.heroEnter, BEATS.heroBloomRest - BEATS.heroEnter],
    [0, 1, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

/** Hero-only: scale multiplier 1.0 → 1.04 → 1.0 during bloom window. Overshoot is intentional for the hero only. */
function heroScaleBoost(frame: number): number {
  const t = frame - BEATS.heroEnter;
  return interpolate(
    t,
    [0, BEATS.heroBloomPeak - BEATS.heroEnter, BEATS.heroBloomRest - BEATS.heroEnter],
    [1, 1.04, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

export function NotificationCard({ notification, frame }: NotificationCardProps) {
  const { fps } = useVideoConfig();
  const { position, integration, title, body, time, enterFrame, isHero } = notification;

  const { scale, opacity } = useCardMotion(frame, enterFrame, position.opacity, fps);
  const effectiveScale = isHero ? scale * heroScaleBoost(frame) : scale;

  // Compose transform: translate to [left,top] anchor, then Z + rotations + scale.
  const transform = [
    `translate(0, -50%)`,
    `translateZ(${position.translateZ}px)`,
    `rotateY(${position.rotateY}deg)`,
    `rotateX(${position.rotateX}deg)`,
    `rotate(${position.rotateZ}deg)`,
    `scale(${effectiveScale})`,
  ].join(" ");

  // Base shadow scales with depth. Hero adds an animated green bloom.
  const depthShadow =
    position.translateZ >= 0
      ? `0 ${Math.round(20 + position.translateZ * 0.1)}px ${Math.round(40 + position.translateZ * 0.2)}px rgba(0,0,0,0.13)`
      : `0 ${Math.round(12 + Math.abs(position.translateZ) * 0.02)}px ${Math.round(24 + Math.abs(position.translateZ) * 0.05)}px rgba(0,0,0,0.08)`;

  let boxShadow = depthShadow;
  if (isHero) {
    const bloom = heroBloom(frame);
    const glowAlpha = 0.12 + bloom * 0.33; // 0.12 rest → 0.45 peak
    boxShadow = `
      0 1px 2px rgba(0,0,0,0.04),
      0 ${20 + bloom * 6}px ${40 + bloom * 12}px rgba(107, 138, 92, ${glowAlpha}),
      0 46px 80px rgba(0,0,0,0.16)
    `;
  }

  const filter = position.blur && position.blur > 0 ? `blur(${position.blur}px)` : undefined;

  const cardClass = isHero ? `${styles.card} ${styles.cardHero}` : styles.card;

  return (
    <div
      className={cardClass}
      style={{
        left: position.left,
        top: position.top,
        width: position.width,
        transform,
        opacity,
        boxShadow,
        filter,
        zIndex: position.zIndex,
      }}
    >
      <IntegrationIcon integration={integration} isHero={isHero} />
      <div className={styles.body}>
        <div className={styles.head}>
          <span className={styles.src}>{sourceLabel(integration)}</span>
          <span className={styles.time}>{time}</span>
        </div>
        <div className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
        {body && (
          <div className={styles.text} dangerouslySetInnerHTML={{ __html: body }} />
        )}
      </div>
    </div>
  );
}

function sourceLabel(integration: Notification["integration"]): string {
  switch (integration) {
    case "datadog": return "Datadog";
    case "pagerduty": return "PagerDuty";
    case "slack": return "Slack";
    case "jira": return "Jira";
    case "github": return "GitHub";
    case "damasqas": return "Damasqas";
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: `NotificationCard.tsx` itself is clean. Pre-existing errors in `HeroComposition.tsx` remain.

- [ ] **Step 3: Commit**

```bash
git add src/remotion/components/NotificationCard.tsx
git commit -m "remotion: add NotificationCard with pop-in motion + hero bloom"
```

---

## Phase 3 — Compose + wire

### Task 6: Rewrite `HeroComposition.tsx`

**Files:**
- Modify: `src/remotion/HeroComposition.tsx` (full replace)

Replace the imports and body with a simple mapping over `NOTIFICATIONS`.

- [ ] **Step 1: Overwrite `src/remotion/HeroComposition.tsx`**

```typescript
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NotificationCard } from "./components/NotificationCard";
import { NOTIFICATIONS } from "./notifications";

export function HeroComposition() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: "visible" }}>
      {NOTIFICATIONS.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          frame={frame}
        />
      ))}
    </AbsoluteFill>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean — **all previous errors resolve** because the old components are no longer imported. (The unused component files still exist on disk; they'll be deleted in Task 8.)

- [ ] **Step 3: Reload `/mockups/hero-preview` in the browser**

Expected: 8 notifications animate in over ~1.35s, hero "✓ Resolved in 42s" lands last with a green bloom, all hold for ~3s, then fade and loop restarts. If cards look misaligned, check the `top` and `left` values in `notifications.ts` against the spec.

- [ ] **Step 4: Commit**

```bash
git add src/remotion/HeroComposition.tsx
git commit -m "remotion: replace composition with notification stack map"
```

---

### Task 7: Update `HeroSection.module.css` aspect-ratio

**Files:**
- Modify: `src/app/_components/HeroSection.module.css`

The composition is now 1100×720 instead of 1100×660. Update the `.animationWrap` aspect-ratio so the stage fits the new logical size.

- [ ] **Step 1: Find the current aspect-ratio line**

Run: `grep -n "aspect-ratio" src/app/_components/HeroSection.module.css`
Expected: one line showing `aspect-ratio: 1100 / 660;`.

- [ ] **Step 2: Change the aspect-ratio**

Use the Edit tool to replace `aspect-ratio: 1100 / 660;` with `aspect-ratio: 1100 / 720;`.

- [ ] **Step 3: Reload `/`**

Visit `http://localhost:3000/`. Expected: hero renders with 8 notifications animating in, same as the preview but integrated into the real home page.

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/HeroSection.module.css
git commit -m "app: update hero aspect-ratio to match new 1100×720 composition"
```

---

## Phase 4 — Delete obsolete components

### Task 8: Delete old Remotion components

**Files:**
- Delete: `src/remotion/components/AgentOrb.tsx`
- Delete: `src/remotion/components/CommitBadge.tsx`
- Delete: `src/remotion/components/Connector.tsx`
- Delete: `src/remotion/components/EmojiReactions.tsx`
- Delete: `src/remotion/components/GraphCard.tsx`
- Delete: `src/remotion/components/LogTerminal.tsx`
- Delete: `src/remotion/components/PulseRing.tsx`
- Delete: `src/remotion/components/SlackCard.tsx`
- Delete: `src/remotion/components/TickerBadge.tsx`

- [ ] **Step 1: Delete all 9 files**

```bash
rm src/remotion/components/AgentOrb.tsx \
   src/remotion/components/CommitBadge.tsx \
   src/remotion/components/Connector.tsx \
   src/remotion/components/EmojiReactions.tsx \
   src/remotion/components/GraphCard.tsx \
   src/remotion/components/LogTerminal.tsx \
   src/remotion/components/PulseRing.tsx \
   src/remotion/components/SlackCard.tsx \
   src/remotion/components/TickerBadge.tsx
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean. (`HeroComposition.tsx` no longer imports any of these; `NotificationCard` + `IntegrationIcon` are the only components in `src/remotion/components/` now.)

- [ ] **Step 3: Verify components directory**

Run: `ls src/remotion/components/`
Expected: exactly two entries — `IntegrationIcon.tsx` and `NotificationCard.tsx`.

- [ ] **Step 4: Reload `/` and `/mockups/hero-preview`**

Expected: both pages still render the new notification stack. No regressions.

- [ ] **Step 5: Commit**

```bash
git add -A src/remotion/components/
git commit -m "remotion: delete obsolete components (SlackCard, LogTerminal, GraphCard, AgentOrb, CommitBadge, PulseRing, TickerBadge, EmojiReactions, Connector)"
```

---

## Phase 5 — Verify

### Task 9: Full typecheck, lint, build

**Files:** none (verification only)

- [ ] **Step 1: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean exit code 0.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: 0 errors. The pre-existing `no-page-custom-font` warning in `layout.tsx` is acceptable.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build completes; all routes listed (including `/` and `/mockups/hero-preview`); no build errors.

- [ ] **Step 4: If anything fails, fix inline and re-run**

Commit any fixes with clear messages:

```bash
git add <fixed-files>
git commit -m "fix: <specific fix description>"
```

---

### Task 10: Browser QA — `/mockups/hero-preview`

**Files:** none (manual)

- [ ] **Step 1: Open `http://localhost:3000/mockups/hero-preview`**

- [ ] **Step 2: Observe one full 5s loop**

Checklist:
1. Datadog card enters at ~frame 0
2. PagerDuty at ~frame 5, Slack ~9, Jira ~14, Damasqas (investigating) ~18, GitHub commit ~23, GitHub PR ~27
3. Hero Damasqas ✓ Resolved enters at ~frame 32 and lands front-and-center beside the nothing (preview page has no text column — that's fine)
4. Hero shows green bloom peak around frame 41, decays by ~57
5. All 8 cards hold visible from ~frame 60 to ~135
6. Global fade 135–150, loop restarts

- [ ] **Step 3: If any beat looks off, adjust `BEATS` in `constants.ts` or `enterFrame` values in `notifications.ts` and re-verify**

Commit any tuning with:

```bash
git add src/remotion/constants.ts src/remotion/notifications.ts
git commit -m "remotion: tune notification entry timings"
```

---

### Task 11: Browser QA — `/` (home page)

**Files:** none (manual)

- [ ] **Step 1: Open `http://localhost:3000/`**

- [ ] **Step 2: Confirm integration with home page**

Checklist:
1. Announce bar + nav render at top
2. Hero section below nav: left column has "Incidents resolved." / "Before you open your laptop." copy and CTAs; right column has the notification stack
3. Hero notification "✓ Resolved in 42s" anchors beside the text (not far-right)
4. All 8 notifications animate through their loop
5. Below the hero: the unchanged §01 Why / §02 Stack / §03 How / §04 Audience / CTA / footer render normally
6. No layout shifts, no scroll jank

- [ ] **Step 3: Test hover pause**

Hover over the notification stage. Animation should pause (via existing `HeroPlayer` hover handler). Move mouse off — resumes.

- [ ] **Step 4: Test click-to-restart**

Click the stage. Animation jumps back to frame 0.

- [ ] **Step 5: Test reduced motion**

In Chrome DevTools → Rendering → emulate `prefers-reduced-motion: reduce`. Reload. Expected: hero shows a static frame with all 8 notifications visible and settled (no cascade). Per spec, this frame is derived from `initialFrame=60` (past the hero bloom peak) on the Player.

**Note:** Current `HeroPlayer.tsx` uses `initialFrame={200}` which is beyond the new 150-frame duration. Update to `initialFrame={60}` in this task if reduced motion shows a blank.

- [ ] **Step 6: If `initialFrame` needs updating, edit `HeroPlayer.tsx`**

Find: `initialFrame={200}` in `src/app/_components/HeroPlayer.tsx`
Replace with: `initialFrame={60}`
Reload with reduced motion on → confirm static stack shows.

```bash
git add src/app/_components/HeroPlayer.tsx
git commit -m "app: update reduced-motion initialFrame for new 150-frame composition"
```

---

### Task 12: Close out

**Files:** none

- [ ] **Step 1: Final status check**

Run: `git status`
Expected: `clean` (all changes committed).

- [ ] **Step 2: Confirm recent commits**

Run: `git log --oneline -15`
Expected: the commits from Tasks 1–11, all present.

- [ ] **Step 3: Summarize for user**

Report:
- What changed (9 components deleted, 2 created + 1 data file; composition rewritten)
- Where the code lives
- How to tune (edit `notifications.ts` for content/position; edit `BEATS` in `constants.ts` for timing)
- Anything deferred (static mobile poster image remains the one followup)

---

## Followups (post-merge)

- Pre-render `public/hero-poster.png` via `npx remotion still` for mobile-first paint optimization.
- Consider adding real SVG logos (not monogram tiles) for integrations — faithful brand marks would look even better but require logo licensing consideration for each vendor.
- Hover on a specific card: could elevate that card to front temporarily (not in this spec).
- Phase 2 of the broader redesign (restyle §01–§04 sections on the new visual system) remains a separate spec.
