import { Play } from "lucide-react";
import type { BoardMedia } from "@/lib/x-posts";

type BoardMediaFrameProps = {
  kind: BoardMedia;
  duration?: string;
};

export function BoardMediaFrame({ kind, duration }: BoardMediaFrameProps) {
  const label = kind === "ir" || kind === "video" ? "IR" : kind === "radar" ? "RADAR" : "NV";

  return (
    <div className="relative mt-3 overflow-hidden rounded-xl bg-bg">
      <svg
        viewBox="0 0 320 200"
        className="aspect-16/10 h-auto w-full"
        aria-hidden="true"
      >
        <rect width="320" height="200" fill="#070708" />
        {kind === "radar" ? <RadarMark /> : null}
        {kind === "vlights" ? <VLights /> : null}
        {kind === "orb" || kind === "ir" || kind === "video" ? <Orb hot={kind !== "orb"} /> : null}
        <g opacity="0.12" stroke="#f3f3f1" strokeWidth="1">
          <line x1="0" y1="40" x2="320" y2="40" />
          <line x1="0" y1="80" x2="320" y2="80" />
          <line x1="0" y1="120" x2="320" y2="120" />
          <line x1="0" y1="160" x2="320" y2="160" />
        </g>
      </svg>
      <span className="pointer-events-none absolute top-2 left-2 font-display text-[0.65rem] font-medium tracking-kicker text-muted">
        {label}
      </span>
      {kind === "video" ? (
        <>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="glass grid size-11 place-items-center rounded-full">
              <Play className="size-4 fill-fg text-fg" strokeWidth={0} />
            </span>
          </div>
          <span className="pointer-events-none absolute right-2 bottom-2 font-display text-xs text-fg/80">
            {duration ?? "00:12"}
          </span>
        </>
      ) : null}
    </div>
  );
}

function Orb({ hot }: { hot: boolean }) {
  return (
    <g>
      <ellipse cx="160" cy="96" rx="54" ry="18" fill={hot ? "#c45c5c" : "#f3f3f1"} opacity="0.12" />
      <circle cx="160" cy="88" r="16" fill={hot ? "#e8a0a0" : "#f3f3f1"} opacity="0.85" />
      <circle cx="156" cy="84" r="6" fill="#fff" opacity="0.55" />
    </g>
  );
}

function VLights() {
  return (
    <g>
      <circle cx="96" cy="118" r="7" fill="#e2c48a" />
      <circle cx="160" cy="78" r="8" fill="#f0d7a4" />
      <circle cx="224" cy="118" r="7" fill="#e2c48a" />
      <path d="M96 118 L160 78 L224 118" fill="none" stroke="#e2c48a" strokeOpacity="0.35" strokeWidth="2" />
    </g>
  );
}

function RadarMark() {
  return (
    <g fill="none" stroke="#8e8e92" strokeWidth="1.2">
      <circle cx="160" cy="100" r="28" opacity="0.4" />
      <circle cx="160" cy="100" r="52" opacity="0.28" />
      <circle cx="160" cy="100" r="76" opacity="0.16" />
      <line x1="160" y1="18" x2="160" y2="182" opacity="0.2" />
      <line x1="24" y1="100" x2="296" y2="100" opacity="0.2" />
      <circle cx="214" cy="64" r="5" fill="#c45c5c" stroke="none" />
    </g>
  );
}
