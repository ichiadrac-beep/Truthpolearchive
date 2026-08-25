export type BoardMedia = "ir" | "orb" | "vlights" | "radar" | "video";

export type BoardPost = {
  id: string;
  source: string;
  handle: string;
  when: string;
  text: string;
  media?: BoardMedia;
  duration?: string;
  validity?: number;
  virality?: number;
  evidence?: number;
  belief?: number;
};

export const BOARD_POSTS: BoardPost[] = [
  {
    id: "nimitz-flir",
    source: "NAVY",
    handle: "FASTEAGLE",
    when: "14 Nov 2004",
    text: "White tic-tac, ~40 ft, no rotors, no plume. Dropped from 28,000 to 50 ft in under a second. ATFLIR lock, then the dump. Still the cleanest tape we have.",
    media: "video",
    duration: "00:17",
  },
  {
    id: "go-fast-east",
    source: "PILOT",
    handle: "GRAVES",
    when: "24 Feb 2019",
    text: "Cube inside a translucent sphere, 0.8 Mach, off the nose of an F/A-18. East-coast training range. Multiple jets, same object, no squawk.",
    media: "orb",
  },
  {
    id: "atc-primary",
    source: "ATC",
    handle: "TRACON",
    when: "21 Jan 2021",
    text: "Primary only. No 1200, no ADS-B. Held a hover on the approach path, then slid west. Tower asked if we had a helicopter in the area. We did not.",
  },
  {
    id: "phoenix-v",
    source: "GUEST",
    handle: "PHX-SKY",
    when: "13 Mar 1997",
    text: "Miles-long V, eight to ten amber lights, 20:30 MST. Silent. Independent ground reports from Henderson through Phoenix. Not a flight of A-10s from where I stood.",
    media: "vlights",
  },
  {
    id: "tehran-76",
    source: "IRIAF",
    handle: "TAFTAN-2",
    when: "18 Sep 1976",
    text: "F-4 intercept. Instruments and comms dropped inside 25 nm. Object jumped, a second light fell toward the ground then climbed. Ground radar had it the whole time.",
    media: "radar",
  },
  {
    id: "times-2017",
    source: "PRESS",
    handle: "NYT",
    when: "16 Dec 2017",
    text: "Pentagon confirms the three Navy videos. They are not a game overlay. AATIP spent real money. The pilots were not confused by Venus.",
  },
  {
    id: "kaikoura",
    source: "ARCHIVE",
    handle: "ARGOSY",
    when: "31 Dec 1978",
    text: "Kaikoura, New Zealand. Radar and onboard film on the same lights off the coast. Wellington radar and the aircraft painted the objects together.",
    media: "ir",
  },
  {
    id: "yorkshire",
    source: "GUEST",
    handle: "PENNINES",
    when: "4 Mar 2024",
    text: "Three amber lights in a V over the moor, twenty seconds, no sound, then gone. Hills were dark. Not a concert. Not a drone show.",
    media: "vlights",
  },
  {
    id: "jsdf-circular",
    source: "JSDF",
    handle: "MOD-JP",
    when: "2024",
    text: "Defense circular to crews: photograph unidentified aerials, log time and heading, do not pursue. The quiet version of a reporting channel.",
  },
  {
    id: "cosford",
    source: "UK MOD",
    handle: "COSFORD",
    when: "31 Mar 1993",
    text: "Shawbury and Cosford the same night. A craft described as jumbo-sized, lights along the edge, then a missile-like object. The file was released. The object was not.",
  },
  {
    id: "recife",
    source: "GUEST",
    handle: "RECIFE-PORT",
    when: "2 Aug 2025",
    text: "Orange sphere over the port, ninety seconds, no sound. Split into two and faded. Dock cameras pointed the wrong way. Three of us on the quay.",
    media: "orb",
  },
];


export function credibilityOf(post: BoardPost): number {
  const evidence = post.evidence ?? (post.media ? 72 : 48);
  const belief = post.belief ?? (post.source === "GUEST" ? 40 : 68);
  const validity = post.validity ?? Math.round((evidence + belief) / 2);
  return Math.max(1, Math.min(100, Math.round(0.55 * evidence + 0.25 * belief + 0.2 * validity)));
}
