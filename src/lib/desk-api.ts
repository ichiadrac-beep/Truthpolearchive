import { getGuestId, guestAlias } from "@/lib/guest-id";
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

export type SightingComment = {
  id: string;
  alias: string;
  body: string;
  ageSec: number;
  mine: boolean;
};

export type SightingCard = {
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
  alias: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  comments: SightingComment[];
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
    alias?: string;
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
  if (row.imageData || row.videoData) {
    await publishSighting({
      title: row.title,
      location: row.location,
      incidentDate: row.incidentDate,
      description: row.description,
      extra: row.extra,
      imageData: row.imageData,
      imageName: row.imageName,
      videoData: row.videoData,
      videoName: row.videoName,
      alias: args.data.alias,
    }).catch(() => {});
  }
  return { id };
}

async function sightingsCall(payload: Record<string, unknown>): Promise<{ files: SightingCard[] }> {
  const res = await fetch("/api/sightings", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ guestId: getGuestId(), ...payload }),
  });
  if (!res.ok) throw new Error("sightings offline");
  const data = (await res.json()) as { files?: SightingCard[] };
  return { files: Array.isArray(data.files) ? data.files : [] };
}

export async function listSightings(): Promise<{ files: SightingCard[] }> {
  try {
    return await sightingsCall({ action: "list" });
  } catch {
    return { files: [] };
  }
}

export async function publishSighting(data: {
  title: string;
  location?: string;
  incidentDate?: string;
  description: string;
  extra?: string;
  imageData?: string;
  imageName?: string;
  videoData?: string;
  videoName?: string;
  alias?: string;
}): Promise<{ files: SightingCard[] }> {
  return sightingsCall({
    action: "file",
    alias: data.alias || guestAlias(getGuestId()),
    title: data.title,
    location: data.location,
    incidentDate: data.incidentDate,
    description: data.description,
    extra: data.extra,
    imageData: data.imageData,
    imageName: data.imageName,
    videoData: data.videoData,
    videoName: data.videoName,
  });
}

export async function likeSighting(sightingId: string): Promise<{ files: SightingCard[] }> {
  return sightingsCall({ action: "like", sightingId });
}

export async function commentSighting(
  sightingId: string,
  body: string,
  alias?: string,
): Promise<{ files: SightingCard[] }> {
  return sightingsCall({
    action: "comment",
    sightingId,
    body,
    alias: alias || guestAlias(getGuestId()),
  });
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
