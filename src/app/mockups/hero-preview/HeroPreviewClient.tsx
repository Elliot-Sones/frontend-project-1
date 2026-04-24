"use client";

import { Player } from "@remotion/player";
import { HeroComposition } from "@/remotion/HeroComposition";
import {
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
  DURATION_FRAMES,
  FPS,
} from "@/remotion/constants";

export function HeroPreviewClient() {
  return (
    <div style={{ maxWidth: 1280, margin: "48px auto", padding: 24 }}>
      <h1 style={{ fontFamily: "system-ui", fontSize: 18, marginBottom: 16 }}>
        Hero composition preview
      </h1>
      <div
        style={{
          width: COMPOSITION_WIDTH,
          height: COMPOSITION_HEIGHT,
          margin: "0 auto",
          border: "1px solid #eee",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Player
          component={HeroComposition}
          durationInFrames={DURATION_FRAMES}
          fps={FPS}
          compositionHeight={COMPOSITION_HEIGHT}
          compositionWidth={COMPOSITION_WIDTH}
          autoPlay
          loop
          controls={false}
          acknowledgeRemotionLicense
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
