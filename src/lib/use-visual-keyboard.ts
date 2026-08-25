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

    const read = () => {
      const height = vv?.height ?? window.innerHeight;
      const offsetTop = vv?.offsetTop ?? 0;
      const inset = Math.max(0, window.innerHeight - height - offsetTop);
      const open = inset > 64 || (isMobile() && fieldFocused() && inset > 20);
      document.documentElement.classList.toggle("kb-open", open);
      setState((prev) => {
        if (
          prev.open === open &&
          Math.abs(prev.height - height) < 0.5 &&
          Math.abs(prev.offsetTop - offsetTop) < 0.5
        ) {
          return prev;
        }
        return { open, height, offsetTop };
      });
    };

    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };

    read();
    vv?.addEventListener("resize", on);
    vv?.addEventListener("scroll", on);
    window.addEventListener("focusin", on);
    window.addEventListener("focusout", on);
    return () => {
      cancelAnimationFrame(raf);
      vv?.removeEventListener("resize", on);
      vv?.removeEventListener("scroll", on);
      window.removeEventListener("focusin", on);
      window.removeEventListener("focusout", on);
      document.documentElement.classList.remove("kb-open");
    };
  }, []);

  return state;
}
