import { useEffect, useState, type FormEvent } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import {
  commentSighting,
  likeSighting,
  listSightings,
  type SightingCard,
} from "@/lib/desk-api";
import { guestAlias, getGuestId } from "@/lib/guest-id";
import { cn } from "@/lib/utils";

export function SightingsBoard() {
  const [files, setFiles] = useState<SightingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const alias = guestAlias(getGuestId());

  useEffect(() => {
    let alive = true;
    void listSightings()
      .then((snap) => {
        if (alive) setFiles(snap.files);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-0.5">
        {loading ? (
          <p className="px-1 py-8 text-center text-sm text-fg/45">Opening witness files…</p>
        ) : files.length === 0 ? (
          <p className="px-1 py-8 text-center text-sm leading-relaxed text-fg/45">
            No filed media yet. Submit an encounter with a photo or video and it lands here.
          </p>
        ) : (
          files.map((file) => (
            <SightingCardView
              key={file.id}
              file={file}
              alias={alias}
              onUpdate={setFiles}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SightingCardView({
  file,
  alias,
  onUpdate,
}: {
  file: SightingCard;
  alias: string;
  onUpdate: (files: SightingCard[]) => void;
}) {
  const [openNotes, setOpenNotes] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const onLike = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const snap = await likeSighting(file.id);
      onUpdate(snap.files);
    } catch {
      /* keep local */
    } finally {
      setBusy(false);
    }
  };

  const onNote = async (event: FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || busy) return;
    setBusy(true);
    try {
      const snap = await commentSighting(file.id, body, alias);
      onUpdate(snap.files);
      setDraft("");
      setOpenNotes(true);
    } catch {
      /* keep draft */
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="glass-plain-strong rounded-2xl px-4 py-3">
      <p className="font-display text-[10px] tracking-[0.22em] text-signal">WITNESS FILE</p>
      <p className="mt-1 font-display text-base font-semibold tracking-tight text-fg">{file.title}</p>
      <p className="mt-1 text-sm text-fg/50">
        {file.alias}
        {file.location || file.incidentDate
          ? ` · ${[file.location, file.incidentDate].filter(Boolean).join(" · ")}`
          : ""}
      </p>
      <p className="mt-2 text-sm leading-normal text-fg/90">{file.description}</p>
      {file.extra ? <p className="mt-2 text-sm leading-normal text-fg/70">{file.extra}</p> : null}
      {file.imageData ? (
        <img src={file.imageData} alt="" className="mt-3 max-h-64 w-full rounded-xl object-cover" />
      ) : null}
      {file.videoData ? <video src={file.videoData} controls className="mt-3 w-full rounded-xl" /> : null}

      <div className="mt-3 flex items-center gap-2">
        <GlassButton
          variant="chip"
          className={cn("h-9 gap-1.5 px-3", file.liked && "glass-strong")}
          aria-pressed={file.liked}
          onClick={() => void onLike()}
        >
          <Heart className={cn("size-3.5", file.liked && "fill-current") } strokeWidth={1.7} />
          {file.likes}
        </GlassButton>
        <GlassButton
          variant="chip"
          className={cn("h-9 gap-1.5 px-3", openNotes && "glass-strong")}
          aria-expanded={openNotes}
          onClick={() => setOpenNotes((v) => !v)}
        >
          <MessageCircle className="size-3.5" strokeWidth={1.7} />
          {file.comments.length}
        </GlassButton>
      </div>

      {openNotes ? (
        <div className="mt-3 flex flex-col gap-2">
          {file.comments.length === 0 ? (
            <p className="text-xs text-fg/40">No notes on this file yet.</p>
          ) : (
            file.comments.map((note) => (
              <p key={note.id} className="text-sm leading-relaxed text-fg/80">
                <span className="font-display text-[10px] tracking-[0.16em] text-fg/45">
                  {note.mine ? "YOU" : note.alias}
                </span>
                <span className="ml-2">{note.body}</span>
              </p>
            ))
          )}
          <form className="flex gap-2" onSubmit={onNote}>
            <input
              className="glass-field min-w-0 flex-1"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a note…"
              maxLength={180}
              aria-label="Comment on this file"
            />
            <GlassButton type="submit" variant="chip" className="h-11 px-3" disabled={busy || !draft.trim()}>
              Post
            </GlassButton>
          </form>
        </div>
      ) : null}
    </article>
  );
}
