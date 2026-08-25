import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AlienLogo } from "@/components/alien-logo";
import { GlassButton } from "@/components/glass-button";
import { LANDING_TAB_ROWS } from "@/lib/tabs";
import { useDesk } from "@/lib/store";


function LandingCosmos() {
  const stars = [
    [8, 12], [18, 28], [26, 8], [35, 40], [42, 18], [52, 6], [61, 32], [72, 14],
    [81, 44], [12, 55], [28, 68], [48, 58], [66, 72], [88, 22], [92, 60], [5, 78],
    [38, 88], [58, 82], [78, 90], [15, 38], [45, 48], [70, 50], [85, 75], [22, 90],
    [55, 25], [33, 15], [90, 38], [3, 45], [64, 8], [40, 72], [50, 35], [20, 20],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="cosmos-wash absolute inset-0" />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {stars.map(([x, y], i) => (
          <circle
            key={i}
            cx={`${x}%`}
            cy={`${y}%`}
            r={i % 7 === 0 ? 1.5 : i % 3 === 0 ? 1.05 : 0.65}
            fill="#f3f3f1"
            opacity={0.4 + (i % 5) * 0.12}
          />
        ))}
      </svg>
      <span className="shoot-star absolute left-0 top-[16%] h-px w-48" style={{ animationDelay: "0s", animationDuration: "6s" }} />
      <span className="shoot-star absolute left-[6%] top-[38%] h-px w-36" style={{ animationDelay: "2.2s", animationDuration: "7.5s" }} />
      <span className="shoot-star absolute left-[-6%] top-[60%] h-px w-44" style={{ animationDelay: "4.5s", animationDuration: "6.8s" }} />
      <svg viewBox="0 0 16 16" width="22" height="22" className="glyph-float absolute text-fg" style={{ top: "12%", left: "9%", ["--glyph-rot" as string]: "12deg" }}>
        <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg viewBox="0 0 16 16" width="18" height="18" className="glyph-float absolute text-fg" style={{ top: "28%", left: "84%", animationDelay: "2s", ["--glyph-rot" as string]: "-18deg" }}>
        <path d="M8 1 L15 8 L8 15 L1 8 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg viewBox="0 0 16 16" width="24" height="24" className="glyph-float absolute text-fg" style={{ top: "74%", left: "6%", animationDelay: "3.5s", ["--glyph-rot" as string]: "28deg" }}>
        <path d="M2 2 L14 2 L14 14 L2 14 Z M5 5 L11 5 L11 11 L5 11 Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
      </svg>
      <svg viewBox="0 0 16 16" width="16" height="16" className="glyph-float absolute text-fg" style={{ top: "58%", left: "90%", animationDelay: "1.2s", ["--glyph-rot" as string]: "40deg" }}>
        <path d="M8 0 L16 16 L0 16 Z" fill="none" stroke="currentColor" strokeWidth="1.15" />
      </svg>
      <svg viewBox="0 0 80 56" width="110" height="77" className="chart-drift absolute text-fg" style={{ top: "7%", left: "52%", transform: "rotate(-8deg)" }}>
        <path d="M8 22 L22 10 L40 18 L58 8 L72 24 M40 18 L50 36 L28 34 L8 22" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.85" />
        {[[8, 22], [22, 10], [40, 18], [58, 8], [72, 24], [50, 36], [28, 34]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 2 ? 1.8 : 1.2} fill="currentColor" />
        ))}
      </svg>
      <svg viewBox="0 0 80 56" width="82" height="57" className="chart-drift absolute text-fg" style={{ top: "64%", left: "14%", transform: "rotate(12deg)", animationDelay: "2.5s" }}>
        <path d="M12 40 L20 18 L38 8 L56 16 L64 38 L40 48 L12 40" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
        {[[12, 40], [20, 18], [38, 8], [56, 16], [64, 38], [40, 48]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.2} fill="currentColor" />
        ))}
      </svg>
    </div>
  );
}


export function Landing() {
  const exitHome = useDesk((s) => s.exitHome);
  const clearExitHome = useDesk((s) => s.clearExitHome);

  useEffect(() => {
    if (exitHome) clearExitHome();
  }, [exitHome, clearExitHome]);

  return (
    <main className="landing relative z-10 flex min-h-dvh flex-col bg-transparent">
      <LandingCosmos />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-[max(2.5rem,env(safe-area-inset-top))]">
        <div className="stagger-in flex flex-1 flex-col items-center justify-center text-center">
          <p className="font-display text-[11px] font-medium tracking-[0.42em] text-fg/55">
            CLASSIFIED DESK
          </p>

          <AlienLogo className="mt-6 h-28 w-28" />

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

          <div className="relative z-20 mt-9 flex w-full max-w-sm flex-col gap-3">
            <GlassButton asChild variant="primary" className="landing-sheen h-12 rounded-full">
              <Link to="/archive">Enter the archive</Link>
            </GlassButton>
            <GlassButton asChild variant="ghost" className="landing-sheen h-[3.35rem] flex-col rounded-full">
              <Link to="/archive" aria-label="Tonight’s file: Cussac">
                <span className="font-display text-[10px] font-medium tracking-[0.38em] text-fg/55">
                  TONIGHT’S FILE
                </span>
                <span className="font-serif text-[15px] font-normal text-fg">Cussac</span>
              </Link>
            </GlassButton>
          </div>

          <div className="relative z-20 mt-8 flex w-full flex-col items-center gap-2.5">
            {LANDING_TAB_ROWS.map((row, i) => (
              <div key={i} className="flex flex-wrap justify-center gap-2">
                {row.map((tab) => (
                  <GlassButton asChild key={tab.href} variant="chip" className="h-11 rounded-full px-5">
                    <Link to={tab.href}>{tab.label}</Link>
                  </GlassButton>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-center font-display text-[11px] tracking-[0.28em] text-fg/40">
          1900 — now
        </p>
      </div>
    </main>
  );
}
