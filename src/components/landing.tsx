import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AlienLogo } from "@/components/alien-logo";
import { GlassButton } from "@/components/glass-button";
import { LANDING_TAB_ROWS } from "@/lib/tabs";
import { useDesk } from "@/lib/store";


function LandingCosmos() {
  const stars = [
    [6, 10], [12, 22], [18, 8], [24, 30], [30, 14], [36, 42], [42, 6], [48, 20],
    [54, 36], [60, 12], [66, 28], [72, 8], [78, 40], [84, 16], [90, 32], [94, 50],
    [8, 48], [16, 58], [22, 70], [32, 62], [40, 78], [50, 54], [58, 68], [68, 80],
    [76, 58], [86, 72], [92, 64], [10, 86], [28, 88], [46, 92], [64, 90], [82, 86],
    [4, 34], [20, 40], [34, 24], [56, 44], [70, 48], [88, 24], [14, 16], [44, 48],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="cosmos-wash absolute inset-0" />
      {/* dense star field — matches first-build look */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {stars.map(([x, y], i) => (
          <circle
            key={i}
            cx={`${x}%`}
            cy={`${y}%`}
            r={i % 6 === 0 ? 1.8 : i % 3 === 0 ? 1.2 : 0.75}
            fill="#f3f3f1"
            opacity={0.55 + (i % 5) * 0.1}
          />
        ))}
      </svg>
      {/* constellation top-left like original */}
      <svg viewBox="0 0 100 70" width="120" height="84" className="absolute text-fg" style={{ top: "6%", left: "6%", opacity: 0.55 }}>
        <path d="M12 40 L28 18 L48 28 L62 12 L82 30 M48 28 L58 48 L36 52 L12 40" fill="none" stroke="currentColor" strokeWidth="0.9" />
        {[[12,40],[28,18],[48,28],[62,12],[82,30],[58,48],[36,52]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={i===2?2:1.4} fill="currentColor" />
        ))}
      </svg>
      <span className="shoot-star absolute left-0 top-[16%] h-px w-48" style={{ animationDelay: "0s", animationDuration: "6s" }} />
      <span className="shoot-star absolute left-[6%] top-[38%] h-px w-36" style={{ animationDelay: "2.2s", animationDuration: "7.5s" }} />
      <span className="shoot-star absolute left-[-6%] top-[60%] h-px w-44" style={{ animationDelay: "4.5s", animationDuration: "6.8s" }} />
      <svg viewBox="0 0 16 16" width="22" height="22" className="glyph-float absolute text-fg" style={{ top: "22%", left: "82%", ["--glyph-rot" as string]: "12deg", opacity: 0.5 }}>
        <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg viewBox="0 0 16 16" width="18" height="18" className="glyph-float absolute text-fg" style={{ top: "70%", left: "10%", animationDelay: "2s", ["--glyph-rot" as string]: "-18deg", opacity: 0.45 }}>
        <path d="M8 1 L15 8 L8 15 L1 8 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg viewBox="0 0 16 16" width="20" height="20" className="glyph-float absolute text-fg" style={{ top: "78%", left: "78%", animationDelay: "3.5s", ["--glyph-rot" as string]: "28deg", opacity: 0.4 }}>
        <path d="M2 2 L14 2 L14 14 L2 14 Z M5 5 L11 5 L11 11 L5 11 Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
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
