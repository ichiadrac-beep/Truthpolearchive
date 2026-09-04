import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileDesk } from "@/components/file-desk";
import { CATALOG_BY_ID } from "@/lib/desk-catalog";
import type { DeskFile } from "@/lib/desk-file";
import {
  anniversariesFromToday,
  formatAnniversaryKicker,
  isAnniversaryToday,
  subscribeDayChange,
} from "@/lib/tonight";

type AnniversarySearch = {
  file?: string;
};

export const Route = createFileRoute("/_desk/anniversaries")({
  validateSearch: (search: Record<string, unknown>): AnniversarySearch => {
    if (typeof search.file === "string" && search.file) return { file: search.file };
    return {};
  },
  component: AnniversariesPage,
});

function filesForDay(date: Date): DeskFile[] {
  const out: DeskFile[] = [];
  const seen = new Set<string>();
  for (const row of anniversariesFromToday(date)) {
    if (seen.has(row.id)) continue;
    const hit = CATALOG_BY_ID.get(row.id);
    if (!hit) continue;
    seen.add(row.id);
    const today = isAnniversaryToday(row, date);
    out.push({
      ...hit,
      kicker: formatAnniversaryKicker(row, hit.year, today),
    });
  }
  return out;
}

function AnniversariesPage() {
  const { file } = Route.useSearch();
  const [day, setDay] = useState(() => new Date());

  useEffect(() => subscribeDayChange(() => setDay(new Date())), []);

  const files = useMemo(() => filesForDay(day), [day]);

  return (
    <FileDesk
      section="CALENDAR"
      title="Anniversaries"
      intro="The year as a filing cabinet. The list starts at today and walks the calendar. Open a file for the record, the gaps, and the sources."
      tag="ANNIVERSARY"
      files={files}
      deskPath="/anniversaries"
      seedId={file}
    />
  );
}
