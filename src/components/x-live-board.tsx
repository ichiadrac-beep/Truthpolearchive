import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Eye, Radio, RefreshCw } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import { cn } from "@/lib/utils";
import {
  credibilityOf,
  formatCount,
  type XFeedPost,
  X_FEED_ACCOUNTS,
  X_FEED_KEYWORDS,
  X_FEED_REFRESH_MS,
} from "@/lib/x-feed";

type XLiveBoardProps = {
  posts: XFeedPost[];
  loading: boolean;
  hunting?: boolean;
  source: "api" | "seed";
  lastRefresh: Date | null;
  onRefresh: () => void;
};

export function XLiveBoard({
  posts,
  loading,
  hunting = false,
  source,
  lastRefresh,
  onRefresh,
}: XLiveBoardProps) {
  const acquiring = hunting || loading;
  const [watchOpen, setWatchOpen] = useState(false);
  const watchPanelId = useId();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <GlassButton
          type="button"
          variant="chip"
          className="h-9 gap-2 px-3"
          onClick={() => setWatchOpen((open) => !open)}
          aria-expanded={watchOpen}
          aria-controls={watchPanelId}
        >
          <Eye className="size-3.5" strokeWidth={1.8} />
          Watch list
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-150", watchOpen && "rotate-180")}
            strokeWidth={1.8}
          />
        </GlassButton>
        <GlassButton
          type="button"
          variant="chip"
          className="h-9 gap-2 px-3"
          disabled={acquiring}
          onClick={onRefresh}
          aria-label="Fetch latest posts"
        >
          <RefreshCw className={`size-3.5 ${acquiring ? "animate-spin" : ""}`} strokeWidth={1.8} />
          {hunting && !loading ? "Locking…" : loading ? "Fetching…" : "Fetch latest"}
        </GlassButton>
      </div>

      {watchOpen ? (
        <div id={watchPanelId} className="glass-plain rounded-2xl px-3 py-2.5">
          <p className="font-display text-[10px] tracking-[0.22em] text-fg/40">WATCHING</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-fg/55">
            {X_FEED_ACCOUNTS.map((h) => `@${h}`).join(" · ")}
          </p>
          <p className="mt-2 font-display text-[10px] tracking-[0.22em] text-fg/40">KEYWORDS</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-fg/55">
            {X_FEED_KEYWORDS.join(" · ")}
          </p>
          <p className="mt-2.5 text-[11px] leading-snug text-fg/45">
            Credibility scores are a desk heuristic from available engagement, links, and media — not
            official truth ratings.
          </p>
        </div>
      ) : null}

      <SignalMeter
        acquiring={acquiring}
        source={source}
        lastRefresh={lastRefresh}
        newest={posts[0]?.when}
      />

      <ul className="flex flex-col gap-3">
        {posts.map((post) => {
          const cred = credibilityOf(post);
          const handle = (post.handle || "").replace(/^@/, "").trim();
          if (!handle || handle.toLowerCase() === "desk") return null;
          const name =
            post.name && post.name.replace(/^@/, "").toLowerCase() !== "desk"
              ? post.name.replace(/^@/, "")
              : handle;
          const missingCounts = post.likes == null && post.reposts == null && post.replies == null;
          return (
            <li key={post.id}>
              <article className="glass-plain-strong rounded-2xl px-4 py-3.5">
                <header className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a
                      href={`https://x.com/${handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-display text-[13px] font-semibold tracking-[0.14em] text-fg"
                    >
                      @{handle}
                    </a>
                    <p className="mt-0.5 truncate text-sm text-fg/70">{name}</p>
                  </div>
                  <p className="shrink-0 font-display text-[10px] tracking-[0.18em] text-fg/40">
                    {post.when}
                  </p>
                </header>
                <p className="mt-3 text-sm leading-relaxed text-fg/90">{post.text}</p>

                <div className="mt-3 rounded-2xl bg-fg/6 px-3 py-2.5">
                  <Meter label="OVERALL" value={cred.overall} hint={cred.label} emphasize />
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <Meter
                      label="VIRALITY"
                      value={cred.virality}
                      hint={
                        missingCounts
                          ? "Counts pending"
                          : `${formatCount(post.likes)} likes · ${formatCount(post.reposts)} rt`
                      }
                    />
                    <Meter
                      label="COMMENTS"
                      value={cred.comments}
                      hint={missingCounts ? "Signal pending" : `${formatCount(post.replies)} replies`}
                    />
                    <Meter
                      label="EVIDENCE"
                      value={cred.evidence}
                      hint={post.hasMedia ? "Media + links" : "Source + links"}
                    />
                  </div>
                  <p className="mt-2 text-[10px] leading-snug text-fg/40">
                    Desk heuristic from engagement, links, and media — not an official truth rating.
                  </p>
                </div>

                <footer className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  {post.views != null ? (
                    <span className="font-display text-[10px] tracking-[0.16em] text-fg/40">
                      {formatCount(post.views)} views
                    </span>
                  ) : null}
                  {post.hasMedia ? (
                    <span className="inline-flex items-center gap-1 font-display text-[10px] tracking-[0.16em] text-fg/50">
                      <Radio className="size-3" strokeWidth={1.6} />
                      media
                    </span>
                  ) : null}
                  <a
                    href={post.url.startsWith("http") ? post.url : `https://x.com/${handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 font-display text-[10px] tracking-[0.18em] text-fg/70 underline decoration-fg/25 underline-offset-2"
                  >
                    Open on X
                    <ExternalLink className="size-3" strokeWidth={1.6} />
                  </a>
                </footer>
              </article>
            </li>
          );
        })}
      </ul>

      {posts.length === 0 ? (
        <p className="py-8 text-center text-sm text-fg/50">No posts matched the keyword filter.</p>
      ) : null}
    </div>
  );
}

function SignalMeter({
  acquiring,
  source,
  lastRefresh,
  newest,
}: {
  acquiring: boolean;
  source: "api" | "seed";
  lastRefresh: Date | null;
  newest?: string;
}) {
  const [bars, setBars] = useState(0);
  const [dbm, setDbm] = useState(-78);
  const [phase, setPhase] = useState<"search" | "lock" | "hold">("search");
  const reduceRef = useRef(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const later = (fn: () => void, ms: number) => {
      timer = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    if (acquiring) {
      setPhase("search");
      if (reduceRef.current) {
        setBars(1);
        setDbm(-84);
        return;
      }
      const hunt = () => {
        setBars(1 + Math.floor(Math.random() * 5));
        setDbm(-94 + Math.floor(Math.random() * 40));
        later(hunt, 55 + Math.floor(Math.random() * 95));
      };
      hunt();
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    const lockedBars = source === "api" ? 4 : 3;
    const lockedDb = source === "api" ? -47 - Math.floor(Math.random() * 10) : -61 - Math.floor(Math.random() * 9);

    if (reduceRef.current) {
      setPhase("hold");
      setBars(lockedBars);
      setDbm(lockedDb);
      return;
    }

    setPhase("lock");
    setBars(5);
    setDbm(lockedDb + 4);

    const idle = () => {
      const roll = Math.random();
      if (roll < 0.46) {
        setBars(Math.max(2, lockedBars - 1));
        setDbm(lockedDb - 6 - Math.floor(Math.random() * 7));
        later(() => {
          setBars(lockedBars);
          setDbm(lockedDb + Math.floor(Math.random() * 3) - 1);
          later(idle, 640 + Math.floor(Math.random() * 900));
        }, 80 + Math.floor(Math.random() * 70));
        return;
      }
      if (roll < 0.62 && lockedBars < 5) {
        setBars(5);
        setDbm(lockedDb + 3);
        later(() => {
          setBars(lockedBars);
          setDbm(lockedDb);
          later(idle, 720 + Math.floor(Math.random() * 900));
        }, 100 + Math.floor(Math.random() * 80));
        return;
      }
      later(idle, 700 + Math.floor(Math.random() * 1100));
    };

    later(() => {
      setPhase("hold");
      setBars(lockedBars);
      setDbm(lockedDb);
      later(idle, 800);
    }, 150);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [acquiring, source]);

  const status = acquiring
    ? "SEARCH"
    : phase === "lock"
      ? "LOCK"
      : bars <= 2
        ? "WEAK"
        : bars >= 5
          ? "FULL"
          : "LOCKED";
  const secs = Math.max(1, Math.round(X_FEED_REFRESH_MS / 1000));
  const locked = lastRefresh
    ? lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;
  const meta = acquiring
    ? `${dbm} dBm · no carrier · sweep`
    : [`${dbm} dBm`, source === "api" ? "live" : "snapshot", newest ? `newest ${newest}` : null, locked, `auto ${secs}s`]
        .filter(Boolean)
        .join(" · ");

  return (
    <div
      className={cn(
        "signal-meter",
        acquiring && "signal-meter-search",
        phase === "lock" && "signal-meter-lock",
      )}
      aria-label={acquiring ? "Acquiring intercept" : `Signal ${status.toLowerCase()}, ${Math.max(bars, 0)} of 5`}
    >
      <div className="signal-meter-head">
        <p className="signal-meter-label">SIGNAL</p>
        <p className="signal-glyphs" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < bars ? "is-on" : "is-off"}>
              {i < bars ? "▮" : "▯"}
            </span>
          ))}
        </p>
        <p className="signal-status">{status}</p>
      </div>
      <p className="signal-meter-meta">{meta}</p>
    </div>
  );
}

function Meter({
  label,
  value,
  hint,
  emphasize,
}: {
  label: string;
  value: number;
  hint: string;
  emphasize?: boolean;
}) {
  return (
    <div className={emphasize ? "" : "min-w-0"}>
      <dt className="font-display text-[10px] tracking-[0.16em] text-fg/45">{label}</dt>
      <div className={emphasize ? "flex items-baseline gap-2" : ""}>
        <dd className={`mt-0.5 leading-none text-fg ${emphasize ? "font-serif text-2xl" : "font-serif text-base"}`}>
          {value}
        </dd>
        {emphasize ? (
          <span className="font-display text-[10px] tracking-[0.18em] text-fg/50">{hint}</span>
        ) : null}
      </div>
      <div className="mt-1.5 h-0.5 rounded-full bg-fg/15">
        <div
          className="h-0.5 rounded-full bg-fg/75"
          style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
        />
      </div>
      {!emphasize ? <p className="mt-1 text-[10px] leading-tight text-fg/40">{hint}</p> : null}
    </div>
  );
}
