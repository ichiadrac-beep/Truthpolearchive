import { censorHard } from "@/lib/censor";
import { getSql } from "@/lib/db";
import { guestAlias } from "@/lib/guest-id";

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

type StoredFile = {
  id: string;
  guestId: string;
  alias: string;
  title: string;
  location: string;
  incidentDate: string;
  description: string;
  extra: string;
  imageData?: string;
  imageName?: string;
  videoData?: string;
  videoName?: string;
  at: number;
};

type StoredLike = { sightingId: string; guestId: string };
type StoredComment = {
  id: string;
  sightingId: string;
  guestId: string;
  alias: string;
  body: string;
  at: number;
};

const MAX_FILES = 36;
const MAX_COMMENTS = 40;
const MAX_TITLE = 120;
const MAX_BODY = 2000;
const MAX_COMMENT = 180;
const MAX_GUEST = 80;
const GAP_MS = 900;

const g = globalThis as typeof globalThis & {
  __sightFiles__?: StoredFile[];
  __sightLikes__?: StoredLike[];
  __sightNotes__?: StoredComment[];
  __sightSend__?: Map<string, number>;
};

function files() {
  g.__sightFiles__ ??= [];
  return g.__sightFiles__;
}
function likes() {
  g.__sightLikes__ ??= [];
  return g.__sightLikes__;
}
function notes() {
  g.__sightNotes__ ??= [];
  return g.__sightNotes__;
}
function lastHit() {
  g.__sightSend__ ??= new Map();
  return g.__sightSend__;
}

function clipGuest(id: string) {
  return id.replace(/[^\w.-]/g, "").slice(0, MAX_GUEST) || "guest";
}

function nid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function hasMedia(row: { imageData?: string; videoData?: string }) {
  return Boolean(row.imageData || row.videoData);
}

function toCard(row: StoredFile, guestId: string): SightingCard {
  const now = Date.now();
  const fileLikes = likes().filter((l) => l.sightingId === row.id);
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    incidentDate: row.incidentDate,
    description: row.description,
    extra: row.extra || undefined,
    imageData: row.imageData,
    imageName: row.imageName,
    videoData: row.videoData,
    videoName: row.videoName,
    alias: row.alias,
    createdAt: new Date(row.at).toISOString(),
    likes: fileLikes.length,
    liked: fileLikes.some((l) => l.guestId === guestId),
    comments: notes()
      .filter((c) => c.sightingId === row.id)
      .sort((a, b) => a.at - b.at)
      .slice(-MAX_COMMENTS)
      .map((c) => ({
        id: c.id,
        alias: c.alias,
        body: c.body,
        ageSec: Math.max(0, Math.round((now - c.at) / 1000)),
        mine: c.guestId === guestId,
      })),
  };
}

function snapshotMem(guestId: string): { files: SightingCard[] } {
  const rows = files()
    .filter(hasMedia)
    .sort((a, b) => b.at - a.at)
    .slice(0, MAX_FILES);
  return { files: rows.map((row) => toCard(row, guestId)) };
}

async function snapshotSql(guestId: string): Promise<{ files: SightingCard[] }> {
  const sql = await getSql();
  const rows = await sql.query<{
    id: string;
    guest_id: string;
    alias: string;
    title: string;
    location: string;
    incident_date: string;
    description: string;
    extra: string;
    image_data: string | null;
    image_name: string | null;
    video_data: string | null;
    video_name: string | null;
    at: number;
  }>(
    `select id, guest_id, alias, title, location, incident_date, description, extra,
            image_data, image_name, video_data, video_name,
            (extract(epoch from created_at) * 1000)::bigint as at
     from sighting_files
     order by created_at desc
     limit ${MAX_FILES}`,
  );
  const ids = rows.map((r) => String(r.id));
  if (!ids.length) return { files: [] };

  const likeRows = await sql.query<{ sighting_id: string; guest_id: string }>(
    `select sighting_id, guest_id from sighting_likes where sighting_id = any($1::text[])`,
    [ids],
  );
  const noteRows = await sql.query<{
    id: string;
    sighting_id: string;
    guest_id: string;
    alias: string;
    body: string;
    at: number;
  }>(
    `select id, sighting_id, guest_id, alias, body,
            (extract(epoch from created_at) * 1000)::bigint as at
     from sighting_comments
     where sighting_id = any($1::text[])
     order by created_at asc`,
    [ids],
  );

  const now = Date.now();
  const filesOut: SightingCard[] = rows
    .filter((r) => r.image_data || r.video_data)
    .map((r) => {
      const id = String(r.id);
      const fileLikes = likeRows.filter((l) => String(l.sighting_id) === id);
      return {
        id,
        title: String(r.title),
        location: String(r.location || ""),
        incidentDate: String(r.incident_date || ""),
        description: String(r.description || ""),
        extra: r.extra ? String(r.extra) : undefined,
        imageData: r.image_data || undefined,
        imageName: r.image_name || undefined,
        videoData: r.video_data || undefined,
        videoName: r.video_name || undefined,
        alias: String(r.alias),
        createdAt: new Date(Number(r.at) || now).toISOString(),
        likes: fileLikes.length,
        liked: fileLikes.some((l) => String(l.guest_id) === guestId),
        comments: noteRows
          .filter((c) => String(c.sighting_id) === id)
          .slice(-MAX_COMMENTS)
          .map((c) => ({
            id: String(c.id),
            alias: String(c.alias),
            body: String(c.body),
            ageSec: Math.max(0, Math.round((now - Number(c.at)) / 1000)),
            mine: String(c.guest_id) === guestId,
          })),
      };
    });
  return { files: filesOut };
}

export async function listSightings(guestIdRaw: string) {
  const guestId = clipGuest(guestIdRaw);
  try {
    return await snapshotSql(guestId);
  } catch {
    return snapshotMem(guestId);
  }
}

export async function fileSighting(input: {
  guestId: string;
  alias?: string;
  title: string;
  location?: string;
  incidentDate?: string;
  description: string;
  extra?: string;
  imageData?: string;
  imageName?: string;
  videoData?: string;
  videoName?: string;
}) {
  const guestId = clipGuest(input.guestId);
  const now = Date.now();
  const prev = lastHit().get(`f-${guestId}`) ?? 0;
  if (now - prev < GAP_MS) return listSightings(guestId);
  lastHit().set(`f-${guestId}`, now);

  const title = (input.title || "").trim().slice(0, MAX_TITLE);
  const description = (input.description || "").trim().slice(0, MAX_BODY);
  const imageData = (input.imageData || "").startsWith("data:") ? input.imageData : "";
  const videoData = (input.videoData || "").startsWith("data:") ? input.videoData : "";
  if (!title || !description || (!imageData && !videoData)) return listSightings(guestId);

  const row: StoredFile = {
    id: nid("s"),
    guestId,
    alias: (input.alias || "").trim().slice(0, 28) || guestAlias(guestId),
    title,
    location: (input.location || "").trim().slice(0, 120),
    incidentDate: (input.incidentDate || "").slice(0, 32),
    description,
    extra: (input.extra || "").trim().slice(0, 1200),
    imageData: imageData || undefined,
    imageName: input.imageName?.slice(0, 80),
    videoData: videoData || undefined,
    videoName: input.videoName?.slice(0, 80),
    at: now,
  };

  try {
    const sql = await getSql();
    await sql.query(
      `insert into sighting_files
        (id, guest_id, alias, title, location, incident_date, description, extra,
         image_data, image_name, video_data, video_name)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        row.id,
        row.guestId,
        row.alias,
        row.title,
        row.location,
        row.incidentDate,
        row.description,
        row.extra,
        row.imageData ?? null,
        row.imageName ?? null,
        row.videoData ?? null,
        row.videoName ?? null,
      ],
    );
    return await snapshotSql(guestId);
  } catch {
    files().unshift(row);
    g.__sightFiles__ = files().slice(0, MAX_FILES);
    return snapshotMem(guestId);
  }
}

export async function toggleSightingLike(guestIdRaw: string, sightingIdRaw: string) {
  const guestId = clipGuest(guestIdRaw);
  const sightingId = sightingIdRaw.replace(/[^\w.-]/g, "").slice(0, 48);
  if (!sightingId) return listSightings(guestId);

  try {
    const sql = await getSql();
    const existing = await sql.query<{ n: number }>(
      `select count(*)::int as n from sighting_likes where sighting_id = $1 and guest_id = $2`,
      [sightingId, guestId],
    );
    if (Number(existing[0]?.n) > 0) {
      await sql.query(`delete from sighting_likes where sighting_id = $1 and guest_id = $2`, [
        sightingId,
        guestId,
      ]);
    } else {
      await sql.query(`insert into sighting_likes (sighting_id, guest_id) values ($1, $2)`, [
        sightingId,
        guestId,
      ]);
    }
    return await snapshotSql(guestId);
  } catch {
    const key = likes().findIndex((l) => l.sightingId === sightingId && l.guestId === guestId);
    if (key >= 0) likes().splice(key, 1);
    else likes().push({ sightingId, guestId });
    return snapshotMem(guestId);
  }
}

export async function addSightingComment(input: {
  guestId: string;
  sightingId: string;
  body: string;
  alias?: string;
}) {
  const guestId = clipGuest(input.guestId);
  const sightingId = input.sightingId.replace(/[^\w.-]/g, "").slice(0, 48);
  const now = Date.now();
  const prev = lastHit().get(`c-${guestId}`) ?? 0;
  if (now - prev < GAP_MS) return listSightings(guestId);
  lastHit().set(`c-${guestId}`, now);

  const body = censorHard(input.body).slice(0, MAX_COMMENT);
  if (!sightingId || !body) return listSightings(guestId);
  const note: StoredComment = {
    id: nid("n"),
    sightingId,
    guestId,
    alias: (input.alias || "").trim().slice(0, 28) || guestAlias(guestId),
    body,
    at: now,
  };

  try {
    const sql = await getSql();
    await sql.query(
      `insert into sighting_comments (id, sighting_id, guest_id, alias, body) values ($1,$2,$3,$4,$5)`,
      [note.id, note.sightingId, note.guestId, note.alias, note.body],
    );
    return await snapshotSql(guestId);
  } catch {
    notes().push(note);
    return snapshotMem(guestId);
  }
}
