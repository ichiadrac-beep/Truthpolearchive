import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { heartbeatPole } from "@/lib/desk-api";
import { getGuestId } from "@/lib/guest-id";
import { cn } from "@/lib/utils";

/**
 * Site-wide live count. Uses the Pole presence table so the number is unique
 * guests who heartbeated in the last 45 seconds — landing included.
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

  if (pathname !== "/") return null;

  const shown = flicker ?? String(online);

  return (
    <div
      className="presence-hud pointer-events-none fixed z-[45] font-display right-3 top-[max(0.55rem,env(safe-area-inset-top))]"
      aria-live="polite"
      aria-label={`${online} online`}
    >
      <span className="presence-dot" aria-hidden="true" />
      <span className="presence-rec">Online</span>
      <span className={cn("presence-count", flicker && "is-glitch")}>{shown}</span>
    </div>
  );
}
