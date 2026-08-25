import { useEffect } from "react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useDesk } from "@/lib/store";

export const Route = createFileRoute("/_desk")({
  component: DeskLayout,
});

function DeskLayout() {
  const hydrate = useDesk((s) => s.hydrate);
  const clearExitHome = useDesk((s) => s.clearExitHome);

  useEffect(() => {
    hydrate();
    clearExitHome();
  }, [hydrate, clearExitHome]);

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
