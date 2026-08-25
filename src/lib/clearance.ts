export type ClearanceId = "wow" | "mj12" | "zeta";

export type ClearanceMemo = {
  id: ClearanceId;
  phrase: string;
  kicker: string;
  title: string;
  tonight: string;
  body: string;
};

const STORAGE_KEY = "truthpole-clearance";

export const CLEARANCE_MEMOS: Record<ClearanceId, ClearanceMemo> = {
  wow: {
    id: "wow",
    phrase: "WOW",
    kicker: "15 AUG 1977 · 22:16 EDT",
    title: "Big Ear / 6EQUJ5",
    tonight: "Wow! Signal",
    body: "Ohio State’s Big Ear logged a 72-second narrowband spike at 1420.4556 MHz. Jerry Ehman wrote WOW! in the margin. It did not repeat. This desk files the printout, not a conclusion.",
  },
  mj12: {
    id: "mj12",
    phrase: "MJ-12",
    kicker: "EYES ONLY · 1947 / 1984",
    title: "Majestic Twelve",
    tonight: "MJ-12",
    body: "The 1984 film packet names a twelve-man crash committee under Truman. The FBI stamp reads bogus. The Archives Cutler–Twining memo does not match its own filing. You are cleared to read the contradiction.",
  },
  zeta: {
    id: "zeta",
    phrase: "ZETA",
    kicker: "19–20 SEP 1961 · Rte 3",
    title: "Zeta Reticuli",
    tonight: "Zeta Reticuli",
    body: "Betty and Barney Hill’s missing two hours, a star map under hypnosis, later read as Zeta Reticuli. Marjorie Fish’s model is contested. The highway, the map, and the hours stay on the desk.",
  },
};

type Stored = {
  unlocked: ClearanceId[];
  last: ClearanceId | null;
  seenMemo: ClearanceId[];
};

const subs = new Set<() => void>();

function read(): Stored {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlocked: [], last: null, seenMemo: [] };
    const parsed = JSON.parse(raw) as Stored;
    const ids: ClearanceId[] = ["wow", "mj12", "zeta"];
    const unlocked = (parsed.unlocked ?? []).filter((id): id is ClearanceId => ids.includes(id));
    const seenMemo = (parsed.seenMemo ?? []).filter((id): id is ClearanceId => ids.includes(id));
    const last = parsed.last && ids.includes(parsed.last) ? parsed.last : unlocked[unlocked.length - 1] ?? null;
    return { unlocked, last, seenMemo };
  } catch {
    return { unlocked: [], last: null, seenMemo: [] };
  }
}

function write(state: Stored) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode */
  }
}

function emit() {
  for (const fn of subs) fn();
}

export function getClearance() {
  return read();
}

export function subscribeClearance(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function markMemoSeen(id: ClearanceId) {
  const state = read();
  if (!state.seenMemo.includes(id)) state.seenMemo.push(id);
  write(state);
  emit();
}

export function matchClearancePhrase(raw: string): ClearanceId | null {
  const s = raw.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  if (s.endsWith("MJ-12") || s.endsWith("MJ12")) return "mj12";
  if (s === "WOW" || s.endsWith("WOW")) return "wow";
  if (s.endsWith("ZETA")) return "zeta";
  return null;
}

export type UnlockResult = { id: ClearanceId; first: boolean; showMemo: boolean };

export function unlockClearance(id: ClearanceId): UnlockResult {
  const state = read();
  const first = !state.unlocked.includes(id);
  if (first) state.unlocked.push(id);
  state.last = id;
  const showMemo = !state.seenMemo.includes(id);
  write(state);
  emit();
  return { id, first, showMemo };
}

export function tonightClearance() {
  const last = read().last;
  if (!last) {
    return { title: "Cussac", special: null as ClearanceId | null };
  }
  return { title: CLEARANCE_MEMOS[last].tonight, special: last };
}

export function revealClearanceMemo(id: ClearanceId) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tp-clearance-memo", { detail: id }));
}

