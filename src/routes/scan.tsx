import { useEffect, useRef } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { HandScan } from "@/components/hand-scan";
import { DEFAULT_DESK_HREF, useDesk } from "@/lib/store";

export const Route = createFileRoute("/scan")({
  component: ScanPage,
});

function ScanPage() {
  const router = useRouter();
  const hydrate = useDesk((s) => s.hydrate);
  const hydrated = useDesk((s) => s.hydrated);
  const accessGranted = useDesk((s) => s.accessGranted);
  const pendingHref = useDesk((s) => s.pendingHref);
  const setScanActive = useDesk((s) => s.setScanActive);
  const started = useRef(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    setScanActive(true);
    return () => setScanActive(false);
  }, [setScanActive]);

  useEffect(() => {
    if (!hydrated) return;
    if (accessGranted && !started.current) {
      router.history.replace(pendingHref ?? DEFAULT_DESK_HREF);
    }
  }, [hydrated, accessGranted, pendingHref, router]);

  if (!hydrated) {
    return <div className="min-h-dvh bg-black" aria-hidden="true" />;
  }

  if (accessGranted && !started.current) {
    return <div className="min-h-dvh bg-black" aria-hidden="true" />;
  }

  started.current = true;
  return <HandScan />;
}
