export type ArchiveCase = {
  id: string;
  title: string;
  place: string;
  country: string;
  year: number;
  lat: number;
  lng: number;
  summary: string;
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
  },
];
