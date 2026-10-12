import * as THREE from 'three';
import SHAPES from './logoShapes';

/* ------------------------------------------------------------------ *
 *  CyronTech intro engine (framework-agnostic, client only).
 *  white -> 3D "C" is drawn from the top -> wind flutters the flap + droplet
 *  -> the mark settles slightly smaller -> CYRONTECH, then TECHNOLOGY
 *  SOLUTIONS, lower like a curtain (line 2 starts when line 1 is half way).
 *  The result stays on screen as a hero.
 * ------------------------------------------------------------------ */

/* ---------- timeline (seconds) ---------- */
const FEATHER = 0.16;                    // softness of the drawing front
const TL = {
  drawStart: 0.15, drawEnd: 3.1,         // the C is drawn
  windStart: 3.0,                        // wind hits the flap
  shrinkStart: 2.8, shrinkEnd: 4.6,      // logo settles a little smaller
  text1: 3.3, textDur: 1.6,              // line 1 lowers; line 2 starts at +50 %
  idleFrom: 5.2,
};
const P_FULL = 1 + FEATHER + 0.1;        // sweep value that completes every layer
const TIP_S = 0.37;                      // where along the sweep the flap tip sits
TL.dropStart = TL.drawStart + (Math.acos(1 - 2 * ((TIP_S + FEATHER * 0.35) / P_FULL)) / Math.PI) * (TL.drawEnd - TL.drawStart);
TL.dropDur = 1.35;
const DONE_AT = TL.text1 + TL.textDur * 1.5;

/* ---------- helpers ---------- */
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t, s = 1.7) => { const c = s + 1; return 1 + c * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); };
const easeOutElastic = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1);

/* ---------- shaders ---------- */
const VERT = /* glsl */`
  uniform float uP; uniform float uDir; uniform float uFeather; uniform float uFx;
  uniform float uWind; uniform float uTime;
  uniform vec2 uTip; uniform vec2 uTerm; uniform vec2 uC;
  uniform float uA0; uniform float uSMax;
  varying float vK; varying vec3 vN; varying vec3 vView; varying vec2 vUv;
  void main() {
    vec3 transformed = position;
    vec2 q = position.xy;
    float k = 1.0;
    if (uFx > 0.5) {
      // position of this point along the C: 0 = top terminal ... 1 = bottom terminal
      float ang = atan(q.y - uC.y, q.x - uC.x);
      float s = mod(ang - uA0 + 6.28318530718, 6.28318530718) / uSMax;
      k = 1.0 - smoothstep(uP - uFeather, uP, s);
      transformed.z += uDir * (1.0 - k) * 0.55;
      transformed.xy = mix(uC + (q - uC) * 0.94, q, k);

      // wind from the right: flap tip + free terminals flutter
      float wTip = exp(-distance(q, uTip) * 2.2);
      float wTerm = exp(-distance(q, uTerm) * 1.6) * 0.45;
      float w = clamp(wTip + wTerm, 0.0, 1.0);
      float ph = uTime * 13.0 - dot(q, vec2(-2.2, 1.4)) * 3.2;
      transformed.z += uWind * w * (0.34 * sin(ph) + 0.12 * sin(ph * 1.9 + 1.3));
      transformed.x += uWind * w * (-0.16 - 0.08 * sin(ph + 0.8));
      transformed.y += uWind * w * 0.05 * sin(ph * 1.3);

      // the flap swings like cloth around its base, pushed left by the gust
      vec2 pv = vec2(-0.80, 0.25);
      float hm = smoothstep(0.30, 0.95, q.y) * (1.0 - smoothstep(-0.2, 0.5, q.x));
      float th = uWind * hm * (0.20 + 0.38 * sin(uTime * 14.0) + 0.16 * sin(uTime * 23.0 + 1.0));
      vec2 rr = q - pv;
      vec2 qr = pv + vec2(cos(th) * rr.x - sin(th) * rr.y, sin(th) * rr.x + cos(th) * rr.y);
      transformed.xy += (qr - q) * k;
    }
    vK = k;
    vUv = uv;
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`;

const FRAG = /* glsl */`
  uniform sampler2D uMap; uniform float uGloss;
  varying float vK; varying vec3 vN; varying vec3 vView; varying vec2 vUv;
  void main() {
    vec3 base = texture2D(uMap, vUv).rgb;            // colours come straight from the logo image
    vec3 n = normalize(vN);
    vec3 v = normalize(vView);
    vec3 L = normalize(vec3(-0.35, 0.55, 0.78));
    float nl = max(dot(n, L), 0.0);
    float shade = 0.90 + 0.13 * nl;                   // flat faces = 1.0, bevels pick up soft light / shadow
    vec3 h = normalize(L + v);
    float spec = pow(max(dot(n, h), 0.0), 38.0) * uGloss;
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0) * 0.06;
    vec3 col = base * shade + vec3(spec) + vec3(0.55, 0.38, 0.95) * rim;
    gl_FragColor = vec4(col, smoothstep(0.0, 0.85, vK));
    #include <colorspace_fragment>
  }`;

function buildGeometry(points, { depth, bevel, center = [0, 0] }) {
  const pts = points.map(([x, y]) => new THREE.Vector2(x - center[0], y - center[1]));
  const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts), {
    depth, steps: 1, curveSegments: 1,
    bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelOffset: -bevel * 0.8, bevelSegments: 4,
  });
  // planar UVs: every vertex looks up the logo image at its own (x, y)
  const { cx, cy, scale, W, H } = SHAPES.meta;
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + center[0], y = pos.getY(i) + center[1];
    uv[i * 2] = (x / scale + cx) / W;
    uv[i * 2 + 1] = 1 - (cy - y / scale) / H;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

/**
 * Mounts the intro inside `root` (the element rendered by <CyronIntro />).
 * Returns { dispose, seek } immediately; loading happens in the background.
 */
export function mountCyronIntro(root, { assetBase = '/cyron', scale: userScale = 1, onDone, freeze = null } = {}) {
  const q = (n) => root.querySelector(`[data-cyron="${n}"]`);
  const logoEl = q('logo'), canvas = q('gl'), wordmark = q('wordmark'), line1 = q('l1'), line2 = q('l2');
  const streaks = [...root.querySelectorAll('[data-cyron="wind"] path')];

  let cancelled = false, raf = 0, renderer = null, map = null;
  let finalLift = 0, currentT = 0, doneFired = false;
  let scene, camera, logo, pivot, dot;
  const layers = [];
  const cleanups = [];
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

  const U = {
    uTime: { value: 0 },
    uWind: { value: 0 },
    uFeather: { value: FEATHER },
    uTip: { value: new THREE.Vector2() },
    uTerm: { value: new THREE.Vector2() },
    uC: { value: new THREE.Vector2(0.04, -0.02) },
    uA0: { value: (22 * Math.PI) / 180 },
    uSMax: { value: (316 * Math.PI) / 180 },
  };

  function makeMaterial({ fx, uP, uDir, gloss = 0.08 }) {
    return new THREE.ShaderMaterial({
      uniforms: { ...U, uMap: { value: map }, uP: uP || { value: 10 }, uDir: uDir || { value: 1 }, uFx: { value: fx }, uGloss: { value: gloss } },
      vertexShader: VERT, fragmentShader: FRAG, transparent: true,
    });
  }

  function initScene() {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0xffffff, 0);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 6.25);

    logo = new THREE.Group();
    pivot = new THREE.Group();
    logo.add(pivot);
    scene.add(logo);
    pivot.position.set(0, -0.17, 0);               // centre of the whole mark (body + droplet) -> origin

    const L = [
      // name, layer z-bottom, depth, bevel, lag behind the drawing front, fly-in direction
      ['body',     0.00, 0.08, 0.012, 0.00, -1],
      ['strip',    0.10, 0.04, 0.008, 0.05, 1],
      ['leaf',     0.10, 0.05, 0.008, 0.07, 1],
      ['lower',    0.10, 0.04, 0.008, 0.05, 1],
      ['crescent', 0.10, 0.07, 0.008, 0.08, 1],
      ['top',      0.10, 0.09, 0.010, 0.09, 1],
    ];
    L.forEach(([name, z0, depth, bevel, lag, flyDir], i) => {
      const uP = { value: 0 };
      const mesh = new THREE.Mesh(
        buildGeometry(SHAPES[name], { depth, bevel }),
        makeMaterial({ fx: 1, uP, uDir: { value: flyDir } })
      );
      mesh.position.z = z0 + bevel;
      mesh.renderOrder = i + 1;
      pivot.add(mesh);
      layers.push({ name, uP, lag });
    });

    // droplet – a glossy bead, centred on its own centroid
    const dp = SHAPES.dot;
    const dcx = dp.reduce((s, p) => s + p[0], 0) / dp.length;
    const dcy = dp.reduce((s, p) => s + p[1], 0) / dp.length;
    dot = new THREE.Mesh(
      buildGeometry(dp, { depth: 0.1, bevel: 0.05, center: [dcx, dcy] }),
      makeMaterial({ fx: 0, gloss: 0.3 })
    );
    dot.renderOrder = 10;
    dot.userData.final = new THREE.Vector3(dcx, dcy, 0.06);
    dot.visible = false;
    pivot.add(dot);

    // flap tip (highest point on the left of the body) and the top terminal – wind targets
    let tip = [0, -9];
    SHAPES.body.forEach((p) => { if (p[0] < -0.5 && p[1] > tip[1]) tip = p; });
    let term = [-9, 0];
    SHAPES.top.forEach((p) => { if (p[1] > 0 && p[0] > term[0]) term = p; });
    U.uTip.value.set(tip[0], tip[1]);
    U.uTerm.value.set(term[0], term[1]);
    dot.userData.tip = new THREE.Vector3(tip[0], tip[1] + 0.03, 0.06);
  }

  /* ---------- layout (relative to the hero box) ---------- */
  function fitText(width) {
    line1.style.fontSize = '100px';
    const w1 = line1.getBoundingClientRect().width || line1.scrollWidth;
    const fs1 = (100 * width) / w1;
    line1.style.fontSize = fs1 + 'px';

    // line 2: natural width ~84 % of line 1, then tracked out to exactly the same width
    line2.style.letterSpacing = '0px';
    line2.style.marginRight = '0px';
    line2.style.fontSize = '100px';
    const w100 = line2.getBoundingClientRect().width || line2.scrollWidth;
    const fs2 = (100 * width * 0.84) / w100;
    line2.style.fontSize = fs2 + 'px';
    const w2 = line2.getBoundingClientRect().width || line2.scrollWidth;
    const n = line2.textContent.length;
    const ls = (width - w2) / (n - 1);
    line2.style.letterSpacing = ls + 'px';
    line2.style.marginRight = -ls + 'px';          // cancel trailing spacing so it stays centred
    line2.style.marginTop = fs1 * 0.38 + 'px';
    return fs1 + fs1 * 0.38 + fs2;                 // block height
  }

  function layout() {
    const r = root.getBoundingClientRect();
    const vw = r.width, vh = r.height;
    if (!vw || !vh) return;
    let wt = Math.min(vw * 0.46, 430) * userScale;
    let hl = Math.min(wt / 2.55, vh * 0.19 * userScale);   // logo height vs wordmark width, as in the logo sheet
    wt = hl * 2.55;

    const textH = fitText(wt);
    const gap = hl * 0.16;
    const total = hl + gap + textH;
    const finalCenter = (vh - total) / 2 + hl / 2;
    finalLift = finalCenter - vh / 2;

    const canvasPx = Math.round(hl / 0.88 / 0.7);  // 3D object fills ~70 % of the canvas at full size
    logoEl.style.setProperty('--sc', canvasPx + 'px');
    wordmark.style.setProperty('--wm-w', wt + 'px');
    wordmark.style.setProperty('--wm-top', finalCenter + hl / 2 + gap + 'px');

    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(canvasPx, canvasPx, false);
    }
  }

  function curtain(el, p) {
    if (p <= 0) { el.style.opacity = '0'; el.style.clipPath = 'inset(0 0 100% 0)'; el.style.transform = 'none'; return; }
    const e = easeInOutCubic(p);
    el.style.opacity = String(smooth(0, 0.22, p));
    el.style.clipPath = `inset(0 0 ${((1 - e) * 100).toFixed(2)}% 0)`;
    el.style.transform = `translateY(${(-(1 - e) * 0.4).toFixed(3)}em) rotateX(${(-(1 - e) * 82).toFixed(2)}deg)`;
  }

  /* ---------- one frame, purely a function of time ---------- */
  function frame(t) {
    currentT = t;
    const tt = Math.max(0, t);

    if (renderer) {
      U.uTime.value = tt;

      const dp = clamp01((tt - TL.drawStart) / (TL.drawEnd - TL.drawStart));
      const P = easeInOutSine(dp) * P_FULL;
      layers.forEach((l) => { l.uP.value = P - l.lag; });

      // wind envelope: quick gust, then decays to a full stop
      const wt = tt - TL.windStart;
      let W = 0;
      if (wt > 0) W = smooth(0, 0.2, wt) * Math.exp(-wt * 1.45) * (0.82 + 0.18 * Math.sin(wt * 7));
      W = Math.max(0, (W - 0.02) / 0.98);
      U.uWind.value = W;

      // droplet: splashes up from the flap tip, springs into place
      const b = clamp01((tt - TL.dropStart) / TL.dropDur);
      dot.visible = b > 0;
      if (b > 0) {
        const e = easeOutElastic(b);
        const f = dot.userData.final, s0 = dot.userData.tip;
        dot.position.set(
          lerp(s0.x, f.x, e) - W * 0.1 * (0.6 + 0.4 * Math.sin(tt * 13)),
          lerp(s0.y, f.y, e) + W * 0.035 * Math.sin(tt * 9),
          f.z
        );
        const g = Math.max(0.0001, easeOutBack(clamp01(b * 1.5)));
        dot.scale.set(g * (1 - (1 - b) * 0.25), g * (1 + (1 - b) * 0.55), g);
        dot.rotation.z = -0.12 + W * 0.45 * Math.sin(tt * 10) + (1 - b) * 0.2;
      }

      // starts turned, settles to front; stays alive with a tiny float + pointer parallax
      const turn = 1 - easeInOutCubic(clamp01((tt - TL.drawStart) / (TL.drawEnd + 0.9 - TL.drawStart)));
      const idle = smooth(TL.idleFrom - 0.8, TL.idleFrom + 1.2, tt);
      pointer.sx += (pointer.x - pointer.sx) * 0.06;
      pointer.sy += (pointer.y - pointer.sy) * 0.06;
      logo.rotation.y = 0.55 * turn + idle * (0.03 * Math.sin(tt * 0.6) + pointer.sx * 0.12);
      logo.rotation.x = 0.22 * turn + idle * (0.02 * Math.sin(tt * 0.5 + 1) + pointer.sy * 0.08);
      logo.rotation.z = W * 0.035 * Math.sin(tt * 9);
      logo.position.y = idle * 0.025 * Math.sin(tt * 0.8);

      const shrink = easeInOutCubic(clamp01((tt - TL.shrinkStart) / (TL.shrinkEnd - TL.shrinkStart)));
      const grow = 0.93 + 0.07 * easeOutCubic(clamp01(dp * 2.5));
      logo.scale.setScalar(grow * lerp(1, 0.88, shrink));

      renderer.render(scene, camera);
    }

    // faint wind streaks from the right
    streaks.forEach((p, i) => {
      const k = clamp01((tt - (TL.windStart - 0.2 + i * 0.09)) / 0.95);
      p.style.strokeDasharray = '0.3 1.5';
      p.style.strokeDashoffset = String(0.3 - 1.3 * easeInOutSine(k));
      p.style.opacity = String(Math.sin(Math.PI * k) * 0.5);
    });

    // wordmark: two curtains, the second starts when the first is half way
    curtain(line1, clamp01((tt - TL.text1) / TL.textDur));
    curtain(line2, clamp01((tt - (TL.text1 + TL.textDur * 0.5)) / TL.textDur));

    // the logo rises a little to make room for the wordmark
    const lift = finalLift * easeInOutCubic(clamp01((tt - (TL.text1 - 0.45)) / 1.7));
    logoEl.style.setProperty('--lift', lift.toFixed(2) + 'px');
  }

  /* ---------- run loop: pauses when off-screen / tab hidden ---------- */
  let inView = false, running = false, elapsed = -0.01, last = 0;   // -10 ms: the animation begins 10 ms in
  const canRun = () => inView && !document.hidden && !cancelled;

  function tick(now) {
    raf = 0;
    if (!canRun()) { running = false; return; }
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    elapsed += dt;
    try { frame(elapsed); } catch (err) { console.error('[CyronIntro] frame failed', err); running = false; return; }
    if (!doneFired && elapsed > DONE_AT) {
      doneFired = true;
      root.dataset.cyronDone = '1';
      root.dispatchEvent(new CustomEvent('cyron:intro-done', { bubbles: true }));
      if (onDone) onDone();
    }
    raf = requestAnimationFrame(tick);
  }
  function wake() {
    if (running || !canRun() || !renderer) return;
    running = true; last = 0;
    raf = requestAnimationFrame(tick);
  }

  function dispose() {
    cancelled = true;
    cancelAnimationFrame(raf);
    cleanups.forEach((fn) => { try { fn(); } catch (_) { /* ignore */ } });
    cleanups.length = 0;
    if (scene) scene.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
    if (map) map.dispose();
    if (renderer) { renderer.dispose(); renderer.forceContextLoss(); }
    renderer = null;
  }

  /* ---------- boot ---------- */
  (async () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      await Promise.race([
        Promise.all([800, 300, 400].map((w) => document.fonts.load(`${w} 40px CyronMontserrat`))),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
    } catch (_) { /* system font fallback */ }
    if (cancelled) return;

    try {
      map = await new THREE.TextureLoader().loadAsync(`${assetBase}/logo-color.jpg`);
      if (cancelled) { map.dispose(); return; }
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = 8;
      initScene();
    } catch (err) {
      console.warn('[CyronIntro] WebGL unavailable, showing the wordmark only', err);
      if (renderer) { renderer.dispose(); renderer = null; }
    }
    if (cancelled) return;

    layout();
    const ro = new ResizeObserver(() => { layout(); frame(currentT); });
    ro.observe(root);
    cleanups.push(() => ro.disconnect());

    if (freeze !== null) { frame(freeze); return; }
    if (reduced || !renderer) { frame(99); if (onDone) onDone(); return; }

    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    cleanups.push(() => window.removeEventListener('pointermove', onMove));

    document.addEventListener('visibilitychange', wake);
    cleanups.push(() => document.removeEventListener('visibilitychange', wake));
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; wake(); }, { threshold: 0.3 });
    io.observe(root);
    cleanups.push(() => io.disconnect());

    frame(0);                                      // white, nothing drawn yet
  })();

  return { dispose, seek: (t) => frame(t) };
}
