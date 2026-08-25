import type { ArchiveCase } from "@/lib/archive-cases";

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

export function speechForFile(file: DeskFile) {
  return [file.title, file.subtitle, file.summary, file.body, file.evidence]
    .map((part) => part.trim())
    .filter(Boolean)
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
