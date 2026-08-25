const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function unescapeOnce(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (_full, body: string) => {
    const key = body.toLowerCase();
    if (NAMED[key]) return NAMED[key];
    if (key.startsWith("#x")) {
      const n = Number.parseInt(key.slice(2), 16);
      return Number.isFinite(n) ? String.fromCodePoint(n) : " ";
    }
    if (key.startsWith("#")) {
      const n = Number.parseInt(key.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : " ";
    }
    return " ";
  });
}

export function stripMarkup(raw: string) {
  let text = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  for (let i = 0; i < 3; i += 1) text = unescapeOnce(text);
  text = text.replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/https?:\/\/\S+/gi, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

export function cleanUrl(raw: string) {
  let text = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  for (let i = 0; i < 3; i += 1) text = unescapeOnce(text);
  text = text.replace(/<[^>]+>/g, " ").trim();
  const match = text.match(/https?:\/\/[^\s"'<>]+/);
  return match ? match[0] : "";
}

export function clipWords(value: string, max: number) {
  if (value.length <= max) return value;
  const cut = value.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return `${(at > 48 ? cut.slice(0, at) : cut).trim()}…`;
}

export function cleanTitle(raw: string) {
  return clipWords(stripMarkup(raw).replace(/\s+[-–|]\s+[^–|-]+$/, "").trim(), 140);
}

export function cleanLede(raw: string, title: string) {
  let text = stripMarkup(raw);
  if (!text) return "";
  const lowerTitle = title.trim().toLowerCase();
  if (lowerTitle && text.toLowerCase().startsWith(lowerTitle)) {
    text = text.slice(title.trim().length).replace(/^[-–|:.,\s]+/, "").trim();
  }
  const compact = text.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const titleKey = lowerTitle.replace(/[^a-z0-9]+/g, "");
  if (titleKey && (compact === titleKey || titleKey.includes(compact))) return "";
  if (/href=|target=|_blank|javascript:/i.test(text)) return "";
  if (text.length < 50 && !/[.!?']/.test(text)) return "";
  if (text.length < 28) return "";
  return clipWords(text, 180);
}
