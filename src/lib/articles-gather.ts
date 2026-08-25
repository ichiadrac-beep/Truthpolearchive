import { ARTICLE_SEED, sanitizeArticles, type DeskArticle } from "@/lib/articles";
import { cleanLede, cleanTitle, cleanUrl, stripMarkup } from "@/lib/articles-text";

const KEEP =
  /\b(ufo|uaps?|ufology|extraterrestrial|non-human|nhi|whistleblower|aaro|pursue|disclosure|alien|flying saucer|unidentified (aerial|anomalous)|crash retrieval|orb)\b/i;
const SKIP =
  /\b(slot|casino|free spins|nasdaq|etf|ufo catcher|art gallery|cavefish|demon creature|brad pitt|ufo house|\bep\b|debut ep|new single|sugbu|chapter completes|hyundai|ioniq|suv|ice cream|burger|backpack|jack in the box|ceramicSpeed|topnotcher)\b/i;

const FEEDS: { url: string; source: string; outlet?: string }[] = [
  {
    url: "https://news.google.com/rss/search?q=UFO%20OR%20UAP%20OR%20ufology%20OR%20%22unidentified%20anomalous%22&hl=en-US&gl=US&ceid=US:en",
    source: "News",
  },
  {
    url: "https://www.dailymail.co.uk/sciencetech/index.rss",
    source: "Daily Mail",
    outlet: "Daily Mail",
  },
  {
    url: "https://news.google.com/rss/search?q=site:facebook.com+(UFO%20OR%20UAP%20OR%20ufology)&hl=en-US&gl=US&ceid=US:en",
    source: "Facebook",
    outlet: "Facebook",
  },
];

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return match ? match[1] : "";
}

function formatWhen(raw: string) {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function slugId(url: string, title: string) {
  const base = `${url}|${title}`.slice(0, 180);
  let h = 0;
  for (let i = 0; i < base.length; i += 1) h = (h * 31 + base.charCodeAt(i)) | 0;
  return `a-${Math.abs(h).toString(36)}`;
}

function classify(url: string, rssSource: string, fallback: string) {
  const blob = `${url} ${rssSource} ${fallback}`.toLowerCase();
  if (blob.includes("reddit")) return { source: "Reddit", outlet: rssSource || "Reddit" };
  if (blob.includes("facebook")) return { source: "Facebook", outlet: "Facebook" };
  if (blob.includes("x.com") || blob.includes("twitter")) return { source: "X", outlet: rssSource || "X" };
  if (blob.includes("dailymail")) return { source: "Daily Mail", outlet: "Daily Mail" };
  if (blob.includes("bbc.")) return { source: "BBC", outlet: "BBC" };
  const outlet = rssSource || fallback || "News";
  return { source: outlet, outlet };
}

function parseRss(xml: string, fallback: string, outletHint?: string): DeskArticle[] {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  const rows: DeskArticle[] = [];
  for (const block of blocks) {
    const rawTitle = stripMarkup(tag(block, "title"));
    const url = cleanUrl(tag(block, "link"));
    const rawLede = tag(block, "description");
    const when = formatWhen(stripMarkup(tag(block, "pubDate")));
    const rssSource = stripMarkup(tag(block, "source"));
    const title = cleanTitle(rawTitle);
    const lede = cleanLede(rawLede, title);
    if (!url || !title) continue;
    if (!KEEP.test(title) || SKIP.test(`${title} ${lede}`)) continue;
    const kind = classify(url, rssSource, fallback);
    rows.push({
      id: slugId(url, title),
      title,
      lede,
      source: kind.source,
      outlet: outletHint || kind.outlet,
      when: when || "Recent",
      url,
    });
  }
  return rows;
}

async function pull(url: string) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent": "TRUTHPOLE/1.0 (ufology desk; +https://x.com/Truthpole)",
      },
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

export async function gatherArticles(): Promise<DeskArticle[]> {
  const batches = await Promise.all(
    FEEDS.map(async (feed) => {
      const xml = await pull(feed.url);
      if (!xml) return [] as DeskArticle[];
      return parseRss(xml, feed.source, feed.outlet);
    }),
  );
  const seen = new Set<string>();
  const merged: DeskArticle[] = [];
  for (const row of [...batches.flat(), ...ARTICLE_SEED]) {
    const key = row.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(row);
  }
  merged.sort((a, b) => {
    const da = Date.parse(a.when) || 0;
    const db = Date.parse(b.when) || 0;
    return db - da;
  });
  return sanitizeArticles(merged).slice(0, 36);
}
