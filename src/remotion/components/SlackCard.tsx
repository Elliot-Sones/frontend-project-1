import type { CSSProperties, ReactNode } from "react";
import styles from "../composition.module.css";

export type SlackCardVariant = "alert" | "neutral" | "ok";
export type SlackCardLogo = "alert" | "damasqas";

export interface SlackCardProps {
  logo: SlackCardLogo;
  title: string;
  time: string;
  variant?: SlackCardVariant;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const variantClass: Record<SlackCardVariant, string> = {
  alert: styles.slackCardAlert,
  neutral: "", // CSS Module returns `undefined` for empty rulesets — avoid literal "undefined" in class attr
  ok: styles.slackCardOk,
};

export function SlackCard({
  logo,
  title,
  time,
  variant = "neutral",
  className = "",
  style,
  children,
}: SlackCardProps) {
  return (
    <div
      className={`${styles.slackCard} ${variantClass[variant]} ${className}`}
      style={style}
    >
      <div className={logo === "alert" ? styles.alertIcon : styles.botIcon}>
        {logo === "alert" ? "A" : "D"}
      </div>
      <div>
        <div className={styles.cardMeta}>
          <strong>{title}</strong>
          <span>{time}</span>
        </div>
        {/* div (not p) so nested divs like <EmojiReactions> produce valid HTML */}
        <div className={styles.slackCardBody}>{children}</div>
      </div>
    </div>
  );
}
