import { BoardMediaFrame } from "@/components/board-media";
import { GlassButton } from "@/components/glass-button";
import type { FilingRow } from "@/lib/desk-api";
import { BOARD_POSTS, credibilityOf, type BoardPost } from "@/lib/x-posts";

export function WitnessBoard({
  pending,
  approved = [],
  posts = BOARD_POSTS,
  onReview,
}: {
  pending: FilingRow[];
  approved?: FilingRow[];
  posts?: BoardPost[];
  onReview?: (id: string, status: "approved" | "held") => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {pending.length > 0 ? (
        <section aria-label="Held for review" className="flex flex-col gap-2">
          <h2 className="font-display text-xs font-medium tracking-kicker text-signal">HELD FOR REVIEW</h2>
          {pending.map((filing) => (
            <FilingCard key={filing.id} filing={filing} onReview={onReview} />
          ))}
        </section>
      ) : null}

      {approved.map((filing) => (
        <FilingCard key={filing.id} filing={filing} published />
      ))}

      {posts.map((post, i) => {
        const cred = credibilityOf(post);
        return (
          <article key={post.id} className="glass-plain rounded-2xl px-4 py-3">
            <header className="flex items-baseline justify-between gap-3">
              <p className="text-[12px] tracking-wide text-fg/45">
                XF-{String(i + 1).padStart(3, "0")} · @{post.handle}
              </p>
              <p className="text-xs text-fg/40">{post.when}</p>
            </header>
            <p className="mt-2 text-[15px] leading-relaxed text-fg/90">{post.text}</p>
            {post.media ? <BoardMediaFrame kind={post.media} duration={post.duration} /> : null}
            <dl className="mt-3 grid grid-cols-3 gap-2">
              <Meter label="Validity" value={post.validity ?? 62} hint="How well the claim is sourced" />
              <Meter label="Virality" value={post.virality ?? 45} hint="Reach on the board" />
              <Meter
                label="Credibility"
                value={cred}
                hint={`Evidence ${post.evidence} · belief ${post.belief}`}
              />
            </dl>
          </article>
        );
      })}
    </div>
  );
}

function FilingCard({
  filing,
  published,
  onReview,
}: {
  filing: FilingRow;
  published?: boolean;
  onReview?: (id: string, status: "approved" | "held") => void;
}) {
  return (
    <article className="glass-plain-strong rounded-2xl px-4 py-3">
      <p className="font-display text-xs font-medium tracking-kicker text-signal">
        {published ? "GUEST · CLEARED" : "PENDING"}
      </p>
      <p className="mt-1 font-display text-base font-semibold tracking-tight text-fg">{filing.title}</p>
      <p className="mt-1 text-sm text-muted">
        {[filing.location, filing.incidentDate].filter(Boolean).join(" · ") || "No place or date"}
      </p>
      <p className="mt-2 text-sm leading-normal text-fg/90">{filing.description}</p>
      {filing.extra ? <p className="mt-2 text-sm leading-normal text-fg/70">{filing.extra}</p> : null}
      {filing.imageData ? (
        <img src={filing.imageData} alt="" className="mt-3 max-h-52 w-full rounded-xl object-cover" />
      ) : filing.imageName ? (
        <p className="mt-2 text-xs text-fg/45">Image attached: {filing.imageName}</p>
      ) : null}
      {filing.videoData ? (
        <video src={filing.videoData} controls className="mt-3 w-full rounded-xl" />
      ) : filing.videoName ? (
        <p className="mt-2 text-xs text-fg/45">Video attached: {filing.videoName}</p>
      ) : null}
      {onReview && filing.status === "pending" ? (
        <div className="mt-3 flex gap-2">
          <GlassButton variant="chip" className="h-9 px-3" onClick={() => onReview(filing.id, "approved")}>
            Publish
          </GlassButton>
          <GlassButton variant="ghost" className="h-9 px-3" onClick={() => onReview(filing.id, "held")}>
            Hold
          </GlassButton>
        </div>
      ) : null}
    </article>
  );
}

function Meter({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-xl bg-fg/6 px-2 py-2">
      <dt className="font-display text-[10px] tracking-[0.18em] text-fg/45">{label}</dt>
      <dd className="mt-1 font-serif text-lg leading-none text-fg">{value}</dd>
      <div className="mt-1.5 h-px bg-fg/15">
        <div className="h-px bg-fg/70" style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
      </div>
      <p className="mt-1 text-[10px] leading-tight text-fg/40">{hint}</p>
    </div>
  );
}
