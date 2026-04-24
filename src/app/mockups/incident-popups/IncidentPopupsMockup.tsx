import styles from "./incident-popups.module.css";
import type { CSSProperties } from "react";

const demoUrl = "https://cal.com/shalin-patel-eq2u1j/30min";

function DamasqasAvatar() {
  return <span className={styles.dAvatar}>D</span>;
}

function AlertBadge() {
  return (
    <div className={`${styles.floatingCard} ${styles.alertCard}`}>
      <span className={styles.alertIcon}>A</span>
      <div>
        <div className={styles.cardMeta}>
          <strong>AlertManager</strong>
          <span>14:02</span>
        </div>
        <p>
          <b>P1</b> checkout · 5xx error rate 47%
        </p>
      </div>
    </div>
  );
}

function InvestigatingCard() {
  return (
    <div className={`${styles.floatingCard} ${styles.investigateCard}`}>
      <DamasqasAvatar />
      <div>
        <div className={styles.cardMeta}>
          <strong>damasqas</strong>
          <span>14:02</span>
        </div>
        <p>Investigating. Correlating deploys <i /></p>
      </div>
    </div>
  );
}

function RootCauseCard() {
  return (
    <div className={`${styles.floatingCard} ${styles.rootCauseCard}`}>
      <DamasqasAvatar />
      <div>
        <div className={styles.cardMeta}>
          <strong>damasqas</strong>
          <span>14:03</span>
        </div>
        <p>
          <strong>Root cause:</strong> commit <mark>3f82a</mark> caused empty
          cart checkout 500s.
        </p>
      </div>
    </div>
  );
}

function ResolvedCard() {
  return (
    <div className={`${styles.floatingCard} ${styles.resolvedCard}`}>
      <DamasqasAvatar />
      <div>
        <div className={styles.cardMeta}>
          <strong>damasqas</strong>
          <span>14:03</span>
        </div>
        <p>
          Rolled back. Error rate <mark>0.4%</mark>. Resolved in 42s.
        </p>
        <span className={styles.reaction}>🌙 2</span>
      </div>
    </div>
  );
}

function LogCard() {
  return (
    <div className={`${styles.floatingCard} ${styles.logCard}`}>
      <div className={styles.terminalDots}>
        <span />
        <span />
        <span />
      </div>
      <p className={styles.logTitle}>checkout.ts · log</p>
      <code>
        <span>14:02:31</span> <b>ERR</b> POST /checkout
        <strong>TypeError: cart.items undefined</strong>
        <em>at checkout.ts:142</em>
      </code>
    </div>
  );
}

function MetricCard() {
  return (
    <div className={`${styles.floatingCard} ${styles.metricCard}`}>
      <div>
        <strong>checkout.err · rate</strong>
        <span>0.04</span>
      </div>
      <svg viewBox="0 0 260 74" aria-hidden="true">
        <path d="M4 48 C42 44 64 46 92 46 S140 39 174 41 226 40 256 38" />
      </svg>
    </div>
  );
}

function PatchCard() {
  return (
    <div className={`${styles.floatingCard} ${styles.patchCard}`}>
      <span>3f82a</span>
      <b>&rarr;</b>
      <strong>a91fe</strong>
      <i>✓</i>
    </div>
  );
}

function VisualField() {
  return (
    <div className={styles.visualField} aria-label="Animated incident resolution cards">
      <div className={styles.dashedPathOne} />
      <div className={styles.dashedPathTwo} />
      <div className={styles.greenTrace} />
      <div className={styles.statusPill}><span /> auto-remediating</div>
      <div className={styles.initialBubble}>D</div>
      <AlertBadge />
      <InvestigatingCard />
      <RootCauseCard />
      <ResolvedCard />
      <LogCard />
      <MetricCard />
      <PatchCard />
    </div>
  );
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
    title: "Auto-remediates with rollbacks, restarts, and scaling.",
    detail:
      "The fix path appears as an approval-ready action: rollback the bad deploy, restart a stuck worker, or scale the hot service.",
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
];

function CapabilityVisual({ tone }: { tone: string }) {
  if (tone === "investigate") {
    return (
      <div className={`${styles.capVisual} ${styles.investigateVisual}`}>
        <div className={styles.noiseStack} aria-hidden="true">
          {["5xx spike", "cart timeout", "checkout log"].map((item, index) => (
            <span key={item} style={{ animationDelay: `${index * 140}ms` } as CSSProperties}>
              {item}
            </span>
          ))}
        </div>
        <div className={styles.investigationCore}>
          <strong>D</strong>
          <i />
        </div>
        <div className={styles.evidenceTrail}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.rootReport}>
          <span>Root cause</span>
          <strong>empty cart deploy</strong>
          <small>brief posted before Slack opens</small>
        </div>
      </div>
    );
  }

  if (tone === "correlate") {
    return (
      <div className={`${styles.capVisual} ${styles.correlateVisual}`}>
        <svg className={styles.correlationLines} viewBox="0 0 360 210" aria-hidden="true">
          <path d="M70 104 C112 36 252 36 292 104" />
          <path d="M68 105 C112 170 252 170 292 105" />
          <path d="M180 22 C178 76 178 132 180 188" />
          <path d="M82 62 C132 92 228 120 282 150" />
        </svg>
        <div className={styles.correlationCore}>
          <strong>D</strong>
          <span>94%</span>
        </div>
        {["logs", "deploy", "db", "stripe", "slack"].map((node, index) => (
          <span
            className={styles.signalNode}
            key={node}
            style={{ animationDelay: `${index * 110}ms` } as CSSProperties}
          >
            {node}
          </span>
        ))}
        <b className={styles.causalBadge}>causal graph</b>
      </div>
    );
  }

  if (tone === "remediate") {
    return (
      <div className={`${styles.capVisual} ${styles.remediateVisual}`}>
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
      <div className={`${styles.capVisual} ${styles.setupVisual}`}>
        <div className={styles.timerRing}><strong>5</strong><span>min</span></div>
        {["Slack", "GitHub", "Datadog"].map((tool, index) => (
          <span key={tool} style={{ animationDelay: `${index * 260}ms` } as CSSProperties}>
            <b>{index + 1}</b>
            {tool}
            <i />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`${styles.capVisual} ${styles.specialistVisual}`}>
      <svg viewBox="0 0 330 220" aria-hidden="true">
        <path d="M165 24 C236 24 294 76 294 118 S235 196 165 196 36 160 36 110 94 24 165 24" />
      </svg>
      <div className={styles.specialistCore}>SRE</div>
      {["Triage", "RCA", "Fix", "Memory"].map((step, index) => (
        <span key={step} style={{ animationDelay: `${index * 520}ms` } as CSSProperties}>
          <b>{index + 1}</b>
          {step}
        </span>
      ))}
    </div>
  );
}

function CapabilityCards() {
  return (
    <section className={styles.capabilities} id="capabilities">
      <div className={styles.capHeader}>
        <span className={styles.sectionLabel}>What it does</span>
        <h2>Each capability maps to a founder outcome.</h2>
        <p>
          The cards below translate the “AI SRE” promise into concrete jobs
          Damasqas performs during an incident.
        </p>
      </div>
      <div className={styles.capGrid}>
        {capabilities.map((capability) => (
          <article
            className={`${styles.capabilityCard} ${styles[capability.tone]}`}
            key={capability.title}
          >
            <div className={styles.capCopy}>
              <span>{capability.eyebrow}</span>
              <h3>{capability.title}</h3>
              <p>{capability.detail}</p>
            </div>
            <CapabilityVisual tone={capability.tone} />
            <b className={styles.capMetric}>{capability.metric}</b>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function IncidentPopupsMockup() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>
            <span />
            AI SRE · built for Slack
          </div>
          <h1>
            <span>Incidents resolved.</span>
            <em>Before you open your laptop.</em>
          </h1>
          <p>
            Damasqas is an AI agent built exclusively for site reliability. It
            connects to your monitoring, logs, and deployments, then{" "}
            <strong>
              triages alerts, investigates incidents, and remediates autonomously.
            </strong>
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href={demoUrl}>
              Request a demo
            </a>
            <a className={styles.secondary} href="#capabilities">
              See how it works &rarr;
            </a>
          </div>
        </div>
        <VisualField />
      </section>

      <CapabilityCards />

      <section className={styles.flow} id="flow">
        <span className={styles.sectionLabel}>The sequence</span>
        <h2>Every popup tells one part of the incident story.</h2>
        <div className={styles.flowGrid}>
          {[
            ["01", "Alert storm", "P1 alerts arrive as noisy symptoms, not answers."],
            ["02", "Correlation", "Damasqas ties logs, deploys, metrics, and Slack context together."],
            ["03", "Root cause", "The failure is explained in plain English with evidence."],
            ["04", "Resolution", "Rollback or fix plan appears for approval before the founder wakes up."],
          ].map(([num, title, copy]) => (
            <article key={num}>
              <b>{num}</b>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
