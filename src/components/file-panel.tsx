import { useEffect, useState } from "react";
import { Square, Volume2, X } from "lucide-react";
import { Drawer } from "vaul";
import { GlassButton } from "@/components/glass-button";
import { type DeskFile, speechForFile } from "@/lib/desk-file";
import { useDesk } from "@/lib/store";

type FilePanelProps = {
  file: DeskFile | null;
  onClose: () => void;
};

export function FilePanel({ file, onClose }: FilePanelProps) {
  const setPanelOpen = useDesk((s) => s.setPanelOpen);
  const open = file !== null;
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setPanelOpen(open);
    return () => setPanelOpen(false);
  }, [open, setPanelOpen]);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    return () => window.speechSynthesis?.cancel();
  }, [file?.id]);

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
        <Drawer.Overlay className="fixed inset-0 z-50 bg-bg/55" />
        <Drawer.Content className="file-sheet fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-h-[86dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-bg text-fg outline-none">
          <div className="glass-strong flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-3xl">
            <Drawer.Handle className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-fg/25" />
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-5 pt-1 pb-3">
              <div className="min-w-0">
                <p className="font-display text-xs font-medium tracking-kicker text-muted">
                  {file?.kicker ?? "FILE"}
                </p>
                <Drawer.Title className="mt-1 font-serif text-[1.65rem] leading-none text-fg">
                  {file?.title ?? ""}
                </Drawer.Title>
                {file?.subtitle ? <p className="mt-2 text-sm leading-snug text-fg/55">{file.subtitle}</p> : null}
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
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {file?.image ? (
                <figure className="mb-5">
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
              {file?.summary ? <Section heading="Summary" body={file.summary} /> : null}
              {file?.body ? <Section heading="Record" body={file.body} /> : null}
              {file?.evidence ? <Section heading="Evidence" body={file.evidence} /> : null}
              {file?.sources.length ? (
                <section className="pb-6">
                  <h3 className="font-display text-xs font-medium tracking-kicker text-muted">Sources</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-normal text-fg/90">
                    {file.sources.map((source) => (
                      <li key={source}>
                        <SourceLine source={source} />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function Section({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="pb-5">
      <h3 className="font-display text-xs font-medium tracking-kicker text-muted">{heading}</h3>
      <p className="mt-2 max-w-prose text-sm leading-normal text-fg/90">{body}</p>
    </section>
  );
}

function SourceLine({ source }: { source: string }) {
  const parts = source.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-fg/35 underline-offset-2"
          >
            {part.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
