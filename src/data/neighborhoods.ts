export interface NeighborhoodNearby {
  name: string;
  slug: string;
}

export interface Neighborhood {
  name: string;
  slug: string;
  tier: 1 | 2 | 3;
  metaDescription: string; // ≤155 chars, qualitative pricing
  heroTagline: string;
  intro: string;
  localContext: string[]; // paragraphs (NOT \n-delimited)
  whyLuxuryHere: string[];
  heritageMaterials: string[];
  conciergeServices?: string[];
  nearbyAreas: NeighborhoodNearby[];
  geo?: { lat: string; lng: string };
  ogImage?: string; // optional per-area OG image; defaults to /og-image.png
}

export const neighborhoods: Record<string, Neighborhood> = {
  uplands: {
    name: "Uplands",
    slug: "uplands",
    tier: 1,
    metaDescription:
      "Bespoke concierge cleaning for Uplands trophy estates, the Olmsted-designed National Historic Site in Oak Bay. Discreet, heritage-aware care.",
    heroTagline: "Heritage-aware care for an Olmsted garden suburb of trophy estates.",
    intro:
      "Uplands is the rarefied heart of Oak Bay's estate district — a 465-acre garden suburb laid out by landscape architect John Charles Olmsted in 1907 and designated a National Historic Site in 2019. We bring quiet, museum-level care to its serpentine roads and trophy estates, where discretion is not a luxury but a baseline expectation.",
    localContext: [
      "Few addresses on Vancouver Island carry the prestige of Uplands. Olmsted's plan — gentle serpentine roads tracing the contours of the land, generous setbacks, and preserved Garry oak meadows — created a neighbourhood that still feels like a private park more than a subdivision. Homes here are among the most valuable in the region, and their owners expect a level of care that matches the address.",
      "The 1913 Riffington estate, designed by architect Philip A. Jullien in the Tudor Revival manner, is emblematic of the craftsmanship found throughout the enclave. Many residences are heritage-listed, which means routine cleaning here is never routine: surfaces, millwork, and finishes must be treated with an awareness of preservation guidelines and the building's original materials.",
      "Proximity to the Strait brings beauty and a quiet adversary — salt air. The same ocean views prized by Uplands homeowners drive a slow, persistent salt-air load on stone, marble, and heritage windows. Our concierge approach builds ongoing remediation into a tailored plan, so the home's value and character are protected season after season.",
    ],
    whyLuxuryHere: [
      "Discreet, fully vetted staff trained for the privacy expectations of nationally significant estates.",
      "Heritage-preservation awareness woven into every clean, respecting designation guidelines.",
      "Ongoing salt-air remediation for stone, marble, and original windows facing the Strait.",
      "A single dedicated point of contact who learns the rhythms of your household.",
      "Coordinated care across cleaning, organizing, and errands for absentee and resident owners alike.",
    ],
    heritageMaterials: [
      "Sandstone and Indiana limestone masonry — hundreds of tonnes of stone across the district.",
      "Marble, cast limestone, and heritage millwork that demand surface-safe, pH-appropriate methods.",
      "Tudor Revival timber and plasterwork preserved with conservation-minded technique.",
      "Original leaded and heritage windows cleaned without abrasive contact.",
    ],
    conciergeServices: [
      "Whole-estate maintenance cleans on a discreet, recurring cadence.",
      "Heritage detail care for millwork, stone, and period finishes.",
      "Absentee oversight and seasonal resets for owners who travel.",
    ],
    nearbyAreas: [
      { name: "Oak Bay", slug: "oak-bay" },
      { name: "Gonzales", slug: "gonzales" },
      { name: "Cadboro Bay", slug: "cadboro-bay" },
      { name: "Rockland", slug: "rockland" },
      { name: "Ten Mile Point", slug: "ten-mile-point" },
    ],
    geo: { lat: "48.4480", lng: "-123.2980" },
  },

  "oak-bay": {
    name: "Oak Bay",
    slug: "oak-bay",
    tier: 1,
    metaDescription:
      "Concierge cleaning for Oak Bay's heritage estates, from Maclure half-timbered homes to oceanfront properties near the Royal Victoria Yacht Club.",
    heroTagline: "Museum-level care for Oak Bay's heritage homes and oceanfront estates.",
    intro:
      "Oak Bay sets the architectural tone for luxury Victoria — more than a hundred registered heritage properties, roughly five hundred of them shaped by the hand of architect Samuel Maclure. We care for these homes the way they deserve: quietly, precisely, and with deep respect for the craftsmanship that defines them.",
    localContext: [
      "Maclure's half-timbered Arts and Crafts and Tudor Revival homes gave Oak Bay its enduring character, and they remain among the most sought-after addresses on Vancouver Island. Caring for them well means understanding period detailing — the wrought iron, the cast limestone fireplaces, the native-wood joinery — rather than applying a one-size approach.",
      "The neighbourhood's landmarks read like a register of genteel Victoria: the 1913 Bowker Gates designed by Maclure, the Royal Victoria Yacht Club founded in 1912, and Uplands Park with its 76-acre Garry oak reserve. Along Beach Drive, Garry oaks four centuries old shade homes that have been cherished for generations.",
      "Many Oak Bay estates sit close to the water, where salt air steadily works on marble, limestone, and heritage windows. Our concierge cleaning programs are built to counter that exposure, pairing immaculate everyday presentation with the patient, protective maintenance these high-value, ocean-adjacent properties require.",
    ],
    whyLuxuryHere: [
      "Specialists who recognize and protect Maclure-era detailing and heritage finishes.",
      "Vetted, discreet teams comfortable in homes of significant value and history.",
      "Salt-air protection for oceanfront marble, limestone, and original windows.",
      "Tailored cadence that fits a household's privacy and entertaining calendar.",
      "One household manager handling cleaning, organizing, and errands together.",
    ],
    heritageMaterials: [
      "Cast limestone fireplaces and wrought-iron detailing cleaned with conservation care.",
      "Marble and native-wood joinery treated with surface-safe methods.",
      "Half-timbered exteriors and heritage windows maintained without abrasion.",
      "Period plaster and millwork dusted to a museum standard.",
    ],
    conciergeServices: [
      "Recurring estate maintenance tuned to your entertaining schedule.",
      "Heritage finish care for fireplaces, joinery, and windows.",
      "Discreet whole-home resets before and after gatherings.",
    ],
    nearbyAreas: [
      { name: "Uplands", slug: "uplands" },
      { name: "Gonzales", slug: "gonzales" },
      { name: "Rockland", slug: "rockland" },
      { name: "Fairfield", slug: "fairfield" },
      { name: "Cadboro Bay", slug: "cadboro-bay" },
    ],
    geo: { lat: "48.4262", lng: "-123.3120" },
  },

  rockland: {
    name: "Rockland",
    slug: "rockland",
    tier: 1,
    metaDescription:
      "Heritage-aware concierge cleaning in Rockland, Victoria's historic Nob Hill, home to Craigdarroch Castle and Government House.",
    heroTagline: "Masonry-aware care for Rockland's Victorian and Edwardian landmarks.",
    intro:
      "Rockland — Victoria's historic \"Nob Hill\" — gathers the city's grandest Victorian and Edwardian houses on elevated, garden-rich streets five minutes from downtown. With two National Historic Sites and a hundred properties on the City Heritage Register, it demands a cleaning partner fluent in the language of old stone and fine craftsmanship.",
    localContext: [
      "Built largely between the 1890s and 1910s, Rockland is anchored by two National Historic Sites: Craigdarroch Castle, the Dunsmuir family's Scottish Baronial mansion completed in 1890 with more than 25,000 square feet of interior, and Government House, the Lieutenant Governor's residence set within 36 acres of formal gardens. The neighbourhood's architectural pedigree runs through the work of Maclure and Rattenbury.",
      "Tudor Revival, Arts and Crafts, Italianate, and Classical Revival homes line the elevated streets, many of them carrying heritage designations that constrain how a property may be altered or maintained. That makes a masonry-aware, designation-conscious approach essential — the wrong product or method on a Victorian chimney or heritage window can do lasting harm.",
      "Lush gardens, mature Garry oak ecosystems, and a tranquil, established calm define daily life here. Our concierge programs respect that serenity, working quietly in the background and treating original stone, plaster, and joinery with the specialist care that century-old homes require.",
    ],
    whyLuxuryHere: [
      "Designation-conscious cleaning that respects heritage-preservation constraints.",
      "Masonry-aware methods for Victorian stonework, chimneys, and original windows.",
      "Quiet, vetted teams suited to landmark residences and refined neighbours.",
      "Care calibrated to Maclure- and Rattenbury-era craftsmanship.",
      "A single point of contact for cleaning, organizing, and household errands.",
    ],
    heritageMaterials: [
      "Stone masonry and half-timbering maintained with conservation-grade technique.",
      "Victorian chimneys and original brickwork cleaned without abrasive damage.",
      "Heritage windows and leaded glass handled with non-contact care.",
      "Period plaster, millwork, and hardwood floors finished to a heritage standard.",
    ],
    conciergeServices: [
      "Recurring heritage-home maintenance on a discreet schedule.",
      "Specialist care for stone, plaster, and period joinery.",
      "Whole-home resets that honour designation guidelines.",
    ],
    nearbyAreas: [
      { name: "Oak Bay", slug: "oak-bay" },
      { name: "Fairfield", slug: "fairfield" },
      { name: "Uplands", slug: "uplands" },
      { name: "James Bay", slug: "james-bay" },
      { name: "Gonzales", slug: "gonzales" },
    ],
    geo: { lat: "48.4220", lng: "-123.3440" },
  },

  "ten-mile-point": {
    name: "Ten Mile Point",
    slug: "ten-mile-point",
    tier: 1,
    metaDescription:
      "Ultra-private concierge cleaning for Ten Mile Point's oceanfront-bluff estates on Haro Strait, beside the Ecological Reserve.",
    heroTagline: "Salt-spray expertise for glass-walled oceanfront estates on Haro Strait.",
    intro:
      "Ten Mile Point reaches out as a rocky peninsula into Haro Strait, a secluded enclave of mid-century and custom-contemporary estates perched on oceanfront bluffs. Floor-to-ceiling glazing, private moorage, and absolute privacy define these homes — and so does an extreme salt-spray exposure that calls for specialist care.",
    localContext: [
      "The estates of Ten Mile Point are built for the view: walls of glass open to Haro Strait, half-acre-plus lots fold into secluded coves, and several properties enjoy private beach access or deep-water moorage. The neighbourhood's mid-century and contemporary architecture prizes light and transparency, which makes flawless view-glass a defining element of how these homes present.",
      "Bordered by the Ten Mile Point Ecological Reserve and known among divers for its dramatic underwater terrain, the point is one of the most private settings in Greater Victoria. Homeowners value that seclusion deeply, and they expect a cleaning partner who honours it — arriving quietly, working efficiently, and leaving no trace beyond an immaculate home.",
      "This is among the harshest salt-spray zones in the region. Marine air drives mineral deposits onto expansive glass and works steadily at exterior finishes. Our concierge programs make view-glass clarity and protective maintenance a routine, so these high-value oceanfront estates always look their best against the water.",
    ],
    whyLuxuryHere: [
      "Expert view-glass cleaning for the floor-to-ceiling glazing these homes are built around.",
      "Salt-spray remediation in one of the region's most exposed marine settings.",
      "Ultra-discreet teams that respect the point's prized seclusion.",
      "Care for waterfront detailing, decks, and moorage-adjacent surfaces.",
    ],
    heritageMaterials: [
      "Exposed local stone and Douglas fir finished with surface-safe care.",
      "Heated concrete floors maintained to preserve their finish.",
      "Teak and Ipe decking cleaned and protected against marine weathering.",
      "Expansive view-glass kept streak-free against constant salt spray.",
    ],
    conciergeServices: [
      "Routine view-glass detailing for glass-walled oceanfront homes.",
      "Salt-spray maintenance for exterior stone, wood, and decking.",
      "Private, by-arrangement access for secluded estates.",
    ],
    nearbyAreas: [
      { name: "Cadboro Bay", slug: "cadboro-bay" },
      { name: "Gordon Head", slug: "gordon-head" },
      { name: "Uplands", slug: "uplands" },
      { name: "Oak Bay", slug: "oak-bay" },
    ],
    geo: { lat: "48.4630", lng: "-123.2740" },
  },

  "cadboro-bay": {
    name: "Cadboro Bay",
    slug: "cadboro-bay",
    tier: 1,
    metaDescription:
      "Concierge cleaning for Cadboro Bay's seaside estates, including the oceanfront homes of Queenswood Drive near Cadboro-Gyro Park.",
    heroTagline: "Oceanfront care for Queenswood estates and Cadboro Bay's seaside village.",
    intro:
      "Cadboro Bay pairs a relaxed seaside village with some of Saanich's most coveted oceanfront addresses. Along Queenswood Drive, estates with in-ground pools and private docks look out over the bay, while heritage and character homes nestle into the village core — all of it asking for a cleaning partner attuned to salt air and discretion.",
    localContext: [
      "Queenswood Drive is the jewel of Cadboro Bay: a line of oceanfront estates, several with in-ground pools and private docks, set above the water on large, private lots. These are quintessential quiet-luxury homes — understated from the road, exceptional within — and their owners expect care delivered with the same restraint.",
      "The neighbourhood centres on a genuine seaside village and the sandy 1.5-kilometre crescent of Cadboro-Gyro Park, with old-growth trails close at hand. Its position adjacent to the University of Victoria draws an accomplished academic and professional clientele who value reliability and a light, respectful footprint in their homes.",
      "Oceanfront living here means constant salt spray on windows and exteriors. Our concierge programs fold window and exterior salt-spray care into a tailored maintenance plan, keeping Queenswood's estates and the bay's character homes immaculate without disrupting the easy rhythm of village life.",
    ],
    whyLuxuryHere: [
      "Estate-grade care for Queenswood's oceanfront homes, pools, and dock-side spaces.",
      "Salt-spray window and exterior maintenance for waterfront properties.",
      "Discreet teams trusted by an academic and professional clientele.",
      "Tailored cadence for both full-time residents and seasonal owners.",
    ],
    heritageMaterials: [
      "Heritage and character-home finishes maintained with period-appropriate care.",
      "Oceanfront window glass kept clear against persistent salt spray.",
      "Exterior surfaces and decking protected from marine weathering.",
      "Natural-stone and fine-wood detailing treated with surface-safe methods.",
    ],
    conciergeServices: [
      "Recurring maintenance for Queenswood oceanfront estates.",
      "Salt-spray care for waterfront windows and exteriors.",
      "Seasonal resets for village character homes.",
    ],
    nearbyAreas: [
      { name: "Ten Mile Point", slug: "ten-mile-point" },
      { name: "Gordon Head", slug: "gordon-head" },
      { name: "Uplands", slug: "uplands" },
      { name: "Oak Bay", slug: "oak-bay" },
    ],
    geo: { lat: "48.4560", lng: "-123.2920" },
  },

  "north-saanich": {
    name: "North Saanich",
    slug: "north-saanich",
    tier: 1,
    metaDescription:
      "Concierge cleaning for North Saanich waterfront estates along the Lands End Road corridor, with absentee oversight near the airport and marinas.",
    heroTagline: "White-glove care for waterfront acreage estates along Lands End Road.",
    intro:
      "North Saanich is a landscape of waterfront estates, rural-residential acreage, and working marinas at the top of the Peninsula. The Lands End Road corridor on Haro Strait is its signature address — home to expansive low-bank oceanfront estates, often with guest houses, that ask for genuinely white-glove care.",
    localContext: [
      "Lands End Road has become the Peninsula's marquee luxury waterfront corridor. The estates here run large — seven thousand square feet and more is not unusual — with guest houses, premium kitchens and baths, smart-home systems, and direct low-bank access to the water. They represent some of Vancouver Island's most valuable homes, and they demand a correspondingly elevated standard of service.",
      "Beyond the waterfront, North Saanich spreads into rural-residential acreage and ALR land, with equestrian properties and a string of marinas — Canoe Cove, Deep Cove, Van Isle — woven through it. Yachting and private moorage are part of the lifestyle, and many homes are tied to that maritime culture.",
      "Because the area sits minutes from the airport, a meaningful share of owners are absentee, traveling frequently or splitting time between residences. Our concierge model is built precisely for this: discreet absentee oversight, seasonal readiness, and a consistent, trusted presence so a sprawling waterfront estate is always guest-ready.",
    ],
    whyLuxuryHere: [
      "Absentee oversight and seasonal readiness for frequently traveling owners.",
      "White-glove care for expansive waterfront estates and guest houses.",
      "Discreet teams comfortable with high-value, gated, and remote properties.",
      "Care for floor-to-ceiling glass and natural-stone finishes facing the Strait.",
      "Coordinated cleaning, organizing, and errands across main house and guest quarters.",
    ],
    heritageMaterials: [
      "Floor-to-ceiling glass kept pristine against waterfront salt air.",
      "Natural stone and hardwood maintained with surface-safe technique.",
      "Smart-home surfaces and premium fixtures cleaned with appropriate care.",
      "Decks and oceanfront exteriors protected from marine weathering.",
    ],
    conciergeServices: [
      "Absentee-owner oversight for waterfront estates near the airport.",
      "Guest-house preparation and whole-estate resets.",
      "Seasonal opening and closing of secondary residences.",
    ],
    nearbyAreas: [
      { name: "Sidney", slug: "sidney" },
      { name: "Dean Park", slug: "dean-park" },
      { name: "Cordova Bay", slug: "cordova-bay" },
      { name: "Willis Point", slug: "willis-point" },
    ],
    geo: { lat: "48.6590", lng: "-123.4150" },
  },

  "willis-point": {
    name: "Willis Point",
    slug: "willis-point",
    tier: 1,
    metaDescription:
      "The epitome of quiet luxury: discreet concierge cleaning for Willis Point's ultra-secluded timber estates above Tod Inlet near Butchart Gardens.",
    heroTagline: "The epitome of quiet luxury — discreet concierge care for a single-road enclave.",
    intro:
      "Willis Point is the epitome of quiet luxury and discreet concierge living. Reached by a single road above Tod Inlet, across the water from Butchart Gardens, this ultra-secluded enclave of roughly 150 homes is the kind of place where exclusivity is measured in privacy rather than display — and where a trusted, invisible standard of care matters most.",
    localContext: [
      "There is one way in and one way out: Willis Point Road. That single-access geography gives the enclave its profound seclusion and its tight-knit calm. Homes sit on acreages of one to ten acres and more, many of them timber-frame and post-and-beam lodges with A-frame and inlet-view character — substantial properties hidden in the forest above Tod Inlet.",
      "Bordering Gowlland Tod Provincial Park and threaded by Tod Creek, Willis Point is defined by its trees. That forest setting is its beauty and its maintenance reality: debris settles persistently on cedar and heavy timber, and homes left vacant for stretches benefit from regular, watchful inspection. No competing service reaches this far into the enclave with the consistency it deserves.",
      "For owners who prize discretion above all, our concierge model is a natural fit. We provide quiet, dependable care and long-vacancy oversight, treating the privacy of this single-road community as the first feature of the service — not an afterthought.",
    ],
    whyLuxuryHere: [
      "Unrivalled discretion for an enclave defined by privacy and single-road seclusion.",
      "Long-vacancy inspection and oversight for owners who travel or split time away.",
      "Care for cedar, heavy timber, and post-and-beam construction in a forest setting.",
      "Dependable presence in an enclave few services reliably reach.",
    ],
    heritageMaterials: [
      "Heavy fir and cedar timber maintained against persistent forest debris.",
      "Post-and-beam and reclaimed-wood detailing cared for with surface-safe methods.",
      "Stone fireplaces and natural finishes treated with conservation-minded technique.",
      "Metal roofing and exteriors kept clear of accumulating forest litter.",
    ],
    conciergeServices: [
      "Long-vacancy oversight and inspection for absentee owners.",
      "Recurring care for timber-frame and post-and-beam estates.",
      "Seasonal resets for forest-set acreage homes.",
    ],
    nearbyAreas: [
      { name: "Prospect Lake", slug: "prospect-lake" },
      { name: "Broadmead", slug: "broadmead" },
      { name: "Cordova Bay", slug: "cordova-bay" },
      { name: "North Saanich", slug: "north-saanich" },
    ],
    geo: { lat: "48.5470", lng: "-123.4760" },
  },

  fairfield: {
    name: "Fairfield",
    slug: "fairfield",
    tier: 2,
    metaDescription:
      "Concierge cleaning for Fairfield's heritage Craftsman and Edwardian homes near Beacon Hill Park and the Dallas Road waterfront.",
    heroTagline: "Heritage finish care for Fairfield's tree-lined Craftsman elegance.",
    intro:
      "Fairfield is Victoria's most stable luxury market — tree-lined streets of early-1900s homes within walking distance of Beacon Hill Park, the Dallas Road waterfront, and the convivial heart of Cook Street Village. Its Arts and Crafts and Edwardian houses reward an owner who cares for original detailing, and so do we.",
    localContext: [
      "Long regarded as the most stable market in Victoria, Fairfield is prized for its enduring character: Arts and Crafts bungalows, Craftsman homes, and Edwardian foursquares set among mature trees. The neighbourhood's heritage runs deep — Ross Bay Villa, a Gothic Revival cottage built in 1865 by John Wright, survives today as a heritage museum.",
      "Daily life here is unusually rich. The Dallas Road oceanfront and its 20-kilometre waterfront walkway edge the south side; Beacon Hill Park's 200 acres lie to the west; and Cook Street Village and the Moss Street Market give the area a walkable, refined ease that residents cherish.",
      "Two factors shape our care in Fairfield: the heritage finishes inside these homes, and the salt-spray exposure along Dallas Road. We bring period-appropriate methods to original woodwork and plaster while building protective maintenance into the plan for properties that face the open water.",
    ],
    whyLuxuryHere: [
      "Period-appropriate care for Craftsman, Arts and Crafts, and Edwardian finishes.",
      "Salt-spray maintenance for homes near the Dallas Road oceanfront.",
      "Discreet, vetted teams suited to an established, refined community.",
      "Flexible cadence for walkable in-town estates and family residences.",
      "One familiar team, returning often enough to know the home’s rhythms.",
    ],
    heritageMaterials: [
      "Original Craftsman woodwork and built-ins finished with surface-safe care.",
      "Edwardian plaster and heritage millwork dusted to a fine standard.",
      "Period windows maintained without abrasive contact.",
      "Hardwood floors and natural finishes protected season to season.",
    ],
    conciergeServices: [
      "Recurring maintenance for heritage Craftsman and Edwardian homes.",
      "Salt-spray care for Dallas Road-adjacent properties.",
      "Whole-home resets for entertaining and seasonal transitions.",
    ],
    nearbyAreas: [
      { name: "Oak Bay", slug: "oak-bay" },
      { name: "Rockland", slug: "rockland" },
      { name: "James Bay", slug: "james-bay" },
      { name: "Downtown Victoria", slug: "downtown-victoria" },
      { name: "Gonzales", slug: "gonzales" },
    ],
    geo: { lat: "48.4160", lng: "-123.3460" },
  },

  "gordon-head": {
    name: "Gordon Head",
    slug: "gordon-head",
    tier: 2,
    metaDescription:
      "Concierge cleaning for Gordon Head's renovated West Coast homes near the University of Victoria and Mount Douglas Park.",
    heroTagline: "Material-rich care for renovated West Coast homes near UVic.",
    intro:
      "Gordon Head is a settled, leafy district beside the University of Victoria, where 1950s-to-1980s West Coast homes have been thoughtfully renovated into material-rich residences. With Mount Douglas Park at hand and a clientele of professionals and empty-nesters, it asks for careful, finish-aware maintenance.",
    localContext: [
      "Once mid-century West Coast houses, many Gordon Head homes have been extensively renovated, layering in engineered and old-growth fir hardwood, heated concrete, quartz and stone surfaces, custom millwork, and cedar detailing. These richer material palettes reward a cleaner who understands how each surface should be treated.",
      "The neighbourhood's setting is a quiet draw. Mount Douglas Park — PKOLS — rises to summit views over a 182-hectare reserve, and the streets around Arbutus, Ferndale, and Mayfair drives carry a calm, established feel. Its position adjacent to the University of Victoria keeps the area anchored to an academic and professional community.",
      "The typical Gordon Head household — dual-income professionals and empty-nesters — values reliability and a respectful, low-disruption presence. Our concierge programs deliver consistent, finish-aware care that keeps these renovated homes looking as considered as they were designed to be.",
    ],
    whyLuxuryHere: [
      "Finish-aware care for engineered hardwood, heated concrete, and stone surfaces.",
      "Reliable, low-disruption service for busy professional households.",
      "Discreet, vetted teams suited to a settled, established neighbourhood.",
      "Tailored cadence for empty-nesters and dual-income families alike.",
    ],
    heritageMaterials: [
      "Engineered and old-growth fir hardwood cleaned with surface-safe methods.",
      "Heated concrete floors maintained to preserve their finish.",
      "Quartz and natural-stone counters treated with appropriate products.",
      "Custom millwork and cedar detailing dusted and cared for precisely.",
    ],
    conciergeServices: [
      "Recurring maintenance for renovated West Coast homes.",
      "Surface-specific care for mixed hardwood, stone, and concrete.",
      "Whole-home resets timed to the household's schedule.",
    ],
    nearbyAreas: [
      { name: "Cadboro Bay", slug: "cadboro-bay" },
      { name: "Ten Mile Point", slug: "ten-mile-point" },
      { name: "Broadmead", slug: "broadmead" },
      { name: "Cordova Bay", slug: "cordova-bay" },
    ],
    geo: { lat: "48.4730", lng: "-123.3120" },
  },

  broadmead: {
    name: "Broadmead",
    slug: "broadmead",
    tier: 2,
    metaDescription:
      "Concierge cleaning for Broadmead's master-planned executive estates near Rithet's Bog, with absence management for commuting owners.",
    heroTagline: "Executive-home care with absence management for Broadmead's estates.",
    intro:
      "Broadmead is a master-planned executive enclave of curvilinear cul-de-sacs, developed from the late 1970s and consistently among Victoria's highest-value neighbourhoods. Its large, finely finished homes and commuting owners make a natural match for a concierge model built on consistency and absence management.",
    localContext: [
      "Conceived as a master-planned community, Broadmead arranges its executive homes along quiet, curvilinear cul-de-sacs — many of them in the three-thousand to five-thousand-square-foot range and beyond. Marble and granite, hardwood, stone foyers, cedar shakes, and smart-home systems from the likes of Lutron and Crestron are common, calling for a cleaner conversant with premium finishes.",
      "Green space is woven through the neighbourhood: the 50-hectare Rithet's Bog Conservation Area sits at its heart, with Elk and Beaver Lake close by and Broadmead Village providing day-to-day amenities. It is one of the region's most consistently sought-after executive addresses.",
      "Many Broadmead owners commute via the Swartz Bay ferries or the airport, which makes absence management a recurring need — homes kept guest-ready and watched over while owners travel. Our concierge programs provide exactly that, and they thrive in Broadmead's strong word-of-mouth referral culture.",
    ],
    whyLuxuryHere: [
      "Absence management keeping executive homes guest-ready while owners travel.",
      "Premium-finish care for marble, granite, hardwood, and stone foyers.",
      "Discreet, vetted teams trusted within a close referral community.",
      "Smart-home-aware cleaning that respects integrated systems.",
    ],
    heritageMaterials: [
      "Marble and granite surfaces maintained with surface-safe products.",
      "Hardwood floors and stone foyers cared for to preserve their finish.",
      "Cedar-shake exteriors and detailing kept clean and protected.",
      "Smart-home fixtures cleaned with appropriate, system-safe technique.",
    ],
    conciergeServices: [
      "Absence management and oversight for commuting owners.",
      "Recurring maintenance for executive estates.",
      "Whole-home resets ahead of returns and gatherings.",
    ],
    nearbyAreas: [
      { name: "Cordova Bay", slug: "cordova-bay" },
      { name: "Prospect Lake", slug: "prospect-lake" },
      { name: "Gordon Head", slug: "gordon-head" },
      { name: "Willis Point", slug: "willis-point" },
    ],
    geo: { lat: "48.4870", lng: "-123.3690" },
  },

  "cordova-bay": {
    name: "Cordova Bay",
    slug: "cordova-bay",
    tier: 2,
    metaDescription:
      "Concierge cleaning for Cordova Bay's beachfront and West Coast homes near Mattick's Farm and the golf course, with absentee key-holding.",
    heroTagline: "Salt-air and West Coast care for Cordova Bay's beachfront homes.",
    intro:
      "Cordova Bay strings West Coast and beachfront homes along the shoreline of Haro Strait, looking across to the San Juans. With Mattick's Farm, the Cordova Bay Golf Course, and the estate streets above the beach, it draws vacation and secondary-home owners who need a trusted local presence.",
    localContext: [
      "Cordova Bay Road traces the beachfront, while estate streets such as Doumac and Haliburton climb the slopes above. The neighbourhood's homes lean into West Coast design — timber, cedar and fir, floor-to-ceiling glass, granite and slate, metal roofing, and Ipe decking — set against open views of Haro Strait and the San Juan Islands.",
      "Local landmarks give the area its character: the boutique village at Mattick's Farm, the Cordova Bay Golf Course, and The Ridge enclave above. It is a place that feels both coastal and convenient, which is part of why so many homes here serve as vacation or secondary residences.",
      "Those ownership patterns shape our work. Salt air challenges glass and cedar, and absentee owners need reliable key-holding, event turnover, and watchful care between visits. Our concierge programs handle all of it — keeping beachfront homes immaculate and ready whenever their owners return.",
    ],
    whyLuxuryHere: [
      "Absentee key-holding and oversight for vacation and secondary homes.",
      "Salt-air care for floor-to-ceiling glass and cedar exteriors.",
      "Event turnover and guest-ready resets between visits.",
      "Discreet, vetted teams trusted with access to unoccupied homes.",
    ],
    heritageMaterials: [
      "West Coast timber, cedar, and fir maintained with surface-safe methods.",
      "Floor-to-ceiling glass kept clear against persistent salt air.",
      "Granite and slate surfaces cared for to preserve their finish.",
      "Ipe decking and metal roofing protected from marine weathering.",
    ],
    conciergeServices: [
      "Absentee key-holding and between-visit oversight.",
      "Event turnover and guest-ready resets for entertaining.",
      "Seasonal care for beachfront and West Coast homes.",
    ],
    nearbyAreas: [
      { name: "Broadmead", slug: "broadmead" },
      { name: "Gordon Head", slug: "gordon-head" },
      { name: "Dean Park", slug: "dean-park" },
      { name: "North Saanich", slug: "north-saanich" },
    ],
    geo: { lat: "48.5130", lng: "-123.3760" },
  },

  "dean-park": {
    name: "Dean Park",
    slug: "dean-park",
    tier: 2,
    metaDescription:
      "Concierge cleaning for Dean Park Estates' elevated executive homes beside John Dean Provincial Park, with absentee oversight for commuters.",
    heroTagline: "View-glass care for elevated executive estates beside John Dean Park.",
    intro:
      "Dean Park Estates rises on the slopes beside John Dean Provincial Park, an enclave of elevated executive homes with sweeping views over Patricia Bay, the Saanich Inlet, the Gulf Islands, and the Olympic Mountains. Substantial and view-oriented, these residences ask for finish-aware, absentee-friendly care.",
    localContext: [
      "Set 100 to 200 metres above the Peninsula beside John Dean Provincial Park and its 244-metre summit, Dean Park Estates is built for the panorama. Homes along Dean Park, Tatlow, and Blue Heron roads frame views of Patricia Bay, the Saanich Inlet, the Gulf Islands, and the distant Olympics — vistas that make crystal-clear view-glass essential.",
      "These are generously scaled residences, often four thousand to seven thousand square feet, finished with timber and cedar, granite and limestone, large-format glazing, oak floors, heated driveways, and smart-home systems. The material richness rewards a cleaner who understands how to care for each surface properly.",
      "Owners here are frequently executive commuters tied to the ferries and the airport, which makes absentee management a recurring need. Our concierge programs keep these elevated estates pristine and guest-ready between trips, with particular attention to the expansive view-glass these homes are designed around.",
    ],
    whyLuxuryHere: [
      "View-glass care for the large-format glazing these homes frame their views with.",
      "Absentee management for executive commuters who travel often.",
      "Finish-aware care for timber, stone, and oak surfaces.",
      "Discreet, vetted teams suited to elevated, private estates.",
      "A single, discreet point of contact for everything the home needs.",
    ],
    heritageMaterials: [
      "Large-format view-glass kept streak-free for panoramic outlooks.",
      "Timber, cedar, and oak finishes maintained with surface-safe methods.",
      "Granite and limestone surfaces cared for to preserve their finish.",
      "Smart-home fixtures and heated surfaces cleaned with appropriate technique.",
    ],
    conciergeServices: [
      "Absentee oversight for commuting executive owners.",
      "Recurring maintenance for elevated view estates.",
      "Guest-ready resets ahead of returns.",
    ],
    nearbyAreas: [
      { name: "North Saanich", slug: "north-saanich" },
      { name: "Sidney", slug: "sidney" },
      { name: "Cordova Bay", slug: "cordova-bay" },
    ],
    geo: { lat: "48.6310", lng: "-123.4250" },
  },

  "prospect-lake": {
    name: "Prospect Lake",
    slug: "prospect-lake",
    tier: 2,
    metaDescription:
      "Concierge cleaning for Prospect Lake's rare lakefront luxury homes near Francis/King and Thetis Lake parks, with seasonal open and close.",
    heroTagline: "Lakefront care for rare waterfront homes near Thetis Lake.",
    intro:
      "Prospect Lake offers something rare in the region: genuine lakefront luxury. Set on a quiet, nearly private lake between Francis/King and Thetis Lake regional parks, its waterfront homes carry the particular maintenance needs of lake living — and reward a cleaner who understands them.",
    localContext: [
      "Along Prospect Lake, Munn, and Sparton roads, lakefront homes look out over a 1.5-kilometre lake that feels almost private. The setting is serene and green, framed by the surrounding parkland of Francis/King and Thetis Lake, and the homes are built to make the most of it — many with their own boats and docks.",
      "Lake living shapes these residences materially: cedar and fir, fieldstone fireplaces, wide-plank oak floors, triple-pane lake-facing glazing, and metal roofing are characteristic. They are warm, natural, and substantial — and each of those surfaces benefits from care matched to its character.",
      "The lakefront brings its own maintenance rhythm. Pollen, algae, and moisture settle on cedar, stone, and hardwood, and seasonal opening and closing is part of the routine. Our concierge programs build this into a tailored plan, keeping lakefront homes immaculate through every season.",
    ],
    whyLuxuryHere: [
      "Lakefront-specific care addressing pollen, algae, and moisture.",
      "Seasonal opening and closing for waterfront homes and docks.",
      "Finish-aware care for cedar, fieldstone, and wide-plank oak.",
      "Discreet, vetted teams suited to private lakeside estates.",
    ],
    heritageMaterials: [
      "Cedar and fir finishes maintained against lakefront moisture and pollen.",
      "Fieldstone fireplaces cleaned with conservation-minded technique.",
      "Wide-plank oak floors cared for to preserve their finish.",
      "Triple-pane lake-facing glazing kept clear and streak-free.",
    ],
    conciergeServices: [
      "Seasonal open-and-close for lakefront homes.",
      "Recurring maintenance addressing pollen, algae, and moisture.",
      "Care for boats, docks, and waterfront living spaces.",
    ],
    nearbyAreas: [
      { name: "Willis Point", slug: "willis-point" },
      { name: "Broadmead", slug: "broadmead" },
      { name: "Gordon Head", slug: "gordon-head" },
      { name: "Bear Mountain", slug: "bear-mountain" },
    ],
    geo: { lat: "48.5170", lng: "-123.4470" },
  },

  sidney: {
    name: "Sidney",
    slug: "sidney",
    tier: 2,
    metaDescription:
      "Concierge cleaning for Sidney's upscale seaside homes and oceanfront condos, minutes from the airport and Swartz Bay ferries.",
    heroTagline: "Seaside care for Sidney's oceanfront condos and second homes.",
    intro:
      "Sidney-by-the-Sea is an upscale, walkable seaside town — Canada's only Booktown and a beloved retirement capital — looking out over the Salish Sea and the Gulf Islands. Its oceanfront condos and seaside homes, minutes from the airport and ferries, suit affluent retirees and second-home owners who value reliable, discreet care.",
    localContext: [
      "Sidney's charm is its compact, walkable waterfront town, rich with independent bookshops and a relaxed seaside pace. Just five to ten minutes from the airport and the Swartz Bay ferries, it offers an ease of coming and going that appeals to second-home owners and frequent travelers alike.",
      "Much of Sidney's luxury lives in its oceanfront condos — residences such as the West Coast contemporary Coast Waterfront Residences along Lochside Drive — alongside seaside single-family homes. These properties enjoy open views of the Salish Sea and Gulf Islands and the salt air that comes with them.",
      "The town's affluent retirees and second-home owners value a light, dependable touch and an active social calendar kept unburdened by household upkeep. Our concierge programs deliver consistent care, with particular attention to the salt-air maintenance that oceanfront condos require.",
    ],
    whyLuxuryHere: [
      "Salt-air care for oceanfront condos facing the Salish Sea.",
      "Reliable oversight for second-home owners who travel often.",
      "Discreet, vetted teams suited to an affluent retiree community.",
      "Flexible cadence that keeps a busy social calendar unburdened.",
      "Quiet, dependable care that runs without you having to manage it.",
    ],
    heritageMaterials: [
      "Oceanfront condo glass kept clear against persistent salt air.",
      "Natural-stone and fine surfaces maintained with surface-safe methods.",
      "Exterior-facing finishes protected from marine exposure.",
      "Fine fixtures and detailing cleaned with appropriate care.",
    ],
    conciergeServices: [
      "Oversight for second-home and seasonal owners.",
      "Salt-air maintenance for oceanfront condos.",
      "Guest-ready resets timed to arrivals and departures.",
    ],
    nearbyAreas: [
      { name: "North Saanich", slug: "north-saanich" },
      { name: "Dean Park", slug: "dean-park" },
      { name: "Cordova Bay", slug: "cordova-bay" },
    ],
    geo: { lat: "48.6506", lng: "-123.3986" },
  },

  metchosin: {
    name: "Metchosin",
    slug: "metchosin",
    tier: 2,
    metaDescription:
      "Concierge cleaning for Metchosin's semi-rural acreage estates and Juan de Fuca oceanfront homes, with discreet privacy-first care.",
    heroTagline: "Privacy-first care for Metchosin's semi-rural acreage estates.",
    intro:
      "Metchosin is a semi-rural retreat of acreage estates and Juan de Fuca oceanfront homes, prized above all for its privacy and space. Its quiet, country character calls for an unobtrusive, dependable concierge presence rather than anything showy.",
    localContext: [
      "Spread across generous acreages with stretches of Juan de Fuca oceanfront, Metchosin trades density for openness. Homes sit well apart from one another, framed by farmland, forest, and shoreline, giving the community a rural calm that its residents deliberately protect. The result is one of the most private settings in the region — properties measured in acres rather than lots, where the nearest neighbour may be out of sight entirely.",
      "Privacy is the defining value here. Owners choose Metchosin precisely for its seclusion and its semi-rural character, and they expect a service that honours both — arriving discreetly, working efficiently, and leaving the country quiet undisturbed. A home this private deserves a care partner who treats discretion as the first feature of the service.",
      "Acreage and oceanfront living also shape the practical side of care. Larger properties, country surroundings, and coastal air on the Juan de Fuca side ask for dependable, watchful maintenance rather than a hurried pass. Our concierge programs are built for exactly this kind of rural-estate care: dependable, low-profile, and tailored to acreage living, whether a home is a full-time residence or a private oceanfront escape that sits quiet between visits.",
    ],
    whyLuxuryHere: [
      "Discreet, privacy-first care for secluded acreage estates.",
      "Dependable oversight for oceanfront and rural properties.",
      "Vetted teams comfortable with remote, private settings.",
      "Flexible cadence suited to full-time and part-time owners.",
    ],
    heritageMaterials: [
      "Natural-wood and stone finishes maintained with surface-safe methods.",
      "Oceanfront-facing glass kept clear against marine air.",
      "Rural-home surfaces cared for to preserve their character.",
      "Exterior finishes protected against coastal and country exposure.",
    ],
    conciergeServices: [
      "Recurring care for semi-rural acreage estates.",
      "Oversight for oceanfront and seasonal homes.",
      "Whole-property resets tailored to rural living.",
    ],
    nearbyAreas: [
      { name: "Bear Mountain", slug: "bear-mountain" },
      { name: "Downtown Victoria", slug: "downtown-victoria" },
      { name: "James Bay", slug: "james-bay" },
      { name: "Fairfield", slug: "fairfield" },
    ],
    geo: { lat: "48.3810", lng: "-123.5360" },
  },

  "james-bay": {
    name: "James Bay",
    slug: "james-bay",
    tier: 3,
    metaDescription:
      "Concierge cleaning for James Bay's heritage homes and lock-and-leave waterfront condos, in BC's oldest residential neighbourhood near Beacon Hill Park.",
    heroTagline: "Heritage and lock-and-leave care in BC's oldest residential neighbourhood.",
    intro:
      "James Bay is the oldest residential neighbourhood in British Columbia, a layered district of period heritage homes and lock-and-leave waterfront condos beside the Inner Harbour. From the 1850s to today, it has remained one of Victoria's most storied addresses — and one that rewards heritage-aware, concierge-grade care.",
    localContext: [
      "Settled from the 1850s on the former HBC Beckley Farm, James Bay holds more than 150 heritage buildings, including Helmcken House from about 1852 — the oldest surviving building in the province — and Woodlands from 1861. Victorian, Edwardian, Italianate, and Queen Anne homes give the streets a depth of period character that demands careful, finish-aware maintenance.",
      "The neighbourhood's waterfront is its other defining feature: Dallas Road, the Ogden Point breakwater, Fisherman's Wharf, Beacon Hill Park, and the Parliament Buildings all frame daily life. Luxury condos such as Shoal Point on Dallas Road, with its 24-hour concierge, and Harbourside draw owners who want refined, low-maintenance waterfront living.",
      "James Bay's mix of heritage houses and lock-and-leave condos shapes our work. We bring period-appropriate care to original finishes and dependable, secure oversight to pied-à-terre owners who travel — keeping both kinds of home immaculate and ready.",
    ],
    whyLuxuryHere: [
      "Period-appropriate care for Victorian, Edwardian, and Queen Anne finishes.",
      "Lock-and-leave oversight for waterfront condo and pied-à-terre owners.",
      "Discreet, vetted teams trusted with access to unoccupied residences.",
      "Heritage-aware methods for the province's oldest residential streets.",
    ],
    heritageMaterials: [
      "Victorian and Edwardian period finishes maintained with surface-safe care.",
      "Heritage millwork and plaster dusted to a fine standard.",
      "Original windows and detailing handled without abrasive contact.",
      "Condo glass and stone surfaces kept clear against harbour salt air.",
    ],
    conciergeServices: [
      "Lock-and-leave oversight for waterfront condos and pieds-à-terre.",
      "Heritage-home maintenance for period residences.",
      "Guest-ready resets timed to owners' arrivals.",
    ],
    nearbyAreas: [
      { name: "Downtown Victoria", slug: "downtown-victoria" },
      { name: "Fairfield", slug: "fairfield" },
      { name: "Rockland", slug: "rockland" },
      { name: "Oak Bay", slug: "oak-bay" },
    ],
    geo: { lat: "48.4150", lng: "-123.3720" },
  },

  "downtown-victoria": {
    name: "Downtown Victoria",
    slug: "downtown-victoria",
    tier: 3,
    metaDescription:
      "White-glove concierge cleaning for Downtown Victoria's heritage-conversion lofts and luxury towers near the Inner Harbour.",
    heroTagline: "White-glove, lock-and-leave care for Inner Harbour luxury residences.",
    intro:
      "Downtown Victoria blends restored heritage conversions with sleek luxury towers around the Inner Harbour. From the Customs House to The Pearl Residences, its refined urban homes suit lock-and-leave, pied-à-terre, and corporate owners who expect genuinely white-glove care.",
    localContext: [
      "The downtown core layers history and modernity: the Empire-style Customs House reborn as luxury condos, the Morley Soda Factory of 1875 restored in 2009, and contemporary towers like The Pearl Residences and The Falls. These homes carry marble baths, granite and quartz surfaces, and floor-to-ceiling glass that present beautifully when kept impeccably.",
      "The setting is the Inner Harbour and the David Foster Harbour Pathway — a walkable edge to the city, busy with cafes and galleries, that makes downtown living both convenient and elevated. Heritage-conversion finishes sit alongside modern luxury throughout the district.",
      "Many downtown residences are lock-and-leave: pied-à-terre and corporate homes occupied part of the year. Our concierge programs provide discreet, secure oversight and white-glove cleaning, keeping these urban residences pristine and ready whenever their owners return.",
    ],
    whyLuxuryHere: [
      "White-glove care for marble baths, quartz surfaces, and floor-to-ceiling glass.",
      "Lock-and-leave oversight for pied-à-terre and corporate owners.",
      "Discreet, vetted teams trusted with secure building access.",
      "Heritage-conversion-aware methods for restored period finishes.",
    ],
    heritageMaterials: [
      "Marble baths and stone surfaces cared for to preserve their finish.",
      "Granite and quartz counters maintained with surface-safe products.",
      "Floor-to-ceiling glass kept streak-free for harbour-view homes.",
      "Restored heritage-conversion finishes handled with conservation care.",
    ],
    conciergeServices: [
      "Lock-and-leave oversight for downtown pieds-à-terre.",
      "White-glove maintenance for heritage and tower residences.",
      "Guest-ready resets ahead of owners' returns.",
    ],
    nearbyAreas: [
      { name: "James Bay", slug: "james-bay" },
      { name: "Fairfield", slug: "fairfield" },
      { name: "Rockland", slug: "rockland" },
    ],
    geo: { lat: "48.4284", lng: "-123.3656" },
  },

  gonzales: {
    name: "Gonzales",
    slug: "gonzales",
    tier: 3,
    metaDescription:
      "Concierge cleaning for Gonzales' multi-million-dollar oceanfront homes in South Oak Bay, near the historic Gonzales Observatory.",
    heroTagline: "Discreet care for South Oak Bay's oceanfront hillside enclave.",
    intro:
      "Gonzales, in South Oak Bay, is an oceanfront hillside enclave of multi-million-dollar homes with panoramic views over the Juan de Fuca Strait. Tranquil, established, and quietly affluent, it asks for the discreet, heritage-aware care that defines our concierge approach.",
    localContext: [
      "Tucked into the hillside of South Oak Bay, Gonzales enjoys some of the most expansive ocean views in the city, looking south across the Juan de Fuca Strait. The historic Gonzales Observatory, a landmark of more than seventy-five years, presides over an enclave of protected beaches and secluded cul-de-sacs.",
      "The homes here are established heritage and character residences on large lots, set adjacent to Oak Bay's celebrated Maclure legacy. It is a tranquil, affluent pocket where privacy and a sense of permanence are part of the appeal, and where understated care suits the mood far better than anything ostentatious.",
      "Oceanfront exposure brings the familiar coastal challenge: salt air working on marble and heritage windows. Our concierge programs build protective, finish-aware maintenance into a tailored plan, keeping these oceanfront homes immaculate while respecting the quiet that residents prize.",
    ],
    whyLuxuryHere: [
      "Salt-air care for oceanfront marble and heritage windows.",
      "Discreet care suited to a tranquil, affluent enclave.",
      "Heritage-aware methods for established character homes.",
      "Vetted teams comfortable in high-value oceanfront residences.",
    ],
    heritageMaterials: [
      "Marble surfaces protected against salt-air degradation.",
      "Heritage windows maintained without abrasive contact.",
      "Character-home finishes cared for with period-appropriate methods.",
      "Oceanfront-facing exteriors protected from marine exposure.",
    ],
    conciergeServices: [
      "Recurring maintenance for oceanfront heritage homes.",
      "Salt-air care for marble and original windows.",
      "Discreet whole-home resets for an established enclave.",
    ],
    nearbyAreas: [
      { name: "Oak Bay", slug: "oak-bay" },
      { name: "Uplands", slug: "uplands" },
      { name: "Fairfield", slug: "fairfield" },
      { name: "Rockland", slug: "rockland" },
    ],
    geo: { lat: "48.4110", lng: "-123.3210" },
  },
  "bear-mountain": {
    name: "Bear Mountain",
    slug: "bear-mountain",
    tier: 2,
    metaDescription:
      "Bespoke concierge cleaning for Bear Mountain, Langford — golf-resort estates and modern luxury homes in the Westshore. Discreet, white-glove care.",
    heroTagline: "White-glove care for the Westshore's premier golf-resort community.",
    intro:
      "Bear Mountain is the Westshore's flagship luxury address — a master-planned mountainside resort community above Langford, built around 36 holes of Nicklaus Design golf and the Westin Bear Mountain resort. We bring discreet, white-glove care to its custom estates, golf-frontage residences, and lock-and-leave resort homes, where presentation and privacy matter in equal measure.",
    localContext: [
      "Set on the slopes of Skirt Mountain, Bear Mountain is unlike anywhere else in Greater Victoria: a purpose-built resort community where luxury homes share the hillside with two Nicklaus Design golf courses — the Mountain and the Valley — a tennis and pickleball centre, the Westin resort and spa, and an arena. The result is a polished, amenity-rich enclave that draws executives, athletes, and second-home owners who expect the same resort-grade standards inside their homes.",
      "Architecture here is modern rather than heritage — West Coast contemporary estates, golf-course-frontage residences, and luxury condominiums and townhomes, many with large-format glazing framing sweeping city, ocean, and mountain views. Those expansive glass walls and the manicured presentation of golf-frontage homes set a high bar for upkeep, where streak-free glass and immaculate finishes are part of the lifestyle, not an afterthought.",
      "A significant share of Bear Mountain residences are second homes and lock-and-leave properties for owners who travel between Victoria, Vancouver, and beyond. That rhythm calls for trusted, vetted care: return-to-pristine resets before arrivals, discreet oversight during absences, and event-ready turnovers for entertaining on the mountain.",
    ],
    whyLuxuryHere: [
      "Resort-grade, white-glove standards for custom estates and golf-frontage homes.",
      "Streak-free care for the large-format glazing that frames city, ocean, and mountain views.",
      "Lock-and-leave oversight and return-to-pristine resets for second-home and travelling owners.",
      "Event-ready turnovers for entertaining on the mountain.",
      "Discreet, fully vetted teams comfortable in a high-amenity resort community.",
    ],
    heritageMaterials: [
      "Large-format glazing and view walls kept immaculate and streak-free.",
      "Engineered stone, quartz, and hardwood finishes cared for with material-specific methods.",
      "Modern stone, stucco, and cedar exteriors maintained against mountain weather.",
      "Smart-home and integrated systems respected and worked around with care.",
    ],
    conciergeServices: [
      "Return-to-pristine resets for second-home and lock-and-leave owners.",
      "Recurring white-glove maintenance for estates and golf-frontage residences.",
      "Event-ready turnovers and discreet absentee oversight.",
    ],
    nearbyAreas: [
      { name: "Metchosin", slug: "metchosin" },
      { name: "Prospect Lake", slug: "prospect-lake" },
      { name: "Willis Point", slug: "willis-point" },
      { name: "Downtown Victoria", slug: "downtown-victoria" },
    ],
    geo: { lat: "48.4640", lng: "-123.5260" },
  },
};
