import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import { listPoleMessages, sendPoleMessage, type PoleMessage } from "@/lib/desk-api";
import { getGuestId, guestAlias } from "@/lib/guest-id";

export function PoleDesk() {
  const guestId = useRef("guest-preview");
  const [alias, setAlias] = useState("GUEST");
  const [online, setOnline] = useState(1);
  const [ttl, setTtl] = useState(6);
  const [messages, setMessages] = useState<PoleMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const apply = (payload: { online: number; ttlMin: number; messages: PoleMessage[] }) => {
    setOnline(payload.online);
    setTtl(payload.ttlMin);
    setMessages(payload.messages);
  };

  useEffect(() => {
    guestId.current = getGuestId();
    setAlias(guestAlias(guestId.current));
    let alive = true;
    const tick = async () => {
      try {
        const next = await listPoleMessages({ data: { guestId: guestId.current } });
        if (alive) apply(next);
      } catch {
        /* keep last */
      }
    };
    void tick();
    const id = window.setInterval(tick, 3000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const onSend = async (event: FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || busy) return;
    setBusy(true);
    setDraft("");
    try {
      const next = await sendPoleMessage({ data: { guestId: guestId.current, body } });
      apply(next);
    } catch {
      setDraft(body);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-5 pt-2" dir="ltr">
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-[11px] font-medium tracking-[0.38em] text-fg/45">THE POLE</p>
          <p className="flex items-center gap-2 font-display text-[11px] tracking-[0.18em] text-fg/55" aria-live="polite">
            <span className="size-1.5 rounded-full bg-signal" />
            {online} online
          </p>
        </div>
        <h1 className="mt-3 font-serif text-[2.35rem] leading-none text-fg">Live channel</h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-fg/65">
          Guest notes. Heavy swears are cut. Lines fade after {ttl} minutes.
        </p>
        <p className="mt-1 font-display text-[11px] tracking-[0.2em] text-fg/40">You are {alias}</p>
      </header>

      <div
        ref={scroller}
        className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-fg/45">No traffic yet. Leave a note.</p>
        ) : (
          messages.map((msg) => (
            <article
              key={msg.id}
              dir="ltr"
              className={`max-w-[82%] px-3.5 py-2.5 ${
                msg.mine
                  ? "ml-auto rounded-[1.15rem] rounded-br-md bg-fg/12"
                  : "mr-auto rounded-[1.15rem] rounded-bl-md bg-fg/[0.06]"
              }`}
            >
              <p className="font-display text-[10px] tracking-[0.2em] text-fg/40">
                {msg.mine ? "YOU" : msg.alias}
                <span className="ml-2 tabular-nums">{formatAge(msg.ageSec)}</span>
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-left text-[15px] leading-relaxed text-fg">
                {msg.body}
              </p>
            </article>
          ))
        )}
      </div>

      <form className="pole-composer shrink-0 py-3" onSubmit={onSend}>
        <label className="sr-only" htmlFor="pole-draft">
          Message
        </label>
        <input
          id="pole-draft"
          dir="ltr"
          className="glass-field min-w-0 flex-1 rounded-full"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a note…"
          maxLength={240}
          autoComplete="off"
          enterKeyHint="send"
        />
        <GlassButton
          type="submit"
          variant="icon"
          className="size-11 shrink-0"
          disabled={busy || !draft.trim()}
          aria-label="Send"
        >
          <ArrowUp className="size-4" strokeWidth={1.8} />
        </GlassButton>
      </form>
    </section>
  );
}

function formatAge(ageSec: number) {
  if (ageSec < 45) return "now";
  const m = Math.max(1, Math.round(ageSec / 60));
  return `${m}m`;
}
