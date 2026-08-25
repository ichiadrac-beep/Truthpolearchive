import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FilePlus2, X } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import { WitnessForm } from "@/components/witness-form";
import { XLiveBoard } from "@/components/x-live-board";
import type { FilingRow } from "@/lib/desk-api";
import {
  fetchXFeed,
  X_FEED_REFRESH_MS,
  type XFeedPost,
} from "@/lib/x-feed";

export const Route = createFileRoute("/_desk/x-files")({
  component: XFilesPage,
});

function XFilesPage() {
  const [posts, setPosts] = useState<XFeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "seed">("seed");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pending, setPending] = useState<FilingRow[]>([]);
  const timer = useRef<number | null>(null);
  const formAnchor = useRef<HTMLDivElement>(null);

  const pull = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchXFeed();
      setPosts(result.posts);
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
    }, X_FEED_REFRESH_MS);
    return () => {
      if (timer.current != null) window.clearInterval(timer.current);
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
    if (formOpen) {
      formAnchor.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [formOpen]);

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 pt-2 pb-6">
      <p className="font-display text-xs font-medium tracking-kicker text-muted">
        X-FILES · LIVE
      </p>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">
        Live X feed
      </h1>
      <p className="max-w-prose text-sm leading-normal text-muted">
        Live posts from UAP accounts on X, including @Truthpole. Tap Submit an encounter to file a
        report. Fetch latest reloads the feed.
      </p>

      <div className="flex flex-wrap gap-2">
        <GlassButton
          type="button"
          variant="chip"
          className="h-10 gap-2 px-4"
          onClick={() => setFormOpen(true)}
          aria-expanded={formOpen}
          aria-controls="encounter-form"
        >
          <FilePlus2 className="size-3.5" strokeWidth={1.8} />
          Submit an encounter
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
          className="glass-plain-strong relative flex flex-col gap-3 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[11px] tracking-[0.28em] text-fg/50">
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
            }}
            onCancel={() => setFormOpen(false)}
          />
        </div>
      ) : null}

      <XLiveBoard
        posts={posts}
        loading={loading}
        source={source}
        lastRefresh={lastRefresh}
        onRefresh={() => void pull()}
      />
    </section>
  );
}
