import { spring, useVideoConfig } from "remotion";
import { SPRING_CONFIG } from "../constants";
import styles from "../composition.module.css";

export interface Reaction {
  emoji: string;
  count: number;
  startFrame: number;
}

export interface EmojiReactionsProps {
  frame: number;
  reactions: Reaction[];
}

export function EmojiReactions({ frame, reactions }: EmojiReactionsProps) {
  const { fps } = useVideoConfig();

  return (
    <div className={styles.reactions}>
      {reactions.map((r) => {
        const local = frame - r.startFrame;
        // Use the shared SPRING_CONFIG (damping 18) — no overshoot, clean approach.
        const scale =
          local < 0
            ? 0
            : spring({
                frame: local,
                fps,
                config: SPRING_CONFIG,
                from: 0,
                to: 1,
              });
        const opacity = local < 0 ? 0 : Math.min(1, scale);
        return (
          <span
            key={r.emoji}
            className={styles.reaction}
            style={{
              transform: `scale(${scale})`,
              opacity,
              transformOrigin: "center",
            }}
          >
            {r.emoji}
            <span className={styles.reactionCount}>{r.count}</span>
          </span>
        );
      })}
    </div>
  );
}
