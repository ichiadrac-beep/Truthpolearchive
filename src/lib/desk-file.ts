import type { ArchiveCase } from "@/lib/archive-cases";
import { RELATED_BY_ID } from "@/lib/desk-related";

export type DeskFile = {
  id: string;
  title: string;
  kicker: string;
  subtitle: string;
  lede: string;
  summary: string;
  body: string;
  evidence: string;
  sources: string[];
  folklore?: string;
  related?: string[];
  image?: {
    src: string;
    alt: string;
    credit: string;
  };
  lat?: number;
  lng?: number;
  place?: string;
  country?: string;
  year?: number;
};

export type DeskLink = { href: string; label: string };

export function speechForFile(file: DeskFile) {
  return [file.title, file.subtitle, file.summary, file.folklore, file.body, file.evidence]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .map((part) => part.trim())
    .join("\n\n");
}

export function deskToGeo(file: DeskFile): ArchiveCase | null {
  if (file.lat == null || file.lng == null || file.year == null) return null;
  return {
    id: file.id,
    title: file.title,
    place: file.place ?? file.subtitle,
    country: file.country ?? "",
    year: file.year,
    lat: file.lat,
    lng: file.lng,
    summary: file.summary,
    sources: file.sources,
  };
}

export function deskFilesToGeo(files: DeskFile[]): ArchiveCase[] {
  return files.map(deskToGeo).filter((file): file is ArchiveCase => file !== null);
}

export function archiveToDesk(file: ArchiveCase): DeskFile {
  return {
    id: file.id,
    title: file.title,
    kicker: String(file.year),
    subtitle: `${file.place} · ${file.country}`,
    lede: file.summary,
    summary: file.summary,
    body: "",
    evidence: "",
    sources: file.sources ?? [],
    lat: file.lat,
    lng: file.lng,
    place: file.place,
    country: file.country,
    year: file.year,
  };
}

/** First 2–4 sentences for the desk briefing. Never pad with invented text. */
export function deskSummary(text: string): string {
  const raw = text.trim();
  if (!raw) return "";
  const sentences =
    raw.match(/[^.!?]+[.!?]+(?:["”')\]]+)?|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [raw];
  if (sentences.length <= 4) return sentences.join(" ");
  return sentences.slice(0, 4).join(" ");
}

export function fullRecord(file: DeskFile): string {
  const parts = [file.body, file.evidence].map((p) => p.trim()).filter(Boolean);
  if (parts.length) return parts.join("\n\n");
  return file.summary.trim();
}

/** Only real http(s) URLs. Text-only citations are omitted. */
export function linkSources(sources: string[]): DeskLink[] {
  const out: DeskLink[] = [];
  const seen = new Set<string>();
  for (const source of sources) {
    const match = source.match(/https?:\/\/[^\s<>"']+/);
    if (!match) continue;
    let href = match[0].replace(/[.,);]+$/g, "");
    try {
      const url = new URL(href);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      href = url.href;
    } catch {
      continue;
    }
    if (seen.has(href)) continue;
    seen.add(href);
    const label = source
      .replace(match[0], "")
      .replace(/\s*[·\-–—]\s*$/g, "")
      .trim();
    out.push({
      href,
      label: label || href.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    });
  }
  return out;
}

export function relatedIdsOf(file: DeskFile): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of [...(file.related ?? []), ...(RELATED_BY_ID[file.id] ?? [])]) {
    if (!id || id === file.id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/** Only files named in real relations that exist on this desk. No guessed matches. */
export function relatedDeskFiles(file: DeskFile, pool: DeskFile[]): DeskFile[] {
  const byId = new Map(pool.map((item) => [item.id, item]));
  const found: DeskFile[] = [];
  for (const id of relatedIdsOf(file)) {
    const match = byId.get(id);
    if (match) found.push(match);
  }
  return found;
}

export function sharePayload(file: DeskFile) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = [file.title, file.subtitle, deskSummary(file.summary || file.lede)].filter(Boolean).join("\n");
  return { title: file.title, text, url };
}