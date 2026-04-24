"use client";

import { useEffect, useRef } from "react";
import styles from "./HowItWorks.module.css";
import { ConnectStage } from "./stages/ConnectStage";
import { SlackStage } from "./stages/SlackStage";
import { MonitorStage } from "./stages/MonitorStage";

const NODE_THRESHOLDS = [0.05, 0.45, 0.85] as const;

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const nodeRefs = useRef<Array<HTMLLIElement | null>>([null, null, null]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const viewportCenter = vh / 2;
      const raw = (viewportCenter - rect.top) / rect.height;
      const progress = Math.max(0, Math.min(1, raw));
      el.style.setProperty("--how-progress", String(progress));

      for (let i = 0; i < NODE_THRESHOLDS.length; i += 1) {
        const node = nodeRefs.current[i];
        if (!node) continue;
        const active = progress > NODE_THRESHOLDS[i];
        node.classList.toggle(styles.active, active);
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how"
      className={`section ${styles.section}`}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className="section-label reveal">03 / How it works</div>
          <h2 className="display-h2 reveal reveal-d1">
            Three steps. <span className="muted">Then it runs on its own.</span>
          </h2>
        </div>

        <div className={styles.steps}>
          <ol className={styles.rail} aria-hidden="true">
            <div className={styles.railTrack} />
            <div className={styles.railFill} />
            <li
              ref={(el) => {
                nodeRefs.current[0] = el;
              }}
              className={`${styles.railNode} ${styles.n1}`}
            >
              01
            </li>
            <li
              ref={(el) => {
                nodeRefs.current[1] = el;
              }}
              className={`${styles.railNode} ${styles.n2}`}
            >
              02
            </li>
            <li
              ref={(el) => {
                nodeRefs.current[2] = el;
              }}
              className={`${styles.railNode} ${styles.n3}`}
            >
              03
            </li>
          </ol>

          <div className={styles.stepsCol}>
            <article className={styles.step}>
              <div className={styles.stepBody}>
                <div className={styles.mobileNumeral}>01</div>
                <h3>Connect your stack</h3>
                <p>
                  Add monitoring, logging, deployment platforms, and repos.
                  Damasqas connects via MCP servers, read-only by default. It
                  learns your services, your topology, your SLOs.
                </p>
                <div className={styles.stepCaption}>
                  datadog · github · railway · pagerduty — grafana, aws,
                  kubernetes soon
                </div>
              </div>
              <div className={styles.stageFrame}>
                <ConnectStage />
              </div>
            </article>

            <article className={styles.step}>
              <div className={styles.stepBody}>
                <div className={styles.mobileNumeral}>02</div>
                <h3>Ask reliability questions in Slack</h3>
                <p>
                  Not &ldquo;write me a function.&rdquo; Real infrastructure
                  questions. Damasqas understands deployment state, service
                  health, and change history.
                </p>
              </div>
              <div className={styles.stageFrame}>
                <SlackStage />
              </div>
            </article>

            <article className={styles.step}>
              <div className={styles.stepBody}>
                <div className={styles.mobileNumeral}>03</div>
                <h3>Proactive monitoring + remediation</h3>
                <p>
                  Damasqas learns your service topology and auto-configures
                  monitoring: SLOs, error budgets, deployment health, and
                  dependency status, all tailored to your architecture.
                </p>
              </div>
              <div className={styles.stageFrame}>
                <MonitorStage />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
