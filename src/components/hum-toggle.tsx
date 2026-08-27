import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import { isHumMuted, subscribeHum, toggleHum } from "@/lib/desk-hum";

export function HumToggle({ className }: { className?: string }) {
  const [muted, setMuted] = useState(isHumMuted);

  useEffect(() => {
    const unsub = subscribeHum(() => setMuted(isHumMuted()));
    return unsub;
  }, []);

  return (
    <GlassButton
      variant="icon"
      className={className ?? "size-10"}
      aria-label={muted ? "Unmute sky hum" : "Mute sky hum"}
      aria-pressed={!muted}
      onClick={() => toggleHum()}
    >
      {muted ? (
        <VolumeX className="size-4" strokeWidth={1.6} />
      ) : (
        <Volume2 className="size-4" strokeWidth={1.6} />
      )}
    </GlassButton>
  );
}
