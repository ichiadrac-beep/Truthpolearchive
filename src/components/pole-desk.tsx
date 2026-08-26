import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, UserPlus } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import { PoleInvitePanel } from "@/components/pole-invite-panel";
import { displayPoleBody } from "@/lib/censor";
import { listPoleMessages, sendPoleMessage, type PoleMessage } from "@/lib/desk-api";
import { getGuestId, guestAlias } from "@/lib/guest-id";
import { authClient, authEnabled } from "@/lib/auth/client";
import { openOAuthTab, startOAuth } from "@/lib/start-oauth";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  accountChatName,
  formatScifBadge,
  getAnonPref,
  getGraphicFilterPref,
  getScifClearance,
  saveAnonPref,
  saveGraphicFilterPref,
  stampScifVisit,
  type ScifClearance,
} from "@/lib/scif";
import { useVisualKeyboard } from "@/lib/use-visual-keyboard";
import { cn } from "@/lib/utils";

export function PoleDesk() {
  const guestId = useRef("guest-preview");
  const { user } = useCurrentUserState();
  const sessionUser = authClient.useSession().data?.user as
    | { username?: string | null; name?: string | null }
    | undefined;
  const xName = accountChatName(
    user ? { ...user, username: sessionUser?.username ?? null } : null,
  );
  const [alias, setAlias] = useState("GUEST");
  const [anon, setAnon] = useState(false);
  const [graphic, setGraphic] = useState(true);
  const [scif, setScif] = useState<ScifClearance>(() => getScifClearance());
  const [online, setOnline] = useState(0);
  const [ttl, setTtl] = useState(6);
  const [messages, setMessages] = useState<PoleMessage[]>([]);
  const [standby, setStandby] = useState(false);
  const [onDuty, setOnDuty] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [xBusy, setXBusy] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const kb = useVisualKeyboard();

  const apply = (payload: { online: number; ttlMin: number; messages: PoleMessage[] }) => {
    setOnline(Math.max(0, payload.online));
    setTtl(payload.ttlMin || 6);
    setMessages(Array.isArray(payload.messages) ? payload.messages : []);
  };

  useEffect(() => {
    guestId.current = getGuestId();
    setAlias(guestAlias(guestId.current));
    setAnon(getAnonPref());
    setGraphic(getGraphicFilterPref());
    setScif(stampScifVisit());
    try {
      sessionStorage.setItem("truthpole-pole-duty", "1");
      setOnDuty(true);
    } catch {
      setOnDuty(true);
    }
    let alive = true;
    let misses = 0;
    const tick = async () => {
      if (typeof document !== "undefined" && document.hidden) return;
      try {
        const next = await listPoleMessages({ data: { guestId: guestId.current } });
        if (!alive) return;
        misses = 0;
        setStandby(false);
        apply(next);
      } catch {
        if (!alive) return;
        misses += 1;
        if (misses >= 2) setStandby(true);
      }
    };
    void tick();
    const id = window.setInterval(tick, 4000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, kb.open]);

  const publicName = anon ? "ANON" : xName || alias;

  const onSend = async (event: FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || busy) return;
    setBusy(true);
    setDraft("");
    if (fieldRef.current) fieldRef.current.style.height = "48px";
    try {
      const next = await sendPoleMessage({
        data: {
          guestId: guestId.current,
          body,
          anon,
          displayName: xName,
          scif,
        },
      });
      setStandby(false);
      apply(next);
    } catch {
      setStandby(true);
      setDraft(body);
    } finally {
      setBusy(false);
      fieldRef.current?.focus();
    }
  };

  const onDraftKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const fitDraft = (el: HTMLTextAreaElement) => {
    el.style.height = "48px";
    el.style.height = `${Math.min(96, el.scrollHeight)}px`;
  };

  const toggleAnon = () => {
    const next = !anon;
    setAnon(next);
    saveAnonPref(next);
  };

  const toggleGraphic = () => {
    const next = !graphic;
    setGraphic(next);
    saveGraphicFilterPref(next);
  };

  const connectX = () => {
    const tab = openOAuthTab();
    setXBusy(true);
    void startOAuth("grok-x", "/the-pole", "/the-pole", tab).catch(() => {
      setXBusy(false);
    });
  };

  return (
    <section
      className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-5 pt-3"
      dir="ltr"
      lang="en"
      style={{ paddingBottom: kb.open ? 8 : undefined }}
    >
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-[11px] font-medium tracking-[0.38em] text-fg/45">THE POLE</p>
          <p className="flex items-center gap-2 font-display text-[11px] tracking-[0.18em] text-fg/55" aria-live="polite">
            <span className={`size-1.5 rounded-full ${standby ? "bg-fg/35" : "bg-signal/80"}`} />
            {standby ? "Stand by" : online > 1 ? `${online} viewing` : onDuty ? "On duty" : "Viewing"}
          </p>
        </div>
        {kb.open ? (
          <p className="mt-2 font-display text-[11px] tracking-[0.16em] text-fg/55">
            {publicName} · {formatScifBadge(scif)}
          </p>
        ) : (
          <>
            <h1 className="mt-3 font-serif text-[2.2rem] leading-none text-fg">Live channel</h1>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-fg/65">
              Guest notes. Hard swears are cut on send. Lines fade after {ttl} minutes.
            </p>
            <p className="mt-2 font-display text-[11px] tracking-[0.16em] text-fg/55">
              You are {publicName} · {formatScifBadge(scif)} · {scif.days}{" "}
              {scif.days === 1 ? "day" : "days"}
            </p>
          </>
        )}
      </header>

      <div
        ref={scroller}
        className="mt-4 min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain"
        aria-live="polite"
        dir="ltr"
      >
        {messages.length === 0 ? (
          <p className="px-1 py-8 text-center text-sm leading-relaxed text-fg/45">
            Channel quiet — stand by.
          </p>
        ) : (
          messages.map((msg) => (
            <article
              key={msg.id}
              dir="ltr"
              lang="en"
              className={`pole-bubble max-w-[82%] px-3.5 py-2.5 ${
                msg.mine
                  ? "glass-strong ml-auto rounded-[1.35rem] rounded-br-md"
                  : "glass mr-auto rounded-[1.35rem] rounded-bl-md"
              }`}
            >
              <p className="font-display text-[10px] tracking-[0.16em] text-fg/40">
                {msg.mine ? `YOU · ${msg.alias}` : msg.alias}
                {" · "}
                <span className="text-fg/55">{msg.scifCode}</span>
                {" · "}
                <span className="tabular-nums">{formatAge(msg.ageSec)}</span>
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-fg">
                {displayPoleBody(msg.body, graphic)}
              </p>
            </article>
          ))
        )}
      </div>

      <form
        className="shrink-0 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        onSubmit={onSend}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        action="."
        method="post"
        dir="ltr"
      >
        {kb.open ? null : (
          <div className="flex flex-wrap gap-2">
            <GlassButton
              variant="chip"
              className={cn("h-10 touch-manipulation", anon && "glass-strong")}
              aria-pressed={anon}
              onClick={toggleAnon}
            >
              Anon
            </GlassButton>
            <GlassButton
              variant="chip"
              className={cn("h-10 touch-manipulation", graphic && "glass-strong")}
              aria-pressed={graphic}
              onClick={toggleGraphic}
            >
              Filter graphic
            </GlassButton>
            <GlassButton
              variant="chip"
              className={cn("h-10 gap-2 touch-manipulation", inviteOpen && "glass-strong")}
              aria-pressed={inviteOpen}
              aria-expanded={inviteOpen}
              onClick={() => setInviteOpen((v) => !v)}
            >
              <UserPlus className="size-3.5" strokeWidth={1.7} />
              Invite
            </GlassButton>
            {authEnabled && !xName ? (
              <GlassButton
                variant="chip"
                className="h-10 touch-manipulation"
                disabled={xBusy}
                onClick={connectX}
              >
                {xBusy ? "Waiting for X…" : "Sign in with X"}
              </GlassButton>
            ) : null}
          </div>
        )}
        {xBusy && !kb.open ? (
          <p className="mt-2 text-[12px] leading-relaxed text-fg/50">
            Stay in Chrome or Safari. If the X app opens, tap ⋮ → Open in browser. Keep this page.
          </p>
        ) : null}
        {kb.open ? null : (
          <p className="mt-2.5 font-display text-[11px] tracking-[0.18em] text-fg/40">
            {anon ? `Posting as ANON · ${scif.code}` : `Posting as ${publicName} · ${scif.code}`}
          </p>
        )}
        <div className="pole-composer mt-2.5">
          <label className="sr-only" htmlFor="pole-draft">
            Message
          </label>
          <textarea
            ref={fieldRef}
            id="pole-draft"
            name="pole_note"
            dir="ltr"
            lang="en"
            rows={1}
            inputMode="text"
            enterKeyHint="send"
            autoComplete="off"
            autoCorrect="on"
            autoCapitalize="sentences"
            spellCheck
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            className="glass-field min-w-0 flex-1"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              fitDraft(e.target);
            }}
            onKeyDown={onDraftKey}
            onFocus={() => {
              setInviteOpen(false);
              window.setTimeout(() => {
                scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
                fieldRef.current?.scrollIntoView({ block: "end" });
              }, 50);
            }}
            placeholder={anon ? "Write as ANON…" : xName ? `Write as ${xName}…` : "Write a note…"}
            maxLength={240}
          />
          <GlassButton
            type="submit"
            variant="icon"
            className="glass-strong size-12 shrink-0 touch-manipulation"
            disabled={busy || !draft.trim()}
            aria-label="Send"
          >
            <ArrowUp className="size-4" strokeWidth={1.8} />
          </GlassButton>
        </div>
      </form>

      <PoleInvitePanel open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </section>
  );
}

function formatAge(ageSec: number) {
  if (ageSec < 45) return "now";
  const m = Math.max(1, Math.round(ageSec / 60));
  return `${m}m`;
}
