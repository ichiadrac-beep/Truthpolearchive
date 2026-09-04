import { lazy, Suspense, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AccessVeil } from "@/components/access-veil";
import { ClearanceHost } from "@/components/clearance-host";
import { HandPreloader } from "@/components/hand-preloader";
import { useDesk } from "@/lib/store";
import { cn } from "@/lib/utils";

const StarField = lazy(() =>
  import("@/components/star-field").then((m) => ({ default: m.StarField })),
);
const SportSaucer = lazy(() =>
  import("@/components/sport-saucer").then((m) => ({ default: m.SportSaucer })),
);
const SignalDrop = lazy(() =>
  import("@/components/signal-drop").then((m) => ({ default: m.SignalDrop })),
);

function useAfterPaint() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let id = 0;
    id = window.requestAnimationFrame(() => {
      id = window.requestAnimationFrame(() => setReady(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, []);
  return ready;
}

export function FxRoot() {
  const hydrate = useDesk((s) => s.hydrate);
  const scanActive = useDesk((s) => s.scanActive);
  const panelOpen = useDesk((s) => s.panelOpen);
  const accessVeil = useDesk((s) => s.accessVeil);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onLanding = pathname === "/";
  const paused = Boolean(scanActive || panelOpen || accessVeil);
  const skyReady = useAfterPaint();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] isolate",
          paused && "fx-paused",
        )}
        aria-hidden="true"
      >
        <div className="cosmos-sky" />
        {skyReady ? (
          <Suspense fallback={null}>
            <StarField paused={paused} allowDuel={onLanding} />
            <SportSaucer />
          </Suspense>
        ) : null}
        <HandPreloader />
        <div className="crt-vignette" />
        <div className="crt-overlay" />
        <div className="crt-glitch" />
      </div>
      {skyReady ? (
        <Suspense fallback={null}>
          <SignalDrop paused={paused} />
        </Suspense>
      ) : null}
      <ClearanceHost />
      <AccessVeil />
    </>
  );
}
