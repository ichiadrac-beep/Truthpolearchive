import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "truthpole-typed-titles";
const seen = new Set<string>();
const claimed = new Set<string>();
let hydrated = false;

function hydrateSeen() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const ids = JSON.parse(raw) as unknown;
    if (!Array.isArray(ids)) return;
    for (const id of ids) {
      if (typeof id === "string" && id) seen.add(id);
    }
  } catch {
    /* private mode */
  }
}

function persistSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
  } catch {
    /* private mode */
  }
}

function titleAlreadyTyped(id: string) {
  hydrateSeen();
  return seen.has(id);
}

function markTitleTyped(id: string) {
  hydrateSeen();
  if (seen.has(id)) return;
  seen.add(id);
  persistSeen();
}

/** First caller animates; everyone else after that stays static. */
function claimTitleType(id: string) {
  hydrateSeen();
  if (seen.has(id) || claimed.has(id)) return false;
  claimed.add(id);
  return true;
}

const pending = new Map<Element, () => void>();
let sharedIo: IntersectionObserver | null = null;

function sharedObserver() {
  if (sharedIo) return sharedIo;
  sharedIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const hit = pending.get(entry.target);
        if (!hit) continue;
        pending.delete(entry.target);
        sharedIo?.unobserve(entry.target);
        hit();
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
  );
  return sharedIo;
}

function watchInView(el: Element, onHit: () => void) {
  pending.set(el, onHit);
  sharedObserver().observe(el);
}

function unwatch(el: Element) {
  pending.delete(el);
  sharedIo?.unobserve(el);
}

type TypeOutTitleProps = {
  id: string;
  text: string;
  className?: string;
};

export function TypeOutTitle({ id, text, className }: TypeOutTitleProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(() =>
    typeof window !== "undefined" && titleAlreadyTyped(id) ? text : "",
  );
  const [done, setDone] = useState(
    () => typeof window !== "undefined" && titleAlreadyTyped(id),
  );

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    if (titleAlreadyTyped(id)) {
      setShown(text);
      setDone(true);
      return;
    }

    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let timer = 0;
    let playing = false;

    const finish = () => {
      setShown(text);
      setDone(true);
      markTitleTyped(id);
    };

    const play = () => {
      if (playing) return;
      playing = true;
      if (!claimTitleType(id) || reduce || text.length === 0) {
        finish();
        return;
      }
      const per = Math.round(Math.min(38, Math.max(18, 480 / Math.max(text.length, 1))));
      let i = 0;
      const tick = () => {
        i += 1;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          finish();
          return;
        }
        timer = window.setTimeout(tick, per);
      };
      tick();
    };

    watchInView(el, play);
    return () => {
      unwatch(el);
      if (timer) window.clearTimeout(timer);
      if (playing) markTitleTyped(id);
    };
  }, [id, text]);

  return (
    <span
      ref={hostRef}
      className={cn("type-out-title", done && "type-out-title-done", className)}
      aria-label={text}
    >
      <span className="type-out-sizer" aria-hidden="true">
        {text}
      </span>
      <span className="type-out-live" aria-hidden="true">
        {shown}
        {shown.length > 0 && !done ? <span className="type-out-caret" /> : null}
      </span>
    </span>
  );
}
