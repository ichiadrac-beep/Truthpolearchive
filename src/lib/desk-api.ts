import { getGuestId, guestAlias } from "@/lib/guest-id";

export type FilingRow = {
  id: string;
  title: string;
  location: string;
  incidentDate: string;
  description: string;
  extra?: string;
  imageData?: string;
  imageName?: string;
  videoData?: string;
  videoName?: string;
  status: "pending" | "approved" | "held";
  createdAt: string;
};

export type PoleMessage = {
  id: string;
  alias: string;
  body: string;
  ageSec: number;
  mine: boolean;
};

const FILINGS_KEY = "truthpole-filings-v2";
const POLE_KEY = "truthpole-pole-v1";
const POLE_TTL_MS = 6 * 60 * 1000;

type PoleStored = { id: string; guestId: string; body: string; at: number };

function loadFilings(): FilingRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FILINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FilingRow[];
    return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
  } catch {
    return [];
  }
}

function saveFilings(rows: FilingRow[]) {
  try {
    localStorage.setItem(FILINGS_KEY, JSON.stringify(rows.slice(0, 40)));
  } catch {
    /* quota */
  }
}

function censor(body: string) {
  return body
    .replace(/\b(fuck|shit|cunt|bitch|asshole)\b/gi, "••••")
    .slice(0, 240);
}

function loadPole(): PoleStored[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(POLE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PoleStored[];
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed.filter((m) => now - m.at < POLE_TTL_MS).slice(-80);
  } catch {
    return [];
  }
}

function savePole(rows: PoleStored[]) {
  try {
    localStorage.setItem(POLE_KEY, JSON.stringify(rows.slice(-80)));
  } catch {
    /* quota */
  }
}

function toMessages(rows: PoleStored[], guestId: string): PoleMessage[] {
  const now = Date.now();
  return rows.map((m) => ({
    id: m.id,
    alias: guestAlias(m.guestId),
    body: m.body,
    ageSec: Math.max(0, Math.round((now - m.at) / 1000)),
    mine: m.guestId === guestId,
  }));
}

export async function submitFiling(args: {
  data: {
    title: string;
    location: string;
    incidentDate: string;
    description: string;
    extra?: string;
    imageData?: string;
    imageName?: string;
    videoData?: string;
    videoName?: string;
  };
}): Promise<{ id: string }> {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `f-${Date.now()}`;
  const row: FilingRow = {
    id,
    title: args.data.title,
    location: args.data.location,
    incidentDate: args.data.incidentDate,
    description: args.data.description,
    extra: args.data.extra,
    imageData: args.data.imageData || undefined,
    imageName: args.data.imageName,
    videoData: args.data.videoData || undefined,
    videoName: args.data.videoName,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const next = [row, ...loadFilings()];
  saveFilings(next);
  return { id };
}

export async function heartbeatPole(args: { data: { guestId: string } }): Promise<{ online: number }> {
  void args;
  try {
    const n = Number(sessionStorage.getItem("truthpole-pole-online") || "1");
    sessionStorage.setItem("truthpole-pole-online", String(Math.max(1, n)));
  } catch {
    /* ignore */
  }
  return { online: 1 + Math.floor(Math.random() * 3) };
}

export async function listPoleMessages(args: {
  data: { guestId: string };
}): Promise<{ online: number; ttlMin: number; messages: PoleMessage[] }> {
  const guestId = args.data.guestId || getGuestId();
  const rows = loadPole();
  savePole(rows);
  const beat = await heartbeatPole({ data: { guestId } });
  return { online: beat.online, ttlMin: 6, messages: toMessages(rows, guestId) };
}

export async function sendPoleMessage(args: {
  data: { guestId: string; body: string };
}): Promise<{ online: number; ttlMin: number; messages: PoleMessage[] }> {
  const guestId = args.data.guestId || getGuestId();
  const body = censor(args.data.body.trim());
  if (!body) return listPoleMessages({ data: { guestId } });
  const rows = loadPole();
  rows.push({
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `m-${Date.now()}`,
    guestId,
    body,
    at: Date.now(),
  });
  savePole(rows);
  const beat = await heartbeatPole({ data: { guestId } });
  return { online: beat.online, ttlMin: 6, messages: toMessages(rows, guestId) };
}
