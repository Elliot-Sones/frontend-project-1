import type { CSSProperties } from "react";
import styles from "../composition.module.css";

export interface GraphCardProps {
  /** 0-1. Below 0.5 = red error state. Above 0.5 = green resolved state. */
  progress: number;
  className?: string;
  style?: CSSProperties;
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
  const ghostStroke = isResolved
    ? "rgba(110, 139, 96, 0.18)"
    : "rgba(209, 74, 58, 0.18)";

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
          stroke={ghostStroke}
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
