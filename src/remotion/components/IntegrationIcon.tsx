import styles from "../composition.module.css";
import type { Integration } from "../notifications";

const MONOGRAMS: Record<Integration, string> = {
  datadog: "DD",
  pagerduty: "PD",
  slack: "SL",
  jira: "JR",
  github: "GH",
  damasqas: "D",
};

const GRADIENT_CLASS: Record<Integration, string> = {
  datadog: styles.gradDatadog,
  pagerduty: styles.gradPagerduty,
  slack: styles.gradSlack,
  jira: styles.gradJira,
  github: styles.gradGithub,
  damasqas: styles.gradDamasqas,
};

export interface IntegrationIconProps {
  integration: Integration;
  isHero?: boolean;
}

export function IntegrationIcon({ integration, isHero = false }: IntegrationIconProps) {
  const sizeClass = isHero ? styles.iconHero : "";
  return (
    <div
      className={`${styles.icon} ${GRADIENT_CLASS[integration]} ${sizeClass}`}
      aria-hidden="true"
    >
      {MONOGRAMS[integration]}
    </div>
  );
}
