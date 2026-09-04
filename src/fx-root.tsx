import { useEffect } from "react";
import { GlyphField } from "@/components/glyph-field";
import { HandPreloader } from "@/components/hand-preloader";
import { StarField } from "@/components/star-field";
import { useDesk } from "@/lib/store";
import { cn } from "@/lib/utils";

export function FxRoot() {
  const hydrate = useDesk((s) => s.hydrate);
  const scanActive = useDesk((s) => s.scanActive);
  const panelOpen = useDesk((s) => s.panelOpen);
  const paused = scanActive || panelOpen;

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className={cn(paused && "fx-paused")}>
      {/* Static star wash — craft UFOs + rare meteors drawn on StarField canvas */}
      <div className="cosmos-sky" aria-hidden="true" />
      <StarField paused={paused} />
      <GlyphField paused={paused} />
      <HandPreloader />
    </div>
  );
}
