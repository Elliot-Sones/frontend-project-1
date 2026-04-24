import type { CSSProperties } from "react";
import { interpolate } from "remotion";
import styles from "../composition.module.css";

export interface PulseRingProps {
  /** Current frame number from the composition. */
  frame: number;
  /** Frame at which the pulse begins. Completes over 24 frames. */
  startFrame: number;
  className?: string;
  style?: CSSProperties;
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
        transform: `${style?.transform ?? ""} scale(${scale})`,
        opacity,
      }}
    />
  );
}
