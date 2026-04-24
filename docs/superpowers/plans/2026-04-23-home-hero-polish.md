# Home Hero Polish & Promotion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the existing Remotion hero mockup at `src/app/mockups/unified-white/` to smooth, cinematic animation quality, then promote it to be the real home page at `/`.

**Architecture:** Preserve the existing single-page Remotion + Three.js mockup's visual direction. Decompose it into focused sub-components. Replace the ad-hoc CSS keyframe floats with a frame-accurate 16-beat Remotion timeline using spring physics. Add missing elements (pulse ring, ticker badge, emoji reactions, graph color morph, log type-in, yellow highlight sweep). Wire the resulting composition into `src/app/page.tsx` as the replacement for today's castle-video hero. Keep the old mockup page as `/mockups/hero-preview` for iteration.

**Tech Stack:** Next.js 16.2.4 (App Router), React 19.2.4, Remotion 4.0.451 (`@remotion/player`), Three.js 0.184.0, TypeScript, CSS Modules. No test framework is set up in this project — verification is TypeScript + ESLint + manual browser QA.

**Important Next.js 16 note:** This project's `AGENTS.md` warns that Next.js 16 has breaking changes from older versions. When touching `page.tsx`, `layout.tsx`, or client/server boundaries, consult `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` before editing.

**Verification model for every task:**
1. `npx tsc --noEmit` passes (no TS errors)
2. `npm run lint` passes
3. Dev server at `http://localhost:3000/mockups/hero-preview` (Phase 1-3) or `http://localhost:3000/` (Phase 4+) shows the expected visual state
4. Animation runs smoothly (no stutter, no layout shift)

Start the dev server once before Phase 1 and leave it running: `npm run dev` (if not already running from a prior session).

---

## Phase 0 — Orientation

### Task 0: Branch check and dev server running

**Files:** none (sanity check)

- [ ] **Step 1: Confirm branch is `landing-mockups-modern-animations`**

Run: `git branch --show-current`
Expected: `landing-mockups-modern-animations`

- [ ] **Step 2: Confirm dev server responds**

If dev server isn't running, start it with `npm run dev`.
Then run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/mockups/unified-white`
Expected: `200`

- [ ] **Step 3: Open the existing mockup in a browser tab**

Navigate to `http://localhost:3000/mockups/unified-white`. Confirm you see: big headline, eyebrow, orb (top-right), Slack cards, log terminal, mini chart, commit swap.

---

## Phase 1 — File structure and component extraction

The existing 344-line `UnifiedWhiteMockup.tsx` contains 4 sub-components and 1 page component. We extract each into its own file so the Remotion composition becomes maintainable. No animation changes in this phase — same visual output, cleaner structure.

### Task 1: Create constants file with all timing and color tokens

**Files:**
- Create: `src/remotion/constants.ts`

- [ ] **Step 1: Write the constants file**

```typescript
// Frame timing: the hero composition runs 8s at 30fps = 240 frames.
// All beat markers live here so timing changes in one place.
export const FPS = 30;
export const DURATION_FRAMES = 240;

// Beats — frame at which each element's entry animation begins.
export const BEATS = {
  alert: 0,
  alertPulse: 0,
  errorGraph: 18,
  investigating: 42,
  orb: 30,
  connector1: 48,
  logTerminal: 60,
  logLine1: 72,
  logLine2: 84,
  logLine3: 96,
  rootCause: 96,
  highlightSweep: 108,
  commitBadge: 114,
  connector2: 132,
  graphMorph: 150,
  resolved: 162,
  greenBloom: 180,
  emoji1: 180,
  emoji2: 186,
  emoji3: 192,
  tickerAlert: 0,
  tickerInvestigating: 54,
  tickerRootCause: 108,
  tickerRollingBack: 144,
  tickerResolved: 180,
  globalFadeOut: 216,
  loopEnd: 240,
} as const;

// Spring config: {stiffness: 120, damping: 18} = single damped approach, no overshoot.
// See Remotion docs: https://www.remotion.dev/docs/spring
export const SPRING_CONFIG = {
  damping: 18,
  stiffness: 120,
  mass: 1,
} as const;

// Colors — reuse globally, one source of truth.
export const COLORS = {
  canvas: "#FFFFFF",
  ink100: "#1A1814",
  ink80: "#3D3A32",
  ink60: "#7A7466",
  red: "#D14A3A",
  redDark: "#A8372A",
  green: "#6B8A5C",
  greenDark: "#4A7A3A",
  indigo: "#4A6B9C",
  indigoDark: "#2E4B73",
  warmHighlight: "#FFF4A3",
  logBg: "#0F1226",
} as const;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors related to `src/remotion/constants.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/remotion/constants.ts
git commit -m "remotion: add timing beats and color constants for hero composition"
```

---

### Task 2: Create shared CSS module for Remotion components

**Files:**
- Create: `src/remotion/composition.module.css`

We keep Remotion component styles in a dedicated CSS module. The existing 729-line `unified-white.module.css` mixes page-layout styles with composition-element styles — we split them. In this task we only create the new empty file; subsequent tasks copy in styles and update import paths.

- [ ] **Step 1: Create the empty module**

```css
/* Styles for components rendered inside <HeroComposition />.
   Page-layout and hero-shell styles live in src/app/_components/HeroSection.module.css.
   Element-scoped only: card shells, log terminal, graph, orb wrap, ticker, pulse, connector. */
```

- [ ] **Step 2: Commit**

```bash
git add src/remotion/composition.module.css
git commit -m "remotion: add empty composition style module"
```

---

### Task 3: Extract `SlackCard` component

**Files:**
- Create: `src/remotion/components/SlackCard.tsx`
- Modify: `src/remotion/composition.module.css`

The existing `SlackCard` in `UnifiedWhiteMockup.tsx:46-73` handles 2 logo variants and arbitrary children. Copy it out, typed, with a third `variant` prop so the card can render neutral, alert (red border-left), or ok (green border-left) without the call site specifying border CSS.

- [ ] **Step 1: Copy the card styles from `unified-white.module.css:225-299` into `composition.module.css`**

Copy classes: `.slackCard`, `.cardMeta`, `.alertIcon`, `.botIcon`, `.pill`, `.dots`. These styles exist at lines 225-299 of `src/app/mockups/unified-white/unified-white.module.css`. Paste them verbatim into `src/remotion/composition.module.css`.

**Important:** rename the `.slackCard p { ... }` and `.slackCard b { ... }` rules in your paste to `.slackCardBody { ... }` and `.slackCardBody b { ... }`. We're moving away from the `<p>` wrapper because message bodies will contain nested `<div>` elements (emoji reactions), which is invalid inside `<p>`.

- [ ] **Step 2: Add three variant classes at the end of `composition.module.css`**

```css
.slackCardAlert {
  border-left: 3px solid var(--sc-red, #d14a3a);
  padding-left: 19px;
}

.slackCardOk {
  border-left: 3px solid var(--sc-green, #6b8a5c);
  padding-left: 19px;
}

.slackCardNeutral {
  /* no border addition — default */
}
```

- [ ] **Step 3: Write `SlackCard.tsx`**

```typescript
import type { ReactNode } from "react";
import styles from "../composition.module.css";

export type SlackCardVariant = "alert" | "neutral" | "ok";
export type SlackCardLogo = "alert" | "damasqas";

export interface SlackCardProps {
  logo: SlackCardLogo;
  title: string;
  time: string;
  variant?: SlackCardVariant;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

const variantClass: Record<SlackCardVariant, string> = {
  alert: styles.slackCardAlert,
  neutral: styles.slackCardNeutral,
  ok: styles.slackCardOk,
};

export function SlackCard({
  logo,
  title,
  time,
  variant = "neutral",
  className = "",
  style,
  children,
}: SlackCardProps) {
  return (
    <div
      className={`${styles.slackCard} ${variantClass[variant]} ${className}`}
      style={style}
    >
      <div className={logo === "alert" ? styles.alertIcon : styles.botIcon}>
        {logo === "alert" ? "A" : "D"}
      </div>
      <div>
        <div className={styles.cardMeta}>
          <strong>{title}</strong>
          <span>{time}</span>
        </div>
        {/* div (not p) so nested divs like <EmojiReactions> produce valid HTML */}
        <div className={styles.slackCardBody}>{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/remotion/components/SlackCard.tsx src/remotion/composition.module.css
git commit -m "remotion: extract SlackCard component with alert/neutral/ok variants"
```

---

### Task 4: Extract `LogTerminal` component

**Files:**
- Create: `src/remotion/components/LogTerminal.tsx`
- Modify: `src/remotion/composition.module.css`

The existing log card at `UnifiedWhiteMockup.tsx:129-141` is inline markup. Extract it. This version still takes static content; log-typing animation comes in Phase 3.

- [ ] **Step 1: Copy log styles from `unified-white.module.css:355-428` into `composition.module.css`**

Copy classes: `.logCard`, `.windowDots`, `.logCard p`, `.logCard code`, `.logCard small`.

- [ ] **Step 2: Add a highlight class to `composition.module.css`**

```css
.logHighlight {
  display: block;
  padding: 2px 5px;
  margin: 3px -5px;
  border-radius: 3px;
  background: rgba(255, 230, 120, 0.1);
  color: #ffe8a0;
  transition: background 400ms ease;
}

.logHighlightSweep {
  background: rgba(255, 230, 120, 0.3);
  box-shadow: inset 0 0 30px rgba(255, 230, 120, 0.15);
}
```

- [ ] **Step 3: Write `LogTerminal.tsx`**

```typescript
import styles from "../composition.module.css";

export interface LogTerminalProps {
  className?: string;
  style?: React.CSSProperties;
  /** When true, the "TypeError" line is highlighted yellow. */
  highlightSweep?: boolean;
}

export function LogTerminal({
  className = "",
  style,
  highlightSweep = false,
}: LogTerminalProps) {
  return (
    <div className={`${styles.logCard} ${className}`} style={style}>
      <div className={styles.windowDots}>
        <span />
        <span />
        <span />
        <b>checkout.ts · log</b>
      </div>
      <p>
        <em>14:02:31</em> <strong>ERR</strong> POST /checkout
      </p>
      <code
        className={`${styles.logHighlight} ${
          highlightSweep ? styles.logHighlightSweep : ""
        }`}
      >
        TypeError: cart.items undefined
      </code>
      <small>at checkout.ts:142</small>
    </div>
  );
}
```

- [ ] **Step 4: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/components/LogTerminal.tsx src/remotion/composition.module.css
git commit -m "remotion: extract LogTerminal component with optional highlight sweep"
```

---

### Task 5: Extract `GraphCard` component with red→green morph

**Files:**
- Create: `src/remotion/components/GraphCard.tsx`
- Modify: `src/remotion/composition.module.css`

The existing `MiniChart` in `UnifiedWhiteMockup.tsx:18-44` uses raw `useCurrentFrame` and a `d`-attribute swap. Replace with a `GraphCard` that takes a `progress` prop (0-1). Progress < 0.5 = red error graph with peak. Progress ≥ 0.5 = green flat graph. Value changes from `0.47` to `0.04` at the morph threshold.

- [ ] **Step 1: Copy metric styles from `unified-white.module.css:430-476` into `composition.module.css`**

Copy classes: `.metricCard`, `.metricHeader`, `.chartGhost`, `.chartLine`.

- [ ] **Step 2: Write `GraphCard.tsx`**

```typescript
import styles from "../composition.module.css";

export interface GraphCardProps {
  /** 0-1. Below 0.5 = red error state. Above 0.5 = green resolved state. */
  progress: number;
  className?: string;
  style?: React.CSSProperties;
}

const RED_PATH = "M8 66 C50 54 82 72 118 52 S190 38 262 44";
const GREEN_PATH = "M8 66 C58 63 88 65 122 62 S196 61 262 61";

export function GraphCard({
  progress,
  className = "",
  style,
}: GraphCardProps) {
  const isResolved = progress > 0.5;
  const displayValue = isResolved ? "0.04" : "0.47";
  const strokeColor = isResolved ? "#6B8A5C" : "#D14A3A";

  return (
    <div className={`${styles.metricCard} ${className}`} style={style}>
      <div className={styles.metricHeader}>
        <span>checkout.err · rate</span>
        <b style={{ color: strokeColor }}>{displayValue}</b>
      </div>
      <svg viewBox="0 0 270 92" aria-hidden="true">
        <path
          className={styles.chartGhost}
          d={isResolved ? GREEN_PATH : RED_PATH}
          stroke={isResolved ? "rgba(110, 139, 96, 0.18)" : "rgba(209, 74, 58, 0.18)"}
        />
        <path
          className={styles.chartLine}
          d={isResolved ? GREEN_PATH : RED_PATH}
          stroke={strokeColor}
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/components/GraphCard.tsx src/remotion/composition.module.css
git commit -m "remotion: extract GraphCard with red→green morph based on progress prop"
```

---

### Task 6: Extract `AgentOrb` (Three.js) component

**Files:**
- Create: `src/remotion/components/AgentOrb.tsx`
- Modify: `src/remotion/composition.module.css`

Lift the Three.js orb from `UnifiedWhiteMockup.tsx:180-262` into its own component. Keep the implementation identical — it's already well-written.

- [ ] **Step 1: Copy orb styles from `unified-white.module.css:526-553` into `composition.module.css`**

Copy classes: `.orbWrap`, `.orbWrap canvas`, `.orbWrap span`.

- [ ] **Step 2: Write `AgentOrb.tsx`**

```typescript
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "../composition.module.css";

export function AgentOrb() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0x24478b,
        metalness: 0.28,
        roughness: 0.34,
      })
    );
    scene.add(orb);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.13, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0x7294ff,
        transparent: true,
        opacity: 0.16,
      })
    );
    scene.add(glow);

    scene.add(new THREE.AmbientLight(0xffffff, 2.1));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(-1.6, 2.2, 3);
    scene.add(key);
    const rim = new THREE.PointLight(0x8fb1ff, 18, 8);
    rim.position.set(2, -1, 2);
    scene.add(rim);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = performance.now() / 1000;
      orb.rotation.y = t * 0.58;
      orb.rotation.x = Math.sin(t * 0.8) * 0.12;
      glow.scale.setScalar(1 + Math.sin(t * 1.6) * 0.035);
      renderer.render(scene, camera);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      orb.geometry.dispose();
      glow.geometry.dispose();
      (orb.material as THREE.Material).dispose();
      (glow.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={styles.orbWrap} aria-hidden="true">
      <canvas ref={canvasRef} />
      <span>D</span>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/components/AgentOrb.tsx src/remotion/composition.module.css
git commit -m "remotion: extract AgentOrb Three.js component"
```

---

### Task 7: Create `PulseRing` component (new)

**Files:**
- Create: `src/remotion/components/PulseRing.tsx`
- Modify: `src/remotion/composition.module.css`

New element — a radiating red ring that appears under the alert card at frame 0 and expands outward, fading over 24 frames. Not present in the existing mockup.

- [ ] **Step 1: Add pulse-ring styles to `composition.module.css`**

```css
.pulseRing {
  position: absolute;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(209, 74, 58, 0.45), rgba(209, 74, 58, 0));
  pointer-events: none;
  transform-origin: center;
}
```

- [ ] **Step 2: Write `PulseRing.tsx`**

```typescript
import { interpolate } from "remotion";
import styles from "../composition.module.css";

export interface PulseRingProps {
  /** Current frame number from the composition. */
  frame: number;
  /** Frame at which the pulse begins. Completes over 24 frames. */
  startFrame: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PulseRing({
  frame,
  startFrame,
  className = "",
  style,
}: PulseRingProps) {
  const localFrame = frame - startFrame;
  const scale = interpolate(localFrame, [0, 24], [0.3, 3.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(localFrame, [0, 4, 24], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className={`${styles.pulseRing} ${className}`}
      style={{
        ...style,
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/components/PulseRing.tsx src/remotion/composition.module.css
git commit -m "remotion: add PulseRing component (radiates from alert card entry)"
```

---

### Task 8: Create `TickerBadge` component (new)

**Files:**
- Create: `src/remotion/components/TickerBadge.tsx`
- Modify: `src/remotion/composition.module.css`

A small rounded-black pill in the top-right of the composition. Its text crossfades through 5 states driven by frame number: `00:00 alert` → `00:12 investigating` → `00:28 root cause` → `00:35 rolling back` → `00:42 resolved`. The last state flips the dot color from amber to green.

- [ ] **Step 1: Add ticker styles to `composition.module.css`**

```css
.ticker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 14px;
  border-radius: 8px;
  background: #10100f;
  color: white;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 12px 28px rgba(26, 24, 20, 0.2);
}

.tickerDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b88a3f;
  box-shadow: 0 0 0 3px rgba(184, 138, 63, 0.3);
  transition: background 300ms ease, box-shadow 300ms ease;
}

.tickerDotResolved {
  background: #6b8a5c;
  box-shadow: 0 0 0 3px rgba(107, 138, 92, 0.4);
}

.tickerText {
  position: relative;
  width: 144px;
  height: 14px;
}

.tickerText span {
  position: absolute;
  inset: 0;
  white-space: nowrap;
  transition: opacity 260ms ease;
}

.tickerStateResolved {
  color: #8ac08a;
}
```

- [ ] **Step 2: Write `TickerBadge.tsx`**

```typescript
import { interpolate } from "remotion";
import { BEATS } from "../constants";
import styles from "../composition.module.css";

const STATES = [
  { beat: BEATS.tickerAlert, text: "00:00 · alert", resolved: false },
  { beat: BEATS.tickerInvestigating, text: "00:12 · investigating", resolved: false },
  { beat: BEATS.tickerRootCause, text: "00:28 · root cause", resolved: false },
  { beat: BEATS.tickerRollingBack, text: "00:35 · rolling back", resolved: false },
  { beat: BEATS.tickerResolved, text: "00:42 · resolved", resolved: true },
];

function stateOpacity(frame: number, beatStart: number, nextBeatStart: number) {
  const FADE_FRAMES = 8;
  return interpolate(
    frame,
    [beatStart, beatStart + FADE_FRAMES, nextBeatStart, nextBeatStart + FADE_FRAMES],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
}

export interface TickerBadgeProps {
  frame: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TickerBadge({
  frame,
  className = "",
  style,
}: TickerBadgeProps) {
  // Active state = the latest state whose beat has started.
  const activeIndex = STATES.reduce(
    (acc, state, i) => (frame >= state.beat ? i : acc),
    0
  );
  const activeState = STATES[activeIndex];

  return (
    <div className={`${styles.ticker} ${className}`} style={style}>
      <div
        className={`${styles.tickerDot} ${
          activeState.resolved ? styles.tickerDotResolved : ""
        }`}
      />
      <div className={styles.tickerText}>
        {STATES.map((state, i) => {
          const nextBeat = STATES[i + 1]?.beat ?? BEATS.loopEnd;
          const opacity = stateOpacity(frame, state.beat, nextBeat);
          return (
            <span
              key={state.text}
              className={state.resolved ? styles.tickerStateResolved : ""}
              style={{ opacity }}
            >
              {state.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/components/TickerBadge.tsx src/remotion/composition.module.css
git commit -m "remotion: add TickerBadge with 5-state text crossfade"
```

---

### Task 9: Extract `CommitBadge` component

**Files:**
- Create: `src/remotion/components/CommitBadge.tsx`
- Modify: `src/remotion/composition.module.css`

The existing commit swap at `UnifiedWhiteMockup.tsx:164-175` is a transformed div. Extract as a proper component with no animation logic (composition supplies transform).

- [ ] **Step 1: Copy commit styles from `unified-white.module.css:478-499` into `composition.module.css`**

Copy classes: `.commitSwap`, `.commitSwap span:first-child`, `.commitSwap span:nth-child(3)`, `.commitSwap i`.

- [ ] **Step 2: Write `CommitBadge.tsx`**

```typescript
import styles from "../composition.module.css";

export interface CommitBadgeProps {
  className?: string;
  style?: React.CSSProperties;
}

export function CommitBadge({ className = "", style }: CommitBadgeProps) {
  return (
    <div className={`${styles.commitSwap} ${className}`} style={style}>
      <span>3f82a</span>
      <b>→</b>
      <span>a91fe</span>
      <i>✓</i>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/components/CommitBadge.tsx src/remotion/composition.module.css
git commit -m "remotion: extract CommitBadge component"
```

---

### Task 10: Extract `Connector` (SVG path with stroke-dashoffset)

**Files:**
- Create: `src/remotion/components/Connector.tsx`
- Modify: `src/remotion/composition.module.css`

The three connector paths in `UnifiedWhiteMockup.tsx:85-107` use inline interpolate(). Extract a reusable component that takes the path `d`, the length, and a `progress` prop (0-1) for draw-in.

- [ ] **Step 1: Copy connector SVG style from `unified-white.module.css:213-223` into `composition.module.css`**

Copy class: `.connectorLines`.

- [ ] **Step 2: Write `Connector.tsx`**

```typescript
import styles from "../composition.module.css";

export interface ConnectorProps {
  /** SVG path `d` string. */
  d: string;
  /** Full dash length for this path (used to interpolate stroke-dashoffset). */
  length: number;
  /** 0-1 draw-in progress. */
  progress: number;
}

export function Connector({ d, length, progress }: ConnectorProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const dashoffset = length * (1 - clamped);
  return (
    <path
      d={d}
      style={{
        strokeDasharray: `${length}`,
        strokeDashoffset: dashoffset,
      }}
    />
  );
}

export function ConnectorSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg className={styles.connectorLines} viewBox="0 0 980 660" aria-hidden="true">
      {children}
    </svg>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/components/Connector.tsx src/remotion/composition.module.css
git commit -m "remotion: extract Connector component for dash-offset line draw"
```

---

### Task 11: Create `EmojiReactions` component (new)

**Files:**
- Create: `src/remotion/components/EmojiReactions.tsx`
- Modify: `src/remotion/composition.module.css`

Row of three emoji reaction chips (🙏 7, ✅ 4, 😴 2) that pop in sequence at BEATS.emoji1, emoji2, emoji3. Each pops with spring overshoot.

- [ ] **Step 1: Add styles to `composition.module.css`**

```css
.reactions {
  display: inline-flex;
  gap: 6px;
  margin-top: 10px;
}

.reaction {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 12px;
  background: #f2efe6;
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 12px;
}

.reactionCount {
  color: #3d3a32;
  font-weight: 700;
  font-size: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

- [ ] **Step 2: Write `EmojiReactions.tsx`**

```typescript
import { spring, useVideoConfig } from "remotion";
import { SPRING_CONFIG } from "../constants";
import styles from "../composition.module.css";

interface Reaction {
  emoji: string;
  count: number;
  startFrame: number;
}

export interface EmojiReactionsProps {
  frame: number;
  reactions: Reaction[];
}

export function EmojiReactions({ frame, reactions }: EmojiReactionsProps) {
  const { fps } = useVideoConfig();

  return (
    <div className={styles.reactions}>
      {reactions.map((r) => {
        // Spring from 0 to 1 once start frame reached.
        const local = frame - r.startFrame;
        // Use the shared SPRING_CONFIG (damping 18) — no overshoot, clean approach.
        const scale = local < 0
          ? 0
          : spring({
              frame: local,
              fps,
              config: SPRING_CONFIG,
              from: 0,
              to: 1,
            });
        const opacity = local < 0 ? 0 : Math.min(1, scale);
        return (
          <span
            key={r.emoji}
            className={styles.reaction}
            style={{
              transform: `scale(${scale})`,
              opacity,
              transformOrigin: "center",
            }}
          >
            {r.emoji}
            <span className={styles.reactionCount}>{r.count}</span>
          </span>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/components/EmojiReactions.tsx src/remotion/composition.module.css
git commit -m "remotion: add EmojiReactions component with per-item spring pop"
```

---

## Phase 2 — HeroComposition with 16-beat choreography

This phase wires everything together into the final composition. Each task adds one layer of beats.

### Task 12: Create `HeroComposition.tsx` shell with all elements statically placed

**Files:**
- Create: `src/remotion/HeroComposition.tsx`

Place every sub-component in its final screen position, fully visible, no animation. This is the visual regression target for Phase 2 — when all beats are wired, the final frame (f=200) should look identical to what this task renders.

- [ ] **Step 1: Write the composition shell**

```typescript
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AgentOrb } from "./components/AgentOrb";
import { CommitBadge } from "./components/CommitBadge";
import { ConnectorSvg, Connector } from "./components/Connector";
import { EmojiReactions } from "./components/EmojiReactions";
import { GraphCard } from "./components/GraphCard";
import { LogTerminal } from "./components/LogTerminal";
import { PulseRing } from "./components/PulseRing";
import { SlackCard } from "./components/SlackCard";
import { TickerBadge } from "./components/TickerBadge";
import { BEATS } from "./constants";
import styles from "./composition.module.css";

export function HeroComposition() {
  const frame = useCurrentFrame();

  // Phase 2: these stay at 1 for every frame so we can validate placement.
  // Each subsequent task replaces the 1 with an interpolate() expression.
  const STATIC_VISIBLE = 1;

  return (
    <AbsoluteFill style={{ overflow: "visible" }}>
      {/* Ticker top-right */}
      <div style={{ position: "absolute", top: 28, right: 32, zIndex: 10 }}>
        <TickerBadge frame={frame} />
      </div>

      {/* Connectors */}
      <ConnectorSvg>
        <Connector
          d="M438 162 C526 205 558 256 638 310"
          length={240}
          progress={STATIC_VISIBLE}
        />
        <Connector
          d="M620 314 C710 365 756 440 800 530"
          length={260}
          progress={STATIC_VISIBLE}
        />
        <Connector
          d="M452 344 C560 330 638 390 726 460"
          length={270}
          progress={STATIC_VISIBLE}
        />
      </ConnectorSvg>

      {/* Pulse ring under alert card */}
      <PulseRing
        frame={frame}
        startFrame={BEATS.alertPulse}
        style={{ position: "absolute", top: 92, left: 180 }}
      />

      {/* Alert card */}
      <SlackCard
        logo="alert"
        title="AlertManager"
        time="14:02"
        variant="alert"
        style={{
          position: "absolute",
          top: 70,
          left: 155,
          width: 470,
          opacity: STATIC_VISIBLE,
          transform: `translateY(0px) rotate(-2deg)`,
        }}
      >
        <span className={styles.pill}>P1</span> checkout · 5xx error rate{" "}
        <b>47%</b>
      </SlackCard>

      {/* Investigating card */}
      <SlackCard
        logo="damasqas"
        title="damasqas"
        time="14:02"
        style={{
          position: "absolute",
          top: 225,
          left: 365,
          width: 520,
          opacity: STATIC_VISIBLE,
        }}
      >
        Investigating. Correlating deploys
      </SlackCard>

      {/* Log terminal */}
      <LogTerminal
        highlightSweep={STATIC_VISIBLE > 0}
        style={{
          position: "absolute",
          top: 356,
          left: 170,
          width: 356,
          opacity: STATIC_VISIBLE,
        }}
      />

      {/* Root cause card */}
      <SlackCard
        logo="damasqas"
        title="damasqas"
        time="14:03"
        style={{
          position: "absolute",
          top: 360,
          left: 530,
          width: 530,
          opacity: STATIC_VISIBLE,
        }}
      >
        Root cause: commit <mark>3f82a</mark> — checkout 500 on empty cart.
      </SlackCard>

      {/* Graph card */}
      <GraphCard
        progress={STATIC_VISIBLE}
        style={{
          position: "absolute",
          right: 68,
          top: 250,
          width: 274,
          opacity: STATIC_VISIBLE,
        }}
      />

      {/* Resolved card */}
      <SlackCard
        logo="damasqas"
        title="damasqas"
        time="14:03"
        variant="ok"
        style={{
          position: "absolute",
          top: 492,
          left: 470,
          width: 560,
          opacity: STATIC_VISIBLE,
        }}
      >
        Rolled back. Error rate <mark>0.4%</mark>. Resolved in 42s.
        <EmojiReactions
          frame={frame}
          reactions={[
            { emoji: "🙏", count: 7, startFrame: BEATS.emoji1 },
            { emoji: "✅", count: 4, startFrame: BEATS.emoji2 },
            { emoji: "😴", count: 2, startFrame: BEATS.emoji3 },
          ]}
        />
      </SlackCard>

      {/* Commit badge */}
      <CommitBadge
        style={{
          position: "absolute",
          right: 78,
          bottom: 50,
          opacity: STATIC_VISIBLE,
        }}
      />

      {/* Agent orb (decorative, Three.js) */}
      <div style={{ position: "absolute", right: -16, top: 82, width: 154, height: 154 }}>
        <AgentOrb />
      </div>
    </AbsoluteFill>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/HeroComposition.tsx
git commit -m "remotion: add HeroComposition shell with all elements statically placed"
```

---

### Task 13: Create a dev preview page that renders HeroComposition via Player

**Files:**
- Create: `src/app/mockups/hero-preview/page.tsx`
- Create: `src/app/mockups/hero-preview/HeroPreviewClient.tsx`

We need a way to see the composition during development. Create a dedicated preview page at `/mockups/hero-preview` separate from the old mockup (which stays untouched until Phase 4).

- [ ] **Step 1: Write the client wrapper**

```typescript
// src/app/mockups/hero-preview/HeroPreviewClient.tsx
"use client";

import { Player } from "@remotion/player";
import { HeroComposition } from "@/remotion/HeroComposition";
import { DURATION_FRAMES, FPS } from "@/remotion/constants";

export function HeroPreviewClient() {
  return (
    <div style={{ maxWidth: 1180, margin: "48px auto", padding: 24 }}>
      <h1 style={{ fontFamily: "system-ui", fontSize: 18, marginBottom: 16 }}>
        Hero composition preview
      </h1>
      <div
        style={{
          width: 980,
          height: 660,
          margin: "0 auto",
          border: "1px solid #eee",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Player
          component={HeroComposition}
          durationInFrames={DURATION_FRAMES}
          fps={FPS}
          compositionHeight={660}
          compositionWidth={980}
          autoPlay
          loop
          controls={false}
          acknowledgeRemotionLicense
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the page**

```typescript
// src/app/mockups/hero-preview/page.tsx
import { HeroPreviewClient } from "./HeroPreviewClient";

export const metadata = {
  title: "Hero preview",
};

export default function HeroPreviewPage() {
  return <HeroPreviewClient />;
}
```

- [ ] **Step 3: Verify `@/` alias**

Check `tsconfig.json` includes:

```bash
grep -A2 '"paths"' tsconfig.json
```

Expected output includes `"@/*": ["./src/*"]`. If it doesn't, use relative imports in `HeroPreviewClient.tsx` instead (`../../../remotion/HeroComposition`).

- [ ] **Step 4: Open the preview**

Visit `http://localhost:3000/mockups/hero-preview`. Expected: the same composition layout as `/mockups/unified-white` but without per-element floating animation — all cards are static, the ticker shows "00:42 · resolved" (because frame cycles through all 5 states), connectors are fully drawn, etc. The Three.js orb rotates.

- [ ] **Step 5: Commit**

```bash
git add src/app/mockups/hero-preview/
git commit -m "app: add /mockups/hero-preview page rendering HeroComposition via Player"
```

---

### Task 14: Add card entry animations (beats 1-4)

**Files:**
- Modify: `src/remotion/HeroComposition.tsx`

Replace `STATIC_VISIBLE` for each of the 4 Slack cards with spring-driven opacity + transform. Cards animate in at their beat, hold through f=216, then fade out over f=216-240.

- [ ] **Step 1: Update HeroComposition.tsx**

Add an import for `spring` and `useVideoConfig` at the top:

```typescript
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, SPRING_CONFIG } from "./constants";
```

Add a helper function above the component:

```typescript
function useEntry(frame: number, startFrame: number, fps: number) {
  // Returns { opacity, translateY } animating from hidden → visible at startFrame.
  // Holds. Then fades out after BEATS.globalFadeOut.
  const local = frame - startFrame;
  const entered = local < 0
    ? 0
    : spring({ frame: local, fps, config: SPRING_CONFIG, from: 0, to: 1 });
  const fadeOut = interpolate(
    frame,
    [BEATS.globalFadeOut, BEATS.loopEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = entered * fadeOut;
  const translateY = (1 - entered) * 20;
  return { opacity, translateY };
}
```

Then replace each card's static `opacity: STATIC_VISIBLE` and `transform: "translateY(0px) rotate(-2deg)"` with:

For the alert card (rotation -2deg on entry):
```typescript
const alertEntry = useEntry(frame, BEATS.alert, fps);
// ...
style={{
  position: "absolute",
  top: 70,
  left: 155,
  width: 470,
  opacity: alertEntry.opacity,
  transform: `translateY(${alertEntry.translateY}px) rotate(-2deg)`,
}}
```

For the investigating card:
```typescript
const investigatingEntry = useEntry(frame, BEATS.investigating, fps);
// ... style uses translateY and opacity from investigatingEntry
```

Same pattern for the root-cause card (`BEATS.rootCause`) and resolved card (`BEATS.resolved`).

Add `const { fps } = useVideoConfig();` at the top of the component.

Remove the `STATIC_VISIBLE` constant (it's unused after this task's edits for cards; other elements still use it briefly).

- [ ] **Step 2: Reload browser at `/mockups/hero-preview`**

Expected: each card now pops in at its beat — alert at 0s, investigating at 1.4s, root cause at 3.2s, resolved at 5.4s. All cards hold visible. At ~7.2s all fade out together. Loop restarts. Smooth springs, no overshoot.

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/HeroComposition.tsx
git commit -m "remotion: add spring-driven entry + global fade-out for 4 Slack cards"
```

---

### Task 15: Animate log terminal entry + per-line type-in + highlight sweep

**Files:**
- Modify: `src/remotion/HeroComposition.tsx`
- Modify: `src/remotion/components/LogTerminal.tsx`
- Modify: `src/remotion/composition.module.css`

LogTerminal currently takes a static `highlightSweep` boolean. Upgrade: each of the 3 log lines reveals via width (0 → 100%) starting at its own beat. The highlight sweep becomes a frame-driven scale on the bug line that "washes" in over 24 frames, holds, and fades.

- [ ] **Step 1: Update `LogTerminal.tsx` to accept frame-aware props**

```typescript
import { interpolate } from "remotion";
import { BEATS } from "../constants";
import styles from "../composition.module.css";

export interface LogTerminalProps {
  frame: number;
  className?: string;
  style?: React.CSSProperties;
}

function typingWidth(frame: number, startBeat: number): string {
  const TYPE_DURATION = 18;
  const progress = interpolate(
    frame,
    [startBeat, startBeat + TYPE_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return `${progress * 100}%`;
}

export function LogTerminal({ frame, className = "", style }: LogTerminalProps) {
  const line1Width = typingWidth(frame, BEATS.logLine1);
  const line2Width = typingWidth(frame, BEATS.logLine2);
  const line3Width = typingWidth(frame, BEATS.logLine3);

  // Highlight sweep intensifies between BEATS.highlightSweep and +24, holds, fades by globalFadeOut.
  const sweepIn = interpolate(
    frame,
    [BEATS.highlightSweep, BEATS.highlightSweep + 24],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const sweepFade = interpolate(
    frame,
    [BEATS.globalFadeOut, BEATS.loopEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const sweepIntensity = sweepIn * sweepFade;

  return (
    <div className={`${styles.logCard} ${className}`} style={style}>
      <div className={styles.windowDots}>
        <span />
        <span />
        <span />
        <b>checkout.ts · log</b>
      </div>
      <p style={{ width: line1Width, overflow: "hidden", whiteSpace: "nowrap" }}>
        <em>14:02:31</em> <strong>ERR</strong> POST /checkout
      </p>
      <code
        className={styles.logHighlight}
        style={{
          width: line2Width,
          display: "block",
          overflow: "hidden",
          whiteSpace: "nowrap",
          background: `rgba(255, 230, 120, ${0.1 + sweepIntensity * 0.22})`,
          boxShadow: `inset 0 0 ${30 * sweepIntensity}px rgba(255, 230, 120, ${0.18 * sweepIntensity})`,
        }}
      >
        TypeError: cart.items undefined
      </code>
      <small style={{ width: line3Width, overflow: "hidden", whiteSpace: "nowrap" }}>
        at checkout.ts:142
      </small>
    </div>
  );
}
```

- [ ] **Step 2: Update `HeroComposition.tsx` to pass frame + use entry spring for log card as a whole**

Add entry animation for the log card container:

```typescript
const logEntry = useEntry(frame, BEATS.logTerminal, fps);
// ...
<LogTerminal
  frame={frame}
  style={{
    position: "absolute",
    top: 356,
    left: 170,
    width: 356,
    opacity: logEntry.opacity,
    transform: `translateY(${logEntry.translateY}px)`,
  }}
/>
```

Remove the `highlightSweep` prop usage from this call site.

- [ ] **Step 3: Reload browser**

Expected: at f=60 the log card pops in. Lines type in one after another (f=72, 84, 96). At f=108 the yellow highlight begins to bloom on the bug line, reaches full intensity by f=132, holds until the global fade-out at f=216.

- [ ] **Step 4: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/HeroComposition.tsx src/remotion/components/LogTerminal.tsx src/remotion/composition.module.css
git commit -m "remotion: animate log terminal entry, per-line type-in, and highlight sweep"
```

---

### Task 16: Animate graph entry + red→green morph at frame 150

**Files:**
- Modify: `src/remotion/HeroComposition.tsx`

Wire the graph card's entry using the helper and drive its `progress` prop from the frame:

- [ ] **Step 1: Update graph call site in HeroComposition.tsx**

```typescript
const graphEntry = useEntry(frame, BEATS.errorGraph, fps);
const graphProgress = interpolate(
  frame,
  [BEATS.graphMorph, BEATS.graphMorph + 24],
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
// ...
<GraphCard
  progress={graphProgress}
  style={{
    position: "absolute",
    right: 68,
    top: 250,
    width: 274,
    opacity: graphEntry.opacity,
    transform: `translateY(${graphEntry.translateY}px) rotate(1.5deg)`,
  }}
/>
```

Note: `GraphCard`'s internal logic already switches from red to green when `progress > 0.5`. The interpolation above crosses 0.5 at f=162, just before the resolved card enters at BEATS.resolved (162) — they land together.

- [ ] **Step 2: Reload browser**

Expected: graph appears at f=18 in red state with "0.47" value. At f=150 the color/path/value begin to morph. By f=174 the graph is fully green showing "0.04". Holds until global fade.

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/HeroComposition.tsx
git commit -m "remotion: animate graph entry and red→green morph at BEATS.graphMorph"
```

---

### Task 17: Animate commit badge entry and idle drift

**Files:**
- Modify: `src/remotion/HeroComposition.tsx`

The commit badge enters at BEATS.commitBadge (114), and holds with a gentle sine drift.

- [ ] **Step 1: Update commit call site in HeroComposition.tsx**

```typescript
const commitEntry = useEntry(frame, BEATS.commitBadge, fps);
const commitDriftY = Math.sin((frame - BEATS.commitBadge) / 30) * 4;
// ...
<CommitBadge
  style={{
    position: "absolute",
    right: 78,
    bottom: 50,
    opacity: commitEntry.opacity,
    transform: `translateY(${commitEntry.translateY + commitDriftY}px) rotate(4deg)`,
  }}
/>
```

- [ ] **Step 2: Reload browser**

Expected: at f=114 the commit badge pops in with spring, then drifts subtly up-and-down in an idle sine loop. Fades at global fade-out.

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/HeroComposition.tsx
git commit -m "remotion: animate commit badge entry with idle drift"
```

---

### Task 18: Animate connector lines (progress 0→1)

**Files:**
- Modify: `src/remotion/HeroComposition.tsx`

Each connector draws in over 18 frames starting at its beat.

- [ ] **Step 1: Update connector call sites in HeroComposition.tsx**

```typescript
const connector1Progress = interpolate(
  frame,
  [BEATS.connector1, BEATS.connector1 + 18],
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
const connector2Progress = interpolate(
  frame,
  [BEATS.connector2, BEATS.connector2 + 18],
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
const connector3Progress = interpolate(
  frame,
  [BEATS.commitBadge, BEATS.commitBadge + 20],
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
const connectorsFade = interpolate(
  frame,
  [BEATS.globalFadeOut, BEATS.loopEnd],
  [1, 0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
// ...
<ConnectorSvg>
  <Connector
    d="M438 162 C526 205 558 256 638 310"
    length={240}
    progress={connector1Progress * connectorsFade}
  />
  <Connector
    d="M620 314 C710 365 756 440 800 530"
    length={260}
    progress={connector2Progress * connectorsFade}
  />
  <Connector
    d="M452 344 C560 330 638 390 726 460"
    length={270}
    progress={connector3Progress * connectorsFade}
  />
</ConnectorSvg>
```

- [ ] **Step 2: Reload browser**

Expected: connector 1 draws at f=48-66. Connector 2 at f=132-150. Connector 3 at f=114-134. All fade out at global fade-out.

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/HeroComposition.tsx
git commit -m "remotion: draw connector lines progressively via stroke-dashoffset"
```

---

### Task 19: Animate the green bloom on resolved card

**Files:**
- Modify: `src/remotion/HeroComposition.tsx`

When the resolved card enters at f=162, it holds briefly. At f=180 (BEATS.greenBloom) a soft green glow blooms on its box-shadow, decaying by f=204.

- [ ] **Step 1: Update resolved card call site**

```typescript
const resolvedEntry = useEntry(frame, BEATS.resolved, fps);
const greenBloom = interpolate(
  frame,
  [BEATS.greenBloom, BEATS.greenBloom + 12, BEATS.greenBloom + 24],
  [0, 1, 0.3],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
// ...
<SlackCard
  logo="damasqas"
  title="damasqas"
  time="14:03"
  variant="ok"
  style={{
    position: "absolute",
    top: 492,
    left: 470,
    width: 560,
    opacity: resolvedEntry.opacity,
    transform: `translateY(${resolvedEntry.translateY}px)`,
    boxShadow: `0 20px 70px rgba(28, 28, 24, 0.1), 0 ${16 * greenBloom}px ${40 * greenBloom}px rgba(107, 138, 92, ${0.3 * greenBloom}), 0 0 ${30 * greenBloom}px rgba(107, 138, 92, ${0.2 * greenBloom})`,
  }}
>
  Rolled back. Error rate <mark>0.4%</mark>. Resolved in 42s.
  <EmojiReactions
    frame={frame}
    reactions={[
      { emoji: "🙏", count: 7, startFrame: BEATS.emoji1 },
      { emoji: "✅", count: 4, startFrame: BEATS.emoji2 },
      { emoji: "😴", count: 2, startFrame: BEATS.emoji3 },
    ]}
  />
</SlackCard>
```

Note: the `SlackCard` component already passes `style` through, so adding `boxShadow` into the style object works. If `SlackCard` previously had its own `box-shadow` in CSS that could override, explicitly use `boxShadow` (camelCase inline style) which takes precedence.

- [ ] **Step 2: Reload browser**

Expected: at f=180 the resolved card develops a soft green halo that blooms and then settles back to a subtle green presence by f=186. Emoji reactions pop in as scheduled (f=180, 186, 192).

- [ ] **Step 3: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/remotion/HeroComposition.tsx
git commit -m "remotion: add green bloom on resolved card at BEATS.greenBloom"
```

---

### Task 20: QA pass on `/mockups/hero-preview`

**Files:** none (manual verification)

- [ ] **Step 1: Observe a full 8-second loop**

Open `/mockups/hero-preview`, watch for 10 seconds. Verify:
1. Pulse ring radiates at f=0
2. Alert card slams in at f=0
3. Error graph appears at f=18 (in red)
4. Investigating card slides in at f=42
5. Orb is always visible with its own rotation
6. Connector 1 draws at f=48-66
7. Log terminal appears at f=60
8. Log line 1 types at f=72, line 2 at f=84, line 3 at f=96
9. Root cause card appears at f=96
10. Yellow highlight sweep on bug line at f=108-132
11. Commit badge appears at f=114 with idle drift
12. Connector 3 draws at f=114-134
13. Connector 2 draws at f=132-150
14. Graph morphs red → green at f=150-174
15. Resolved card swoops in at f=162
16. Green bloom at f=180-204
17. Emoji reactions pop at f=180/186/192
18. Global fade-out f=216-240
19. Loop restarts cleanly at f=240

- [ ] **Step 2: If any beat feels off, adjust `BEATS` in `src/remotion/constants.ts` and re-observe**

Common fixes:
- Beat feels too late → decrease its frame number
- Entry spring overshoots → verify SPRING_CONFIG.damping is 18 (not lower)
- Layout collision → adjust position in HeroComposition.tsx

- [ ] **Step 3: Commit any timing adjustments**

```bash
git add src/remotion/constants.ts src/remotion/HeroComposition.tsx
git commit -m "remotion: tune beat timings after visual QA"
```

---

## Phase 3 — Promote to home page

### Task 21: Create `HeroSection` server component with left copy + composition stage

**Files:**
- Create: `src/app/_components/HeroSection.tsx`
- Create: `src/app/_components/HeroSection.module.css`
- Create: `src/app/_components/HeroPlayer.tsx`

HeroSection is the top-level server component wrapping left-side copy + the Player. HeroPlayer is the client component that actually imports `@remotion/player`.

- [ ] **Step 1: Write `HeroSection.module.css` — adapt page-layout styles from unified-white.module.css**

Copy these styles from `src/app/mockups/unified-white/unified-white.module.css` but rename:
- `.page` → remove (don't need, we use global page bg)
- `.heroShell` → `.heroShell`
- `.heroCopy` → `.heroCopy`
- `.eyebrow` → `.eyebrow`
- `.heroCopy h1`, `h1 strong`, `h1 em`, `p`, `b` → keep same selectors (scoped by module)
- `.heroActions` → `.heroActions`
- `.primaryCta` / `.secondaryCta` → same
- `.animationWrap` → `.animationWrap`
- Media queries (`max-width: 1260px`, `820px`) → keep with same selectors

Omit:
- `.topBar` (was the preview chrome)
- `.blackStatus` (was decorative, now redundant with TickerBadge)
- `.explainer` and `.beats` (were the preview-only footer strip)

Paste the resulting CSS into `HeroSection.module.css`.

- [ ] **Step 2: Write `HeroPlayer.tsx`**

```typescript
"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { HeroComposition } from "@/remotion/HeroComposition";
import { DURATION_FRAMES, FPS } from "@/remotion/constants";

export function HeroPlayer() {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  // Pause player when off-screen; resume when visible.
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;
    const el = containerRef.current;
    const player = playerRef.current;
    if (!player) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (visible) player.play();
        else player.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  // If reduced-motion, show only the final resolved frame (static).
  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        aria-label="Damasqas resolves a production incident in 42 seconds: alert fires, agent investigates, finds the bad commit, rolls it back."
        role="img"
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        <Player
          component={HeroComposition}
          durationInFrames={DURATION_FRAMES}
          fps={FPS}
          compositionHeight={660}
          compositionWidth={980}
          autoPlay={false}
          loop={false}
          controls={false}
          acknowledgeRemotionLicense
          initialFrame={200}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => playerRef.current?.pause()}
      onMouseLeave={() => playerRef.current?.play()}
      onClick={() => {
        playerRef.current?.seekTo(0);
        playerRef.current?.play();
      }}
      aria-label="Animation showing Damasqas resolving a production incident in 42 seconds: a P1 alert fires, the agent investigates, identifies a bad commit, rolls it back, and posts a resolved message to Slack."
      role="img"
      style={{ width: "100%", height: "100%", position: "relative", cursor: "pointer" }}
    >
      <Player
        ref={playerRef}
        component={HeroComposition}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        compositionHeight={660}
        compositionWidth={980}
        autoPlay
        loop
        controls={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Write `HeroSection.tsx`**

```typescript
import { HeroPlayer } from "./HeroPlayer";
import styles from "./HeroSection.module.css";

const demoUrl = "https://cal.com/shalin-patel-eq2u1j/30min";

export function HeroSection() {
  return (
    <section className={styles.heroShell}>
      <div className={styles.heroCopy}>
        <div className={styles.eyebrow}>
          <span />
          AI SRE · Built for Slack
        </div>
        <h1>
          <strong>Incidents resolved.</strong>
          <em>Before you open your laptop.</em>
        </h1>
        <p>
          Damasqas is an AI agent built exclusively for site reliability. It
          connects to your monitoring, logs, and deployments, then{" "}
          <b>
            triages alerts, investigates incidents, and remediates autonomously.
          </b>
        </p>
        <div className={styles.heroActions}>
          <a className={styles.primaryCta} href={demoUrl}>
            Request a demo
          </a>
          <a className={styles.secondaryCta} href="#how">
            See how it works →
          </a>
        </div>
      </div>

      <div className={styles.animationWrap}>
        <HeroPlayer />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/app/_components/
git commit -m "app: add HeroSection + HeroPlayer with reduced-motion and off-screen pause"
```

---

### Task 22: Replace current hero in `home.body.html`

**Files:**
- Modify: `src/app/home.body.html`

The current home.body.html (starting at line 21) contains a `<section class="hero">` with the castle-video. Strip that `<section>` so the current `page.tsx` + HeroSection can inject the new hero. Everything else (announce bar, nav, §01 Why, §02 Stack, etc.) stays untouched.

- [ ] **Step 1: Read the current hero section bounds**

Run: `grep -n 'section class="hero"\|<section class="section"' src/app/home.body.html | head -5`
Expected: first hit is `<section class="hero">`, second hit is the Why section.

- [ ] **Step 2: Remove the entire `<section class="hero">…</section>` block**

Open `src/app/home.body.html`. Find the line `<section class="hero">` (around line 24) and delete everything from that line through the matching `</section>` (around line 44, just before the `<!-- ====  §01 WHY DAMASQAS ==== -->` comment). Leave the `<main id="main">` open tag intact — it stays right above the §01 Why section.

- [ ] **Step 3: Reload `/` to confirm no hero renders before our injection**

Visit `http://localhost:3000/`. Expected: page starts with the announce bar and nav, then jumps directly to §01 Why Damasqas (no hero section). Slightly broken-looking, which is expected — next task adds our React hero above.

- [ ] **Step 4: Commit**

```bash
git add src/app/home.body.html
git commit -m "app: remove castle-video hero section from home.body.html"
```

---

### Task 23: Wire `HeroSection` into `page.tsx`

**Files:**
- Modify: `src/app/page.tsx`

The current `page.tsx` reads home.body.html + home.script.js and renders them via `dangerouslySetInnerHTML`. Keep that. Add a `<HeroSection />` above the injected HTML.

- [ ] **Step 1: Consult the Next.js 16 docs on mixing server and client components**

Read: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — skim only. Confirm the project uses App Router and mixing server `page.tsx` with client component imports is straightforward.

- [ ] **Step 2: Update `page.tsx`**

```typescript
import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
import { HeroSection } from "./_components/HeroSection";

export default function HomePage() {
  const bodyHtml = fs.readFileSync(
    path.join(process.cwd(), "src/app/home.body.html"),
    "utf8"
  );
  const inlineJs = fs.readFileSync(
    path.join(process.cwd(), "src/app/home.script.js"),
    "utf8"
  );

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <HeroSection />
      <Script id="damasqas-home" strategy="afterInteractive">
        {inlineJs}
      </Script>
    </>
  );
}
```

Wait — we want the hero ABOVE the Why/Stack sections, not below. But the announce bar + nav live at the top of home.body.html. Flip the approach: render the HTML content, but find the `<main id="main">` tag and insert the hero right after it.

Simpler approach: render the announce/nav/main-opening HTML, then the hero, then the rest. Splitting the HTML is fragile. Better: render HeroSection BEFORE the HTML and adjust the HTML so `<main id="main">` is not open at the start. Move the `<main id="main">` opening tag inside our JSX.

- [ ] **Step 3: Revise — restructure home.body.html more carefully**

Open `src/app/home.body.html`. The file has the structure:
```
<a skip-link>
<div announce-bar>
<nav>
<main id="main">
<section class="hero"> ← already removed
<section §01>
...
</main>
<div wordmark-section>
<footer>
```

Split the HTML content mentally into three parts:
1. Announce + nav (top)
2. `<main id="main">` through `</main>` (everything inside main)
3. Wordmark + footer (bottom)

We want our hero as the FIRST child inside `<main id="main">`. We can add a marker in home.body.html where we want the hero injected, split the string on that marker, and insert `<HeroSection />` between the two parts.

Update `page.tsx`:

```typescript
import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
import { HeroSection } from "./_components/HeroSection";

const HERO_MARKER = "<!-- HERO_INJECTION_POINT -->";

export default function HomePage() {
  const bodyHtml = fs.readFileSync(
    path.join(process.cwd(), "src/app/home.body.html"),
    "utf8"
  );
  const inlineJs = fs.readFileSync(
    path.join(process.cwd(), "src/app/home.script.js"),
    "utf8"
  );

  const [beforeHero, afterHero] = bodyHtml.split(HERO_MARKER);
  if (afterHero === undefined) {
    throw new Error(
      `Missing ${HERO_MARKER} in home.body.html — hero injection won't work.`
    );
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: beforeHero }} />
      <HeroSection />
      <div dangerouslySetInnerHTML={{ __html: afterHero }} />
      <Script id="damasqas-home" strategy="afterInteractive">
        {inlineJs}
      </Script>
    </>
  );
}
```

- [ ] **Step 4: Add the marker to `home.body.html`**

Find the line `<main id="main">` and the next significant content. Between them, add:

```html
<main id="main">

<!-- HERO_INJECTION_POINT -->

<!-- ============================================================
     §01 WHY DAMASQAS
     ============================================================ -->
```

(The marker goes right after `<main id="main">` and right before `<!-- §01 WHY -->`.)

- [ ] **Step 5: Reload `/`**

Expected: announce bar, nav, THEN the unified white hero (with animation), THEN §01 Why Damasqas, THEN rest of page, THEN wordmark, THEN footer. All animations working.

- [ ] **Step 6: Typecheck + commit**

Run: `npx tsc --noEmit`

```bash
git add src/app/page.tsx src/app/home.body.html
git commit -m "app: inject HeroSection at HERO_INJECTION_POINT in home body"
```

---

### Task 24: Reconcile hero background with surrounding page

**Files:**
- Modify: `src/app/_components/HeroSection.module.css`
- Modify: `src/app/globals.css`

The existing globals.css has `--bg: #FFFFFF` (white). The hero's `.heroShell` has its own gradient background with rounded corners and shadow — it looks like a card on a cream canvas. The rest of the page uses pure white. When they sit side-by-side, the hero looks like a big detached card.

Two options:
- A. Remove the hero's wrapping card look (make it full-bleed white, no shadow, no rounded corners) so it blends seamlessly with the rest of the page.
- B. Keep the card look but align the body background to match the hero's cream canvas (adjust globals.css).

Choose A — seamless blend with existing white page.

- [ ] **Step 1: Edit `HeroSection.module.css`**

Find the `.heroShell` rule and change:
- `background: radial-gradient(...) ... linear-gradient(...)` → `background: #FFFFFF`
- `border-radius: 30px` → `border-radius: 0`
- `box-shadow: 0 44px 90px rgba(...), inset 0 0 0 1px rgba(...)` → remove `box-shadow`
- `padding: clamp(64px, 8vw, 108px) clamp(44px, 6vw, 92px)` → `padding: clamp(96px, 10vw, 140px) clamp(24px, 4vw, 80px)` (matches page breathing room)
- `max-width: 1880px` → `max-width: 1180px` (matches `--content-max` in globals.css)
- `margin: 0 auto` stays

Keep the subtle `::before` dot pattern — it adds texture without being intrusive.

- [ ] **Step 2: Reload `/`**

Expected: the hero flows directly into the rest of the page with no visible card edge. The dot pattern still adds subtle depth.

- [ ] **Step 3: Commit**

```bash
git add src/app/_components/HeroSection.module.css
git commit -m "app: make hero seamless with surrounding page (no card chrome)"
```

---

## Phase 4 — Responsive, accessibility, poster

### Task 25: Responsive — stacking below 1024px

**Files:**
- Modify: `src/app/_components/HeroSection.module.css`

At ≥1280px the full composition plays. At 768-1279px the grid stacks. Below 768px the Player is hidden and a static final-frame poster takes over.

- [ ] **Step 1: Update media queries in HeroSection.module.css**

Ensure these rules are at the bottom of the file:

```css
@media (max-width: 1279px) {
  .heroShell {
    grid-template-columns: 1fr;
  }
  .animationWrap {
    min-height: 540px;
    max-width: 760px;
    margin: 40px auto 0;
  }
}

@media (max-width: 767px) {
  .heroShell {
    padding: 80px 24px 60px;
  }
  .heroCopy h1 strong {
    font-size: clamp(3.5rem, 14vw, 5.4rem);
  }
  .heroCopy h1 em {
    font-size: clamp(3.4rem, 13vw, 5.1rem);
  }
  .animationWrap {
    min-height: 420px;
    transform: scale(0.85);
    transform-origin: top center;
  }
  .primaryCta, .secondaryCta {
    width: 100%;
  }
}
```

- [ ] **Step 2: Resize browser or use DevTools responsive mode**

Test at 1400px, 1200px, 900px, 600px, 375px. Expected: smooth stacking, no overflow, animation still plays at scaled-down size.

- [ ] **Step 3: Commit**

```bash
git add src/app/_components/HeroSection.module.css
git commit -m "app: responsive stacking for hero at 1279px and 767px breakpoints"
```

---

### Task 26: Accessibility audit

**Files:** none (verification only)

- [ ] **Step 1: Check `HeroPlayer` aria-label is descriptive**

Should read "Animation showing Damasqas resolving a production incident in 42 seconds: a P1 alert fires, the agent investigates, identifies a bad commit, rolls it back, and posts a resolved message to Slack." — already set in Task 21.

- [ ] **Step 2: Test with keyboard**

Tab through the hero. Expected: "Request a demo" and "See how it works →" both get visible focus rings (from globals.css `:focus-visible`). The Player div itself is clickable (for replay) — OK for no focus ring.

- [ ] **Step 3: Test with `prefers-reduced-motion`**

In Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → reduce. Reload. Expected: hero shows static final-frame (all resolved elements visible, no looping).

- [ ] **Step 4: Screen reader smoke test (optional, macOS VoiceOver)**

If macOS: Cmd+F5, navigate to hero. Expected: VO reads the aria-label.

- [ ] **Step 5: No new commit needed unless issues found**

If issues found, fix and commit with message `a11y: <description of fix>`.

---

### Task 27: Render hero poster PNG for static mobile fallback (optional, deferred)

**Files:** none (command only, produces `public/hero-poster.png`)

Currently on mobile we still load the Player. For better initial paint we could pre-render frame 200 as a PNG and use `<img>` for <768px. For this first pass, skip this task — the Player at scaled-down size works acceptably. Leave this task as a followup.

- [ ] **Step 1: Add followup note**

Add to `docs/superpowers/plans/2026-04-23-home-hero-polish.md` at the bottom:
```markdown
## Followups (post-merge)
- Pre-render `public/hero-poster.png` via `npx remotion still` and swap in for mobile < 768px to improve initial paint.
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/2026-04-23-home-hero-polish.md
git commit -m "docs: add post-merge followup note for mobile poster image"
```

---

## Phase 5 — Cleanup and final verification

### Task 28: Verify old mockup still renders (safety check)

**Files:** none

- [ ] **Step 1: Visit `/mockups/unified-white`**

Expected: the original mockup still renders correctly (we haven't touched it). Use it to compare "before polish" vs "after polish" side-by-side.

- [ ] **Step 2: No action needed unless it's broken**

If it's broken: likely due to a CSS class name collision with our new composition module. Investigate and fix.

---

### Task 29: Full lint + typecheck + build

**Files:** none (verification only)

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: no errors, no new warnings.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build completes successfully. Check the bundle size output — the client JS for `/` should include `@remotion/player` + our composition. Note the total `First Load JS` — should be < 250KB.

- [ ] **Step 4: If build fails**

Read the error carefully. Common causes:
- Missing "use client" directive on components that use hooks / Three.js / Remotion Player
- Importing server-only code into a client component
- Typescript strict errors

Fix, re-run.

- [ ] **Step 5: Commit any fixes**

```bash
git add <fixed-files>
git commit -m "fix: <specific fix>"
```

---

### Task 30: Manual UX pass in browser

**Files:** none (verification only)

- [ ] **Step 1: Visit `/` in Chrome at 1440px width**

Observe for 20 seconds. Check:
1. Page loads without layout shift (hero appears in place)
2. Animation starts immediately
3. Animation feels smooth — no stutter, no jank
4. Hover the composition: animation pauses
5. Move mouse off: animation resumes
6. Click the composition: animation restarts from frame 0

- [ ] **Step 2: Scroll down past the hero**

Expected: hero animation pauses (IntersectionObserver). Scroll back up: it resumes.

- [ ] **Step 3: Open DevTools Performance tab, record 5s of playback**

Check the frame rate graph. Expected: 60fps most of the time, no long-running tasks, no layout thrashing.

- [ ] **Step 4: Try in Safari + Firefox**

Expected: identical behavior. Three.js orb renders. Animation smooth. If Safari has issues (it sometimes does with Three.js alpha canvases), investigate and fix.

- [ ] **Step 5: If any issue found, fix and commit**

```bash
git add <fixed-files>
git commit -m "fix: <specific fix>"
```

---

### Task 31: Update task list and close out

**Files:** none

- [ ] **Step 1: Mark TaskList items completed** 

Use TaskUpdate tool to mark remaining tasks completed.

- [ ] **Step 2: Push branch** (only if user requests)

Do NOT push without explicit user approval.

- [ ] **Step 3: Summarize what shipped**

Prepare a one-paragraph summary for the user covering:
- What the hero now does (animation beats)
- Where the code lives (src/remotion/, src/app/_components/)
- Known followups (poster image, Phase 2 rest of page)

---

## Followups (post-merge)

- Pre-render `public/hero-poster.png` via `npx remotion still` and swap in for mobile < 768px to improve initial paint.
- Phase 2: restyle §01 Why, §02 Stack, §03 How it works, §04 Audience on the new visual system (separate spec).
- Consider adding a tiny Remotion Studio dev script: `"remotion": "remotion studio src/remotion/index.ts"` — requires creating an `src/remotion/index.ts` entry file.
- Evaluate whether to delete `src/app/mockups/unified-white/` once we're confident in the new hero.
