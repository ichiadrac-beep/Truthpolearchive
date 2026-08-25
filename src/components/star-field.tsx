import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; base: number; tw: number; spd: number; hue: string };
type Shoot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  w: number;
  color: string;
  glow: string;
  head: string;
};
type Craft =
  | { kind: "triangle"; x: number; y: number; vx: number; vy: number; life: number; max: number }
  | { kind: "tic"; x: number; y: number; vx: number; vy: number; life: number; max: number }
  | { kind: "orb"; x: number; y: number; vx: number; vy: number; life: number; max: number; color: string };

const SHOOT_PALETTE: { color: string; glow: string; head: string; weight: number }[] = [
  { color: "rgba(232,232,230,0.88)", glow: "rgba(200,204,210,0.34)", head: "rgba(246,246,244,0.9)", weight: 70 },
  { color: "rgba(164,204,176,0.72)", glow: "rgba(120,176,140,0.26)", head: "rgba(214,228,216,0.82)", weight: 20 },
  { color: "rgba(196,160,104,0.74)", glow: "rgba(176,132,72,0.24)", head: "rgba(228,204,158,0.82)", weight: 8 },
  { color: "rgba(118,32,34,0.8)", glow: "rgba(92,18,20,0.28)", head: "rgba(168,64,66,0.78)", weight: 2 },
];

function pickShoot() {
  const total = SHOOT_PALETTE.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const p of SHOOT_PALETTE) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return SHOOT_PALETTE[0];
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

export function StarField({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

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
    let shoots: Shoot[] = [];
    let crafts: Craft[] = [];
    let spawnIn = 10 + Math.random() * 25;
    let craftIn = 400 + Math.random() * 700;

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
      const count = w < 500 ? 240 : 380;
      stars = seedStars(w, h, count);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawnShoot = () => {
      const pal = pickShoot();
      const fromLeft = Math.random() > 0.35;
      const x = fromLeft ? -40 : w * (0.1 + Math.random() * 0.7);
      const y = Math.random() * h * 0.55;
      const speed = 7 + Math.random() * 6;
      const ang = fromLeft ? 0.38 + Math.random() * 0.18 : 0.42;
      shoots.push({
        x,
        y,
        vx: Math.cos(ang) * speed * (fromLeft ? 1 : 0.85),
        vy: Math.sin(ang) * speed,
        life: 0,
        max: 28 + Math.random() * 18,
        w: 1.05 + Math.random() * 0.45,
        color: pal.color,
        glow: pal.glow,
        head: pal.head,
      });
    };

    const spawnCraft = () => {
      const roll = Math.random();
      if (roll < 0.45) {
        crafts.push({
          kind: "tic",
          x: -30,
          y: 40 + Math.random() * (h * 0.45),
          vx: 0.55 + Math.random() * 0.35,
          vy: (Math.random() - 0.5) * 0.12,
          life: 0,
          max: 520,
        });
      } else if (roll < 0.75) {
        crafts.push({
          kind: "triangle",
          x: w + 40,
          y: 30 + Math.random() * (h * 0.4),
          vx: -(0.35 + Math.random() * 0.2),
          vy: 0.05,
          life: 0,
          max: 700,
        });
      } else {
        crafts.push({
          kind: "orb",
          x: Math.random() * w,
          y: h * 0.15 + Math.random() * h * 0.3,
          vx: (Math.random() - 0.5) * 0.4,
          vy: 0.12 + Math.random() * 0.18,
          life: 0,
          max: 280,
          color: Math.random() > 0.5 ? "rgba(90,210,140,0.85)" : "rgba(200,80,80,0.8)",
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const freeze = pausedRef.current || reduce;

      for (const star of stars) {
        if (!freeze) star.tw += star.spd;
        const a = star.base * (0.55 + 0.45 * (0.5 + 0.5 * Math.sin(star.tw)));
        ctx.beginPath();
        ctx.fillStyle = `hsla(${star.hue}, ${a})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!freeze) {
        spawnIn -= 1;
        craftIn -= 1;
        if (spawnIn <= 0 && shoots.length < 5) {
          spawnShoot();
          spawnIn = 30 + Math.random() * 60;
        }
        if (craftIn <= 0 && crafts.length < 1) {
          spawnCraft();
          craftIn = 900 + Math.random() * 1400;
        }
      }

      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        if (!freeze) {
          s.x += s.vx;
          s.y += s.vy;
          s.life += 1;
        }
        const t = s.life / s.max;
        const alpha = t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88;
        const len = 46 + s.w * 18;
        const ang = Math.atan2(s.vy, s.vx);
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(ang);
        const grad = ctx.createLinearGradient(-len, 0, 8, 0);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.72, s.glow.replace(/[\d.]+\)$/g, `${0.28 * alpha})`));
        grad.addColorStop(1, s.color.replace(/[\d.]+\)$/g, `${0.9 * alpha})`));
        ctx.fillStyle = grad;
        ctx.fillRect(-len, -s.w / 2, len + 6, s.w);
        ctx.beginPath();
        ctx.fillStyle = s.head.replace(/[\d.]+\)$/g, `${0.85 * alpha})`);
        ctx.arc(0, 0, s.w * 0.62, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (s.life > s.max || s.x > w + 80 || s.y > h + 80) shoots.splice(i, 1);
      }

      for (let i = crafts.length - 1; i >= 0; i--) {
        const c = crafts[i];
        if (!freeze) {
          c.x += c.vx;
          c.y += c.vy;
          c.life += 1;
        }
        const fade = Math.min(1, c.life / 40, (c.max - c.life) / 50);
        if (c.kind === "tic") {
          ctx.save();
          ctx.globalAlpha = 0.55 * fade;
          ctx.fillStyle = "rgba(220,225,230,0.9)";
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, 11, 3.2, 0.05, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (c.kind === "triangle") {
          ctx.save();
          ctx.globalAlpha = 0.5 * fade;
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x + 22, c.y + 10);
          ctx.lineTo(c.x + 6, c.y + 18);
          ctx.closePath();
          ctx.fillStyle = "rgba(8,8,10,0.85)";
          ctx.strokeStyle = "rgba(230,230,232,0.35)";
          ctx.lineWidth = 0.6;
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "rgba(243,243,241,0.8)";
          for (const [dx, dy] of [
            [2, 3],
            [18, 10],
            [7, 15],
          ] as const) {
            ctx.beginPath();
            ctx.arc(c.x + dx, c.y + dy, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else {
          ctx.save();
          ctx.globalAlpha = 0.7 * fade;
          ctx.fillStyle = c.color;
          ctx.shadowColor = c.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(c.x, c.y, 2.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        if (c.life > c.max || c.x < -60 || c.x > w + 60) crafts.splice(i, 1);
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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={{ opacity: paused ? 0.45 : 1 }}
    >
      <div className="cosmos-wash absolute inset-0" />
      <canvas ref={canvasRef} className="star-layer absolute inset-0 size-full" />
    </div>
  );
}
