import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Share2, Square, Volume2, X } from "lucide-react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Drawer } from "vaul";
import { GlassButton } from "@/components/glass-button";
import { LinkedCount } from "@/components/linked-count";
import { ScratchText } from "@/components/scratch-text";
import { StatusTag } from "@/components/status-tag";
import { TypeOutTitle } from "@/components/type-out-title";
import { accessNavigate } from "@/lib/access-nav";
import { deskFromPath } from "@/lib/case-status";
import { fileHasScratch, isFileDeclassified, markRedactions } from "@/lib/redact";
import { DESK_META, hrefFor, relatedFromCatalog } from "@/lib/desk-catalog";
import {
  deskSummary,
  fullRecord,
  linkSources,
  sharePayload,
  speechForFile,
  type DeskFile,
} from "@/lib/desk-file";
import { useDesk } from "@/lib/store";

type FilePanelProps = {
  file: DeskFile | null;
  pool?: DeskFile[];
  onClose: () => void;
  onOpen?: (file: DeskFile) => void;
  focusRelated?: boolean;
  /** Redaction bars you scratch to declassify. Archive case files only. */
  scratch?: boolean;
};

export function FilePanel({
  file,
  onClose,
  onOpen,
  focusRelated = false,
  scratch = false,
}: FilePanelProps) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const setPanelOpen = useDesk((s) => s.setPanelOpen);
  const open = file !== null;
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ticketDone, setTicketDone] = useState(false);
  const relatedRef = useRef<HTMLElement>(null);

  const summary = file ? deskSummary(file.summary || file.lede) : "";
  const record = file ? fullRecord(file) : "";
  const hasBars = Boolean(
    scratch && file && fileHasScratch(file.id) && markRedactions(summary, file.id).some((part) => part.type === "redact"),
  );
  const ticket = Boolean(hasBars && file && !isFileDeclassified(file.id) && !ticketDone);
  const links = useMemo(() => (file ? linkSources(file.sources) : []), [file]);
  const related = useMemo(() => (file ? relatedFromCatalog(file) : []), [file]);

  useEffect(() => {
    setPanelOpen(open);
    return () => setPanelOpen(false);
  }, [open, setPanelOpen]);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setCopied(false);
    setTicketDone(false);
    return () => window.speechSynthesis?.cancel();
  }, [file?.id]);

  useEffect(() => {
    if (!focusRelated || !related.length) return;
    const timer = window.setTimeout(() => {
      relatedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [file?.id, focusRelated, related.length]);

  const jumpRelated = () => {
    relatedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleSpeak = () => {
    const synth = window.speechSynthesis;
    if (!file || !synth) return;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(speechForFile(file));
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utterance);
    setSpeaking(true);
  };

  const close = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    onClose();
  };

  const share = async () => {
    if (!file) return;
    const payload = sharePayload(file);
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    try {
      const blob = [payload.title, payload.url, payload.text].filter(Boolean).join("\n\n");
      await navigator.clipboard.writeText(blob);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no clipboard */
    }
  };

  const openRelated = (item: (typeof related)[number]) => {
    const path = DESK_META[item.desk].path;
    if (path === pathname) {
      onOpen?.(item);
      return;
    }
    accessNavigate(router.history, hrefFor(item));
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
      shouldScaleBackground={false}
      setBackgroundColorOnScale={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="file-overlay fixed inset-0 z-50 bg-bg/55" />
        <Drawer.Content className="file-sheet fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-h-[86dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-bg text-fg outline-none">
          <div className="glass-strong relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-3xl">
            <span className="file-stamp" aria-hidden="true">
              CLASSIFIED
            </span>
            <div className="file-chrome">
            <Drawer.Handle className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-fg/25" />
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-5 pt-6 pb-3">
              <div className="min-w-0">
                <p className="font-display text-xs font-medium tracking-kicker text-muted">
                  {file?.kicker ?? "FILE"}
                </p>
                <Drawer.Title className="mt-1 font-serif text-[1.65rem] leading-none text-fg">
                  {file?.title ?? ""}
                </Drawer.Title>
                {file?.subtitle ? <p className="mt-2 text-sm leading-snug text-fg/55">{file.subtitle}</p> : null}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {file ? <StatusTag id={file.id} desk={deskFromPath(pathname)} /> : null}
                  <LinkedCount count={related.length} onClick={jumpRelated} className="-ml-0.5" />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 pt-0.5">
                <GlassButton
                  variant="icon"
                  aria-label={speaking ? "Stop reading" : "Read aloud"}
                  aria-pressed={speaking}
                  onClick={toggleSpeak}
                  className="size-11"
                >
                  {speaking ? (
                    <Square className="size-4" strokeWidth={1.8} />
                  ) : (
                    <Volume2 className="size-5" strokeWidth={1.6} />
                  )}
                </GlassButton>
                <GlassButton variant="icon" aria-label="Close file" onClick={close} className="size-11">
                  <X className="size-5" strokeWidth={1.6} />
                </GlassButton>
              </div>
            </header>
            </div>
            <div className="file-body min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {summary ? (
                <section className="pb-5">
                  <h3 className="font-display text-xs font-medium tracking-kicker text-muted">Desk summary</h3>
                  {ticket ? (
                    <>
                      <p className="mt-1 font-display text-[10px] tracking-[0.22em] text-fg/35">
                        REDACTED · scratch the bars to declassify
                      </p>
                      <ScratchText
                        text={summary}
                        fileId={file?.id ?? "file"}
                        className="mt-2 max-w-prose text-sm leading-normal text-fg/90"
                        onComplete={() => setTicketDone(true)}
                      />
                    </>
                  ) : (
                    <>
                      {scratch && file && (isFileDeclassified(file.id) || ticketDone) ? (
                        <p className="mt-1 font-display text-[10px] tracking-[0.22em] text-fg/45">
                          DECLASSIFIED
                        </p>
                      ) : null}
                      <p className="mt-2 max-w-prose text-sm leading-normal text-fg/90">{summary}</p>
                    </>
                  )}
                </section>
              ) : null}

              <section className="pb-5">
                <h3 className="font-display text-xs font-medium tracking-kicker text-muted">Full record</h3>
                <div className="file-record mt-2 max-h-[42dvh] overflow-y-auto overscroll-contain pr-1">
                  {file?.image ? (
                    <figure className="mb-4">
                      <div className="overflow-hidden rounded-xl bg-bg">
                        <img
                          src={file.image.src}
                          alt={file.image.alt}
                          width={1280}
                          height={800}
                          decoding="async"
                          className="aspect-16/10 h-auto w-full object-cover object-center"
                        />
                      </div>
                      <figcaption className="mt-2 text-xs text-subtle">{file.image.credit}</figcaption>
                    </figure>
                  ) : null}
                  {record ? (
                    record.split("\n\n").map((para, i) => (
                      <p key={i} className="mt-3 max-w-prose text-sm leading-normal text-fg/90 first:mt-0">
                        {para}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-fg/50">No further record on this desk.</p>
                  )}
                </div>
              </section>

              {links.length ? (
                <section className="pb-5">
                  <h3 className="font-display text-xs font-medium tracking-kicker text-muted">Sources</h3>
                  <ul className="mt-2 space-y-2 text-sm leading-normal">
                    {links.map((source) => (
                      <li key={source.href}>
                        <a
                          href={source.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-fg/90 underline decoration-fg/35 underline-offset-2"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {related.length ? (
                <section ref={relatedRef} className="pb-5" id="file-related">
                  <h3 className="font-display text-xs font-medium tracking-kicker text-muted">
                    Related · {related.length} linked
                  </h3>
                  <ul className="mt-2 flex flex-col gap-1">
                    {related.map((item) => (
                      <li key={`${item.desk}-${item.id}`}>
                        <button
                          type="button"
                          className="w-full rounded-xl px-3 py-2.5 text-left active:bg-fg/8"
                          onClick={() => openRelated(item)}
                        >
                          <span className="block text-sm text-fg underline decoration-fg/35 underline-offset-2">
                            <TypeOutTitle id={item.id} text={item.title} />
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-2">
                            <StatusTag id={item.id} desk={item.desk} />
                            <span className="font-display text-[11px] tracking-[0.22em] text-fg/45">
                              {DESK_META[item.desk].label}
                              {item.kicker ? ` · ${item.kicker}` : ""}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="pb-2">
                <GlassButton
                  variant="chip"
                  className="h-11 w-full gap-2 rounded-full"
                  onClick={() => void share()}
                  aria-label={copied ? "Copied to clipboard" : "Share file"}
                >
                  {copied ? <Check className="size-4" strokeWidth={1.8} /> : <Share2 className="size-4" strokeWidth={1.7} />}
                  {copied ? "Copied" : "Share"}
                </GlassButton>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
