import { useEffect, useRef } from "react";
import { killBogey, readBogeys, type SkyBogey } from "@/lib/sky-bogeys";

type Shape = "classic" | "saturn" | "flat" | "bell";
type Mode = "roam" | "tail" | "skirmish" | "aware" | "flee" | "charge" | "fire" | "blink";

type Burst = {
  x: number;
  y: number;
  life: number;
  max: number;
  sparks: { x: number; y: number; vx: number; vy: number; r: number }[];
};

type Bolt = { x1: number; y1: number; x2: number; y2: number; life: number; max: number };

const SHAPES: Shape[] = ["classic", "saturn", "flat", "bell"];
const AWARE = 140;
const CONTACT = 26;
const CRUISE = 0.62;
const FLEE = 1.55;
const CHARGE = 1.9;
const MAX_SPEED = 2.4;
const RETARGET = 120;
const GLOW = "rgba(90, 226, 240, 0.98)";
const SPARK = "rgba(245, 252, 255, 0.98)";
const TOUCH_IDLE = 2000;
const POINTER_IDLE = 2200;
const BOGEY_MIN_LIFE = 24;

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function SportSaucer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let spawnTimer: number | undefined;
    let pollTimer: number | undefined;
    let active = false;
    let mode: Mode = "roam";
    let x = 0;
    let y = 0;
    let heading = 0;
    let speed = CRUISE;
    let scale = 0.9;
    let shape: Shape = "classic";
    let until = 0;
    let aimX = 0;
    let aimY = 0;
    let retargetAt = 0;
    let hops = 0;
    let hopMax = 0;
    let leaveAt = 0;
    let tailId = 0;
    let lastT = performance.now();
    const pointer = { x: -9999, y: -9999, at: 0, touch: false };
    const bursts: Burst[] = [];
    const bolts: Bolt[] = [];

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
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? document.documentElement);

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.at = performance.now();
      pointer.touch = event.pointerType !== "mouse";
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });

    const pointerHot = (now: number) =>
      pointer.at > 0 && now - pointer.at < POINTER_IDLE && (!pointer.touch || now - pointer.at < TOUCH_IDLE);
    const pointerIdle = (now: number) => !pointerHot(now);

    const nearestBogey = (skip = 0): SkyBogey | null => {
      const list = readBogeys().filter((b) => b.life >= BOGEY_MIN_LIFE && b.id !== skip);
      if (!list.length) return null;
      return list.reduce((best, b) => (Math.hypot(b.x - x, b.y - y) < Math.hypot(best.x - x, best.y - y) ? b : best));
    };

    const schedule = (soon = false) => {
      spawnTimer = window.setTimeout(enter, soon ? rand(600, 1400) : rand(14_000, 36_000));
    };

    const enter = () => {
      const roll = Math.random();
      if (roll < 0.45) {
        x = -40;
        y = rand(h * 0.15, h * 0.75);
        heading = rand(-0.3, 0.3);
      } else if (roll < 0.9) {
        x = w + 40;
        y = rand(h * 0.15, h * 0.75);
        heading = Math.PI + rand(-0.3, 0.3);
      } else {
        x = rand(w * 0.2, w * 0.8);
        y = -36;
        heading = rand(0.6, Math.PI - 0.6);
      }
      scale = rand(0.42, 0.58);
      shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]!;
      speed = CRUISE;
      mode = "roam";
      hops = 0;
      hopMax = Math.round(rand(3, 5));
      leaveAt = performance.now() + rand(45_000, 75_000);
      bursts.length = 0;
      bolts.length = 0;
      active = true;
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const leave = () => {
      active = false;
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      schedule();
    };

    const burstAt = (bx: number, by: number) => {
      const sparks: Burst["sparks"] = [];
      const n = 14 + Math.floor(Math.random() * 8);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-0.2, 0.2);
        const sp = rand(0.8, 3);
        sparks.push({ x: bx, y: by, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rand(0.6, 1.8) });
      }
      bursts.push({ x: bx, y: by, life: 0, max: 30, sparks });
    };

    const startBlink = () => {
      burstAt(x, y);
      mode = "blink";
      until = performance.now() + rand(200, 400);
    };

    const blinkAway = () => {
      for (let i = 0; i < 12; i++) {
        const nx = rand(w * 0.1, w * 0.9);
        const ny = rand(h * 0.12, h * 0.85);
        if (Math.hypot(nx - pointer.x, ny - pointer.y) > AWARE * 1.4) {
          x = nx;
          y = ny;
          break;
        }
        x = rand(w * 0.1, w * 0.9);
        y = rand(h * 0.12, h * 0.85);
      }
      heading = rand(0, Math.PI * 2);
      speed = CRUISE;
      mode = "roam";
      burstAt(x, y);
      hops += 1;
      if (hops >= hopMax) leave();
    };

    const onContact = (now: number) => {
      if (Math.random() < 0.2) {
        aimX = pointer.x;
        aimY = pointer.y;
        mode = "fire";
        until = now + 120;
      } else {
        startBlink();
      }
    };

    const drawGlow = (alpha: number, bob: number) => {
      const s = scale;
      const heat = Math.min(1, speed / MAX_SPEED);
      const mood = mode === "charge" || mode === "fire" ? 1 : mode === "flee" ? 0.78 : mode === "aware" ? 0.55 : 0.3;
      ctx.save();
      ctx.translate(x, y + bob);
      const glowR = 13 * s * (0.85 + 0.4 * mood);
      ctx.globalAlpha = alpha * (0.22 + 0.45 * mood);
      const g = ctx.createRadialGradient(0, 4.2 * s, 0, 0, 4.2 * s, glowR);
      g.addColorStop(0, "rgba(90, 226, 240, 0.42)");
      g.addColorStop(0.4, "rgba(90, 226, 240, 0.12)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 4.2 * s, glowR, 4.8 * s * (0.9 + 0.25 * mood), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha * (0.35 + 0.4 * mood);
      ctx.strokeStyle = GLOW;
      ctx.lineWidth = 0.65;
      const spin = performance.now() * 0.0035;
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 3.55 * s, (7.2 + i * 2.4) * s, (2.05 + i * 0.45) * s, 0, spin + i, spin + i + Math.PI * 1.35);
        ctx.stroke();
      }
      const tx = -Math.cos(heading);
      const ty = -Math.sin(heading);
      const trail = (8 + 16 * heat) * s;
      ctx.globalAlpha = alpha * (0.18 + 0.4 * heat);
      const plume = ctx.createLinearGradient(tx * 2 * s, 3 * s + ty * 2 * s, tx * trail, 3 * s + ty * trail);
      plume.addColorStop(0, "rgba(90, 226, 240, 0.45)");
      plume.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = plume;
      ctx.beginPath();
      ctx.ellipse(tx * trail * 0.42, 3.1 * s + ty * trail * 0.42, trail * 0.5, 1.35 * s, Math.atan2(ty, tx), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawHull = (alpha: number, bob: number) => {
      const s = scale;
      ctx.save();
      ctx.translate(x, y + bob);
      ctx.globalAlpha = alpha;

      const wash = (cy: number, rx: number, ry: number) => {
        ctx.save();
        ctx.globalAlpha = alpha * 0.22;
        const g = ctx.createRadialGradient(0, cy, 0, 0, cy, rx);
        g.addColorStop(0, "rgba(170, 190, 210, 0.5)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      const chrome = (cy: number, rx: number, ry: number) => {
        const g = ctx.createLinearGradient(0, cy - ry * 1.6, 0, cy + ry * 1.4);
        g.addColorStop(0, "rgba(240, 246, 252, 0.98)");
        g.addColorStop(0.22, "rgba(198, 210, 222, 0.98)");
        g.addColorStop(0.55, "rgba(148, 160, 174, 0.98)");
        g.addColorStop(1, "rgba(68, 78, 90, 0.98)");
        ctx.fillStyle = g;
        ctx.strokeStyle = "rgba(255,255,255,0.32)";
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      };
      const shade = (cy: number, rx: number, ry: number) => {
        const g = ctx.createLinearGradient(0, cy - ry, 0, cy + ry * 1.4);
        g.addColorStop(0, "rgba(128, 140, 154, 0.95)");
        g.addColorStop(1, "rgba(46, 54, 64, 0.95)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      };
      const well = (cy: number, rx: number, ry: number) => {
        ctx.fillStyle = "rgba(38, 44, 52, 0.92)";
        ctx.beginPath();
        ctx.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      };
      const dome = (cy: number, rx: number, ry: number) => {
        const g = ctx.createLinearGradient(-rx * 0.45, cy - ry * 1.4, rx * 0.5, cy + ry * 0.4);
        g.addColorStop(0, "rgba(252, 254, 255, 0.98)");
        g.addColorStop(0.42, "rgba(184, 196, 208, 0.96)");
        g.addColorStop(1, "rgba(86, 96, 108, 0.92)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      };
      const ports = (cy: number, rx: number, ry: number, n: number) => {
        ctx.fillStyle = "rgba(16, 20, 26, 0.9)";
        for (let i = 0; i < n; i++) {
          const a = -Math.PI * 0.7 + (i / Math.max(1, n - 1)) * Math.PI * 1.4;
          ctx.beginPath();
          ctx.ellipse(Math.cos(a) * rx, cy + Math.sin(a) * ry, 0.68 * s, 0.5 * s, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      const spike = (cy: number) => {
        ctx.strokeStyle = "rgba(214, 222, 230, 0.95)";
        ctx.lineWidth = Math.max(0.4, 0.5 * s);
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(0, cy - 1.85 * s);
        ctx.stroke();
        ctx.fillStyle = "rgba(232, 238, 244, 0.95)";
        ctx.beginPath();
        ctx.arc(0, cy - 1.95 * s, 0.26 * s, 0, Math.PI * 2);
        ctx.fill();
      };
      const gleam = (gx: number, gy: number, rx: number, ry: number) => {
        ctx.fillStyle = "rgba(255,255,255,0.42)";
        ctx.beginPath();
        ctx.ellipse(gx, gy, rx, ry, -0.22, 0, Math.PI * 2);
        ctx.fill();
      };

      if (shape === "saturn") {
        wash(3.2 * s, 12.5 * s, 3.2 * s);
        shade(3.5 * s, 6.2 * s, 1.9 * s);
        chrome(1.55 * s, 14.2 * s, 2.35 * s);
        chrome(0.35 * s, 8.4 * s, 2.5 * s);
        well(-0.7 * s, 4.6 * s, 0.9 * s);
        dome(-1.7 * s, 3.6 * s, 1.7 * s);
        ports(-1.55 * s, 2.4 * s, 0.85 * s, 5);
        spike(-3.2 * s);
        gleam(-4.6 * s, 0.7 * s, 3.1 * s, 0.5 * s);
      } else if (shape === "flat") {
        wash(2.4 * s, 13 * s, 2.4 * s);
        chrome(1.1 * s, 14.4 * s, 1.85 * s);
        well(0.15 * s, 5.8 * s, 0.72 * s);
        ctx.fillStyle = "rgba(16, 20, 26, 0.88)";
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.ellipse(i * 1.55 * s, 0.12 * s, 0.62 * s, 0.38 * s, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        spike(-0.7 * s);
        gleam(-4.8 * s, 0.55 * s, 3.4 * s, 0.42 * s);
      } else if (shape === "bell") {
        wash(3.4 * s, 10.5 * s, 3.2 * s);
        shade(3.6 * s, 6.4 * s, 2.2 * s);
        chrome(1.6 * s, 11.2 * s, 3.1 * s);
        well(-0.15 * s, 5.4 * s, 1.1 * s);
        dome(-2.15 * s, 4.8 * s, 3.15 * s);
        ports(-1.7 * s, 3.15 * s, 1.2 * s, 5);
        spike(-5.1 * s);
        gleam(-3.4 * s, 0.55 * s, 2.6 * s, 0.58 * s);
      } else {
        wash(3.1 * s, 11 * s, 3.2 * s);
        shade(3.35 * s, 6.8 * s, 2.15 * s);
        chrome(1.15 * s, 13.2 * s, 3.25 * s);
        ctx.strokeStyle = "rgba(36, 44, 54, 0.42)";
        ctx.lineWidth = 0.5 * s;
        ctx.beginPath();
        ctx.ellipse(0, 1.5 * s, 12 * s, 2.45 * s, 0, 0, Math.PI * 2);
        ctx.stroke();
        well(-0.28 * s, 5.2 * s, 1.05 * s);
        dome(-1.45 * s, 4.4 * s, 2.2 * s);
        ports(-1.3 * s, 3 * s, 1.05 * s, 5);
        spike(-3.5 * s);
        gleam(-4.1 * s, 0.2 * s, 3 * s, 0.62 * s);
      }
      ctx.restore();
    };

    const drawBolt = (b: Bolt) => {
      const t = 1 - b.life / b.max;
      ctx.save();
      ctx.globalAlpha = t;
      ctx.lineCap = "round";
      ctx.shadowColor = GLOW;
      ctx.shadowBlur = 16;
      ctx.strokeStyle = GLOW;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.lineTo(b.x2, b.y2);
      ctx.stroke();
      ctx.restore();
    };

    const drawBurst = (b: Burst, step: number) => {
      const t = Math.min(1, b.life / b.max);
      const fade = 1 - t;
      ctx.save();
      ctx.globalAlpha = fade * 0.75;
      ctx.strokeStyle = GLOW;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3 + t * 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      for (const s of b.sparks) {
        s.x += s.vx * step;
        s.y += s.vy * step;
        s.vx *= 0.95;
        s.vy *= 0.95;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.fillStyle = SPARK;
        ctx.shadowColor = GLOW;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * fade, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const tick = (now: number) => {
      if (!active) return;
      const dt = Math.min(48, now - lastT);
      lastT = now;
      const step = dt / 16.67;
      ctx.clearRect(0, 0, w, h);

      const hot = pointerHot(now);
      const dist = hot ? Math.hypot(pointer.x - x, pointer.y - y) : Infinity;

      switch (mode) {
        case "roam":
          heading += rand(-0.01, 0.01) * step;
          speed += (CRUISE - speed) * 0.05 * step;
          if (hot && dist < AWARE) {
            tailId = 0;
            mode = "aware";
            until = now + rand(150, 350);
            break;
          }
          if (pointerIdle(now)) {
            const bogey = nearestBogey();
            if (bogey) {
              tailId = bogey.id;
              mode = "tail";
              until = now + rand(1400, 2800);
            }
          }
          break;
        case "tail": {
          if (hot && dist < AWARE) {
            tailId = 0;
            mode = "aware";
            until = now + rand(150, 350);
            break;
          }
          const bogey = readBogeys().find((b) => b.id === tailId) ?? nearestBogey();
          if (!bogey) {
            tailId = 0;
            mode = "roam";
            break;
          }
          tailId = bogey.id;
          const tx = bogey.x - 32;
          const ty = bogey.y + 16;
          heading = Math.atan2(ty - y, tx - x);
          speed += (CRUISE * 1.2 - speed) * 0.08 * step;
          if (now >= until) {
            if (Math.random() < 0.4) {
              mode = "skirmish";
              until = now + 2400;
            } else {
              tailId = 0;
              mode = "roam";
            }
          }
          break;
        }
        case "skirmish": {
          if (hot && dist < AWARE) {
            tailId = 0;
            mode = "aware";
            until = now + rand(150, 350);
            break;
          }
          const bogey = readBogeys().find((b) => b.id === tailId);
          if (!bogey) {
            tailId = 0;
            mode = "roam";
            speed = CRUISE;
            break;
          }
          heading = Math.atan2(bogey.y - y, bogey.x - x);
          speed = CHARGE;
          if (Math.hypot(bogey.x - x, bogey.y - y) < 36 || now >= until) {
            bolts.push({ x1: x, y1: y, x2: bogey.x, y2: bogey.y, life: 0, max: 18 });
            burstAt(bogey.x, bogey.y);
            killBogey(bogey.id);
            tailId = 0;
            mode = "roam";
            speed = CRUISE;
          }
          break;
        }
        case "aware":
          speed *= 0.94;
          if (now >= until) {
            if (Math.random() < 0.65) {
              heading = Math.atan2(y - pointer.y, x - pointer.x);
              speed = FLEE;
              mode = "flee";
              until = now + rand(800, 1200);
            } else {
              aimX = pointer.x;
              aimY = pointer.y;
              retargetAt = now + RETARGET;
              speed = CHARGE;
              mode = "charge";
              until = now + 2600;
            }
          }
          break;
        case "flee":
          if (now >= until) {
            mode = "roam";
          }
          break;
        case "charge":
          if (now >= retargetAt) {
            aimX = pointer.x;
            aimY = pointer.y;
            retargetAt = now + RETARGET;
          }
          heading = Math.atan2(aimY - y, aimX - x);
          if (now >= until) {
            mode = "roam";
            speed = CRUISE;
          }
          break;
        case "fire":
          speed *= 0.8;
          if (now >= until) {
            bolts.push({ x1: x, y1: y, x2: aimX, y2: aimY, life: 0, max: 16 });
            startBlink();
          }
          break;
        case "blink":
          if (now >= until) blinkAway();
          break;
      }

      if (mode !== "blink" && mode !== "fire") {
        speed = Math.min(speed, MAX_SPEED);
        x += Math.cos(heading) * speed * step;
        y += Math.sin(heading) * speed * step;
        if (x < 24 || x > w - 24) {
          heading = Math.PI - heading;
          x = Math.max(24, Math.min(w - 24, x));
        }
        if (y < 24 || y > h - 24) {
          heading = -heading;
          y = Math.max(24, Math.min(h - 24, y));
        }
        if ((mode === "charge" || mode === "flee") && hot && dist < CONTACT) onContact(now);
      }

      if (mode !== "blink") {
        const alpha = mode === "aware" ? 0.7 + 0.3 * Math.sin(now * 0.02) : 0.88;
        const bob = Math.sin(now * 0.0038) * 1.2;
        drawGlow(alpha, bob);
        drawHull(alpha, bob);
      }

      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]!;
        b.life += step;
        drawBolt(b);
        if (b.life >= b.max) bolts.splice(i, 1);
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]!;
        b.life += step;
        drawBurst(b, step);
        if (b.life >= b.max) bursts.splice(i, 1);
      }

      if (now >= leaveAt && mode === "roam") {
        leave();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const summon = () => {
      if (spawnTimer !== undefined) {
        window.clearTimeout(spawnTimer);
        spawnTimer = undefined;
      }
      if (active) {
        cancelAnimationFrame(raf);
        raf = 0;
        ctx.clearRect(0, 0, w, h);
      }
      enter();
    };

    schedule(true);
    pollTimer = window.setInterval(() => {
      if (active) return;
      const now = performance.now();
      if (pointerIdle(now) && nearestBogey()) {
        if (spawnTimer !== undefined) {
          window.clearTimeout(spawnTimer);
          spawnTimer = undefined;
        }
        enter();
      }
    }, 900);

    window.addEventListener("truthpole:summon-saucer", summon);
    return () => {
      cancelAnimationFrame(raf);
      if (spawnTimer !== undefined) window.clearTimeout(spawnTimer);
      if (pollTimer !== undefined) window.clearInterval(pollTimer);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("truthpole:summon-saucer", summon);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[60] size-full"
    />
  );
}
