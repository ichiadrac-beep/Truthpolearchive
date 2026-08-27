import { create } from "zustand";
import { accessCopy, type AccessVeil } from "@/lib/access";

export const DEFAULT_DESK_HREF = "/archive";

const ACCESS_KEY = "truthpole-access";
const PENDING_KEY = "truthpole-pending";

type DeskState = {
  hydrated: boolean;
  accessGranted: boolean;
  scanOpen: boolean;
  scanActive: boolean;
  panelOpen: boolean;
  pendingHref: string | null;
  handReady: boolean;
  exitHome: boolean;
  archiveSweep: boolean;
  accessVeil: AccessVeil | null;
  hydrate: () => void;
  setHandReady: (ready: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  setScanActive: (active: boolean) => void;
  requestAccess: (href: string) => boolean;
  dismissScan: () => void;
  completeScan: () => string;
  signOut: () => void;
  clearExitHome: () => void;
  armArchiveSweep: () => void;
  consumeArchiveSweep: () => void;
  startAccess: (href: string) => void;
  clearAccess: () => void;
};

function readGranted() {
  try {
    return localStorage.getItem(ACCESS_KEY) === "1" || sessionStorage.getItem(ACCESS_KEY) === "1";
  } catch {
    return false;
  }
}

function writeGranted(on: boolean) {
  try {
    if (on) {
      localStorage.setItem(ACCESS_KEY, "1");
      sessionStorage.setItem(ACCESS_KEY, "1");
    } else {
      localStorage.removeItem(ACCESS_KEY);
      sessionStorage.removeItem(ACCESS_KEY);
    }
  } catch {
    /* private mode */
  }
}

function readPending() {
  try {
    return localStorage.getItem(PENDING_KEY);
  } catch {
    return null;
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
  archiveSweep: false,
  accessVeil: null,
  hydrate: () => {
    if (get().hydrated) return;
    set({ hydrated: true, accessGranted: readGranted(), pendingHref: readPending() });
  },
  setHandReady: (ready) => set({ handReady: ready }),
  setPanelOpen: (open) => set({ panelOpen: open }),
  setScanActive: (active) => set({ scanActive: active }),
  requestAccess: (href) => {
    if (get().accessGranted) return true;
    try {
      localStorage.setItem(PENDING_KEY, href);
    } catch {
      /* private mode */
    }
    set({ scanOpen: true, pendingHref: href });
    return false;
  },
  dismissScan: () => set({ scanOpen: false, pendingHref: null }),
  completeScan: () => {
    const href = get().pendingHref ?? readPending() ?? DEFAULT_DESK_HREF;
    writeGranted(true);
    try {
      localStorage.removeItem(PENDING_KEY);
    } catch {
      /* private mode */
    }
    set({ accessGranted: true, scanOpen: false, pendingHref: null });
    return href;
  },
  signOut: () => {
    writeGranted(false);
    try {
      localStorage.removeItem(PENDING_KEY);
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
  armArchiveSweep: () => set({ archiveSweep: true }),
  consumeArchiveSweep: () => set({ archiveSweep: false }),
  startAccess: (href) => {
    const copy = accessCopy(href);
    set({
      accessVeil: { href, kicker: copy.kicker, title: copy.title, nonce: Date.now() },
    });
  },
  clearAccess: () => set({ accessVeil: null }),
}));
