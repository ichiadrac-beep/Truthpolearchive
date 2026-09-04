import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useDesk } from "@/lib/store";

export const HAND_SRC = "/alien-hand.jpg?v=2";

/** Warm the scan image only on /scan — never on the landing critical path. */
export function HandPreloader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setHandReady = useDesk((s) => s.setHandReady);
  const handReady = useDesk((s) => s.handReady);

  useEffect(() => {
    if (handReady) return;
    if (pathname !== "/scan") return;
    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    img.src = HAND_SRC;
    const mark = () => {
      if (!cancelled) setHandReady(true);
    };
    if (img.complete && img.naturalWidth > 0) mark();
    else {
      img.onload = mark;
      img.onerror = mark;
    }
    return () => {
      cancelled = true;
    };
  }, [pathname, handReady, setHandReady]);

  return null;
}
