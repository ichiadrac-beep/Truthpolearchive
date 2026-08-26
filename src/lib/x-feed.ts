/** Live X Files feed — curated handles, keyword filter, credibility scoring. */

export type XFeedPost = {
  id: string;
  handle: string;
  name: string;
  text: string;
  when: string;
  url: string;
  likes?: number;
  reposts?: number;
  replies?: number;
  views?: number;
  hasMedia?: boolean;
  at?: number;
};

export type CredibilityBreakdown = {
  overall: number;
  virality: number;
  comments: number;
  evidence: number;
  label: string;
};

/** Prominent UAP / disclosure accounts */
export const X_FEED_ACCOUNTS = [
  "Truthpole",
  "rosscoulthart",
  "JeremyCorbell",
  "g_knapp",
  "lesliekean",
  "LueElizondo",
  "ChrisMellon5",
  "ProfAviLoeb",
  "GarryPNolan",
  "RepTimBurchett",
  "EricBurlison",
  "RepLuna",
  "theblackvault",
  "UAPJames",
  "NewsNation",
] as const;

export const X_FEED_KEYWORDS = [
  "UAP",
  "UFO",
  "NHI",
  "non-human",
  "biologics",
  "disclosure",
  "AARO",
  "PURSUE",
  "extraterrestrial",
  "alien",
  "crash retrieval",
  "whistleblower",
] as const;

/** Auto-refresh interval (ms). */
export const X_FEED_REFRESH_MS = 3 * 60 * 1000;
/** Only keep posts from now back 48 hours. */
export const X_FEED_WINDOW_MS = 48 * 60 * 60 * 1000;

/** Source trust for evidence leg of the credibility meter */
const SOURCE_TRUST: Record<string, number> = {
  Truthpole: 80,
  RepLuna: 88,
  EricBurlison: 86,
  RepTimBurchett: 84,
  NewsNation: 82,
  theblackvault: 90,
  lesliekean: 88,
  rosscoulthart: 86,
  ProfAviLoeb: 85,
  GarryPNolan: 84,
  ChrisMellon5: 78,
  LueElizondo: 72,
  g_knapp: 80,
  JeremyCorbell: 70,
  UAPJames: 68,
};

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function logScale(n: number, mid: number, high: number) {
  if (n <= 0) return 0;
  if (n >= high) return 100;
  if (n >= mid) return 55 + (45 * Math.log10(1 + (n - mid) / (high - mid + 1))) / Math.log10(2);
  return (55 * Math.log10(1 + n)) / Math.log10(1 + mid);
}

/**
 * Credibility from virality, comment volume, and evidence signals.
 * Comment *text* analysis requires X API; reply count is the public proxy.
 */
export function credibilityOf(post: XFeedPost): CredibilityBreakdown {
  const likes = post.likes ?? 0;
  const reposts = post.reposts ?? 0;
  const views = post.views ?? 0;
  const replies = post.replies ?? 0;

  const virality = clamp(
    0.45 * logScale(likes, 200, 5000) +
      0.35 * logScale(reposts, 40, 800) +
      0.2 * logScale(views, 10_000, 200_000),
  );

  const comments = clamp(logScale(replies, 15, 200));

  const trust = SOURCE_TRUST[post.handle] ?? SOURCE_TRUST[post.handle?.replace(/^@/, "") ?? ""] ?? 50;
  let evidence = trust * 0.7;
  if (post.hasMedia) evidence += 12;
  if (/https?:\/\//i.test(post.text) || /https?:\/\/x\.com\//i.test(post.url)) evidence += 6;
  const primary =
    /\b(AARO|PURSUE|Pentagon|Congress|FOIA|hearing|whistleblower|crash|biologic|NHI|Navy|radar)\b/i.test(
      post.text,
    );
  if (primary) evidence += 10;
  if (/\b(alleged|claims|rumor|says)\b/i.test(post.text) && !primary) evidence -= 6;
  evidence = clamp(evidence);

  const overall = clamp(0.4 * evidence + 0.35 * virality + 0.25 * comments);

  let label = "Unverified";
  if (overall >= 80) label = "High";
  else if (overall >= 60) label = "Moderate";
  else if (overall >= 40) label = "Low–moderate";
  else label = "Thin";

  return { overall, virality, comments, evidence, label };
}

/** Seed snapshot — live posts as of 2026-08-25. */
export const X_FEED_SEED: XFeedPost[] = [
  {
    id: "2091853781235384643",
    handle: "Truthpole",
    name: "T R U T H P O L E",
    text: "BREAKING — Jack Osbourne claims a close friend who speaks with President Trump weekly relayed that Trump told his inner circle extraterrestrials are living in Earth’s oceans. According to Osbourne, Trump said: “We have no idea what they are, but they’re in the ocean.” Not confirmed by the White House. Surfaces amid Pentagon UAP file releases.",
    when: "24 Aug 2026",
    url: "https://x.com/Truthpole/status/2091853781235384643",
    likes: 1745,
    reposts: 176,
    replies: 124,
    views: 163512,
    hasMedia: true,
  },
  {
    id: "2091851852560154625",
    handle: "Truthpole",
    name: "T R U T H P O L E",
    text: "So they — people in government — are telling you there are alien and human hybridization programs on Earth, so nonchalantly, and all you’ve got is a poker face?",
    when: "24 Aug 2026",
    url: "https://x.com/Truthpole/status/2091851852560154625",
    likes: 49,
    reposts: 4,
    replies: 10,
    views: 5002,
    hasMedia: true,
  },
  {
    id: "2091756450817155082",
    handle: "Truthpole",
    name: "T R U T H P O L E",
    text: "It’s 2026 and there are no Aliens?",
    when: "24 Aug 2026",
    url: "https://x.com/Truthpole/status/2091756450817155082",
    likes: 112,
    reposts: 10,
    replies: 9,
    views: 5221,
    hasMedia: true,
  },
  {
    id: "2091913422288060615",
    handle: "ProfAviLoeb",
    name: "Professor Avi Loeb",
    text: "Some reported UAP Orbs could be slow warp bubbles. The anomalous orbs reported by the Pentagon indeed move at slow speeds and could be explained by tiny spacetime bubbles on the scale of several micrometers. Puzzling orbs were mentioned in a June 5, 2026 AARO report (Dr. John Kozlowski): orange mother orb launching smaller red orbs; ~40% of that event remains unresolved.",
    when: "24 Aug 2026",
    url: "https://x.com/ProfAviLoeb/status/2091913422288060615",
    likes: 541,
    reposts: 85,
    replies: 97,
    views: 45084,
    hasMedia: true,
  },
  {
    id: "2091517030104957356",
    handle: "UAPJames",
    name: "UAP James",
    text: "White Sands UAP luring and shoot-down operation has recovered multiple craft, people involved have ethical concerns — Coulthart. Citing Rep. Burlison: agencies recreated conditions that drew these objects; ODNI, CIA, FBI and military intelligence were on site. Something showed up.",
    when: "23 Aug 2026",
    url: "https://x.com/UAPJames/status/2091517030104957356",
    likes: 523,
    reposts: 107,
    replies: 39,
    views: 73172,
    hasMedia: true,
  },
  {
    id: "2091494410789740887",
    handle: "NewsNation",
    name: "NewsNation",
    text: "This week's Q&A with @rosscoulthart: alleged decades-long U.S. Air Force disinformation campaign, White Sands operation, and China's UFO crash-retrieval program.",
    when: "23 Aug 2026",
    url: "https://x.com/NewsNation/status/2091494410789740887",
    likes: 60,
    reposts: 20,
    replies: 6,
    views: 15248,
  },
  {
    id: "2091107842161823828",
    handle: "Truthpole",
    name: "T R U T H P O L E",
    text: "On 28 December 1988, witnesses near Sierra Bermeja, Puerto Rico, reported a massive triangular craft. Multiple accounts describe military jets approaching; two of the aircraft were allegedly never seen again. The large craft later reportedly split and departed at high speed. No independent confirmation of missing U.S. aircraft has been released.",
    when: "22 Aug 2026",
    url: "https://x.com/Truthpole/status/2091107842161823828",
    likes: 51,
    reposts: 7,
    replies: 1,
    views: 5924,
    hasMedia: true,
  },
  {
    id: "2091020123805037003",
    handle: "NewsNation",
    name: "NewsNation",
    text: "The Trump administration is developing a waiver program for UFO whistleblowers. Ross Coulthart tells Katie Pavlich Tonight that the President should grant broad immunity so insiders can disclose what they know to the public.",
    when: "22 Aug 2026",
    url: "https://x.com/NewsNation/status/2091020123805037003",
    likes: 414,
    reposts: 94,
    replies: 16,
    views: 17567,
    hasMedia: true,
  },
  {
    id: "2090968471370637580",
    handle: "UAPJames",
    name: "UAP James",
    text: "Avi Loeb says UAP whistleblowers should be granted full immunity; UFO material should be tested by the UAP Science Advisory Council. “Hopefully they’ll have the legal assurances they need to perhaps give us a guided tour to places where materials or even spacecraft are being housed.”",
    when: "22 Aug 2026",
    url: "https://x.com/UAPJames/status/2090968471370637580",
    likes: 556,
    reposts: 100,
    replies: 16,
    views: 14383,
    hasMedia: true,
  },
  {
    id: "2090960096603853066",
    handle: "GarryPNolan",
    name: "Garry P. Nolan",
    text: "No one is ignoring UAP material requests — the hard part is finding it. If someone is determined to keep secrets after a public release order, the goods will be moved or reframed as prosaic advanced tech.",
    when: "22 Aug 2026",
    url: "https://x.com/GarryPNolan/status/2090960096603853066",
    likes: 4,
    reposts: 0,
    replies: 0,
    views: 139,
  },
  {
    id: "2090886180208279904",
    handle: "UAPJames",
    name: "UAP James",
    text: "Tom DeLonge says he’s currently consulting with the U.S. Govt on the UFO files releases. “There’s a lot more coming. This is just the beginning.”",
    when: "21 Aug 2026",
    url: "https://x.com/UAPJames/status/2090886180208279904",
    likes: 987,
    reposts: 167,
    replies: 66,
    views: 73306,
    hasMedia: true,
  },
  {
    id: "2090512492891869319",
    handle: "ProfAviLoeb",
    name: "Professor Avi Loeb",
    text: "Joined UAP Science Advisory Council members Garry Nolan, Peter Skafish, and Anita Goel to discuss the Council’s work and the scientific path forward on UAP.",
    when: "20 Aug 2026",
    url: "https://x.com/ProfAviLoeb/status/2090512492891869319",
    likes: 329,
    reposts: 54,
    replies: 21,
    views: 42305,
  },
  {
    id: "2090079467222008030",
    handle: "theblackvault",
    name: "John Greenewald, Jr.",
    text: "Hearing what you want to hear does not automatically make something true. Those pushing hardest for UFO “transparency” offer some of the very least of it themselves. Be careful who you trust. This story is far from fully revealed.",
    when: "19 Aug 2026",
    url: "https://x.com/theblackvault/status/2090079467222008030",
    likes: 122,
    reposts: 9,
    replies: 24,
    views: 7061,
  },
  {
    id: "2089882664409104685",
    handle: "rosscoulthart",
    name: "Ross Coulthart",
    text: "Full investigative cover story into the OBJECT M mystery in Merivalja, Tallinn, Estonia: secret Soviet UFOs — KGB swarms a suburban house in a UFO hunt (Reality Check).",
    when: "19 Aug 2026",
    url: "https://x.com/rosscoulthart/status/2089882664409104685",
    likes: 248,
    reposts: 47,
    replies: 30,
    views: 26148,
  },
  {
    id: "2087662275587133639",
    handle: "JeremyCorbell",
    name: "Jeremy Corbell",
    text: "Excellent move to make this direct appeal. There is an army of whistleblowers (some first-hand) waiting to have a direct dialogue with the American public about the UAP reality, to include NHI biologics.",
    when: "12 Aug 2026",
    url: "https://x.com/JeremyCorbell/status/2087662275587133639",
    likes: 1008,
    reposts: 155,
    replies: 76,
    views: 56769,
  },
  {
    id: "2089551721722757250",
    handle: "NewsNation",
    name: "NewsNation",
    text: "Dr. Eric Davis says he has “seen the records” of recovered non-human bodies. He joins Katie Pavlich to discuss the four alleged alien species and the claims surrounding them.",
    when: "18 Aug 2026",
    url: "https://x.com/NewsNation/status/2089551721722757250",
    likes: 477,
    reposts: 131,
    replies: 22,
    views: 25367,
    hasMedia: true,
  },
  {
    id: "2088846958672630047",
    handle: "Truthpole",
    name: "T R U T H P O L E",
    text: "Matthew Brown, author of the original Immaculate Constellation report, is asking President Trump for formal immunity so he can reveal more. The program is described as an unacknowledged special access effort that uses AI to extract UAP imagery from classified systems. Fox is now amplifying the request for a presidential waiver.",
    when: "16 Aug 2026",
    url: "https://x.com/Truthpole/status/2088846958672630047",
    likes: 211,
    reposts: 33,
    replies: 5,
    views: 8837,
    hasMedia: true,
  },
];

const CACHE_KEY = "truthpole-x-feed-v6";
const TWITTER_EPOCH = 1288834974657n;

function snowflakeTime(id: string): number | null {
  const raw = id.match(/(\d{15,20})/);
  if (!raw) return null;
  try {
    const ms = Number((BigInt(raw[1]) >> 22n) + TWITTER_EPOCH);
    if (ms > 1.2e12 && ms < Date.now() + 86_400_000) return ms;
  } catch {
    /* ignore */
  }
  return null;
}

function parseWhenString(when: string): number | null {
  if (!when) return null;
  const iso = Date.parse(when);
  if (!Number.isNaN(iso)) return iso;
  const m = when.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
  if (!m) return null;
  const parsed = Date.parse(`${m[1]} ${m[2]} ${m[3]} UTC`);
  return Number.isNaN(parsed) ? null : parsed;
}

export function postTime(post: XFeedPost): number {
  if (typeof post.at === "number" && post.at > 1e12) return post.at;
  return snowflakeTime(post.id) ?? snowflakeTime(post.url) ?? parseWhenString(post.when) ?? 0;
}

export function formatWhen(at: number, now = Date.now()): string {
  if (!at) return "Recent";
  const mins = Math.max(0, Math.round((now - at) / 60_000));
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h`;
  const days = Math.round(hrs / 24);
  return `${days}d`;
}

/** Last 48 hours, newest → oldest. */
export function recentXPosts(posts: XFeedPost[], now = Date.now()): XFeedPost[] {
  const cut = now - X_FEED_WINDOW_MS;
  return posts
    .filter((p) => p.handle && p.handle.toLowerCase() !== "desk")
    .map((p) => {
      const at = postTime(p);
      return { ...p, at, when: at ? formatWhen(at, now) : p.when };
    })
    .filter((p) => (p.at ?? 0) >= cut)
    .sort((a, b) => (b.at ?? 0) - (a.at ?? 0));
}

function stripDeskPosts(posts: XFeedPost[]) {
  return posts.filter((p) => p.handle && p.handle.toLowerCase() !== "desk");
}

export function loadCachedFeed(): XFeedPost[] {
  if (typeof window === "undefined") return recentXPosts(X_FEED_SEED);
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return recentXPosts(X_FEED_SEED);
    const parsed = JSON.parse(raw) as XFeedPost[];
    if (!Array.isArray(parsed) || parsed.length === 0) return recentXPosts(X_FEED_SEED);
    const clean = recentXPosts(stripDeskPosts(parsed));
    return clean.length ? clean : recentXPosts(X_FEED_SEED);
  } catch {
    return recentXPosts(X_FEED_SEED);
  }
}

export function saveCachedFeed(posts: XFeedPost[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(posts.slice(0, 40)));
  } catch {
    /* quota */
  }
}

export async function fetchXFeed(): Promise<{ posts: XFeedPost[]; source: "api" | "seed" }> {
  try {
    const res = await fetch("/api/x-feed", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { posts?: XFeedPost[] };
      if (Array.isArray(data.posts) && data.posts.length > 0) {
        const posts = recentXPosts(stripDeskPosts(data.posts));
        if (posts.length > 0) {
          saveCachedFeed(posts);
          return { posts, source: "api" };
        }
      }
    }
  } catch {
    /* no API */
  }
  const posts = loadCachedFeed();
  saveCachedFeed(posts);
  return { posts, source: "seed" };
}

export function formatCount(n?: number): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/* ── Live gather (Google News site:x.com) ───────────────────────────── */

const DISPLAY_NAMES: Record<string, string> = {
  Truthpole: "T R U T H P O L E",
  rosscoulthart: "Ross Coulthart",
  JeremyCorbell: "Jeremy Corbell",
  g_knapp: "George Knapp",
  lesliekean: "Leslie Kean",
  LueElizondo: "Lue Elizondo",
  ChrisMellon5: "Christopher Mellon",
  ProfAviLoeb: "Professor Avi Loeb",
  GarryPNolan: "Garry P. Nolan",
  RepTimBurchett: "Rep. Tim Burchett",
  EricBurlison: "Rep. Eric Burlison",
  RepLuna: "Rep. Anna Paulina Luna",
  theblackvault: "John Greenewald, Jr.",
  UAPJames: "UAP James",
  NewsNation: "NewsNation",
};

const ACCOUNT_LOOKUP = new Map<string, string>(
  X_FEED_ACCOUNTS.map((h) => [h.toLowerCase(), h]),
);

function stripXml(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function xmlTag(block: string, name: string) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? stripXml(m[1]) : "";
}

function relativeWhen(raw: string): { when: string; at: number } | null {
  const d = new Date(raw);
  const at = d.getTime();
  if (Number.isNaN(at) || at < Date.now() - X_FEED_WINDOW_MS) return null;
  return { when: formatWhen(at), at };
}

function slugId(url: string, title: string) {
  const base = `${url}|${title}`.slice(0, 180);
  let h = 0;
  for (let i = 0; i < base.length; i += 1) h = (h * 31 + base.charCodeAt(i)) | 0;
  return `x-${Math.abs(h).toString(36)}`;
}

/** Resolve X handle from title/body/url — never returns "desk". Prefer the x.com path. */
export function resolveXHandle(text: string, url: string, source = "", fallback?: string): string | null {
  const path = url.match(/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]{2,30})(?:\/status|\/|$)/i);
  if (path) {
    const key = path[1].toLowerCase();
    if (!["i", "intent", "search", "home", "share", "hashtag"].includes(key)) {
      return ACCOUNT_LOOKUP.get(key) ?? path[1];
    }
  }

  const stripped = text.replace(/\s*[-–—]\s*x\.com\s*$/i, "").trim();
  if (stripped.length > 0 && stripped.length <= 48) {
    const exact = ACCOUNT_LOOKUP.get(stripped.replace(/^@/, "").toLowerCase());
    if (exact) return exact;
    for (const [handle, name] of Object.entries(DISPLAY_NAMES)) {
      if (stripped.toLowerCase() === name.toLowerCase()) return handle;
    }
  }

  for (const [handle, name] of Object.entries(DISPLAY_NAMES)) {
    const prefix = `${name.toLowerCase()}:`;
    if (stripped.toLowerCase().startsWith(prefix)) return handle;
  }

  const dash = text.match(/\s[-–—]\s+@([A-Za-z0-9_]{2,30})\s*$/);
  if (dash) {
    const hit = ACCOUNT_LOOKUP.get(dash[1].toLowerCase());
    if (hit) return hit;
  }

  const src = source.replace(/^@/, "").trim();
  if (src && !/^x\.com$/i.test(src) && !/google/i.test(src)) {
    const hit = ACCOUNT_LOOKUP.get(src.toLowerCase());
    if (hit) return hit;
  }

  if (fallback) {
    const mentioned = new RegExp(`@${fallback}\\b`, "i").test(text);
    if (!mentioned) return ACCOUNT_LOOKUP.get(fallback.toLowerCase()) ?? fallback;
  }

  return null;
}

function displayNameFor(handle: string) {
  return (
    DISPLAY_NAMES[handle] ??
    DISPLAY_NAMES[
      (ACCOUNT_LOOKUP.get(handle.toLowerCase()) ?? handle) as string
    ] ??
    handle.replace(/_/g, " ")
  );
}

const KEEP_X =
  /\b(uaps?\b|ufology|extraterrestrial|non-human|\bnhi\b|whistleblower|aaro|pursue|immaculate constellation|crash retriev|tic[- ]?tac|gimbal|gofast|biologics?|unidentified (aerial|anomalous)|flying saucer|disclosure|nuclear (?:power|plant|site)s?.{0,40}(uap|drone)|uap.{0,50}(orb|drone|hearing|file|report))\b/i;

const SKIP_X =
  /\b(slot|casino|free spins|nasdaq|etf|ufo plast|ufo_rockband|ufo rockband|miffest|hard charger|captcha|hyundai|ioniq|ice cream|burger|backpack|greyhound)\b/i;

function isUfologyText(text: string) {
  if (SKIP_X.test(text)) return false;
  if (KEEP_X.test(text)) return true;
  return /\bufo\b/i.test(text) && /\b(sighting|craft|pentagon|congress|pilot|radar|navy|hearing|whistle)\b/i.test(text);
}

function parseGoogleXItems(xml: string, fallbackHandle?: string): XFeedPost[] {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  const rows: XFeedPost[] = [];
  for (const block of blocks) {
    const title = xmlTag(block, "title");
    const link = xmlTag(block, "link");
    const pub = xmlTag(block, "pubDate");
    const source = xmlTag(block, "source");
    if (!title || !link) continue;

    let text = title.replace(/\s*[-–—]\s*x\.com\s*$/i, "").trim();
    const ufology =
      isUfologyText(text) ||
      Boolean(fallbackHandle && /\b(uap|ufo|aaro|nhi|whistle|orb|drone|nuclear|disclos)\b/i.test(text));
    if (!ufology) continue;

    const handle =
      resolveXHandle(text, link, source, fallbackHandle) ??
      (/\b(this week(?:'s)? q&a|this week on ["“]?reality check|premiering now)\b/i.test(text)
        ? "NewsNation"
        : null);
    if (!handle) continue;
    if (handle.toLowerCase() === "desk") continue;

    const snow = snowflakeTime(link) ?? snowflakeTime(title);
    const dated = relativeWhen(pub);
    const at = dated?.at ?? snow ?? 0;
    if (!at || at < Date.now() - X_FEED_WINDOW_MS) continue;

    const post: XFeedPost = {
      id: slugId(link, text),
      handle,
      name: displayNameFor(handle),
      text,
      when: formatWhen(at),
      url: link,
      hasMedia: false,
      at,
    };
    rows.push(post);
  }
  return rows;
}

async function pullXml(url: string) {
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

function googleXQuery(extra: string) {
  const q = encodeURIComponent(`site:x.com (${extra}) when:2d`);
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
}

/**
 * Live pull of X posts from the last 48 hours (newest first).
 * Watched handles + ufology keywords. Drops anything older than 48h.
 */
export async function gatherXFeed(): Promise<XFeedPost[]> {
  const mains = [
    "rosscoulthart",
    "NewsNation",
    "ProfAviLoeb",
    "theblackvault",
    "UAPJames",
    "Truthpole",
    "LueElizondo",
    "JeremyCorbell",
  ] as const;
  const feeds: Promise<XFeedPost[]>[] = [
    pullXml(googleXQuery("UAP OR ufology OR AARO OR NHI OR whistleblower OR \"crash retrieval\" OR PURSUE")).then(
      (xml) => parseGoogleXItems(xml),
    ),
    pullXml(googleXQuery("UFO (sighting OR pentagon OR congress OR hearing OR craft OR disclosure)")).then((xml) =>
      parseGoogleXItems(xml),
    ),
    ...mains.map((handle) =>
      pullXml(googleXQuery(`@${handle}`)).then((xml) => parseGoogleXItems(xml, handle)),
    ),
  ];

  const batches = await Promise.all(feeds);
  const seen = new Set<string>();
  const merged: XFeedPost[] = [];
  for (const row of batches.flat()) {
    const key = row.text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .slice(0, 120);
    if (!key || seen.has(key)) continue;
    if (row.handle.toLowerCase() === "desk") continue;
    seen.add(key);
    merged.push(row);
  }
  const live = recentXPosts(merged);
  const seed = recentXPosts(X_FEED_SEED);
  const seenLive = new Set(live.map((p) => p.text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80)));
  const extra = seed.filter((p) => {
    const key = p.text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80);
    return key && !seenLive.has(key);
  });
  return recentXPosts([...live, ...extra]).slice(0, 40);
}
