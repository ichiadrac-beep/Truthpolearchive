import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArchiveMap } from "@/components/archive-map";
import { FilePanel } from "@/components/file-panel";
import { ARCHIVE_CASES, YEAR_MAX, YEAR_MIN, type ArchiveCase } from "@/lib/archive-cases";
import { archiveToDesk } from "@/lib/desk-file";
import { useDesk } from "@/lib/store";

type ArchiveSearch = {
  file?: string;
};

export const Route = createFileRoute("/_desk/archive")({
  validateSearch: (search: Record<string, unknown>): ArchiveSearch => {
    if (typeof search.file === "string" && search.file) return { file: search.file };
    return {};
  },
  component: ArchivePage,
});

const FIRST_PLAY_KEY = "truthpole-archive-first-play";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** First Archive open this session (or landing sweep) → auto-slide left → right. */
function shouldIntroPlay() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  if (useDesk.getState().archiveSweep) return true;
  try {
    return sessionStorage.getItem(FIRST_PLAY_KEY) !== "1";
  } catch {
    return true;
  }
}

function markIntroPlayed() {
  try {
    sessionStorage.setItem(FIRST_PLAY_KEY, "1");
  } catch {
    /* private mode */
  }
}

function ArchivePage() {
  const { file: fileId } = Route.useSearch();
  const seeded = fileId ? (ARCHIVE_CASES.find((row) => row.id === fileId) ?? null) : null;
  const [intro] = useState(() => !seeded && shouldIntroPlay());
  const [year, setYear] = useState(seeded ? seeded.year : intro ? YEAR_MIN : YEAR_MAX);
  const [file, setFile] = useState<ArchiveCase | null>(seeded);
  const pool = useMemo(() => ARCHIVE_CASES.map(archiveToDesk), []);

  useEffect(() => {
    useDesk.getState().consumeArchiveSweep();
    if (intro) markIntroPlayed();
  }, [intro]);

  useEffect(() => {
    if (!fileId) return;
    const found = ARCHIVE_CASES.find((row) => row.id === fileId) ?? null;
    if (!found) return;
    setYear(found.year);
    setFile(found);
  }, [fileId]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ArchiveMap
        year={year}
        onYear={setYear}
        onOpen={setFile}
        autoPlay={intro}
        playMs={intro ? 48 : 72}
      />
      <FilePanel
        file={file ? archiveToDesk(file) : null}
        pool={pool}
        onClose={() => setFile(null)}
        onOpen={(next) => {
          const found = ARCHIVE_CASES.find((item) => item.id === next.id) ?? null;
          setFile(found);
        }}
      />
    </div>
  );
}
