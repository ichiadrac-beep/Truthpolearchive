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

/** Prominent UAP / disclosure / psionic accounts that post frequently */
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
  "tomdelonge",
  "DrStevenGreer",
  "SkywatcherHQ",
  "TheUfoJoe",
  "TelepathyTapes",
  "UAPSAC",
  "I_D_Official",
  "chrisbledsoeufo",
  "InterstellarUAP",
  "UAPFilesPodcast",
  "jaystratton",
  "WeaponizedPod",
  "TheSolFoundation",
  "VinnieAdams87",
  "ChrisLehtoF15",
  "DeanRadin",
  "ky_dickens",
  "TheWhyFiles",
  "UAPWatchers",
  "JohnRamirezCIA",
  "GoodTroubleShow",
  "dpasulka",
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
  "crash retrieval",
  "whistleblower",
  "psionic",
  "CE-5",
  "telepathy",
  "remote viewing",
  "Skywatcher",
  "consciousness",
] as const;

/** Auto-refresh while the desk is open. */
export const X_FEED_REFRESH_MS = 15_000;
/** Keep posts from now back 36 hours so the board stays current. */
export const X_FEED_WINDOW_MS = 36 * 60 * 60 * 1000;

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
  tomdelonge: 74,
  DrStevenGreer: 70,
  SkywatcherHQ: 72,
  TheUfoJoe: 76,
  TelepathyTapes: 73,
  UAPSAC: 82,
  I_D_Official: 78,
  chrisbledsoeufo: 66,
  InterstellarUAP: 64,
  UAPFilesPodcast: 67,
  jaystratton: 84,
  WeaponizedPod: 74,
  TheSolFoundation: 80,
  VinnieAdams87: 66,
  ChrisLehtoF15: 68,
  DeanRadin: 78,
  ky_dickens: 72,
  TheWhyFiles: 62,
  UAPWatchers: 64,
  JohnRamirezCIA: 70,
  GoodTroubleShow: 68,
  dpasulka: 80,
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
    /\b(AARO|PURSUE|Pentagon|Congress|FOIA|hearing|whistleblower|crash|biologic|NHI|Navy|radar|psionic|CE-?5|Skywatcher)\b/i.test(
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

/** Seed snapshot used if live gather is thin. Snowflake ids keep times honest. */
export const X_FEED_SEED: XFeedPost[] = [
  {
    id: "2095599851023298704",
    handle: "TheUfoJoe",
    name: "Joe Murgia",
    text: "“There is no doubt at all that the Americans have been in possession of crashed craft since the 1940s.” “In Washington, it’s an open secret that [the UFO phenomenon is real].” Sky News interview with Jonathan Caplan KC on crash retrievals, reverse engineering, and disclosure.",
    when: "3 Sep 2026",
    url: "https://x.com/TheUfoJoe/status/2095599851023298704",
    likes: 139,
    reposts: 24,
    replies: 8,
    views: 6546,
    hasMedia: true,
    at: Date.parse("Thu, 03 Sep 2026 19:48:33 GMT"),
  },
  {
    id: "2095592481974882610",
    handle: "jaystratton",
    name: "Jay Stratton",
    text: "New video from the former AAWSAP / UAPTF lead.",
    when: "3 Sep 2026",
    url: "https://x.com/jaystratton/status/2095592481974882610",
    likes: 292,
    reposts: 64,
    replies: 13,
    views: 13973,
    hasMedia: true,
    at: Date.parse("Thu, 03 Sep 2026 19:19:16 GMT"),
  },
  {
    id: "2095583308767752413",
    handle: "ProfAviLoeb",
    name: "Professor Avi Loeb",
    text: "I am delighted to partner with @AdamWeitsman on a new Galileo Observatory at Carl Sagan’s former residence in Ithaca. The observatory will search the entire sky for UAP using infrared, visible, radio and audio sensors, while making its data available to the public.",
    when: "3 Sep 2026",
    url: "https://x.com/ProfAviLoeb/status/2095583308767752413",
    likes: 79,
    reposts: 15,
    replies: 8,
    views: 2388,
    hasMedia: false,
    at: Date.parse("Thu, 03 Sep 2026 18:42:49 GMT"),
  },
  {
    id: "2095366286138286142",
    handle: "g_knapp",
    name: "George Knapp",
    text: "Ross and I have been chatting this week about the current flood of UFO stories and claims, a wave that almost feels like a psychological op to “flood the zone” to the point where the public gets burned out on saucers and aliens and moves on to something else. I look forward to hearing more about this from Ross — whether the WH order applies to the full US military, whether there are protocols attached, and whether it has already succeeded in bringing one down.",
    when: "3 Sep 2026",
    url: "https://x.com/g_knapp/status/2095366286138286142",
    likes: 280,
    reposts: 36,
    replies: 25,
    views: 15961,
    hasMedia: false,
    at: Date.parse("Thu, 03 Sep 2026 04:20:27 GMT"),
  },
  {
    id: "2095355704676868334",
    handle: "g_knapp",
    name: "George Knapp",
    text: "An order to shoot down orbs or unknowns is a very serious step. Our military has strict protocols for such actions. No one shot down the UAP that overflew Langley 17 nights in a row, or the hundred or so objects that buzzed 10 Navy warships back in 2019, or the craft that slowly floated thru Pantex.",
    when: "3 Sep 2026",
    url: "https://x.com/g_knapp/status/2095355704676868334",
    likes: 106,
    reposts: 16,
    replies: 6,
    views: 4566,
    hasMedia: false,
    at: Date.parse("Thu, 03 Sep 2026 03:38:24 GMT"),
  },
  {
    id: "2095353670611468760",
    handle: "theblackvault",
    name: "John Greenewald, Jr.",
    text: "Then it’s only fair to ask them for access to their UFO archive, as well. You know, tradesies. Pentagon seeks access to a vast private UFO records collection.",
    when: "3 Sep 2026",
    url: "https://x.com/theblackvault/status/2095353670611468760",
    likes: 127,
    reposts: 15,
    replies: 3,
    views: 9069,
    hasMedia: false,
    at: Date.parse("Thu, 03 Sep 2026 03:30:19 GMT"),
  },
  {
    id: "2095223395290055048",
    handle: "JeremyCorbell",
    name: "Jeremy Corbell",
    text: "A New Wave of UFO News 🛸 Join me in the LIVE chat NOW for this launch at HIGH-NOON PT. GO GO UFO!!!",
    when: "2 Sep 2026",
    url: "https://x.com/JeremyCorbell/status/2095223395290055048",
    likes: 215,
    reposts: 35,
    replies: 15,
    views: 16956,
    hasMedia: true,
    at: Date.parse("Wed, 02 Sep 2026 18:52:39 GMT"),
  },
  {
    id: "2095210589853274152",
    handle: "TelepathyTapes",
    name: "The Telepathy Tapes",
    text: "On this week’s Talk Tracks episode we explore shared death experiences, profound moments in which a loved one or even a stranger may suddenly perceive what the dying person is seeing, feeling, or experiencing in their transition beyond death.",
    when: "2 Sep 2026",
    url: "https://x.com/TelepathyTapes/status/2095210589853274152",
    likes: 25,
    reposts: 1,
    replies: 2,
    views: 961,
    hasMedia: true,
    at: Date.parse("Wed, 02 Sep 2026 18:01:46 GMT"),
  },
];

const CACHE_KEY = "truthpole-x-feed-v8";
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
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(posts.slice(0, 60)));
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
  tomdelonge: "Tom DeLonge",
  DrStevenGreer: "Dr. Steven Greer",
  SkywatcherHQ: "Skywatcher",
  TheUfoJoe: "Joe Murgia",
  TelepathyTapes: "The Telepathy Tapes",
  UAPSAC: "UAP Science Advisory Council",
  I_D_Official: "Richard Dolan",
  chrisbledsoeufo: "Chris Bledsoe",
  InterstellarUAP: "Interstellar",
  UAPFilesPodcast: "UAP Files",
  jaystratton: "Jay Stratton",
  WeaponizedPod: "WEAPONIZED",
  TheSolFoundation: "The Sol Foundation",
  VinnieAdams87: "Vinnie Adams",
  ChrisLehtoF15: "Chris Lehto",
  DeanRadin: "Dean Radin",
  ky_dickens: "Ky Dickens",
  TheWhyFiles: "The Why Files",
  UAPWatchers: "UAP Watchers",
  JohnRamirezCIA: "John Ramirez",
  GoodTroubleShow: "Good Trouble Show",
  dpasulka: "Diana Walsh Pasulka",
};

const ACCOUNT_LOOKUP = new Map<string, string>(X_FEED_ACCOUNTS.map((h) => [h.toLowerCase(), h]));

const PSIONIC_ACCOUNTS = new Set(
  ["DrStevenGreer", "SkywatcherHQ", "TelepathyTapes", "ky_dickens", "DeanRadin", "chrisbledsoeufo"].map((h) =>
    h.toLowerCase(),
  ),
);

function stripXml(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
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

function aboutPerson(text: string, name: string) {
  if (!name || name.length < 4) return false;
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `\\b${esc}\\b\\s+(brags?|claims?|says|said|told|announces?|wants|admits|insists|alleges|denies|reveals|knows)\\b`,
    "i",
  ).test(text);
}

export function resolveXHandle(text: string, url: string, source = "", fallback?: string): string | null {
  const path = url.match(/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]{2,30})(?:\/status|\/|$)/i);
  if (path) {
    const key = path[1].toLowerCase();
    if (!["i", "intent", "search", "home", "share", "hashtag"].includes(key)) {
      return ACCOUNT_LOOKUP.get(key) ?? path[1];
    }
  }

  const stripped = text.replace(/\s*[-–—]\s*x\.com\s*$/i, "").trim();
  if (/\(@[A-Za-z0-9_]+\) on X$/i.test(stripped)) return null;
  if (/^RSS reader not yet/i.test(stripped)) return null;

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
    const canon = ACCOUNT_LOOKUP.get(fallback.toLowerCase()) ?? fallback;
    const name = DISPLAY_NAMES[canon] ?? DISPLAY_NAMES[fallback] ?? "";
    if (name && aboutPerson(stripped, name)) return null;
    return canon;
  }

  return null;
}

function displayNameFor(handle: string) {
  return (
    DISPLAY_NAMES[handle] ??
    DISPLAY_NAMES[(ACCOUNT_LOOKUP.get(handle.toLowerCase()) ?? handle) as string] ??
    handle.replace(/_/g, " ")
  );
}

const KEEP_X =
  /\b(uaps?\b|ufos?\b|ufology|extraterrestrial|non-human|\bnhi\b|whistleblower|aaro|pursue|immaculate constellation|crash retriev|tic[- ]?tac|gimbal|gofast|biologics?|unidentified (aerial|anomalous)|flying saucer|psionic|ce-?5|telepathy tapes?|remote viewing|skywatcher|galileo project|uap sac|consciousness|orbs?|disclosure)\b/i;

const SKIP_X =
  /\b(slot|casino|free spins|nasdaq|etf|ufo plast|ufo_rockband|ufo rockband|miffest|hard charger|captcha|hyundai|ioniq|ice cream|burger|backpack|greyhound|sattebaazon|sebi|cw dfb|derivatives settlement|wolverine|psylocke|league of legends|dead at \d+|emotional tributes|gloria steinem)\b/i;

const NEWS_ORGS = new Set(["newsnation"]);

function isWatchedHandle(handle: string) {
  return ACCOUNT_LOOKUP.has(handle.replace(/^@/, "").toLowerCase());
}

function isUfologyText(text: string) {
  if (SKIP_X.test(text)) return false;
  if (KEEP_X.test(text)) return true;
  return (
    /\bufo\b/i.test(text) &&
    /\b(sighting|craft|pentagon|congress|pilot|radar|navy|hearing|whistle|contact)\b/i.test(text)
  );
}

function isPsionicText(text: string) {
  return /\b(psionic|ce-?5|telepathy|remote viewing|skywatcher|consciousness|noetic|psi\b|nde\b|shared death|contact protocol|meditation)\b/i.test(
    text,
  );
}

function keepPost(handle: string, text: string) {
  if (SKIP_X.test(text)) return false;
  const key = handle.replace(/^@/, "").toLowerCase();
  if (NEWS_ORGS.has(key)) return isUfologyText(text);
  if (!isWatchedHandle(handle)) return isUfologyText(text) || isPsionicText(text);
  if (PSIONIC_ACCOUNTS.has(key)) return isUfologyText(text) || isPsionicText(text);
  return true;
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

    const text = title.replace(/\s*[-–—]\s*x\.com\s*$/i, "").trim();
    if (!text || /\(@[A-Za-z0-9_]+\) on X$/i.test(text)) continue;
    if (/^RSS reader not yet/i.test(text)) continue;

    const handle =
      resolveXHandle(text, link, source, fallbackHandle) ??
      (/\b(this week(?:'s)? q&a|this week on ["“]?reality check|premiering now)\b/i.test(text)
        ? "NewsNation"
        : null);
    if (!handle || handle.toLowerCase() === "desk") continue;
    if (!keepPost(handle, text)) continue;

    const snow = snowflakeTime(link) ?? snowflakeTime(title);
    const dated = relativeWhen(pub);
    const at = dated?.at ?? snow ?? 0;
    if (!at || at < Date.now() - X_FEED_WINDOW_MS) continue;

    rows.push({
      id: snowflakeTime(link) ? (link.match(/(\d{15,20})/)?.[1] ?? slugId(link, text)) : slugId(link, text),
      handle,
      name: displayNameFor(handle),
      text,
      when: formatWhen(at),
      url: /(?:x\.com|twitter\.com)\//i.test(link) ? link : `https://x.com/${handle}`,
      hasMedia: /\b(video|photo|image|watch|footage)\b/i.test(text),
      at,
    });
  }
  return rows;
}

async function pullXml(url: string) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 7000);
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

function googleRss(query: string) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
}

function chunkHandles(list: readonly string[], size: number) {
  const out: string[][] = [];
  for (let i = 0; i < list.length; i += size) out.push([...list.slice(i, i + size)]);
  return out;
}

let feedCache: { at: number; posts: XFeedPost[] } | null = null;
const FEED_CACHE_MS = 8_000;

function collapseNearDupes(rows: XFeedPost[]) {
  const sorted = [...rows].sort((a, b) => (b.at ?? 0) - (a.at ?? 0));
  const out: XFeedPost[] = [];
  for (const row of sorted) {
    const idx = out.findIndex(
      (p) =>
        p.handle.toLowerCase() === row.handle.toLowerCase() &&
        Math.abs((p.at ?? 0) - (row.at ?? 0)) < 10 * 60_000,
    );
    if (idx >= 0) {
      if (row.text.length > out[idx].text.length) out[idx] = row;
      continue;
    }
    out.push(row);
  }
  return out;
}

function dedupePosts(rows: XFeedPost[]) {
  const seen = new Set<string>();
  const merged: XFeedPost[] = [];
  for (const row of rows) {
    const key = row.text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .slice(0, 120);
    const idKey = row.id;
    if (!key || seen.has(key) || seen.has(idKey)) continue;
    if (row.handle.toLowerCase() === "desk") continue;
    seen.add(key);
    seen.add(idKey);
    merged.push(row);
  }
  return merged;
}

const HOT_HANDLES = [
  "rosscoulthart",
  "JeremyCorbell",
  "g_knapp",
  "ProfAviLoeb",
  "theblackvault",
  "TheUfoJoe",
  "SkywatcherHQ",
  "DrStevenGreer",
  "TelepathyTapes",
  "jaystratton",
  "LueElizondo",
  "UAPSAC",
  "NewsNation",
  "WeaponizedPod",
] as const;

export async function gatherXFeed(): Promise<XFeedPost[]> {
  if (feedCache && Date.now() - feedCache.at < FEED_CACHE_MS && feedCache.posts.length > 0) {
    return feedCache.posts;
  }

  const hotSet = new Set(HOT_HANDLES.map((h) => h.toLowerCase()));
  const rest = X_FEED_ACCOUNTS.filter((h) => !hotSet.has(h.toLowerCase()) && h.toLowerCase() !== "newsnation");

  const queries: { q: string; fallback?: string }[] = [
    { q: 'site:x.com (UAP OR ufology OR NHI OR AARO OR Skywatcher OR "crash retrieval") when:1h' },
    { q: 'site:x.com (UAP OR ufology OR NHI OR whistleblower OR PURSUE OR "Galileo") when:12h' },
    { q: 'site:x.com (psionic OR "CE-5" OR CE5 OR "remote viewing" OR telepathy OR "telepathy tapes") when:1d' },
    ...HOT_HANDLES.map((h) => ({ q: `site:x.com/${h} when:2d`, fallback: h })),
    ...chunkHandles(rest, 4).map((batch) => ({
      q: `site:x.com (${batch.map((h) => `@${h}`).join(" OR ")}) when:2d`,
    })),
  ];

  const batches = await Promise.all(
    queries.map(({ q, fallback }) => pullXml(googleRss(q)).then((xml) => parseGoogleXItems(xml, fallback))),
  );
  const live = recentXPosts(collapseNearDupes(dedupePosts(batches.flat())));
  const seed = recentXPosts(X_FEED_SEED);
  const out = recentXPosts(collapseNearDupes(dedupePosts([...live, ...seed]))).slice(0, 60);

  if (out.length) feedCache = { at: Date.now(), posts: out };
  return out;
}
