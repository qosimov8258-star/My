'use client';

import { useEffect, useRef } from 'react';
import styles from './CyronIntro.module.css';

/**
 * CyronTech animated hero.
 *
 * Props
 *  - assetBase  where logo-color.jpg lives (default "/cyron", i.e. public/cyron)
 *  - scale      overall size multiplier (default 1; 0.8 = 20 % smaller)
 *  - onDone     called once when the animation has finished
 *  - freeze     number of seconds: render that single frame and stop (e.g. 99 = final logo, no animation)
 *  - className / style   applied to the hero box (default: full viewport height, white)
 */
export default function CyronIntro({ assetBase = '/cyron', scale = 1, onDone, freeze = null, className = '', style }) {
  const rootRef = useRef(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let handle = null;
    let alive = true;
    // three.js is only loaded in the browser, never during SSR
    import('./engine').then(({ mountCyronIntro }) => {
      if (!alive || !rootRef.current) return;
      handle = mountCyronIntro(rootRef.current, { assetBase, scale, freeze, onDone: () => doneRef.current?.() });
    });
    return () => { alive = false; if (handle) handle.dispose(); };
  }, [assetBase, scale, freeze]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className}`}
      style={style}
      role="img"
      aria-label="CyronTech — Technology Solutions"
    >
      <div className={styles.aurora} aria-hidden="true">
        <span className={styles.auroraBlob} />
        <span className={styles.auroraBlob} />
        <span className={styles.auroraBlob} />
      </div>

      <div className={styles.logo} data-cyron="logo" aria-hidden="true">
        <canvas className={styles.canvas} data-cyron="gl" />
        <svg className={styles.wind} data-cyron="wind" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path pathLength="1" d="M 112 34 C 96 26, 84 44, 66 36 S 34 28, -12 40" />
          <path pathLength="1" d="M 112 50 C 94 44, 82 60, 62 52 S 30 46, -12 56" />
          <path pathLength="1" d="M 112 64 C 98 58, 86 72, 68 66 S 36 60, -12 70" />
          <path pathLength="1" d="M 112 42 C 92 36, 78 50, 58 44 S 28 38, -12 48" />
        </svg>
      </div>

      <div className={styles.wordmark} data-cyron="wordmark" aria-hidden="true">
        <span className={`${styles.line} ${styles.l1}`} data-cyron="l1">
          <span>CYRON</span><span className={styles.te}>TECH</span>
        </span>
        <span className={`${styles.line} ${styles.l2}`} data-cyron="l2">TECHNOLOGY SOLUTIONS</span>
      </div>
    </div>
  );
}
