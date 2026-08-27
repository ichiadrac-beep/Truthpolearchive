import { useEffect, useRef } from "react";
import { tickHumLevel } from "@/lib/desk-hum";

type Star = { x: number; y: number; r: number; base: number; tw: number; spd: number; hue: string };

/**
 * Craft silhouettes based on reported UAP types
 * (spheres, TR-3B triangle, black rectangle, chromed disk, cigar, dome, boomerang, etc.).
 */
type CraftKind =
  | "triangle"
  | "tic"
  | "orb"
  | "disk"
  | "cigar"
  | "dome"
  | "boomerang"
  | "rectangle"
  | "oval"
  | "chevron"
  | "sphere"
  | "spinningTop";

type Craft = {
  kind: CraftKind;
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  cruise: number;
  heading: number;
  turn: number;
  life: number;
  max: number;
  scale: number;
  body: string;
  light: string;
  light2: string;
  rot: number;
  spin: number;
  locked: boolean;
};

type Duel = {
  a: number;
  b: number;
  loser: number;
  t: number;
  boom: boolean;
};

type Burst = {
  x: number;
  y: number;
  life: number;
  max: number;
  color: string;
  sparks: { x: number; y: number; vx: number; vy: number; r: number }[];
};

/** Hull + light presets matched to reference board colours. */
const LIGHT_PALETTE = [
  { light: "rgba(255,170,40,0.98)", light2: "rgba(255,220,120,0.95)", body: "rgba(16,14,12,0.95)" }, // amber
  { light: "rgba(70,180,255,0.98)", light2: "rgba(160,220,255,0.95)", body: "rgba(10,14,24,0.95)" }, // blue
  { light: "rgba(255,55,50,0.98)", light2: "rgba(255,140,90,0.95)", body: "rgba(18,8,8,0.95)" }, // red
  { light: "rgba(255,230,90,0.98)", light2: "rgba(255,250,180,0.95)", body: "rgba(20,16,8,0.92)" }, // yellow
  { light: "rgba(230,240,255,0.98)", light2: "rgba(180,200,255,0.9)", body: "rgba(10,12,18,0.94)" }, // white
  { light: "rgba(70,240,160,0.98)", light2: "rgba(160,255,200,0.92)", body: "rgba(8,16,12,0.94)" }, // green
  { light: "rgba(60,255,235,0.98)", light2: "rgba(160,255,250,0.92)", body: "rgba(8,16,20,0.94)" }, // cyan
];

/** Cycle order so every type appears — not random-only ovals/triangles. */
const CRAFT_KINDS: CraftKind[] = [
  "triangle",
  "sphere",
  "rectangle",
  "orb",
  "disk",
  "cigar",
  "dome",
  "spinningTop",
  "boomerang",
  "tic",
  "oval",
  "chevron",
];

function pickLight() {
  return LIGHT_PALETTE[Math.floor(Math.random() * LIGHT_PALETTE.length)];
}

function seedStars(w: number, h: number, count: number): Star[] {
  const stars: Star[] = [];
  let s = 17;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = 0; i < count; i++) {
    const roll = rand();
    const hue =
      roll > 0.97 ? "210, 80%, 78%" : roll > 0.93 ? "42, 50%, 72%" : roll > 0.9 ? "150, 40%, 72%" : "40, 8%, 92%";
    stars.push({
      x: rand() * w,
      y: rand() * h,
      r: roll > 0.92 ? 1.35 : roll > 0.7 ? 0.9 : 0.55,
      base: 0.55 + rand() * 0.45,
      tw: rand() * Math.PI * 2,
      spd: 0.006 + rand() * 0.018,
      hue,
    });
  }
  return stars;
}

function glowDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = r * 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLaser(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  alpha: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  glowDot(ctx, x1, y1, 1.6, color, alpha);
  glowDot(ctx, x2, y2, 1.4, "rgba(255,255,255,0.95)", alpha);
  ctx.restore();
}

function spawnBurst(x: number, y: number, color: string): Burst {
  const sparks: Burst["sparks"] = [];
  const n = 16 + Math.floor(Math.random() * 8);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.25;
    const sp = 0.9 + Math.random() * 2.6;
    sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 0.7 + Math.random() * 1.5 });
  }
  return { x, y, life: 0, max: 36, color, sparks };
}

function drawBurst(ctx: CanvasRenderingContext2D, b: Burst, step: number) {
  const t = Math.min(1, b.life / b.max);
  const fade = 1 - t;
  ctx.save();
  ctx.globalAlpha = fade * 0.5;
  ctx.fillStyle = b.color;
  ctx.beginPath();
  ctx.arc(b.x, b.y, 3 + t * 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.strokeStyle = "rgba(255,236,190,0.95)";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(b.x, b.y, 2 + t * 32, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  for (const s of b.sparks) {
    s.x += s.vx * step;
    s.y += s.vy * step;
    s.vx *= 0.96;
    s.vy *= 0.96;
    glowDot(ctx, s.x, s.y, s.r * fade, b.color, fade);
  }
}

function drawCraft(ctx: CanvasRenderingContext2D, c: Craft, fade: number) {
  // Distant, small — readable as a silhouette, never a foreground object
  const s = c.scale;
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate(c.rot);
  ctx.globalAlpha = Math.min(0.82, 0.48 + 0.34 * fade) * fade;

  switch (c.kind) {
    case "triangle": {
      // TR-3B / red triangle — solid dark hull, three corner lights
      ctx.beginPath();
      ctx.moveTo(0, -18 * s);
      ctx.lineTo(20 * s, 14 * s);
      ctx.lineTo(-20 * s, 14 * s);
      ctx.closePath();
      ctx.fillStyle = c.body;
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = 0.7;
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 0.32 * fade;
      ctx.fillStyle = c.light;
      ctx.beginPath();
      ctx.ellipse(0, 8 * s, 12 * s, 4 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = fade;
      glowDot(ctx, 0, -14 * s, 1.5 * s, c.light, fade);
      glowDot(ctx, 16 * s, 11 * s, 1.3 * s, c.light2, fade);
      glowDot(ctx, -16 * s, 11 * s, 1.3 * s, c.light, fade);
      break;
    }
    case "sphere":
    case "orb": {
      const R = c.kind === "sphere" ? 5.2 * s : 4.2 * s;
      const grd = ctx.createRadialGradient(-R * 0.25, -R * 0.25, 0, 0, 0, R);
      grd.addColorStop(0, c.light2);
      grd.addColorStop(0.45, c.light);
      grd.addColorStop(0.85, c.body);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.shadowColor = c.light;
      ctx.shadowBlur = 8 * s;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.fill();
      glowDot(ctx, -R * 0.15, -R * 0.15, R * 0.2, "rgba(255,255,255,0.85)", fade);
      break;
    }
    case "oval": {
      const og = ctx.createRadialGradient(-2 * s, -2 * s, 0, 0, 0, 8 * s);
      og.addColorStop(0, "rgba(255,255,255,0.75)");
      og.addColorStop(0.35, c.light2);
      og.addColorStop(0.7, c.light);
      og.addColorStop(1, "rgba(0,0,0,0.15)");
      ctx.fillStyle = og;
      ctx.shadowColor = c.light;
      ctx.shadowBlur = 7 * s;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7.2 * s, 4.8 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "rectangle": {
      ctx.fillStyle = c.body;
      ctx.strokeStyle = "rgba(220,225,235,0.38)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-14 * s, -4.5 * s, 28 * s, 9 * s, 1.4 * s);
      } else {
        ctx.rect(-14 * s, -4.5 * s, 28 * s, 9 * s);
      }
      ctx.fill();
      ctx.stroke();
      glowDot(ctx, -11 * s, 0, 1.15 * s, c.light, fade);
      glowDot(ctx, 0, 0, 0.85 * s, c.light2, fade * 0.8);
      glowDot(ctx, 11 * s, 0, 1.15 * s, c.light, fade);
      break;
    }
    case "disk": {
      ctx.fillStyle = c.body;
      ctx.strokeStyle = "rgba(200,210,230,0.42)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 1.4 * s, 13 * s, 3.4 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const dome = ctx.createRadialGradient(0, -1.2 * s, 0, 0, -1.2 * s, 5 * s);
      dome.addColorStop(0, "rgba(210,220,240,0.7)");
      dome.addColorStop(0.6, "rgba(120,140,170,0.4)");
      dome.addColorStop(1, "rgba(20,24,32,0.18)");
      ctx.fillStyle = dome;
      ctx.beginPath();
      ctx.ellipse(0, -0.6 * s, 5.6 * s, 3.6 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + c.life * 0.05;
        glowDot(ctx, Math.cos(a) * 10.5 * s, 1.4 * s + Math.sin(a) * 2.2 * s, 0.85 * s, i % 2 ? c.light : c.light2, fade);
      }
      break;
    }
    case "tic": {
      ctx.fillStyle = "rgba(200,210,225,0.92)";
      ctx.strokeStyle = "rgba(255,255,255,0.32)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, 11 * s, 3.2 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "rgba(40,50,70,0.32)";
      ctx.lineWidth = 0.8 * s;
      ctx.beginPath();
      ctx.moveTo(-7 * s, 0);
      ctx.lineTo(7 * s, 0);
      ctx.stroke();
      glowDot(ctx, -5.5 * s, 0, 0.95 * s, c.light, fade);
      glowDot(ctx, 5.5 * s, 0, 0.95 * s, c.light2, fade);
      break;
    }
    case "cigar": {
      ctx.fillStyle = c.body;
      ctx.strokeStyle = "rgba(200,210,230,0.35)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 0, 15 * s, 2.8 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(160,175,200,0.4)";
      ctx.beginPath();
      ctx.ellipse(4 * s, 0, 5.5 * s, 1.6 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      glowDot(ctx, -11 * s, 0, 1.15 * s, c.light, fade);
      glowDot(ctx, 11 * s, 0, 1.15 * s, c.light2, fade);
      const trail = c.vx >= 0 ? -1 : 1;
      ctx.globalAlpha = 0.28 * fade;
      const plume = ctx.createLinearGradient(trail * 12 * s, 0, trail * 32 * s, 0);
      plume.addColorStop(0, c.light);
      plume.addColorStop(1, "transparent");
      ctx.fillStyle = plume;
      ctx.beginPath();
      ctx.ellipse(trail * 20 * s, 0, 9 * s, 1.4 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "dome": {
      ctx.fillStyle = c.body;
      ctx.strokeStyle = "rgba(210,220,235,0.35)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(0, 2.6 * s, 9 * s, 2.8 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const dg = ctx.createRadialGradient(0, -1.2 * s, 0, 0, 0, 6.5 * s);
      dg.addColorStop(0, c.light2);
      dg.addColorStop(0.55, c.light);
      dg.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = dg;
      ctx.shadowColor = c.light;
      ctx.shadowBlur = 6 * s;
      ctx.beginPath();
      ctx.ellipse(0, -1.2 * s, 5.2 * s, 5.8 * s, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      glowDot(ctx, 0, 2.6 * s, 1.2 * s, c.light, fade);
      glowDot(ctx, -5.8 * s, 2.6 * s, 0.85 * s, c.light2, fade * 0.9);
      glowDot(ctx, 5.8 * s, 2.6 * s, 0.85 * s, c.light2, fade * 0.9);
      break;
    }
    case "spinningTop": {
      ctx.fillStyle = c.body;
      ctx.strokeStyle = "rgba(220,230,245,0.35)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -9 * s);
      ctx.lineTo(7.5 * s, 0);
      ctx.lineTo(0, 9 * s);
      ctx.lineTo(-7.5 * s, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(180,190,210,0.35)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 7 * s, 1.6 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      glowDot(ctx, 0, 0, 1.3 * s, c.light, fade);
      glowDot(ctx, 0, -6.4 * s, 0.8 * s, c.light2, fade);
      glowDot(ctx, 0, 6.4 * s, 0.8 * s, c.light2, fade);
      break;
    }
    case "boomerang": {
      ctx.fillStyle = c.body;
      ctx.strokeStyle = "rgba(230,230,235,0.38)";
      ctx.lineWidth = 0.75;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(-12 * s, 5.2 * s);
      ctx.quadraticCurveTo(0, -9 * s, 12 * s, 5.2 * s);
      ctx.quadraticCurveTo(0, 0, -12 * s, 5.2 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      glowDot(ctx, -9 * s, 4 * s, 1.1 * s, c.light, fade);
      glowDot(ctx, 9 * s, 4 * s, 1.1 * s, c.light2, fade);
      glowDot(ctx, 0, -5.2 * s, 1 * s, c.light, fade);
      break;
    }
    case "chevron": {
      ctx.fillStyle = c.body;
      ctx.strokeStyle = "rgba(230,230,235,0.35)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -8 * s);
      ctx.lineTo(12 * s, 5.2 * s);
      ctx.lineTo(4 * s, 3.2 * s);
      ctx.lineTo(0, 8 * s);
      ctx.lineTo(-4 * s, 3.2 * s);
      ctx.lineTo(-12 * s, 5.2 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      glowDot(ctx, 0, -5.2 * s, 1.1 * s, c.light, fade);
      glowDot(ctx, 8 * s, 4 * s, 0.85 * s, c.light2, fade);
      glowDot(ctx, -8 * s, 4 * s, 0.85 * s, c.light2, fade);
      break;
    }
  }

  ctx.restore();
}

export function StarField({ paused, allowDuel = false }: { paused: boolean; allowDuel?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const duelRef = useRef(allowDuel);
  duelRef.current = allowDuel;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let crafts: Craft[] = [];
    let duels: Duel[] = [];
    let bursts: Burst[] = [];
    let nextCraftId = 1;
    const pairTried = new Set<string>();
    // First craft after a short beat-in; then ~4–5 appearances per minute
    let craftWait = 3500 + Math.random() * 4500;
    let lastT = performance.now();
    let kindCursor = Math.floor(Math.random() * CRAFT_KINDS.length);

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const parent = canvas.parentElement;
      w = canvas.clientWidth || parent?.clientWidth || window.innerWidth;
      h = canvas.clientHeight || parent?.clientHeight || window.innerHeight;
      if (w < 2) w = window.innerWidth;
      if (h < 2) h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = seedStars(w, h, w < 500 ? 240 : 380);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawnCraft = () => {
      const kind =
        Math.random() > 0.28
          ? CRAFT_KINDS[kindCursor++ % CRAFT_KINDS.length]
          : CRAFT_KINDS[Math.floor(Math.random() * CRAFT_KINDS.length)];

      let lights = pickLight();
      if (kind === "triangle") {
        lights = LIGHT_PALETTE[2];
      } else if (kind === "sphere" || kind === "orb") {
        lights = Math.random() > 0.5 ? LIGHT_PALETTE[1] : LIGHT_PALETTE[3];
      } else if (kind === "rectangle") {
        lights = LIGHT_PALETTE[0];
      } else if (kind === "disk") {
        lights = LIGHT_PALETTE[4];
      }

      const band = Math.random();
      let speed =
        band < 0.5
          ? 0.55 + Math.random() * 0.4
          : band < 0.88
            ? 0.95 + Math.random() * 0.55
            : 1.55 + Math.random() * 0.7;

      const from = Math.random();
      let x: number;
      let y: number;
      let heading: number;

      const other = crafts.find((c) => !c.locked);
      const intercept = Boolean(duelRef.current && other && Math.random() < 0.35);

      if (intercept && other) {
        const side = other.x < w * 0.5 ? 1 : -1;
        x = side > 0 ? w + 40 : -40;
        y = h * (0.1 + Math.random() * 0.45);
        const meetT = 120 + Math.random() * 90;
        const mx = other.x + other.vx * meetT;
        const my = other.y + other.vy * meetT;
        heading = Math.atan2(my - y, mx - x);
        speed = Math.max(0.7, Math.min(1.6, other.speed * (0.9 + Math.random() * 0.25)));
      } else if (from < 0.46) {
        x = -36;
        y = h * (0.08 + Math.random() * 0.48);
        heading = -0.16 + Math.random() * 0.32;
      } else if (from < 0.92) {
        x = w + 36;
        y = h * (0.08 + Math.random() * 0.48);
        heading = Math.PI - 0.16 + Math.random() * 0.32;
      } else {
        x = w * (0.18 + Math.random() * 0.64);
        y = -28;
        heading = 0.38 + Math.random() * 0.4;
        if (Math.random() > 0.5) heading = Math.PI - heading;
      }

      if (!intercept && Math.random() > 0.35) {
        const tx = w * (0.18 + Math.random() * 0.64);
        const ty = h * (0.12 + Math.random() * 0.42);
        heading = Math.atan2(ty - y, tx - x);
      }

      if (!intercept && (kind === "orb" || kind === "sphere" || kind === "oval")) {
        speed *= 0.42;
        if (Math.random() > 0.4) {
          x = w * (0.14 + Math.random() * 0.72);
          y = h * (0.07 + Math.random() * 0.32);
          heading = -0.2 + Math.random() * 0.4;
          if (Math.random() > 0.5) heading += Math.PI;
        }
      }

      const vx = Math.cos(heading) * speed;
      const vy = Math.sin(heading) * speed;
      const scale = 0.34 + Math.random() * 0.22;
      const dist = Math.hypot(w, h) * 0.78;
      const max = Math.max(280, Math.min(1100, dist / Math.max(0.28, speed) + 40));

      let rot = heading;
      if (kind === "triangle" || kind === "chevron" || kind === "boomerang") {
        rot = heading + Math.PI / 2;
      } else if (kind === "disk" || kind === "dome") {
        rot = 0;
      } else if (kind === "spinningTop") {
        rot = (Math.random() - 0.5) * 0.25;
      }

      const spin =
        kind === "disk" || kind === "dome" || kind === "orb" || kind === "sphere" || kind === "spinningTop"
          ? (Math.random() - 0.5) * 0.012
          : (Math.random() - 0.5) * 0.003;

      crafts.push({
        kind,
        id: nextCraftId++,
        x,
        y,
        vx,
        vy,
        speed,
        cruise: speed,
        heading,
        turn: (Math.random() - 0.5) * 0.0012,
        life: 0,
        max,
        scale,
        body: lights.body,
        light: lights.light,
        light2: lights.light2,
        rot,
        spin,
        locked: false,
      });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const freeze = pausedRef.current || reduce;
      const dt = freeze ? 0 : Math.min(48, now - lastT);
      lastT = now;
      const step = dt / 16.67;

      const energy = reduce ? 0 : tickHumLevel();
      for (const star of stars) {
        if (!freeze) star.tw += star.spd * (1 + energy * 0.65) * Math.max(step, 0);
        const wave = 0.5 + 0.5 * Math.sin(star.tw);
        const a = Math.min(1, star.base * (0.52 + 0.48 * wave) * (0.86 + 0.28 * energy));
        ctx.beginPath();
        ctx.fillStyle = `hsla(${star.hue}, ${a})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!freeze) {
        craftWait -= dt;
        if (craftWait <= 0 && crafts.length < 2) {
          spawnCraft();
          craftWait = crafts.length === 1 ? 4500 + Math.random() * 5500 : 11000 + Math.random() * 5000;
        }
      }

      if (!freeze && duelRef.current && !reduce && crafts.length >= 2) {
        for (let i = 0; i < crafts.length; i++) {
          for (let j = i + 1; j < crafts.length; j++) {
            const a = crafts[i]!;
            const b = crafts[j]!;
            if (a.locked || b.locked) continue;
            if (a.x < -20 || b.x < -20 || a.x > w + 20 || b.x > w + 20) continue;
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist > 54) continue;
            const key = a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;
            if (pairTried.has(key)) continue;
            pairTried.add(key);
            if (Math.random() > 0.1) continue;
            a.locked = true;
            b.locked = true;
            a.speed *= 0.15;
            b.speed *= 0.15;
            duels.push({
              a: a.id,
              b: b.id,
              loser: Math.random() > 0.5 ? a.id : b.id,
              t: 0,
              boom: false,
            });
          }
        }
      }

      if (!freeze) {
        for (let d = duels.length - 1; d >= 0; d--) {
          const duel = duels[d]!;
          duel.t += dt;
          const ca = crafts.find((c) => c.id === duel.a);
          const cb = crafts.find((c) => c.id === duel.b);
          if (!ca || !cb) {
            duels.splice(d, 1);
            continue;
          }
          const ang = Math.atan2(cb.y - ca.y, cb.x - ca.x);
          ca.heading = ang;
          cb.heading = ang + Math.PI;
          if (duel.t >= 220 && !duel.boom) {
            duel.boom = true;
            const dead = duel.loser === ca.id ? ca : cb;
            const live = dead === ca ? cb : ca;
            bursts.push(spawnBurst(dead.x, dead.y, dead.light));
            live.locked = false;
            live.speed = live.cruise;
            const idx = crafts.findIndex((c) => c.id === dead.id);
            if (idx >= 0) crafts.splice(idx, 1);
          }
          if (duel.t >= 900) duels.splice(d, 1);
        }
      }

      for (const duel of duels) {
        const ca = crafts.find((c) => c.id === duel.a);
        const cb = crafts.find((c) => c.id === duel.b);
        if (!ca || !cb) continue;
        if (duel.t > 90 && duel.t < 420) {
          const pulse = 0.45 + 0.55 * Math.abs(Math.sin(duel.t * 0.04));
          drawLaser(ctx, ca.x, ca.y, cb.x, cb.y, ca.light, pulse);
          drawLaser(ctx, cb.x, cb.y, ca.x, ca.y, cb.light, pulse * 0.85);
        }
      }

      for (let i = crafts.length - 1; i >= 0; i--) {
        const c = crafts[i];
        if (!freeze) {
          if (!c.locked) {
            c.turn += (Math.random() - 0.5) * 0.00018 * step - c.turn * 0.04 * step;
            c.heading += c.turn * step;
          }
          c.vx = Math.cos(c.heading) * c.speed;
          c.vy = Math.sin(c.heading) * c.speed;
          c.x += c.vx * step;
          c.y += c.vy * step;
          c.life += step;
          if (c.kind === "triangle" || c.kind === "chevron" || c.kind === "boomerang") {
            c.rot = c.heading + Math.PI / 2;
          } else if (c.kind === "cigar" || c.kind === "tic" || c.kind === "rectangle") {
            c.rot = c.heading;
          } else if (c.kind === "disk" || c.kind === "dome") {
            c.rot = 0;
          } else {
            c.rot += c.spin * step;
          }
        }
        const fade = Math.min(1, c.life / 36, (c.max - c.life) / 64);
        drawCraft(ctx, c, fade);
        if (!c.locked && (c.life > c.max || c.x < -80 || c.x > w + 80 || c.y < -70 || c.y > h + 70)) {
          crafts.splice(i, 1);
        }
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]!;
        if (!freeze) b.life += step;
        drawBurst(ctx, b, freeze ? 0 : step);
        if (b.life > b.max) bursts.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      aria-hidden="true"
      style={{ opacity: paused ? 0.45 : 1 }}
    >
      <div className="cosmos-wash absolute inset-0" />
      <canvas ref={canvasRef} className="star-layer absolute inset-0 size-full" />
    </div>
  );
}
