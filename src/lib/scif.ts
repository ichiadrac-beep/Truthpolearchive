import type { AppUser } from "@/lib/auth/use-current-user";

const SCIF_KEY = "truthpole-scif-v1";
const ANON_KEY = "truthpole-pole-anon";
const GRAPHIC_KEY = "truthpole-pole-graphic";

export type ScifClearance = {
  days: number;
  level: number;
  code: string;
  title: string;
};

const RANKS: { minDays: number; level: number; code: string; title: string }[] = [
  { minDays: 60, level: 6, code: "SCIF-6", title: "UMBRA" },
  { minDays: 30, level: 5, code: "SCIF-5", title: "SAP" },
  { minDays: 14, level: 4, code: "SCIF-4", title: "TS/SCI" },
  { minDays: 7, level: 3, code: "SCIF-3", title: "TOP SECRET" },
  { minDays: 3, level: 2, code: "SCIF-2", title: "SECRET" },
  { minDays: 1, level: 1, code: "SCIF-1", title: "CONFIDENTIAL" },
];

export const SCIF_VISITOR: ScifClearance = {
  days: 0,
  level: 0,
  code: "SCIF-0",
  title: "VISITOR",
};

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function rankFor(days: number): ScifClearance {
  if (days < 1) return { ...SCIF_VISITOR };
  const rank = RANKS.find((row) => days >= row.minDays) ?? RANKS[RANKS.length - 1];
  return { days, level: rank.level, code: rank.code, title: rank.title };
}

function readDays(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SCIF_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { days?: unknown };
    return Array.isArray(parsed.days)
      ? parsed.days.filter((d): d is string => typeof d === "string").slice(-400)
      : [];
  } catch {
    return [];
  }
}

function writeDays(days: string[]) {
  try {
    localStorage.setItem(SCIF_KEY, JSON.stringify({ days }));
  } catch {
    /* quota */
  }
}

export function getScifClearance(): ScifClearance {
  return rankFor(readDays().length);
}

/** Count today once. Clearance is unique days on the desk. */
export function stampScifVisit(): ScifClearance {
  const days = readDays();
  const today = todayStamp();
  if (!days.includes(today)) {
    days.push(today);
    writeDays(days);
  }
  return rankFor(days.length);
}

export function normalizeXHandle(raw: string) {
  return raw.trim().replace(/^@+/, "").replace(/[^A-Za-z0-9_]/g, "").slice(0, 15);
}

export function accountChatName(user: (AppUser & { username?: string | null }) | null) {
  if (!user || user.isDevFallback) return "";
  const extra = user as AppUser & { username?: string | null };
  const username = extra.username?.trim();
  if (username) {
    const handle = normalizeXHandle(username);
    return handle ? `@${handle}` : `@${username.replace(/^@+/, "")}`;
  }
  const name = user.displayName?.trim() ?? "";
  if (!name) return "";
  if (/\s/.test(name)) return name;
  const handle = normalizeXHandle(name);
  return handle ? `@${handle}` : name;
}

export function getAnonPref() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ANON_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveAnonPref(anon: boolean) {
  try {
    localStorage.setItem(ANON_KEY, anon ? "1" : "0");
  } catch {
    /* quota */
  }
}

export function getGraphicFilterPref() {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(GRAPHIC_KEY);
    return raw !== "0";
  } catch {
    return true;
  }
}

export function saveGraphicFilterPref(on: boolean) {
  try {
    localStorage.setItem(GRAPHIC_KEY, on ? "1" : "0");
  } catch {
    /* quota */
  }
}

export function formatScifBadge(scif: Pick<ScifClearance, "code" | "title">) {
  return `${scif.code} ${scif.title}`;
}
