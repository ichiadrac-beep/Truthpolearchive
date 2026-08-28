import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { heartbeatPole } from "@/lib/desk-api";
import { getGuestId } from "@/lib/guest-id";
import { cn } from "@/lib/utils";

/**
 * Site-wide live count. Uses the existing Pole presence table so the number
 * is the actual unique guests who heartbeated in the last 45 seconds.
 */
export function PresenceHud() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [online, setOnline] = useState(1);
  const [flicker, setFlicker] = useState<string | null>(null);
  const onlineRef = useRef(1);
  onlineRef.current = online;

  useEffect(() => {
    if (pathname === "/scan") return;
    let stop = false;
    const guestId = getGuestId();

    const beat = () => {
      if (document.hidden) return;
      void heartbeatPole({ data: { guestId } })
        .then((snap) => {
          if (!stop) setOnline(Math.max(1, snap.online));
        })
        .catch(() => {});
    };

    beat();
    const pulse = window.setInterval(beat, 20000);
    const glitch = window.setInterval(() => {
      if (document.hidden || Math.random() > 0.22) return;
      const fake = onlineRef.current + 2 + Math.floor(Math.random() * 17);
      setFlicker(String(fake).padStart(2, "0"));
      window.setTimeout(() => {
        if (!stop) setFlicker(null);
      }, 160);
    }, 5200);

    const onVis = () => {
      if (document.visibilityState === "visible") beat();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop = true;
      window.clearInterval(pulse);
      window.clearInterval(glitch);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pathname]);

  if (pathname === "/scan") return null;

  const onLanding = pathname === "/";
  const shown = flicker ?? String(online);

  return (
    <div
      className={cn(
        "presence-hud pointer-events-none fixed z-[45] font-display",
        onLanding
          ? "right-3 top-[max(0.55rem,env(safe-area-inset-top))]"
          : "left-3 top-[max(3.35rem,calc(env(safe-area-inset-top)+2.7rem))]",
      )}
      aria-live="polite"
      aria-label={`${online} online`}
    >
      <span className="presence-dot" aria-hidden="true" />
      <span className="presence-rec">Online</span>
      <span className={cn("presence-count", flicker && "is-glitch")}>{shown}</span>
    </div>
  );
}
