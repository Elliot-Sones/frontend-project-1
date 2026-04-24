"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { HeroComposition } from "@/remotion/HeroComposition";
import { DURATION_FRAMES, FPS } from "@/remotion/constants";

export function HeroPlayer() {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

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
        style={{ width: "100%", height: "100%", position: "relative" }}
      >
        <Player
          component={HeroComposition}
          durationInFrames={DURATION_FRAMES}
          fps={FPS}
          compositionHeight={660}
          compositionWidth={980}
          autoPlay={false}
          loop={false}
          controls={false}
          acknowledgeRemotionLicense
          initialFrame={200}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => playerRef.current?.pause()}
      onMouseLeave={() => playerRef.current?.play()}
      onClick={() => {
        const p = playerRef.current;
        if (!p) return;
        p.seekTo(0);
        p.play();
      }}
      aria-label={ariaLabel}
      role="img"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <Player
        ref={playerRef}
        component={HeroComposition}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        compositionHeight={660}
        compositionWidth={980}
        autoPlay
        loop
        controls={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
