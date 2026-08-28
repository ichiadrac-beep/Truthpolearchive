import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AccessVeil } from "@/components/access-veil";
import { ClearanceHost } from "@/components/clearance-host";
import { HandPreloader } from "@/components/hand-scan";
import { SignalDrop } from "@/components/signal-drop";
import { StarField } from "@/components/star-field";
import { useDesk } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FxRoot() {
  const hydrate = useDesk((s) => s.hydrate);
  const scanActive = useDesk((s) => s.scanActive);
  const panelOpen = useDesk((s) => s.panelOpen);
  const accessVeil = useDesk((s) => s.accessVeil);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onLanding = pathname === "/";
  const paused = Boolean(scanActive || panelOpen || accessVeil);

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
        <StarField paused={paused} allowDuel={onLanding} />
        <HandPreloader />
        <div className="crt-vignette" />
        <div className="crt-overlay" />
        <div className="crt-glitch" />
      </div>
      <SignalDrop paused={paused} />
      <ClearanceHost />
      <AccessVeil />
    </>
  );
}
