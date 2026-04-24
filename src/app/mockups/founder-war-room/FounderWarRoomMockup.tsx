"use client";

import { Player } from "@remotion/player";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import Link from "next/link";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import styles from "./founder-war-room.module.css";

const demoUrl = "https://cal.com/shalin-patel-eq2u1j/30min";

function IncidentFilm() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const sweep = interpolate(frame % 150, [0, 150], [-35, 135]);
  const graphShift = interpolate(frame % 180, [0, 90, 180], [0, 1, 0]);

  return (
    <AbsoluteFill className={styles.film}>
      <div className={styles.filmGrid} />
      <div
        className={styles.radarSweep}
        style={{ transform: `translateX(${sweep}%) rotate(-18deg)` }}
      />
      <div className={styles.filmHeader}>
        <div>
          <span className={styles.filmEyebrow}>Live incident</span>
          <strong>checkout-api latency spike</strong>
        </div>
        <span className={styles.filmStatus}>Auto-triaging</span>
      </div>
      <div className={styles.signalRows}>
        {[
          ["43 alerts grouped", "#fff15a"],
          ["Deploy #138 correlated", "#16f0a6"],
          ["DB pool exhaustion isolated", "#68d8ff"],
        ].map(([label, color], index) => (
          <div
            className={styles.signalRow}
            key={label}
            style={{
              opacity: interpolate(frame, [index * 14, index * 14 + 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(
                frame,
                [index * 14, index * 14 + 18],
                [18, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )}px)`,
            }}
          >
            <span style={{ backgroundColor: color }} />
            <p>{label}</p>
            <b>{index === 2 ? "root cause" : "verified"}</b>
          </div>
        ))}
      </div>
      <div className={styles.graphCluster}>
        {["web", "api", "db", "queue", "stripe"].map((node, index) => (
          <div
            className={`${styles.graphNode} ${index === 2 ? styles.hotNode : ""}`}
            key={node}
            style={{
              transform: `translate3d(${Math.sin(index + graphShift) * 10}px, ${
                Math.cos(index + graphShift) * 7
              }px, 0) scale(${index === 2 ? 1 + pulse * 0.08 : 1})`,
            }}
          >
            {node}
          </div>
        ))}
        <svg className={styles.graphLines} viewBox="0 0 520 260" aria-hidden="true">
          <path d="M80 120 C160 40 230 52 290 128 S410 220 470 94" />
          <path d="M120 202 C190 146 270 164 340 86" />
          <path d="M250 46 C250 124 252 176 256 230" />
        </svg>
      </div>
      <div className={styles.remediationCard}>
        <span>Remediation ready</span>
        <strong>Rollback deploy #138?</strong>
        <p>Safe plan generated. Tests passing in sandbox. Waiting on approval.</p>
      </div>
    </AbsoluteFill>
  );
}

function ThreeSignalField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    const key = new THREE.DirectionalLight(0xffffff, 3.4);
    key.position.set(2.4, 3.2, 4.5);
    const rim = new THREE.PointLight(0x66ffe2, 20, 12);
    rim.position.set(-2.2, -1.2, 3.4);
    scene.add(ambient, key, rim);

    const shapes: THREE.Mesh[] = [];
    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0x16f0a6,
        metalness: 0.24,
        roughness: 0.28,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xff5a1f,
        metalness: 0.18,
        roughness: 0.32,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xfff15a,
        metalness: 0.1,
        roughness: 0.36,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x2f63ff,
        metalness: 0.3,
        roughness: 0.22,
      }),
    ];
    const geometries = [
      new THREE.BoxGeometry(1, 1, 0.35, 3, 3, 1),
      new THREE.IcosahedronGeometry(0.65, 1),
      new THREE.TorusGeometry(0.54, 0.16, 18, 44),
      new THREE.CapsuleGeometry(0.34, 0.72, 8, 20),
    ];

    const coordinates = [
      [-2.2, 1.2, 0],
      [2.3, 1.34, -0.4],
      [-1.1, -1.3, 0.25],
      [1.7, -1.15, 0.2],
      [0.15, 0.2, -0.2],
    ];

    coordinates.forEach(([x, y, z], index) => {
      const mesh = new THREE.Mesh(
        geometries[index % geometries.length],
        materials[index % materials.length]
      );
      mesh.position.set(x, y, z);
      mesh.rotation.set(index * 0.4, index * 0.28, index * 0.18);
      mesh.castShadow = true;
      shapes.push(mesh);
      scene.add(mesh);
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    let animationId = 0;
    const startedAt = performance.now();
    const render = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      shapes.forEach((mesh, index) => {
        mesh.rotation.x += 0.003 + index * 0.0007;
        mesh.rotation.y += 0.006 + index * 0.0009;
        mesh.position.y += Math.sin(elapsed * 1.1 + index) * 0.0028;
      });
      scene.rotation.z = Math.sin(elapsed * 0.45) * 0.045;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas className={styles.threeCanvas} ref={canvasRef} aria-hidden="true" />;
}

function HeroAnimation() {
  return (
    <div className={styles.heroVisual}>
      <ThreeSignalField />
      <div className={styles.playerShell}>
        <Player
          component={IncidentFilm}
          durationInFrames={240}
          fps={30}
          compositionHeight={760}
          compositionWidth={1200}
          autoPlay
          loop
          controls={false}
          acknowledgeRemotionLicense
          style={{
            width: "100%",
            aspectRatio: "1200 / 760",
            borderRadius: 34,
            overflow: "hidden",
          }}
        />
      </div>
      <div className={styles.heroChipOne}>43 alerts &rarr; 1 cause</div>
      <div className={styles.heroChipTwo}>Fix plan ready</div>
    </div>
  );
}

export default function FounderWarRoomMockup() {
  return (
    <main className={styles.page}>
      <div className={styles.noise} aria-hidden="true" />
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>d</span>
          damasqas
        </Link>
        <div className={styles.navLinks}>
          <a href="#proof">Proof</a>
          <a href="#workflow">Workflow</a>
          <a href="#demo">Demo</a>
        </div>
        <a className={styles.navCta} href={demoUrl}>
          Book a Demo
        </a>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>
            <span /> Built for founders who are still on call
          </div>
          <h1>Your startup&apos;s first AI SRE.</h1>
          <p>
            Damasqas watches your production stack, groups noisy alerts, finds the
            root cause, and prepares the rollback or fix before you open Slack.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryCta} href={demoUrl}>
              Book a Demo
            </a>
            <a className={styles.secondaryCta} href="#workflow">
              See the incident flow
            </a>
          </div>
          <div className={styles.metrics}>
            <div>
              <strong>43 &rarr; 1</strong>
              <span>alert grouping</span>
            </div>
            <div>
              <strong>03:14</strong>
              <span>root cause found</span>
            </div>
            <div>
              <strong>1 click</strong>
              <span>approve remediation</span>
            </div>
          </div>
        </div>
        <HeroAnimation />
      </section>

      <section className={styles.problem} id="proof">
        <div>
          <span className={styles.sectionLabel}>Why this exists</span>
          <h2>Incident tools coordinate people. Startup founders need the work done.</h2>
        </div>
        <div className={styles.problemGrid}>
          {[
            ["Noise", "Forty alerts fire. One underlying failure matters."],
            ["Context", "Deploys, logs, monitors, and dependencies live in separate tools."],
            ["Action", "Dashboards do not roll back a bad release or open a tested fix."],
          ].map(([title, copy]) => (
            <article className={styles.problemCard} key={title}>
              <span>{title}</span>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.workflow} id="workflow">
        <span className={styles.sectionLabel}>The war room, automated</span>
        <h2>From alert storm to approved fix in one visible chain.</h2>
        <div className={styles.timeline}>
          {[
            ["01", "Group", "Damasqas deduplicates alerts and identifies the incident surface."],
            ["02", "Investigate", "It correlates deploys, config changes, logs, and dependency health."],
            ["03", "Explain", "The founder gets plain-English root cause with supporting evidence."],
            ["04", "Remediate", "Rollback, restart, scale, or PR fix is prepared for approval."],
          ].map(([num, title, copy]) => (
            <article className={styles.timelineCard} key={num}>
              <b>{num}</b>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.demoPanel} id="demo">
        <div>
          <span className={styles.sectionLabel}>Founder demo angle</span>
          <h2>Bring one real incident. Leave knowing if it could have been automated.</h2>
          <p>
            The demo should feel concrete: connect the story of a bad deploy, a
            dependency outage, or a noisy alert storm to how Damasqas would have
            handled it end to end.
          </p>
        </div>
        <a className={styles.primaryCta} href={demoUrl}>
          Book a Demo
        </a>
      </section>
    </main>
  );
}
