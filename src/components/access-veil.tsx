import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { DecryptSequence } from "@/components/decrypt-text";
import { ACCESS_MS } from "@/lib/access";
import { useDesk } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AccessVeil() {
  const router = useRouter();
  const veil = useDesk((s) => s.accessVeil);
  const clearAccess = useDesk((s) => s.clearAccess);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!veil) {
      setLeaving(false);
      return;
    }
    setLeaving(false);
    router.history.push(veil.href);
    const fade = window.setTimeout(() => setLeaving(true), ACCESS_MS - 120);
    const done = window.setTimeout(() => clearAccess(), ACCESS_MS + 40);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [veil, router, clearAccess]);

  if (!veil) return null;

  return (
    <div
      className={cn("access-veil", leaving && "access-veil-leave")}
      role="status"
      aria-live="assertive"
      aria-label={`${veil.kicker}. ${veil.title}`}
    >
      <DecryptSequence
        key={veil.nonce}
        kicker={veil.kicker}
        title={veil.title}
        footer="DECRYPTING…"
        duration={ACCESS_MS - 80}
      />
    </div>
  );
}
