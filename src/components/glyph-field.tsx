import { useEffect, useLayoutEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
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

type GlyphSpec = GlyphNote & {
  size: number;
  rotate: number;
  delay: string;
  label: string;
  mark: MarkKind;
};

type PlacedGlyph = GlyphSpec & {
  top: number;
  left: number;
};

type Box = { left: number; top: number; right: number; bottom: number };

/**
 * Clickable sky marks. Positions are rolled on each landing visit so they
 * never sit in two columns or on top of desk controls.
 */
const GLYPHS: GlyphSpec[] = [
  {
    id: "zeta",
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

function inflate(r: DOMRect | Box, pad: number): Box {
  return {
    left: r.left - pad,
    top: r.top - pad,
    right: r.right + pad,
    bottom: r.bottom + pad,
  };
}

function overlaps(a: Box, b: Box) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

function collectAvoid(pad = 16): Box[] {
  const nodes = document.querySelectorAll(
    'a, button, input, [role="button"], .landing-cta, .landing h1, .landing .alien-mark, .landing label',
  );
  const boxes: Box[] = [];
  nodes.forEach((el) => {
    if (el.closest(".landing-glyphs, .glyph-note")) return;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) return;
    boxes.push(inflate(r, pad));
  });
  return boxes;
}

function shuffle<T>(list: T[]): T[] {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j]!;
    out[j] = tmp!;
  }
  return out;
}

function scatterGlyphs(): PlacedGlyph[] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const placed: PlacedGlyph[] = [];
  const order = shuffle(GLYPHS);

  const tryPlace = (avoid: Box[]) => {
    for (const spec of order) {
      if (placed.some((p) => p.id === spec.id)) continue;
      const hit = 12 + spec.size;
      for (let n = 0; n < 90; n++) {
        const band = Math.random();
        let left: number;
        if (band < 0.42) left = 4 + Math.random() * Math.max(6, vw * 0.22 - hit);
        else if (band < 0.84) left = vw * 0.76 + Math.random() * Math.max(6, vw * 0.22 - hit);
        else left = 8 + Math.random() * Math.max(6, vw - hit - 16);
        const top = 6 + Math.random() * Math.max(6, vh - hit - 18);
        const box: Box = { left, top, right: left + hit, bottom: top + hit };
        if (box.left < 2 || box.top < 2 || box.right > vw - 2 || box.bottom > vh - 2) continue;
        if (avoid.some((a) => overlaps(box, a))) continue;
        if (
          placed.some((p) =>
            overlaps(box, {
              left: p.left,
              top: p.top,
              right: p.left + 12 + p.size,
              bottom: p.top + 12 + p.size,
            }),
          )
        ) {
          continue;
        }
        placed.push({ ...spec, left, top });
        break;
      }
    }
  };

  tryPlace(collectAvoid(18));
  if (placed.length < 5) tryPlace(collectAvoid(8));

  return placed;
}

export function GlyphField({
  paused = false,
  onQuiet,
}: {
  paused?: boolean;
  onQuiet?: (quiet: boolean) => void;
} = {}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onLanding = pathname === "/";
  const [note, setNote] = useState<GlyphNote | null>(null);
  const [anchor, setAnchor] = useState<NoteAnchor | null>(null);
  const [spots, setSpots] = useState<PlacedGlyph[]>([]);

  useEffect(() => {
    onQuiet?.(Boolean(note));
  }, [note, onQuiet]);

  useEffect(() => {
    if (!onLanding) {
      setNote(null);
      setAnchor(null);
      setSpots([]);
    }
  }, [onLanding]);

  useLayoutEffect(() => {
    if (!onLanding) return;
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      setSpots(scatterGlyphs());
    };
    const t = window.setTimeout(run, 40);
    window.addEventListener("resize", run);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener("resize", run);
    };
  }, [onLanding]);

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

  if (!onLanding) return null;

  return (
    <>
      <div className="landing-glyphs pointer-events-none fixed inset-0 z-[8] overflow-hidden">
        {spots.map((spot) => (
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
          className="glyph-note glass-strong pointer-events-auto fixed z-[60] rounded-2xl px-3.5 py-3"
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
