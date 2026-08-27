import { useEffect, useRef, useState } from "react";
import { ACCESS_MS, scrambleGlyph } from "@/lib/access";
import { cn } from "@/lib/utils";

type DecryptTextProps = {
  text: string;
  duration?: number;
  className?: string;
  onDone?: () => void;
};

export function DecryptText({ text, duration = ACCESS_MS, className, onDone }: DecryptTextProps) {
  const [out, setOut] = useState(text);
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || text.length === 0) {
      setOut(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }
    setDone(false);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const lock = Math.floor(t * text.length);
      let next = "";
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i] ?? "";
        if (ch === " " || ch === "…" || ch === "." || ch === "·") {
          next += ch;
        } else if (i < lock) {
          next += ch;
        } else {
          next += scrambleGlyph();
        }
      }
      setOut(next);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setOut(text);
      setDone(true);
      onDoneRef.current?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return (
    <span className={cn("decrypt-line", done && "decrypt-line-done", className)} aria-label={text}>
      {out}
    </span>
  );
}

type DecryptSequenceProps = {
  kicker: string;
  title: string;
  footer?: string;
  duration?: number;
  onDone?: () => void;
};

export function DecryptSequence({
  kicker,
  title,
  footer = "DECRYPTING…",
  duration = ACCESS_MS,
  onDone,
}: DecryptSequenceProps) {
  return (
    <div className="decrypt-sequence" role="status" aria-live="polite">
      <p className="font-display text-xs font-medium tracking-kicker text-muted">
        <DecryptText text={kicker} duration={Math.round(duration * 0.5)} />
      </p>
      <p className="mt-3 font-mono text-[15px] tracking-[0.16em] text-fg">
        <DecryptText text={title.toUpperCase()} duration={duration} onDone={onDone} />
      </p>
      <p className="mt-4 font-display text-[11px] tracking-[0.32em] text-fg/40">
        <DecryptText text={footer} duration={Math.round(duration * 0.75)} />
      </p>
    </div>
  );
}
