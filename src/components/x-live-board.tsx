import { ExternalLink, Radio, RefreshCw } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import {
  credibilityOf,
  formatCount,
  type XFeedPost,
  X_FEED_ACCOUNTS,
  X_FEED_KEYWORDS,
} from "@/lib/x-feed";

type XLiveBoardProps = {
  posts: XFeedPost[];
  loading: boolean;
  source: "api" | "seed";
  lastRefresh: Date | null;
  onRefresh: () => void;
};

export function XLiveBoard({ posts, loading, source, lastRefresh, onRefresh }: XLiveBoardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-[11px] tracking-[0.28em] text-fg/45">
            {source === "api" ? "LIVE · X API" : "LIVE SNAPSHOT"}
          </p>
          <p className="mt-1 text-xs text-fg/50">
            {lastRefresh
              ? `Updated ${lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
              : "Waiting for first pull"}
            {" · "}
            auto every 5 min
          </p>
        </div>
        <GlassButton
          type="button"
          variant="chip"
          className="h-9 gap-2 px-3"
          disabled={loading}
          onClick={onRefresh}
          aria-label="Fetch latest posts"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.8} />
          {loading ? "Fetching…" : "Fetch latest"}
        </GlassButton>
      </div>

      <div className="glass-plain rounded-2xl px-3 py-2.5">
        <p className="font-display text-[10px] tracking-[0.22em] text-fg/40">WATCHING</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-fg/55">
          {X_FEED_ACCOUNTS.map((h) => `@${h}`).join(" · ")}
        </p>
        <p className="mt-2 font-display text-[10px] tracking-[0.22em] text-fg/40">KEYWORDS</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-fg/55">
          {X_FEED_KEYWORDS.join(" · ")}
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {posts.map((post) => {
          const cred = credibilityOf(post);
          const handle = (post.handle || "").replace(/^@/, "").trim();
          if (!handle || handle.toLowerCase() === "desk") return null;
          const name =
            post.name && post.name.replace(/^@/, "").toLowerCase() !== "desk"
              ? post.name.replace(/^@/, "")
              : handle;
          return (
            <li key={post.id}>
              <article className="glass-plain-strong rounded-2xl px-4 py-3.5">
                <header className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-[11px] font-medium tracking-[0.2em] text-fg/50">
                      @{handle}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-fg">{name}</p>
                  </div>
                  <p className="shrink-0 font-display text-[10px] tracking-[0.18em] text-fg/40">
                    {post.when}
                  </p>
                </header>
                <p className="mt-3 text-sm leading-relaxed text-fg/90">{post.text}</p>

                <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Meter
                    label="CREDIBILITY"
                    value={cred.overall}
                    hint={cred.label}
                    emphasize
                  />
                  <Meter
                    label="VIRALITY"
                    value={cred.virality}
                    hint={`${formatCount(post.likes)} likes · ${formatCount(post.reposts)} rt`}
                  />
                  <Meter
                    label="COMMENTS"
                    value={cred.comments}
                    hint={`${formatCount(post.replies)} replies scored`}
                  />
                  <Meter
                    label="EVIDENCE"
                    value={cred.evidence}
                    hint={post.hasMedia ? "Media + source trust" : "Source trust"}
                  />
                </dl>

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
                    href={post.url}
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

      {posts.length === 0 && !loading ? (
        <p className="py-8 text-center text-sm text-fg/45">Channel quiet — stand by for the next pull.</p>
      ) : null}
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
    <div className={`rounded-xl px-2.5 py-2 ${emphasize ? "glass-plain-strong" : "glass-plain"}`}>
      <p className="font-display text-[9px] tracking-[0.18em] text-fg/45">{label}</p>
      <p className="mt-1 font-display text-lg tabular-nums text-fg">{value}</p>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-fg/10">
        <div className="h-full rounded-full bg-fg/55" style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
      </div>
      <p className="mt-1 text-[10px] leading-tight text-fg/40">{hint}</p>
    </div>
  );
}
