import styles from "./popup-options.module.css";

const demoUrl = "https://cal.com/shalin-patel-eq2u1j/30min";

function MiniGraph({ className = "" }: { className?: string }) {
  return (
    <svg className={`${styles.miniGraph} ${className}`} viewBox="0 0 260 80" aria-hidden="true">
      <path d="M6 50 C42 46 66 48 94 47 S142 38 176 41 226 38 254 35" />
    </svg>
  );
}

function SlackCard({
  className,
  avatar = "D",
  name = "damasqas",
  time = "14:03",
  children,
}: {
  className: string;
  avatar?: string;
  name?: string;
  time?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.popup} ${className}`}>
      <span className={avatar === "A" ? styles.alertAvatar : styles.dAvatar}>{avatar}</span>
      <div>
        <div className={styles.cardMeta}>
          <strong>{name}</strong>
          <span>{time}</span>
        </div>
        <p>{children}</p>
      </div>
    </div>
  );
}

function OptionOne() {
  return (
    <section className={`${styles.option} ${styles.optionOne}`} id="cascade">
      <div className={styles.copy}>
        <span className={styles.eyebrow}><i /> Option 01 · Slack Cascade</span>
        <h2>
          <span>Incidents resolved.</span>
          <em>Before you open your laptop.</em>
        </h2>
        <p>
          Closest to your reference: editorial white canvas, big founder-facing
          copy, and a cascade of incident cards that pop into place.
        </p>
        <div className={styles.actions}>
          <a href={demoUrl}>Request a demo</a>
          <a href="#orbit">See next option &rarr;</a>
        </div>
      </div>
      <div className={styles.stage}>
        <div className={styles.pathOne} />
        <div className={styles.pathTwo} />
        <SlackCard className={styles.cascadeAlert} avatar="A" name="AlertManager">
          <b>P1</b> checkout · 5xx error rate 47%
        </SlackCard>
        <SlackCard className={styles.cascadeInvestigate}>
          Investigating. Correlating deploys <span className={styles.dots} />
        </SlackCard>
        <div className={`${styles.darkLog} ${styles.cascadeLog}`}>
          <span />
          <span />
          <span />
          <code>
            <b>ERR</b> POST /checkout
            <strong>TypeError: cart.items undefined</strong>
          </code>
        </div>
        <SlackCard className={styles.cascadeRoot}>
          <strong>Root cause:</strong> commit <mark>3f82a</mark> broke empty cart checkout.
        </SlackCard>
        <SlackCard className={styles.cascadeResolved}>
          Rolled back. Error rate <mark>0.4%</mark>. Resolved in 42s.
        </SlackCard>
        <div className={styles.cascadeMetric}>
          <strong>checkout.err · rate</strong>
          <MiniGraph />
        </div>
      </div>
    </section>
  );
}

function OptionTwo() {
  return (
    <section className={`${styles.option} ${styles.optionTwo}`} id="orbit">
      <div className={styles.copy}>
        <span className={styles.eyebrow}><i /> Option 02 · Reliability Orbit</span>
        <h2>
          <span>Your AI SRE</span>
          <em>circles every incident.</em>
        </h2>
        <p>
          More premium and spatial: the right side feels like a live reliability
          constellation with cards orbiting around one Damasqas action center.
        </p>
        <div className={styles.actions}>
          <a href={demoUrl}>Book a demo</a>
          <a href="#timeline">See next option &rarr;</a>
        </div>
      </div>
      <div className={`${styles.stage} ${styles.orbitStage}`}>
        <div className={styles.orbitRing} />
        <div className={styles.orbitCore}>
          <span>D</span>
          <strong>Root cause found</strong>
          <p>rollback ready</p>
        </div>
        <div className={`${styles.orbitChip} ${styles.orbitOne}`}>5xx spike</div>
        <div className={`${styles.orbitChip} ${styles.orbitTwo}`}>deploy #138</div>
        <div className={`${styles.orbitChip} ${styles.orbitThree}`}>db pool</div>
        <div className={`${styles.orbitChip} ${styles.orbitFour}`}>Slack update</div>
        <div className={`${styles.orbitPanel} ${styles.orbitMetric}`}>
          <strong>error budget</strong>
          <MiniGraph />
        </div>
        <div className={`${styles.orbitPanel} ${styles.orbitFix}`}>
          <span>3f82a</span>
          <b>&rarr;</b>
          <strong>a91fe</strong>
          <i>✓</i>
        </div>
      </div>
    </section>
  );
}

function OptionThree() {
  return (
    <section className={`${styles.option} ${styles.optionThree}`} id="timeline">
      <div className={styles.copy}>
        <span className={styles.eyebrow}><i /> Option 03 · Founder Timeline</span>
        <h2>
          <span>From alert</span>
          <em>to fix in one chain.</em>
        </h2>
        <p>
          The most product-explanatory option: a clean incident timeline on the
          right, where every popup describes the next step Damasqas performs.
        </p>
        <div className={styles.actions}>
          <a href={demoUrl}>Request a demo</a>
          <a href="#cascade">Back to first option &uarr;</a>
        </div>
      </div>
      <div className={`${styles.stage} ${styles.timelineStage}`}>
        <div className={styles.timelineLine} />
        {[
          ["01", "Alert grouped", "43 noisy alerts became one checkout incident."],
          ["02", "Evidence pulled", "Logs, deploys, metrics, and Slack context matched."],
          ["03", "Root cause", "Commit 3f82a changed empty-cart handling."],
          ["04", "Fix ready", "Rollback plan generated and waiting for approval."],
        ].map(([num, title, text], index) => (
          <article className={styles.timelineCard} style={{ "--i": index } as React.CSSProperties} key={num}>
            <b>{num}</b>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
        <div className={`${styles.darkLog} ${styles.timelineLog}`}>
          <span />
          <span />
          <span />
          <code>
            <b>PATCH</b> checkout.ts
            <strong>guard cart.items before total()</strong>
          </code>
        </div>
      </div>
    </section>
  );
}

export default function PopupOptionsMockup() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <a href="#cascade">Cascade</a>
        <a href="#orbit">Orbit</a>
        <a href="#timeline">Timeline</a>
      </nav>
      <OptionOne />
      <OptionTwo />
      <OptionThree />
    </main>
  );
}
