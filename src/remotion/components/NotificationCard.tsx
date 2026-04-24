import { interpolate, spring, useVideoConfig } from "remotion";
import { BEATS, SPRING_CONFIG } from "../constants";
import type { Notification } from "../notifications";
import { IntegrationIcon } from "./IntegrationIcon";
import styles from "../composition.module.css";

export interface NotificationCardProps {
  notification: Notification;
  frame: number;
}

/** Compute scale + opacity for a card at a given frame. */
function useCardMotion(
  frame: number,
  enterFrame: number,
  targetOpacity: number,
  fps: number
) {
  const local = frame - enterFrame;

  // Scale: 0.5 → 1.0 via spring once entered
  const scale =
    local < 0
      ? 0.5
      : spring({
          frame: local,
          fps,
          config: SPRING_CONFIG,
          from: 0.5,
          to: 1,
        });

  // Opacity: linear ramp 0 → targetOpacity over 7 frames (~230ms)
  const entryOpacity =
    local < 0 ? 0 : Math.min(1, local / 7) * targetOpacity;

  // Global fade: all cards fade 1 → 0 over the last 15 frames
  const globalFade = interpolate(
    frame,
    [BEATS.globalFadeStart, BEATS.loopEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return {
    scale,
    opacity: entryOpacity * globalFade,
  };
}

/** Hero-only: green bloom intensity 0→1→0.15 across its entry window. Pure function, not a hook. */
function heroBloom(frame: number): number {
  const t = frame - BEATS.heroEnter;
  return interpolate(
    t,
    [0, BEATS.heroBloomPeak - BEATS.heroEnter, BEATS.heroBloomRest - BEATS.heroEnter],
    [0, 1, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

/** Hero-only: scale multiplier 1.0 → 1.04 → 1.0 during bloom window. Overshoot is intentional for the hero only. */
function heroScaleBoost(frame: number): number {
  const t = frame - BEATS.heroEnter;
  return interpolate(
    t,
    [0, BEATS.heroBloomPeak - BEATS.heroEnter, BEATS.heroBloomRest - BEATS.heroEnter],
    [1, 1.04, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

export function NotificationCard({ notification, frame }: NotificationCardProps) {
  const { fps } = useVideoConfig();
  const { position, integration, title, body, time, enterFrame, isHero } = notification;

  const { scale, opacity } = useCardMotion(frame, enterFrame, position.opacity, fps);
  const effectiveScale = isHero ? scale * heroScaleBoost(frame) : scale;

  // Compose transform: translate to [left,top] anchor, then Z + rotations + scale.
  const transform = [
    `translate(0, -50%)`,
    `translateZ(${position.translateZ}px)`,
    `rotateY(${position.rotateY}deg)`,
    `rotateX(${position.rotateX}deg)`,
    `rotate(${position.rotateZ}deg)`,
    `scale(${effectiveScale})`,
  ].join(" ");

  // Base shadow scales with depth. Hero adds an animated green bloom.
  const depthShadow =
    position.translateZ >= 0
      ? `0 ${Math.round(20 + position.translateZ * 0.1)}px ${Math.round(40 + position.translateZ * 0.2)}px rgba(0,0,0,0.13)`
      : `0 ${Math.round(12 + Math.abs(position.translateZ) * 0.02)}px ${Math.round(24 + Math.abs(position.translateZ) * 0.05)}px rgba(0,0,0,0.08)`;

  let boxShadow = depthShadow;
  if (isHero) {
    const bloom = heroBloom(frame);
    const glowAlpha = 0.12 + bloom * 0.33; // 0.12 rest → 0.45 peak
    boxShadow = `
      0 1px 2px rgba(0,0,0,0.04),
      0 ${20 + bloom * 6}px ${40 + bloom * 12}px rgba(107, 138, 92, ${glowAlpha}),
      0 46px 80px rgba(0,0,0,0.16)
    `;
  }

  const filter = position.blur && position.blur > 0 ? `blur(${position.blur}px)` : undefined;

  const cardClass = isHero ? `${styles.card} ${styles.cardHero}` : styles.card;

  return (
    <div
      className={cardClass}
      style={{
        left: position.left,
        top: position.top,
        width: position.width,
        transform,
        opacity,
        boxShadow,
        filter,
        zIndex: position.zIndex,
      }}
    >
      <IntegrationIcon integration={integration} isHero={isHero} />
      <div className={styles.body}>
        <div className={styles.head}>
          <span className={styles.src}>{sourceLabel(integration)}</span>
          <span className={styles.time}>{time}</span>
        </div>
        <div className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
        {body && (
          <div className={styles.text} dangerouslySetInnerHTML={{ __html: body }} />
        )}
      </div>
    </div>
  );
}

function sourceLabel(integration: Notification["integration"]): string {
  switch (integration) {
    case "datadog": return "Datadog";
    case "pagerduty": return "PagerDuty";
    case "slack": return "Slack";
    case "jira": return "Jira";
    case "github": return "GitHub";
    case "damasqas": return "Damasqas";
  }
}
