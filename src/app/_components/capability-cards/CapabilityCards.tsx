"use client";

import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import styles from "./CapabilityCards.module.css";

const demoUrl = "https://cal.com/shalin-patel-pvh97i/30min";

function handleCardClick(e: MouseEvent<HTMLElement>) {
  if ((e.target as HTMLElement).closest("a")) return;
  window.open(demoUrl, "_blank", "noopener,noreferrer");
}

function handleCardKey(e: KeyboardEvent<HTMLElement>) {
  if (e.key !== "Enter" && e.key !== " ") return;
  if ((e.target as HTMLElement).closest("a")) return;
  e.preventDefault();
  window.open(demoUrl, "_blank", "noopener,noreferrer");
}

const capabilities = [
  {
    eyebrow: "Investigate before Slack",
    title: "Investigates incidents before you even open Slack.",
    detail:
      "Damasqas starts from the alert, reads the surrounding logs and deploy history, then posts a plain-English incident brief.",
    metric: "14:02 -> 14:03",
    tone: "investigate",
  },
  {
    eyebrow: "Correlation engine",
    title: "Correlates deploys, config changes, infra events, and third-party outages.",
    detail:
      "It stitches your scattered signals into one causal graph instead of making founders jump between tabs.",
    metric: "6 systems linked",
    tone: "correlate",
  },
  {
    eyebrow: "Autonomous actions",
    title: "Auto-remediates with one click.",
    detail:
      "Rollback a bad deploy, restart a stuck worker, or scale a hot service — all approval-ready.",
    metric: "1-click approve",
    tone: "remediate",
  },
  {
    eyebrow: "Startup setup",
    title: "Free tier, 5-minute setup, no sales call required.",
    detail:
      "Connect Slack, GitHub, and your observability stack quickly enough to test it against a real incident the same day.",
    metric: "5 min",
    tone: "setup",
  },
  {
    eyebrow: "Specialist intelligence",
    title: "Purpose-built SRE intelligence, not a generic AI bolted onto monitoring.",
    detail:
      "Damasqas is shaped around production reliability workflows: triage, root cause, remediation, and memory.",
    metric: "SRE-native",
    tone: "specialist",
  },
] as const;

function CapabilityVisual({ tone }: { tone: (typeof capabilities)[number]["tone"] }) {
  if (tone === "investigate") {
    return (
      <div className={`${styles.visual} ${styles.investigateVisual}`}>
        <div className={styles.alertStorm}>
          <strong>Alert storm</strong>
          <span>P1</span>
          <span>5xx</span>
          <span>cart</span>
          <span>logs</span>
        </div>
        <div className={styles.investigationPipe} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className={styles.agentWorkbench}>
          <div className={styles.agentHeader}>
            <b>D</b>
            <span>reading logs + deploys</span>
          </div>
          <div className={styles.logSweep}>
            <i />
            <i />
            <i />
          </div>
          <mark>checkout.ts:142</mark>
          <small>commit 3f82a introduced empty cart crash</small>
        </div>
        <div className={styles.briefOutput}>
          <strong>Slack brief ready</strong>
          <span>Root cause found</span>
          <span>Rollback suggested</span>
        </div>
      </div>
    );
  }

  if (tone === "correlate") {
    return (
      <div className={`${styles.visual} ${styles.correlateVisual}`}>
        <div className={styles.correlationScanner}>
          <div className={styles.scanWash} />
          {[
            ["deploy", "commit 3f82a", "MATCH", styles.matchLane],
            ["config", "flags unchanged", "clear", styles.clearLane],
            ["infra", "cpu + db normal", "clear", styles.clearLane],
            ["third-party", "stripe healthy", "clear", styles.clearLane],
          ].map(([source, signal, state, laneClass], index) => (
            <div
              className={`${styles.signalLane} ${laneClass}`}
              key={source}
              style={{ animationDelay: `${index * 180}ms` } as CSSProperties}
            >
              <span>{source}</span>
              <div>
                <strong>{signal}</strong>
                <b />
              </div>
              <i>{state}</i>
            </div>
          ))}
        </div>
        <div className={styles.correlationResult}>
          <b>D</b>
          <div>
            <span>Cause locked</span>
            <strong>deploy changed first; infra, config, and Stripe ruled out</strong>
          </div>
        </div>
      </div>
    );
  }

  if (tone === "remediate") {
    return (
      <div className={`${styles.visual} ${styles.remediateVisual}`}>
        <div className={styles.errorGraph}>
          <span>47%</span>
          <svg viewBox="0 0 240 70" aria-hidden="true">
            <path d="M5 18 C45 18 48 55 88 55 S124 16 164 16 198 50 235 50" />
          </svg>
        </div>
        <div className={styles.rollbackAction}>
          <span>3f82a</span>
          <b />
          <strong>a91fe</strong>
        </div>
        <div className={styles.approvalPulse}>Approve rollback</div>
        <div className={styles.recoveryMini}>0.4% recovered</div>
      </div>
    );
  }

  if (tone === "setup") {
    return (
      <div className={`${styles.visual} ${styles.setupVisual}`}>
        <div className={styles.timerRing}>
          <strong>5</strong>
          <span>min</span>
        </div>
        {["Slack", "GitHub", "Datadog"].map((tool, index) => (
          <a
            key={tool}
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Book a demo — connect ${tool}`}
            style={{ animationDelay: `${index * 260}ms` } as CSSProperties}
          >
            <b>{index + 1}</b>
            {tool}
            <i />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`${styles.visual} ${styles.specialistVisual}`}>
      <svg viewBox="0 0 330 220" aria-hidden="true">
        <path d="M165 24 C236 24 294 76 294 118 S235 196 165 196 36 160 36 110 94 24 165 24" />
      </svg>
      <a
        className={styles.specialistCore}
        href={demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book a demo — purpose-built SRE intelligence"
      >
        SRE
      </a>
      {["Triage", "RCA", "Fix", "Memory"].map((step, index) => (
        <a
          key={step}
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Book a demo — ${step}`}
          style={{ animationDelay: `${index * 520}ms` } as CSSProperties}
        >
          <b>{index + 1}</b>
          {step}
        </a>
      ))}
    </div>
  );
}

export function CapabilityCards() {
  return (
    <section className={styles.section} aria-label="Damasqas capabilities">
      <div className={styles.grid}>
        {capabilities.map((capability) => (
          <article
            className={`${styles.card} ${styles[capability.tone]}`}
            key={capability.title}
            role="link"
            tabIndex={0}
            aria-label={`Book a demo — ${capability.title}`}
            onClick={handleCardClick}
            onKeyDown={handleCardKey}
          >
            <div className={styles.copy}>
              <span>{capability.eyebrow}</span>
              <h2>{capability.title}</h2>
              {capability.tone !== "correlate" ? <p>{capability.detail}</p> : null}
            </div>
            <CapabilityVisual tone={capability.tone} />
            <b className={styles.metric}>{capability.metric}</b>
          </article>
        ))}
      </div>
    </section>
  );
}
