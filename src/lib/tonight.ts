export type TonightDesk = "archive" | "conspiracy" | "ancient";

export type TonightPick = {
  title: string;
  anniversary: boolean;
  caseId: string | null;
  href: string;
};

export type Anniversary = {
  month: number;
  day: number;
  through?: number;
  title: string;
  id: string;
  desk?: TonightDesk;
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** Real calendar dates — only ids that exist as files. */
const ANNIVERSARIES: Anniversary[] = [
  { month: 1, day: 7, title: "Mantell", id: "mantell" },
  { month: 1, day: 8, title: "Trans-en-Provence", id: "trans-en-provence" },
  { month: 1, day: 8, title: "Condon Committee", id: "condon-committee", desk: "conspiracy" },
  { month: 1, day: 11, title: "Wanaque Reservoir", id: "wanaque" },
  { month: 1, day: 14, through: 18, title: "Robertson Panel", id: "robertson-panel", desk: "conspiracy" },
  { month: 1, day: 16, title: "Trindade Island", id: "trindade" },
  { month: 1, day: 16, through: 23, title: "Jersey Devil flap", id: "jersey-devil", desk: "conspiracy" },
  { month: 1, day: 20, title: "Varginha", id: "varginha" },
  { month: 1, day: 20, title: "Knowles / Mundrabilla", id: "mundrabilla" },
  { month: 1, day: 23, title: "Berwyn Mountain", id: "berwyn" },
  { month: 1, day: 28, title: "Air France 3532", id: "air-france-3532" },
  { month: 2, day: 4, title: "Broad Haven", id: "broad-haven" },
  { month: 2, day: 4, title: "Chinese balloon", id: "chinese-balloon", desk: "conspiracy" },
  { month: 2, day: 20, title: "Eisenhower / Greada", id: "eisenhower-greada", desk: "conspiracy" },
  { month: 2, day: 23, title: "Kofu", id: "kofu" },
  { month: 2, day: 25, title: "Battle of Los Angeles", id: "battle-of-los-angeles" },
  { month: 3, day: 13, title: "Phoenix Lights", id: "phoenix-lights" },
  { month: 3, day: 16, title: "Malmstrom", id: "malmstrom" },
  { month: 3, day: 16, title: "Cracoe Fell", id: "cracoe" },
  { month: 3, day: 21, title: "Dexter–Hillsdale", id: "dexter-hillsdale" },
  { month: 3, day: 25, title: "Aztec crash claim", id: "aztec-nm" },
  { month: 3, day: 30, title: "Belgian Wave", id: "belgium-wave" },
  { month: 4, day: 1, title: "Michigan Dogman", id: "michigan-dogman", desk: "conspiracy" },
  { month: 4, day: 2, title: "Balwyn polaroid", id: "balwyn" },
  { month: 4, day: 4, title: "West Freugh", id: "west-freugh" },
  { month: 4, day: 6, title: "Westall", id: "westall" },
  { month: 4, day: 17, title: "Portage County chase", id: "portage-county" },
  { month: 4, day: 17, title: "Aurora airship", id: "aurora-airship" },
  { month: 4, day: 17, title: "Owlman of Mawnan", id: "owlman", desk: "conspiracy" },
  { month: 4, day: 19, title: "Tully saucer nests", id: "tully-nests" },
  { month: 4, day: 21, title: "Dover Demon", id: "dover-demon", desk: "conspiracy" },
  { month: 4, day: 22, title: "Loch Ness Monster", id: "nessie", desk: "conspiracy" },
  { month: 4, day: 24, title: "Socorro", id: "socorro" },
  { month: 4, day: 25, title: "Aguadilla", id: "aguadilla" },
  { month: 4, day: 25, title: "Zuiyō-maru carcass", id: "zuiyo-maru", desk: "conspiracy" },
  { month: 5, day: 7, title: "Barra da Tijuca", id: "barra-da-tijuca" },
  { month: 5, day: 8, title: "PURSUE / WAR.GOV", id: "pursue-war-gov", desk: "conspiracy" },
  { month: 5, day: 9, title: "Disclosure 2001", id: "disclosure-2001", desk: "conspiracy" },
  { month: 5, day: 10, title: "Emilcin", id: "emilcin" },
  { month: 5, day: 11, title: "McMinnville", id: "mcmminville" },
  { month: 5, day: 17, title: "Farmington armada", id: "farmington-armada" },
  { month: 5, day: 19, title: "Falcon Lake", id: "falcon-lake" },
  { month: 5, day: 20, title: "Milton Torres intercept", id: "milton-torres" },
  { month: 5, day: 21, title: "Kingman crash claim", id: "kingman-az" },
  { month: 5, day: 23, title: "Solway Spaceman", id: "solway-spaceman" },
  { month: 5, day: 24, title: "Bebedouro", id: "bebedouro" },
  { month: 5, day: 31, title: "Chessie", id: "chessie", desk: "conspiracy" },
  { month: 5, day: 31, title: "NASA UAP panel", id: "nasa-uap-panel", desk: "conspiracy" },
  { month: 6, day: 16, title: "Grafton Monster", id: "grafton-monster", desk: "conspiracy" },
  { month: 6, day: 21, title: "Maury Island", id: "maury-island" },
  { month: 6, day: 22, title: "Canary Islands 1976", id: "canary-1976" },
  { month: 6, day: 24, title: "Kenneth Arnold", id: "kenneth-arnold" },
  { month: 6, day: 25, title: "Murphysboro Mud Monster", id: "mud-monster", desk: "conspiracy" },
  { month: 6, day: 25, title: "ODNI UAP assessment", id: "odni-2021", desk: "conspiracy" },
  { month: 6, day: 26, through: 27, title: "Father Gill / Boianai", id: "father-gill" },
  { month: 6, day: 29, title: "Lizard Man", id: "lizard-man", desk: "conspiracy" },
  { month: 6, day: 30, title: "Tunguska", id: "tunguska" },
  { month: 7, day: 1, title: "Valensole", id: "valensole" },
  { month: 7, day: 2, through: 9, title: "Roswell", id: "roswell" },
  { month: 7, day: 2, title: "Tremonton film", id: "tremonton" },
  { month: 7, day: 4, title: "Jacko", id: "jacko", desk: "conspiracy" },
  { month: 7, day: 5, title: "Champ / Mansi photo", id: "champ", desk: "conspiracy" },
  { month: 7, day: 7, title: "Xiaoshan Airport", id: "xiaoshan" },
  { month: 7, day: 10, title: "Lake Worth Monster", id: "lake-worth-monster", desk: "conspiracy" },
  { month: 7, day: 11, title: "Mexico City eclipse disc", id: "mexico-eclipse" },
  { month: 7, day: 11, title: "Momo", id: "momo", desk: "conspiracy" },
  { month: 7, day: 14, title: "Nash–Fortenberry", id: "nash-fortenberry" },
  { month: 7, day: 16, title: "Trinity / San Antonio", id: "trinity-san-antonio" },
  { month: 7, day: 17, title: "RB-47", id: "rb-47" },
  { month: 7, day: 19, through: 27, title: "Washington National", id: "washington-flap" },
  { month: 7, day: 24, title: "Chiles–Whitted", id: "chiles-whitted" },
  { month: 7, day: 26, title: "Grusch hearing", id: "burchett-hearings", desk: "conspiracy" },
  { month: 7, day: 31, title: "Réunion landing", id: "reunion-1968" },
  { month: 7, day: 31, title: "Bariloche", id: "bariloche" },
  { month: 8, day: 4, title: "Calvine", id: "calvine" },
  { month: 8, day: 13, title: "Lakenheath–Bentwaters", id: "lakenheath" },
  { month: 8, day: 13, title: "Red Bluff", id: "red-bluff" },
  { month: 8, day: 15, title: "Mariana film", id: "mariana-film" },
  { month: 8, day: 16, title: "Antananarivo", id: "antananarivo" },
  { month: 8, day: 19, title: "Thetis Lake monster", id: "thetis-lake", desk: "conspiracy" },
  { month: 8, day: 21, title: "Kelly–Hopkinsville", id: "kelly-hopkinsville" },
  { month: 8, day: 25, title: "Lubbock Lights", id: "lubbock-lights" },
  { month: 8, day: 29, title: "Cussac", id: "cussac" },
  { month: 9, day: 3, title: "Exeter", id: "exeter" },
  { month: 9, day: 7, title: "Thylacine after 1936", id: "thylacine", desk: "conspiracy" },
  { month: 9, day: 10, title: "Quarouble", id: "quarouble" },
  { month: 9, day: 10, title: "Fort Monmouth", id: "fort-monmouth" },
  { month: 9, day: 12, title: "Flatwoods", id: "flatwoods" },
  { month: 9, day: 14, title: "Ubatuba", id: "ubatuba" },
  { month: 9, day: 14, title: "Prémanon", id: "premanon" },
  { month: 9, day: 16, title: "Ariel School", id: "ariel-school" },
  { month: 9, day: 19, through: 20, title: "Betty and Barney Hill", id: "hill-abduction" },
  { month: 9, day: 19, title: "Tehran", id: "tehran" },
  { month: 9, day: 19, title: "RAF Topcliffe", id: "topcliffe" },
  { month: 9, day: 20, title: "Petrozavodsk", id: "petrozavodsk" },
  { month: 9, day: 27, title: "Voronezh Park", id: "voronezh" },
  { month: 9, day: 29, title: "Van Meter Visitor", id: "van-meter", desk: "conspiracy" },
  { month: 10, day: 1, title: "Gorman dogfight", id: "gorman-dogfight" },
  { month: 10, day: 4, title: "Shag Harbour", id: "shag-harbour" },
  { month: 10, day: 4, title: "Cressy", id: "cressy" },
  { month: 10, day: 11, title: "Pascagoula", id: "pascagoula" },
  { month: 10, day: 13, title: "Aveley", id: "aveley" },
  { month: 10, day: 15, title: "Fukuoka F-61", id: "fukuoka-1948" },
  { month: 10, day: 18, title: "Coyne helicopter", id: "coyne" },
  { month: 10, day: 20, title: "Patterson–Gimlin film", id: "patterson-gimlin", desk: "conspiracy" },
  { month: 10, day: 21, title: "Valentich", id: "valentich" },
  { month: 10, day: 21, title: "Little Rissington", id: "little-rissington" },
  { month: 10, day: 21, title: "Nancy / Amaranthe", id: "nancy-amarante" },
  { month: 10, day: 24, title: "Minot AFB", id: "minot-afb" },
  { month: 10, day: 25, title: "Trunko", id: "trunko", desk: "conspiracy" },
  { month: 10, day: 26, title: "Loch Raven Dam", id: "loch-raven" },
  { month: 10, day: 27, title: "Florence Stadium", id: "florence-1954" },
  { month: 10, day: 27, title: "Northern Tier / Loring", id: "northern-tier" },
  { month: 10, day: 28, title: "Philadelphia Experiment", id: "philadelphia", desk: "conspiracy" },
  { month: 10, day: 31, title: "Wurtsmith AFB", id: "wurtsmith" },
  { month: 11, day: 2, title: "Levelland", id: "levelland" },
  { month: 11, day: 2, title: "Delphos ring", id: "delphos" },
  { month: 11, day: 2, title: "Indrid Cold", id: "indrid-cold", desk: "conspiracy" },
  { month: 11, day: 4, title: "Fort Itaipu", id: "fort-itaipu" },
  { month: 11, day: 5, title: "Travis Walton", id: "travis-walton" },
  { month: 11, day: 7, title: "O'Hare Disc", id: "ohare" },
  { month: 11, day: 9, title: "Dechmont Law", id: "dechmont" },
  { month: 11, day: 11, title: "Manises", id: "manises" },
  { month: 11, day: 11, title: "Gulf Breeze", id: "gulf-breeze" },
  { month: 11, day: 11, title: "Chilean Navy / CEFAA", id: "chile-cefaa" },
  { month: 11, day: 12, title: "Mothman", id: "mothman", desk: "conspiracy" },
  { month: 11, day: 14, title: "Nimitz / Tic Tac", id: "nimitz" },
  { month: 11, day: 17, title: "JAL 1628", id: "jal-1628" },
  { month: 11, day: 20, title: "Adamski Desert Center", id: "adamski", desk: "conspiracy" },
  { month: 11, day: 23, title: "Foo Fighters", id: "foo-fighters" },
  { month: 12, day: 1, title: "Ilkley Moor", id: "ilkley-moor" },
  { month: 12, day: 5, title: "Green fireballs", id: "green-fireballs" },
  { month: 12, day: 6, title: "Zanfretta / Torriglia", id: "zanfretta" },
  { month: 12, day: 6, title: "Langley incursions", id: "langley-drones" },
  { month: 12, day: 9, title: "Kecksburg", id: "kecksburg" },
  { month: 12, day: 11, title: "Yukon giant", id: "yukon-giant" },
  { month: 12, day: 15, title: "Silver Bridge collapse", id: "silver-bridge", desk: "conspiracy" },
  { month: 12, day: 16, title: "NYT 2017 UAP stories", id: "nyt-2017", desk: "conspiracy" },
  { month: 12, day: 21, title: "Kaikōura lights", id: "kaikoura" },
  { month: 12, day: 26, through: 28, title: "Rendlesham Forest", id: "rendlesham" },
  { month: 12, day: 29, title: "Cash–Landrum", id: "cash-landrum" },
];

/** Signature files without a single calendar date — fill the other days of the year. */
const DAILY_EXTRA: { id: string; title: string; desk: TonightDesk }[] = [
  { id: "bigfoot", title: "Bigfoot / Sasquatch", desk: "conspiracy" },
  { id: "yeti", title: "Yeti", desk: "conspiracy" },
  { id: "chupacabra", title: "Chupacabra", desk: "conspiracy" },
  { id: "skunk-ape", title: "Skunk Ape", desk: "conspiracy" },
  { id: "ogopogo", title: "Ogopogo", desk: "conspiracy" },
  { id: "area-51", title: "Area 51", desk: "conspiracy" },
  { id: "majestic-12", title: "Majestic 12", desk: "conspiracy" },
  { id: "aatip", title: "AATIP", desk: "conspiracy" },
  { id: "aawsap", title: "AAWSAP", desk: "conspiracy" },
  { id: "grusch", title: "Grusch testimony", desk: "conspiracy" },
  { id: "s4-lazar", title: "S-4 / Bob Lazar", desk: "conspiracy" },
  { id: "dulce", title: "Dulce", desk: "conspiracy" },
  { id: "hangar-18", title: "Hangar 18", desk: "conspiracy" },
  { id: "men-in-black", title: "Men in Black", desk: "conspiracy" },
  { id: "blue-book", title: "Project Blue Book", desk: "conspiracy" },
  { id: "skinwalker-ranch", title: "Skinwalker Ranch", desk: "conspiracy" },
  { id: "hitchhiker-effect", title: "Hitchhiker effect", desk: "conspiracy" },
  { id: "cattle-mutilations", title: "Cattle mutilations", desk: "conspiracy" },
  { id: "crop-circles", title: "Crop circles", desk: "conspiracy" },
  { id: "stargate-rv", title: "Stargate / remote viewing", desk: "conspiracy" },
  { id: "montauk", title: "Montauk Project", desk: "conspiracy" },
  { id: "vallee-control", title: "Vallée control system", desk: "conspiracy" },
  { id: "cryptoterrestrial", title: "Cryptoterrestrial hypothesis", desk: "conspiracy" },
  { id: "giza", title: "Great Pyramid", desk: "ancient" },
  { id: "gobekli", title: "Göbekli Tepe", desk: "ancient" },
  { id: "puma-punku", title: "Puma Punku", desk: "ancient" },
  { id: "nazca", title: "Nazca Lines", desk: "ancient" },
  { id: "antikythera", title: "Antikythera mechanism", desk: "ancient" },
  { id: "stonehenge", title: "Stonehenge", desk: "ancient" },
  { id: "teotihuacan", title: "Teotihuacan", desk: "ancient" },
  { id: "moai", title: "Rapa Nui moai", desk: "ancient" },
  { id: "sacsayhuaman", title: "Sacsayhuamán", desk: "ancient" },
  { id: "baalbek", title: "Baalbek", desk: "ancient" },
  { id: "derinkuyu", title: "Derinkuyu", desk: "ancient" },
  { id: "newgrange", title: "Newgrange", desk: "ancient" },
  { id: "nan-madol", title: "Nan Madol", desk: "ancient" },
  { id: "vimana", title: "Vimana", desk: "ancient" },
  { id: "watchers-enoch", title: "Watchers / 1 Enoch", desk: "ancient" },
  { id: "hessdalen", title: "Hessdalen lights", desk: "archive" },
  { id: "colares", title: "Colares Wave", desk: "archive" },
  { id: "gimbal", title: "Gimbal", desk: "archive" },
  { id: "buga-sphere", title: "Buga Sphere", desk: "archive" },
  { id: "ghost-rockets", title: "Ghost Rockets", desk: "archive" },
  { id: "hudson-valley", title: "Hudson Valley wave", desk: "archive" },
  { id: "stephenville", title: "Stephenville", desk: "archive" },
  { id: "needles-2008", title: "Needles crash claim", desk: "archive" },
];

export const TONIGHT_ANNIVERSARIES = ANNIVERSARIES;

const DESK_PATH: Record<TonightDesk, string> = {
  archive: "/archive",
  conspiracy: "/conspiracy",
  ancient: "/ancient",
};

export function deskOfAnniversary(row: Pick<Anniversary, "desk">): TonightDesk {
  return row.desk ?? "archive";
}

export function hrefForCase(id: string, desk: TonightDesk = "archive") {
  return `${DESK_PATH[desk]}?file=${encodeURIComponent(id)}`;
}

function stamp(month: number, day: number) {
  return month * 100 + day;
}

function matchesDay(row: Anniversary, month: number, day: number) {
  if (row.month !== month) return false;
  const end = row.through ?? row.day;
  return day >= row.day && day <= end;
}

export function anniversaryFor(date: Date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return ANNIVERSARIES.find((row) => matchesDay(row, month, day)) ?? null;
}

export function anniversariesOn(date: Date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return ANNIVERSARIES.filter((row) => matchesDay(row, month, day));
}

/** Calendar list starting at today, wrapping the year. Today’s matches come first. */
export function anniversariesFromToday(date: Date = new Date()): Anniversary[] {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const today = stamp(month, day);
  const scored = ANNIVERSARIES.map((row, index) => {
    const on = matchesDay(row, month, day);
    const start = stamp(row.month, row.day);
    const sort = on ? today : start >= today ? start : start + 1300;
    return { row, sort, index, on };
  });
  scored.sort((a, b) => a.sort - b.sort || a.index - b.index);
  return scored.map((item) => item.row);
}

export function formatAnniversaryKicker(row: Anniversary, year?: number, today = false) {
  const month = MONTHS[row.month - 1] ?? "";
  const range =
    row.through && row.through !== row.day ? `${row.day}–${row.through} ${month}` : `${row.day} ${month}`;
  const withYear = year ? `${range} ${year}` : range;
  return today ? `TODAY · ${withYear}` : withYear;
}

export function isAnniversaryToday(row: Anniversary, date: Date = new Date()) {
  return matchesDay(row, date.getMonth() + 1, date.getDate());
}

type DailySeed = { id: string; title: string; desk: TonightDesk };

const DAILY_POOL: DailySeed[] = (() => {
  const out: DailySeed[] = [];
  const seen = new Set<string>();
  for (const row of ANNIVERSARIES) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push({ id: row.id, title: row.title, desk: deskOfAnniversary(row) });
  }
  for (const row of DAILY_EXTRA) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
  }
  return out;
})();

function dayNumber(date: Date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

function pickDailySeed(date: Date): DailySeed {
  const n = DAILY_POOL.length;
  const mixed = Math.imul(dayNumber(date) ^ date.getFullYear(), 2654435761) >>> 0;
  return DAILY_POOL[mixed % n] ?? DAILY_POOL[0]!;
}

export function pickTonightFile(date: Date = new Date()): TonightPick {
  const match = anniversaryFor(date);
  if (match) {
    const desk = deskOfAnniversary(match);
    return {
      title: match.title,
      anniversary: true,
      caseId: match.id,
      href: hrefForCase(match.id, desk),
    };
  }
  const seed = pickDailySeed(date);
  return {
    title: seed.title,
    anniversary: false,
    caseId: seed.id,
    href: hrefForCase(seed.id, seed.desk),
  };
}

export function subscribeDayChange(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  let timer = 0;
  const arm = () => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
    timer = window.setTimeout(() => {
      onChange();
      arm();
    }, Math.max(250, next.getTime() - Date.now()));
  };
  arm();
  const onVis = () => {
    if (!document.hidden) onChange();
  };
  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("focus", onChange);
  return () => {
    window.clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("focus", onChange);
  };
}
