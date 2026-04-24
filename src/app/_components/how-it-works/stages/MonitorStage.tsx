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
