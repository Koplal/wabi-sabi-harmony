/**
 * Rule data for the verify harness: patterns, required strings and file lists only.
 * The rule logic lives in source-checks.ts, dist-checks.ts, browser-rules.ts and live-rules.ts.
 */
import { ROUTES } from "../../src/data/routes";

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
      // B-15: the forms left these providers, so the page must not name them again.
      "Lovable",
      "Supabase",
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
  {
    id: "BAN-25",
    row: "DJ-19, DJ-21",
    patterns: ["addToCart", "useCart", "Add to Cart", "Request a Private Consultation", "November 20", "December 5", "Available: November", "December calendar", "September 25", "October 10", "Deliveries:", "autumn calendar", "schema\\.org/PreOrder"],
    scope: [
      "CozyCabin", "WinterWonderland", "FestiveEstate", "GrandCelebration", "BusinessWelcome", "WinterHoliday",
      "QuietGrace", "AbundantHarmony", "GatheredAbundance", "EstateCollection", "MindfulMerchant", "FallPumpkins",
    ].map((page) => `src/pages/seasonal/${page}.tsx`),
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
export const SEASON_CLOSED = "2026 season closed. 2027 waitlist open.";
export const WINDOW_TO_CONFIRM = "To be confirmed for 2027";
export const WINTER_INTRO = "Our 2026 winter season is closed, and the 2027 waitlist is open.";
export const AUTUMN_INTRO = "Our 2026 autumn season is closed, and the 2027 waitlist is open.";

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
  /** Markup a built page body can't hold, so D-COPY skips it. D-PARITY proves JSON-LD availability on the built page, and BR-INTERACT the option. */
  sourceOnly?: true;
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

const WINTER_WINDOW_PAGES = ["CozyCabin", "WinterWonderland", "FestiveEstate"].map(seasonal);
const WINTER_OTHER_PAGES = ["GrandCelebration", "BusinessWelcome"].map(seasonal);
const FALL_WINDOW_PAGES = ["QuietGrace", "AbundantHarmony", "GatheredAbundance"].map(seasonal);
const FALL_OTHER_PAGES = ["EstateCollection", "MindfulMerchant"].map(seasonal);
const FALL_PAGES = [...FALL_WINDOW_PAGES, ...FALL_OTHER_PAGES];
const FALL_HUB = seasonal("FallPumpkins");
const SEASONING = "src/pages/Seasoning.tsx";

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
  { row: "DJ-19", text: WAITLIST_2027, files: [...WINTER_WINDOW_PAGES, ...WINTER_OTHER_PAGES, seasonal("WinterHoliday")] },
  { row: "DJ-19", text: SEASON_CLOSED, files: [...WINTER_WINDOW_PAGES, ...WINTER_OTHER_PAGES, SEASONING] },
  { row: "DJ-19", text: `seasoning/winter-holiday): ${SEASON_CLOSED}`, files: [LLMS] },
  { row: "DJ-19", text: "https://schema.org/OutOfStock", files: [...WINTER_WINDOW_PAGES, ...WINTER_OTHER_PAGES, seasonal("WinterHoliday")], sourceOnly: true },
  { row: "DJ-19", text: "/contact?interest=seasonal-2027-waitlist", files: [...WINTER_WINDOW_PAGES, ...WINTER_OTHER_PAGES, seasonal("WinterHoliday")] },
  { row: "DJ-19", text: 'value="seasonal-2027-waitlist"', files: [CONTACT], sourceOnly: true },
  { row: "DJ-19", text: WINDOW_TO_CONFIRM, files: WINTER_WINDOW_PAGES },
  { row: "DJ-19", text: WINTER_INTRO, files: [seasonal("WinterHoliday")] },
  { row: "DJ-21", text: WAITLIST_2027, files: [...FALL_PAGES, FALL_HUB] },
  { row: "DJ-21", text: SEASON_CLOSED, files: FALL_PAGES },
  { row: "DJ-21", text: `seasoning/fall-pumpkins): ${SEASON_CLOSED}`, files: [LLMS] },
  { row: "DJ-21", text: "https://schema.org/OutOfStock", files: [...FALL_PAGES, FALL_HUB], sourceOnly: true },
  { row: "DJ-21", text: "/contact?interest=seasonal-2027-waitlist", files: [...FALL_PAGES, FALL_HUB] },
  { row: "DJ-21", text: WINDOW_TO_CONFIRM, files: FALL_WINDOW_PAGES },
  { row: "DJ-21", text: AUTUMN_INTRO, files: [FALL_HUB] },
  { row: "FR-8", text: "Privacy Policy", files: [TERMS, AGREEMENT] },
  { row: "FR-8", text: "Microsoft Clarity", files: [PRIVACY] },
  { row: "FR-8", text: "Stripe", files: [PRIVACY] },
  { row: "FR-8", text: "Resend", files: [PRIVACY] },
  { row: "FR-8", text: "runs our forms", files: [PRIVACY] },
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
  {
    // In order, so the fall card can't pass on the winter card's copy of the same line.
    row: "DJ-21",
    texts: ["Autumn Warmth", SEASON_CLOSED, "Winter Elegance", SEASON_CLOSED],
    files: [SEASONING],
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
/** Catalogue ids of packages whose season is closed (DJ-19, DJ-21). Each one and its add-ons must carry closed: true. */
export const CLOSED_PACKAGES = [
  "cozy-cabin", "winter-wonderland", "festive-estate", "grand-celebration", "business-welcome",
  "quiet-grace", "abundant-harmony", "gathered-abundance", "estate-collection", "mindful-merchant",
];

export const FORM_FILES = {
  handler: "api/send-form-email.ts",
  /** Read by name in the function, so they are not in its field lists. */
  directKeys: ["name", "email"],
  pages: [
    { form: "contact", file: CONTACT },
    { form: "booking", file: "src/pages/Book.tsx" },
    { form: "careers", file: "src/pages/Careers.tsx" },
  ],
};

export const OVERLAP = {
  words: 8,
  exemptFiles: [PRIVACY],
  siblingDirs: ["src", "public"],
  siblingFiles: ["index.html"],
  siblingSkip: ["__tests__", "node_modules"],
  nonCopyAttributes: ["className", "to", "href", "src", "id", "key", "type", "name", "rel", "target", "htmlFor", "style", "canonical", "loading", "decoding"],
};

// ---------------------------------------------------------------------------
// Dist rules
// ---------------------------------------------------------------------------

/** The router, the build and the harness read one list (R2-FR-11). D-MANIFEST checks it against the Release 1 record. */
export const INDEXABLE_ROUTES: string[] = ROUTES.filter((route) => !route.utility).map((route) => route.path);

export const UTILITY_ROUTES: string[] = ROUTES.filter((route) => route.utility).map((route) => route.path);

/** The only reasons a listed exception may give. This file is public, so nothing more goes here. */
export const AUDIT_REASONS = {
  frozen: "frozen by owner decision",
  kept: "kept by owner decision",
  held: "held for owner review",
  pending: "pending owner review text",
};

const frozen = (...routes: string[]) => Object.fromEntries(routes.map((route) => [route, AUDIT_REASONS.frozen]));

/** The page limits D-AUDIT and LV-AUDIT share. Every route left out of a limit is listed here. */
export const AUDIT = {
  titleMax: 60,
  descriptionMax: 160,
  minWords: 150,
  minLinks: 3,
  /** Booking, contact and legal pages, which need no word floor. */
  wordExempt: ["/book", "/contact", "/privacy", "/terms-of-service", "/client-agreement"],
  wordPending: { "/reviews": AUDIT_REASONS.pending } as Record<string, string>,
  titleExempt: frozen(
    "/seasoning/winter-holiday",
    "/seasoning/the-business-welcome",
    "/seasoning/the-winter-wonderland",
    "/seasoning/the-grand-celebration",
    "/seasoning/the-festive-estate",
    "/seasoning/mindful-merchant",
    "/seasoning/gathered-abundance",
    "/seasoning/estate-collection",
    "/seasoning/abundant-harmony",
    "/seasoning/fall-pumpkins",
    "/seasoning/quiet-grace"
  ) as Record<string, string>,
  descriptionExempt: {} as Record<string, string>,
};

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

/** A utility route that builds with no H1, because its page only exists with a cart (R2-FR-09). */
export const NO_H1_ROUTE = "/checkout";

/** Pages outside the indexable list, so they carry no parity check. */
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

/**
 * The day each indexable route's copy last changed. The sitemap reads this, not git, because
 * Vercel's clone has a depth of 10 and would give many pages one moving date. A copy change dates
 * its page here: npm run verify -- --write-lastmod, after the commit.
 */
export const LASTMOD_FILE = "src/data/lastmod.json";

/** Where the copy rules find a built page's text, for rules that name a source file. */
export const COPY_PAGES = {
  /** A page whose copy lives in another file. */
  aliases: { [FAQ_PAGE]: FAQ_DATA } as Record<string, string>,
  /** Data a page shows beside its own copy, so a change there dates the page too (R2-FR-15). */
  pageData: {
    "src/pages/Home.tsx": ["src/data/googleReviews.ts"],
    "src/pages/Reviews.tsx": ["src/data/googleReviews.ts"],
    "src/pages/areas/Index.tsx": ["src/data/neighborhoods.ts"],
  } as Record<string, string[]>,
  areaPrefix: "/areas/",
  areaFile: "src/data/neighborhoods.ts",
  /** The copy every area page shares. */
  areaTemplate: "src/components/NeighborhoodPage.tsx",
};

// ---------------------------------------------------------------------------
// Browser rules
// ---------------------------------------------------------------------------

/**
 * BR-LCP: how far a deployment's lowest run may pass production's lowest in the same sitting.
 * A change that shifts the page on every load raises every run, so this is the limit for those.
 * Production repeats its figure from run to run on the routes measured, so this stays small.
 */
export const CLS_TOLERANCE = 0.001;

/**
 * BR-LCP: how far a deployment's largest run may pass production's largest. Two shifts that land
 * in one frame score more than they do apart. On /areas/oak-bay production reads 0.0067 and
 * 0.0007 on every run, and a built page reads those same two, or one 0.0125 with the same
 * elements as sources, on some runs. The likely reason is earlier paint, which isn't measured.
 */
export const CLS_ONE_RUN_ALLOWANCE = 0.006;

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

export type SiteDown = "aborted" | "refused" | "stalled";
export type TypedMoment = "before" | "during";

/** One form in BR-EARLY. Each map is a selector and the text that goes in it. */
export interface EarlyFormPlan {
  route: string;
  /** The end of the URL its send goes to. The request stops in the browser. */
  action: string;
  /** Filled before React attaches. */
  early: Record<string, string>;
  /** Typed after, because a later change to one field must not lose what is already there. */
  late: Record<string, string>;
}

export const BROWSER = {
  blockedHosts: ["googletagmanager.com", "google-analytics.com", "clarity.ms"],
  fontHosts: ["fonts.googleapis.com", "fonts.gstatic.com"],
  bypassHeader: "x-vercel-protection-bypass",
  minAreaLinks: 19,
  seededCart: [
    {
      id: "fresh-start",
      name: "The Fresh Start",
      price: 474,
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
    waitlist: { route: "/contact?interest=seasonal-2027-waitlist", trigger: 'form button[role="combobox"]', shown: "2027 Seasonal Waitlist", reply: "We will contact you when 2027 dates are set." },
    scroll: { start: "/faq", through: "/ritual" },
  },
  /**
   * BR-EARLY: what a visitor can do between a built page painting and React attaching to it. Every
   * other rule acts after that, so none of them sees this window, which Release 1 did not have. The
   * scripts are held until each step is done. A form's send stops in the browser, where its body is
   * read. chunk makes one page's script fail, once and then every time.
   */
  early: {
    scripts: "**/assets/*.js",
    scroll: { route: "/services/cleaning", to: 1500 },
    forms: [
      {
        route: "/contact",
        action: "/api/send-form-email",
        early: { "#name": "Early Name", "#email": "early@example.com", "#phone": "Early Phone", "#address": "Early Address" },
        late: { "#notes": "Late Notes" },
      },
      {
        route: "/book",
        action: "/api/send-form-email",
        early: { "#name": "Early Name", "#email": "early@example.com", "#phone": "Early Phone", "#address": "Early Address", "#preferredTime1": "Early Monday" },
        late: { "#preferredTime3": "Late Friday" },
      },
      {
        route: "/careers",
        action: "/api/send-form-email",
        early: { "#name": "Early Name", "#email": "early@example.com", "#position": "Early Position", "#experience": "Early Experience" },
        late: { "#message": "Late Message" },
      },
    ] as EarlyFormPlan[],
    chunk: { route: "/contact", script: "**/assets/Contact-*.js", field: "#name", text: "Early Name" },
    /** How the site check goes wrong, and when text can reach a form. Each must end with no reload. */
    siteDown: ["aborted", "refused", "stalled"] as SiteDown[],
    typed: ["before", "during"] as TypedMoment[],
    /** Read with no script run, because they are the way out when none can. */
    help: ["250-896-5971", "hello@wabisabiservices.ca"],
    /** The start of what a visitor reads after a send fails. */
    sendFailed: "We couldn't send this",
    /**
     * A saved cart loads only after React attaches, which can take seconds on a phone, and Stripe's
     * cancel URL lands here. Until then the built page must not call that cart this word.
     */
    cart: { route: "/cart", falseClaim: "empty" },
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
    routes: ["/", "/services", "/areas/oak-bay", "/services/cleaning", "/blog/july-2026"],
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
  /** A plain path and each dynamic segment, because each is served by its own route. */
  missingPaths: ["/does-not-exist", "/blog/does-not-exist", "/seasoning/does-not-exist", "/areas/does-not-exist"],
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
    { from: "/about/index.html", to: "/about" },
    { from: "/services/cleaning/index.html", to: "/services/cleaning" },
    { from: "/home", to: "/" },
    { from: "/home/", to: "/", maxHops: 2 },
    { from: "/the-ritual/", to: "/ritual", maxHops: 2 },
    { from: "/services/errands/", to: "/services/errands" },
  ] as Array<{ from: string; to: string; maxHops?: number }>,
  /** Paths the redirects must leave alone. Only the absence of a redirect is checked, so a GET is enough. */
  notRedirected: ["/api/send-form-email", "/sitemap.xml"],
  utilityRoutes: ["/cart", "/checkout", STRIPE_RETURN],
  /**
   * LV-HOPS: exact redirects from each start to the apex page, with and without the query. slash is
   * the path with a trailing slash. Only the www rows depend on the live www rule, and --www-slash
   * says which rule is live, so a change to that rule needs no commit here.
   */
  hops: {
    path: "/services/cleaning",
    query: "?utm_source=x&gclid=y",
    table: [
      { origin: "https://wabisabiservices.ca", bare: 0, slash: { before: 1, after: 1 } },
      { origin: "http://wabisabiservices.ca", bare: 1, slash: { before: 2, after: 2 } },
      { origin: "https://www.wabisabiservices.ca", bare: 1, slash: { before: 2, after: 1 } },
      { origin: "http://www.wabisabiservices.ca", bare: 2, slash: { before: 3, after: 2 } },
    ],
  },
  releaseOne: ["LV-HOST", "LV-FILES"],
  all: ["LV-HOST", "LV-FILES", "LV-404", "LV-RAW", "LV-REDIRECT", "LV-UTILITY", "LV-SITEMAP", "LV-AUDIT", "LV-HOPS"],
};
