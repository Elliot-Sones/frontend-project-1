import type { ReactNode } from "react";
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

export function ConnectorSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      className={styles.connectorLines}
      viewBox="0 0 980 660"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
