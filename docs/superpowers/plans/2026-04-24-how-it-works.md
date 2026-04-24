# §03 How It Works — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static §03 "How it works" on the home page with an animated, reveal-on-scroll section featuring a sticky timeline rail on the left and three live animated stages on the right (Connect / Ask / Proactive).

**Architecture:** One React client component (`HowItWorks`) owns the section. It renders a sticky numbered rail, a scroll-progress fill line, and three step rows. Each step row contains a heading + description on the left and an animated stage on the right. Stages are self-contained components that start their CSS keyframe loop once they enter the viewport (via `IntersectionObserver`). Section is integrated into `src/app/page.tsx` using the same split-on-marker pattern as `HeroSection`. No new dependencies.

**Tech Stack:** Next.js 16.2.4 (App Router), React 19.2.4, TypeScript, CSS Modules. No new dependencies.

**Important Next.js 16 note:** The project's `AGENTS.md` warns that Next.js 16 has breaking changes. `HowItWorks` is a client component (`"use client"`) — no async server component behavior involved. Integration into `page.tsx` (a server component) is by direct import, same pattern as `HeroSection`.

**Design spec:** `docs/superpowers/specs/2026-04-24-how-it-works-design.md`

**Verification model for every task:**
1. `npx tsc --noEmit` passes (no TS errors)
2. `npm run lint` passes
3. From Phase 5 onwards: dev server at `http://localhost:3000/` renders §03 with animations running correctly

Start the dev server once before Phase 5 and leave it running: `npm run dev`.

---

## Phase 0 — Orientation

### Task 0: Branch + baseline

**Files:** none (sanity check)

- [ ] **Step 1: Confirm branch**

Run: `git branch --show-current`
Expected: `landing-mockups-modern-animations`

- [ ] **Step 2: Confirm working tree is clean**

Run: `git status --porcelain`
Expected: empty output.

- [ ] **Step 3: Typecheck baseline**

Run: `npx tsc --noEmit`
Expected: no output, exit code 0.

- [ ] **Step 4: Lint baseline**

Run: `npm run lint`
Expected: no errors.

---

## Phase 1 — Primitives

### Task 1: Create feature directory + `useInView` hook

**Files:**
- Create: `src/app/_components/how-it-works/useInView.ts`

- [ ] **Step 1: Create the directory**

Run: `mkdir -p src/app/_components/how-it-works/stages`

- [ ] **Step 2: Write `useInView.ts`**

Create `src/app/_components/how-it-works/useInView.ts`:

```ts
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sets `hasEntered` to true the first time the observed element crosses the
 * threshold. Never flips back to false — animations only need a one-way signal.
 */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.25 }
) {
  const ref = useRef<T | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasEntered) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
          return;
        }
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, hasEntered };
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/how-it-works/useInView.ts
git commit -m "how-it-works: add useInView hook"
```

---

### Task 2: Inline logo SVG components

**Files:**
- Create: `src/app/_components/how-it-works/stages/logos.tsx`

- [ ] **Step 1: Write `logos.tsx`**

Create `src/app/_components/how-it-works/stages/logos.tsx`:

```tsx
import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement>;

export function DatadogLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <circle cx="16" cy="16" r="14" fill="#632CA6" />
      <path
        d="M10 20 L18 10 L18 18 L22 14"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="22" cy="14" r="1.5" fill="white" />
    </svg>
  );
}

export function GitHubLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="#1a1a1a" aria-hidden="true" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.09.81 2.19v3.24c0 .32.22.69.82.58C20.57 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function RailwayLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="28" height="28" rx="6" fill="#0B0D0E" />
      <text
        x="16"
        y="22"
        fontFamily="-apple-system, Helvetica, Arial, sans-serif"
        fontSize="15"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
      >
        R
      </text>
    </svg>
  );
}

export function PagerDutyLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#06AC38" />
      <path d="M10 8 H17 a5 5 0 0 1 0 10 H13 V24 H10 Z" fill="white" />
    </svg>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/_components/how-it-works/stages/logos.tsx
git commit -m "how-it-works: add inline logo SVG components"
```

---

## Phase 2 — Stage: Connect

### Task 3: `ConnectStage` component + CSS module

**Files:**
- Create: `src/app/_components/how-it-works/stages/ConnectStage.tsx`
- Create: `src/app/_components/how-it-works/stages/ConnectStage.module.css`

- [ ] **Step 1: Write `ConnectStage.module.css`**

Create `src/app/_components/how-it-works/stages/ConnectStage.module.css`:

```css
.stage {
  position: absolute;
  inset: 0;
}

.lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.line {
  stroke: #1a1a1a;
  stroke-width: 1;
  stroke-dasharray: 160;
  stroke-dashoffset: 0;
  opacity: 0.35;
}

.core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #1a1a1a;
  color: #fff;
  font-family: var(--font-mono), monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.tile {
  position: absolute;
  width: 56px;
  height: 56px;
  background: #fff;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  z-index: 3;
}

.tile svg {
  width: 34px;
  height: 34px;
}

.t1 { top: 14%; left: 10%; }
.t2 { top: 14%; right: 10%; }
.t3 { bottom: 14%; left: 10%; }
.t4 { bottom: 14%; right: 10%; }

/* --- Animations — only run when .playing is present --- */

.playing .line {
  stroke-dashoffset: 160;
  opacity: 0;
  animation: line-draw 8s infinite;
}
.playing .l1 { animation-delay: 0.6s; }
.playing .l2 { animation-delay: 1.0s; }
.playing .l3 { animation-delay: 1.4s; }
.playing .l4 { animation-delay: 1.8s; }

@keyframes line-draw {
  0%   { stroke-dashoffset: 160; opacity: 0; }
  8%   { opacity: 0.35; }
  30%  { stroke-dashoffset: 0; opacity: 0.35; }
  90%  { stroke-dashoffset: 0; opacity: 0.35; }
  100% { stroke-dashoffset: 0; opacity: 0.35; }
}

.playing .core {
  animation: core-pulse 2.4s ease-in-out infinite;
}

@keyframes core-pulse {
  0%,
  100% { box-shadow: 0 0 0 0 rgba(26, 26, 26, 0.25); }
  50%  { box-shadow: 0 0 0 18px rgba(26, 26, 26, 0); }
}

.playing .tile {
  opacity: 0;
  animation: tile-pop 8s infinite;
}
.playing .t1 { animation-delay: 0.2s; }
.playing .t2 { animation-delay: 0.5s; }
.playing .t3 { animation-delay: 0.8s; }
.playing .t4 { animation-delay: 1.1s; }

@keyframes tile-pop {
  0%   { opacity: 0; transform: scale(0.6); }
  10%  { opacity: 1; transform: scale(1); }
  90%  { opacity: 1; transform: scale(1); }
  100% { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .playing .line,
  .playing .core,
  .playing .tile {
    animation: none;
  }
  .playing .line { stroke-dashoffset: 0; opacity: 0.35; }
  .playing .tile { opacity: 1; transform: none; }
}
```

- [ ] **Step 2: Write `ConnectStage.tsx`**

Create `src/app/_components/how-it-works/stages/ConnectStage.tsx`:

```tsx
"use client";

import { useInView } from "../useInView";
import {
  DatadogLogo,
  GitHubLogo,
  PagerDutyLogo,
  RailwayLogo,
} from "./logos";
import styles from "./ConnectStage.module.css";

export function ConnectStage() {
  const { ref, hasEntered } = useInView<HTMLDivElement>();
  const className = `${styles.stage}${hasEntered ? ` ${styles.playing}` : ""}`;

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <svg
        className={styles.lines}
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
      >
        <line className={`${styles.line} ${styles.l1}`} x1="68" y1="70" x2="200" y2="150" />
        <line className={`${styles.line} ${styles.l2}`} x1="332" y1="70" x2="200" y2="150" />
        <line className={`${styles.line} ${styles.l3}`} x1="68" y1="230" x2="200" y2="150" />
        <line className={`${styles.line} ${styles.l4}`} x1="332" y1="230" x2="200" y2="150" />
      </svg>

      <div className={styles.core}>dmq</div>

      <div className={`${styles.tile} ${styles.t1}`}><DatadogLogo /></div>
      <div className={`${styles.tile} ${styles.t2}`}><GitHubLogo /></div>
      <div className={`${styles.tile} ${styles.t3}`}><RailwayLogo /></div>
      <div className={`${styles.tile} ${styles.t4}`}><PagerDutyLogo /></div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/how-it-works/stages/ConnectStage.tsx src/app/_components/how-it-works/stages/ConnectStage.module.css
git commit -m "how-it-works: add ConnectStage — logo tiles + line draw"
```

---

## Phase 3 — Stage: Slack

### Task 4: `SlackStage` component + CSS module

**Files:**
- Create: `src/app/_components/how-it-works/stages/SlackStage.tsx`
- Create: `src/app/_components/how-it-works/stages/SlackStage.module.css`

**User message text (27 characters):** `why is API latency spiking?`
**Bot message text (42 characters):** `Pool exhausted post-deploy. Fix in PR #92.`

Both widths in the CSS below are set to these exact character counts. If text is changed, update the `ch` values accordingly.

- [ ] **Step 1: Write `SlackStage.module.css`**

Create `src/app/_components/how-it-works/stages/SlackStage.module.css`:

```css
.stage {
  position: absolute;
  inset: 0;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
  font-size: 13px;
  overflow: hidden;
}

.msg {
  display: flex;
  gap: 10px;
  opacity: 1;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  background: #e5e5e5;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono), monospace;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.avatar.bot {
  background: #1a1a1a;
  color: #fff;
}

.body {
  flex: 1;
  min-width: 0;
}

.name {
  font-weight: 600;
  color: #111;
  font-size: 12px;
  margin-bottom: 3px;
  font-family: var(--font-mono), monospace;
}

.text {
  color: #444;
  line-height: 1.5;
}

.cmd {
  font-family: var(--font-mono), monospace;
  background: #f0f0ef;
  padding: 1px 5px;
  border-radius: 4px;
  color: #1a1a1a;
  font-size: 12.5px;
}

.typing {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
}

.pills {
  display: flex;
  gap: 6px;
  margin-left: 38px;
  flex-wrap: wrap;
}

.pill {
  font-size: 11px;
  padding: 3px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  background: #fff;
  color: #555;
  font-family: var(--font-mono), monospace;
  opacity: 1;
  transform: none;
}

/* --- Animations — only run when .playing is present --- */

/* Whole stage fades out/in each loop so user always sees a fresh cycle */
.playing .userMsg {
  animation: fade-in 8s infinite;
  animation-delay: 0s;
}

.playing .pills {
  animation: pills-fade 8s infinite;
}

.playing .botMsg {
  animation: bot-fade 8s infinite;
}

@keyframes fade-in {
  0%   { opacity: 0; }
  3%   { opacity: 1; }
  90%  { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes pills-fade {
  0%,
  32%  { opacity: 0; }
  36%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes bot-fade {
  0%,
  45%  { opacity: 0; }
  48%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { opacity: 0; }
}

/* User typing: 27ch over 2s of an 8s loop, starting at 0.2s (2.5%) */
.playing .userTyping {
  width: 0;
  border-right: 1.5px solid #1a1a1a;
  animation:
    user-type 8s infinite steps(27),
    caret 0.7s steps(1) infinite;
}

@keyframes user-type {
  0%,
  2.5% { width: 0; }
  27.5% { width: 27ch; }
  100% { width: 27ch; }
}

/* Bot typing: 42ch starting at 3.8s (47.5%) over 2.7s (33.75%) */
.playing .botTyping {
  width: 0;
  border-right: 1.5px solid #1a1a1a;
  animation:
    bot-type 8s infinite steps(42),
    caret 0.7s steps(1) infinite;
}

@keyframes bot-type {
  0%,
  47.5% { width: 0; }
  81.25% { width: 42ch; }
  100% { width: 42ch; }
}

@keyframes caret {
  50% { border-right-color: transparent; }
}

/* Pills pop in staggered inside the pills-fade window */
.playing .pill {
  opacity: 0;
  transform: translateY(6px);
  animation: pill-pop 8s infinite;
}
.playing .pill1 { animation-delay: 0s; }
.playing .pill2 { animation-delay: 0.3s; }
.playing .pill3 { animation-delay: 0.6s; }

@keyframes pill-pop {
  0%,
  32%  { opacity: 0; transform: translateY(6px); }
  36%  { opacity: 1; transform: translateY(0); }
  90%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(6px); }
}

/* Reduced motion: show everything static, no animation */
@media (prefers-reduced-motion: reduce) {
  .playing .userMsg,
  .playing .pills,
  .playing .botMsg,
  .playing .userTyping,
  .playing .botTyping,
  .playing .pill {
    animation: none;
  }
  .playing .userMsg,
  .playing .pills,
  .playing .botMsg,
  .playing .pill {
    opacity: 1;
    transform: none;
  }
  .playing .userTyping,
  .playing .botTyping {
    width: auto;
    border-right: none;
  }
}
```

- [ ] **Step 2: Write `SlackStage.tsx`**

Create `src/app/_components/how-it-works/stages/SlackStage.tsx`:

```tsx
"use client";

import { useInView } from "../useInView";
import styles from "./SlackStage.module.css";

export function SlackStage() {
  const { ref, hasEntered } = useInView<HTMLDivElement>();
  const className = `${styles.stage}${hasEntered ? ` ${styles.playing}` : ""}`;

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <div className={`${styles.msg} ${styles.userMsg}`}>
        <div className={styles.avatar}>SP</div>
        <div className={styles.body}>
          <div className={styles.name}>Shalin</div>
          <div className={styles.text}>
            <span className={styles.cmd}>@damasqas</span>{" "}
            <span className={`${styles.typing} ${styles.userTyping}`}>
              why is API latency spiking?
            </span>
          </div>
        </div>
      </div>

      <div className={styles.pills}>
        <span className={`${styles.pill} ${styles.pill1}`}>📊 datadog</span>
        <span className={`${styles.pill} ${styles.pill2}`}>🐙 github</span>
        <span className={`${styles.pill} ${styles.pill3}`}>🚂 railway</span>
      </div>

      <div className={`${styles.msg} ${styles.botMsg}`}>
        <div className={`${styles.avatar} ${styles.bot}`}>d</div>
        <div className={styles.body}>
          <div className={styles.name}>damasqas</div>
          <div className={styles.text}>
            <span className={`${styles.typing} ${styles.botTyping}`}>
              Pool exhausted post-deploy. Fix in PR #92.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/how-it-works/stages/SlackStage.tsx src/app/_components/how-it-works/stages/SlackStage.module.css
git commit -m "how-it-works: add SlackStage — typewriter conversation"
```

---

## Phase 4 — Stage: Proactive monitoring

### Task 5: `MonitorStage` component + CSS module

**Files:**
- Create: `src/app/_components/how-it-works/stages/MonitorStage.tsx`
- Create: `src/app/_components/how-it-works/stages/MonitorStage.module.css`

- [ ] **Step 1: Write `MonitorStage.module.css`**

Create `src/app/_components/how-it-works/stages/MonitorStage.module.css`:

```css
.stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 22px;
  box-sizing: border-box;
}

.notif {
  width: 100%;
  background: #fff;
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 6px 20px -8px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: 30px 1fr 1fr;
  column-gap: 12px;
  row-gap: 8px;
  align-items: start;
  opacity: 1;
  transform: translateY(0) scale(1);
}

.avatar {
  grid-row: 1 / span 3;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background: #1a1a1a;
  color: #fff;
  font-family: var(--font-mono), monospace;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.head {
  grid-row: 1;
  grid-column: 2 / span 2;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.name {
  font-weight: 600;
  color: #111;
  font-size: 13px;
}

.time {
  color: #999;
  font-size: 11px;
  font-family: var(--font-mono), monospace;
}

.title {
  grid-row: 2;
  grid-column: 2;
  color: #9a3412;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.3;
}

.body {
  grid-row: 3;
  grid-column: 2;
  color: #555;
  font-size: 12.5px;
  line-height: 1.55;
}

.body strong {
  color: #1a1a1a;
}

.cmd {
  font-family: var(--font-mono), monospace;
  background: #f0f0ef;
  padding: 0 5px;
  border-radius: 3px;
  color: #1a1a1a;
  font-size: 12px;
}

.chart {
  grid-row: 2 / span 2;
  grid-column: 3;
  background: #fafaf9;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  padding: 10px 12px;
  position: relative;
  min-height: 88px;
  align-self: stretch;
}

.chartLabel {
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 10px;
  color: #888;
  font-family: var(--font-mono), monospace;
}

.chartVal {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 11px;
  color: #9a3412;
  font-family: var(--font-mono), monospace;
  font-weight: 600;
}

.chartSvg {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  padding: 26px 12px 10px;
  box-sizing: border-box;
}

.chartSvg svg {
  width: 100%;
  height: 100%;
}

.threshold {
  position: absolute;
  left: 12px;
  right: 12px;
  top: 44px;
  height: 0;
  border-top: 1px dashed #ccc;
}

.line {
  stroke: #9a3412;
  stroke-width: 1.5;
  fill: none;
  stroke-dasharray: 300;
  stroke-dashoffset: 0;
}

.lineFill {
  fill: url(#mmonGrad);
  opacity: 0.35;
}

/* Responsive: on narrow stages, drop the chart below the body */
@media (max-width: 600px) {
  .notif {
    grid-template-columns: 30px 1fr;
  }
  .head { grid-column: 2; }
  .title,
  .body { grid-column: 2; }
  .chart {
    grid-row: auto;
    grid-column: 1 / -1;
    min-height: 72px;
  }
}

/* --- Animations --- */

.playing .notif {
  animation: notif-in 8s infinite;
}

@keyframes notif-in {
  0%,
  5%  { opacity: 0; transform: translateY(12px) scale(0.97); }
  10% { opacity: 1; transform: translateY(0) scale(1); }
  90% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-4px) scale(0.99); }
}

.playing .line {
  stroke-dashoffset: 300;
  animation: line-draw 8s infinite;
}

@keyframes line-draw {
  0%,
  10%  { stroke-dashoffset: 300; }
  35%  { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
}

.playing .lineFill {
  opacity: 0;
  animation: fill-in 8s infinite;
}

@keyframes fill-in {
  0%,
  25%  { opacity: 0; }
  40%  { opacity: 0.35; }
  100% { opacity: 0.35; }
}

.playing .title {
  opacity: 0;
  transform: translateY(-4px);
  animation: title-pop 8s infinite;
}

@keyframes title-pop {
  0%,
  35%  { opacity: 0; transform: translateY(-4px); }
  42%  { opacity: 1; transform: translateY(0); }
  90%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  .playing .notif,
  .playing .line,
  .playing .lineFill,
  .playing .title {
    animation: none;
  }
  .playing .notif,
  .playing .title { opacity: 1; transform: none; }
  .playing .line { stroke-dashoffset: 0; }
  .playing .lineFill { opacity: 0.35; }
}
```

- [ ] **Step 2: Write `MonitorStage.tsx`**

Create `src/app/_components/how-it-works/stages/MonitorStage.tsx`:

```tsx
"use client";

import { useInView } from "../useInView";
import styles from "./MonitorStage.module.css";

export function MonitorStage() {
  const { ref, hasEntered } = useInView<HTMLDivElement>();
  const className = `${styles.stage}${hasEntered ? ` ${styles.playing}` : ""}`;

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <div className={styles.notif}>
        <div className={styles.avatar}>d</div>

        <div className={styles.head}>
          <span className={styles.name}>damasqas</span>
          <span className={styles.time}>12:04 PM</span>
        </div>

        <div className={styles.title}>⚠ SLO Warning · payments-api</div>

        <div className={styles.body}>
          Error budget <strong>73%</strong> consumed · breaches in ~6 days. Top
          contributor: <span className={styles.cmd}>/v1/charges</span> timeouts.
        </div>

        <div className={styles.chart}>
          <span className={styles.chartLabel}>error budget burn</span>
          <span className={styles.chartVal}>73%</span>
          <div className={styles.threshold} />
          <div className={styles.chartSvg}>
            <svg viewBox="0 0 300 50" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mmonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                className={styles.lineFill}
                d="M 0 44 Q 50 40, 80 34 T 160 22 T 240 12 L 300 6 L 300 50 L 0 50 Z"
              />
              <path
                className={styles.line}
                d="M 0 44 Q 50 40, 80 34 T 160 22 T 240 12 L 300 6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/how-it-works/stages/MonitorStage.tsx src/app/_components/how-it-works/stages/MonitorStage.module.css
git commit -m "how-it-works: add MonitorStage — SLO notification + inline graph"
```

---

## Phase 5 — Container + integration

### Task 6: `HowItWorks.module.css`

**Files:**
- Create: `src/app/_components/how-it-works/HowItWorks.module.css`

- [ ] **Step 1: Write the module CSS**

Create `src/app/_components/how-it-works/HowItWorks.module.css`:

```css
.section {
  --how-progress: 0;
  padding: var(--section-y) 24px;
  position: relative;
  background: transparent;
}

.inner {
  max-width: var(--content-max);
  margin: 0 auto;
}

.header {
  max-width: 720px;
}

.steps {
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

@media (min-width: 900px) {
  .steps {
    grid-template-columns: 120px 1fr;
    column-gap: 48px;
    align-items: start;
  }
}

/* Rail (desktop only) */
.rail {
  position: relative;
  display: none;
  list-style: none;
  padding: 0;
  margin: 0;
  min-height: 100%;
  grid-column: 1;
}

@media (min-width: 900px) {
  .rail {
    display: block;
    position: sticky;
    top: 120px;
    align-self: start;
    height: calc(100vh - 140px);
    max-height: 600px;
  }
}

.railTrack {
  position: absolute;
  top: 14px;
  bottom: 14px;
  left: 50%;
  width: 1px;
  background: var(--hairline);
  transform: translateX(-0.5px);
}

.railFill {
  position: absolute;
  top: 14px;
  bottom: 14px;
  left: 50%;
  width: 1px;
  background: #1a1a1a;
  transform: translateX(-0.5px) scaleY(var(--how-progress));
  transform-origin: top;
  transition: transform 120ms linear;
}

.railNode {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #fff;
  border: 1.5px solid #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono), monospace;
  font-size: 11px;
  font-weight: 600;
  color: #1a1a1a;
  z-index: 1;
  transition: background 240ms ease-out, color 240ms ease-out;
}

.railNode.active {
  background: #1a1a1a;
  color: #fff;
}

.n1 { top: 0; }
.n2 { top: 50%; transform: translate(-50%, -50%); }
.n3 { bottom: 0; }

.n2.active { transform: translate(-50%, -50%); }

/* Steps column */
.stepsCol {
  display: flex;
  flex-direction: column;
}

@media (min-width: 900px) {
  .stepsCol { grid-column: 2; }
}

.step {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  padding: 56px 0;
  border-top: 1px solid var(--hairline);
  align-items: center;
}

.step:last-child {
  border-bottom: 1px solid var(--hairline);
}

@media (min-width: 900px) {
  .step {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    padding: 80px 0;
  }
}

.stepBody h3 {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.15;
  margin: 0 0 14px;
  color: var(--ink-100);
}

.stepBody p {
  font-size: 0.95rem;
  color: var(--ink-60);
  line-height: 1.7;
  margin: 0;
}

.stepCaption {
  margin-top: 16px;
  font-family: var(--font-mono), monospace;
  font-size: 0.75rem;
  color: var(--ink-40);
  line-height: 1.5;
  letter-spacing: 0.01em;
}

.mobileNumeral {
  font-family: var(--font-display);
  font-weight: 500;
  font-style: italic;
  font-size: 2.4rem;
  color: var(--ink-40);
  line-height: 1;
  margin-bottom: 8px;
}

@media (min-width: 900px) {
  .mobileNumeral { display: none; }
}

.stageFrame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 14px;
  background: #fafaf9;
  border: 1px solid var(--hairline);
  overflow: hidden;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/_components/how-it-works/HowItWorks.module.css
git commit -m "how-it-works: add section module CSS — rail, grid, responsive"
```

---

### Task 7: `HowItWorks.tsx` component

**Files:**
- Create: `src/app/_components/how-it-works/HowItWorks.tsx`

This component:
- Renders the section shell, header, rail, and step rows.
- Attaches a passive scroll listener that writes `--how-progress` to the section root.
- Activates rail nodes based on progress thresholds (0.05 / 0.45 / 0.85).

- [ ] **Step 1: Write the component**

Create `src/app/_components/how-it-works/HowItWorks.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import styles from "./HowItWorks.module.css";
import { ConnectStage } from "./stages/ConnectStage";
import { SlackStage } from "./stages/SlackStage";
import { MonitorStage } from "./stages/MonitorStage";

const NODE_THRESHOLDS = [0.05, 0.45, 0.85] as const;

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const nodeRefs = useRef<Array<HTMLLIElement | null>>([null, null, null]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const viewportCenter = vh / 2;
      const raw = (viewportCenter - rect.top) / rect.height;
      const progress = Math.max(0, Math.min(1, raw));
      el.style.setProperty("--how-progress", String(progress));

      for (let i = 0; i < NODE_THRESHOLDS.length; i += 1) {
        const node = nodeRefs.current[i];
        if (!node) continue;
        const active = progress > NODE_THRESHOLDS[i];
        node.classList.toggle(styles.active, active);
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how"
      className={`section ${styles.section}`}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className="section-label reveal">03 / How it works</div>
          <h2 className="display-h2 reveal reveal-d1">
            Three steps. <span className="muted">Then it runs on its own.</span>
          </h2>
        </div>

        <div className={styles.steps}>
          <ol className={styles.rail} aria-hidden="true">
            <div className={styles.railTrack} />
            <div className={styles.railFill} />
            <li
              ref={(el) => {
                nodeRefs.current[0] = el;
              }}
              className={`${styles.railNode} ${styles.n1}`}
            >
              01
            </li>
            <li
              ref={(el) => {
                nodeRefs.current[1] = el;
              }}
              className={`${styles.railNode} ${styles.n2}`}
            >
              02
            </li>
            <li
              ref={(el) => {
                nodeRefs.current[2] = el;
              }}
              className={`${styles.railNode} ${styles.n3}`}
            >
              03
            </li>
          </ol>

          <div className={styles.stepsCol}>
            <article className={styles.step}>
              <div className={styles.stepBody}>
                <div className={styles.mobileNumeral}>01</div>
                <h3>Connect your stack</h3>
                <p>
                  Add monitoring, logging, deployment platforms, and repos.
                  Damasqas connects via MCP servers, read-only by default. It
                  learns your services, your topology, your SLOs.
                </p>
                <div className={styles.stepCaption}>
                  datadog · github · railway · pagerduty — grafana, aws,
                  kubernetes soon
                </div>
              </div>
              <div className={styles.stageFrame}>
                <ConnectStage />
              </div>
            </article>

            <article className={styles.step}>
              <div className={styles.stepBody}>
                <div className={styles.mobileNumeral}>02</div>
                <h3>Ask reliability questions in Slack</h3>
                <p>
                  Not &ldquo;write me a function.&rdquo; Real infrastructure
                  questions. Damasqas understands deployment state, service
                  health, and change history.
                </p>
              </div>
              <div className={styles.stageFrame}>
                <SlackStage />
              </div>
            </article>

            <article className={styles.step}>
              <div className={styles.stepBody}>
                <div className={styles.mobileNumeral}>03</div>
                <h3>Proactive monitoring + remediation</h3>
                <p>
                  Damasqas learns your service topology and auto-configures
                  monitoring: SLOs, error budgets, deployment health, and
                  dependency status, all tailored to your architecture.
                </p>
              </div>
              <div className={styles.stageFrame}>
                <MonitorStage />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/_components/how-it-works/HowItWorks.tsx
git commit -m "how-it-works: add HowItWorks container — rail, scroll progress, step rows"
```

---

### Task 8: Integrate into the home page

**Files:**
- Modify: `src/app/home.body.html` (lines 370–438)
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the §03 block with a marker in `home.body.html`**

Open `src/app/home.body.html`. Find the block that starts:

```
<!-- ============================================================
     §03 HOW IT WORKS
     ============================================================ -->
<section class="section section-warm" id="how">
```

and ends at the closing `</section>` right before the `§04 BUILT FOR EVERYONE` comment (line 438).

Replace the entire block (the comment banner AND the `<section>...</section>`) with:

```html
<!-- HOW_IT_WORKS_INJECTION_POINT -->
```

- [ ] **Step 2: Update `src/app/page.tsx` to split on the marker and render `<HowItWorks />`**

Replace the contents of `src/app/page.tsx` with:

```tsx
import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
import { HeroSection } from "./_components/HeroSection";
import { HowItWorks } from "./_components/how-it-works/HowItWorks";

const HERO_MARKER = "<!-- HERO_INJECTION_POINT -->";
const HOW_MARKER = "<!-- HOW_IT_WORKS_INJECTION_POINT -->";

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

  const [beforeHow, afterHow] = afterHero.split(HOW_MARKER);
  if (afterHow === undefined) {
    throw new Error(
      `Missing ${HOW_MARKER} in home.body.html — how-it-works injection won't work.`
    );
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: beforeHero }} />
      <HeroSection />
      <div dangerouslySetInnerHTML={{ __html: beforeHow }} />
      <HowItWorks />
      <div dangerouslySetInnerHTML={{ __html: afterHow }} />
      <Script id="damasqas-home" strategy="afterInteractive">
        {inlineJs}
      </Script>
    </>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/home.body.html src/app/page.tsx
git commit -m "home: mount HowItWorks section via HOW_INJECTION_POINT marker"
```

---

### Task 9: Remove dead §03 CSS from `globals.css`

**Files:**
- Modify: `src/app/globals.css` (lines ~746–815)

The old §03 block used these rule selectors, now all dead:
- `.how-steps`, `.how-step`, `.step-numeral`, `.step-text h3`, `.step-text p`, `.step-mock`, `.step-mock .ok`, `.step-mock .warn`, `.step-mock .info`, `.step-mock .hi`, `.step-mock .meta`
- `.slack-msg`, `.slack-msg:last-child`, `.slack-avatar`, `.slack-avatar.user`, `.slack-avatar.bot`, `.slack-avatar.bot img`, `.slack-name`, `.slack-content`, `.slack-content .cmd`

All are scoped to the §03 section (grep-verified). Safe to remove.

- [ ] **Step 1: Verify no other section uses these classes**

Run: `grep -rn "how-step\|step-numeral\|step-mock\|slack-msg\|slack-avatar\|slack-name\|slack-content" src --include="*.html" --include="*.tsx" --include="*.ts"`
Expected: no output (empty). If there are any hits inside `src/app/home.body.html`, that means Step 1 of Task 8 wasn't done — go back and complete it first.

- [ ] **Step 2: Delete the §03 CSS block**

Open `src/app/globals.css`. Find the comment banner:

```
/* ============================================================
   §03 HOW IT WORKS
   ============================================================ */
```

Delete from that banner down to (but not including) the next banner:

```
/* ============================================================
   §04 AUDIENCE
   ============================================================ */
```

- [ ] **Step 3: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "home: remove dead §03 CSS (replaced by HowItWorks module)"
```

---

## Phase 6 — Verification

### Task 10: Desktop verification

**Files:** none (manual QA)

- [ ] **Step 1: Ensure dev server is running**

If not already running: `npm run dev`
Expected: server on `http://localhost:3000`.

- [ ] **Step 2: Open the home page**

Navigate to `http://localhost:3000/` in a browser window at ~1440×900.

- [ ] **Step 3: Scroll to §03 and check layout**

Click the hero's "See how it works →" link or scroll down manually.
Expected:
- Section has the section label "03 / How it works" and heading "Three steps. Then it runs on its own."
- Sticky rail on the left with three outlined circles (01 / 02 / 03) and a vertical hairline.
- Three step rows on the right. Each row: heading + description on the left, animated stage on the right.
- Stage containers have rounded corners, subtle `#fafaf9` background, 4:3 aspect ratio.

- [ ] **Step 4: Check rail scroll progress**

Slowly scroll through the section.
Expected:
- The dark fill line grows downward as you scroll.
- Nodes switch from outlined to filled black at roughly 5% / 45% / 85% of section progress.
- Rail stays sticky at `top: 120px` (below the nav).

- [ ] **Step 5: Check stage animations trigger on enter**

Expected:
- **Step 01** Connect: logo tiles (Datadog purple / GitHub black / Railway black / PagerDuty green) fade in at corners; thin lines draw to the central "dmq" core; core pulses softly; loops every 8s.
- **Step 02** Slack: user's message types character-by-character with a blinking caret; three tool-use pills pop in (📊 📈 🚂); bot's answer types out; loops every 8s.
- **Step 03** Monitor: Slack-style notification slides in with the "⚠ SLO Warning" title; the orange burn-rate line draws left-to-right; the gradient fill fades in under the line; loops every 8s.

- [ ] **Step 6: Scroll away and back — verify stages keep looping**

Expected: animations continue from where their loop is, smoothly. No flicker, no layout shift.

---

### Task 11: Mobile verification

**Files:** none (manual QA)

- [ ] **Step 1: Open devtools device emulation at iPhone 14 (390×844)**

Expected:
- Rail is hidden (no sticky left column).
- Each step stacks: small italic numeral (01 / 02 / 03) above the heading; description below; stage below, full width.
- No horizontal scroll.

- [ ] **Step 2: Scroll through all three stages on mobile**

Expected: each stage's animation triggers when it enters the viewport and loops normally. Stage aspect ratio stays 4:3.

---

### Task 12: Reduced motion verification

**Files:** none (manual QA)

- [ ] **Step 1: Enable "Emulate CSS prefers-reduced-motion: reduce" in devtools**

(Chrome: devtools → ⋮ → Rendering → Emulate CSS media feature prefers-reduced-motion → reduce.)

- [ ] **Step 2: Reload the page and scroll to §03**

Expected:
- **Step 01** Connect: all four logo tiles visible at corners, all four lines drawn and faintly visible, core visible without pulse.
- **Step 02** Slack: user message fully rendered (no caret), pills fully visible, bot message fully rendered.
- **Step 03** Monitor: notification card fully visible, line fully drawn, gradient fill present, title visible. No slide-in, no looping.
- Rail fill line hidden or static; all three nodes in their active (filled) state.

- [ ] **Step 3: Disable reduced-motion emulation before continuing.**

---

### Task 13: Final sanity checks

**Files:** none (verification)

- [ ] **Step 1: Run typecheck and lint one more time**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds. Note any new warnings.

- [ ] **Step 3: Confirm no leftover dead code or stray files**

Run: `git status --porcelain`
Expected: empty (all changes committed).

- [ ] **Step 4: Summary commit (optional)**

If anything was adjusted during QA (timing nudges, color tweaks), commit as:

```bash
git add -u
git commit -m "how-it-works: polish — QA tweaks"
```

---

## Recap — files touched

**Created (10):**
- `src/app/_components/how-it-works/HowItWorks.tsx`
- `src/app/_components/how-it-works/HowItWorks.module.css`
- `src/app/_components/how-it-works/useInView.ts`
- `src/app/_components/how-it-works/stages/ConnectStage.tsx`
- `src/app/_components/how-it-works/stages/ConnectStage.module.css`
- `src/app/_components/how-it-works/stages/SlackStage.tsx`
- `src/app/_components/how-it-works/stages/SlackStage.module.css`
- `src/app/_components/how-it-works/stages/MonitorStage.tsx`
- `src/app/_components/how-it-works/stages/MonitorStage.module.css`
- `src/app/_components/how-it-works/stages/logos.tsx`

**Modified (3):**
- `src/app/home.body.html` (§03 block replaced with injection marker)
- `src/app/page.tsx` (added `HOW_MARKER` split + `<HowItWorks />` render)
- `src/app/globals.css` (removed dead §03 CSS block)

No dependencies added. No other sections touched.
