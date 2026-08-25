import { getGuestId } from "@/lib/guest-id";
import type { ScifClearance } from "@/lib/scif";

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
  anon: boolean;
  scifCode: string;
  scifTitle: string;
};

const FILINGS_KEY = "truthpole-filings-v2";

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
  const snap = await poleCall({ guestId: args.data.guestId || getGuestId(), heartbeat: true });
  return { online: snap.online };
}

export async function listPoleMessages(args: {
  data: { guestId: string };
}): Promise<{ online: number; ttlMin: number; messages: PoleMessage[] }> {
  return poleCall({ guestId: args.data.guestId || getGuestId(), heartbeat: true });
}

export async function sendPoleMessage(args: {
  data: {
    guestId: string;
    body: string;
    anon?: boolean;
    displayName?: string;
    scif?: ScifClearance;
  };
}): Promise<{ online: number; ttlMin: number; messages: PoleMessage[] }> {
  return poleCall({
    guestId: args.data.guestId || getGuestId(),
    body: args.data.body,
    anon: args.data.anon,
    displayName: args.data.displayName,
    scif: args.data.scif,
  });
}

async function poleCall(payload: {
  guestId: string;
  body?: string;
  anon?: boolean;
  displayName?: string;
  scif?: ScifClearance;
  heartbeat?: boolean;
}): Promise<{ online: number; ttlMin: number; messages: PoleMessage[] }> {
  const res = await fetch("/api/pole", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("pole offline");
  const data = (await res.json()) as { online?: number; ttlMin?: number; messages?: PoleMessage[] };
  return {
    online: Math.max(1, Number(data.online) || 1),
    ttlMin: Number(data.ttlMin) || 6,
    messages: Array.isArray(data.messages) ? data.messages : [],
  };
}

