import { censorHard } from "@/lib/censor";
import { getSql } from "@/lib/db";
import { guestAlias } from "@/lib/guest-id";
import type { PoleMessage } from "@/lib/desk-api";

const TTL_MIN = 6;
const PRESENCE_SEC = 45;
const MAX_BODY = 240;
const MAX_ALIAS = 28;
const MAX_GUEST = 80;
const SEND_GAP_MS = 700;

type Stored = {
  id: string;
  guestId: string;
  alias: string;
  body: string;
  anon: boolean;
  scifCode: string;
  scifTitle: string;
  at: number;
};

type Presence = { guestId: string; at: number };

const g = globalThis as typeof globalThis & {
  __poleMsg__?: Stored[];
  __poleHere__?: Presence[];
  __poleSend__?: Map<string, number>;
};

function memMsg() {
  g.__poleMsg__ ??= [];
  return g.__poleMsg__;
}
function memHere() {
  g.__poleHere__ ??= [];
  return g.__poleHere__;
}
function lastSend() {
  g.__poleSend__ ??= new Map();
  return g.__poleSend__;
}

function clipGuest(id: string) {
  return id.replace(/[^\w.-]/g, "").slice(0, MAX_GUEST) || "guest";
}

function prune(now: number) {
  const ttl = TTL_MIN * 60 * 1000;
  g.__poleMsg__ = memMsg().filter((m) => now - m.at < ttl).slice(-80);
  g.__poleHere__ = memHere().filter((p) => now - p.at < PRESENCE_SEC * 1000);
}

function touchMem(guestId: string, now: number) {
  const rows = memHere().filter((p) => p.guestId !== guestId);
  rows.push({ guestId, at: now });
  g.__poleHere__ = rows;
}

function snapshotMem(guestId: string): { online: number; ttlMin: number; messages: PoleMessage[] } {
  const now = Date.now();
  prune(now);
  touchMem(guestId, now);
  const messages = memMsg().map((m) => ({
    id: m.id,
    alias: m.alias,
    body: m.body,
    ageSec: Math.max(0, Math.round((now - m.at) / 1000)),
    mine: m.guestId === guestId,
    anon: m.anon,
    scifCode: m.scifCode,
    scifTitle: m.scifTitle,
  }));
  return { online: Math.max(1, memHere().length), ttlMin: TTL_MIN, messages };
}

type SqlRow = {
  id: string;
  guest_id: string;
  alias: string;
  body: string;
  anon: boolean | number | string;
  scif_code: string;
  scif_title: string;
  at: number;
};

async function snapshotSql(guestId: string) {
  const sql = await getSql();
  await sql.query("delete from pole_messages where created_at < now() - interval '6 minutes'");
  await sql.query("delete from pole_presence where seen_at < now() - interval '2 minutes'");
  await sql.query(
    `insert into pole_presence (guest_id, seen_at) values ($1, now())
     on conflict (guest_id) do update set seen_at = now()`,
    [guestId],
  );
  const onlineRows = await sql.query<{ n: number }>(
    `select count(*)::int as n from pole_presence where seen_at > now() - interval '${PRESENCE_SEC} seconds'`,
  );
  const rows = await sql.query<SqlRow>(
    `select id, guest_id, alias, body, anon, scif_code, scif_title,
            (extract(epoch from created_at) * 1000)::bigint as at
     from pole_messages
     where created_at > now() - interval '6 minutes'
     order by created_at asc
     limit 80`,
  );
  const now = Date.now();
  const messages: PoleMessage[] = rows.map((m) => ({
    id: String(m.id),
    alias: String(m.alias),
    body: String(m.body),
    ageSec: Math.max(0, Math.round((now - Number(m.at)) / 1000)),
    mine: String(m.guest_id) === guestId,
    anon: Boolean(m.anon === true || m.anon === "t" || m.anon === 1 || m.anon === "1"),
    scifCode: String(m.scif_code || "SCIF-1"),
    scifTitle: String(m.scif_title || "CONFIDENTIAL"),
  }));
  return { online: Math.max(1, Number(onlineRows[0]?.n) || 1), ttlMin: TTL_MIN, messages };
}

export async function poleHeartbeat(guestIdRaw: string) {
  const guestId = clipGuest(guestIdRaw);
  try {
    return await snapshotSql(guestId);
  } catch {
    return snapshotMem(guestId);
  }
}

export async function poleSend(input: {
  guestId: string;
  body: string;
  anon?: boolean;
  displayName?: string;
  scifCode?: string;
  scifTitle?: string;
}) {
  const guestId = clipGuest(input.guestId);
  const now = Date.now();
  const prev = lastSend().get(guestId) ?? 0;
  if (now - prev < SEND_GAP_MS) {
    return poleHeartbeat(guestId);
  }
  lastSend().set(guestId, now);

  const body = censorHard(input.body).slice(0, MAX_BODY);
  if (!body) return poleHeartbeat(guestId);

  const anon = Boolean(input.anon);
  const displayName = (input.displayName ?? "").trim().slice(0, MAX_ALIAS);
  const alias = anon ? "ANON" : displayName || guestAlias(guestId);
  const scifCode = (input.scifCode ?? "SCIF-1").slice(0, 12);
  const scifTitle = (input.scifTitle ?? "CONFIDENTIAL").slice(0, 24);
  const id = `m-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const sql = await getSql();
    await sql.query(
      `insert into pole_messages (id, guest_id, alias, body, anon, scif_code, scif_title)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [id, guestId, alias, body, anon, scifCode, scifTitle],
    );
    return await snapshotSql(guestId);
  } catch {
    prune(now);
    memMsg().push({ id, guestId, alias, body, anon, scifCode, scifTitle, at: now });
    touchMem(guestId, now);
    return snapshotMem(guestId);
  }
}
