"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 150;
const SPAN = 14;
const DOTS = 60;
const REPEL_RADIUS = 150; // px around the cursor in which dots get pushed away
const REPEL_FORCE = 0.02; // world units / frame^2 at the cursor itself
const EMERGE_DELAY = 0.6; // s, the C starts drawing at ~0.15s
const EMERGE_DUR = 4.2; // s, spreading sideways from under the C
const SETTLE_DUR = 1.8; // s, the ribbon then glides up to its resting place
const STOPS = [0xff4f86, 0xb43cff, 0x4f5dff, 0x8a5cff].map(
  (c) => new THREE.Color(c),
);

function gradient(t: number) {
  const x = t * (STOPS.length - 1);
  const i = Math.min(Math.floor(x), STOPS.length - 2);
  return STOPS[i].clone().lerp(STOPS[i + 1], x - i);
}

/**
 * Animated 3D ribbon of thin slabs. Fills its (relative) parent, sits behind
 * the content and never captures pointer events.
 */
export default function WaveRibbon({
  className = "",
  fit = false,
  emerge = false,
}: {
  className?: string;
  /** Pull the camera so the whole ribbon fits a short, wide box. */
  fit?: boolean;
  /** Slowly spread from the centre outwards on mount (synced with the intro's "C"). */
  emerge?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.cssText =
      "display:block;width:100%;height:100%;pointer-events:none";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 1.2, 15);

    // three r155+ uses physical light units, so scale by PI to keep the
    // classic intensities from the design.
    scene.add(new THREE.AmbientLight(0xffffff, 0.28 * Math.PI));
    const key = new THREE.DirectionalLight(0xffffff, 1.25 * Math.PI);
    key.position.set(4, 8, 8);
    scene.add(key);
    const pink = new THREE.PointLight(0xff7ac8, 1.2 * Math.PI, 40, 1);
    pink.position.set(-8, 2, 6);
    scene.add(pink);
    const blue = new THREE.PointLight(0x6a7bff, 1.2 * Math.PI, 40, 1);
    blue.position.set(8, -2, 6);
    scene.add(blue);

    const geo = new THREE.BoxGeometry(0.06, 1.6, 1.1);
    const mats: THREE.MeshStandardMaterial[] = [];
    const slabs: THREE.Mesh[] = [];
    for (let i = 0; i < COUNT; i++) {
      const t = i / (COUNT - 1);
      const mat = new THREE.MeshStandardMaterial({
        color: gradient(t),
        roughness: 0.28,
        metalness: 0.2,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.x = (t - 0.5) * SPAN;
      scene.add(m);
      mats.push(mat);
      slabs.push(m);
    }

    const dotGeo = new THREE.SphereGeometry(0.022, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x8a8a94 });
    const dots: {
      mesh: THREE.Mesh;
      s: number;
      p: number;
      bx: number;
      by: number;
      drift: number;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
    }[] = [];
    for (let i = 0; i < DOTS; i++) {
      const mesh = new THREE.Mesh(dotGeo, dotMat);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
      );
      scene.add(mesh);
      dots.push({
        mesh,
        s: Math.random() * 2 + 0.5,
        p: Math.random() * 6.28,
        bx: mesh.position.x,
        by: mesh.position.y,
        drift: 0,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
      });
    }

    let mx = 0;
    let my = 0;
    let cx = -9999; // cursor in client px
    let cy = -9999;
    const onPointer = (e: PointerEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      if (fit) {
        // visible height at distance z is 2*z*tan(17.5deg) = 0.63*z
        const zForHeight = 3.8 / 0.6306;
        const zForWidth = 11.2 / (0.6306 * camera.aspect);
        camera.position.z = Math.max(zForHeight, zForWidth);
      } else {
        camera.position.z = w < 700 ? 22 : 15;
      }
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(host);
    resize();

    // Where the bottom of the intro's "C" is, as a world-space Y offset from the
    // screen centre (the ribbon starts there and settles to 0 at the end).
    let startOff: number | null = null;
    function measureStart() {
      const logo = document.querySelector('[data-cyron="logo"]');
      if (!logo) return;
      const r = logo.getBoundingClientRect();
      if (r.height < 40) return;
      const hr = host!.getBoundingClientRect();
      const unitsPerPx = (0.6306 * camera.position.z) / hr.height;
      const cBottom = r.bottom - r.height * 0.1 - hr.top;
      startOff = (hr.height / 2 - cBottom) * unitsPerPx;
    }

    function draw(t: number) {
      // 0 -> 1 while the ribbon unfolds from the centre to both ends
      const p = emerge && !reduced ? Math.min(Math.max((t - EMERGE_DELAY) / EMERGE_DUR, 0), 1) : 1;
      const spread = p * p * (3 - 2 * p);
      let yOff = 0;
      if (emerge && !reduced) {
        if (startOff === null) measureStart();
        const q = Math.min(Math.max((t - EMERGE_DELAY - EMERGE_DUR + 0.3) / SETTLE_DUR, 0), 1);
        const settle = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
        yOff = (startOff ?? 0) * (1 - settle);
      }
      for (let i = 0; i < COUNT; i++) {
        const m = slabs[i];
        const u = i / (COUNT - 1);
        const env = Math.pow(Math.sin(Math.PI * u), 0.8);
        const ph = t * 0.6 + u * 5.2;
        m.position.y = Math.sin(ph) * 0.9 * env + yOff;
        m.position.z = Math.cos(ph * 0.8 + 0.6) * 0.8 * env;
        m.rotation.x = Math.sin(t * 0.5 + u * 4.5) * 1.0 + (u - 0.5) * 2.6;
        m.rotation.y = Math.sin(t * 0.4 + u * 3.0) * 0.35;
        // slabs near the centre appear first, the ends last
        const k = Math.min(Math.max((spread * 1.3 - Math.abs(u - 0.5) * 2) / 0.3, 0), 1);
        const grow = k * k * (3 - 2 * k);
        m.visible = grow > 0.001;
        m.scale.x = grow;
        m.scale.y = (0.35 + 1.9 * env * (0.85 + 0.15 * Math.sin(ph * 1.3))) * grow;
        m.scale.z = (0.6 + 0.7 * env) * grow;
      }
      const hr = host!.getBoundingClientRect();
      const tmp = new THREE.Vector3();
      for (const d of dots) {
        d.drift += Math.sin(t * d.s + d.p) * 0.002;
        d.mesh.scale.setScalar(spread);

        // dots are pushed away from the cursor when it comes within REPEL_RADIUS px
        tmp.set(d.bx + d.ox, d.by + d.oy + d.drift, d.mesh.position.z).project(camera);
        const sx = hr.left + (tmp.x * 0.5 + 0.5) * hr.width;
        const sy = hr.top + (-tmp.y * 0.5 + 0.5) * hr.height;
        const dx = sx - cx;
        const dy = sy - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && !reduced) {
          const unitsPerPx = (0.6306 * (camera.position.z - d.mesh.position.z)) / hr.height;
          const f = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
          const nx = dist > 0.001 ? dx / dist : Math.random() - 0.5;
          const ny = dist > 0.001 ? dy / dist : Math.random() - 0.5;
          d.vx += nx * f * (unitsPerPx / 0.012);
          d.vy -= ny * f * (unitsPerPx / 0.012); // screen Y points down, world Y up
        }
        d.vx += -d.ox * 0.03; // spring back to the home spot
        d.vy += -d.oy * 0.03;
        d.vx *= 0.9;
        d.vy *= 0.9;
        d.ox += d.vx;
        d.oy += d.vy;
        d.mesh.position.x = d.bx + d.ox;
        d.mesh.position.y = d.by + d.oy + d.drift;
      }
      camera.position.x += (mx * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (1.2 - my * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    let raf = 0;
    let visible = true;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (visible) draw(clock.getElapsedTime());
    };

    // Reduced motion: render a single still frame, no loop.
    let io: IntersectionObserver | undefined;
    if (reduced) {
      draw(0);
    } else {
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
      });
      io.observe(host);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      geo.dispose();
      mats.forEach((m) => m.dispose());
      dotGeo.dispose();
      dotMat.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, [fit, emerge]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
