import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GlassButton } from "@/components/glass-button";

const RUNES = [
  "M4 2 L12 2 L16 8 L12 14 L4 14 L0 8 Z",
  "M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z",
  "M0 0 L16 0 L16 4 L4 4 L4 16 L0 16 Z",
  "M8 0 L16 16 L0 16 Z",
  "M2 2 L14 2 L14 14 L2 14 Z M5 5 L11 5 L11 11 L5 11 Z",
  "M8 1 L15 8 L8 15 L1 8 Z",
  "M0 8 L8 0 L16 8 L8 4 Z",
  "M8 0 L9 6 L16 8 L9 10 L8 16 L7 10 L0 8 L7 6 Z",
  "M2 8 Q8 0 14 8 Q8 16 2 8 Z",
  "M8 1 L10 6 L15 8 L10 10 L8 15 L6 10 L1 8 L6 6 Z M8 5 L8 11 M5 8 L11 8",
  "M1 4 L8 1 L15 4 L15 12 L8 15 L1 12 Z",
  "M3 2 L13 2 L13 14 L3 14 Z M8 2 L8 14 M3 8 L13 8",
  "M1 8 L8 1 L15 8 L12 8 L12 15 L4 15 L4 8 Z",
  "M2 14 L8 2 L14 14 M5 9 L11 9",
  "M8 2 L14 6 L14 12 L8 16 L2 12 L2 6 Z M8 6 L8 12",
];

const PLACEMENTS = [
  { top: "7%", left: "5%", size: 22, rotate: 12, delay: "0s", dur: "18s" },
  { top: "12%", left: "78%", size: 18, rotate: -18, delay: "2s", dur: "22s" },
  { top: "28%", left: "90%", size: 16, rotate: 40, delay: "1.2s", dur: "16s" },
  { top: "46%", left: "3%", size: 24, rotate: -8, delay: "3s", dur: "20s" },
  { top: "58%", left: "84%", size: 17, rotate: 22, delay: "0.6s", dur: "19s" },
  { top: "72%", left: "10%", size: 15, rotate: -30, delay: "2.4s", dur: "21s" },
  { top: "84%", left: "62%", size: 20, rotate: 8, delay: "1.8s", dur: "17s" },
  { top: "22%", left: "40%", size: 13, rotate: 50, delay: "4s", dur: "24s" },
  { top: "38%", left: "70%", size: 14, rotate: -42, delay: "5s", dur: "15s" },
  { top: "64%", left: "48%", size: 12, rotate: 18, delay: "3.4s", dur: "24s" },
  { top: "8%", left: "52%", size: 11, rotate: -12, delay: "6s", dur: "18s" },
  { top: "90%", left: "28%", size: 16, rotate: 28, delay: "1s", dur: "20s" },
  { top: "33%", left: "22%", size: 15, rotate: 6, delay: "7s", dur: "19s" },
  { top: "51%", left: "93%", size: 13, rotate: -24, delay: "4.5s", dur: "21s" },
  { top: "16%", left: "64%", size: 12, rotate: 33, delay: "8s", dur: "16s" },
];

const CHARTS = [
  {
    top: "10%",
    left: "18%",
    size: 88,
    rotate: -8,
    delay: "0s",
    stars: [
      [8, 22],
      [22, 10],
      [40, 18],
      [58, 8],
      [72, 24],
      [50, 36],
      [28, 34],
    ],
    lines: "M8 22 L22 10 L40 18 L58 8 L72 24 M40 18 L50 36 L28 34 L8 22",
  },
  {
    top: "68%",
    left: "72%",
    size: 72,
    rotate: 14,
    delay: "3s",
    stars: [
      [12, 40],
      [20, 18],
      [38, 8],
      [56, 16],
      [64, 38],
      [40, 48],
    ],
    lines: "M12 40 L20 18 L38 8 L56 16 L64 38 L40 48 L12 40",
  },
  {
    top: "42%",
    left: "8%",
    size: 64,
    rotate: 22,
    delay: "6s",
    stars: [
      [10, 30],
      [28, 12],
      [48, 20],
      [54, 42],
      [30, 50],
    ],
    lines: "M10 30 L28 12 L48 20 L54 42 L30 50 L10 30 M28 12 L30 50",
  },
  {
    top: "78%",
    left: "38%",
    size: 70,
    rotate: -16,
    delay: "2s",
    stars: [
      [6, 20],
      [24, 8],
      [44, 14],
      [62, 6],
      [70, 28],
      [46, 40],
      [22, 36],
    ],
    lines: "M6 20 L24 8 L44 14 L62 6 L70 28 M44 14 L46 40 L22 36 L6 20",
  },
  {
    top: "24%",
    left: "58%",
    size: 56,
    rotate: 8,
    delay: "5s",
    stars: [
      [18, 28],
      [28, 16],
      [38, 24],
      [48, 14],
      [58, 22],
      [44, 34],
      [32, 36],
    ],
    lines: "M18 28 L28 16 L38 24 L48 14 L58 22 M28 16 L44 34 L32 36 L18 28",
  },
];

const EGGS = [
  { top: "6%", left: "86%", text: "RA 19h25m  WOW" },
  { top: "93%", left: "8%", text: "33°N  ·  SKINWALKER" },
  { top: "48%", left: "44%", text: "ZETA RETICULI" },
  { top: "3%", left: "36%", text: "MJ-12" },
  { top: "88%", left: "78%", text: "1947.07.08" },
];

type GlyphNote = {
  id: string;
  kicker: string;
  title: string;
  line: string;
};

const HOTSPOTS: (GlyphNote & {
  top: string;
  left: string;
  label: string;
  mark: "hill" | "wow" | "corridor";
})[] = [
  {
    id: "zeta",
    top: "11%",
    left: "7%",
    label: "Zeta Reticuli chart",
    kicker: "19–20 SEP 1961",
    title: "Zeta Reticuli",
    line: "Hill map · two suns",
    mark: "hill",
  },
  {
    id: "wow",
    top: "26%",
    left: "86%",
    label: "Wow signal mark",
    kicker: "15 AUG 1977",
    title: "RA 19h25m",
    line: "WOW bandwidth · 1420 MHz",
    mark: "wow",
  },
  {
    id: "corridor",
    top: "71%",
    left: "5%",
    label: "33N corridor mark",
    kicker: "UINTAH BASIN",
    title: "33°N corridor",
    line: "Skinwalker · ranch latitude",
    mark: "corridor",
  },
];

export function GlyphField({
  paused,
  onQuiet,
}: {
  paused: boolean;
  onQuiet?: (quiet: boolean) => void;
}) {
  const [note, setNote] = useState<GlyphNote | null>(null);

  useEffect(() => {
    onQuiet?.(Boolean(note));
  }, [note, onQuiet]);

  useEffect(() => {
    if (!note) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNote(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [note]);

  return (
    <>
      <div
        className="glyph-layer pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{ opacity: paused ? 0.5 : 1 }}
        aria-hidden="true"
      >
        {PLACEMENTS.map((p, i) => (
          <svg
            key={`g-${i}`}
            viewBox="0 0 16 16"
            width={p.size}
            height={p.size}
            className="glyph-float absolute text-fg"
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.dur,
              animationPlayState: paused ? "paused" : "running",
              ["--glyph-rot" as string]: `${p.rotate}deg`,
            }}
          >
            <path d={RUNES[i % RUNES.length]} fill="none" stroke="currentColor" strokeWidth="1.05" />
          </svg>
        ))}

        {CHARTS.map((chart, i) => (
          <svg
            key={`c-${i}`}
            viewBox="0 0 80 56"
            width={chart.size}
            height={chart.size * 0.7}
            className="chart-drift absolute text-fg"
            style={{
              top: chart.top,
              left: chart.left,
              transform: `rotate(${chart.rotate}deg)`,
              animationDelay: chart.delay,
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            <path d={chart.lines} fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.55" />
            {chart.stars.map(([x, y], s) => (
              <circle key={s} cx={x} cy={y} r={s === 2 ? 1.5 : 1.05} fill="currentColor" />
            ))}
          </svg>
        ))}

        <svg
          viewBox="0 0 40 40"
          width={54}
          height={54}
          className="crop-ring absolute text-fg"
          style={{
            top: "31%",
            left: "81%",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.5" />
          <path d="M20 4 L20 12 M20 28 L20 36 M4 20 L12 20 M28 20 L36 20" stroke="currentColor" strokeWidth="0.5" />
        </svg>

        {EGGS.map((egg) => (
          <p
            key={egg.text}
            className="egg-fade absolute font-display text-[9px] tracking-[0.32em] text-fg"
            style={{
              top: egg.top,
              left: egg.left,
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {egg.text}
          </p>
        ))}
      </div>

      <div className="pointer-events-none fixed inset-0 z-[15] overflow-hidden">
        {HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            type="button"
            aria-label={spot.label}
            className="pointer-events-auto absolute grid size-10 place-items-center rounded-full text-fg/80"
            style={{ top: spot.top, left: spot.left }}
            onClick={() => setNote(spot)}
          >
            <HotspotMark kind={spot.mark} />
          </button>
        ))}
      </div>

      {note ? (
        <div
          className="glass-strong pointer-events-auto fixed z-[60] w-[min(16.5rem,calc(100vw-2rem))] rounded-2xl px-3.5 py-3"
          style={{
            left: "50%",
            top: "28%",
            transform: "translateX(-50%)",
          }}
          role="dialog"
          aria-label={note.title}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-display text-[10px] tracking-[0.28em] text-fg/45">{note.kicker}</p>
            <GlassButton variant="icon" className="size-8 shrink-0" aria-label="Close note" onClick={() => setNote(null)}>
              <X className="size-3.5" strokeWidth={1.7} />
            </GlassButton>
          </div>
          <p className="mt-1 font-serif text-[1.35rem] leading-none text-fg">{note.title}</p>
          <p className="mt-2 text-[12px] leading-snug text-fg/60">{note.line}</p>
        </div>
      ) : null}
    </>
  );
}

function HotspotMark({ kind }: { kind: "hill" | "wow" | "corridor" }) {
  if (kind === "hill") {
    return (
      <svg viewBox="0 0 40 28" width="36" height="26" aria-hidden="true" className="text-fg">
        <path
          d="M4 18 L8 10 L14 14 L10 20 Z M22 8 L26 4 L32 7 L36 14 L30 18 L24 16 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          opacity="0.85"
        />
        {[[4, 18], [8, 10], [14, 14], [10, 20], [22, 8], [26, 4], [32, 7], [36, 14], [30, 18], [24, 16]].map(
          ([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 5 ? 1.5 : 1.05} fill="currentColor" />
          ),
        )}
      </svg>
    );
  }
  if (kind === "wow") {
    return (
      <svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true" className="text-fg">
        <circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="14" cy="14" r="4" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="14" cy="14" r="1.4" fill="currentColor" />
        <path d="M14 3 L14 7 M14 21 L14 25 M3 14 L7 14 M21 14 L25 14" stroke="currentColor" strokeWidth="0.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true" className="text-fg">
      <path d="M4 16 L24 16 M6 12 L22 12" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <circle cx="10" cy="14" r="1.4" fill="currentColor" />
      <circle cx="18" cy="14" r="1.4" fill="currentColor" />
      <path d="M10 8 L18 20" stroke="currentColor" strokeWidth="0.7" opacity="0.8" />
    </svg>
  );
}
