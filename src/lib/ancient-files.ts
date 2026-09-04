import type { DeskFile } from "@/lib/desk-file";
import { ANCIENT_FILES_CONTACT } from "@/lib/ancient-files-contact";
import { ANCIENT_FILES_EXTRA } from "@/lib/ancient-files-extra";
import { withAncientFolklore } from "@/lib/ancient-folklore";

export const ANCIENT_FILES: DeskFile[] = withAncientFolklore([
  {
    id: "giza",
    title: "Great Pyramid, Giza",
    kicker: "c. 2560 BCE",
    subtitle: "Giza plateau, Egypt · Khufu",
    lede: "The largest stone pyramid on Earth. Engineering facts are not in dispute; the workforce story and interior voids still move.",
    summary:
      "The Great Pyramid of Khufu is a limestone and granite monument of about 2.3 million blocks, original height 146.6 m. Mainstream Egyptology dates it to the Fourth Dynasty and attributes it to a skilled seasonal workforce, not slaves in the Hollywood sense. Fringe contact literature treats the precision, the alignment to true north, and the newly mapped interior voids as signs of lost or non-human technique. No inscription inside the king’s chamber names an architect from elsewhere.",
    body: "The ScanPyramids project (2015–) confirmed a large void above the Grand Gallery. Copper tools, ramps, and harbor works are archaeologically attested on the plateau. What remains debated is the exact lifting method for the 50-ton granite beams and why the internal plan is so unlike a simple tomb. Ancient-astronaut readings fill that gap with craft and knowledge transfer; Egyptologists fill it with incremental Old Kingdom practice.",
    evidence:
      "Datable: worker graffiti, nearby workers’ town, Khufu cartouches in relieving chambers (discovered 19th century), and quarry marks. Not found: machine-tool marks of a modern kind, or an artifact that requires an off-world workshop. Alignment error to true north is a few arcminutes.",
    sources: [
      "Mark Lehner, The Complete Pyramids",
      "ScanPyramids / HIP Institute void papers (Nature, 2017)",
      "Giza Plateau Mapping Project field reports",
    ],
    image: {
      src: "/ancient/giza.jpg",
      alt: "The Great Pyramid of Khufu on the Giza plateau",
      credit: "Wikimedia Commons",
    },
    lat: 29.979,
    lng: 31.134,
    place: "Giza plateau",
    country: "Egypt",
    year: -2560,
  },
  {
    id: "nazca",
    title: "Nazca Lines",
    kicker: "c. 100 BCE–800 CE",
    subtitle: "Nazca Desert, Peru · geoglyphs",
    lede: "Animals and runways of packed earth, visible as a set from the air. Made by people who walked the lines.",
    summary:
      "The Nazca geoglyphs are shallow etchings in desert pavement: a hummingbird, spider, monkey, and long trapezoids stretching across the pampa. They were made by removing dark stones to show lighter ground, mostly between 100 BCE and 800 CE. Erich von Däniken asked why a culture without aircraft would draw for the sky. Archaeologists point to ritual pathways, water cults, and the fact that the figures can be read from nearby foothills.",
    body: "Maria Reiche spent decades mapping the site. Maria Reiche and later surveys showed the lines are walkable and internally proportional without aerial drafting tables. The ‘runway’ reading of the long trapezoids has no associated wreckage, fuel, or foreign tool. The open question is not whether Nazca people made the lines—they did—but what exact ceremony the figures served.",
    evidence:
      "Ceramic and radiocarbon dates, construction experiments that reproduce the method, and UNESCO survey maps. No non-Andean artifact is stratified in the glyph layer.",
    sources: [
      "UNESCO World Heritage file, Lines and Geoglyphs of Nasca and Palpa",
      "Maria Reiche survey notes",
      "Silverman & Proulx, The Nasca",
    ],
    image: {
      src: "/ancient/nazca.jpg",
      alt: "The Nazca hummingbird geoglyph seen from the air",
      credit: "Wikimedia Commons",
    },
    lat: -14.739,
    lng: -75.13,
    place: "Nazca Desert",
    country: "Peru",
    year: 400,
  },
  {
    id: "gobekli",
    title: "Göbekli Tepe",
    kicker: "c. 9500 BCE",
    subtitle: "Şanlıurfa Province, Turkey · Pre-Pottery Neolithic",
    lede: "T-shaped pillars carved before agriculture is supposed to have settled. It rewrote the opening chapter of the Neolithic.",
    summary:
      "Göbekli Tepe is a hill of circular enclosures with limestone T-pillars up to 5.5 m, carved with foxes, boars, birds, and abstract symbols. Klaus Schmidt’s excavations dated the main circles to the 10th millennium BCE—hunter-gatherer, not city-state. The site was later deliberately buried. Contact literature treats the sudden sophistication as imported. The excavation team treats it as evidence that ritual assembly came before farming, not after.",
    body: "No domestic occupation debris of a city has been found in the early circles. Pillars were quarried nearby. The ‘younger dryas comet / civilizing teachers’ reading is an overlay, not a field result. The real anomaly is social: who organized this labor with no palaces and no pottery.",
    evidence:
      "Radiocarbon dates on plaster and fill, in-situ sculpture, and the stratigraphy of backfill. No metal tools, no writing, no out-of-place alloy.",
    sources: [
      "Klaus Schmidt, Göbekli Tepe field reports",
      "German Archaeological Institute (DAI) publications",
      "Dietrich et al., radiocarbon series",
    ],
    image: {
      src: "/ancient/gobekli.jpg",
      alt: "T-shaped limestone pillars at Göbekli Tepe",
      credit: "Wikimedia Commons",
    },
    lat: 37.223,
    lng: 38.922,
    place: "Şanlıurfa Province",
    country: "Turkey",
    year: -9500,
  },
  {
    id: "puma-punku",
    title: "Puma Punku",
    kicker: "c. 500–1000 CE",
    subtitle: "Tiwanaku, Bolivia · andesite and sandstone",
    lede: "Interlocking blocks with tight joints. The culture is known; the tool kit is still argued.",
    summary:
      "Puma Punku is a ruined platform of red sandstone and gray andesite at Tiwanaku, on the Altiplano. Blocks show planar faces, right angles, and T-shaped clamps. Mainstream dates place the monumental phase in the Tiwanaku state’s first millennium CE. Fringe literature claims the cuts require machine milling and that the site is far older. Neither a laser-saw nor a 12,000-year occupation layer has been published from controlled excavation.",
    body: "Andesite can be worked with harder stone, sand, and copper-alloy tools, slowly. The unfinished blocks on site are the strongest argument for a human workshop in process, not a finished product dropped from elsewhere. The clamp sockets once held metal cramps, which is an Andean technique also seen at other Tiwanaku buildings. Age inflation usually comes from reading erosion as deep time rather than from a new radiocarbon sequence.",
    evidence:
      "Tiwanaku ceramic sequence, some radiocarbon on associated contexts, and the unfinished stones. No sealed pre-Holocene occupation floor under the platform has been accepted by the excavators.",
    sources: [
      "Protzen & Nair, The Stones of Tiahuanaco",
      "Ciudad de Tiwanaku / Bolivian excavation reports",
      "Vranich, field surveys of Pumapunku",
    ],
    image: {
      src: "/ancient/pumapunku.jpg",
      alt: "Interlocking sandstone blocks at Puma Punku, Tiwanaku",
      credit: "Wikimedia Commons",
    },
    lat: -16.561,
    lng: -68.679,
    place: "Tiwanaku",
    country: "Bolivia",
    year: 600,
  },
  {
    id: "pakal",
    title: "Pakal’s sarcophagus lid",
    kicker: "683 CE",
    subtitle: "Temple of the Inscriptions, Palenque, Mexico",
    lede: "A Maya king on a carved slab. von Däniken saw a rocket. Epigraphers see the maize god and the World Tree.",
    summary:
      "In 1952 Alberto Ruz Lhuillier opened a stairway inside Palenque’s Temple of the Inscriptions and found the tomb of K’inich Janaab’ Pakal I. The sarcophagus lid shows Pakal at the moment of death: the World Tree, the Quadripartite Badge, and the jaws of the underworld. Ancient-astronaut books read the same lines as a control panel, breathing tube, and exhaust. Maya writing on the tomb names Pakal and his dynasty; it does not name a vehicle.",
    body: "The rocket reading ignores the rest of Maya art, where the same motifs appear on stelae and pottery with no cockpit. The tomb itself is a Maya pyramid-temple with a psychoduct from chamber to summit. That is interesting enough without a space program. The lid remains the single most reproduced ‘ancient astronaut’ still from the Americas.",
    evidence:
      "In-situ tomb, jade burial mask, dated inscriptions (Long Count), and a corpus of parallel Maya iconography. No metallic control unit was in the chamber.",
    sources: [
      "Alberto Ruz Lhuillier, excavation reports, Palenque",
      "Schele & Mathews, The Code of Kings",
      "Temple of the Inscriptions glyphic corpus",
    ],
    image: {
      src: "/ancient/palenque.jpg",
      alt: "Temple of the Inscriptions at Palenque, burial pyramid of Pakal",
      credit: "Wikimedia Commons",
    },
    lat: 17.484,
    lng: -92.046,
    place: "Palenque",
    country: "Mexico",
    year: 683,
  },
  {
    id: "antikythera",
    title: "Antikythera mechanism",
    kicker: "c. 100 BCE",
    subtitle: "Antikythera wreck · Greek bronze gearwork",
    lede: "A clockwork planetarium from a shipwreck. It is human, and it is centuries ahead of any surviving analog.",
    summary:
      "Recovered in 1901 from a wreck off Antikythera, the mechanism is a bronze gear train that models the synodic month, eclipses (Saros), and the positions of the Sun and Moon—and likely planets—in the Hellenistic sky. X-ray tomography revealed inscriptions and differential gearing. It is not an alien computer. It is evidence that Greek workshops could build devices whose next European cousins appear in medieval clocks.",
    body: "Contact arguments sometimes use the mechanism as a ‘too soon’ object. Historians of science use it as proof that the written tradition (Cicero on a planetarium of Archimedes) had a physical counterpart. The gap is in survival, not in a missing starfarer. No component requires a metallurgy outside Hellenistic bronze.",
    evidence:
      "The fragments in the National Archaeological Museum, Athens; CT scans; and readable inscriptions naming calendar and astronomical functions.",
    sources: [
      "Antikythera Mechanism Research Project papers",
      "Freeth et al., Nature (2006, 2008)",
      "National Archaeological Museum, Athens, inventory",
    ],
    image: {
      src: "/ancient/antikythera.jpg",
      alt: "Surviving bronze fragments of the Antikythera mechanism",
      credit: "Wikimedia Commons",
    },
    lat: 35.889,
    lng: 23.307,
    place: "Antikythera",
    country: "Greece",
    year: -100,
  },
  {
    id: "baghdad-battery",
    title: "Baghdad Battery",
    kicker: "c. 1st–3rd century CE?",
    subtitle: "Khujut Rabu, Iraq · Parthian or Sasanian jar",
    lede: "A clay jar, a copper cylinder, an iron rod. Maybe electroplating. Maybe a scroll storage. Not a power station.",
    summary:
      "Wilhelm König, in 1938, described jars from near Baghdad as galvanic cells: copper cylinder, iron rod, asphalt seal. Replicas can produce a fraction of a volt with an acidic electrolyte. There is no associated wiring, plating shop, or text that says ‘we made lightning in a jar.’ Many archaeologists now prefer a storage vessel for sacred papyrus, with the metal as a core.",
    body: "Even if the galvanic reading is right, the output is small—enough, in principle, for light electroplating, not for lighting a city or firing a craft. The object is a lesson in how a single unusual assemblage becomes a contact proof once it leaves the catalogue and enters television.",
    evidence:
      "Museum jars of this type; replica voltage tests; no stratified workshop of electrical use. Dating and find-spot documentation are imperfect because of early-20th-century excavation standards.",
    sources: [
      "Wilhelm König, 1938 description",
      "Iraq Museum / National Museum of Iraq catalogue notes",
      "Keyser, ‘The Purpose of the Parthian Galvanic Cells’",
    ],
    image: {
      src: "/ancient/baghdad.jpg",
      alt: "Diagram of the so-called Baghdad Battery jar and electrodes",
      credit: "Wikimedia Commons",
    },
    lat: 33.348,
    lng: 44.464,
    place: "Khujut Rabu",
    country: "Iraq",
    year: 150,
  },
  {
    id: "sakwala",
    title: "Sakwala Chakraya",
    kicker: "Anuradhapura period",
    subtitle: "Ranmasu Uyana, Sri Lanka · carved ‘stargate’",
    lede: "A circular petroglyph in a royal park. Internet lore calls it a stargate. Field archaeologists call it a map, or an unknown diagram.",
    summary:
      "Sakwala Chakraya is a circular carving about 1.8 m across on a granite face in Ranmasu Uyana (the goldfish park) near the Tissa Wewa, Anuradhapura. Concentric rings, radial lines, and small squares are cut into the stone beside a ritual bathing area. Television and web documentaries have labeled it a stargate or an interface with a non-human intelligence. Sri Lankan archaeologists have called that reading absurd and have suggested an early cosmological diagram or map. There is no operating ‘gate,’ no associated metallic device, and no period text that describes the carving as a door.",
    body: "Ranmasu Uyana itself is a real designed landscape of the Anuradhapura period: ponds, dressing pavilions, stone seats. The carving is unique in layout. Unique is not the same as extraterrestrial. Comparable South Asian mandalas and cosmological wheels exist on other media. The file belongs here because it is a lesser-known contact claim that attached itself to a genuine, under-interpreted stone, not because a portal was observed in modern times.",
    evidence:
      "The carving is in situ and photographable. Dating is by associated park architecture, not by an inscription on the disk. No excavation has produced foreign alloys at the panel. Mainstream comment: map or cosmological chart. Fringe comment: stargate. Neither side has a bilingual caption from the original carvers.",
    sources: [
      "Ranmasu Uyana site record, Department of Archaeology, Sri Lanka",
      "UNESCO / Anuradhapura sacred city documentation",
      "Public statements by Sri Lankan archaeologists rejecting the stargate claim",
    ],
    image: {
      src: "/ancient/sakwala.jpg",
      alt: "Sakwala Chakraya circular carving at Ranmasu Uyana, Anuradhapura",
      credit: "Wikimedia Commons",
    },
    lat: 8.335,
    lng: 80.388,
    place: "Anuradhapura",
    country: "Sri Lanka",
    year: 300,
  },
  {
    id: "vimana",
    title: "Vimana",
    kicker: "Epic & technical Sanskrit",
    subtitle: "India · flying palaces, later ‘aircraft’ readings",
    lede: "Sanskrit epics describe flying palaces. A 20th-century tract tried to turn them into engineering manuals.",
    summary:
      "In the Rāmāyaṇa and other Sanskrit poems, a vimāna is a flying palace, most famously the Puṣpaka of Rāvaṇa. Temple towers in South India are also called vimana: the brick-and-stone superstructure over the sanctum, as at Brihadisvara, Thanjavur. The Vaimānika Shāstra, attributed to Maharishi Bharadvaja but compiled in the 20th century from psychic dictation, treats vimanas as aircraft with mercury engines. Aeronautical engineers at the Indian Institute of Science (1974) found that text aerodynamically unworkable.",
    body: "The contact file therefore splits in two: (1) genuine epic imagery of flying palaces in a literary culture; (2) a modern technical overlay that does not describe a recovered machine. Using a Chola temple tower as the picture is deliberate: that is what a vimana looks like on the ground. It is not a hangar.",
    evidence:
      "Epic passages (public domain); the Vaimānika Shāstra manuscript history (early 20th century); IISc Bangalore 1974 critique. No excavated mercury-vortex engine from a Vedic layer.",
    sources: [
      "Rāmāyaṇa, Puṣpaka passages",
      "Vaimānika Shāstra, as published from the 1950s",
      "Mukunda et al., Indian Institute of Science, 1974",
    ],
    image: {
      src: "/ancient/vimana.jpg",
      alt: "Brihadisvara Temple vimana (tower) at Thanjavur",
      credit: "Wikimedia Commons",
    },
    lat: 10.783,
    lng: 79.132,
    place: "Thanjavur",
    country: "India",
    year: -400,
  },
  {
    id: "moai",
    title: "Rapa Nui moai",
    kicker: "c. 1250–1500 CE",
    subtitle: "Easter Island · ancestor figures",
    lede: "Hundreds of megalithic heads. They walked. They were not offloaded from a starship.",
    summary:
      "The moai of Rapa Nui are volcanic-tuff figures, most carved at Rano Raraku quarry, erected on ahu platforms with pukao topknots of red scoria. Oral history said the statues walked. Experimental archaeology (Hunt, Lipo, and others) showed that small teams can rock an upright moai forward on ropes. Contact books asked how an isolated island moved 80-ton stone. The islanders answered, in practice.",
    body: "Deforestation and ahu-building remain debated as ecology, not as proof of a refueling station. Obsidian tools and the quarry’s unfinished giants are a workshop frozen in place. No non-Polynesian alloy sits under the ahu in published stratigraphy.",
    evidence:
      "Quarry in situ, radiocarbon on occupation layers, successful walking experiments, and Rapa Nui oral tradition. Thor Heyerdahl’s extra-Pacific contact thesis is not required by the current dates.",
    sources: [
      "Hunt & Lipo, The Statues That Walked",
      "Van Tilburg, moai corpus",
      "Rano Raraku quarry surveys",
    ],
    image: {
      src: "/ancient/moai.jpg",
      alt: "Moai standing on the outer slopes of Rano Raraku quarry",
      credit: "Wikimedia Commons",
    },
    lat: -27.126,
    lng: -109.276,
    place: "Rapa Nui",
    country: "Chile",
    year: 1400,
  },
  {
    id: "diquis",
    title: "Diquís spheres",
    kicker: "c. 600–1500 CE",
    subtitle: "Diquís Delta, Costa Rica · stone globes",
    lede: "Nearly perfect stone spheres in the jungle. Measured, not mythic. Purpose still not written down.",
    summary:
      "The Diquís culture left hundreds of gabbro, limestone, and sandstone spheres, some more than 2 m across, now a UNESCO property at sites such as Finca 6. Surfaces can be true to a few centimeters. They stood in alignments near dwellings and later were moved by United Fruit Company clearance. Fringe writers invoke lost machining or celestial markers of a global grid. Archaeology records them as status and landscape markers of a chiefdom that did not leave an instruction manual.",
    body: "Making a sphere from gabbro with stone tools is slow and possible. The unfinished examples are the tell. Claims of impossible precision usually use the best sphere and ignore the irregular ones. No sphere has a documented off-world inclusion.",
    evidence:
      "In-situ spheres at Finca 6, museum collections in San José, UNESCO file, and unfinished pieces. Dating is from associated occupation, not from the stone itself.",
    sources: [
      "UNESCO, Precolumbian Chiefdom Settlements with Diquís Spheres",
      "Lothrop, Archaeology of the Diquís Delta",
      "Museo Nacional de Costa Rica catalogues",
    ],
    image: {
      src: "/ancient/spheres.jpg",
      alt: "Diquís stone spheres in situ at Finca 6, Costa Rica",
      credit: "Wikimedia Commons",
    },
    lat: 8.911,
    lng: -83.477,
    place: "Diquís Delta",
    country: "Costa Rica",
    year: 800,
  },
  {
    id: "sacsayhuaman",
    title: "Sacsayhuamán",
    kicker: "15th century CE",
    subtitle: "Cusco, Peru · Inca zigzag walls",
    lede: "Tight polygonal masonry on a ridge above Cusco. Inca, with older occupation under it.",
    summary:
      "Sacsayhuamán is a complex of zigzag terraces built of irregular limestone blocks, some over 100 tons, fitted without mortar. Spanish chronicles describe Inca construction; excavation finds earlier Killke occupation as well. The jointing is the contact hook: how were the faces matched? Experimental work shows pounding with harder stones, trial fitting, and a large labor pool under a state that could feed it.",
    body: "The walls are not seismic-proof magic from a prior epoch, though they do perform well in earthquakes because the blocks can flex. Claims that the stones were cast like geopolymer concrete remain a minority hypothesis without a smoking-gun quarry of poured mix. The file is a masonry problem, not a landing pad.",
    evidence:
      "Chronicles (Cieza de León, Garcilaso), Inca and Killke strata, nearby quarries, and unfinished blocks. No foreign tool steel in sealed Inca contexts.",
    sources: [
      "Protzen, Inca architecture and construction methods",
      "Cusco archaeological park reports",
      "Cieza de León, Crónica del Perú",
    ],
    image: {
      src: "/ancient/sacsay.jpg",
      alt: "Polygonal limestone walls of Sacsayhuamán above Cusco",
      credit: "Wikimedia Commons",
    },
    lat: -13.509,
    lng: -71.982,
    place: "Cusco",
    country: "Peru",
    year: 1450,
  },
  {
    id: "quimbaya",
    title: "Quimbaya gold figures",
    kicker: "c. 300–1550 CE",
    subtitle: "Cauca Valley, Colombia · tumbaga zoomorphs",
    lede: "Small gold objects that look, to a modern eye, like aircraft. To a goldsmith, they look like fish and insects.",
    summary:
      "Quimbaya and related Colombian cultures cast tumbaga (gold-copper) figures, including a set of winged, tailed pieces that ancient-astronaut presenters fly as jet aircraft. Museums catalogue them as stylized fish, birds, and insects, consistent with a wider corpus of votive gold. They have no cockpits, no engine nozzles in the engineering sense, and no associated scale models of a hangar.",
    body: "If you already believe in ancient aircraft, the silhouettes are suggestive. If you start from the rest of the goldwork, they are in family with other zoomorphs. Lost-wax casting of tumbaga is well understood. The file is a warning about pareidolia applied to small metal, not a recovered airframe.",
    evidence:
      "Museo del Oro and other collections; metallurgical studies of tumbaga; no stratified ‘airfield’ context. The airplane reading is modern and visual.",
    sources: [
      "Museo del Oro, Banco de la República, Bogotá, catalogues",
      "Bray, goldworking in ancient Colombia",
      "Comparative zoomorph series in Quimbaya metalwork",
    ],
    image: {
      src: "/ancient/quimbaya.jpg",
      alt: "Pre-Columbian Quimbaya gold bird figures",
      credit: "Wikimedia Commons",
    },
    lat: 4.533,
    lng: -75.681,
    place: "Cauca Valley",
    country: "Colombia",
    year: 500,
  },
  ...ANCIENT_FILES_EXTRA,
  ...ANCIENT_FILES_CONTACT,
]);
