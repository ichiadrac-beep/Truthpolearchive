import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AlienLogo } from "@/components/alien-logo";
import { DeskNav } from "@/components/desk-nav";
import { GlassButton } from "@/components/glass-button";
import { MoreSheet } from "@/components/more-sheet";
import { startLogin } from "@/lib/enter-desk";
import { signOut as authSignOut } from "@/lib/auth/client";
import { heartbeatPole } from "@/lib/desk-api";
import { getGuestId } from "@/lib/guest-id";
import { stampScifVisit } from "@/lib/scif";
import { useDesk } from "@/lib/store";
import { DESK_HEADER } from "@/lib/tabs";
import { useOffline } from "@/lib/use-offline";
import { useVisualKeyboard } from "@/lib/use-visual-keyboard";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const accessGranted = useDesk((s) => s.accessGranted);
  const signOut = useDesk((s) => s.signOut);
  const [moreOpen, setMoreOpen] = useState(false);
  const fill = pathname === "/archive" || pathname === "/the-pole";
  const meta = DESK_HEADER[pathname] ?? { name: "Archive" };
  const kb = useVisualKeyboard();
  const offline = useOffline();

  useEffect(() => {
    const id = getGuestId();
    stampScifVisit();
    const beat = () => {
      void heartbeatPole({ data: { guestId: id } }).catch(() => {});
    };
    beat();
    const timer = window.setInterval(beat, 20000);
    return () => window.clearInterval(timer);
  }, []);

  const go = (href: string) => {
    setMoreOpen(false);
    router.history.push(href);
  };

  const onSignOut = () => {
    signOut();
    void authSignOut().catch(() => {});
    router.history.replace("/");
  };

  const onSearch = () => {
    const field = document.getElementById("desk-search");
    if (field instanceof HTMLInputElement) {
      field.focus();
      return;
    }
    go("/conspiracy");
    requestAnimationFrame(() => {
      document.getElementById("desk-search")?.focus();
    });
  };

  return (
    <div
      className="relative z-10 flex flex-col overflow-hidden bg-transparent"
      style={
        kb.open
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: kb.height,
              maxHeight: kb.height,
            }
          : { height: "100dvh", maxHeight: "100dvh" }
      }
    >
      <header className="z-30 flex shrink-0 items-center justify-between gap-3 px-4 pt-[max(0.7rem,env(safe-area-inset-top))] pb-2">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="TRUTHPOLE home">
          <AlienLogo className="h-11 w-11 shrink-0" />
          <span className="min-w-0">
            <span className="block font-display text-[13px] font-semibold tracking-[0.28em] text-fg">
              TRUTHPOLE
            </span>
            <span className="block truncate text-[12px] text-fg/50">
              {meta.name}
              {offline ? <span className="text-fg/35"> · offline</span> : null}
            </span>
          </span>
        </Link>
        <div className="relative z-40 flex shrink-0 items-center gap-2">
          <GlassButton variant="icon" className="size-10" aria-label="Search this desk" onClick={onSearch}>
            <Search className="size-4" strokeWidth={1.6} />
          </GlassButton>
          {accessGranted ? (
            <GlassButton variant="chip" className="h-10 px-4" onClick={onSignOut} aria-label="Sign out">
              Sign out
            </GlassButton>
          ) : (
            <GlassButton
              variant="chip"
              className="glass-strong h-10 px-4"
              onClick={() => startLogin(router.history, pathname)}
              aria-label="Sign in"
            >
              Sign in
            </GlassButton>
          )}
        </div>
      </header>
      <div
        className={cn(
          "min-h-0 flex-1",
          fill ? "flex flex-col overflow-hidden" : "overflow-y-auto overscroll-contain pb-3",
        )}
      >
        {children}
      </div>
      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} onSelect={go} />
      {kb.open ? null : (
        <div className="z-40 shrink-0">
          <DeskNav
            activeHref={pathname}
            moreOpen={moreOpen}
            onSelect={go}
            onMore={() => setMoreOpen((v) => !v)}
          />
        </div>
      )}
    </div>
  );
}
