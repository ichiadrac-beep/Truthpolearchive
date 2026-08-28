import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArchiveTally } from "@/components/archive-tally";
import { FilePanel } from "@/components/file-panel";
import { LinkedCount } from "@/components/linked-count";
import { StatusFilter, StatusTag } from "@/components/status-tag";
import { TypeOutTitle } from "@/components/type-out-title";
import { CASE_STATUS_META, deskFromPath, statusOf, type CaseStatus } from "@/lib/case-status";
import { relatedCount } from "@/lib/desk-catalog";
import { type DeskFile } from "@/lib/desk-file";
import { cn } from "@/lib/utils";

type FileDeskProps = {
  section: string;
  title: string;
  intro: string;
  tag: string;
  files: DeskFile[];
  deskPath: string;
  seedId?: string;
  scratch?: boolean;
};

export function FileDesk({ section, title, intro, tag, files, deskPath, seedId, scratch = false }: FileDeskProps) {
  const router = useRouter();
  const desk = deskFromPath(deskPath);
  const [openFile, setOpenFile] = useState<DeskFile | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [focusRelated, setFocusRelated] = useState(false);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");

  useEffect(() => {
    if (!seedId) {
      setOpenFile(null);
      setSelectedId(null);
      setFocusRelated(false);
      return;
    }
    const found = files.find((file) => file.id === seedId) ?? null;
    setOpenFile(found);
    setSelectedId(found?.id ?? null);
  }, [seedId, files]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter((file) => {
      const status = statusOf(file.id, desk);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (!q) return true;
      return [file.title, file.subtitle, file.lede, file.kicker, file.place, file.country, CASE_STATUS_META[status].label]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [files, query, statusFilter, desk]);

  const open = (file: DeskFile, related = false) => {
    setSelectedId(file.id);
    setFocusRelated(related);
    setOpenFile(file);
    router.history.replace(`${deskPath}?file=${encodeURIComponent(file.id)}`);
  };

  const close = () => {
    setOpenFile(null);
    setFocusRelated(false);
    router.history.replace(deskPath);
  };

  return (
    <>
      <section className="mx-auto flex w-full max-w-lg flex-col px-5 pt-3 pb-6">
        <p className="font-display text-[11px] font-medium tracking-[0.38em] text-fg/45">{section}</p>
        <h1 className="mt-3 font-serif text-[2.35rem] leading-none text-fg">{title}</h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-fg/75">{intro}</p>
        <ArchiveTally count={visible.length} label="files" className="mt-4 text-sm text-fg/45" />
        <StatusFilter value={statusFilter} onChange={setStatusFilter} className="mt-3" />

        <label className="sr-only" htmlFor="desk-search">
          Search this desk
        </label>
        <input
          id="desk-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this desk..."
          className="glass-field mt-4 rounded-2xl"
        />

        <ul className="mt-6 flex flex-col">
          {visible.map((file) => {
            const selected = file.id === selectedId;
            const linked = relatedCount(file);
            return (
              <li key={file.id} className="border-t border-fg/10 first:border-t-0">
                <div className={cn("flex items-start gap-2 py-4", selected && "bg-fg/6")}>
                  <button
                    type="button"
                    aria-current={selected ? "true" : undefined}
                    onClick={() => open(file)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[17px] text-fg">
                        <TypeOutTitle id={file.id} text={file.title} />
                      </p>
                      <StatusTag id={file.id} desk={desk} />
                    </div>
                    <p className="mt-1 text-sm text-fg/50">{file.subtitle}</p>
                    <p className="mt-2 font-display text-[11px] tracking-[0.32em] text-fg/40">{tag}</p>
                    <p className="mt-1 text-sm text-fg/45">{file.kicker}</p>
                  </button>
                  <LinkedCount
                    count={linked}
                    onClick={() => open(file, true)}
                    className="mt-0.5"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <FilePanel
        file={openFile}
        pool={files}
        scratch={scratch}
        focusRelated={focusRelated}
        onClose={close}
        onOpen={(next) => open(next)}
      />
    </>
  );
}
