"use client";

import { useEffect, useRef } from "react";
import styles from "./TiltShowcase.module.css";

const MAX_TILT = 10; // degrees while just hovering
const MAX_TILT_PRESS = 20; // degrees while the cursor is pressed down

/**
 * A single showcase image that idles with a slow auto turntable animation
 * and, on pointer interaction, tilts into a glossy 3D card that follows the
 * cursor (press and drag for a deeper tilt).
 */
export default function TiltShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!wrap || !card || !glare) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let hovering = false;
    let pressing = false;
    let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;
    let targetGX = 50, targetGY = 50, curGX = 50, curGY = 50;
    let targetScale = 1, curScale = 1;
    let raf = 0, t = 0, last = 0;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      const tilt = pressing ? MAX_TILT_PRESS : MAX_TILT;
      targetRY = (nx - 0.5) * 2 * tilt;
      targetRX = -(ny - 0.5) * 2 * tilt;
      targetGX = nx * 100;
      targetGY = ny * 100;
    };
    const onEnter = () => { hovering = true; targetScale = 1.04; };
    const onLeave = () => { hovering = false; pressing = false; targetRX = 0; targetRY = 0; targetScale = 1; };
    const onDown = () => { pressing = true; targetScale = 1.07; };
    const onUp = () => { pressing = false; targetScale = hovering ? 1.04 : 1; };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      t += dt;

      if (!hovering && !reduced) {
        // nobody's touching it: a slow, gentle turntable so it never sits still
        targetRY = Math.sin(t * 0.35) * 8;
        targetRX = Math.sin(t * 0.5 + 1) * 3;
      }

      const k = 1 - Math.pow(0.001, dt); // smooth, framerate-independent easing
      curRX += (targetRX - curRX) * k;
      curRY += (targetRY - curRY) * k;
      curGX += (targetGX - curGX) * k;
      curGY += (targetGY - curGY) * k;
      curScale += (targetScale - curScale) * k;

      const floatY = reduced ? 0 : Math.sin(t * 0.8) * 6;

      card.style.transform = `translateY(${floatY.toFixed(2)}px) rotateX(${curRX.toFixed(2)}deg) rotateY(${curRY.toFixed(2)}deg) scale(${curScale.toFixed(3)})`;
      glare.style.background = `radial-gradient(circle at ${curGX.toFixed(1)}% ${curGY.toFixed(1)}%, rgba(255,255,255,0.35), transparent 55%)`;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div className={styles.wrap} ref={wrapRef} aria-hidden="true">
      <div className={styles.card} ref={cardRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flower3d-burchak-2.jpg"
          alt=""
          className={styles.img}
          draggable={false}
        />
        <div className={styles.sheen} />
        <div className={styles.glare} ref={glareRef} />
      </div>
    </div>
  );
}
