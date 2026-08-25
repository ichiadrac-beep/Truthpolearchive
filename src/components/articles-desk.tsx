import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, RefreshCw, Share2 } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import {
  ARTICLES_REFRESH_MS,
  fetchArticles,
  xShareHref,
  type DeskArticle,
} from "@/lib/articles";

export function ArticlesDesk() {
  const [articles, setArticles] = useState<DeskArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"live" | "seed">("seed");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const timer = useRef<number | null>(null);

  const pull = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchArticles();
      setArticles(result.articles);
      setSource(result.source);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void pull();
    timer.current = window.setInterval(() => {
      void pull();
    }, ARTICLES_REFRESH_MS);
    return () => {
      if (timer.current != null) window.clearInterval(timer.current);
    };
  }, [pull]);

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 pt-2 pb-6">
      <p className="font-display text-xs font-medium tracking-kicker text-muted">ARTICLES · WIRE</p>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">Ufology desk</h1>
      <p className="max-w-prose text-sm leading-normal text-muted">
        Recent readable pieces on UFO, UAP, and related claims from news desks, Reddit, X, Facebook,
        and the Daily Mail. Reloads every 5 minutes. Share opens a draft on your X account.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[11px] tracking-[0.22em] text-fg/45">
          {source === "live" ? "LIVE WIRE" : "SNAPSHOT"}
          {lastRefresh
            ? ` · ${lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : ""}
        </p>
        <GlassButton
          type="button"
          variant="chip"
          className="h-10 gap-2 px-4"
          disabled={loading}
          onClick={() => void pull()}
          aria-label="Fetch latest articles"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.8} />
          {loading ? "Fetching…" : "Fetch latest"}
        </GlassButton>
      </div>

      <ul className="flex flex-col gap-3">
        {articles.map((article) => (
          <li key={article.id} className="min-w-0">
            <article className="glass-plain-strong min-w-0 overflow-hidden rounded-2xl px-4 py-3.5">
              <header className="flex items-start justify-between gap-3">
                <p className="min-w-0 truncate font-display text-[11px] tracking-[0.2em] text-fg/50">
                  {article.source}
                  {article.outlet && article.outlet !== article.source ? ` · ${article.outlet}` : ""}
                </p>
                <p className="shrink-0 font-display text-[10px] tracking-[0.16em] text-fg/40">
                  {article.when}
                </p>
              </header>
              <h2 className="mt-2 break-words text-[15px] font-medium leading-snug text-fg">
                {article.title}
              </h2>
              {article.lede ? (
                <p className="mt-2 line-clamp-3 break-words text-sm leading-relaxed text-fg/65">
                  {article.lede}
                </p>
              ) : null}
              <footer className="mt-3 flex min-w-0 flex-wrap gap-2">
                <GlassButton variant="chip" className="h-10 gap-2 px-4" asChild>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read
                    <ExternalLink className="size-3.5" strokeWidth={1.7} />
                  </a>
                </GlassButton>
                <GlassButton variant="chip" className="h-10 gap-2 px-4" asChild>
                  <a href={xShareHref(article)} target="_blank" rel="noopener noreferrer">
                    <Share2 className="size-3.5" strokeWidth={1.7} />
                    Share to X
                  </a>
                </GlassButton>
              </footer>
            </article>
          </li>
        ))}
      </ul>

      {articles.length === 0 && !loading ? (
        <p className="py-8 text-center text-sm text-fg/50">No articles on the wire yet.</p>
      ) : null}
    </section>
  );
}
