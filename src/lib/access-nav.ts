import { useDesk } from "@/lib/store";

type HistoryLike = { push: (href: string) => void };

function sameDesk(href: string) {
  if (typeof window === "undefined") return false;
  const next = new URL(href, window.location.origin);
  return next.pathname === window.location.pathname;
}

export function accessNavigate(history: HistoryLike, href: string) {
  if (!href || href === "/") {
    history.push(href || "/");
    return;
  }
  if (href.startsWith("/scan") || href.startsWith("/login")) {
    history.push(href);
    return;
  }
  if (sameDesk(href)) {
    if (href !== `${window.location.pathname}${window.location.search}`) {
      history.push(href);
    }
    return;
  }
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    history.push(href);
    return;
  }
  useDesk.getState().startAccess(href);
}
