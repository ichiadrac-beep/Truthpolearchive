/** Resolve a path against the current origin so OAuth returns to this site, not X. */
export function appUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).href;
}
