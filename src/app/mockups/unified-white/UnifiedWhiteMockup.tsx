"use client";

import { Player } from "@remotion/player";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import styles from "./unified-white.module.css";

const demoUrl = "https://cal.com/shalin-patel-eq2u1j/30min";

function MiniChart() {
  const frame = useCurrentFrame();
  const progress = interpolate(frame % 240, [0, 80, 160, 240], [0, 1, 0.35, 0]);

  return (
    <div className={styles.metricCard}>
      <div className={styles.metricHeader}>
        <span>checkout.err · rate</span>
        <b>{progress > 0.5 ? "0.04" : "0.47"}</b>
      </div>
      <svg viewBox="0 0 270 92" aria-hidden="true">
        <path
          className={styles.chartGhost}
          d="M8 66 C50 54 82 72 118 52 S190 38 262 44"
        />
        <path
          className={styles.chartLine}
          d={
            progress > 0.5
              ? "M8 66 C58 63 88 65 122 62 S196 61 262 61"
              : "M8 66 C50 54 82 72 118 52 S190 38 262 44"
          }
        />
      </svg>
    </div>
  );
}

function SlackCard({
  className,
  logo,
  title,
  time,
  children,
}: {
  className: string;
  logo: "alert" | "damasqas";
  title: string;
  time: string;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.slackCard} ${className}`}>
      <div className={logo === "alert" ? styles.alertIcon : styles.botIcon}>
        {logo === "alert" ? "A" : "D"}
      </div>
      <div>
        <div className={styles.cardMeta}>
          <strong>{title}</strong>
          <span>{time}</span>
        </div>
        <p>{children}</p>
      </div>
    </div>
  );
}

function IncidentConstellation() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const typingDots = Math.floor((frame / 13) % 4);
  const drift = interpolate(frame % 240, [0, 120, 240], [0, 1, 0]);
  const resolved = frame % 240 > 138;

  return (
    <AbsoluteFill className={styles.motionStage}>
      <svg className={styles.connectorLines} viewBox="0 0 980 660" aria-hidden="true">
        <path
          d="M438 162 C526 205 558 256 638 310"
          style={{ strokeDashoffset: interpolate(frame, [20, 82], [240, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) }}
        />
        <path
          d="M620 314 C710 365 756 440 800 530"
          style={{ strokeDashoffset: interpolate(frame, [62, 128], [260, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) }}
        />
        <path
          d="M452 344 C560 330 638 390 726 460"
          style={{ strokeDashoffset: interpolate(frame, [92, 156], [270, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) }}
        />
      </svg>

      <SlackCard
        className={styles.alertCard}
        logo="alert"
        title="AlertManager"
        time="14:02"
      >
        <span className={styles.pill}>P1</span> checkout · 5xx error rate{" "}
        <b>47%</b>
      </SlackCard>

      <SlackCard
        className={styles.investigatingCard}
        logo="damasqas"
        title="damasqas"
        time="14:02"
      >
        Investigating. Correlating deploys{" "}
        <span className={styles.dots}>{"•".repeat(typingDots + 1)}</span>
      </SlackCard>

      <div className={styles.logCard}>
        <div className={styles.windowDots}>
          <span />
          <span />
          <span />
          <b>checkout.ts · log</b>
        </div>
        <p>
          <em>14:02:31</em> <strong>ERR</strong> POST /checkout
        </p>
        <code>TypeError: cart.items undefined</code>
        <small>at checkout.ts:142</small>
      </div>

      <SlackCard
        className={styles.rootCauseCard}
        logo="damasqas"
        title="damasqas"
        time="14:03"
      >
        Root cause: commit <mark>3f82a</mark> — checkout 500 on empty cart.
      </SlackCard>

      <SlackCard
        className={styles.resolvedCard}
        logo="damasqas"
        title="damasqas"
        time="14:03"
      >
        Rolled back. Error rate <mark>{resolved ? "0.4%" : "8.1%"}</mark>.
        Resolved in 42s.
      </SlackCard>

      <MiniChart />

      <div
        className={styles.commitSwap}
        style={{
          transform: `translateY(${Math.sin(drift * Math.PI) * -10}px) rotate(4deg)`,
          opacity: enter,
        }}
      >
        <span>3f82a</span>
        <b>→</b>
        <span>a91fe</span>
        <i>✓</i>
      </div>
    </AbsoluteFill>
  );
}

function DamasqasOrb() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0x24478b,
        metalness: 0.28,
        roughness: 0.34,
      })
    );
    scene.add(orb);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.13, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0x7294ff,
        transparent: true,
        opacity: 0.16,
      })
    );
    scene.add(glow);

    scene.add(new THREE.AmbientLight(0xffffff, 2.1));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(-1.6, 2.2, 3);
    scene.add(key);
    const rim = new THREE.PointLight(0x8fb1ff, 18, 8);
    rim.position.set(2, -1, 2);
    scene.add(rim);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = performance.now() / 1000;
      orb.rotation.y = t * 0.58;
      orb.rotation.x = Math.sin(t * 0.8) * 0.12;
      glow.scale.setScalar(1 + Math.sin(t * 1.6) * 0.035);
      renderer.render(scene, camera);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      orb.geometry.dispose();
      glow.geometry.dispose();
      (orb.material as THREE.Material).dispose();
      (glow.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={styles.orbWrap} aria-hidden="true">
      <canvas ref={canvasRef} />
      <span>D</span>
    </div>
  );
}

export default function UnifiedWhiteMockup() {
  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <p>Damasqas hero · unified white · richer animation</p>
        <span>LIVE · 8S LOOP</span>
      </div>

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
            <b>triages alerts, investigates incidents, and remediates autonomously.</b>
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryCta} href={demoUrl}>
              Request a demo
            </a>
            <a className={styles.secondaryCta} href="#workflow">
              See how it works →
            </a>
          </div>
        </div>

        <div className={styles.animationWrap}>
          <div className={styles.blackStatus}>
            <span />
          </div>
          <DamasqasOrb />
          <Player
            component={IncidentConstellation}
            durationInFrames={240}
            fps={30}
            compositionHeight={660}
            compositionWidth={980}
            autoPlay
            loop
            controls={false}
            acknowledgeRemotionLicense
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
            }}
          />
        </div>
      </section>

      <section className={styles.explainer} id="workflow">
        <div>
          <strong>Unified white canvas</strong> · no visible split. Slack-native
          incident story, calm evidence cards, and a frame-accurate remediation loop.
        </div>
        <div className={styles.beats}>
          {[
            "alert",
            "connector",
            "log typing",
            "graph draw",
            "commit swap",
            "orb glow",
            "reactions",
            "green bloom",
          ].map((beat) => (
            <span key={beat}>{beat}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
