import styles from "./incident-popups.module.css";

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
            <a className={styles.secondary} href="#flow">
              See how it works &rarr;
            </a>
          </div>
        </div>
        <VisualField />
      </section>

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
