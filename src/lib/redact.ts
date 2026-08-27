const STOP = new Set(
  (
    "a an the and or but if as at by for from in into of on to with without within " +
    "this that these those it its they their them he she his her we our you your " +
    "was were be been being is are am been had has have having did does do not no " +
    "so than then there here when where which who whom what why how all any both " +
    "each few more most other some such only own same too very can will just " +
    "about after before during while also still over under after also between " +
    "because against through until once one two first later many much well even"
  ).split(" "),
);

const PHRASES = [
  "non-human",
  "crash retrieval",
  "majestic 12",
  "area 51",
  "special access",
  "unacknowledged",
  "black triangle",
  "tic tac",
  "biological remains",
  "legacy program",
  "immaculate constellation",
];

const HOT =
  /^(classified|radar|craft|uap|ufo|witness|object|program|facility|hangar|saucer|triangle|retrieval|biological|metamaterial|transmedium|orb|disk|capsule|wreckage|airman|pilot|sensor|infrared|radar|flir|gimbal|nimitz|roswell|lazar|grusch|aawsap|aatip|osap|nids|baass|nonhuman|extraterrestrial|occupant|being|entity|craft|vehicle)$/i;

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed % 2147483646 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export type RedactPart = { type: "text" | "redact"; value: string };

export function markRedactions(text: string, seedKey: string): RedactPart[] {
  if (!text) return [];
  const rand = rng(hash(seedKey));
  const taken = new Set<string>();
  const spans: { start: number; end: number }[] = [];

  const tryAdd = (start: number, end: number) => {
    const key = `${start}:${end}`;
    if (taken.has(key) || end - start < 4) return;
    for (const s of spans) {
      if (start < s.end && end > s.start) return;
    }
    taken.add(key);
    spans.push({ start, end });
  };

  const lower = text.toLowerCase();
  for (const phrase of PHRASES) {
    let from = 0;
    while (from < lower.length) {
      const at = lower.indexOf(phrase, from);
      if (at < 0) break;
      if (rand() < 0.82) tryAdd(at, at + phrase.length);
      from = at + phrase.length;
    }
  }

  const wordRe = /[A-Za-z][A-Za-z0-9'-]{3,}/g;
  let m: RegExpExecArray | null;
  const candidates: { start: number; end: number; score: number }[] = [];
  while ((m = wordRe.exec(text))) {
    const raw = m[0];
    const word = raw.toLowerCase();
    if (STOP.has(word)) continue;
    const score = (HOT.test(word) ? 3 : 0) + (raw[0] === raw[0]?.toUpperCase() ? 1 : 0) + (raw.length > 7 ? 1 : 0);
    if (score < 1 && raw.length < 6) continue;
    candidates.push({ start: m.index, end: m.index + raw.length, score });
  }

  candidates.sort((a, b) => b.score - a.score || a.start - b.start);
  const budget = Math.max(2, Math.min(7, Math.round(text.split(/\s+/).length / 22)));
  for (const c of candidates) {
    if (spans.length >= budget) break;
    if (rand() > 0.72 && c.score < 2) continue;
    tryAdd(c.start, c.end);
  }

  spans.sort((a, b) => a.start - b.start);
  const parts: RedactPart[] = [];
  let cursor = 0;
  for (const s of spans) {
    if (s.start > cursor) parts.push({ type: "text", value: text.slice(cursor, s.start) });
    parts.push({ type: "redact", value: text.slice(s.start, s.end) });
    cursor = s.end;
  }
  if (cursor < text.length) parts.push({ type: "text", value: text.slice(cursor) });
  return parts.length ? parts : [{ type: "text", value: text }];
}
