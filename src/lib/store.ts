import { create } from "zustand";

export const DEFAULT_DESK_HREF = "/archive";

const ACCESS_KEY = "truthpole-access";

type DeskState = {
  hydrated: boolean;
  accessGranted: boolean;
  scanOpen: boolean;
  scanActive: boolean;
  panelOpen: boolean;
  pendingHref: string | null;
  handReady: boolean;
  exitHome: boolean;
  hydrate: () => void;
  setHandReady: (ready: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  setScanActive: (active: boolean) => void;
  requestAccess: (href: string) => boolean;
  dismissScan: () => void;
  completeScan: () => string;
  signOut: () => void;
  clearExitHome: () => void;
};

function readGranted() {
  try {
    return sessionStorage.getItem(ACCESS_KEY) === "1";
  } catch {
    return false;
  }
}

export const useDesk = create<DeskState>((set, get) => ({
  hydrated: false,
  accessGranted: false,
  scanOpen: false,
  scanActive: false,
  panelOpen: false,
  pendingHref: null,
  handReady: false,
  exitHome: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ hydrated: true, accessGranted: readGranted() });
  },
  setHandReady: (ready) => set({ handReady: ready }),
  setPanelOpen: (open) => set({ panelOpen: open }),
  setScanActive: (active) => set({ scanActive: active }),
  requestAccess: (href) => {
    if (get().accessGranted) return true;
    set({ scanOpen: true, pendingHref: href });
    return false;
  },
  dismissScan: () => set({ scanOpen: false, pendingHref: null }),
  completeScan: () => {
    const href = get().pendingHref ?? DEFAULT_DESK_HREF;
    try {
      sessionStorage.setItem(ACCESS_KEY, "1");
    } catch {
      /* private mode */
    }
    set({ accessGranted: true, scanOpen: false, pendingHref: null });
    return href;
  },
  signOut: () => {
    try {
      sessionStorage.removeItem(ACCESS_KEY);
    } catch {
      /* private mode */
    }
    set({
      accessGranted: false,
      scanOpen: false,
      pendingHref: null,
      exitHome: true,
    });
  },
  clearExitHome: () => set({ exitHome: false }),
}));
