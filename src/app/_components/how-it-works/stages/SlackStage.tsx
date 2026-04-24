"use client";

import { useInView } from "../useInView";
import styles from "./SlackStage.module.css";

export function SlackStage() {
  const { ref, hasEntered } = useInView<HTMLDivElement>();
  const className = `${styles.stage}${hasEntered ? ` ${styles.playing}` : ""}`;

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <div className={`${styles.msg} ${styles.userMsg}`}>
        <div className={styles.avatar}>SP</div>
        <div className={styles.body}>
          <div className={styles.name}>Shalin</div>
          <div className={styles.text}>
            <span className={styles.cmd}>@damasqas</span>{" "}
            <span className={`${styles.typing} ${styles.userTyping}`}>
              why is API latency spiking?
            </span>
          </div>
        </div>
      </div>

      <div className={styles.pills}>
        <span className={`${styles.pill} ${styles.pill1}`}>📊 datadog</span>
        <span className={`${styles.pill} ${styles.pill2}`}>🐙 github</span>
        <span className={`${styles.pill} ${styles.pill3}`}>🚂 railway</span>
      </div>

      <div className={`${styles.msg} ${styles.botMsg}`}>
        <div className={`${styles.avatar} ${styles.bot}`}>
          <img src="/cloud-logo-v2.jpg" alt="" />
        </div>
        <div className={styles.body}>
          <div className={styles.name}>damasqas</div>
          <div className={styles.text}>
            <span className={`${styles.typing} ${styles.botTyping}`}>
              Pool exhausted post-deploy. Fix in PR #92.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
