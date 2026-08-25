import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArchiveMap } from "@/components/archive-map";
import { FilePanel } from "@/components/file-panel";
import { YEAR_MAX, type ArchiveCase } from "@/lib/archive-cases";
import type { DeskFile } from "@/lib/desk-file";

export const Route = createFileRoute("/_desk/archive")({
  component: ArchivePage,
});

function ArchivePage() {
  const [year, setYear] = useState(YEAR_MAX);
  const [file, setFile] = useState<ArchiveCase | null>(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ArchiveMap year={year} onYear={setYear} onOpen={setFile} />
      <FilePanel file={file ? archiveToDesk(file) : null} onClose={() => setFile(null)} />
    </div>
  );
}

function archiveToDesk(file: ArchiveCase): DeskFile {
  return {
    id: file.id,
    title: file.title,
    kicker: String(file.year),
    subtitle: `${file.place} · ${file.country}`,
    lede: file.summary,
    summary: file.summary,
    body: "",
    evidence: "",
    sources: [],
  };
}
