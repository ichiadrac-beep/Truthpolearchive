import { useEffect, useState } from "react";
import { GlassButton } from "@/components/glass-button";
import {
  CLEARANCE_MEMOS,
  matchClearancePhrase,
  markMemoSeen,
  unlockClearance,
  type ClearanceId,
} from "@/lib/clearance";

export function ClearanceHost() {
  const [memoId, setMemoId] = useState<ClearanceId | null>(null);
  const [note, setNote] = useState(false);

  useEffect(() => {
    let buf = "";
    let noteTimer = 0;

    const flashNote = () => {
      setNote(true);
      window.clearTimeout(noteTimer);
      noteTimer = window.setTimeout(() => setNote(false), 2200);
    };

    const apply = (id: ClearanceId) => {
      const result = unlockClearance(id);
      flashNote();
      if (result.showMemo) setMemoId(id);
    };

    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Backspace") {
        buf = buf.slice(0, -1);
        return;
      }
      if (event.key.length !== 1) return;
      buf = (buf + event.key).slice(-20);
      const id = matchClearancePhrase(buf);
      if (!id) return;
      buf = "";
      apply(id);
    };

    const onInput = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) return;
      const id = matchClearancePhrase(target.value);
      if (!id) return;
      apply(id);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("input", onInput, true);
    const onReveal = (event: Event) => {
      const id = (event as CustomEvent<ClearanceId>).detail;
      if (id === "wow" || id === "mj12" || id === "zeta") setMemoId(id);
    };
    window.addEventListener("tp-clearance-memo", onReveal);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("input", onInput, true);
      window.removeEventListener("tp-clearance-memo", onReveal);
      window.clearTimeout(noteTimer);
    };
  }, []);

  const memo = memoId ? CLEARANCE_MEMOS[memoId] : null;

  const closeMemo = () => {
    if (memoId) markMemoSeen(memoId);
    setMemoId(null);
  };

  return (
    <>
      {note ? (
        <p
          className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[70] text-center font-display text-[11px] tracking-[0.32em] text-fg/55"
          role="status"
        >
          Clearance noted
        </p>
      ) : null}

      {memo ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/55 p-6"
          role="dialog"
          aria-label="Cleared memo"
          onClick={closeMemo}
        >
          <article
            className="glass-strong w-full max-w-sm rounded-3xl px-5 py-5"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-display text-[11px] font-medium tracking-[0.38em] text-fg/45">CLEARED MEMO</p>
            <p className="mt-3 font-display text-[11px] tracking-[0.18em] text-fg/50">{memo.kicker}</p>
            <h2 className="mt-2 font-serif text-[1.85rem] leading-none text-fg">{memo.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-fg/70">{memo.body}</p>
            <p className="mt-4 font-display text-[11px] tracking-[0.28em] text-fg/40">Clearance noted</p>
            <GlassButton variant="chip" className="mt-5 h-10 w-full rounded-full" onClick={closeMemo}>
              File
            </GlassButton>
          </article>
        </div>
      ) : null}
    </>
  );
}

