import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { FilePanel } from "@/components/file-panel";
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
};

export function FileDesk({ section, title, intro, tag, files, deskPath, seedId }: FileDeskProps) {
  const router = useRouter();
  const [openFile, setOpenFile] = useState<DeskFile | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!seedId) {
      setOpenFile(null);
      setSelectedId(null);
      return;
    }
    const found = files.find((file) => file.id === seedId) ?? null;
    setOpenFile(found);
    setSelectedId(found?.id ?? null);
  }, [seedId, files]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return files;
    return files.filter((file) =>
      [file.title, file.subtitle, file.lede, file.kicker, file.place, file.country]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [files, query]);

  const open = (file: DeskFile) => {
    setSelectedId(file.id);
    setOpenFile(file);
    router.history.replace(`${deskPath}?file=${encodeURIComponent(file.id)}`);
  };

  const close = () => {
    setOpenFile(null);
    router.history.replace(deskPath);
  };

  return (
    <>
      <section className="mx-auto flex w-full max-w-lg flex-col px-5 pt-3 pb-6">
        <p className="font-display text-[11px] font-medium tracking-[0.38em] text-fg/45">{section}</p>
        <h1 className="mt-3 font-serif text-[2.35rem] leading-none text-fg">{title}</h1>
        <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-fg/75">{intro}</p>
        <p className="mt-4 text-sm text-fg/45">{files.length} files</p>

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
                <button
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  onClick={() => open(file)}
                  className={cn(
                    "w-full py-4 text-left",
                    selected && "bg-fg/6",
                  )}
                >
                  <p className="text-[17px] text-fg">{file.title}</p>
                  <p className="mt-1 text-sm text-fg/50">
                    {file.subtitle}
                    {linked ? ` · ${linked} linked` : ""}
                  </p>
                  <p className="mt-2 font-display text-[11px] tracking-[0.32em] text-fg/40">{tag}</p>
                  <p className="mt-1 text-sm text-fg/45">{file.kicker}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <FilePanel
        file={openFile}
        pool={files}
        onClose={close}
        onOpen={open}
      />
    </>
  );
}
