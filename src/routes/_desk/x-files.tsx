import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FilePlus2, Images, X } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import { SightingsBoard } from "@/components/sightings-board";
import { WitnessForm } from "@/components/witness-form";
import { XLiveBoard } from "@/components/x-live-board";
import type { FilingRow } from "@/lib/desk-api";
import {
  fetchXFeed,
  recentXPosts,
  X_FEED_REFRESH_MS,
  type XFeedPost,
} from "@/lib/x-feed";

export const Route = createFileRoute("/_desk/x-files")({
  component: XFilesPage,
});

function XFilesPage() {
  const [posts, setPosts] = useState<XFeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hunting, setHunting] = useState(false);
  const [source, setSource] = useState<"api" | "seed">("seed");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [pending, setPending] = useState<FilingRow[]>([]);
  const timer = useRef<number | null>(null);
  const busy = useRef(false);
  const formAnchor = useRef<HTMLDivElement>(null);

  const pull = useCallback(async (opts?: { hunt?: boolean; silent?: boolean }) => {
    if (busy.current) return;
    busy.current = true;
    try {
      if (opts?.hunt) {
        setHunting(true);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce) {
          await new Promise((resolve) => {
            window.setTimeout(resolve, 520 + Math.floor(Math.random() * 240));
          });
        }
      }
      if (!opts?.silent) setLoading(true);
      const result = await fetchXFeed();
      setPosts(recentXPosts(result.posts));
      setSource(result.source);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
      setHunting(false);
      busy.current = false;
    }
  }, []);

  useEffect(() => {
    void pull();
    const tick = () => {
      if (document.hidden) return;
      void pull({ silent: true });
    };
    timer.current = window.setInterval(tick, X_FEED_REFRESH_MS);
    const onVis = () => {
      if (!document.hidden) void pull({ silent: true });
    };
    window.addEventListener("focus", onVis);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (timer.current != null) window.clearInterval(timer.current);
      window.removeEventListener("focus", onVis);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pull]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("truthpole-filings-v2");
      if (!raw) return;
      const parsed = JSON.parse(raw) as FilingRow[];
      if (Array.isArray(parsed)) {
        setPending(parsed.filter((f) => f.status === "pending"));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (formOpen || boardOpen) {
      formAnchor.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [formOpen, boardOpen]);

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 pt-2 pb-6">
      <p className="font-display text-xs font-medium tracking-kicker text-muted">
        X-FILES · LIVE
      </p>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
        Live X feed
      </h1>
      <p className="max-w-prose text-sm leading-normal text-muted">
        Live posts from the last 36 hours, newest first. Watched UAP, disclosure, and
        psionic accounts refresh every few seconds while this desk is open.
      </p>

      <div className="flex flex-wrap gap-2">
        <GlassButton
          type="button"
          variant="chip"
          className="h-10 gap-2 px-4"
          onClick={() => {
            setFormOpen(true);
            setBoardOpen(false);
          }}
          aria-expanded={formOpen}
          aria-controls="encounter-form"
        >
          <FilePlus2 className="size-3.5" strokeWidth={1.8} />
          Submit an encounter
        </GlassButton>
        <GlassButton
          type="button"
          variant="chip"
          className="h-10 gap-2 px-4"
          onClick={() => {
            setBoardOpen(true);
            setFormOpen(false);
          }}
          aria-expanded={boardOpen}
          aria-controls="witness-files"
        >
          <Images className="size-3.5" strokeWidth={1.8} />
          Witness files
        </GlassButton>
        {pending.length > 0 ? (
          <p className="self-center font-display text-[10px] tracking-[0.18em] text-fg/45">
            {pending.length} pending review
          </p>
        ) : null}
      </div>

      {formOpen ? (
        <div
          id="encounter-form"
          ref={formAnchor}
          className="glass-sheet relative flex flex-col gap-3 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[11px] tracking-[0.28em] text-fg/70">
              SUBMIT AN ENCOUNTER
            </p>
            <GlassButton
              type="button"
              variant="icon"
              className="size-9 shrink-0"
              aria-label="Close form"
              onClick={() => setFormOpen(false)}
            >
              <X className="size-4" strokeWidth={1.8} />
            </GlassButton>
          </div>
          <WitnessForm
            onFiled={(item) => {
              setPending((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
              setFormOpen(false);
              if (item.imageData || item.videoData) setBoardOpen(true);
            }}
            onCancel={() => setFormOpen(false)}
          />
        </div>
      ) : null}

      {boardOpen ? (
        <div
          id="witness-files"
          ref={formAnchor}
          className="glass-sheet relative flex max-h-[70dvh] min-h-[18rem] flex-col gap-3 overflow-hidden rounded-2xl p-4"
        >
          <div className="flex shrink-0 items-center justify-between gap-3">
            <div>
              <p className="font-display text-[11px] tracking-[0.28em] text-fg/70">WITNESS FILES</p>
              <p className="mt-1 text-xs text-fg/45">Guest photos and video. Like or note each file.</p>
            </div>
            <GlassButton
              type="button"
              variant="icon"
              className="size-9 shrink-0"
              aria-label="Close witness files"
              onClick={() => setBoardOpen(false)}
            >
              <X className="size-4" strokeWidth={1.8} />
            </GlassButton>
          </div>
          <SightingsBoard />
        </div>
      ) : null}

      <XLiveBoard
        posts={posts}
        loading={loading}
        hunting={hunting}
        source={source}
        lastRefresh={lastRefresh}
        onRefresh={() => void pull({ hunt: true })}
      />
    </section>
  );
}
