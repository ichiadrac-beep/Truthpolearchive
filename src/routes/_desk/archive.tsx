import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArchiveMap } from "@/components/archive-map";
import { FilePanel } from "@/components/file-panel";
import { YEAR_MAX, YEAR_MIN, type ArchiveCase } from "@/lib/archive-cases";
import type { DeskFile } from "@/lib/desk-file";
import { useDesk } from "@/lib/store";

export const Route = createFileRoute("/_desk/archive")({
  component: ArchivePage,
});

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ArchivePage() {
  const [intro] = useState(() => useDesk.getState().archiveSweep && !prefersReducedMotion());
  const [year, setYear] = useState(intro ? YEAR_MIN : YEAR_MAX);
  const [file, setFile] = useState<ArchiveCase | null>(null);

  useEffect(() => {
    useDesk.getState().consumeArchiveSweep();
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ArchiveMap
        year={year}
        onYear={setYear}
        onOpen={setFile}
        autoPlay={intro}
        playMs={intro ? 48 : 72}
      />
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
    sources: file.sources ?? [],
  };
}
