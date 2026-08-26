import { useEffect, useState } from "react";

type KbState = {
  open: boolean;
  height: number;
  offsetTop: number;
};

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function fieldFocused() {
  const el = document.activeElement;
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

/**
 * Tracks the visual viewport so the desk can sit on top of the software
 * keyboard (iOS/Android) instead of leaving a dead strip above it.
 */
export function useVisualKeyboard(): KbState {
  const [state, setState] = useState<KbState>(() => ({
    open: false,
    height: typeof window === "undefined" ? 0 : window.innerHeight,
    offsetTop: 0,
  }));

  useEffect(() => {
    const vv = window.visualViewport;
    let raf = 0;
    const later: number[] = [];

    const read = () => {
      const focused = fieldFocused();
      const height = vv?.height ?? window.innerHeight;
      const offsetTop = focused ? 0 : (vv?.offsetTop ?? 0);
      const inset = Math.max(0, window.innerHeight - height - (vv?.offsetTop ?? 0));
      const open = (isMobile() && focused) || inset > 48;
      const nextHeight = open ? height : window.innerHeight;
      document.documentElement.classList.toggle("kb-open", open);
      if (open) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      setState((prev) => {
        if (
          prev.open === open &&
          Math.abs(prev.height - nextHeight) < 0.5 &&
          Math.abs(prev.offsetTop - offsetTop) < 0.5
        ) {
          return prev;
        }
        return { open, height: nextHeight, offsetTop };
      });
    };

    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };

    const onFocus = () => {
      on();
      later.push(window.setTimeout(on, 80), window.setTimeout(on, 280));
    };

    read();
    vv?.addEventListener("resize", on);
    vv?.addEventListener("scroll", on);
    window.addEventListener("focusin", onFocus);
    window.addEventListener("focusout", onFocus);
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      later.forEach((id) => window.clearTimeout(id));
      vv?.removeEventListener("resize", on);
      vv?.removeEventListener("scroll", on);
      window.removeEventListener("focusin", onFocus);
      window.removeEventListener("focusout", onFocus);
      window.removeEventListener("scroll", on);
      document.documentElement.classList.remove("kb-open");
    };
  }, []);

  return state;
}
