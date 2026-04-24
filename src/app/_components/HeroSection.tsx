import { HeroPlayer } from "./HeroPlayer";
import styles from "./HeroSection.module.css";

const demoUrl = "https://cal.com/shalin-patel-eq2u1j/30min";

export function HeroSection() {
  return (
    <section className={styles.heroShell}>
      <div className={styles.heroCopy}>
        <div className={styles.eyebrow}>
          <span />
          AI SRE · Built for Slack
        </div>
        <h1>
          <strong>Incidents resolved.</strong>
          <em>Before you open your laptop.</em>
        </h1>
        <p>
          Damasqas is an AI agent built exclusively for site reliability. It
          connects to your monitoring, logs, and deployments, then{" "}
          <b>
            triages alerts, investigates incidents, and remediates autonomously.
          </b>
        </p>
        <div className={styles.heroActions}>
          <a className={styles.primaryCta} href={demoUrl}>
            Request a demo
          </a>
          <a className={styles.secondaryCta} href="#how">
            See how it works →
          </a>
        </div>
      </div>

      <div className={styles.animationWrap}>
        <HeroPlayer />
      </div>
    </section>
  );
}
