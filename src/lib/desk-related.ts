/** Real desk-to-desk relations. Only ids that exist as files; no guessed matches. */
const CLUSTERS: string[][] = [
  // Conspiracy
  ["majestic-12", "hangar-18", "dulce", "magenta-1933"],
  ["area-51", "s4-lazar", "egg-g", "hangar-18", "skunk-works-uap"],
  ["bennewitz", "dulce"],
  ["blue-book", "project-sign", "project-grudge", "estimate-of-situation", "condon-committee", "robertson-panel", "hynek-cufos"],
  ["project-sign", "estimate-of-situation", "project-grudge"],
  ["aatip", "aawsap", "nyt-2017", "ttsa", "elizondo-title", "five-observables", "mellon-drop"],
  ["aawsap", "baass-report", "nids", "kona-blue", "hitchhiker-effect"],
  ["nyt-2017", "fravor-testimony", "gimbal-glare", "gofast-debate", "roosevelt-incursions"],
  ["grusch", "wilson-davis", "legacy-program", "immaculate-constellation", "uap-disclosure-act", "burchett-hearings"],
  ["uap-disclosure-act", "gillibrand", "burchett-hearings"],
  ["odni-2021", "uaptf", "nasa-uap-panel", "aaro-historical", "pursue-war-gov"],
  ["pursue-war-gov", "aaro-historical", "kirkpatrick"],
  ["flying-saucer-working-party", "condign", "uk-files-release", "nick-pope"],
  ["project-magnet", "second-storey", "wilbert-smith-memo"],
  ["geipan", "cometa"],
  ["galileo-project", "oumuamua", "im1-spherules"],
  ["nazca-mummies", "maussan-congress", "atacama-mummy"],
  ["hopkins-intruders", "strieber-communion", "linda-cortile", "andreasson", "peer-mack"],
  ["malmstrom-cover", "nuclear-correlation"],
  ["stargate-rv", "montauk"],
  ["adamski", "contactee-giant-rock"],
  ["cia-haines", "fbi-vault", "robertson-panel"],
  ["nj-drones-2024", "chinese-balloon"],
  // Ancient / contact
  ["giza", "sphinx", "bent-pyramid", "osirion", "serapeum", "osiris-shaft", "pyramid-texts-stars"],
  ["nazca", "acre-geoglyphs", "atacama-giant", "blythe-intaglios", "paracas-skulls"],
  ["gobekli", "karahan-tepe", "nevali-cori"],
  ["puma-punku", "gate-of-the-sun", "sacsayhuaman", "viracocha-andes"],
  ["sacsayhuaman", "ollantaytambo", "machu-picchu", "coricancha"],
  ["moai", "vinapu", "nan-madol", "haamonga"],
  ["ggantija", "mnajdra", "hagar-qim", "hypogeum"],
  ["stonehenge", "avebury", "silbury", "newgrange", "knowth"],
  ["derinkuyu", "kaymakli"],
  ["baalbek", "pregnant-stone"],
  ["teotihuacan", "cholula", "olmec-heads"],
  ["atlantis-plato", "bimini-road", "richat", "piri-reis", "hapgood-maps"],
  ["anunnaki-eridu", "anunnaki-council", "enki-me", "enlil-nippur", "nibiru-sitchin", "apkallu-sages", "oannes-berossus"],
  ["watchers-enoch", "hermon-descent", "nephilim", "azazel-arts", "book-of-giants", "genesis-6", "jubilees-watchers", "dead-sea-enoch", "shemihazah"],
  ["viracocha-andes", "quetzalcoatl-teacher"],
  ["osiris-civilizer", "thoth-teacher", "edfu-texts", "pyramid-texts-stars"],
  ["ezekiel-wheels", "elijah-chariot"],
  ["vimana", "sakwala"],
];

function buildMap() {
  const map = new Map<string, Set<string>>();
  const add = (from: string, to: string) => {
    if (!from || !to || from === to) return;
    let set = map.get(from);
    if (!set) {
      set = new Set();
      map.set(from, set);
    }
    set.add(to);
  };
  for (const cluster of CLUSTERS) {
    for (const a of cluster) {
      for (const b of cluster) add(a, b);
    }
  }
  const out: Record<string, string[]> = {};
  for (const [id, set] of map) out[id] = [...set];
  return out;
}

export const RELATED_BY_ID: Record<string, string[]> = buildMap();
