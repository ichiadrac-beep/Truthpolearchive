import { cleanLede, cleanTitle } from "@/lib/articles-text";

export type DeskArticle = {
  id: string;
  title: string;
  lede: string;
  source: string;
  outlet: string;
  when: string;
  url: string;
};

export const ARTICLES_REFRESH_MS = 5 * 60 * 1000;

/** Fallback wire — live RSS is preferred. */
export const ARTICLE_SEED: DeskArticle[] = [
  {
    id: "nn-metals-coulthart",
    title: "Metals recovered by Russia from alleged UFO appear not to be from Earth",
    lede: "Ross Coulthart reports analysis of recovered material from a claimed Russian UFO event does not match known terrestrial alloys.",
    source: "NewsNation",
    outlet: "NewsNation",
    when: "23 Aug 2026",
    url: "https://www.newsnationnow.com/space/ufo/",
  },
  {
    id: "dm-buhler-ocean",
    title: "UFO ‘that looked like a giant nuclear weapon’ stalked me before disappearing into the sea, says NASA scientist",
    lede: "Charles Buhler describes a craft that paced him off Florida then dropped into the ocean — one of several recent water-UAP claims.",
    source: "Daily Mail",
    outlet: "Daily Mail",
    when: "25 Aug 2026",
    url: "https://www.dailymail.co.uk/sciencetech/article-16067531/nasa-charles-buhler-florida-ufo.html",
  },
  {
    id: "dm-davis-four",
    title: "US government hiding bodies of four alien races, Pentagon UFO scientist claims",
    lede: "Dr. Eric Davis tells interviewers he has seen records of recovered non-human bodies. The White House has not confirmed the claim.",
    source: "Daily Mail",
    outlet: "Daily Mail",
    when: "24 Aug 2026",
    url: "https://www.dailymail.co.uk/sciencetech/article-16061167/us-government-hiding-alien-bodies-eric-davis.html",
  },
  {
    id: "nn-four-types",
    title: "Feds sitting on 4 types of dead aliens, UFO whistleblower says",
    lede: "A prospective whistleblower tells NewsNation he is prepared to describe four alleged non-human body types if granted immunity.",
    source: "NewsNation",
    outlet: "NewsNation",
    when: "18 Aug 2026",
    url: "https://www.newsnationnow.com/space/ufo/4-types-aliens-ufo-whistleblower/",
  },
  {
    id: "time-serious",
    title: "America Is Finally Taking Extraterrestrials Seriously",
    lede: "From Capitol Hill to the lab, Jeffrey Kluger tracks how politicians and scientists have moved UFOs from punchline to policy.",
    source: "TIME",
    outlet: "TIME",
    when: "6 Aug 2026",
    url: "https://time.com/article/2026/08/06/america-taking-extraterrestrials-seriously/",
  },
  {
    id: "bbc-pentagon",
    title: "Pentagon releases fresh batch of UFO files",
    lede: "BBC: a fifth PURSUE tranche includes footage of an orb over a residential area plus FBI renderings of triangular craft.",
    source: "BBC",
    outlet: "BBC",
    when: "7 Aug 2026",
    url: "https://www.bbc.com/news/articles/ce8kr7p2pmdo",
  },
  {
    id: "cbs-did-you-see",
    title: "Pentagon releases new batch of UFO files: “Did you see that?”",
    lede: "CBS: 41 new files from Pentagon, FBI, CIA and State, including a 2002 triangle that blocked out stars over Afghanistan.",
    source: "CBS News",
    outlet: "CBS News",
    when: "7 Aug 2026",
    url: "https://www.cbsnews.com/news/ufo-files-pentagon-5th-release-documents-videos/",
  },
  {
    id: "newsweek-fbi-2026",
    title: "New UFO files detail FBI records of 2026 sightings",
    lede: "Newsweek on the fifth Department of War release, which includes contemporary 2026 sighting files alongside 1950s material.",
    source: "Newsweek",
    outlet: "Newsweek",
    when: "7 Aug 2026",
    url: "https://www.newsweek.com/new-ufo-files-details-fbi-records-of-2026-sightings-12296595",
  },
  {
    id: "war-pursue",
    title: "Presidential Unsealing and Reporting System for UAP Encounters (PURSUE)",
    lede: "Official fifth-tranche dump on war.gov/ufo — documents, film, and renderings from 1950 through 2026.",
    source: "Department of War",
    outlet: "war.gov",
    when: "7 Aug 2026",
    url: "https://www.war.gov/ufo/",
  },
  {
    id: "dm-triangle-base",
    title: "Trump releases new UFO footage as files expose silent 500ft triangle over US base",
    lede: "Daily Mail on newly posted footage of a large silent triangle and other records from the latest Pentagon dump.",
    source: "Daily Mail",
    outlet: "Daily Mail",
    when: "7 Aug 2026",
    url: "https://www.dailymail.co.uk/sciencetech/article-16036371/trump-ufo-footage-bagram-brazil.html",
  },
  {
    id: "reddit-carrollton",
    title: "Large dark triangular object moved slowly south of Carrollton, GA — 3 Aug 2026",
    lede: "r/UFOs: passenger on a Jackson–Atlanta flight filmed a rigid dark triangle with no wings, rotors, or plume. 1.5k upvotes.",
    source: "Reddit",
    outlet: "r/UFOs",
    when: "6 Aug 2026",
    url: "https://www.reddit.com/r/UFOs/comments/1vh4bfh/large_dark_triangular_object_moved_slowly_and/",
  },
  {
    id: "reddit-ufob-city",
    title: "The 2026 UFO disclosures almost confirm that a small city is at the centre of a 20th-century conspiracy",
    lede: "r/UFOB thread working through what the PURSUE releases do — and do not — pin down.",
    source: "Reddit",
    outlet: "r/UFOB",
    when: "22 Aug 2026",
    url: "https://www.reddit.com/r/UFOB/comments/1vtuehq/the_2026_ufo_disclosures_almost_confirm_that_a/",
  },
  {
    id: "fb-usatoday",
    title: "The Pentagon just released its fifth public batch of UFO files in 2026",
    lede: "USA TODAY on Facebook: 41 new files covering global sightings and material from several federal agencies.",
    source: "Facebook",
    outlet: "USA TODAY",
    when: "8 Aug 2026",
    url: "https://www.facebook.com/usatoday/videos/the-pentagon-just-released-its-fifth-public-release-of-ufo-files-in-2026-which-i/1536357074187587/",
  },
  {
    id: "fb-vice",
    title: "Are aliens real? One-third of Americans think alien UFOs have visited Earth",
    lede: "VICE on Facebook, citing a Talker Research survey: 37% now believe in aliens more than they used to, pointing at UAP coverage.",
    source: "Facebook",
    outlet: "VICE",
    when: "23 Aug 2026",
    url: "https://www.facebook.com/VICE/posts/the-government-has-been-releasing-uap-footage-holding-congressional-hearings-and/1423886546270992/",
  },
  {
    id: "x-truthpole-ocean",
    title: "Jack Osbourne: Trump told inner circle extraterrestrials are in Earth’s oceans",
    lede: "@Truthpole on a claim that Trump said “we have no idea what they are, but they’re in the ocean.” Not confirmed by the White House.",
    source: "X",
    outlet: "@Truthpole",
    when: "24 Aug 2026",
    url: "https://x.com/Truthpole/status/2091853781235384643",
  },
  {
    id: "x-michels-gallaudet",
    title: "Former Navy oceanographer: UFOs operating in Earth’s oceans, crash retrieval in 1962",
    lede: "Jesse Michels interviews Rear Adm. Tim Gallaudet on undersea UAP, Bluegill Triple Prime, and a claimed recovery off the Marshall Islands.",
    source: "X",
    outlet: "@AlchemyAmerican",
    when: "23 Aug 2026",
    url: "https://x.com/AlchemyAmerican/status/2091617271793988035",
  },
];

const CACHE_KEY = "truthpole-articles-v2";

export function loadCachedArticles(): DeskArticle[] {
  if (typeof window === "undefined") return ARTICLE_SEED;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return ARTICLE_SEED;
    const parsed = JSON.parse(raw) as DeskArticle[];
    if (!Array.isArray(parsed) || parsed.length === 0) return ARTICLE_SEED;
    return parsed;
  } catch {
    return ARTICLE_SEED;
  }
}

export function saveCachedArticles(rows: DeskArticle[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(rows.slice(0, 40)));
  } catch {
    /* quota */
  }
}

export function sanitizeArticle(row: DeskArticle): DeskArticle | null {
  const title = cleanTitle(row.title);
  const url = row.url?.trim() ?? "";
  if (!title || !url.startsWith("http")) return null;
  return {
    ...row,
    title,
    lede: cleanLede(row.lede ?? "", title),
    source: (row.source || "News").trim(),
    outlet: (row.outlet || row.source || "News").trim(),
    url,
  };
}

export function sanitizeArticles(rows: DeskArticle[]) {
  const seen = new Set<string>();
  const out: DeskArticle[] = [];
  for (const row of rows) {
    const next = sanitizeArticle(row);
    if (!next) continue;
    const key = next.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(next);
  }
  return out;
}

export async function fetchArticles(): Promise<{ articles: DeskArticle[]; source: "live" | "seed" }> {
  try {
    const res = await fetch("/api/articles", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as { articles?: DeskArticle[] };
      if (Array.isArray(data.articles) && data.articles.length > 0) {
        const articles = sanitizeArticles(data.articles);
        if (articles.length > 0) {
          saveCachedArticles(articles);
          return { articles, source: "live" };
        }
      }
    }
  } catch {
    /* no API */
  }
  const articles = sanitizeArticles(loadCachedArticles());
  saveCachedArticles(articles);
  return { articles, source: "seed" };
}

export function xShareHref(article: DeskArticle) {
  const url = new URL("https://x.com/intent/post");
  url.searchParams.set("text", `${article.title}\n\n${article.outlet} · via TRUTHPOLE`);
  url.searchParams.set("url", article.url);
  return url.toString();
}
