import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, Pause, Play, X } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { geoGraticule10, geoPath } from "d3-geo";
import { geoMollweide } from "d3-geo-projection";
import { GlassButton } from "@/components/glass-button";
import {
  ARCHIVE_CASES,
  YEAR_MAX,
  YEAR_MIN,
  formatYearLabel,
  type ArchiveCase,
} from "@/lib/archive-cases";

type PeekState = { file: ArchiveCase; x: number; y: number };
type PinView = { file: ArchiveCase; x: number; y: number; r: number };

export type ArchiveMapProps = {
  year: number;
  onYear: (year: number) => void;
  onOpen: (file: ArchiveCase) => void;
  cases?: ArchiveCase[];
  yearMin?: number;
  yearMax?: number;
  showTimeline?: boolean;
  step?: number;
  playMs?: number;
  mapLabel?: string;
  countLabel?: string;
  endLabel?: string;
};

const DEFAULT_ROTATE: [number, number] = [-10, 0];
const MIN_ZOOM = 1;
const MAX_ZOOM = 7.5;

type View = {
  rotate: [number, number];
  zoom: number;
  tx: number;
  ty: number;
  targetZoom: number;
  targetTx: number;
  targetTy: number;
};

function pinRadius(zoom: number) {
  return Math.max(2.15, 8.6 / Math.pow(zoom, 0.92));
}

export function ArchiveMap({
  year,
  onYear,
  onOpen,
  cases = ARCHIVE_CASES,
  yearMin = YEAR_MIN,
  yearMax = YEAR_MAX,
  showTimeline = true,
  step = 1,
  playMs = 72,
  mapLabel = "World archive globe",
  countLabel = "cases in view",
  endLabel = "Now",
}: ArchiveMapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geoRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const viewRef = useRef<View>({
    rotate: [...DEFAULT_ROTATE],
    zoom: 1,
    tx: 0,
    ty: 0,
    targetZoom: 1,
    targetTx: 0,
    targetTy: 0,
  });
  const yearRef = useRef(year);
  const onOpenRef = useRef(onOpen);
  const casesRef = useRef(cases);
  const yearMinRef = useRef(yearMin);
  const yearMaxRef = useRef(yearMax);
  const stepRef = useRef(step);
  const dragRef = useRef<{
    x: number;
    y: number;
    tx: number;
    ty: number;
    rot: [number, number];
    moved: boolean;
    pin: ArchiveCase | null;
  } | null>(null);
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const pinsRef = useRef<PinView[]>([]);
  const holdRef = useRef(0);
  const holdStartRef = useRef({ x: 0, y: 0 });
  const peekingRef = useRef(false);
  const animRef = useRef(0);
  const markedReady = useRef(false);
  const pinKeyRef = useRef("");
  const [ready, setReady] = useState(false);
  const [pins, setPins] = useState<PinView[]>([]);
  const [peek, setPeek] = useState<PeekState | null>(null);
  const [playing, setPlaying] = useState(true);
  const [count, setCount] = useState(
    () => cases.filter((c) => c.year <= year).length,
  );

  yearRef.current = year;
  onOpenRef.current = onOpen;
  casesRef.current = cases;
  yearMinRef.current = yearMin;
  yearMaxRef.current = yearMax;
  stepRef.current = step;

  useEffect(() => {
    setCount(cases.filter((c) => c.year <= year).length);
  }, [year, cases]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    let cancelled = false;
    let resize: ResizeObserver | undefined;

    const clampPan = () => {
      const v = viewRef.current;
      const limit = (v.targetZoom - 1) * 280;
      v.targetTx = Math.max(-limit, Math.min(limit, v.targetTx));
      v.targetTy = Math.max(-limit * 0.7, Math.min(limit * 0.7, v.targetTy));
    };

    const draw = () => {
      const geo = geoRef.current;
      const ctx = canvas.getContext("2d");
      if (!geo || !ctx || cancelled) return;
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w < 40 || h < 80) return;

      const v = viewRef.current;
      v.zoom += (v.targetZoom - v.zoom) * 0.22;
      v.tx += (v.targetTx - v.tx) * 0.22;
      v.ty += (v.targetTy - v.ty) * 0.22;
      if (Math.abs(v.targetZoom - v.zoom) < 0.003) v.zoom = v.targetZoom;
      if (Math.abs(v.targetTx - v.tx) < 0.15) v.tx = v.targetTx;
      if (Math.abs(v.targetTy - v.ty) < 0.15) v.ty = v.targetTy;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      const padX = Math.max(10, w * 0.05);
      const padY = Math.max(18, h * 0.07);
      const projection = geoMollweide()
        .precision(0.4)
        .rotate([v.rotate[0], v.rotate[1], 0])
        .fitExtent(
          [
            [padX, padY],
            [w - padX, h - padY],
          ],
          { type: "Sphere" },
        );
      const [cx, cy] = projection.translate();
      projection.translate([cx + v.tx, cy + v.ty]);
      projection.scale(projection.scale() * v.zoom);
      const path = geoPath(projection, ctx);

      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.save();
      ctx.clip();

      ctx.beginPath();
      path(geoGraticule10());
      ctx.strokeStyle = "rgba(188,188,194,0.38)";
      ctx.lineWidth = 0.55;
      ctx.stroke();

      ctx.beginPath();
      path(geo);
      ctx.strokeStyle = "rgba(220,220,224,0.82)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.strokeStyle = "rgba(230,230,232,0.55)";
      ctx.lineWidth = 1.15;
      ctx.stroke();

      const r = pinRadius(v.zoom);
      const next: PinView[] = [];
      for (const file of casesRef.current) {
        if (file.year > yearRef.current) continue;
        const p = projection([file.lng, file.lat]);
        if (!p) continue;
        if (p[0] < -20 || p[0] > w + 20 || p[1] < -20 || p[1] > h + 20) continue;
        next.push({ file, x: p[0], y: p[1], r });
        ctx.beginPath();
        ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
        ctx.fillStyle = "#b11f1f";
        ctx.shadowColor = "rgba(140,20,20,0.85)";
        ctx.shadowBlur = Math.max(2, 8 / v.zoom);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      pinsRef.current = next;
      if (!markedReady.current) {
        markedReady.current = true;
        setReady(true);
      }
      const settled =
        !dragRef.current &&
        !pinchRef.current &&
        Math.abs(v.targetZoom - v.zoom) < 0.02 &&
        Math.abs(v.targetTx - v.tx) < 0.5;
      if (settled) {
        const key =
          next.map((p) => p.file.id).join("|") +
          `@${Math.round(v.zoom * 20)}:${Math.round(v.tx)}:${Math.round(v.ty)}`;
        if (key !== pinKeyRef.current) {
          pinKeyRef.current = key;
          setPins(next);
        }
      }

      const moving =
        Math.abs(v.targetZoom - v.zoom) > 0.003 ||
        Math.abs(v.targetTx - v.tx) > 0.15 ||
        Math.abs(v.targetTy - v.ty) > 0.15;
      if (moving) animRef.current = requestAnimationFrame(draw);
    };

    const schedule = () => {
      cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(draw);
    };

    void (async () => {
      const geo = (await fetch("/geo/countries-110m.json").then((r) => r.json())) as GeoJSON.FeatureCollection;
      if (cancelled) return;
      geoRef.current = geo;
      schedule();
    })();

    resize = new ResizeObserver(schedule);
    resize.observe(host);

    const hitPin = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      let best: PinView | null = null;
      let bestD = 32;
      for (const pin of pinsRef.current) {
        const d = Math.hypot(pin.x - x, pin.y - y);
        const reach = Math.max(28, pin.r * 4);
        if (d < reach && d < bestD) {
          bestD = d;
          best = pin;
        }
      }
      return best;
    };

    const clearHold = () => {
      if (holdRef.current) window.clearTimeout(holdRef.current);
      holdRef.current = 0;
    };

    const dismissPeek = () => {
      peekingRef.current = false;
      setPeek(null);
    };

    const zoomAt = (clientX: number, clientY: number, nextZoom: number) => {
      const v = viewRef.current;
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left - rect.width / 2;
      const my = clientY - rect.top - rect.height / 2;
      const z0 = v.targetZoom;
      const z1 = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
      const k = z1 / z0;
      v.targetTx = mx - (mx - v.targetTx) * k;
      v.targetTy = my - (my - v.targetTy) * k;
      v.targetZoom = z1;
      if (z1 <= 1.02) {
        v.targetTx = 0;
        v.targetTy = 0;
      }
      clampPan();
      schedule();
    };

    const onDown = (ev: PointerEvent) => {
      if (ev.pointerType === "touch" && pinchRef.current) return;
      canvas.setPointerCapture(ev.pointerId);
      const pin = hitPin(ev.clientX, ev.clientY);
      if (!pin) dismissPeek();
      const v = viewRef.current;
      dragRef.current = {
        x: ev.clientX,
        y: ev.clientY,
        tx: v.targetTx,
        ty: v.targetTy,
        rot: [...v.rotate],
        moved: false,
        pin: pin?.file ?? null,
      };
      if (pin) {
        holdRef.current = window.setTimeout(() => {
          peekingRef.current = true;
          setPeek({ file: pin.file, x: pin.x, y: pin.y });
        }, 260);
      }
    };
    const onMove = (ev: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || pinchRef.current) return;
      const dx = ev.clientX - drag.x;
      const dy = ev.clientY - drag.y;
      if (Math.hypot(dx, dy) > 22) {
        drag.moved = true;
        clearHold();
        dismissPeek();
      }
      if (!drag.moved) return;
      const v = viewRef.current;
      if (v.targetZoom > 1.08) {
        v.targetTx = drag.tx + dx;
        v.targetTy = drag.ty + dy;
        clampPan();
      } else {
        v.rotate = [
          drag.rot[0] + dx * 0.28,
          Math.max(-36, Math.min(36, drag.rot[1] - dy * 0.24)),
        ];
      }
      schedule();
    };
    const onUp = (ev: PointerEvent) => {
      const drag = dragRef.current;
      const wasPeeking = peekingRef.current;
      dragRef.current = null;
      clearHold();
      if (drag && !drag.moved && drag.pin && !wasPeeking) {
        dismissPeek();
        onOpenRef.current(drag.pin);
      }
      if (drag?.moved) dismissPeek();
      try {
        canvas.releasePointerCapture(ev.pointerId);
      } catch {
        /* already released */
      }
    };
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const v = viewRef.current;
      const wheelStep = ev.deltaY > 0 ? -0.22 : 0.22;
      zoomAt(ev.clientX, ev.clientY, v.targetZoom + wheelStep * v.targetZoom * 0.35);
    };
    const touchDist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const touchMid = (a: Touch, b: Touch) => ({
      x: (a.clientX + b.clientX) / 2,
      y: (a.clientY + b.clientY) / 2,
    });
    const onTouchStart = (ev: TouchEvent) => {
      if (ev.touches.length === 2) {
        ev.preventDefault();
        dragRef.current = null;
        clearHold();
        pinchRef.current = {
          dist: touchDist(ev.touches[0], ev.touches[1]),
          zoom: viewRef.current.targetZoom,
        };
      }
    };
    const onTouchMove = (ev: TouchEvent) => {
      ev.preventDefault();
      if (ev.touches.length === 2 && pinchRef.current) {
        const d = touchDist(ev.touches[0], ev.touches[1]);
        const mid = touchMid(ev.touches[0], ev.touches[1]);
        const next = pinchRef.current.zoom * (d / pinchRef.current.dist);
        zoomAt(mid.x, mid.y, next);
      }
    };
    const onTouchEnd = (ev: TouchEvent) => {
      if (ev.touches.length < 2) pinchRef.current = null;
    };
    const onGesture = (ev: Event) => ev.preventDefault();

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    host.addEventListener("touchstart", onTouchStart, { passive: false });
    host.addEventListener("touchmove", onTouchMove, { passive: false });
    host.addEventListener("touchend", onTouchEnd);
    host.addEventListener("gesturestart", onGesture);

    (host as HTMLDivElement & { __redraw?: () => void; __zoomBy?: (d: number) => void; __reset?: () => void }).__redraw =
      schedule;
    (host as HTMLDivElement & { __zoomBy?: (d: number) => void }).__zoomBy = (d) => {
      const v = viewRef.current;
      const rect = canvas.getBoundingClientRect();
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, v.targetZoom + d);
    };
    (host as HTMLDivElement & { __reset?: () => void }).__reset = () => {
      const v = viewRef.current;
      v.rotate = [...DEFAULT_ROTATE];
      v.targetZoom = 1;
      v.targetTx = 0;
      v.targetTy = 0;
      schedule();
    };

    return () => {
      cancelled = true;
      cancelAnimationFrame(animRef.current);
      resize?.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      host.removeEventListener("touchstart", onTouchStart);
      host.removeEventListener("touchmove", onTouchMove);
      host.removeEventListener("touchend", onTouchEnd);
      host.removeEventListener("gesturestart", onGesture);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current as (HTMLDivElement & { __redraw?: () => void }) | null;
    host?.__redraw?.();
  }, [year, cases]);

  useEffect(() => {
    if (!playing || !showTimeline) return;
    const id = window.setInterval(() => {
      if (yearRef.current >= yearMaxRef.current) {
        setPlaying(false);
        return;
      }
      onYear(Math.min(yearMaxRef.current, yearRef.current + stepRef.current));
    }, playMs);
    return () => window.clearInterval(id);
  }, [playing, onYear, playMs, showTimeline]);

  const zoomBy = (delta: number) => {
    const host = hostRef.current as (HTMLDivElement & { __zoomBy?: (d: number) => void }) | null;
    host?.__zoomBy?.(delta);
  };

  const resetView = () => {
    const host = hostRef.current as (HTMLDivElement & { __reset?: () => void }) | null;
    host?.__reset?.();
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overscroll-none">
      <div className="relative min-h-0 flex-1 touch-none bg-black">
        <div
          ref={hostRef}
          className="archive-map absolute inset-0 touch-none bg-black"
          aria-label={mapLabel}
        >
          <canvas
            ref={canvasRef}
            className="block size-full cursor-grab touch-none active:cursor-grabbing"
          />
          {pins.map((pin) => (
            <button
              key={pin.file.id}
              type="button"
              data-pin={pin.file.id}
              aria-label={`${pin.file.title}, ${formatYearLabel(pin.file.year)}`}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent"
              style={{
                left: pin.x,
                top: pin.y,
                width: Math.max(40, pin.r * 5.5),
                height: Math.max(40, pin.r * 5.5),
              }}
              onPointerDown={(ev) => {
                ev.stopPropagation();
                ev.currentTarget.setPointerCapture(ev.pointerId);
                holdStartRef.current = { x: ev.clientX, y: ev.clientY };
                if (holdRef.current) window.clearTimeout(holdRef.current);
                holdRef.current = window.setTimeout(() => {
                  peekingRef.current = true;
                  setPeek({ file: pin.file, x: pin.x, y: pin.y });
                }, 240);
              }}
              onPointerMove={(ev) => {
                const start = holdStartRef.current;
                if (holdRef.current && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 18) {
                  window.clearTimeout(holdRef.current);
                  holdRef.current = 0;
                }
              }}
              onPointerUp={(ev) => {
                ev.stopPropagation();
                const shown = peekingRef.current;
                if (holdRef.current) window.clearTimeout(holdRef.current);
                holdRef.current = 0;
                if (!shown) {
                  peekingRef.current = false;
                  setPeek(null);
                  onOpen(pin.file);
                }
              }}
              onPointerCancel={() => {
                if (holdRef.current) window.clearTimeout(holdRef.current);
                holdRef.current = 0;
              }}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
              }}
            />
          ))}
        </div>
        {!ready ? (
          <p className="pointer-events-none absolute inset-0 grid place-items-center font-display text-xs tracking-kicker text-muted">
            PLOTTING FILES
          </p>
        ) : null}

        {peek ? (
          <PeekCard
            peek={peek}
            onOpen={() => {
              const file = peek.file;
              peekingRef.current = false;
              setPeek(null);
              onOpen(file);
            }}
            onClose={() => {
              peekingRef.current = false;
              setPeek(null);
            }}
          />
        ) : null}

        <div className="pointer-events-none absolute top-3 right-3 z-30 flex flex-col gap-2">
          <GlassButton
            variant="icon"
            className="pointer-events-auto size-11"
            aria-label="Zoom in"
            onClick={() => zoomBy(0.55)}
          >
            <Plus className="size-4" strokeWidth={1.7} />
          </GlassButton>
          <GlassButton
            variant="icon"
            className="pointer-events-auto size-11"
            aria-label="Zoom out"
            onClick={() => zoomBy(-0.55)}
          >
            <Minus className="size-4" strokeWidth={1.7} />
          </GlassButton>
          <GlassButton
            variant="icon"
            className="pointer-events-auto size-11"
            aria-label="Reset globe"
            onClick={resetView}
          >
            <RotateCcw className="size-4" strokeWidth={1.7} />
          </GlassButton>
        </div>
        <p className="pointer-events-none absolute inset-x-4 bottom-3 z-10 text-center text-[12px] leading-relaxed text-fg/40">
          Hold a pin to peek · tap to open the file
        </p>
      </div>

      {showTimeline ? (
        <div className="z-20 shrink-0 px-4 pb-3 pt-1">
          <p className="font-display text-[11px] tracking-[0.38em] text-fg/45">TIMELINE</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="font-serif text-[2rem] leading-none text-fg">{formatYearLabel(year)}</p>
            <p className="pb-1 text-sm text-fg/45">
              {count} {countLabel}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <GlassButton
              variant="icon"
              className="size-11 shrink-0"
              aria-label={playing ? "Pause timeline" : "Play timeline"}
              onClick={() => {
                if (playing) {
                  setPlaying(false);
                  return;
                }
                if (yearRef.current >= yearMax) onYear(yearMin);
                setPlaying(true);
              }}
            >
              {playing ? (
                <Pause className="size-4" strokeWidth={1.7} />
              ) : (
                <Play className="size-4" strokeWidth={1.7} />
              )}
            </GlassButton>
            <Slider.Root
              min={yearMin}
              max={yearMax}
              step={step}
              value={[year]}
              onValueChange={(v) => {
                setPlaying(false);
                onYear(v[0] ?? yearMax);
              }}
              className="relative flex h-7 w-full touch-none items-center"
              aria-label="Archive year"
            >
              <Slider.Track className="relative h-px grow rounded-full bg-fg/20">
                <Slider.Range className="absolute h-full rounded-full bg-fg/70" />
              </Slider.Track>
              <Slider.Thumb
                className="block size-5 rounded-full bg-fg shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
                aria-label="Archive year"
              />
            </Slider.Root>
          </div>
          <div className="mt-1 flex justify-between font-display text-xs text-fg/35">
            <span>{formatYearLabel(yearMin)}</span>
            <span>{endLabel}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PeekCard({
  peek,
  onOpen,
  onClose,
}: {
  peek: PeekState;
  onOpen: () => void;
  onClose: () => void;
}) {
  const width = 268;
  const placeAbove = peek.y > 170;
  return (
    <div
      role="dialog"
      aria-label={`Peek ${peek.file.title}`}
      className="peek-card glass-strong pointer-events-auto absolute z-40 rounded-3xl px-4 pt-3 pb-3"
      style={{
        width,
        left: `min(max(10px, ${Math.round(peek.x) - width / 2}px), calc(100% - ${width + 10}px))`,
        top: placeAbove ? peek.y - 158 : peek.y + 22,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-[11px] font-medium tracking-[0.32em] text-fg/45">PEEK</p>
        <GlassButton variant="icon" className="size-9 shrink-0" aria-label="Close peek" onClick={onClose}>
          <X className="size-4" strokeWidth={1.7} />
        </GlassButton>
      </div>
      <h2 className="mt-1 font-serif text-[1.65rem] leading-none text-fg">{peek.file.title}</h2>
      <p className="mt-2 text-sm leading-snug text-fg/55">
        {peek.file.place} · {formatYearLabel(peek.file.year)}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <GlassButton variant="chip" className="h-10 min-w-0 flex-1 rounded-full" onClick={onOpen}>
          Open file
        </GlassButton>
      </div>
    </div>
  );
}
