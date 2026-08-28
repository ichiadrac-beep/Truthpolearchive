import { useEffect, useMemo, useRef, useState } from "react";
import {
  isFileDeclassified,
  isWordOpened,
  markFileDeclassified,
  markRedactions,
  markWordOpened,
} from "@/lib/redact";
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
  onComplete?: () => void;
};

export function ScratchText({ text, fileId, className, onComplete }: ScratchTextProps) {
  const parts = useMemo(() => markRedactions(text, fileId), [text, fileId]);
  const keys = useMemo(
    () => parts.map((part, i) => (part.type === "redact" ? `${i}:${part.value}` : "")).filter(Boolean),
    [parts],
  );
  const doneAtStart = isFileDeclassified(fileId) || keys.every((key) => isWordOpened(fileId, key));
  const [cleared, setCleared] = useState(doneAtStart);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  if (cleared || keys.length === 0) {
    return <p className={className}>{text}</p>;
  }

  const onWordOpen = (key: string) => {
    markWordOpened(fileId, key);
    const all = keys.every((item) => item === key || isWordOpened(fileId, item));
    if (!all) return;
    markFileDeclassified(fileId);
    setCleared(true);
    onCompleteRef.current?.();
  };

  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.type === "redact" ? (
          <ScratchWord
            key={`${fileId}-${i}`}
            word={part.value}
            wordKey={`${i}:${part.value}`}
            fileId={fileId}
            onOpen={onWordOpen}
          />
        ) : (
          <span key={`${fileId}-${i}`}>{part.value}</span>
        ),
      )}
    </p>
  );
}

function ScratchWord({
  word,
  wordKey,
  fileId,
  onOpen,
}: {
  word: string;
  wordKey: string;
  fileId: string;
  onOpen: (key: string) => void;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number; t: number } | null>(null);
  const travel = useRef(0);
  const snapshot = useRef<ImageData | null>(null);
  const measured = useRef(0);
  const wearRef = useRef(0);
  const held = useRef(false);
  const [open, setOpen] = useState(() => isWordOpened(fileId, wordKey));
  const [wear, setWear] = useState(0);

  const paint = () => {
    if (held.current || travel.current > 0) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
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
    ctx.fillStyle = "rgba(6,6,7,0.97)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, 0, w, 1);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let x = -h; x < w + h; x += 3.5) {
      ctx.fillRect(x, 0, 1.15, h);
    }
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, h - 1, w, 1);
  };

  useEffect(() => {
    if (open) return;
    paint();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(paint);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [word, open]);

  const finish = () => {
    if (open) return;
    setOpen(true);
    revealScratchFx();
    onOpen(wordKey);
  };

  const reportWear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const next = sampleWear(ctx, canvas);
    wearRef.current = next;
    setWear((prev) => (Math.abs(next - prev) > 0.03 ? next : prev));
    if (next >= 0.48 && travel.current >= 20) finish();
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
    travel.current += dist;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(9, rect.height * 0.52);
    ctx.beginPath();
    if (prev) ctx.moveTo(prev.x, prev.y);
    else ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
    last.current = { x, y, t: now };
    moveScratchFx(dist / dt);
    if (now - measured.current > 42) {
      measured.current = now;
      reportWear();
    }
  };
  const scratchRef = useRef(scratch);
  scratchRef.current = scratch;

  const endStroke = () => {
    if (!held.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (reduce && travel.current < 8) {
      finish();
    } else if (travel.current < 22) {
      const ctx = canvas?.getContext("2d");
      if (ctx && snapshot.current) ctx.putImageData(snapshot.current, 0, 0);
      setWear(0);
      wearRef.current = 0;
    } else {
      reportWear();
    }
    held.current = false;
    last.current = null;
    snapshot.current = null;
    stopScratchFx();
  };
  const endRef = useRef(endStroke);
  endRef.current = endStroke;

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!held.current) return;
      event.preventDefault();
      scratchRef.current(event.clientX, event.clientY);
    };
    const onUp = () => endRef.current();
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || open) return;
    const onDown = (event: PointerEvent) => {
      event.stopPropagation();
      event.preventDefault();
      held.current = true;
      last.current = null;
      travel.current = 0;
      const ctx = canvas.getContext("2d");
      snapshot.current = ctx ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
      startScratchFx();
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        /* optional */
      }
      scratchRef.current(event.clientX, event.clientY);
    };
    canvas.addEventListener("pointerdown", onDown, { capture: true });
    return () => canvas.removeEventListener("pointerdown", onDown, true);
  }, [open]);

  const coating = Math.max(0.22, 1 - wear * 0.78);
  const ink = 0.16 + wear * 0.84;

  return (
    <span
      ref={wrapRef}
      className={cn("scratch-word", open && "scratch-word-open")}
      aria-label={open ? word : `Redacted. Scratch to declassify`}
    >
      <span className="scratch-word-ink" style={open ? undefined : { opacity: ink }}>
        {word}
      </span>
      {open ? null : (
        <canvas ref={canvasRef} aria-hidden="true" style={{ opacity: coating }} />
      )}
    </span>
  );
}