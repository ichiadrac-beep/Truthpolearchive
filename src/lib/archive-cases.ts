export type ArchiveCase = {
  id: string;
  title: string;
  place: string;
  country: string;
  year: number;
  lat: number;
  lng: number;
  summary: string;
  sources: string[];
};

export const YEAR_MIN = 1900;
export const YEAR_MAX = 2026;

export const ARCHIVE_CASES: ArchiveCase[] = [
  {
    id: "battle-of-los-angeles",
    title: "Battle of Los Angeles",
    place: "Los Angeles, California",
    country: "USA",
    year: 1942,
    lat: 34.052,
    lng: -118.244,
    summary:
      "In the early hours of 25 February 1942, air-raid sirens woke Los Angeles. Searchlights locked on a slow-moving object over the city while anti-aircraft batteries fired more than a thousand shells. No wreckage was recovered. The Army first spoke of unidentified aircraft, then of a false alarm and weather balloons. Witnesses described a large, silent craft that did not behave like a plane. The episode remains one of the first mass, wartime sightings on the U.S. West Coast.",
    sources: [
      "U.S. Army / Los Angeles Times contemporaneous reports, 26 Feb 1942",
      "National Archives — WWII West Coast air-raid records",
      "Department of War UAP collection https://www.war.gov/ufo/",
    ],
  },
  {
    id: "ghost-rockets",
    title: "Ghost Rockets",
    place: "Norrland",
    country: "Sweden",
    year: 1946,
    lat: 62.39,
    lng: 17.31,
    summary:
      "Through the summer of 1946, hundreds of reports from Sweden and neighboring states described gray-white, rocket-like objects crossing the sky, often by day, sometimes plunging into lakes. Radar and military observers logged some of the tracks. No nation claimed a test series that matched the volume. Swedish and Allied investigators treated the wave as a genuine unknown rather than a newspaper panic, and the files were never fully closed.",
    sources: [
      "Swedish Defence Staff ghost-rocket investigations, 1946",
      "CIA FOIA — Swedish ‘ghost rocket’ traffic https://www.cia.gov/readingroom/",
    ],
  },
  {
    id: "roswell",
    title: "Roswell",
    place: "Roswell, New Mexico",
    country: "USA",
    year: 1947,
    lat: 33.394,
    lng: -104.523,
    summary:
      "In July 1947 the Roswell Army Air Field announced it had recovered a 'flying disc,' then retracted the story the next day in favor of a weather balloon. Rancher Mack Brazel had found strange debris on the Foster ranch. Decades later the Air Force attributed the wreckage to Project Mogul, a classified balloon array. Witnesses, including intelligence officer Jesse Marcel, continued to describe materials that did not match balloon gear. Roswell became the template for crash-retrieval lore.",
    sources: [
      "Roswell Army Air Field press release, 8 July 1947",
      "USAF, The Roswell Report (1994 / 1997)",
      "NARA UAP records https://www.archives.gov/research/topics/uaps",
    ],
  },
  {
    id: "washington-flap",
    title: "Washington National Flap",
    place: "Washington, D.C.",
    country: "USA",
    year: 1952,
    lat: 38.852,
    lng: -77.04,
    summary:
      "On two consecutive weekends in July 1952, radar at Washington National Airport and Andrews Air Force Base tracked unknown returns over the capital. Airline crews reported lights that paced their aircraft. F-94 interceptors were scrambled; some pilots saw nothing, others saw objects that pulled away. The Air Force later blamed temperature inversions. The CIA-sponsored Robertson Panel followed, and public UFO reporting was quietly discouraged.",
    sources: [
      "Project Blue Book — Washington National cases https://www.archives.gov/research/military/air-force/ufos",
      "CIA Robertson Panel report, 1953",
      "WAR.GOV / UFO https://www.war.gov/ufo/",
    ],
  },
  {
    id: "lakenheath",
    title: "Lakenheath–Bentwaters",
    place: "RAF Lakenheath, Suffolk",
    country: "UK",
    year: 1956,
    lat: 52.406,
    lng: 0.554,
    summary:
      "On the night of 13–14 August 1956, RAF and USAF radar at Lakenheath, Bentwaters and Sculthorpe tracked up to fifteen unknowns over Suffolk. A Venom night fighter obtained a lock that the object then broke. Ground radar, airborne radar and visual reports overlapped. The Condon Report later called it a strong unknown. It is still one of the cleanest official radar-visual cases in the British file.",
    sources: [
      "UK National Archives, MoD UFO files (DEFE 24 / DEFE 31)",
      "University of Colorado, Condon Report case 2 (1969)",
      "USAF / RAF duty logs as later released",
    ],
  },
  {
    id: "trindade",
    title: "Trindade Island",
    place: "Trindade Island",
    country: "Brazil",
    year: 1958,
    lat: -20.508,
    lng: -29.321,
    summary:
      "On 16 January 1958, during a Brazilian Navy oceanographic voyage, photographer Almiro Baraúna shot a Saturn-shaped object passing over Trindade Island. Several officers and sailors also saw it. The prints were examined by the Navy and released with a statement that the object was real and unexplained. Skeptics later argued for a double-exposure trick; the shipboard witnesses did not recant. It remains Brazil’s best-documented mid-century case.",
    sources: [
      "Brazilian Navy hydrographic voyage report, 1958",
      "Força Aérea Brasileira UFO archive (2004–2008 declassification)",
      "Arquivo Nacional (Brasil) — FAB UFO boxes",
    ],
  },
  {
    id: "socorro",
    title: "Socorro / Lonnie Zamora",
    place: "Socorro, New Mexico",
    country: "USA",
    year: 1964,
    lat: 34.058,
    lng: -106.891,
    summary:
      "Police officer Lonnie Zamora chased a roaring flame into the desert outside Socorro on 24 April 1964. He found an oval craft on legs and two small figures in white coveralls. The object lifted off with a blast that scorched the ground and left landing impressions. Project Blue Book investigator J. Allen Hynek called Zamora an outstanding witness. No aircraft or NASA test was ever matched to the site.",
    sources: [
      "Project Blue Book, Socorro case file https://www.archives.gov/research/military/air-force/ufos",
      "J. Allen Hynek field notes, April 1964",
    ],
  },
  {
    id: "valensole",
    title: "Valensole",
    place: "Valensole, Alpes-de-Haute-Provence",
    country: "France",
    year: 1965,
    lat: 43.838,
    lng: 5.984,
    summary:
      "Farmer Maurice Masse was working his lavender field at dawn on 1 July 1965 when he saw an egg-shaped machine on the ground and two small beings examining plants. One pointed a tube; Masse froze. The craft departed, leaving a hardened, chemically altered patch of soil where lavender would not grow for years. Gendarmerie and GEIPAN files treat Valensole as a high-strangeness close encounter, not a misidentified tractor.",
    sources: [
      "GEIPAN / CNES case file — Valensole 1965 https://geipan.fr/",
      "Gendarmerie nationale procès-verbal, July 1965",
    ],
  },
  {
    id: "kecksburg",
    title: "Kecksburg",
    place: "Kecksburg, Pennsylvania",
    country: "USA",
    year: 1965,
    lat: 40.185,
    lng: -79.461,
    summary:
      "On the evening of 9 December 1965 a fireball crossed several U.S. states and appeared to fall in the woods near Kecksburg. Villagers described an acorn-shaped object with a bronze surface and hieroglyph-like markings. Military trucks sealed the area; NASA later said it had searched for a satellite fragment and found nothing. FOIA suits extracted heavily redacted files. The object, if it landed, was removed that night.",
    sources: [
      "NASA / U.S. Army FOIA releases on the Kecksburg search",
      "NARA UAP collection https://www.archives.gov/research/topics/uaps",
    ],
  },
  {
    id: "westall",
    title: "Westall",
    place: "Clayton South, Melbourne",
    country: "Australia",
    year: 1966,
    lat: -37.941,
    lng: 145.163,
    summary:
      "Around 11 a.m. on 6 April 1966, more than two hundred students and teachers at Westall High School watched a silver disc descend toward the Grange Reserve, then shoot away. Some reported a second or third object and men in uniform on the ground afterward. The Victorian Education Department and RAAF offered little public explanation. It is still Australia’s largest group sighting.",
    sources: [
      "RAAF UFO policy files, National Archives of Australia",
      "Victorian contemporaneous press and witness statements, April 1966",
    ],
  },
  {
    id: "shag-harbour",
    title: "Shag Harbour",
    place: "Shag Harbour, Nova Scotia",
    country: "Canada",
    year: 1967,
    lat: 43.494,
    lng: -65.713,
    summary:
      "Just before midnight on 4 October 1967, witnesses on the Nova Scotia coast saw a low, lighted object hit the water with a flash and leave a yellow foam on the surface. RCMP, Coast Guard, and Navy divers searched for an aircraft and found none. Canadian official files still list it as an unsolved UFO crash into the sea — a rare case where the government paper trail agrees something entered the water.",
    sources: [
      "RCMP and Canadian Forces message traffic, Oct 1967",
      "Library and Archives Canada — Shag Harbour UFO file",
    ],
  },
  {
    id: "berwyn",
    title: "Berwyn Mountain",
    place: "Llandrillo, Wales",
    country: "UK",
    year: 1974,
    lat: 52.9,
    lng: -3.38,
    summary:
      "On 23 January 1974 a tremor shook the Berwyn range. Villagers reported a brilliant light on the mountain and what they took for an aircraft down. Police, soldiers, and a UFO patrol reached the slopes; no wreckage was logged. The British Geological Survey later called it an earthquake coincident with a meteor. Locals still describe a military cordon and a green glow that did not behave like a fireball.",
    sources: [
      "UK National Archives, MoD UFO files",
      "British Geological Survey earthquake bulletin, Jan 1974",
    ],
  },
  {
    id: "tehran",
    title: "Tehran Flyby",
    place: "Tehran",
    country: "Iran",
    year: 1976,
    lat: 35.689,
    lng: 51.389,
    summary:
      "After midnight on 19 September 1976, Iranian Air Force F-4s were scrambled to intercept a bright object over Tehran. Avionics and communications failed as the jets closed; a smaller object appeared to leave the primary craft. Radar on the ground and in the air correlated the visual. A U.S. Defense Intelligence memo rated the report outstanding. It is one of the strongest military-pilot cases on record.",
    sources: [
      "DIA Defense Information Report, Sept 1976 (Iranian F-4 intercept)",
      "CIA FOIA reading room — Tehran UFO https://www.cia.gov/readingroom/",
      "WAR.GOV / UFO https://www.war.gov/ufo/",
    ],
  },
  {
    id: "petrozavodsk",
    title: "Petrozavodsk Phenomenon",
    place: "Petrozavodsk, Karelia",
    country: "Russia",
    year: 1977,
    lat: 61.784,
    lng: 34.347,
    summary:
      "Before dawn on 20 September 1977 a huge jellyfish-shaped glow hung over Petrozavodsk, lighting streets and punching apparent holes in windows. The display was seen from Finland to Lithuania. TASS carried the story. The Soviet Academy of Sciences opened an inquiry; later official lines pointed at a Kosmos-class rocket. Independent optical work has never fully closed the ground damage or the duration. It is the USSR’s most public official-wave case.",
    sources: [
      "TASS dispatch, 20–23 September 1977",
      "Soviet Academy of Sciences / later Roscosmos commentary on Kosmos-955",
      "Finnish and Baltic contemporaneous meteorological logs",
    ],
  },
  {
    id: "colares",
    title: "Colares Wave",
    place: "Colares, Pará",
    country: "Brazil",
    year: 1977,
    lat: -0.936,
    lng: -48.28,
    summary:
      "Through 1977 the island of Colares and nearby villages reported lights that beamed onto people, leaving puncture burns and anemia. The Brazilian Air Force ran Operação Prato, photographing objects and taking medical notes. Colonel Uyrangê Hollanda later confirmed the investigation. Officials eventually left; the photographs and internal reports survived. It is among the few cases with a named military operation and clinical injuries.",
    sources: [
      "Força Aérea Brasileira — Operação Prato files (declassified)",
      "Arquivo Nacional (Brasil), FAB UFO series",
      "Col. Uyrangê Hollanda interviews on the official investigation",
    ],
  },
  {
    id: "broad-haven",
    title: "Broad Haven",
    place: "Broad Haven, Pembrokeshire",
    country: "UK",
    year: 1977,
    lat: 51.787,
    lng: -5.101,
    summary:
      "In February 1977, schoolchildren at Broad Haven Primary drew the same cigar-shaped craft they said had landed in a field beside the playground. Teachers and, later, hotel staff in the Stack Rocks area reported silver suits and a similar machine. The cluster became known as the Welsh Triangle. Police took statements; the Ministry of Defence filed the drawings. No conventional aircraft was identified.",
    sources: [
      "UK National Archives, MoD UFO files — Broad Haven 1977",
      "Dyfed-Powys Police statements, Feb 1977",
    ],
  },
  {
    id: "valentich",
    title: "Valentich Disappearance",
    place: "Bass Strait",
    country: "Australia",
    year: 1978,
    lat: -39.15,
    lng: 146.35,
    summary:
      "On 21 October 1978, twenty-year-old pilot Frederick Valentich radioed Melbourne Flight Service that an elongated craft was orbiting his Cessna 182 over Bass Strait. His last words described a metallic object that was not an aircraft. Neither plane nor body was found. The Australian Department of Transport listed the cause as unknown. It is the rare disappearance in which the pilot narrates a UFO in real time.",
    sources: [
      "Australian Department of Transport accident file, VH-DSJ, 1978",
      "Melbourne Flight Service transcript, 21 Oct 1978",
      "National Archives of Australia",
    ],
  },
  {
    id: "florence-1954",
    title: "Florence Stadium",
    place: "Florence",
    country: "Italy",
    year: 1954,
    lat: 43.77,
    lng: 11.254,
    summary:
      "On 27 October 1954 a Fiorentina–Pistoiese match at the Stadio Comunale stopped as a silvery craft crossed the ground and a sticky, thread-like fallout (‘angel hair’) drifted onto the stands. Players and thousands of spectators saw it. Italian Air Force and carabinieri notes exist; later chemical talk of migrating spiders never satisfied the stadium crowd. It is Italy’s best-attended official-era daylight case.",
    sources: [
      "Aeronautica Militare / contemporaneous carabinieri notes, Oct 1954",
      "Italian press pool, 27–28 October 1954",
      "CISU archive of the 1954 Italian wave",
    ],
  },
  {
    id: "rendlesham",
    title: "Rendlesham Forest",
    place: "Rendlesham Forest, Suffolk",
    country: "UK",
    year: 1980,
    lat: 52.087,
    lng: 1.447,
    summary:
      "Between 26 and 28 December 1980, U.S. Air Force personnel from RAF Woodbridge investigated lights in Rendlesham Forest. Deputy base commander Lt. Col. Charles Halt recorded a memo and an audio tape as radiation readings spiked near a triangular craft that moved through the trees. Orford Ness lighthouse is the favored prosaic explanation; Halt and several airmen reject it. The case is Britain’s best-documented military close encounter.",
    sources: [
      "Halt memo to RAF/USAF command, 13 Jan 1981",
      "UK National Archives, MoD UFO files — Rendlesham",
      "WAR.GOV / UFO https://www.war.gov/ufo/",
    ],
  },
  {
    id: "trans-en-provence",
    title: "Trans-en-Provence",
    place: "Trans-en-Provence, Var",
    country: "France",
    year: 1981,
    lat: 43.504,
    lng: 5.975,
    summary:
      "On 8 January 1981 Renato Nicolai reported a disc that landed on his property, leaving two concentric traces. Gendarmerie measurements and CNES/GEPAN soil analysis found compacted earth and chlorophyll stress in the ring. GEIPAN still carries the case as a physical-trace unknown. It is the French official program’s most cited landing.",
    sources: [
      "GEIPAN / GEPAN technical note on Trans-en-Provence https://geipan.fr/",
      "Gendarmerie nationale, procès-verbal 8–9 Jan 1981",
    ],
  },
  {
    id: "brazil-1986",
    title: "Official Night of UFOs",
    place: "São José dos Campos / São Paulo FIR",
    country: "Brazil",
    year: 1986,
    lat: -23.186,
    lng: -45.884,
    summary:
      "On the night of 19 May 1986, CINDACTA radar and multiple air-defence fighters tracked and visually engaged unidentified lights over São Paulo state. The Brazilian Air Force later held a press conference: objects were real, detected on radar and by pilots, and not explained as civil traffic. It is still called ‘a noite oficial dos UFOs’ — one of the few cases in which a national air force said so in public.",
    sources: [
      "Força Aérea Brasileira press conference, 23 May 1986",
      "CINDACTA / COMDABRA radar and intercept logs (later declassified)",
      "Arquivo Nacional (Brasil), FAB UFO series",
    ],
  },
  {
    id: "dalnegorsk",
    title: "Height 611 / Dalnegorsk",
    place: "Dalnegorsk, Primorsky Krai",
    country: "Russia",
    year: 1986,
    lat: 44.554,
    lng: 135.57,
    summary:
      "On 29 January 1986 a glowing object struck or settled on Izvestkovaya hill (‘Height 611’) above Dalnegorsk. Local officials, Izvestia correspondents and later Academy-linked chemists collected glassy slag, lead balls and mesh-like metal. Soviet civil and military notes exist; the prosaic line is a failed craft or a bolide. The samples remain the USSR Far East’s best-known physical-trace file.",
    sources: [
      "Izvestia and local soviet reporting, 1986",
      "Far Eastern geological / Academy sample notes as later published",
    ],
  },
  {
    id: "jal-1628",
    title: "JAL Flight 1628",
    place: "Interior Alaska",
    country: "USA",
    year: 1986,
    lat: 66.16,
    lng: -147.0,
    summary:
      "On 17 November 1986, Japan Airlines cargo flight 1628, a Boeing 747, reported two small objects and a huge dark craft pacing the aircraft over Alaska. Captain Kenju Terauchi described lights that matched his 747’s speed for minutes. Anchorage FAA radar and a military controller logged unknown traffic. The FAA interviewed the crew; a later CIA/FAA review downplayed the radar. The flight data and voice tape still exist.",
    sources: [
      "FAA interview with Capt. Kenju Terauchi, 1986",
      "NTSB / FAA JAL 1628 traffic and radar notes",
      "CIA / FAA later review (FOIA)",
    ],
  },
  {
    id: "voronezh",
    title: "Voronezh Park",
    place: "Voronezh",
    country: "Russia",
    year: 1989,
    lat: 51.661,
    lng: 39.2,
    summary:
      "In September 1989 TASS reported that children and then militia in a Voronezh park had seen a landing craft and tall beings. Soviet police took statements; the story ran worldwide because the official news agency carried it. Later walk-backs blamed mass psychology. The militia paper trail is real even if the beings are not settled. It is the late-Soviet Union’s most official close-encounter dispatch.",
    sources: [
      "TASS bulletin, September 1989",
      "Voronezh militia witness protocols as reported by Soviet press",
    ],
  },
  {
    id: "belgium-wave",
    title: "Belgian Wave",
    place: "Wavre",
    country: "Belgium",
    year: 1989,
    lat: 50.717,
    lng: 4.612,
    summary:
      "From November 1989 through 1990, thousands of Belgians reported a large, silent triangular craft with lights at each corner. Police officers at Eupen filed the first detailed log. On 30 March 1990, F-16s locked radar on an object that executed impossible accelerations before breaking lock. SOBEPS collected reports; the Belgian Air Force released radar plots. No NATO aircraft matched the triangle.",
    sources: [
      "Belgian Air Force F-16 radar plots, 30 March 1990",
      "Police of Eupen, Nov 1989 log",
      "Belgian Defence public file on the 1989–90 wave",
    ],
  },
  {
    id: "calvine",
    title: "Calvine",
    place: "Calvine, Perthshire",
    country: "UK",
    year: 1990,
    lat: 56.763,
    lng: -3.962,
    summary:
      "On 4 August 1990 two walkers photographed a diamond-shaped object with a military jet in the same frame near Calvine. The colour print reached the Ministry of Defence, was graded, then vanished from public view until 2022. MoD captions treated it as unexplained. It is now the sharpest official UK still of the late Cold War.",
    sources: [
      "UK National Archives, MoD UFO files — Calvine photograph",
      "MoD captions and later 2022 public release of the print",
    ],
  },
  {
    id: "cosford",
    title: "RAF Cosford",
    place: "RAF Cosford, Shropshire",
    country: "UK",
    year: 1993,
    lat: 52.643,
    lng: -2.306,
    summary:
      "In the early hours of 31 March 1993, RAF Cosford and Shawbury logged a large, lighted craft that passed the stations at low level with a deep hum. Multiple airmen and police called it in. The MoD’s later Condign study reviewed the night. No NOTAM matched a helicopter that size on that track.",
    sources: [
      "UK National Archives — RAF Cosford / Shawbury logs, 31 Mar 1993",
      "MoD Project Condign (UAPs in the UK Air Defence Region, 2000)",
    ],
  },
  {
    id: "ariel-school",
    title: "Ariel School",
    place: "Ruwa",
    country: "Zimbabwe",
    year: 1994,
    lat: -17.89,
    lng: 31.245,
    summary:
      "On 16 September 1994, during morning break, sixty-plus pupils at Ariel School saw a disc land beyond the playground. Several described small beings in black and a message about technology and the Earth. Harvard psychiatrist John Mack interviewed the children shortly afterward; their drawings and testimony were consistent. Teachers did not see the landing. It is Africa’s most closely studied mass-childhood encounter.",
    sources: [
      "John E. Mack interviews, Ariel School, 1994",
      "Zimbabwe contemporaneous press and school statements",
    ],
  },
  {
    id: "varginha",
    title: "Varginha",
    place: "Varginha, Minas Gerais",
    country: "Brazil",
    year: 1996,
    lat: -21.551,
    lng: -45.43,
    summary:
      "In January 1996 the city of Varginha reported a downed creature — oily brown skin, red eyes — seen by three young women, then allegedly recovered by the army and fire service. A second being was said to have died in a military hospital. Officials denied everything. Journalists documented troop movements and a hospital lock-down. Varginha became Brazil’s Roswell: contested, local, and never cleanly explained.",
    sources: [
      "Brazilian Army / fire service contemporaneous denials and local logs",
      "FAB UFO archive context, Arquivo Nacional",
    ],
  },
  {
    id: "phoenix-lights",
    title: "Phoenix Lights",
    place: "Phoenix, Arizona",
    country: "USA",
    year: 1997,
    lat: 33.448,
    lng: -112.074,
    summary:
      "On 13 March 1997 a V-shaped formation of lights drifted from Nevada across Phoenix to Tucson. Governor Fife Symington later said he saw a craft 'otherworldly' in size. The USAF attributed a second set of flares over the Barry Goldwater range; that does not cover the earlier, silent triangle seen by thousands along a 300-mile path. Video, 911 logs, and police reports survive.",
    sources: [
      "Luke AFB / USAF flare statement, 1997",
      "City of Phoenix 911 and police logs, 13 Mar 1997",
      "WAR.GOV / UFO https://www.war.gov/ufo/",
    ],
  },
  {
    id: "sapporo-jsdf",
    title: "Hokkaido / JASDF unknowns",
    place: "Sapporo, Hokkaido",
    country: "Japan",
    year: 1972,
    lat: 43.062,
    lng: 141.354,
    summary:
      "Through the 1970s the Japan Air Self-Defense Force and civilian radar in Hokkaido logged unknowns that did not square with Soviet or Japanese flight plans — lights that hovered, then left the plot. Diet questions and later Defence Ministry summaries treated some tracks as unidentified. Japan did not keep a public Blue Book, but the JASDF plots are an official Asian military file.",
    sources: [
      "Japan Ministry of Defense historical summaries / Diet replies on unidentified aircraft",
      "JASDF Hokkaido air-defence practice logs as later cited",
    ],
  },
  {
    id: "iwakuni",
    title: "MCAS Iwakuni",
    place: "Iwakuni, Yamaguchi",
    country: "Japan",
    year: 1956,
    lat: 34.146,
    lng: 132.236,
    summary:
      "U.S. Marine and Navy crews at Iwakuni, a joint Japan–U.S. station, filed multiple 1950s reports of discs and lights over the base and the Inland Sea. Blue Book and Pacific Air Forces traffic carried some of them. The site sits on the official U.S.–Japan air-defence chain, which is why the reports survived in American files even when Tokyo stayed quiet.",
    sources: [
      "Project Blue Book — Far East / Iwakuni cards https://www.archives.gov/research/military/air-force/ufos",
      "Pacific Air Forces message traffic (FOIA)",
    ],
  },
  {
    id: "nimitz",
    title: "Nimitz / Tic Tac",
    place: "Off San Diego",
    country: "USA",
    year: 2004,
    lat: 31.6,
    lng: -118.9,
    summary:
      "In November 2004, USS Princeton radar tracked objects dropping from 80,000 feet to sea level in less than a second. Commander David Fravor intercepted a white, tic-tac-shaped craft that mirrored his F/A-18, then accelerated out of sight. A second crew filmed the FLIR1 video later released by the Pentagon. The incident sat inside a classified AATIP brief and helped reopen official UAP study in Congress.",
    sources: [
      "Pentagon / AARO — FLIR1 video https://www.aaro.mil/uap-cases/official-uap-imagery/",
      "WAR.GOV / UFO https://www.war.gov/ufo/",
      "U.S. Navy UAP reporting guidance, 2019–",
    ],
  },
  {
    id: "ohare",
    title: "O'Hare Disc",
    place: "O'Hare International, Chicago",
    country: "USA",
    year: 2006,
    lat: 41.974,
    lng: -87.907,
    summary:
      "At about 4:15 p.m. on 7 November 2006, United Airlines staff at Gate B17 saw a dark disc hovering under the overcast, then shoot up through the cloud, leaving a crisp hole. Multiple ramp workers and a mechanic signed off on the sighting. The FAA first denied a report, then called it a weather phenomenon. No NOTAM or aircraft track accounted for a stationary object over an active taxiway.",
    sources: [
      "FAA record of the O’Hare 2006 report",
      "United Airlines employee statements, Nov 2006",
    ],
  },
  {
    id: "india-iaf",
    title: "Indian Air Force western sector",
    place: "Jaisalmer sector, Rajasthan",
    country: "India",
    year: 2007,
    lat: 26.916,
    lng: 70.913,
    summary:
      "Indian Air Force units on the western front have repeatedly logged unidentified returns and night lights that did not match civil or Pakistani flight plans. 2007 filings and later IAF / Ministry of Defence replies to Parliament treated some incidents as unidentified, not hostile aircraft. The paper is thin in public, but it is an official Asian air-defence file rather than a newspaper flap.",
    sources: [
      "Lok Sabha / Rajya Sabha Defence replies on unidentified aircraft",
      "Indian Air Force western-sector incident summaries as reported",
    ],
  },
  {
    id: "xiaoshan",
    title: "Xiaoshan Airport",
    place: "Hangzhou Xiaoshan International",
    country: "China",
    year: 2010,
    lat: 30.236,
    lng: 120.431,
    summary:
      "On the evening of 7 July 2010 a descending aircrew reported an unknown object over Hangzhou Xiaoshan Airport. CAAC / Xiaoshan closed the field for about an hour: outbound flights held, inbound diverted. Eighteen movements were hit. Airport spokesman Ruan Zhoucheng said the object was not a normal civil flight and that no conclusion had been drawn. People’s Daily later floated aircraft in radar blind spots. The closure itself is the official fact.",
    sources: [
      "Civil Aviation Administration of China / Xiaoshan Airport statement, 7–8 July 2010",
      "Xinhua and People’s Daily coverage of the CAAC inquiry",
      "ABC News, 14 July 2010 — official closure report https://abcnews.go.com/International/ufo-china-closes-airport-prompts-investigation/story?id=11159531",
    ],
  },
  {
    id: "aguadilla",
    title: "Aguadilla",
    place: "Aguadilla",
    country: "Puerto Rico",
    year: 2013,
    lat: 18.495,
    lng: -67.136,
    summary:
      "On 25 April 2013 a U.S. Customs and Border Protection Dash-8 recorded infrared video of an object flying along the Aguadilla coast, entering the water without splash, then appearing to split. SCU analysis argued the kinematics did not match a bird, balloon, or aircraft. DHS has not issued a public identification. The video is one of the cleaner government-sensor cases of the 2010s.",
    sources: [
      "U.S. Customs and Border Protection infrared video, 25 Apr 2013",
      "AARO / DHS later commentary on sensor cases https://www.aaro.mil/",
    ],
  },
  {
    id: "chile-cefaa",
    title: "Chilean Navy / CEFAA",
    place: "Off the Atacama coast",
    country: "Chile",
    year: 2014,
    lat: -27.37,
    lng: -70.33,
    summary:
      "In 2014 a Chilean Navy helicopter recorded a dark object with a plume against the ocean. The government’s CEFAA (Committee for the Study of Anomalous Aerial Phenomena) released the video and a case file after years of analysis, stating the object was not identified as an aircraft, planet, or bird. It is South America’s cleanest official-sensor release of the 2010s.",
    sources: [
      "CEFAA / DGAC Chile — official case release",
      "Chilean Navy helicopter video, 2014",
    ],
  },
  {
    id: "gimbal",
    title: "Gimbal",
    place: "Off Jacksonville, Florida",
    country: "USA",
    year: 2015,
    lat: 30.22,
    lng: -79.85,
    summary:
      "In 2015, Navy aircrew from USS Theodore Roosevelt recorded the Gimbal video: a rotating, saucer-like IR object against a glare, with a fleet of similar returns on the radar display. The clip was later acknowledged by the Pentagon alongside GoFast and FLIR1. Pilots described objects that stayed with carrier groups for days. The files fed the 2020–21 UAP Task Force reporting to Congress.",
    sources: [
      "Pentagon confirmation of Gimbal, GoFast, FLIR1",
      "AARO official UAP imagery https://www.aaro.mil/uap-cases/official-uap-imagery/",
      "WAR.GOV / UFO https://www.war.gov/ufo/",
    ],
  },
  {
    id: "etna-aaro",
    title: "Mt. Etna object",
    place: "Mount Etna, Sicily",
    country: "Italy",
    year: 2018,
    lat: 37.751,
    lng: 14.995,
    summary:
      "In December 2018 a U.S. Air Force uncrewed platform recorded an object that appeared to transit the ash plume of Mt. Etna. AARO published the clip as official UAP imagery and, after an interagency study, assessed a balloon distorted by the volcanic atmosphere — with moderate confidence. Italy sits in the frame; the file is a rare named European sensor case on an American official site.",
    sources: [
      "AARO — Mt. Etna object https://www.aaro.mil/uap-cases/official-uap-imagery/",
      "WAR.GOV / UFO https://www.war.gov/ufo/",
    ],
  },
  {
    id: "japan-mod-uap",
    title: "Japan MoD UAP order",
    place: "Ichigaya, Tokyo",
    country: "Japan",
    year: 2020,
    lat: 35.694,
    lng: 139.735,
    summary:
      "In September 2020 the Japan Ministry of Defense issued a force-wide instruction: Self-Defense Forces aircraft and ships were to photograph and report unidentified aerial objects, following the U.S. Navy’s lead. It is not a single sighting. It is the official Asian policy turn — JSDF crews now file UAP the way NATO pilots do. Later Diet answers confirmed the order stands.",
    sources: [
      "Japan Ministry of Defense instruction on unidentified aerial objects, Sept 2020",
      "Diet replies on JSDF UAP reporting",
      "AARO international partnership notes https://www.aaro.mil/",
    ],
  },
  {
    id: "korea-adf",
    title: "ROK air-defence unknowns",
    place: "Cheongju / central sector",
    country: "South Korea",
    year: 2011,
    lat: 36.637,
    lng: 127.49,
    summary:
      "Republic of Korea Air Force and combined U.S.–ROK air defence have a long unclassified tail of unidentified tracks over the peninsula — some Korean War ‘foo fighter’ reports in USAF files, later ROKAF intercepts of lights that were not North Korean airframes. Public Ministry of National Defense answers treat a subset as unidentified. The peninsula is one of the densest official radar environments in Asia.",
    sources: [
      "USAF Korean War unknown / ‘foo fighter’ cards (Blue Book / PACAF)",
      "Republic of Korea MND parliamentary replies on unidentified aircraft",
    ],
  },
  {
    id: "clark-ab",
    title: "Clark Air Base",
    place: "Clark Air Base, Luzon",
    country: "Philippines",
    year: 1953,
    lat: 15.186,
    lng: 120.56,
    summary:
      "U.S. Far East Air Forces crews at Clark filed 1950s reports of discs and lights over Luzon, some with radar. Blue Book carried Clark and nearby Philippine cases as official military paper, not folklore. After the U.S. left, the Philippine Air Force inherited a thinner public file, but the 1950s traffic remains in American archives.",
    sources: [
      "Project Blue Book — Clark AB / Philippines cards",
      "Pacific Air Forces FOIA fragments",
    ],
  },
  {
    id: "buga-sphere",
    title: "Buga Sphere",
    place: "Buga, Valle del Cauca",
    country: "Colombia",
    year: 2025,
    lat: 3.9,
    lng: -76.302,
    summary:
      "On 2 March 2025 videos showed a small metallic sphere manoeuvring over Buga, Colombia, before a three-layered orb was recovered on the ground. Radiologist José Luis Velásquez said scans showed no welds or joints. The object is in private custody, not a seized FAB or Colombian Air Force trophy, but it is the live Latin American retrieval story — often filed next to Brazil’s official sphere-and-disc tradition. Labs and U.S. visitors have looked; no state has issued a closing identification.",
    sources: [
      "Local Buga / Valle del Cauca reports, March 2025",
      "Newsweek, 25 May 2025 — Buga sphere analysis https://www.newsweek.com/ufo-discovered-colombia-scientist-weighs-2076884",
      "For context on Brazil’s official sphere cases: FAB archive, Trindade 1958 and 1986 CINDACTA night",
    ],
  },
];
