// Hero notification stack — cascades in over ~2s, then holds.
// 8 notifications stagger 150ms (4.5 frames) apart.
// Duration is very long so the loop effectively stays in "settled" state
// after the initial cascade; we don't use the global fade.
export const FPS = 30;
export const DURATION_FRAMES = 3600;

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
  /* globalFadeStart past DURATION_FRAMES means cards never fade. */
  globalFadeStart: 3599,
  loopEnd: 3600,
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
