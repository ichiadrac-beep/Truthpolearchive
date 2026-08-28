import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Same rarity band as the MIB drop-in: linger, then maybe once. */
const WARMUP_MS = 90_000;
const IDLE_MS = 16_000;
const TICK_MS = 24_000;
const CHANCE = 0.05;
const COOLDOWN_MS = 9 * 60_000;
const MAX_PER_SESSION = 2;

const SESSION = {
  started: 0,
  fired: 0,
  lastFire: 0,
};

function sessionReady(now: number) {
  if (!SESSION.started) SESSION.started = now;
  if (SESSION.fired >= MAX_PER_SESSION) return false;
  if (now - SESSION.started < WARMUP_MS) return false;
  if (SESSION.lastFire && now - SESSION.lastFire < COOLDOWN_MS) return false;
  return true;
}

type Phase = "lost" | "snow-lost" | "cut" | "snow-restored" | "restored" | null;

export function SignalDrop({ paused }: { paused: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastInput = useRef(performance.now());
  const playing = useRef(false);
  const [phase, setPhase] = useState<Phase>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    lastInput.current = performance.now();
  }, [pathname]);

  useEffect(() => {
    const bump = () => {
      lastInput.current = performance.now();
    };
    window.addEventListener("pointerdown", bump, { passive: true });
    window.addEventListener("keydown", bump, { passive: true });
    window.addEventListener("touchstart", bump, { passive: true });
    window.addEventListener("scroll", bump, { passive: true, capture: true });
    document.addEventListener("visibilitychange", bump);
    return () => {
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("keydown", bump);
      window.removeEventListener("touchstart", bump);
      window.removeEventListener("scroll", bump, true);
      document.removeEventListener("visibilitychange", bump);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let stopSnow: (() => void) | null = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      if (cancelled || playing.current) return;
      playing.current = true;
      SESSION.fired += 1;
      SESSION.lastFire = performance.now();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { alpha: false }) ?? null;
      stopSnow = ctx && canvas ? startSnow(canvas, ctx) : null;

      const beat = (next: Phase, ms: number) =>
        new Promise<void>((resolve) => {
          window.setTimeout(() => {
            if (!cancelled) setPhase(next);
            resolve();
          }, ms);
        });

      void (async () => {
        setPhase("lost");
        await beat("snow-lost", 40);
        await beat("cut", 150);
        await beat("snow-restored", 40);
        await beat("restored", 150);
        await beat(null, 90);
        stopSnow?.();
        stopSnow = null;
        playing.current = false;
      })();
    };

    const onForce = () => run();
    window.addEventListener("truthpole:signal-drop", onForce);

    const tick = window.setInterval(() => {
      if (reduce || cancelled || playing.current || pausedRef.current) return;
      if (document.visibilityState !== "visible") return;
      const now = performance.now();
      if (now - lastInput.current < IDLE_MS) return;
      if (!sessionReady(now)) return;
      if (Math.random() < CHANCE) run();
    }, TICK_MS);

    return () => {
      cancelled = true;
      window.clearInterval(tick);
      window.removeEventListener("truthpole:signal-drop", onForce);
      stopSnow?.();
      playing.current = false;
    };
  }, []);

  const lost = phase === "lost" || phase === "snow-lost";
  const copy = lost ? "SIGNAL LOST" : phase ? "SIGNAL RESTORED" : "";
  const bars = lost ? "▯▯▯▯▯" : "▮▮▮▮▮";
  const snow = phase === "snow-lost" || phase === "snow-restored";

  return (
    <div
      className={cn("signal-drop", phase && "is-on", snow && "is-snow")}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="signal-drop-canvas" />
      {phase ? (
        <div className={cn("signal-drop-copy", lost ? "is-lost" : "is-restored")}>
          <p>{copy}</p>
          <p className="signal-drop-bars">{bars}</p>
        </div>
      ) : null}
    </div>
  );
}

function startSnow(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  let live = true;
  let raf = 0;
  const noise = document.createElement("canvas");
  const nctx = noise.getContext("2d", { alpha: false });
  if (!nctx) return () => undefined;

  const resize = () => {
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || canvas.clientWidth || 430;
    const h = parent?.clientHeight || canvas.clientHeight || 800;
    const dpr = Math.min(1.25, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    noise.width = Math.max(120, Math.floor(w / 2.4));
    noise.height = Math.max(200, Math.floor(h / 2.4));
  };
  resize();

  const frame = () => {
    if (!live) return;
    const nw = noise.width;
    const nh = noise.height;
    const img = nctx.createImageData(nw, nh);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    nctx.putImageData(img, 0, 0);
    const w = canvas.clientWidth || 430;
    const h = canvas.clientHeight || 800;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(noise, 0, 0, w, h);
    const bandY = Math.random() * (h - 24);
    const bandH = 6 + Math.random() * 28;
    const shift = (Math.random() - 0.5) * 48;
    ctx.drawImage(canvas, 0, bandY, w, bandH, shift, bandY, w, bandH);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => {
    live = false;
    cancelAnimationFrame(raf);
  };
}