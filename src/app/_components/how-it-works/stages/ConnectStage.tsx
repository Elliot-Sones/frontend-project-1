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
