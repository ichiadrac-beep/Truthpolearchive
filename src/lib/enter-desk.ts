import { accessNavigate } from "@/lib/access-nav";
import { DEFAULT_DESK_HREF, useDesk } from "@/lib/store";

type HistoryLike = { push: (href: string) => void; replace?: (href: string) => void };

/** Start biometric login flow (hand scan). */
export function startLogin(history: HistoryLike, returnHref?: string) {
  const href = returnHref && returnHref !== "/" ? returnHref : DEFAULT_DESK_HREF;
  useDesk.getState().requestAccess(href);
  history.push("/scan");
}

/** Enter desk without scan when already granted, else go to scan. */
export function enterDesk(history: HistoryLike, href = DEFAULT_DESK_HREF) {
  if (useDesk.getState().accessGranted) {
    accessNavigate(history, href);
    return;
  }
  startLogin(history, href);
}
