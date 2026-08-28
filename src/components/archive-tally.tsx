import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Same rarity band as SIGNAL LOST / MIB: linger, then maybe once. */
const WARMUP_MS = 75_000;
const TICK_MS = 26_000;
const CHANCE = 0.045;
const COOLDOWN_MS = 8 * 60_000;
const MAX_PER_SESSION = 2;
const FLASH_MS = 520;
const HIDDEN = "4,281,006";

const SESSION = {
  started: 0,
  fired: 0,
  lastFire: 0,
};

function sessionReady(now: number) {
  if (!SESSION.started) SESSION.started = now;
  if (SESSION.fired >= MAX_PER_SESSION) return false;
  if (now - SESSION.started < WARMUP_MS) return false;
  if (SESSION.lastFire && now - SESSION.lastFire < COOLDOWN_MS) return false;
  return true;
}

type ArchiveTallyProps = {
  count: number;
  label: string;
  className?: string;
  /** Skip while the real count is already in motion. */
  hold?: boolean;
};

export function ArchiveTally({ count, label, className, hold = false }: ArchiveTallyProps) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let on = false;
    let hide = 0;

    const run = () => {
      if (on) return;
      on = true;
      SESSION.fired += 1;
      SESSION.lastFire = performance.now();
      setFlash(true);
      hide = window.setTimeout(() => {
        setFlash(false);
        on = false;
      }, FLASH_MS);
    };

    const onForce = () => run();
    window.addEventListener("truthpole:tally-flash", onForce);

    const tick = window.setInterval(() => {
      if (reduce || hold || on) return;
      if (document.visibilityState !== "visible") return;
      if (document.querySelector(".signal-drop.is-on")) return;
      const now = performance.now();
      if (!sessionReady(now)) return;
      if (Math.random() < CHANCE) run();
    }, TICK_MS);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(hide);
      window.removeEventListener("truthpole:tally-flash", onForce);
    };
  }, [hold]);

  return (
    <p className={cn(className, flash && "archive-tally-flash")} aria-hidden={flash}>
      {flash ? `ANALYZING... 1 OF ${HIDDEN} DOCUMENTS` : `${count} ${label}`}
    </p>
  );
}