import type { CSSProperties } from "react";
import styles from "../composition.module.css";

export interface CommitBadgeProps {
  className?: string;
  style?: CSSProperties;
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
