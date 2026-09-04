import { ANCIENT_FILES } from "@/lib/ancient-files";
import { ARCHIVE_CASES } from "@/lib/archive-cases";
import { CONSPIRACY_FILES } from "@/lib/conspiracy-files";
import { archiveToDesk, relatedIdsOf, type DeskFile } from "@/lib/desk-file";

export type DeskKey = "archive" | "conspiracy" | "ancient";

export const DESK_META: Record<DeskKey, { path: string; label: string }> = {
  archive: { path: "/archive", label: "Archive" },
  conspiracy: { path: "/conspiracy", label: "Conspiracy" },
  ancient: { path: "/ancient", label: "Ancient" },
};

export type CatalogEntry = DeskFile & { desk: DeskKey };

function withDesk(files: DeskFile[], desk: DeskKey): CatalogEntry[] {
  return files.map((file) => ({ ...file, desk }));
}

export const CATALOG: CatalogEntry[] = [
  ...withDesk(ARCHIVE_CASES.map(archiveToDesk), "archive"),
  ...withDesk(CONSPIRACY_FILES, "conspiracy"),
  ...withDesk(ANCIENT_FILES, "ancient"),
];

export const CATALOG_BY_ID = new Map(CATALOG.map((file) => [file.id, file]));

export function hrefFor(entry: CatalogEntry) {
  return `${DESK_META[entry.desk].path}?file=${encodeURIComponent(entry.id)}`;
}

export function deskOf(id: string, fallback: DeskKey = "archive"): DeskKey {
  return CATALOG_BY_ID.get(id)?.desk ?? fallback;
}

export function relatedFromCatalog(file: DeskFile): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  const seen = new Set<string>();
  for (const id of relatedIdsOf(file)) {
    if (seen.has(id)) continue;
    const hit = CATALOG_BY_ID.get(id);
    if (!hit) continue;
    seen.add(id);
    out.push(hit);
  }
  return out;
}

export function relatedCount(file: DeskFile) {
  return relatedFromCatalog(file).length;
}
