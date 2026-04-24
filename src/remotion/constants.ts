// Frame timing: the hero composition runs 8s at 30fps = 240 frames.
// All beat markers live here so timing changes in one place.
export const FPS = 30;
export const DURATION_FRAMES = 240;

// Composition logical size — cards are positioned in absolute coordinates
// within this canvas. Player scales it to fit the DOM element.
export const COMPOSITION_WIDTH = 1100;
export const COMPOSITION_HEIGHT = 660;

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

// Colors — one source of truth.
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
