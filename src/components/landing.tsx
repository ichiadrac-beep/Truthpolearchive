import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import { AlienLogo } from "@/components/alien-logo";
import { GlassButton } from "@/components/glass-button";
import { useClearanceTonight } from "@/hooks/use-clearance";
import { accessNavigate } from "@/lib/access-nav";
import { matchClearancePhrase, revealClearanceMemo } from "@/lib/clearance";
import { LANDING_TAB_ROWS } from "@/lib/tabs";
import { useDesk } from "@/lib/store";
import { APP_VERSION_LABEL } from "@/lib/version";

type ChartNote = {
  id: string;
  kicker: string;
  title: string;
  line: string;
  label: string;
};

type ChartDef = ChartNote & {
  viewBox: string;
  className: string;
  style: CSSProperties;
  lines: string;
  strokeWidth: number;
  stars: { x: number; y: number; r: number }[];
};

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

const STAR_CHARTS: ChartDef[] = [
  {
    id: "zeta",
    kicker: "19–20 SEP 1961",
    title: "Zeta Reticuli",
    line: "Hill map · two suns",
    label: "Zeta Reticuli star chart",
    viewBox: "0 0 40 28",
    className: "h-[40px] w-[58px]",
    style: {
      top: "max(0.45rem, env(safe-area-inset-top))",
      left: "2.5%",
    },
    lines: "M4 18 L8 10 L14 14 L10 20 Z M22 8 L26 4 L32 7 L36 14 L30 18 L24 16 Z",
    strokeWidth: 0.55,
    stars: [
      { x: 4, y: 18, r: 0.85 },
      { x: 8, y: 10, r: 0.7 },
      { x: 14, y: 14, r: 0.75 },
      { x: 10, y: 20, r: 0.65 },
      { x: 22, y: 8, r: 0.8 },
      { x: 26, y: 4, r: 1.15 },
      { x: 32, y: 7, r: 0.7 },
      { x: 36, y: 14, r: 0.75 },
      { x: 30, y: 18, r: 0.65 },
      { x: 24, y: 16, r: 0.7 },
    ],
  },
  {
    id: "cygnus",
    kicker: "NORTHERN CROSS",
    title: "Cygnus",
    line: "Deneb · Albireo · the rift",
    label: "Cygnus star chart",
    viewBox: "0 0 100 70",
    className: "h-[86px] w-[124px]",
    style: {
      top: "max(6.4rem, calc(env(safe-area-inset-top) + 5.6rem))",
      right: "0.25%",
      left: "auto",
    },
    lines: "M12 40 L28 18 L48 28 L62 12 L82 30 M48 28 L58 48 L36 52 L12 40",
    strokeWidth: 0.7,
    stars: [
      { x: 12, y: 40, r: 1.15 },
      { x: 28, y: 18, r: 1.05 },
      { x: 48, y: 28, r: 1.7 },
      { x: 62, y: 12, r: 1.1 },
      { x: 82, y: 30, r: 1.25 },
      { x: 58, y: 48, r: 1.05 },
      { x: 36, y: 52, r: 0.95 },
    ],
  },
];

function StarChart({
  chart,
  open,
  onOpen,
}: {
  chart: ChartDef;
  open: boolean;
  onOpen: (el: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      aria-label={chart.label}
      aria-expanded={open}
      className={`star-chart-hit pointer-events-auto absolute z-[12] text-fg ${chart.className}`}
      style={chart.style}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen(event.currentTarget);
      }}
    >
      <svg viewBox={chart.viewBox} className="h-full w-full" aria-hidden="true">
        <path className="star-chart-lines" d={chart.lines} strokeWidth={chart.strokeWidth} />
        {chart.stars.map((s, i) => (
          <g
            key={i}
            className="star-chart-node"
            style={
              {
                ["--star-delay" as string]: `${(i * 0.73) % 4.2}s`,
                ["--star-dur" as string]: `${4.2 + (i % 5) * 0.55}s`,
              } as CSSProperties
            }
          >
            <circle className="star-chart-glow" cx={s.x} cy={s.y} r={s.r * 2.4} />
            <circle className="star-chart-core" cx={s.x} cy={s.y} r={s.r} />
          </g>
        ))}
      </svg>
    </button>
  );
}

function LandingCosmos() {
  const [note, setNote] = useState<ChartNote | null>(null);
  const [anchor, setAnchor] = useState<NoteAnchor | null>(null);

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
      <div className="pointer-events-none absolute inset-0 z-[12] overflow-hidden">
        {STAR_CHARTS.map((chart) => (
          <StarChart
            key={chart.id}
            chart={chart}
            open={note?.id === chart.id}
            onOpen={(el) => {
              if (note?.id === chart.id) {
                closeNote();
                return;
              }
              setAnchor(placeNote(el.getBoundingClientRect()));
              setNote(chart);
            }}
          />
        ))}
      </div>

      {note && anchor ? (
        <div
          className="glyph-note glass-strong pointer-events-auto fixed z-[60] rounded-2xl px-3.5 py-3"
          style={{
            left: anchor.left,
            top: anchor.top,
            width: anchor.width,
          }}
          role="dialog"
          aria-label={note.title}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-display text-[10px] tracking-[0.28em] text-fg/45">{note.kicker}</p>
            <GlassButton variant="icon" className="size-8 shrink-0" aria-label="Close note" onClick={closeNote}>
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

export function Landing() {
  const router = useRouter();
  const exitHome = useDesk((s) => s.exitHome);
  const clearExitHome = useDesk((s) => s.clearExitHome);
  const armArchiveSweep = useDesk((s) => s.armArchiveSweep);
  const tonight = useClearanceTonight();

  const goDesk = (href: string) => accessNavigate(router.history, href);

  useEffect(() => {
    if (exitHome) clearExitHome();
  }, [exitHome, clearExitHome]);

  return (
    <main className="landing relative z-10 flex min-h-dvh flex-col bg-transparent pointer-events-none">
      <LandingCosmos />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-[max(2.5rem,env(safe-area-inset-top))] pointer-events-none">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="stagger-in flex w-full flex-col items-center pointer-events-none">
            <label className="relative mt-0 block w-full max-w-[18rem] pointer-events-auto">
              <span className="pointer-events-none block text-center font-display text-[11px] font-medium tracking-[0.42em] text-fg/55">
                CLASSIFIED DESK
              </span>
              <input
                type="text"
                name="sky_mark"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                inputMode="text"
                enterKeyHint="done"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                aria-label="Classified desk"
                suppressHydrationWarning
                className="absolute inset-0 w-full border-0 bg-transparent text-center text-[11px] text-transparent caret-transparent outline-none"
                onChange={(event) => {
                  if (!matchClearancePhrase(event.target.value)) return;
                  event.target.value = "";
                  event.target.blur();
                }}
              />
            </label>

            <AlienLogo className="mt-6 h-36 w-36" />

            <h1 className="mt-7 font-display text-[1.65rem] font-semibold tracking-[0.34em] text-fg">
              TRUTHPOLE
            </h1>
            <p className="mt-3 font-display text-[11px] font-medium tracking-[0.46em] text-fg/70">
              · THE ARCHIVE ·
            </p>

            <p className="mt-7 max-w-[34ch] text-[15px] leading-relaxed text-fg/80">
              Sightings on a world map, conspiracy files, ancient contact, live X-Files, and The Pole.
              A black record of what the sky keeps returning.
            </p>
          </div>

          <div className="landing-cta relative z-30 mt-9 w-full max-w-sm pointer-events-auto">
            <GlassButton
              variant="primary"
              className="h-12 w-full rounded-full"
              onClick={() => {
                armArchiveSweep();
                goDesk("/archive");
              }}
            >
              Enter the archive
            </GlassButton>
            <GlassButton
              variant="ghost"
              className="landing-tonight h-14 w-full flex-col gap-0.5 rounded-full"
              aria-label={`Tonight’s file: ${tonight.title}`}
              onClick={() => {
                if (tonight.special) {
                  revealClearanceMemo(tonight.special);
                  return;
                }
                goDesk(tonight.caseId ? `/archive?file=${encodeURIComponent(tonight.caseId)}` : "/archive");
              }}
            >
              <span className="landing-tonight-kicker">TONIGHT’S FILE</span>
              <span className="landing-tonight-title">{tonight.title}</span>
            </GlassButton>
            {tonight.anniversary ? (
              <p className="mt-2 font-display text-[10px] tracking-[0.28em] text-fg/40">
                Anniversary desk.
              </p>
            ) : null}
          </div>

          <div className="relative z-30 mt-8 flex w-full flex-col items-center gap-2.5 pointer-events-auto">
            {LANDING_TAB_ROWS.map((row, i) => (
              <div key={i} className="flex flex-wrap justify-center gap-2">
                {row.map((tab) => (
                  <GlassButton
                    key={tab.href}
                    variant="chip"
                    className="h-11 rounded-full px-5"
                    onClick={() => goDesk(tab.href)}
                  >
                    {tab.label}
                  </GlassButton>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-center font-display text-[11px] tracking-[0.28em] text-fg/40">
          1900 — now · {APP_VERSION_LABEL}
        </p>
      </div>
    </main>
  );
}
