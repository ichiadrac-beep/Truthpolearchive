import type { DeskFile } from "@/lib/desk-file";

/** Received stories for the ancient desk. Tradition, chronicle, or the modern legend that stuck — not excavation. */
export const ANCIENT_FOLKLORE: Record<string, string> = {
  giza:
    "Egyptian liturgy does not say the pyramid was a machine. The king’s body is a horizon; the Pyramid Texts (written a few reigns later) send him to the Imperishable Stars. Medieval Arabic writers made the monuments Joseph’s granaries, or the treasure-houses of Idrīs / Hermes. Herodotus was told Cheops closed the temples to finish the work. None of those stories names a visitor from the sky.",
  nazca:
    "The people who walked the pampa left no book. Later Andean memory on this coast belongs to water and mountain: lines as paths for ritual, figures as beings that pull rain. Spanish and modern overlays added Viracocha looking down from the air. The walking is older than the runway story.",
  gobekli:
    "No living people kept a named origin story for the hill. The Turkish name is a shape — potbelly — not a god. Later Kurdish and village talk treats it as an old cemetery hill. The T-pillars’ animals are the only ‘legend’ the builders left, and they did not caption it.",
  "puma-punku":
    "Aymara and later Andean tradition place Viracocha (Thunupa) at Tiwanaku: a walking teacher who rose from Titicaca, made people of stone, and left when they disappointed him. Some tellings say the blocks moved at his word, or belong to a previous sun. The Gate of the Sun is his doorway in that cycle. The Spanish wrote the story down; they did not invent the god.",
  pakal:
    "Maya inscription and art put Pakal at the moment of death: he falls into the jaws of the underworld along the World Tree and rises as the maize god. Palenque’s own texts name his dynasty and his rebirth among the gods. The rocket is a twentieth-century caption. The court that buried him already had a cosmology that did the work.",
  antikythera:
    "Greece kept a story of crafted skies: Hephaestus’s automata, Daedalus’s moving statues, Archimedes’ bronze sphere that Cicero said showed the planets. No wreck-legend attached to Antikythera until sponge divers opened the ship in 1901. The mechanism is the surviving cousin of those workshop tales, not a temple myth.",
  "baghdad-battery":
    "No Parthian or Sasanian text says ‘we kept lightning in a jar.’ The legend is modern: Wilhelm König’s 1938 reading, then television. Older Mesopotamia had plenty of fire and storm gods. None of them needed a clay cell in the catalogue.",
  sakwala:
    "Sakwala Chakraya — ‘world-wheel’ — sits in the royal park at Anuradhapura. In Sinhala Buddhist cosmology a cakka is the wheel of a realm or a king. Fringe captions call the carving a map or a gate. The garden is a king’s pleasure ground in the chronicles. The wheel is a diagram, not a runway.",
  vimana:
    "In the Rāmāyaṇa, Pushpaka is a flying palace first belonging to Kubera, then taken by Rāvaṇa, then used to carry Sītā. Other Sanskrit texts speak of vimāna as palaces, thrones, or sky-chariots of the gods. The Vaimānika Shāstra that treats them as aircraft is a twentieth-century compilation, not a Vedic flight manual. The epic story is older than the hangar reading.",
  moai:
    "Rapa Nui oral history says the moai are aringa ora — living faces of ancestors — and that they walked from the quarry at Rano Raraku until the mana failed. Hotu Matuʻa is the founding king from the west. Later the birdman cult of Make-make took the island’s ritual centre to Orongo. The walking is the island’s own story; the quarry is still full of unfinished faces.",
  diquis:
    "The Diquís culture left no readable myth on the spheres. Bruncaj / Boruca memory on this plain treats thunder, river, and rank as the old powers; some later tellings make the balls gifts of thunder or markers of chiefs. Colonial talk called them cannonballs. The stones were in situ before the cannon.",
  sacsayhuaman:
    "Cusco was a puma in Inca design; Sacsayhuamán is the head, the zigzag walls its teeth. Chronicles say Pachacuti ordered the fortress, and that stones were walked or made light with a plant, or set in a previous age. Cieza de León heard they belonged to giants or to Viracocha’s people. The puma city is Inca; the ‘they walked’ is the Andean habit of giving stone a will.",
  quimbaya:
    "In the Cauca, gold was not money. It was a body for the spirit — tunjos and zoomorphs offered to rivers and ancestors. Muisca country to the east has the El Dorado rite at Guatavita; Quimbaya gold is its own workshop. The ‘aircraft’ reading is a modern silhouette. The old story is offering, not aviation.",

  sphinx:
    "New Kingdom Egypt already treated the statue as Hor-em-akhet — Horus in the horizon. The Dream Stela of Thutmose IV says the god spoke to the prince in the shadow of the sand and promised kingship if he cleared it. Medieval Arabic named it Abū al-Hūl, the father of terror. The missing nose is a later injury, not a Napoleon punchline that the stela requires.",
  osirion:
    "Abydos is Osiris’s cult city. Later Egyptians and then travellers treated the Osirion as his tomb or a threshold of the underworld — a dummy sarcophagus in a water-filled hall. The building is New Kingdom or a little earlier; the drowning-god story is why people kept coming down the stair.",
  serapeum:
    "The Apis bull died and became Osiris-Apis — Serapis to the Greeks. Each sarcophagus in the Serapeum is a bull’s house in granite. Procession, oracle, and burial are in the texts. There is no separate ‘giant coffin’ legend that is not this cult.",
  "dendera-light":
    "The crypt reliefs belong to Hathor’s temple: creation, lotuses, djed pillars, the sun’s birth. Priests read a theology of light, not a bulb. The ‘Dendera lamp’ is a modern nickname for a lotus-and-serpent scene. Hathor’s own story is the Eye of Ra going south and being coaxed home.",
  "abu-ghurab":
    "Niuserre’s sun temple is an altar to Ra on earth: a squat obelisk, a slaughter court, a solar boat in mudbrick. The folklore is the Fifth Dynasty solar cult itself — the king as Ra’s son, the day-barque crossing the sky. No later folk tale replaced that.",
  "bent-pyramid":
    "The bent profile is Sneferu’s. Later Egyptian memory kept him as a great builder; folklore did not invent a broken god to explain the angle. Modern legend likes a ‘change of plan after an earthquake.’ The masons’ story is in the courses, not in a myth of collapse.",
  "unfinished-obelisk":
    "Aswan folklore is practical: this is the quarry of kings. The stone is a failed obelisk of the New Kingdom, left in the bedrock when it cracked. No demon is blamed. The legend, such as it is, is Hatshepsut’s and Thutmose’s hunger for a single piece of granite taller than a palace.",
  baalbek:
    "Roman Heliopolis sat on an older holy hill of Baal / Hadad. Islamic and local folklore says Solomon commanded jinn to cut and set the trilithon, or that giants (or Cain) laid the first course. The temple of Jupiter is in the masonry. The jinn are in the telling that tried to explain stones no mule could drag.",
  "pregnant-stone":
    "The unused block in the quarry is Hajir el-Hiblā — the stone of the pregnant woman. Folklore says a pregnant jinn, or a woman in Solomon’s levy, carried it and set it down. Same cycle as the trilithon: only a non-human labourer could have moved it. It is still in the quarry.",
  derinkuyu:
    "Cappadocian Christians used the underground cities as refuges — from raiders, from winter, from the next army. Local talk still frames them as hiding places, not as a lost metropolis. Fairy-chimney country has peri and saint legends on the surface. The wells and millstones downstairs are the refugees’ toolkit.",
  kaymakli:
    "Kaymaklı is Derinkuyu’s twin in story as in plan: a Christian warren, stables and churches stacked in tuff, a place to disappear when the road above was hostile. No Hittite epic names it. The legend is survival.",
  hypogeum:
    "Maltese tradition treats Ħal-Saflieni as an underworld of the temple people. The ‘Sleeping Lady’ figurines read as death or healing. A twentieth-century urban legend claims a classroom of children vanished in the lower rooms in 1910; it is not in the excavation record. The real unease is the oracle chamber’s resonance, which the builders could hear.",
  ggantija:
    "Gozo’s name for the temples is Ġgantija — the giants’ place. Folklore says a giantess (Sansuna in some tellings) ate broad beans for strength, carried the blocks on her head, and held a child in the other arm. Archaeology says farmers. The giantess is why the file still opens with a proper name.",
  mnajdra:
    "Maltese temple folklore is of giants and a calendar of the sun. Mnajdra’s doorway takes the equinox light; later talk made that a clock of gods. The same giant-builder cycle as Ġgantija covers the south coast. No named deity survived in writing. The alignment did.",
  "hagar-qim":
    "Ħaġar Qim — standing stones — sits in the same giant-and-sun cycle as Mnajdra. Local memory treated the fat-lady statues as goddesses long before archaeologists did. The fat figures are the island’s own holy bodies. They are not visitors.",
  stonehenge:
    "Geoffrey of Monmouth has Merlin bring the Giant’s Dance from Ireland; the stones had come from Africa and could heal. Village talk added the Devil pitching stones, and a miller counting them and never arriving at the same number. Antiquaries made druids. The Welsh and English legends are of giants and a wizard, not of engineers from elsewhere.",
  avebury:
    "The great circle collected the same family of stories as Stonehenge: the Devil’s chair, stones that walk at midnight, a diamond stone that brings luck or ruin. Medieval Christians buried some of the megaliths as pagan. Stukeley later dressed the plan as a serpent. The folk fear was older than his drawing.",
  silbury:
    "Wiltshire lore says King Sil was buried here on horseback, or that the Devil, flying with a load of earth to bury Marlborough, dropped it when a priest named the town. Silbury is a Neolithic mound with no royal grave in the middle. The king and the Devil are how a featureless hill gets a biography.",
  newgrange:
    "This is Brú na Bóinne, the hostel of the Dagda. Irish tradition says Óengus (Aengus Óg) won the house from his father by asking for it ‘for a day and a night’ — which is forever. The mound is a síd, a palace of the otherworld. The winter-solstice beam is archaeology’s later proof that the house was aimed at the sun. The trick of the lease is the legend.",
  knowth:
    "Knowth shares the Boyne otherworld: a síd of the same family as Newgrange, a house of the Tuatha Dé Danann. Medieval literature treats the Bruigh as a cluster, not a single tomb. The kerbstones’ spirals were not captions. The people who named Óengus already knew this hill was occupied.",
  maeshowe:
    "Norse shepherds called it Orkahaugr. The Orkneyinga Saga and runes on the inner walls say Crusaders broke in at Hogmanay, dragged out treasure, and carved that they had. Draugr and Howe-breakers are the island’s winter story. The Neolithic builders did not write it. The Vikings did.",
  "skara-brae":
    "No surviving Orcadian myth names this village. It slept under dunes until a storm in 1850. Later folklore is the discovery itself — a stone town that had been waiting. Do not staple a god to a site the sagas never mentioned.",
  "ness-brodgar":
    "The Ness had no folk name as a temple. It was farmland over buried wall until excavation this century. Orkney’s legends attach to Maeshowe, the Ring of Brodgar, and the Standing Stones of Stenness — giants, fiddlers, sunken bells. This peninsula borrows their weather, not their plot.",
  callanish:
    "Lewis tradition calls the stones fir bhrèige — false men — a procession petrified by an enchanter. Another telling has a shining figure walk the northern avenue at midsummer. Giants and the first sun are the Hebridean habit for any circle. The avenue is real. The enchanter is the caption.",
  carnac:
    "Breton legend says Saint Cornély, fleeing Roman soldiers, turned them to stone; the alignments are a frozen army. Other tellings blame Caesar’s men or a pagan host stopped by a pope. The stones are Neolithic. The saint is how a Christian country kept them standing.",
  gavrinis:
    "Gavrinis is a passage grave in the Gulf of Morbihan. Local lore treats the gulf’s mounds as the houses of the dead and of korrigans — Breton fairies who guard old stone. The carved swirls on the slabs were not given a story in writing. The island is still a threshold in folk geography.",
  menga:
    "Antequera’s dolmens sit in a land of Moorish and shepherd tales, but Menga has no single named builder in Spanish folklore the way Ġgantija has Sansuna. Later talk of giants moving the capstone is the usual Iberian megalith caption. The well inside the chamber is archaeology. The giant is habit.",
  "karahan-tepe":
    "Like Göbekli, Karahan Tepe has no inherited myth. Local Kurdish and Turkish speech treated the hill as old stone and cisterns. The human-headed pillar and the snake carvings will mint a legend now that they are famous. It will not be the builders’.",
  "nevali-cori":
    "Flooded by the Atatürk reservoir, Nevalı Çori left T-pillars and a limestone head. No village epic names the sanctuary. The region’s living faiths are later. File the site as a relative of Göbekli, not as a named shrine in anyone’s grandmother’s story.",
  catalhoyuk:
    "Çatalhöyük’s houses held bull heads, leopards, and the dead under the floor. James Mellaart wrote a goddess onto the walls; later excavators pulled that back. No Hittite or Turkish legend preserves this town’s name. The bulls and the burials are the closest thing to a creed.",
  "jericho-tower":
    "The Neolithic tower is thousands of years older than the Book of Joshua. The legend that attached is biblical: walls that fell when the ark and the trumpets went round. That story is about a Late Bronze town, not the Pre-Pottery tower. Keep both papers in the folder. Do not date the shout by the stone.",
  carahunge:
    "Armenian folk names it Zorats Karer — stones of the warriors — a host turned to stone, or an army’s monument. ‘Speaking stones’ is a later tourist gloss. The standing stones and holes are real. The petrified host is the Caucasus version of Carnac’s frozen soldiers.",
  yonaguni:
    "Ryukyuan tradition looks east to Niraikanai, an otherworld across the sea, and down to sea-gods and palace-under-the-wave. The ‘monument’ as a man-made ziggurat is a modern reading of a sandstone terrace. Do not put a drowned capital on a formation the islanders did not name as one.",
  "gunung-padang":
    "Sundanese memory keeps Gunung Padang as an ancestral megalith hill, sometimes folded into the cycle of King Siliwangi and the old kingdoms of the highlands. The ‘oldest pyramid on earth’ is a twenty-first-century claim laid on that hill. The terraces and the ancestor-stones are the older file.",
  "nan-madol":
    "Pohnpei tradition says twin sorcerers, Olisihpa and Olosohpa, built the canals with a flying dragon or with magic that levitated basalt. The Saudeleur kings ruled from the islets until Isokelekel overthrew the last of them. The city of stone on water is the legend and the map. Both survived.",
  haamonga:
    "Tongan tradition gives the trilithon to the god-trickster Māui, or to king Tuʻitātui as a gateway for his two sons — Haʻamonga ʻa Maui, the burden of Maui. The lintel is a calendar in some modern readings. The brothers’ gate is the story the palace kept.",
  "latte-taga":
    "Chamorro legend names Chief Taga of Tinian, who set the latte stones for a house so large his daughter’s death ended the work. The uprights and capstones are the Mariana house-posts of ancestors. Taga is the proper name on this file. No passing fleet is required.",
  "great-zimbabwe":
    "Shona memory: dzimbabwe, houses of stone, courts of the Munhumutapa. The royal dead and Mwari belong here. Colonial folklore — Phoenicians, the Queen of Sheba, a white builder — was a refusal to let the Shona have the walls. The legend that matters is the one that still uses the word as a country.",
  "adams-calendar":
    "There is no Zulu or Sotho origin story that names this terrace-circle as Adam’s calendar. The legend is recent: a 2000s claim of a 75,000-year stone observatory. File it as a modern origin myth laid on older agricultural stone, not as inherited lore.",
  lalibela:
    "Ethiopian tradition says King Lalibela saw a New Jerusalem in a vision. Angels cut the churches by night; men cut by day. The complex is a pilgrimage city of the Zagwe. The night shift of angels is how a highland kingdom explained a mountain turned inside out.",
  "axum-obelisks":
    "The Kebra Nagast says Menelik I, son of Solomon and the Queen of Sheba, brought the Ark of the Covenant to Aksum. The stelae are the grave-markers of Aksumite kings. Living Ethiopian Orthodox faith still locates the Ark in the chapel of St Mary of Zion. That is not a tourist caption. It is the national epic.",
  meroe:
    "Nubian royal pyramids of the Kushite dead. Later folk and travellers called them the tombs of ancient kings of the south — which they are. There is no separate ‘lost white race’ story that is Nubian. The legend is kingship on the Nile that did not need Egypt’s permission.",
  "piri-reis":
    "The map is an Ottoman portolan with a note that older charts, including Columbus, were consulted. No Islamic legend claims Piri Reis saw an ice-free Antarctica. That legend is Hapgood’s, this century. The admiral’s own story is navigation, not a frozen continent.",
  "hapgood-maps":
    "Charles Hapgood’s 1960s thesis — an Ice Age source-map, a lost survey people — is the folklore. It is scholarly folklore, which is still folklore. No ancient culture handed him the portfolio. Treat the claim as a modern myth of a better archive.",
  "bimini-road":
    "Lucayan / Taíno people of these islands did not leave a story of a paved road to Atlantis. The beach-rock blocks became Plato’s suburb in the 1960s. File the legend as New Age, not as an inherited Bahamian epic.",
  dwarka:
    "The Mahābhārata and Harivaṃśa say Krishna’s city of Dvārakā sank beneath the sea when he died and the age turned. That is the legend. Onshore and nearshore stone at modern Dwarka is a historic port wearing the name. The sonar ‘city’ in the Gulf of Khambhat is a later, disputed overlay. Keep Krishna’s drowning capital as scripture, not as a dive log.",
  richat:
    "The Eye of the Sahara had no local Atlantis cult. Hassaniya and Amazigh geography named a round landform, not a drowned capital. The Plato reading is a satellite-age caption. Do not back-date it to a Mauritanian epic.",
  "atlantis-plato":
    "The legend is the text: Timaeus and Critias, a priest at Sais, a naval power beyond the pillars, a single day and night of earthquakes, a lost war with Athens. Every later map — Santorini, the Atlantic, Richat, Antarctica — is a child of those pages. Plato’s story is the folklore. The rest is placement.",
  "sumerian-king-list":
    "The list itself is the received story: kingship was lowered from heaven at Eridu; kings before the flood reigned for tens of thousands of years; the flood washed the slate; kingship was lowered again. It is not a king-list in the modern sense. It is a theology of office.",
  "anunnaki-eridu":
    "Eridu is the first city in Sumerian memory, Enki’s house, the place where kingship arrived. The Anunnaki are the great gods of the assembly, not a mining company. Later contact literature hired them as engineers. The tablets keep them as judges and landlords of the cosmos.",
  "dogon-sirius":
    "As Marcel Griaule wrote it, the Dogon received from the Nommo — amphibious ancestors from the sky, associated with Sirius — the knowledge of a companion star and the world’s ordering. Later ethnographers argued he was fed a story. The Nommo remain the living myth. Whether Sirius B was in it before the interview is the fight.",
  "saqqara-bird":
    "No Egyptian text calls this wooden bird a glider. It is a falcon, a solar bird, a tomb offering. The ‘first aeroplane’ is a modern fable hung on a votive. Horus already flew in the theology. He did not need balsa.",
  "abydos-glyphs":
    "Temple graffiti and recarved cartouches at Seti’s hall produced, to a modern eye, a helicopter, a submarine, a tank. Egyptian folklore did not see vehicles. It saw the names of kings. Palimpsest is the priestly story. Pareidolia is ours.",
  "paracas-skulls":
    "Andean practice: bind an infant’s head and you mark status, beauty, or belonging. Paracas and later Nasca did it in numbers. There is no Paracas legend of a long-skulled visitor race. The ancestors wore their difference. The ‘star children’ caption is imported.",
  "crystal-skulls":
    "The folklore is Victorian and after: twelve or thirteen skulls that, reunited, speak; Mesoamerican priests who saw the end of the world in quartz. No Maya or Aztec text lists them. Most of the famous skulls are nineteenth-century European lapidary. The legend is occult, not excavated.",
  "ica-stones":
    "Dr Javier Cabrera’s collection: andesite stones carved with dinosaurs, surgery, and globes, said to come from a cave no team has controlled. The folklore is his — a vanished people who flew and cut flesh. Ica farmers could also cut stone for a buyer. File as a modern cycle, not as Andean epic.",
  dropa:
    "A 1960s story: a Chinese expedition in 1938 finds graves of small people and stone discs that tell of a crash in the Baian-Kara-Ula. No expedition report, no discs in a museum with a chain of custody. Tibetan and Qiang folklore of small mountain people exists in other forms. This particular crash is a magazine legend.",
  klerksdorp:
    "Miners found grooved spheres in Precambrian pyrophyllite and gave them a mystery. There is no Tswana or Afrikaner origin myth of manufactured balls in that rock. The legend is the mine canteen and then the internet. Geology still does the quieter work.",
  "london-hammer":
    "A Texas hammer in a concretion, sold as a tool from before it could exist. No Indigenous legend claims it. The folklore is creationist and out-of-place-artefact television. A nineteenth-century hammer can sit in a mineral crust without rewriting the Holocene.",
  teotihuacan:
    "The Aztecs, arriving late, named it the place where gods were made — where the Fifth Sun was kindled by sacrifice. They did not claim to have built the Street of the Dead. The builders were already a ‘Toltec’ memory. Later Mexican lore keeps the city as a birthplace of suns. That is the inherited story.",
  cholula:
    "One Mesoamerican tradition says the giant Xelhua, a survivor of the flood, raised Tlachihualtepetl so the waters would not cover his people. Another ties the pyramid to Quetzalcoatl. The Spanish put a church on the summit, which is its own overlay. The giant and the flood are the older caption.",
  "olmec-heads":
    "The Olmec left no readable myth for the heads. Later Mesoamerica kept jaguar-children, rain babies, and rulers who were more than men. The colossal heads are portraits of power in stone helmets. The ‘African kings’ and ‘visitors’ readings are modern arguments, not Gulf Coast folklore.",
  "tula-atlanteans":
    "Tollan is the lost court of Quetzalcoatl-Topiltzin: a city of crafts and law from which the feathered teacher walks east after shame, promising to return. The stone warriors on the pyramid are the remaining garrison of that story. Aztec kings claimed descent from that Tollan. The departure is the legend.",
  "chichen-equinox":
    "Yucatec Maya keep Kukulkan — the feathered serpent — as the being who taught, who demands, who comes down the northern balustrade as a shadow-diamond at equinox. Cenote sacrifice is in the archaeology and in the later telling. The serpent of light is the story the pyramid still performs.",
  "el-mirador":
    "Kaanul, the Snake kingdom, and the First Mother / First Father cycle of Maya creation sit behind the Preclassic towers. El Mirador itself was already a ruin when Tikal was young; later Maya treated such places as the work of the first people. The snake emblem glyphs are the political legend. The lost-city romance is ours.",
  tikal:
    "Tikal’s kings named themselves from the First Jaguar, the Paddler Gods, and a covenant with the sky. The temples are mountains that hold those names. Colonial and modern folklore added a jungle Atlantis. The Maya already had a cosmogony that did not need one.",
  "izapa-stela5":
    "Izapa’s stela is a World Tree, a river, attendants — a creation scene in the long Isthmian habit. Mesoamerican folklore of a tree of life and a primordial couple is real. The Mormon reading (Lehi’s vision, a family from the sea) is a nineteenth-century American overlay. Keep the tree. Park the Book of Mormon as excavation.",
  "machu-picchu":
    "No Inca chronicle names this ridge as a capital. It reads as a royal estate of Pachacuti. Quechua later called it an old house of the Inka; Bingham’s ‘lost city’ is a 1911 caption. The ancestor-stones and the Intihuatana still hold mountain-and-sun practice. The mist-city legend is Bingham’s gift to the postcard.",
  ollantaytambo:
    "Quechua drama remembers Ollantay, a general who loved a princess and held this valley against Cusco. The unfinished pink-wall terraces also sit in the Viracocha / walking-stone cycle: blocks that came from a quarry across the river by a will that was not only human. The play and the stones share a name. They do not have to share a date.",
  coricancha:
    "Qorikancha was the house of Inti, the Sun, with a gold garden and the mummies of kings. Spanish chronicles describe walls sheeted in gold that went to the ransom of Atahualpa. The legend is the garden that lived, and the temple that became Santo Domingo. Both are in the masonry.",
  "gate-of-the-sun":
    "The figure on the lintel is the staff god — Viracocha / Thunupa in later Andean reading — weeping or radiating, attended by winged beings. Aymara tradition puts his departure and his law at this gate. The calendar-face is a modern wish. The walking teacher is the old one.",
  "band-of-holes":
    "Monte Sierpe’s pits have no recovered Inca or pre-Inca myth with a proper name. Local talk has tried storage, tribute, and ritual. None of those is a surviving epic. File the absence. Do not hire a sky-map to fill it.",
  caral:
    "The Norte Chico left no writing and no inherited god-name that can be tied to these pyramids. Later Andean ages had Viracocha and the mountain lords. They do not caption Caral. The flutes and the fire-pits are the closest thing to liturgy.",
  chavin:
    "Chavín was an oracle. Pilgrims came to the Lanzón in the dark, a granite staff-god who spoke through priests, conch trumpets, and San Pedro. Andean tradition of a speaking mountain and a mixing of jaguar, serpent, and bird is the living relative of that cult. The labyrinth is the method.",
  samaipata:
    "The carved rock is a jaguar-and-serpent mountain, later taken by the Inca. Guaraní and highland stories in this belt treat large carved animals as huacas — beings, not decorations. The ‘fortress’ name is Spanish. The animal on the ridge is the older presence.",
  "poverty-point":
    "No surviving nation kept a named origin story for these ridges. Later Mississippian and historic tribes have earth-diver and mound-builder memories that do not pin this place. The legend is archaeological: a hunter-gatherer city of earth. Do not invent a priest-king to match Cahokia.",
  cahokia:
    "The builders’ own names are lost. Osage, Ponca, and other Dhegiha traditions remember mound-builder ancestors and a world made from mud brought up from the water. Monks Mound is a colonial caption. The sun-watch and the woodhenges are the city’s remaining rite. The people who ran it did not leave a book.",
  "serpent-mound":
    "Fort Ancient (or Adena) people raised a snake with an egg in its jaws. Historic Shawnee and other Ohio Valley nations have horned-serpent stories — underwater panthers, world-serpents — that fit the shape without proving a caption. Antiquarian folklore added a biblical snake and an eclipse. The earthwork is the older sentence.",
  chaco:
    "Diné (Navajo) tradition treats the great houses as places of the Anasazi and of the Great Gambler, a dangerous old power; many families still avoid overnighting the ruins because of chindi. Pueblo nations remember an ancestral migration, a sipapu, a time of gathering and dispersal. Both are living lore. Neither is a spaceport story.",
  "mesa-verde":
    "Pueblo tradition: the cliff dwellings are houses of the ancestors on the migration from the place of emergence. The kivas are the world’s navel. Ute country around the mesa has its own claims. The ‘vanished race’ of nineteenth-century tourism is not how the descendants tell it. They did not vanish. They moved.",
  "blythe-intaglios":
    "Quechan and Mojave oral history names the largest figure as Mastamho or a related creator, the others as beings from the time when the river was being ordered. The gravel glyphs are still visited. This is not a recovered ‘runway.’ It is a portrait of gods on the desert floor.",
  "atacama-giant":
    "Atacama geoglyphs include a walking figure on the hill at Cerro Unitas. Andean coastal tradition in this desert treats large hillside figures as markers for caravans and as beings that call water. There is no Spanish chronicle that names this one as a star-god. The giant is a path-sign that became a face.",
  "acre-geoglyphs":
    "The Acre ditched enclosures were under forest until the trees came off. No surviving Amazonian nation has a published epic that says ‘we cut these squares for the sky.’ Later contact literature hired them as landing pads. Keep the earthworks. Leave the airstrip until someone who inherited the land says so.",
  "inga-stone":
    "The carved basalt at Ingá has never been read. Local Brazilian folklore offers Indigenous heroes, a lost people, and — later — visitors. None of those is a decipherment. The rock is a register without a surviving clerk.",
  "serra-capivara":
    "Northeastern Brazil’s painted shelters are now a national park. Local memory of the paintings is thin; the communities who made them are not a living caption. Regional folklore of enchanted stones and old Indians is generic. The deer, the dances, and the double-ended figures are the document.",
  wandjina:
    "Worrorra, Ngarinyin, and Wunambal law: Wandjina are cloud-and-rain ancestors who made the country, left their mouths-less faces on the rock, and must be retouched by the right people or the wet season fails. This is not a ‘spaceman’ file. It is a living cult with a maintenance schedule.",
  gwion:
    "Some Kimberley groups call these slender painted figures Gwion Gwion or Kiro Kiro — ancestors or birds who painted themselves. They are older, in style, than the Wandjina layer. The law around who may speak them is not a public-domain legend. File the name. Do not over-narrate.",
  tassili:
    "Tuareg and other Saharan memory treats the plateau as an old country of water and game, with jinn in the rocks. The round-headed painted figures have no surviving caption that says ‘helmet.’ The folklore is a green Sahara, not a landing.",
  "sego-canyon":
    "Ute and Paiute country. Barrier Canyon style figures are tall, hollow-eyed, often identified in ethnography with spirit-beings or shamans, not with a named epic printed for tourists. Rock-art is still a holy register here. The ‘spaceman panel’ nickname is a postcard, not a Ute title.",
  "ellora-kailasa":
    "The Kailasa temple is Shiva’s mountain cut downward. The central myth on the walls is Rāvaṇa shaking Kailāsa while Shiva and Pārvatī sit above him. Court tradition says the Rashtrakuta king (Krishna I) had the hill made into the god’s house. A later tale claims the architect finished it in a week. The demon-king under the mountain is the story the sculpture tells.",
  "mohenjo-daro":
    "The script is unread, so the city’s own myth is silent. Sindhi and later folk etymology made ‘Mohenjo-daro’ the mound of the dead. There is no inherited story of a nuclear war or a flying city that is native to the Indus. Those are modern captions. The Great Bath is the closest thing to a rite we can still see.",
  lothal:
    "No Gujarati epic names this dock. The Harappan port is an excavation. Later Gujarati seafaring lore — Krishna’s coast, the gulf, merchants — can be laid beside it without becoming its origin myth. The lock-like basin is engineering. It is not a legend.",
  angkor:
    "Khmer kingship: the temple is Mount Meru, the king is a god on the mountain, the moat is the ocean. Angkor Wat’s gallery of the Churning of the Ocean of Milk is the creation of amrita by gods and demons with the nāga as rope. That is the folklore, carved at scale. Suryavarman II’s name is on the dedication. The mountain is the theology.",
  borobudur:
    "The monument is a mandala: kamadhatu, rupadhatu, arupadhatu — desire, form, formlessness — a walk into Buddhahood. Javanese tradition names Gunadharma as architect and keeps a story that the hill was once a lake or a curse. Sailendra kings did not need a visitor to encode a religion they already had.",
  sigiriya:
    "The Cūlavaṃsa says Kassapa I killed his father Dhātusena, took the throne from his brother, and raised a palace on the rock with a gateway in the form of a lion — siṃha-giri. The lion’s paws are still on the terrace. A second, living tradition folds the same plug into the Rāmāyaṇa: Rāvaṇa’s sky palace, a king who was more than a man. The paws are a lion’s, not a reptile’s. Both stories are older than the ticket booth.",
  "bosnian-pyramids":
    "Visoko had a medieval town and a castle. The pyramid legend is Semir Osmanagić’s, from 2005: hills as the oldest pyramids on earth, tunnels as a lost civilisation. Geologists said conglomerate. The folklore is a brand. It is burying real Ottoman and medieval layers under a story they did not tell.",
  maoling:
    "Han Wudi’s tomb mound is a Chinese imperial grave, not a white pyramid of the Gobi. Later UFO literature moved a ‘white pyramid’ around China by misreading satellite photos and old rumours. Chinese tradition already had plenty of tomb-geomancy. It did not need a desert ziggurat from a magazine.",
  "watson-brake":
    "No surviving nation kept a name for this Middle Archaic earthwork. It is older than Poverty Point and quieter in folklore. Do not borrow a Mississippian sun-myth to cover a blank. The ridges are the record.",
  "newark-earthworks":
    "Hopewell earthworks: octagon, circle, precise lunar alignments. Historic tribes in Ohio were displaced; no single surviving origin story pins this complex. Antiquarian folklore added druids, the Lost Tribes, and a master race. The Hopewell dead are the people who belong here. Their names did not travel with the land.",
  "mystery-hill":
    "America’s Stonehenge is a colonial farm with a taste for standing stones. The folklore is antiquarian: Irish monks, Phoenicians, a 4,000-year observatory. Abenaki country did not hand that story over. File as New England invented-tradition, with a few real cellar holes.",
  "newport-tower":
    "A stone round in Rhode Island. Folklore has made it Norse, Templar, a mill of Governor Arnold, a beacon of lost Europeans. Colonial records fit a windmill. The North Atlantic romance is the legend that will not stay in the mill.",
  kensington:
    "A runestone pulled from a Swedish-American farm in 1898, dated 1362, a party of Goths and Norwegians bleeding in Minnesota. Scandinavian-American folklore took it as proof of pre-Columbian cousins. Most runologists took it as a nineteenth-century homecoming. The legend is a diaspora’s wish. The stone is still in a museum.",
  "edfu-texts":
    "The Ptolemaic temple of Horus keeps older ‘building texts’: primeval mounds, the Shebtiu sages, a first temple raised after a flood, gods who measure and found. That is Egyptian priestly folklore of origins, written late, claiming early. Horus’s own legend — the avenging son, the eye, the hippopotamus hunt — is on the same walls.",
  "turin-king-list":
    "The papyrus lists gods and spirits who reigned before men, then the mortal kings. That preamble is the folklore: a time when Ra and Thoth and the rest sat on the throne of Egypt. It is not a slip. Egyptian kingship wanted a divine payroll above the First Dynasty.",
  "osiris-shaft":
    "Later Egyptian and then Greco-Roman talk put Osiris’s burial in more than one place; Giza acquired a shaft that modern writers treat as his tomb. The shaft is real. The identification is a cultic wish. Abydos still has the stronger claim in the older texts.",
  vinapu:
    "Ahu Vinapu’s fitted slab wall reminded visitors of Cuzco, so a legend of Inca masons — or of a shared teacher — grew on Rapa Nui. Island tradition still belongs to the moai and Hotu Matuʻa, not to Pachacuti. The masonry is a style. The Inca cousin is a comparison that became a story.",

  "anunnaki-council":
    "In Sumerian and Akkadian poetry the Anunnaki sit as a court. They decree fates, they assign offices, they are terrible when they starve. The received story is an assembly of gods, not a board meeting of miners. Later tablets keep them in the underworld as judges of the dead.",
  "enki-me":
    "Enki of Eridu holds the ME — the offices and crafts of civilisation — in the Abzu. Inanna gets him drunk and takes them to Uruk by boat. That is the legend of how cities learned. The ME are decrees, not software. The theft is a temple story about rivalry, not a technology transfer from the sky.",
  "enlil-nippur":
    "Enlil of Nippur is the lord of the air and of kingship; his word makes the flood. Nippur’s folklore is that no king is legitimate unless recognised in his temple. The assembly of gods defers to him. He is a landlord of the world, not a station chief.",
  "ninhursag-clay":
    "Ninmah / Ninhursag and Enki make humans from clay, mix in the blood of a slain god, and argue about defective people. The legend is a workshop of creation, with beer and insults. Clay and blood are the recipe in the tablets. There is no vat from elsewhere.",
  "igigi-revolt":
    "The junior gods, the Igigi, refuse the labour of digging canals and surround Enlil’s house. The solution is to create humans to take the work. Atra-hasis is the received telling. Rebellion, then a workforce. That is the folk memory of why we exist: to carry the basket.",
  "apkallu-sages":
    "Seven sages, apkallu, sent by Enki before the flood, fish-cloaked, who taught brick, rite, and measurement. After the flood the sages are only half-divine. Berossus later names the first of them Oannes. The legend is civilisation as a lesson given once, then thinned.",
  "oannes-berossus":
    "Berossus, a Babylonian priest writing in Greek, says a fish-man named Oannes came from the sea by day, taught letters and crafts, and went back into the water at night. He did this until men knew enough. It is the apkallu story for a Hellenistic audience. The gulf is the door.",
  adapa:
    "Adapa, Enki’s wise man, breaks the south wind’s wing and is called to heaven. Enki tells him not to eat the food of death. Anu offers the food of life. Adapa refuses, and so men do not become immortal. The legend is a missed meal. The sky is a court, not a craft.",
  "nibiru-sitchin":
    "In the astronomical tablets nibiru is a crossing, a station of a planet, a name of Marduk’s star — not a homeworld on a 3,600-year orbit. The planet-of-the-crossing as a twelfth planet with Anunnaki gold-miners is Zecharia Sitchin’s late-twentieth-century legend. File it as a modern epic that borrowed cuneiform names.",
  utnapishtim:
    "Utnapishtim (Ziusudra, Atrahasis) is told to build a boat, ride out the flood, and is granted life ‘at the mouth of the rivers.’ Gilgamesh comes to him looking for the same gift and loses it to a snake. The legend is the flood, the boat, the plant of life. It is older than Genesis and not a rescue by engine.",
  "watchers-enoch":
    "1 Enoch: two hundred Watchers descend, take wives, beget giants, teach metal, cosmetics, and astrology, and are bound in the earth until judgment. The received story is a teaching that became a crime. Second Temple Jews kept it as the origin of evil. It is not a flight log. It is a fall.",
  "hermon-descent":
    "The oath is on Mount Hermon. Shemihazah and the others bind themselves to take wives. The mountain is a threshold between heaven and the north of Israel. Later folk and some Druze and Christian tellings still treat Hermon as a watch-post of angels. The descent is the plot.",
  nephilim:
    "Genesis 6 and Numbers give the Nephilim as the mighty ones of old, and as giants in the land the spies fear. Extra-biblical lore makes them the children of Watchers and women, drowned in the flood, still rumoured after. The legend is mixed blood and oversized bones. The word is Hebrew. The stature is the fear.",
  "azazel-arts":
    "Azazel teaches weapons, adornment, and dyes; he is bound in the desert. Leviticus sends a goat to Azazel on the Day of Atonement. The legend is a teacher of arts that heaven did not want in human hands, parked in a wilderness. Scapegoat and fallen smith are the same file in two testaments.",
  shemihazah:
    "Shemihazah (Semjaza) is the captain of the two hundred. He names the oath, takes a wife, and begets a giant. Enoch lore makes him the organiser, Azazel the technician. The legend is a chain of command in the descent. He does not come home.",
  "book-of-giants":
    "The giants have names — Ohyah, Hahyah, Mahaway — they dream of a tablet being washed, they send to Enoch for the meaning, they fight. Manichaean and Dead Sea fragments keep the story. The folklore is a doomed race that almost understood its own flood. It is a sequel, not a zoo.",
  "genesis-6":
    "‘The sons of God saw the daughters of men.’ Two Jewish readings: fallen angels, or the line of Seth mixing with Cain. The church kept both. The legend that stuck in Enochic country is the angelic one. Four verses in Genesis; a library out the side door.",
  "jubilees-watchers":
    "Jubilees says the Watchers were sent to teach first, and only then went wrong. That is a softer origin than Enoch’s conspiracy. The legend is of instructors who stayed too long. The calendar of Jubilees is the other half of the book: a heaven that counts.",
  "elohim-council":
    "Psalm 82, Deuteronomy 32 in the older reading, 1 Kings 22: a council of gods, or of the sons of God, with YHWH standing in. Israel’s folklore of heaven is not always a solo throne. The legend is a courtroom. Later monotheism reduced the bench. The psalm still has it.",
  "ugarit-council":
    "At Ugarit, El sits on the mountain at the source of the two deeps; the seventy sons of Athirat have their portions; Baal fights Yam and Mot. This is the Canaanite legend of how weather and death were ordered. Israel wrote next door. The mountain assembly is the shared furniture.",
  "ezekiel-wheels":
    "Ezekiel, by the Chebar, sees four living creatures and wheels within wheels, full of eyes, a throne above a crystal. Jewish and Christian folklore treated it as the merkabah — the chariot of God — a vision not to be taught lightly. The spacecraft reading is a twentieth-century caption. The prophet’s own word is appearance, not hardware.",
  "elijah-chariot":
    "A chariot of fire and horses of fire, a whirlwind, Elijah taken and Elisha left with the mantle. The legend is translation, not death: the prophet who did not stay in the ground. Later Jewish lore keeps him walking the world. The chariot is the Lord’s. It does not need a hangar.",
  "sinai-theophany":
    "The mountain smokes, the trumpet grows louder, the people stand off, the law is spoken. Midrash and later folklore pile on: the mountain lifted over Israel, the whole earth silent, the ox that would not pull. The received story is a god coming down in fire. The geology of the peninsula is a separate argument.",
  "pillar-cloud":
    "A pillar of cloud by day and fire by night leads the camp, stands between Israel and Egypt, settles on the tent. The legend is a guide that is also a presence. Later readers made a craft. The text makes a column that moves when the camp moves. That is already strange without a fuselage.",
  "ark-covenant":
    "A chest of acacia and gold that kills the curious, levels a temple of Dagon, and is not to be touched with bare hands. Ethiopian legend says it lives at Aksum. Other folklore parks it under the Temple Mount, in a cave, in France. The received power is that YHWH’s name sits between the cherubim. Treat that as the primary myth. The rest are last-known-locations.",
  "anakim-rephaim":
    "Og of Bashan, last of the Rephaim, a bed of iron nine cubits long; Anakim in the hill country the spies would not face; Emim and Zamzummim as other names for the same fear. Ugarit’s rpum are the dead of a royal cult. The legend is a land already occupied by the oversized and the ancestral. Dolmens in Bashan gave the story bones.",
  "jacob-ladder":
    "Jacob sleeps at Luz, dreams a ladder (or a ziggurat-stair) with angels going up and down, and names it Bethel — house of God. The legend is a gate of heaven in the hill country. Later Jewish lore makes the stone his pillow the foundation-stone of the world. The traffic on the stair is two-way.",
  "enoch-taken":
    "‘Enoch walked with God, and he was not, for God took him.’ Genesis gives one line. Enochic literature gives tours of heaven, the tablet of destiny, and a man who became a scribe of the angels. Ethiopian Christianity kept him in the canon. The legend is a human who did not die. The walks are the rest of the library.",
  "thoth-teacher":
    "Thoth is the ibis (or baboon) who invented writing, measured the heavens, healed the Eye, and judged the dead. In later Hermetic legend he is Hermes Trismegistus, teacher of a hidden philosophy. Egyptian folklore already had him as the scribe without whom the gods cannot decree. The measuring is the myth. The Greek name is a translation.",
  "pyramid-texts-stars":
    "Unas and his heirs become Imperishable Stars, climb a ladder, ride the sun-barque, eat the gods in one spell and nurse from them in another. That is the Old Kingdom legend of royal death: not a tomb that holds, a launch into the northern sky. The cannibal hymn is liturgy. The destination is the circumpolar stars.",
  "osiris-civilizer":
    "Plutarch’s Isis and Osiris, drawing on Egyptian priest-talk: Osiris taught Egypt to farm and to keep law, was murdered and dismembered by Seth, reassembled by Isis, and became lord of the dead. The civilizing teacher who is also a corpse is the folklore. The pyramid field is his later neighbourhood, not his factory.",
  "viracocha-andes":
    "Viracocha (Huiracocha, Thunupa in some tellings) rises from Titicaca, makes people of stone, walks the Andes in a robe, teaches, and leaves across the Pacific promising to return. Spanish chroniclers wrote it; Andean communities still know a walking creator. The staff and the tears on the Gate of the Sun are how the legend was carved. The white-bearded spaceman is a colonial paint job.",
  "quetzalcoatl-teacher":
    "Quetzalcoatl is wind, Venus, and a priest-king of Tollan who forbids heart-sacrifice in some tellings, falls into shame, and departs east on a raft of snakes, to return. Aztec courts used that return in 1519; how much was prophecy and how much was Spanish editing is a fight. The feathered teacher is Mesoamerican. The blond visitor is not.",
  saptarishi:
    "Seven seers of the Veda, mind-born sons of Brahmā, mapped onto the seven stars of Ursa Major. They keep the law between ages; they survive the flood with Manu in some cycles. The legend is a committee of sages in the northern sky. Indian astronomy still names those stars for them.",
  "manu-matsya":
    "A small fish asks Manu for protection, grows, and warns him of a flood. Manu builds a boat, ties it to the horn of the fish — Matsya, Vishnu’s first form — and rides out the dissolution with the seeds of life and the Vedas. The legend is a rescue by a god who is also an animal. It is not a submarine from elsewhere. It is a monsoon cosmology.",
  "etana-eagle":
    "Etana, a king without an heir, saves an eagle from a serpent and is carried up to heaven on its back to fetch the plant of birth. He looks down, panics, and the flight fails or succeeds depending on the tablet. The legend is a king who tried to steal fertility from the sky. The eagle is a character, not an airframe.",
  "ziggurat-babil":
    "Etemenanki — the foundation of heaven and earth — is Marduk’s stair in Babylon. Genesis later tells of a tower whose top is in heaven, a confusion of tongues. Babylonian liturgy already had a mountain made of brick that joined the levels of the world. Two legends share a skyline. One is a temple. One is a warning.",
  "dead-sea-enoch":
    "The people of Qumran kept multiple copies of Enoch and Jubilees. For that community the Watchers were not a campfire story. They were the explanation of a polluted world and a coming judgment. The legend is a library in jars. The desert is the filing cabinet.",
};

export function withAncientFolklore(files: DeskFile[]): DeskFile[] {
  return files.map((file) => {
    const folklore = ANCIENT_FOLKLORE[file.id];
    return folklore ? { ...file, folklore } : file;
  });
}
