"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "../composition.module.css";

export function AgentOrb() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
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

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
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
      cancelAnimationFrame(rafId);
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
