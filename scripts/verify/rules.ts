/**
 * Rule data for the verify harness: patterns, required strings and file lists only.
 * The rule logic lives in source-checks.ts, dist-checks.ts, browser-rules.ts and live-rules.ts.
 */

export const SITE = "https://wabisabiservices.ca";

/** Commit the site copy is compared against when looking for new copy. */
export const COPY_BASE_COMMIT = "8de6ac9";

export const SCAN = {
  include: ["src", "public", "scripts/prerender.ts", "index.html"],
  exclude: ["src/components/ui/"],
  extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".txt", ".xml", ".json", ".md"],
};

// ---------------------------------------------------------------------------
// S-BAN
// ---------------------------------------------------------------------------

export interface BanAllow {
  /** The match is allowed only inside this phrase. */
  phrase?: string;
  /** Limits the allowance to one file. */
  file?: string;
  /** Only the first occurrence of the phrase in the file is allowed. */
  once?: boolean;
  /** The match must be followed directly by this text. */
  followedBy?: string;
  /** The sentence around the match must contain this text (case-sensitive). */
  sentenceContains?: string;
  /** Limits the allowance to this ban pattern. */
  pattern?: string;
}

export interface Ban {
  id: string;
  row: string;
  /** Regex sources, matched case-insensitively. */
  patterns: string[];
  /** Regex sources, matched case-sensitively. */
  caseSensitive?: string[];
  /** Limits the ban to these paths. */
  scope?: string[];
  allow?: BanAllow[];
  /** Patterns are loaded from the file named by SEO_PRIVATE_BANS. */
  private?: boolean;
}

export const BANS: Ban[] = [
  {
    id: "BAN-01",
    row: "T-12",
    patterns: ["biohazard"],
    allow: [
      {
        file: "src/data/faqItems.ts",
        phrase: "We don't handle biohazards or mould remediation; mildew in window tracks is included.",
        once: true,
      },
      { file: "src/pages/TermsOfService.tsx", phrase: "clean biohazards", once: true },
    ],
  },
  { id: "BAN-02", row: "T-12", patterns: ["medical-grade", "medical & wellness"] },
  { id: "BAN-03", row: "T-16", patterns: ["digital organization"] },
  { id: "BAN-04", row: "T-20", patterns: ["24/7"] },
  {
    id: "BAN-05",
    row: "T-09",
    patterns: ["eco-certified", "certified pet-safe", "harsh chemical"],
    caseSensitive: ["\\bVOCs?\\b"],
  },
  { id: "BAN-06", row: "T-09", patterns: ["non-toxic"], allow: [{ sentenceContains: "Eco-Luxury" }] },
  {
    id: "BAN-07",
    row: "T-05",
    patterns: ["insured and bonded"],
    allow: [{ followedBy: ": our policy includes" }, { phrase: "Are you insured and bonded?" }],
  },
  { id: "BAN-08", row: "T-04, T-05", patterns: [], private: true },
  { id: "BAN-09", row: "T-06", patterns: ["professionally trained"] },
  { id: "BAN-10", row: "T-07", patterns: ["you'll work with the same professional", "paired with the same"] },
  { id: "BAN-11", row: "T-08", patterns: ["NDA-Grade"] },
  { id: "BAN-12", row: "T-13", patterns: ["2 ladder steps", "no ladders"] },
  { id: "BAN-13", row: "T-14", patterns: ["interior and exterior", "interior/exterior", "ground level"] },
  { id: "BAN-14", row: "T-17", patterns: ["2-hour window"] },
  { id: "BAN-15", row: "T-18", patterns: ["after-hours"] },
  { id: "BAN-16", row: "T-19", patterns: ["accurate estimates during booking"] },
  { id: "BAN-17", row: "T-22", patterns: ["due upon"] },
  { id: "BAN-18", row: "T-23", patterns: ["any aspect of our service", "any aspect"] },
  { id: "BAN-19", row: "T-24", patterns: ["travel fees may apply"] },
  { id: "BAN-20", row: "T-30", patterns: ["join 2026", "2026 waitlist"] },
  { id: "BAN-21", row: "T-31", patterns: ["magazine-perfect", "perfection isn't sustainable", "hidden key", "studio/1BR"] },
  {
    id: "BAN-22",
    row: "T-31",
    patterns: ["vinegar", "baking soda", "castile", "borax", "\\bDIY\\b", "recipe"],
    scope: ["src/pages/blog/", "scripts/prerender.ts"],
  },
  {
    id: "BAN-23",
    row: "FR-8",
    patterns: [
      "ZenMaid",
      "GoHighLevel",
      "Zapier",
      "\\bMeta\\b",
      "Facebook",
      "Instagram",
      "Google Ads",
      "gclid",
      "enhanced conversions",
      "Pearly",
      "CASL",
      "Anti-Spam",
      "advertising",
      "adssettings",
      "booking calendar",
      "unsubscribe",
      "marketing email",
      "\\bguides?\\b",
      "sign-up",
      "Maps",
      "Business Profile",
      "consent to marketing",
      "\\bor an ad\\b",
    ],
    scope: ["src/pages/Privacy.tsx"],
    allow: [
      { pattern: "advertising", sentenceContains: "Microsoft" },
      // FR-8 reuses the Clarity paragraph, which says "heatmaps". "Maps" stays a plain substring so
      // identifiers such as GOOGLE_MAPS_URL still fail, which a \b pattern would miss.
      { pattern: "Maps", phrase: "heatmaps", once: true },
    ],
  },
  // DJ-15: seasonal decor is ground installation only, with no roof or eave work.
  {
    id: "BAN-24",
    row: "DJ-15",
    patterns: ["rooflines?", "the heights", "the wiring", "mature trees"],
    scope: ["src/pages/seasonal/"],
  },
];

// ---------------------------------------------------------------------------
// Shared site strings
// ---------------------------------------------------------------------------

export const FOUNDER_NAME = "Jalene Plamondon";
export const FOUNDED = "Founded in 2025";
export const SISTER_SENTENCE =
  "Wabi Sabi Services and Pearly's Cleaning Co. are sister companies under VCS Inc., both founded by Jalene Plamondon.";
export const INSURANCE_LINE = "Fully insured: $2 million commercial general liability coverage per occurrence.";
export const BONDING_LINE =
  "Insured and bonded: our policy includes a third-party employee dishonesty bond that protects client property.";
export const STAFF_LINE = "Every team member is background-checked and vetted. WorkSafeBC registered.";
export const SAME_PROFESSIONAL = "We aim to send the same professional every visit.";
export const NDA_LINE = "We're happy to sign a non-disclosure agreement on request.";
export const NDA_HEADING = "Discretion, in writing if you prefer";
export const NO_BIOHAZARD = "We don't handle biohazards or mould remediation; mildew in window tracks is included.";
export const LADDER_LINE =
  "Work above floor level is limited to a 3-step ladder, arranged in advance during your walkthrough estimate.";
export const EXTERIOR_WINDOWS = "Exterior window cleaning arranged through trusted partners";
export const HOURS_LINE = "Monday to Friday, 8 am–6 pm. Weekends on request.";
export const CONSULTATION = "$150 in-home consultation, credited in full toward your first service";
export const FREE_ESTIMATES = "Free estimates by phone or email.";
export const CONSULTATION_WINDOW = 250;
export const ONLINE_REQUEST = "Request a visit online any time";
export const CARD_ON_FILE = "A credit card is kept on file for every booking.";
export const GUARANTEE_LINE = "Tell us within 24 hours and we'll return within 48 hours to make it right, at no charge.";
export const GUARANTEE_LIMIT = "This guarantee applies only to areas cleaned during the original service.";
export const AREA_LINE = "Greater Victoria (Capital Regional District), from Sidney to Metchosin.";
export const AREA_OUTSIDE = "Homes outside this area, including the Gulf Islands, are considered case by case at the estimate.";
export const WAITLIST_2027 = "Join 2027 waitlist";
export const INSTALL_WINDOW = "Install window: November 20 - December 5";
export const WINTER_AVAILABLE = "Available: November through December";
export const WINTER_INTRO = "The Cozy Cabin, The Winter Wonderland, and The Festive Estate install from November 20 - December 5.";

/** Strings that may match the sibling repo word for word (S-OVERLAP). */
export const VERBATIM_STRINGS: string[] = [
  FOUNDED,
  INSURANCE_LINE,
  BONDING_LINE,
  STAFF_LINE,
  SAME_PROFESSIONAL,
  NDA_LINE,
  NDA_HEADING,
  "low-toxicity products",
  "essential-oil aromatherapy spray",
  NO_BIOHAZARD,
  "Wellness Spaces",
  LADDER_LINE,
  "Interior windows",
  EXTERIOR_WINDOWS,
  HOURS_LINE,
  CONSULTATION,
  FREE_ESTIMATES,
  ONLINE_REQUEST,
  CARD_ON_FILE,
  GUARANTEE_LINE,
  AREA_LINE,
  AREA_OUTSIDE,
  WAITLIST_2027,
];

// ---------------------------------------------------------------------------
// S-REQ
// ---------------------------------------------------------------------------

export interface Required {
  row: string;
  text: string;
  files: string[];
}

export interface RequiredOrder {
  row: string;
  texts: string[];
  files: string[];
}

const HOME = "src/pages/Home.tsx";
const ABOUT = "src/pages/About.tsx";
const SERVICES = "src/pages/Services.tsx";
const RITUAL = "src/pages/Ritual.tsx";
const KEY_TAKEAWAYS = "src/pages/KeyTakeaways.tsx";
const TERMS = "src/pages/TermsOfService.tsx";
const AGREEMENT = "src/pages/ClientAgreement.tsx";
const CONTACT = "src/pages/Contact.tsx";
const PRIVACY = "src/pages/Privacy.tsx";
const CLEANING = "src/pages/services/Cleaning.tsx";
const ERRANDS = "src/pages/services/Errands.tsx";
const FAQ_DATA = "src/data/faqItems.ts";
const FAQ_PAGE = "src/pages/FAQ.tsx";
const LLMS = "public/llms.txt";

const seasonal = (name: string) => `src/pages/seasonal/${name}.tsx`;

const WAITLIST_PAGES = [
  "QuietGrace",
  "AbundantHarmony",
  "GatheredAbundance",
  "EstateCollection",
  "MindfulMerchant",
  "FreshStart",
  "GardenGate",
  "BotanicalEstate",
  "BloomingManor",
  "ProfessionalWelcome",
  "CoastalCottage",
  "IslandRetreat",
  "BeachsideManor",
  "SeasideEstate",
  "SummerStorefront",
].map(seasonal);

const WINTER_DATED_PAGES = ["CozyCabin", "WinterWonderland", "FestiveEstate"].map(seasonal);
const WINTER_UNDATED_PAGES = ["GrandCelebration", "BusinessWelcome"].map(seasonal);

export const REQUIRED: Required[] = [
  { row: "T-01", text: FOUNDER_NAME, files: [ABOUT, LLMS] },
  { row: "T-02", text: FOUNDED, files: [ABOUT] },
  { row: "T-03", text: SISTER_SENTENCE, files: [ABOUT, LLMS] },
  { row: "T-04", text: INSURANCE_LINE, files: [HOME, ABOUT, SERVICES, FAQ_DATA, TERMS, AGREEMENT, LLMS] },
  { row: "T-05", text: BONDING_LINE, files: [HOME, FAQ_DATA, KEY_TAKEAWAYS, LLMS] },
  { row: "T-06", text: STAFF_LINE, files: [HOME, ABOUT, SERVICES, FAQ_DATA, KEY_TAKEAWAYS, LLMS] },
  { row: "T-07", text: SAME_PROFESSIONAL, files: [SERVICES, RITUAL] },
  { row: "T-08", text: NDA_LINE, files: [SERVICES] },
  { row: "T-08", text: NDA_HEADING, files: [SERVICES] },
  { row: "T-10", text: "Eco-Luxury Package", files: [CLEANING, FAQ_DATA] },
  { row: "T-12", text: NO_BIOHAZARD, files: [FAQ_DATA] },
  { row: "T-12", text: "Wellness Spaces", files: [CLEANING] },
  { row: "T-13", text: LADDER_LINE, files: [TERMS, AGREEMENT] },
  { row: "T-14", text: "Interior windows", files: [CLEANING] },
  { row: "T-14", text: EXTERIOR_WINDOWS, files: [ERRANDS] },
  { row: "T-17", text: "60-minute arrival window", files: [TERMS, AGREEMENT, FAQ_DATA] },
  { row: "T-18", text: HOURS_LINE, files: [CONTACT, FAQ_DATA, AGREEMENT, LLMS] },
  { row: "T-19", text: CONSULTATION, files: [FAQ_DATA] },
  { row: "T-19", text: FREE_ESTIMATES, files: [FAQ_DATA] },
  { row: "T-20", text: ONLINE_REQUEST, files: [FAQ_DATA, LLMS] },
  { row: "T-22", text: CARD_ON_FILE, files: [TERMS, AGREEMENT] },
  { row: "T-23", text: GUARANTEE_LINE, files: [TERMS, FAQ_DATA] },
  { row: "T-23", text: GUARANTEE_LIMIT, files: [TERMS, FAQ_DATA] },
  { row: "T-24", text: AREA_LINE, files: [CONTACT, FAQ_DATA, LLMS] },
  { row: "T-24", text: AREA_OUTSIDE, files: [FAQ_DATA, LLMS] },
  { row: "T-30", text: WAITLIST_2027, files: WAITLIST_PAGES },
  { row: "T-30", text: "2027 waitlist", files: [seasonal("FallPumpkins")] },
  { row: "T-30", text: "Request a Private Consultation", files: [...WINTER_DATED_PAGES, ...WINTER_UNDATED_PAGES] },
  { row: "T-30", text: INSTALL_WINDOW, files: WINTER_DATED_PAGES },
  { row: "T-30", text: WINTER_AVAILABLE, files: WINTER_UNDATED_PAGES },
  { row: "T-30", text: WINTER_INTRO, files: [seasonal("WinterHoliday")] },
  { row: "FR-8", text: "Privacy Policy", files: [TERMS, AGREEMENT] },
  { row: "FR-8", text: "Microsoft Clarity", files: [PRIVACY] },
  { row: "FR-8", text: "Stripe", files: [PRIVACY] },
  { row: "FR-8", text: "Lovable Cloud", files: [PRIVACY] },
  { row: "FR-8", text: FOUNDER_NAME, files: [PRIVACY] },
  { row: "FR-8", text: "hello@wabisabiservices.ca", files: [PRIVACY] },
];

export const REQUIRED_ORDER: RequiredOrder[] = [
  {
    row: "T-21",
    texts: [
      "1. Consultation",
      "2. Consistency",
      "3. Thoughtful Care",
      "4. Communication",
      "5. Discretion",
      "6. Seasonal Transitions",
    ],
    files: [RITUAL],
  },
  {
    row: "T-29",
    texts: [
      "3 Museum-Grade Grand Prize Pumpkins",
      "10 Large Heritage Pumpkins",
      "16 Antique White Pumpkins",
      "20+ Rare Specimen Pumpkins",
      "24 Miniature Pumpkins",
      "3 Premium hay bales",
      "Dedicated project manager",
      "Professional photo & video",
    ],
    files: [seasonal("EstateCollection")],
  },
];

// ---------------------------------------------------------------------------
// S-ABSENT
// ---------------------------------------------------------------------------

export interface Absent {
  row: string;
  texts: string[];
  /** Limits the check to these paths. Without it, the whole scan scope. */
  files?: string[];
}

const blog = (name: string) => `src/pages/blog/${name}.tsx`;

export const ABSENT: Absent[] = [
  { row: "T-27", texts: ["M.D., Bear Mountain", "A.L., Oak Bay", "J.R., Bear Mountain"] },
  {
    row: "T-31",
    files: [blog("March2026")],
    texts: [
      "The Wabi Sabi Sustainable Cleaning Toolkit",
      "Essential Eco-Friendly Ingredients",
      "Degreasing naturally",
      "Oven cleaning",
      "Dishwasher deep clean",
      "Bathroom Brilliance",
      "Mirror magic",
      "Natural mold prevention",
      "Toilet treatment",
      "Carpet refresher",
      "Window washing",
      "Wood furniture polish",
      "Natural Spring Cleaning Recipes",
      "Cherry Blossom All-Purpose Spray",
      "Spring Garden Furniture Polish",
    ],
  },
  {
    row: "T-31",
    files: [blog("October2025")],
    texts: [
      "warm water, white vinegar, and lavender essential oil",
      "rosemary-infused vinegar",
      "baking soda paste overnight",
      "Descale kettles and coffee makers",
      "Sprinkle with baking soda and lavender",
    ],
  },
  {
    row: "T-31",
    files: [blog("April2026")],
    texts: ["DIY Cleaning Product Station", "Essential oils for customization"],
  },
  {
    row: "T-31",
    files: [blog("June2026")],
    texts: [
      "Vinegar-based solutions",
      "Baking soda for odor absorption",
      "Castile soap for general cleaning",
      "Baking soda on carpets",
    ],
  },
  {
    row: "T-31",
    files: [blog("August2025")],
    texts: ["Wash beach towels with vinegar", "Clean coolers with baking soda"],
  },
  { row: "T-31", files: [blog("November2025")], texts: ["Deep clean with baking soda paste"] },
  {
    row: "5A",
    texts: [
      "Salt-spray remediation",
      "Salt-spray maintenance",
      "salt-air remediation",
      "salt-air maintenance",
      "Salt-air care",
      "Salt-air protection",
      "salt-air degradation",
      "salt-air-exposed",
      "marine weathering",
      "marine exposure",
      "coastal and country exposure",
      "mountain weather",
      "Cedar-shake exteriors",
      "moorage-adjacent",
      "dock-side",
      "Half-timbered exteriors",
      "half-timbering",
      "weathered by salt air",
      "indoor and outdoor spaces",
      "forest debris",
      "algae",
      "asonry-aware",
      "Victorian chimney",
      "boats, docks",
    ],
  },
];

// ---------------------------------------------------------------------------
// Other source rules
// ---------------------------------------------------------------------------

export const FAQ_FILES = { data: FAQ_DATA, page: FAQ_PAGE };

/** The one route with FAQ answers: FAQ.tsx alone uses the accordion. */
export const FAQ_ROUTE = "/faq";

export const FAQ_SECTIONS = [
  { heading: "Getting Started with Our Services", count: 3, first: "What makes Wabi Sabi Services different?" },
  { heading: "Understanding Our Service Levels", count: 3, first: "What's included in your Mindful Standard Clean?" },
  { heading: "Pricing & Scheduling", count: 5, first: "How is pricing determined?" },
  { heading: "Products & Safety", count: 5, first: "What cleaning products do you use?" },
  { heading: "Service Logistics", count: 4, first: "How long will the cleaning take?" },
  { heading: "Quality & Satisfaction", count: 2, first: "What is your satisfaction guarantee?" },
  { heading: "Serving Victoria's Neighbourhoods", count: 8, first: "Do you offer luxury cleaning in Oak Bay and Uplands?" },
];

export const FAQ_PLACEMENT = [
  { after: "What is your cancellation policy?", next: ["What are your hours?", "What is your arrival window?"] },
  { after: "What cleaning products do you use?", next: ["What is the Eco-Luxury Package?", "Is there anything you don't clean?"] },
];

export const NAP = {
  phones: ["(250) 896-5971", "250-896-5971", "+1-250-896-5971", "tel:+12508965971"],
  email: "hello@wabisabiservices.ca",
  phoneCandidate: "(?:tel:)?(?:\\+?1[-.\\s]?)?\\(?\\b\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b",
  emailCandidate: "[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+",
  retired: "(?:\\+?1[-.\\s]?)?\\(?778\\)?[-.\\s]?404[-.\\s]?7357",
};

export const PEARLY_FILES = [ABOUT, LLMS, "src/data/organization.ts"];
export const PEARLY_IDS = ["https://www.pearlys.ca/#jalene", "https://www.pearlys.ca/#business"];

export const GA_EVENTS = [
  { file: CONTACT, event: "contact_submit" },
  { file: "src/pages/Book.tsx", event: "consultation_booking" },
];

export const AREA_COPY_FILES = ["src/data/neighborhoods.ts", FAQ_DATA];
export const EXTGLASS = { surface: "glass|glazing|window", exposure: "salt|marine|spray", partner: "trusted partners" };
export const ROOF = {
  pattern: "\\broof|chimney",
  allowed: ["metal roofing, and Ipe decking", "and metal roofing are characteristic"],
};

export const MASK_FILES = [CONTACT, "src/pages/Book.tsx", "src/pages/Careers.tsx", "src/pages/Checkout.tsx"];
export const MASK_ATTRIBUTE = 'data-clarity-mask="true"';

export const PRICE_FILES = { catalogue: "api/create-checkout.ts", seasonalDir: "src/pages/seasonal/" };

export const OVERLAP = {
  words: 8,
  exemptFiles: [PRIVACY],
  siblingDirs: ["src", "public"],
  siblingFiles: ["index.html"],
  siblingSkip: ["__tests__", "node_modules"],
  nonCopyAttributes: ["className", "to", "href", "src", "id", "key", "type", "name", "rel", "target", "htmlFor", "style", "canonical"],
};

// ---------------------------------------------------------------------------
// Dist rules
// ---------------------------------------------------------------------------

export const INDEXABLE_ROUTES: string[] = [
  "/",
  "/about",
  "/areas",
  "/areas/bear-mountain",
  "/areas/broadmead",
  "/areas/cadboro-bay",
  "/areas/cordova-bay",
  "/areas/dean-park",
  "/areas/downtown-victoria",
  "/areas/fairfield",
  "/areas/gonzales",
  "/areas/gordon-head",
  "/areas/james-bay",
  "/areas/metchosin",
  "/areas/north-saanich",
  "/areas/oak-bay",
  "/areas/prospect-lake",
  "/areas/rockland",
  "/areas/sidney",
  "/areas/ten-mile-point",
  "/areas/uplands",
  "/areas/willis-point",
  "/blog",
  "/blog/april-2026",
  "/blog/august-2025",
  "/blog/december-2025",
  "/blog/february-2026",
  "/blog/january-2026",
  "/blog/july-2026",
  "/blog/june-2026",
  "/blog/march-2026",
  "/blog/may-2026",
  "/blog/november-2025",
  "/blog/october-2025",
  "/blog/september-2025",
  "/book",
  "/careers",
  "/client-agreement",
  "/contact",
  "/faq",
  "/key-takeaways",
  "/privacy",
  "/reviews",
  "/ritual",
  "/seasoning",
  "/seasoning/abundant-harmony",
  "/seasoning/estate-collection",
  "/seasoning/fall-pumpkins",
  "/seasoning/gathered-abundance",
  "/seasoning/mindful-merchant",
  "/seasoning/quiet-grace",
  "/seasoning/spring-refresh",
  "/seasoning/summer-serenity",
  "/seasoning/the-beachside-manor",
  "/seasoning/the-blooming-manor",
  "/seasoning/the-botanical-estate",
  "/seasoning/the-business-welcome",
  "/seasoning/the-coastal-cottage",
  "/seasoning/the-cozy-cabin",
  "/seasoning/the-festive-estate",
  "/seasoning/the-fresh-start",
  "/seasoning/the-garden-gate",
  "/seasoning/the-grand-celebration",
  "/seasoning/the-island-retreat",
  "/seasoning/the-professional-welcome",
  "/seasoning/the-seaside-estate",
  "/seasoning/the-summer-storefront",
  "/seasoning/the-winter-wonderland",
  "/seasoning/winter-holiday",
  "/services",
  "/services/cleaning",
  "/services/errands",
  "/services/organizing",
  "/terms-of-service",
];

export const UTILITY_ROUTES = ["/cart", "/checkout", "/checkout-success"];

export const RANK_ROUTES = [
  "/",
  "/services",
  "/services/cleaning",
  "/services/errands",
  "/areas/oak-bay",
  "/areas/uplands",
  "/seasoning",
  "/seasoning/winter-holiday",
];

/** Pages with no built HTML until R2, so they carry no parity check. */
export const PARITY_EXEMPT = ["Cart", "Checkout", "CheckoutSuccess", "NotFound"];

/** Every head tag SEO.tsx emits that also exists in the static head. */
export const HELMET_META_KEYS = [
  "title",
  "description",
  "keywords",
  "robots",
  "og:type",
  "og:url",
  "og:title",
  "og:description",
  "og:image",
  "og:locale",
  "article:published_time",
  "twitter:card",
  "twitter:url",
  "twitter:title",
  "twitter:description",
  "twitter:image",
];

export const ORG = {
  id: `${SITE}/#organization`,
  types: ["Organization", "LocalBusiness"],
  exact: {
    legalName: "Wabi Sabi Services Inc.",
    foundingDate: "2025",
    openingHours: "Mo-Fr 08:00-18:00",
    parentOrganization: { "@id": `${SITE}/#vcs-inc` },
    founder: { "@type": "Person", "@id": PEARLY_IDS[0], name: FOUNDER_NAME, jobTitle: "Founder" },
  },
  keptKeys: [
    "name",
    "url",
    "logo",
    "image",
    "description",
    "email",
    "telephone",
    "priceRange",
    "address",
    "geo",
    "openingHoursSpecification",
    "contactPoint",
  ],
  firstArea: "Greater Victoria (Capital Regional District), from Sidney to Metchosin",
  areaCount: 20,
  instagram: "https://www.instagram.com/wabisabiservices/",
  mapsPrefix: "https://www.google.com/maps/",
};

export const PARENT = {
  id: `${SITE}/#vcs-inc`,
  name: "VCS Inc.",
  legalName: "VCS Vice Consulting and Streaming Inc.",
  subOrganization: [ORG.id, PEARLY_IDS[1]],
};

/** The site's Clarity project ID. D-CLARITY fails if a build with no ID contains it. */
export const CLARITY_PROJECT_ID = "z6fydc3bvk";

/**
 * R2-FR-01: the share of a route's rendered words that its raw HTML must carry, and of its raw
 * words, apart from closed FAQ answers, that the rendered page must show.
 */
export const RAW_MIN_WORD_SHARE = 0.95;

export const FALLBACK = {
  busy: 'aria-busy="true"',
  /** React's markers for a Suspense boundary that did not finish rendering on the server. */
  suspenseMarkers: ["<!--$?-->", "<!--$!-->"],
};

export const MISSING_PAGE = { file: "404.html", brand: "Wabi Sabi Services" };

/**
 * The one route list (R2-FR-11). Until it exists, D-MANIFEST fails. The harness loads routeFile as
 * a module, so it may build its paths from neighborhoods.ts. It must stay free of page imports.
 * routeExport is a list of `{ path, page }`, where page is the file under src/pages with no
 * extension, such as "services/Cleaning". Area routes share a template, so they leave page out.
 * A router built from this list has no `<Route path="...">` lines, so page is how D-COPY and
 * D-PARITY find a route's source, and D-MANIFEST fails an entry without one.
 */
export const MANIFEST = {
  routeFile: "src/data/routes.ts",
  routeExport: "ROUTES",
  /** How the router shows it reads that file. */
  routeImport: "from\\s+[\"'][^\"']*data/routes[\"']",
  appFile: "src/App.tsx",
  areaExport: "neighborhoods",
  /** The router's one generated path before that file exists. It means one route per neighbourhood. */
  areaTemplate: "`/areas/${n.slug}`",
};

export const RENDER_BASELINE_FILE = "scripts/verify/render-baseline.json";

/** Where the copy rules find a built page's text, for rules that name a source file. */
export const COPY_PAGES = {
  /** A page whose copy lives in another file. */
  aliases: { [FAQ_PAGE]: FAQ_DATA } as Record<string, string>,
  areaPrefix: "/areas/",
  areaFile: "src/data/neighborhoods.ts",
  /** The copy every area page shares. */
  areaTemplate: "src/components/NeighborhoodPage.tsx",
};

// ---------------------------------------------------------------------------
// Browser rules
// ---------------------------------------------------------------------------

/**
 * BR-LCP: how far a deployment's largest lab layout shift may pass production's in the same
 * sitting. Unchanged R1 reads 0.0011 to 0.0290 by route, so 0 cannot be the line. This covers
 * measurement noise only.
 */
export const CLS_TOLERANCE = 0.001;

/** Stripe's success URL (api/create-checkout.ts). The page renders the session ID from it. */
export const STRIPE_RETURN = "/checkout-success?session_id=cs_test_verify";

export interface CartStepPlan {
  name: string;
  route: string;
  reload: boolean;
  /** The URL to load, when it differs from the route. */
  url?: string;
  /** The stored cart must be empty after this step. */
  cleared?: boolean;
}

export const BROWSER = {
  blockedHosts: ["googletagmanager.com", "google-analytics.com", "clarity.ms"],
  fontHosts: ["fonts.googleapis.com", "fonts.gstatic.com"],
  bypassHeader: "x-vercel-protection-bypass",
  minAreaLinks: 19,
  seededCart: [
    {
      id: "quiet-grace",
      name: "The Quiet Grace",
      price: 399,
      description: "Verify harness cart item",
      image: "/og-image.png",
    },
  ],
  /** A same-origin page with no app code, so the cart can be stored before the app first loads. */
  seedPage: "/robots.txt",
  /**
   * BR-CART, in order. Each step is a full page load. /cart is also Stripe's cancel URL, and the
   * last two steps are its success URL, where a paid cart must empty and stay empty.
   * It passes on Release 1, which reads the cart before its first render. It guards the move to a
   * cart that starts empty and loads after hydration: the save effect can then overwrite the stored
   * cart, and a late load can restore an item already paid for.
   */
  cartSteps: [
    { name: "first load", route: "/cart", reload: false },
    { name: "reload", route: "/cart", reload: true },
    { name: "another page", route: "/seasoning", reload: false },
    { name: "return to the cart", route: "/cart", reload: false },
    { name: "full load of checkout", route: "/checkout", reload: false },
    { name: "order complete", route: "/checkout-success", url: STRIPE_RETURN, reload: false, cleared: true },
    { name: "reload after the order", route: "/checkout-success", reload: true, cleared: true },
  ] as CartStepPlan[],
  /**
   * Empty writes one load of the order page may make. Clearing the cart takes one, but a clearCart
   * that is not stable writes for as long as the page is open (B-10). Production React logs nothing
   * for that loop, and the cart stays empty, so only the count shows it.
   */
  maxEmptyWrites: 5,
  /**
   * BR-HYDRATE. Production React reports text and structure mismatches by number and attribute
   * mismatches not at all, so a shifted useId passes on dist/ with a clean console. The wording
   * here comes from development React, which only a --dev-react pass can print.
   */
  hydrationErrors: [
    "hydrat",
    "did not match",
    "server.rendered HTML",
    "server HTML",
    "Extra attributes from the server",
    "Text content does not match",
    "Minified React error #(?:418|419|421|422|423|425)\\b",
  ],
  /**
   * BR-HYDRATE also loads these on a later date, because HTML built one year can be served the
   * next. The footer's year (Layout.tsx) is on every page and the journal filters posts by today.
   */
  clockRoutes: ["/", "/blog"],
  /** URLs BR-HYDRATE loads beyond the route list, because they render differently from the bare route. */
  hydrationUrls: [STRIPE_RETURN],
  /**
   * BR-INTERACT: the R2-FR-03 behaviours no other rule exercises. Today's site is the reference.
   * They come from shared components, so each runs once. The field is only typed into, and nothing
   * here submits a form. scroll starts on a page that is already loaded, because a route's first
   * load shows the short fallback, which alone would put the page back at the top.
   */
  interact: {
    accordion: { route: "/faq", trigger: 'main button[aria-controls][aria-expanded="false"]' },
    menu: {
      route: "/ritual",
      viewport: { width: 390, height: 844 },
      button: 'header button[aria-label="Open menu"]',
      links: '[role="dialog"] a[href]',
      expected: "/faq",
    },
    dropdown: { route: "/ritual", button: 'header button[aria-haspopup="menu"]', links: '[role="menu"] a[href]', expected: "/services/cleaning" },
    field: { route: "/contact", selector: "#name", text: "Verify Harness" },
    scroll: { start: "/faq", through: "/ritual" },
  },
  /** --dev-react. The marker is a string that only development React contains. */
  devReact: {
    marker: "Extra attributes from the server",
  },
  /**
   * R2-FR-12. The same lab run on R1 and on a deployment, so the two compare like with like. A
   * preview has no visitors, so a field figure cannot stand in for this. Network and CPU are
   * slow 4G and 4x CPU, with the factors Lighthouse applies for DevTools throttling.
   */
  lcp: {
    routes: ["/", "/areas/oak-bay", "/services/cleaning", "/blog/july-2026"],
    runs: 5,
    /** The day R1 went live. An earlier figure does not describe R1. */
    liveFrom: "2026-10-31",
    /**
     * How far a deployment's fastest run may pass R1's. Lab noise only adds time, so the fastest
     * run is the steady figure: over two sittings of unchanged R1, the median on / went from 4200
     * to 5092 ms, while no route's fastest run moved more than 2.1%.
     */
    tolerance: 0.05,
    settings: {
      viewport: { width: 412, height: 823 },
      deviceScaleFactor: 1.75,
      latencyMs: 562.5,
      downloadBytesPerSecond: 180_000,
      uploadBytesPerSecond: 84_375,
      cpuSlowdown: 4,
    },
  },
};

// ---------------------------------------------------------------------------
// Live rules
// ---------------------------------------------------------------------------

export const LIVE = {
  apex: SITE,
  hostStarts: ["http://wabisabiservices.ca", "https://www.wabisabiservices.ca", "https://wabisabiservices.ca"],
  files: ["/robots.txt", "/llms.txt", "/sitemap.xml"],
  missingPath: "/does-not-exist",
  rawRoutes: ["/areas/oak-bay", "/services/cleaning", "/faq", "/seasoning/winter-holiday"],
  rawMinWords: 150,
  /**
   * One permanent redirect each, except a slash form of a redirected path. Vercel applies
   * trailingSlash before redirects, so with "trailingSlash": false that path goes /home/ to /home
   * to /, and both hops are permanent. R2-FR-10 asks only that the slash form redirects.
   */
  redirects: [
    { from: "/the-ritual", to: "/ritual" },
    { from: "/index.html", to: "/" },
    { from: "/home", to: "/" },
    { from: "/home/", to: "/", maxHops: 2 },
    { from: "/the-ritual/", to: "/ritual", maxHops: 2 },
    { from: "/services/errands/", to: "/services/errands" },
  ] as Array<{ from: string; to: string; maxHops?: number }>,
  utilityRoutes: ["/cart", "/checkout", STRIPE_RETURN],
  releaseOne: ["LV-HOST", "LV-FILES"],
  all: ["LV-HOST", "LV-FILES", "LV-404", "LV-RAW", "LV-REDIRECT", "LV-UTILITY", "LV-SITEMAP"],
};
