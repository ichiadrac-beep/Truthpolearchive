import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { GlassButton } from "@/components/glass-button";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { DEFAULT_DESK_HREF, useDesk } from "@/lib/store";
import {
  playLockClick,
  playScanSound,
  playWelcomeOnce,
  preloadScanAudio,
  unlockAudio,
} from "@/lib/scan-audio";

export const HAND_SRC = "/alien-hand.jpg";
const SCAN_MS = 2800;
const PROVIDERS = [...GROK_PROVIDERS].sort((a, b) => (a.label === "X" ? -1 : b.label === "X" ? 1 : 0));

type Phase = "scan" | "auth";

export function HandPreloader() {
  const setHandReady = useDesk((s) => s.setHandReady);
  const handReady = useDesk((s) => s.handReady);

  useEffect(() => {
    if (handReady) return;
    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    img.src = HAND_SRC;
    preloadScanAudio();
    const mark = () => {
      if (!cancelled) setHandReady(true);
    };
    if (img.complete && img.naturalWidth > 0) {
      mark();
    } else {
      img.onload = mark;
      img.onerror = mark;
      void img.decode?.().then(mark).catch(mark);
    }
    return () => {
      cancelled = true;
    };
  }, [handReady, setHandReady]);

  return (
    <img
      src={HAND_SRC}
      alt=""
      width={1}
      height={1}
      className="pointer-events-none fixed -left-px -top-px size-px opacity-0"
      aria-hidden="true"
    />
  );
}

function statusLabel(progress: number, granted: boolean, holding: boolean) {
  if (granted || progress >= 99) return "VERIFIED";
  if (!holding && progress === 0) return "STANDBY";
  if (progress < 12) return "ACQUIRING";
  if (progress < 55) return "SCANNING";
  if (progress < 88) return "LOCKING";
  return "MATCHING";
}

export function HandScan() {
  const router = useRouter();
  const handReady = useDesk((s) => s.handReady);
  const completeScan = useDesk((s) => s.completeScan);

  const [phase, setPhase] = useState<Phase>("scan");
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [granted, setGranted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const stopSound = useRef<(() => void) | null>(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const grantedRef = useRef(false);
  const voiced = useRef(false);
  const plateRef = useRef<HTMLButtonElement>(null);

  const deskHref = () => useDesk.getState().pendingHref ?? DEFAULT_DESK_HREF;

  const stopLoop = () => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    stopSound.current?.();
    stopSound.current = null;
  };

  const resetScan = () => {
    if (grantedRef.current) return;
    stopLoop();
    setHolding(false);
    setProgress(0);
  };

  const finishScan = () => {
    if (grantedRef.current) return;
    grantedRef.current = true;
    stopLoop();
    setHolding(false);
    setProgress(100);
    setGranted(true);
    playLockClick();
    if (!voiced.current) {
      voiced.current = true;
      void playWelcomeOnce();
    }
    window.setTimeout(() => setPhase("auth"), 700);
  };

  const beginHold = (ev: React.PointerEvent) => {
    if (grantedRef.current || phase !== "scan") return;
    ev.preventDefault();
    unlockAudio();
    ev.currentTarget.setPointerCapture(ev.pointerId);
    stopLoop();
    setAuthError(null);
    setHolding(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 400 : SCAN_MS;
    if (!reduce) stopSound.current = playScanSound(duration / 1000);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setProgress(eased * 100);
      if (t >= 1) {
        finishScan();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const endHold = (ev: React.PointerEvent) => {
    if (grantedRef.current) return;
    try {
      ev.currentTarget.releasePointerCapture(ev.pointerId);
    } catch {
      /* already released */
    }
    resetScan();
  };

  useEffect(() => {
    return () => {
      stopLoop();
      if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    };
  }, []);

  const onDismiss = () => {
    grantedRef.current = false;
    stopLoop();
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    router.history.replace("/");
  };

  const enterAsGuest = () => {
    setBusyId("guest");
    setAuthError(null);
    completeScan();
    router.history.replace(deskHref());
  };

  const onProvider = (providerId: string) => {
    const href = deskHref();
    setBusyId(providerId);
    setAuthError(null);
    void signIn(providerId, { callbackURL: href, errorCallbackURL: "/scan" })
      .then(() => {
        completeScan();
        router.history.replace(href);
      })
      .catch((err: unknown) => {
        setBusyId(null);
        setAuthError(err instanceof Error ? err.message : "Sign-in was cancelled");
      });
  };

  if (!handReady) {
    return <div className="min-h-dvh bg-black" aria-hidden="true" />;
  }

  if (phase === "auth") {
    return (
      <main className="relative z-10 flex min-h-dvh flex-col bg-black" aria-label="Choose sign-in method">
        <div className="flex items-center justify-end px-4 pt-[max(0.6rem,env(safe-area-inset-top))]">
          <GlassButton variant="icon" aria-label="Dismiss" onClick={onDismiss}>
            <X className="size-5" strokeWidth={1.6} />
          </GlassButton>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-5 pb-12">
          <div className="w-full max-w-[22rem]">
            <p className="text-center font-display text-[11px] font-medium tracking-[0.42em] text-fg/50">IDENTITY</p>
            <h1 className="mt-4 text-center font-display text-2xl font-semibold tracking-[0.18em] text-fg">ACCESS GRANTED</h1>
            <p className="mt-3 text-center text-sm leading-relaxed text-fg/60">
              Choose how to enter the desk. Guest needs no account.
            </p>
            <div className="glass-strong mt-8 flex flex-col gap-3 rounded-3xl px-4 py-5">
              <GlassButton type="button" className="h-12 w-full rounded-2xl" disabled={busyId !== null} onClick={enterAsGuest}>
                {busyId === "guest" ? "Entering…" : "Continue as guest"}
              </GlassButton>
              <div className="relative py-1">
                <div className="absolute inset-x-0 top-1/2 h-px bg-fg/12" />
                <p className="relative mx-auto w-fit bg-black px-3 font-display text-[10px] tracking-[0.28em] text-fg/40">OR</p>
              </div>
              {PROVIDERS.map((p) => (
                <GlassButton
                  key={p.providerId}
                  type="button"
                  variant="ghost"
                  className="h-12 w-full rounded-2xl"
                  disabled={busyId !== null}
                  onClick={() => onProvider(p.providerId)}
                >
                  {busyId === p.providerId ? "Opening…" : `Continue with ${p.label}`}
                </GlassButton>
              ))}
              {authError ? <p className="text-center text-sm text-fg/55">{authError}</p> : null}
            </div>
            <button
              type="button"
              className="mt-6 w-full text-center font-display text-xs tracking-[0.22em] text-fg/45"
              onClick={() => {
                grantedRef.current = false;
                voiced.current = false;
                setGranted(false);
                setProgress(0);
                setHolding(false);
                setBusyId(null);
                setAuthError(null);
                setPhase("scan");
              }}
            >
              Scan again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const pct = Math.min(100, Math.floor(progress));
  const match = Math.min(98.7, progress * 0.987);
  const status = statusLabel(progress, granted, holding);
  const blocks = 10;
  const filled = Math.round((pct / 100) * blocks);

  return (
    <main className="relative z-10 flex min-h-dvh flex-col bg-black" aria-label="Biometric hand scan">
      <div className="flex items-center justify-end px-4 pt-[max(0.6rem,env(safe-area-inset-top))]">
        <GlassButton variant="icon" aria-label="Dismiss scan" onClick={onDismiss}>
          <X className="size-5" strokeWidth={1.6} />
        </GlassButton>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10">
        <div className={`scan-plate w-full max-w-[22rem] ${granted ? "scan-plate-live" : ""}`}>
          <header className="flex items-start justify-between gap-3 px-4 pt-4">
            <div>
              <p className="font-display text-[10px] tracking-[0.28em] text-fg/70">BIOMETRIC SCAN: ALIEN HAND</p>
              <div className="mt-2 flex gap-[3px]" aria-hidden="true">
                {Array.from({ length: blocks }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-2.5"
                    style={{
                      background: i < filled ? "var(--color-fg)" : "color-mix(in oklab, var(--color-fg) 18%, transparent)",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-[10px] tracking-[0.22em] text-fg/55">SYS-ID: AH-0427-9X</p>
              <p className="mt-2 font-display text-[10px] tracking-[0.4em] text-fg/35">//////</p>
            </div>
          </header>
          <button
            ref={plateRef}
            type="button"
            disabled={granted}
            aria-label={granted ? "Scan complete" : "Hold to scan"}
            className="relative mx-auto mt-2 block w-[86%] cursor-pointer touch-none select-none disabled:cursor-default"
            onPointerDown={beginHold}
            onPointerUp={endHold}
            onPointerCancel={endHold}
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              src={HAND_SRC}
              alt="Alien hand for biometric scan"
              width={675}
              height={561}
              fetchPriority="high"
              decoding="sync"
              className="scan-hand mx-auto block h-auto w-full object-contain"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-[6%] overflow-hidden">
              <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-fg/10 to-fg/0" style={{ height: `${progress}%` }} />
              {holding || granted ? (
                <div className="scan-beam absolute inset-x-[-8%] h-10" style={{ top: `calc(${progress}% - 1.25rem)` }} />
              ) : null}
            </div>
          </button>
          <div className="mt-1 grid grid-cols-3 items-end gap-2 px-4 pb-3">
            <div>
              <p className="font-display text-[10px] tracking-[0.28em] text-fg/45">SCAN STATUS</p>
              <p className="mt-1 flex items-center gap-1.5 font-display text-[11px] tracking-[0.2em] text-fg">
                <span className="grid size-3.5 place-items-center border border-fg/70 text-[9px] leading-none">
                  {granted ? "✓" : holding ? "·" : "○"}
                </span>
                {status}
              </p>
            </div>
            <div className="flex justify-center pb-0.5" aria-hidden="true">
              <svg viewBox="0 0 32 32" className={`h-8 w-8 text-fg ${holding || granted ? "scan-helix" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M8 4 C18 10 14 16 24 22 C18 26 12 24 8 28" />
                <path d="M24 4 C14 10 18 16 8 22 C14 26 20 24 24 28" />
                <path d="M11 8 H21 M10 16 H22 M11 24 H21" opacity="0.7" />
              </svg>
            </div>
            <div className="text-right">
              <p className="font-display text-[10px] tracking-[0.22em] text-fg/45">MATCH CONFIDENCE</p>
              <p className="mt-1 font-display text-sm tabular-nums tracking-wide text-fg">
                {granted ? "98.7" : match.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="scan-banner mx-4 mb-4 px-3 py-2.5 text-center">
            {granted ? (
              <p className="font-display text-lg font-semibold tracking-[0.22em] text-fg">ACCESS GRANTED</p>
            ) : (
              <p className="font-display text-[13px] font-semibold tracking-[0.22em] text-fg">
                {holding ? "HOLD STEADY" : "HOLD THE PLATE TO SCAN"}
              </p>
            )}
          </div>
        </div>
        {!granted ? (
          <p className="mt-5 font-display text-3xl font-semibold tabular-nums tracking-wide text-fg">
            {String(pct).padStart(3, "0")}
            <span className="text-lg text-fg/55">%</span>
          </p>
        ) : (
          <p className="mt-5 font-display text-xs tracking-[0.28em] text-fg/45">OPENING IDENTITY DESK…</p>
        )}
      </div>
    </main>
  );
}
