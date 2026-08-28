import { DESK_HEADER } from "@/lib/tabs";

export type AccessVeil = {
  href: string;
  kicker: string;
  title: string;
  nonce: number;
};

export const ACCESS_MS = 520;

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$*<>/|";

export function scrambleGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "#";
}

export function accessCopy(href: string): { kicker: string; title: string } {
  const url = new URL(href, "https://truthpole.local");
  const path = url.pathname;
  if (path === "/archive") return { kicker: "ACCESSING ARCHIVE", title: "WORLD MAP" };
  const name = DESK_HEADER[path]?.name ?? "DESK";
  return { kicker: "ACCESSING DESK", title: name.toUpperCase() };
}
