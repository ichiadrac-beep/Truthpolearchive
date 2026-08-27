import { useEffect, useMemo, useRef, useState } from "react";
import { markRedactions } from "@/lib/redact";
import {
  moveScratchFx,
  revealScratchFx,
  sampleWear,
  startScratchFx,
  stopScratchFx,
} from "@/lib/scratch-fx";
import { cn } from "@/lib/utils";

type ScratchTextProps = {
  text: string;
  fileId: string;
  className?: string;
};

export function ScratchText({ text, fileId, className }: ScratchTextProps) {
  const parts = useMemo(() => markRedactions(text, fileId), [text, fileId]);
  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.type === "redact" ? (
          <ScratchWord key={`${fileId}-${i}`} word={part.value} />
        ) : (
          <span key={`${fileId}-${i}`}>{part.value}</span>
        ),
      )}
    </p>
  );
}

function ScratchWord({ word }: { word: string }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number; t: number } | null>(null);
  const marked = useRef(false);
  const measured = useRef(0);
  const wearRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [wear, setWear] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || open) return;
    const paint = () => {
      if (marked.current) return;
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(8, Math.round(rect.width));
      const h = Math.max(8, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(8,8,8,0.96)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.fillRect(0, 0, w, 1);
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      for (let x = -h; x < w + h; x += 4) {
        ctx.fillRect(x, 0, 1.2, h);
      }
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [word, open]);

  const reportWear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const next = sampleWear(ctx, canvas);
    wearRef.current = next;
    setWear((prev) => (Math.abs(next - prev) > 0.03 ? next : prev));
    if (next >= 0.62 && !open) {
      setOpen(true);
      revealScratchFx();
    }
    return next;
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || open) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const now = performance.now();
    const dpr = canvas.width / Math.max(1, rect.width);
    const prev = last.current;
    const dist = prev ? Math.hypot(x - prev.x, y - prev.y) : 0;
    const dt = prev ? Math.max(8, now - prev.t) : 16;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(13, rect.height * 0.85);
    ctx.beginPath();
    if (prev) ctx.moveTo(prev.x, prev.y);
    else ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
    last.current = { x, y, t: now };
    marked.current = true;
    moveScratchFx(dist / dt);
    if (now - measured.current > 42) {
      measured.current = now;
      reportWear();
    }
  };

  const coating = Math.max(0.28, 1 - wear * 0.72);
  const ink = 0.2 + wear * 0.8;

  return (
    <span
      ref={wrapRef}
      className={cn("scratch-word", open && "scratch-word-open")}
      aria-label={open ? word : `Redacted, ${Math.round(wear * 100)} percent declassified. Scratch to reveal`}
    >
      <span className="scratch-word-ink" style={open ? undefined : { opacity: ink }}>
        {word}
      </span>
      {open ? null : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ opacity: coating }}
          onPointerDown={(event) => {
            event.stopPropagation();
            event.preventDefault();
            last.current = null;
            startScratchFx();
            event.currentTarget.setPointerCapture(event.pointerId);
            scratch(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            if (!event.buttons) return;
            event.stopPropagation();
            event.preventDefault();
            scratch(event.clientX, event.clientY);
          }}
          onPointerEnter={(event) => {
            if (!event.buttons) return;
            last.current = null;
            startScratchFx();
            scratch(event.clientX, event.clientY);
          }}
          onPointerUp={(event) => {
            last.current = null;
            reportWear();
            stopScratchFx();
            try {
              event.currentTarget.releasePointerCapture(event.pointerId);
            } catch {
              /* already released */
            }
          }}
          onPointerCancel={() => {
            last.current = null;
            stopScratchFx();
          }}
        />
      )}
    </span>
  );
}
