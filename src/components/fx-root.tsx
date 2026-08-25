import { useEffect, useState } from "react";
import { ClearanceHost } from "@/components/clearance-host";
import { GlyphField } from "@/components/glyph-field";
import { HandPreloader } from "@/components/hand-scan";
import { StarField } from "@/components/star-field";
import { useDesk } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FxRoot() {
  const hydrate = useDesk((s) => s.hydrate);
  const scanActive = useDesk((s) => s.scanActive);
  const panelOpen = useDesk((s) => s.panelOpen);
  const [glyphQuiet, setGlyphQuiet] = useState(false);
  const paused = Boolean(scanActive || panelOpen || glyphQuiet);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <div className={cn(paused && "fx-paused")} aria-hidden="true">
        <div className="cosmos-sky">
          <span className="shoot-star" />
          <span className="shoot-star" />
          <span className="shoot-star" />
        </div>
        <StarField paused={paused} />
        <HandPreloader />
      </div>
      <GlyphField paused={paused} onQuiet={setGlyphQuiet} />
      <ClearanceHost />
    </>
  );
}