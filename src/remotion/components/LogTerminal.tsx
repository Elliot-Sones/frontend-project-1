import type { CSSProperties } from "react";
import { interpolate } from "remotion";
import { BEATS } from "../constants";
import styles from "../composition.module.css";

export interface LogTerminalProps {
  frame: number;
  className?: string;
  style?: CSSProperties;
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
      <small style={{ width: line3Width, overflow: "hidden", whiteSpace: "nowrap", display: "block" }}>
        at checkout.ts:142
      </small>
    </div>
  );
}
