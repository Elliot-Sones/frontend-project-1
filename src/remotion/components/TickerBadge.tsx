import type { CSSProperties } from "react";
import { interpolate } from "remotion";
import { BEATS } from "../constants";
import styles from "../composition.module.css";

const STATES = [
  { beat: BEATS.tickerAlert, text: "00:00 · alert", resolved: false },
  {
    beat: BEATS.tickerInvestigating,
    text: "00:12 · investigating",
    resolved: false,
  },
  { beat: BEATS.tickerRootCause, text: "00:28 · root cause", resolved: false },
  {
    beat: BEATS.tickerRollingBack,
    text: "00:35 · rolling back",
    resolved: false,
  },
  { beat: BEATS.tickerResolved, text: "00:42 · resolved", resolved: true },
] as const;

function stateOpacity(frame: number, beatStart: number, nextBeatStart: number) {
  const FADE_FRAMES = 8;
  return interpolate(
    frame,
    [
      beatStart,
      beatStart + FADE_FRAMES,
      nextBeatStart,
      nextBeatStart + FADE_FRAMES,
    ],
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
  style?: CSSProperties;
}

export function TickerBadge({
  frame,
  className = "",
  style,
}: TickerBadgeProps) {
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
