import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AgentOrb } from "./components/AgentOrb";
import { CommitBadge } from "./components/CommitBadge";
import { Connector, ConnectorSvg } from "./components/Connector";
import { EmojiReactions } from "./components/EmojiReactions";
import { GraphCard } from "./components/GraphCard";
import { LogTerminal } from "./components/LogTerminal";
import { PulseRing } from "./components/PulseRing";
import { SlackCard } from "./components/SlackCard";
import { TickerBadge } from "./components/TickerBadge";
import { BEATS, SPRING_CONFIG } from "./constants";
import styles from "./composition.module.css";

// Drives a single spring-in entry that stays visible, then fades during the
// global fade-out window at the end of the loop.
function useEntry(frame: number, startFrame: number, fps: number) {
  const local = frame - startFrame;
  const entered =
    local < 0
      ? 0
      : spring({ frame: local, fps, config: SPRING_CONFIG, from: 0, to: 1 });
  const fadeOut = interpolate(
    frame,
    [BEATS.globalFadeOut, BEATS.loopEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return {
    opacity: entered * fadeOut,
    translateY: (1 - entered) * 20,
  };
}

export function HeroComposition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const alertEntry = useEntry(frame, BEATS.alert, fps);
  const investigatingEntry = useEntry(frame, BEATS.investigating, fps);
  const rootCauseEntry = useEntry(frame, BEATS.rootCause, fps);
  const resolvedEntry = useEntry(frame, BEATS.resolved, fps);
  const logEntry = useEntry(frame, BEATS.logTerminal, fps);
  const graphEntry = useEntry(frame, BEATS.errorGraph, fps);
  const commitEntry = useEntry(frame, BEATS.commitBadge, fps);
  const orbEntry = useEntry(frame, BEATS.orb, fps);

  const graphProgress = interpolate(
    frame,
    [BEATS.graphMorph, BEATS.graphMorph + 24],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const greenBloom = interpolate(
    frame,
    [BEATS.greenBloom, BEATS.greenBloom + 12, BEATS.greenBloom + 24],
    [0, 1, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const commitDriftY = Math.sin((frame - BEATS.commitBadge) / 30) * 4;

  const connector1Progress = interpolate(
    frame,
    [BEATS.connector1, BEATS.connector1 + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const connector2Progress = interpolate(
    frame,
    [BEATS.connector2, BEATS.connector2 + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const connector3Progress = interpolate(
    frame,
    [BEATS.commitBadge, BEATS.commitBadge + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const connectorsFade = interpolate(
    frame,
    [BEATS.globalFadeOut, BEATS.loopEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ overflow: "visible" }}>
      {/* Ticker top-right */}
      <div style={{ position: "absolute", top: 28, right: 32, zIndex: 10 }}>
        <TickerBadge frame={frame} />
      </div>

      {/* Connectors */}
      <ConnectorSvg>
        <Connector
          d="M438 162 C526 205 558 256 638 310"
          length={240}
          progress={connector1Progress * connectorsFade}
        />
        <Connector
          d="M620 314 C710 365 756 440 800 530"
          length={260}
          progress={connector2Progress * connectorsFade}
        />
        <Connector
          d="M452 344 C560 330 638 390 726 460"
          length={270}
          progress={connector3Progress * connectorsFade}
        />
      </ConnectorSvg>

      {/* Pulse ring under alert card */}
      <PulseRing
        frame={frame}
        startFrame={BEATS.alertPulse}
        style={{ position: "absolute", top: 92, left: 180 }}
      />

      {/* Alert card */}
      <SlackCard
        logo="alert"
        title="AlertManager"
        time="14:02"
        variant="alert"
        style={{
          position: "absolute",
          top: 70,
          left: 155,
          width: 470,
          opacity: alertEntry.opacity,
          transform: `translateY(${alertEntry.translateY}px) rotate(-2deg)`,
        }}
      >
        <span className={styles.pill}>P1</span> checkout · 5xx error rate{" "}
        <b>47%</b>
      </SlackCard>

      {/* Investigating card */}
      <SlackCard
        logo="damasqas"
        title="damasqas"
        time="14:02"
        style={{
          position: "absolute",
          top: 225,
          left: 365,
          width: 520,
          opacity: investigatingEntry.opacity,
          transform: `translateY(${investigatingEntry.translateY}px)`,
        }}
      >
        Investigating. Correlating deploys
      </SlackCard>

      {/* Log terminal — types in lines + yellow sweep on bug line */}
      <LogTerminal
        frame={frame}
        style={{
          position: "absolute",
          top: 356,
          left: 170,
          width: 356,
          opacity: logEntry.opacity,
          transform: `translateY(${logEntry.translateY}px)`,
        }}
      />

      {/* Root cause card */}
      <SlackCard
        logo="damasqas"
        title="damasqas"
        time="14:03"
        style={{
          position: "absolute",
          top: 360,
          left: 530,
          width: 530,
          opacity: rootCauseEntry.opacity,
          transform: `translateY(${rootCauseEntry.translateY}px)`,
        }}
      >
        Root cause: commit <mark>3f82a</mark> — checkout 500 on empty cart.
      </SlackCard>

      {/* Graph card — red → green morph at BEATS.graphMorph */}
      <GraphCard
        progress={graphProgress}
        style={{
          position: "absolute",
          right: 68,
          top: 250,
          width: 274,
          opacity: graphEntry.opacity,
          transform: `translateY(${graphEntry.translateY}px) rotate(1.5deg)`,
        }}
      />

      {/* Resolved card with green bloom + emoji reactions */}
      <SlackCard
        logo="damasqas"
        title="damasqas"
        time="14:03"
        variant="ok"
        style={{
          position: "absolute",
          top: 492,
          left: 470,
          width: 560,
          opacity: resolvedEntry.opacity,
          transform: `translateY(${resolvedEntry.translateY}px)`,
          boxShadow: `0 20px 70px rgba(28, 28, 24, 0.1), 0 ${
            16 * greenBloom
          }px ${40 * greenBloom}px rgba(107, 138, 92, ${
            0.3 * greenBloom
          }), 0 0 ${30 * greenBloom}px rgba(107, 138, 92, ${0.2 * greenBloom})`,
        }}
      >
        Rolled back. Error rate <mark>0.4%</mark>. Resolved in 42s.
        <EmojiReactions
          frame={frame}
          reactions={[
            { emoji: "🙏", count: 7, startFrame: BEATS.emoji1 },
            { emoji: "✅", count: 4, startFrame: BEATS.emoji2 },
            { emoji: "😴", count: 2, startFrame: BEATS.emoji3 },
          ]}
        />
      </SlackCard>

      {/* Commit badge — enters with spring, idle sine drift */}
      <CommitBadge
        style={{
          position: "absolute",
          right: 78,
          bottom: 50,
          opacity: commitEntry.opacity,
          transform: `translateY(${
            commitEntry.translateY + commitDriftY
          }px) rotate(4deg)`,
        }}
      />

      {/* Agent orb (Three.js, decorative) */}
      <div
        style={{
          position: "absolute",
          right: -16,
          top: 82,
          width: 154,
          height: 154,
          opacity: orbEntry.opacity,
          transform: `translateY(${orbEntry.translateY}px)`,
        }}
      >
        <AgentOrb />
      </div>
    </AbsoluteFill>
  );
}
