import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GlassButton } from "@/components/glass-button";

type MarkKind =
  | "hill"
  | "wow"
  | "corridor"
  | "sirius"
  | "roswell"
  | "tictac"
  | "phoenix"
  | "rendlesham"
  | "mj12";

type GlyphNote = {
  id: string;
  kicker: string;
  title: string;
  line: string;
};

type Hotspot = GlyphNote & {
  top: string;
  left: string;
  size: number;
  rotate: number;
  delay: string;
  label: string;
  mark: MarkKind;
};

/**
 * Irregular scatter — not left/right columns.
 * Keep clear of the centre desk (logo + CTAs ~30–70% x).
 * Sizes differ; tops and lefts never form a grid.
 */
const HOTSPOTS: Hotspot[] = [
  {
    id: "zeta",
    top: "4%",
    left: "3%",
    size: 44,
    rotate: -14,
    delay: "0s",
    label: "Zeta Reticuli chart",
    kicker: "19–20 SEP 1961",
    title: "Zeta Reticuli",
    line: "Hill map · two suns",
    mark: "hill",
  },
  {
    id: "wow",
    top: "9%",
    left: "88%",
    size: 26,
    rotate: 8,
    delay: "0.6s",
    label: "Wow signal mark",
    kicker: "15 AUG 1977",
    title: "RA 19h25m",
    line: "WOW bandwidth · 1420 MHz",
    mark: "wow",
  },
  {
    id: "sirius",
    top: "26%",
    left: "92%",
    size: 38,
    rotate: 21,
    delay: "1.3s",
    label: "Sirius B mark",
    kicker: "DOGON / SOTHIS",
    title: "Sirius B",
    line: "White dwarf companion · claimed knowledge",
    mark: "sirius",
  },
  {
    id: "mj12",
    top: "18%",
    left: "14%",
    size: 22,
    rotate: -6,
    delay: "1.9s",
    label: "MJ-12 mark",
    kicker: "EYES ONLY",
    title: "MJ-12",
    line: "Truman committee · contested paper",
    mark: "mj12",
  },
  {
    id: "roswell",
    top: "42%",
    left: "2%",
    size: 33,
    rotate: 16,
    delay: "0.4s",
    label: "Roswell mark",
    kicker: "JUL 1947",
    title: "Roswell",
    line: "Ranch debris · weather balloon file",
    mark: "roswell",
  },
  {
    id: "rendlesham",
    top: "48%",
    left: "86%",
    size: 29,
    rotate: -19,
    delay: "2.4s",
    label: "Rendlesham mark",
    kicker: "26–28 DEC 1980",
    title: "Rendlesham",
    line: "Bentwaters wood · Halt’s tape",
    mark: "rendlesham",
  },
  {
    id: "corridor",
    top: "63%",
    left: "11%",
    size: 24,
    rotate: 11,
    delay: "1.1s",
    label: "33N corridor mark",
    kicker: "UINTAH BASIN",
    title: "33°N corridor",
    line: "Skinwalker · ranch latitude",
    mark: "corridor",
  },
  {
    id: "tictac",
    top: "72%",
    left: "91%",
    size: 41,
    rotate: -9,
    delay: "0.9s",
    label: "Tic Tac mark",
    kicker: "14 NOV 2004",
    title: "Tic Tac",
    line: "Nimitz · no exhaust, no rotors",
    mark: "tictac",
  },
  {
    id: "phoenix",
    top: "84%",
    left: "6%",
    size: 36,
    rotate: 4,
    delay: "1.7s",
    label: "Phoenix Lights mark",
    kicker: "13 MAR 1997",
    title: "Phoenix Lights",
    line: "V of amber · miles of sky",
    mark: "phoenix",
  },
];

type NoteAnchor = { left: number; top: number; width: number };

function placeNote(rect: DOMRect): NoteAnchor {
  const width = Math.min(268, Math.max(196, window.innerWidth - 28));
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const preferRight = rect.left + rect.width / 2 < vw * 0.5;
  let left = preferRight ? rect.right + 10 : rect.left - width - 10;
  left = Math.max(12, Math.min(left, vw - width - 12));
  let top = rect.top + rect.height / 2 - 48;
  top = Math.max(12, Math.min(top, vh - 140));
  return { left, top, width };
}

export function GlyphField({
  paused = false,
  onQuiet,
}: {
  paused?: boolean;
  onQuiet?: (quiet: boolean) => void;
} = {}) {
  const [note, setNote] = useState<GlyphNote | null>(null);
  const [anchor, setAnchor] = useState<NoteAnchor | null>(null);

  useEffect(() => {
    onQuiet?.(Boolean(note));
  }, [note, onQuiet]);

  useEffect(() => {
    if (!note) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNote(null);
        setAnchor(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [note]);

  const closeNote = () => {
    setNote(null);
    setAnchor(null);
  };

  return (
    <>
      <div className="landing-glyphs pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        {HOTSPOTS.map((spot) => (
          <button
            key={spot.id}
            type="button"
            aria-label={spot.label}
            aria-expanded={note?.id === spot.id}
            className="glyph-hot pointer-events-auto absolute grid place-items-center rounded-full"
            style={{
              top: spot.top,
              left: spot.left,
              width: spot.size + 12,
              height: spot.size + 12,
              animationDelay: spot.delay,
              animationPlayState: paused ? "paused" : "running",
              ["--glyph-rot" as string]: `${spot.rotate}deg`,
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (note?.id === spot.id) {
                closeNote();
                return;
              }
              setAnchor(placeNote(event.currentTarget.getBoundingClientRect()));
              setNote(spot);
            }}
          >
            <HotspotMark kind={spot.mark} size={spot.size} />
          </button>
        ))}
      </div>

      {note && anchor ? (
        <div
          className="glass-strong pointer-events-auto fixed z-[60] rounded-2xl px-3.5 py-3"
          style={{
            left: anchor.left,
            top: anchor.top,
            width: anchor.width,
            transform: "none",
          }}
          role="dialog"
          aria-label={note.title}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-display text-[10px] tracking-[0.28em] text-fg/45">{note.kicker}</p>
            <GlassButton
              variant="icon"
              className="size-8 shrink-0"
              aria-label="Close note"
              onClick={closeNote}
            >
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

function HotspotMark({ kind, size }: { kind: MarkKind; size: number }) {
  const h = Math.round(size * 0.78);
  if (kind === "hill") {
    return (
      <svg viewBox="0 0 40 28" width={size} height={h} aria-hidden="true" className="text-fg">
        <path
          d="M4 18 L8 10 L14 14 L10 20 Z M22 8 L26 4 L32 7 L36 14 L30 18 L24 16 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          opacity="0.9"
        />
        {[
          [4, 18],
          [8, 10],
          [14, 14],
          [10, 20],
          [22, 8],
          [26, 4],
          [32, 7],
          [36, 14],
          [30, 18],
          [24, 16],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 5 ? 1.5 : 1.05} fill="currentColor" />
        ))}
      </svg>
    );
  }
  if (kind === "wow") {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="text-fg">
        <circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="14" cy="14" r="4" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="14" cy="14" r="1.4" fill="currentColor" />
        <path d="M14 3 L14 7 M14 21 L14 25 M3 14 L7 14 M21 14 L25 14" stroke="currentColor" strokeWidth="0.7" />
      </svg>
    );
  }
  if (kind === "sirius") {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="text-fg">
        <circle cx="11" cy="14" r="5.2" fill="none" stroke="currentColor" strokeWidth="0.85" />
        <circle cx="11" cy="14" r="1.5" fill="currentColor" />
        <circle cx="21" cy="11" r="2.1" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="21" cy="11" r="0.8" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "roswell") {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="text-fg">
        <path d="M14 3 L24 14 L14 25 L4 14 Z" fill="none" stroke="currentColor" strokeWidth="0.85" />
        <path d="M14 9 L19 14 L14 19 L9 14 Z" fill="none" stroke="currentColor" strokeWidth="0.7" />
      </svg>
    );
  }
  if (kind === "tictac") {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="text-fg">
        <rect x="7" y="9" width="14" height="10" rx="5" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="11" cy="14" r="1.1" fill="currentColor" />
        <circle cx="17" cy="14" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "phoenix") {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="text-fg">
        <path d="M5 20 L14 8 L23 20" fill="none" stroke="currentColor" strokeWidth="0.85" />
        {[
          [5, 20],
          [9.5, 14],
          [14, 8],
          [18.5, 14],
          [23, 20],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 2 ? 1.5 : 1.15} fill="currentColor" />
        ))}
      </svg>
    );
  }
  if (kind === "rendlesham") {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="text-fg">
        <path d="M14 4 L14 18" stroke="currentColor" strokeWidth="0.85" />
        <path d="M14 8 L20 14 L14 14 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="M6 22 L14 16 L22 22" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    );
  }
  if (kind === "mj12") {
    return (
      <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="text-fg">
        <rect x="5" y="7" width="18" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="0.85" />
        <path d="M8 12 L20 12 M8 16 L16 16" stroke="currentColor" strokeWidth="0.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true" className="text-fg">
      <path d="M4 16 L24 16 M6 12 L22 12" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <circle cx="10" cy="14" r="1.4" fill="currentColor" />
      <circle cx="18" cy="14" r="1.4" fill="currentColor" />
      <path d="M10 8 L18 20" stroke="currentColor" strokeWidth="0.7" opacity="0.8" />
    </svg>
  );
}
