"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { HeroComposition } from "@/remotion/HeroComposition";
import {
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
  DURATION_FRAMES,
  FPS,
} from "@/remotion/constants";

// Subscribe to prefers-reduced-motion without calling setState inside useEffect,
// which React 19's react-hooks/set-state-in-effect rule forbids.
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getReducedMotionSnapshot = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionServerSnapshot = () => false;

export function HeroPlayer() {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Pause when off-screen; resume when visible.
  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    const player = playerRef.current;
    if (!el || !player) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (visible) {
          player.play();
        } else {
          player.pause();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  const ariaLabel =
    "Animation showing Damasqas resolving a production incident in 42 seconds: a P1 alert fires, the agent investigates, identifies a bad commit, rolls it back, and posts a resolved message to Slack.";

  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        aria-label={ariaLabel}
        role="img"
        style={{ width: "100%", height: "100%", position: "relative", overflow: "visible" }}
      >
        <Player
          component={HeroComposition}
          durationInFrames={DURATION_FRAMES}
          fps={FPS}
          compositionHeight={COMPOSITION_HEIGHT}
          compositionWidth={COMPOSITION_WIDTH}
          autoPlay={false}
          loop={false}
          controls={false}
          acknowledgeRemotionLicense
          initialFrame={60}
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={() => {
        const p = playerRef.current;
        if (!p) return;
        p.seekTo(0);
        p.play();
      }}
      aria-label={ariaLabel}
      role="img"
      className="hero-bounce"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "pointer",
        overflow: "visible",
      }}
    >
      <Player
        ref={playerRef}
        component={HeroComposition}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        compositionHeight={COMPOSITION_HEIGHT}
        compositionWidth={COMPOSITION_WIDTH}
        autoPlay
        loop={false}
        controls={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      />
    </div>
  );
}
