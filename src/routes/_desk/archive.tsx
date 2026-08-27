import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArchiveMap } from "@/components/archive-map";
import { FilePanel } from "@/components/file-panel";
import { ARCHIVE_CASES, YEAR_MAX, YEAR_MIN, type ArchiveCase } from "@/lib/archive-cases";
import { CATALOG_BY_ID, hrefFor } from "@/lib/desk-catalog";
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
  const router = useRouter();
  const { file: fileId } = Route.useSearch();
  const seeded = fileId ? (ARCHIVE_CASES.find((row) => row.id === fileId) ?? null) : null;
  const [intro] = useState(() => !seeded && shouldIntroPlay());
  const [year, setYear] = useState(seeded ? seeded.year : intro ? YEAR_MIN : YEAR_MAX);
  const [file, setFile] = useState<ArchiveCase | null>(seeded);
  const pool = useMemo(() => ARCHIVE_CASES.map(archiveToDesk), []);

  const [focusRelated, setFocusRelated] = useState(false);

  useEffect(() => {
    useDesk.getState().consumeArchiveSweep();
    if (intro) markIntroPlayed();
  }, [intro]);

  useEffect(() => {
    if (!fileId) {
      setFile(null);
      setFocusRelated(false);
      return;
    }
    const found = ARCHIVE_CASES.find((row) => row.id === fileId) ?? null;
    if (!found) return;
    setYear(found.year);
    setFile(found);
  }, [fileId]);

  const show = (row: ArchiveCase, opts?: { related?: boolean }) => {
    setYear(row.year);
    setFocusRelated(Boolean(opts?.related));
    setFile(row);
    router.history.replace(`/archive?file=${encodeURIComponent(row.id)}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ArchiveMap
        year={year}
        onYear={setYear}
        onOpen={show}
        autoPlay={intro}
        playMs={intro ? 48 : 72}
      />
      <FilePanel
        file={file ? archiveToDesk(file) : null}
        pool={pool}
        focusRelated={focusRelated}
        onClose={() => {
          setFile(null);
          setFocusRelated(false);
          router.history.replace("/archive");
        }}
        onOpen={(next) => {
          const found = ARCHIVE_CASES.find((item) => item.id === next.id) ?? null;
          if (found) {
            show(found);
            return;
          }
          const other = CATALOG_BY_ID.get(next.id);
          if (other) router.history.push(hrefFor(other));
        }}
      />
    </div>
  );
}
