import { createHash } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";

const VOICE = "orion";
const MAX_CHARS = 4500;
const CACHE_MAX = 24;

type CacheEntry = { buf: Uint8Array; at: number };

const cache = new Map<string, CacheEntry>();
const hits = new Map<string, { n: number; t: number }>();

function trimForNarration(raw: string) {
  const text = raw.replace(/\s+/g, " ").trim();
  if (text.length <= MAX_CHARS) return text;
  const cut = text.slice(0, MAX_CHARS);
  const at = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return (at > 400 ? cut.slice(0, at + 1) : cut).trim();
}

/** Light documentary cadence — tags are xAI-only, never sent to the browser synth. */
function withCadence(text: string) {
  const parts = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) return parts.join(" [pause] ");
  const m = text.match(/^(.+?[.!?])\s+(.+)$/s);
  if (m) return `${m[1]} [pause] ${m[2]}`;
  return text;
}

function hashText(text: string) {
  return createHash("sha256").update(`${VOICE}\n${text}`).digest("hex").slice(0, 24);
}

function cacheGet(key: string) {
  const hit = cache.get(key);
  if (!hit) return null;
  cache.delete(key);
  cache.set(key, hit);
  return hit.buf;
}

function cacheSet(key: string, buf: Uint8Array) {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, { buf, at: Date.now() });
  while (cache.size > CACHE_MAX) {
    const first = cache.keys().next().value as string | undefined;
    if (first) cache.delete(first);
    else break;
  }
}

function limited(ip: string) {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now - row.t > 5 * 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  return row.n > 24;
}

async function readBody(request: Request): Promise<{ text?: string }> {
  try {
    return (await request.json()) as { text?: string };
  } catch {
    return {};
  }
}

async function synthesize(text: string): Promise<Uint8Array | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice_id: VOICE,
      language: "en",
      speed: 0.91,
      text_normalization: true,
      output_format: { codec: "mp3", sample_rate: 24000, bit_rate: 128000 },
    }),
  });
  if (!res.ok) return null;
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.byteLength < 800) return null;
  return buf;
}

export const Route = createFileRoute("/api/read-aloud")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
        if (limited(ip)) {
          return Response.json({ error: "busy" }, { status: 429 });
        }
        const data = await readBody(request);
        const clean = trimForNarration(typeof data.text === "string" ? data.text : "");
        if (clean.length < 8) {
          return Response.json({ error: "empty" }, { status: 400 });
        }
        const script = withCadence(clean);
        const key = hashText(script);
        const cached = cacheGet(key);
        if (cached) {
          return new Response(Buffer.from(cached), {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "private, max-age=3600",
            },
          });
        }
        try {
          const audio = await synthesize(script);
          if (!audio) {
            return Response.json({ error: "unavailable" }, { status: 503 });
          }
          cacheSet(key, audio);
          return new Response(Buffer.from(audio), {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "private, max-age=3600",
            },
          });
        } catch {
          return Response.json({ error: "unavailable" }, { status: 503 });
        }
      },
    },
  },
});
