/**
 * The only copy of the organization data. LocalBusinessSchema and
 * ParentOrganizationSchema render it at runtime, and scripts/prerender.ts writes
 * it into the static head, so the two cannot drift. It imports nothing from
 * React or assets, because prerender.ts runs it under tsx.
 */

const SITE = "https://wabisabiservices.ca";

export const ORG_ID = `${SITE}/#organization`;
const PARENT_ORG_ID = `${SITE}/#vcs-inc`;

const INSTAGRAM_URL = "https://www.instagram.com/wabisabiservices/";
const TELEPHONE = "+1-250-896-5971";
const EMAIL = "hello@wabisabiservices.ca";
const LOGO_URL = `${SITE}/og-image.png`;

/** The short link for visible links until the full Maps URL is set. It never goes in JSON-LD. */
export const GOOGLE_SHARE_URL = "https://share.google/qpmn3a6VHcDFweao6";

// prerender.ts runs under tsx, where import.meta.env is undefined, so it reads
// process.env. In the browser, naming the variable in full lets Vite inline just
// this value. Any other form inlines the whole env object into the main chunk.
const mapsUrlSetting: string | undefined =
  typeof window === "undefined"
    ? (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.VITE_GOOGLE_MAPS_URL
    : import.meta.env.VITE_GOOGLE_MAPS_URL;

/** The full Maps URL from VITE_GOOGLE_MAPS_URL, or "" until it is set. */
export const GOOGLE_MAPS_URL = (mapsUrlSetting ?? "").trim();

/** Where the visible Google Reviews links go. */
export const GOOGLE_REVIEWS_URL = GOOGLE_MAPS_URL || GOOGLE_SHARE_URL;

/** Drives both openingHours and openingHoursSpecification, so they cannot disagree. */
const HOURS = {
  dayRange: "Mo-Fr",
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: "08:00",
  closes: "18:00",
};

/** The Organization/LocalBusiness entity that every other node references by @id. */
export const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": ORG_ID,
  name: "Wabi Sabi Services",
  legalName: "Wabi Sabi Services Inc.",
  url: SITE,
  logo: LOGO_URL,
  image: LOGO_URL,
  description:
    "Quiet luxury, immaculately kept. Mindful cleaning for intentional homes and businesses in Victoria, BC. Museum-level precision, discreet service, sustainable care.",
  email: EMAIL,
  telephone: TELEPHONE,
  priceRange: "$$-$$$",
  foundingDate: "2025",
  founder: {
    "@type": "Person",
    "@id": "https://www.pearlys.ca/#jalene",
    name: "Jalene Plamondon",
    jobTitle: "Founder",
  },
  parentOrganization: { "@id": PARENT_ORG_ID },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Victoria",
    addressRegion: "BC",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "48.4284",
    longitude: "-123.3656",
  },
  areaServed: [
    { "@type": "Place", name: "Greater Victoria (Capital Regional District), from Sidney to Metchosin" },
    { "@type": "Place", name: "Uplands, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4480", longitude: "-123.2980" } },
    { "@type": "Place", name: "Oak Bay, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4262", longitude: "-123.3120" } },
    { "@type": "Place", name: "Rockland, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4220", longitude: "-123.3440" } },
    { "@type": "Place", name: "Ten Mile Point, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4630", longitude: "-123.2740" } },
    { "@type": "Place", name: "Cadboro Bay, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4560", longitude: "-123.2920" } },
    { "@type": "Place", name: "North Saanich, BC", geo: { "@type": "GeoCoordinates", latitude: "48.6590", longitude: "-123.4150" } },
    { "@type": "Place", name: "Willis Point, BC", geo: { "@type": "GeoCoordinates", latitude: "48.5470", longitude: "-123.4760" } },
    { "@type": "Place", name: "Fairfield, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4160", longitude: "-123.3460" } },
    { "@type": "Place", name: "Gordon Head, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4730", longitude: "-123.3120" } },
    { "@type": "Place", name: "Broadmead, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4870", longitude: "-123.3690" } },
    { "@type": "Place", name: "Cordova Bay, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.5130", longitude: "-123.3760" } },
    { "@type": "Place", name: "Dean Park, North Saanich, BC", geo: { "@type": "GeoCoordinates", latitude: "48.6310", longitude: "-123.4250" } },
    { "@type": "Place", name: "Prospect Lake, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.5170", longitude: "-123.4470" } },
    { "@type": "Place", name: "Sidney, BC", geo: { "@type": "GeoCoordinates", latitude: "48.6506", longitude: "-123.3986" } },
    { "@type": "Place", name: "Metchosin, BC", geo: { "@type": "GeoCoordinates", latitude: "48.3810", longitude: "-123.5360" } },
    { "@type": "Place", name: "James Bay, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4150", longitude: "-123.3720" } },
    { "@type": "Place", name: "Downtown Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4284", longitude: "-123.3656" } },
    { "@type": "Place", name: "Gonzales, Victoria, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4110", longitude: "-123.3210" } },
    { "@type": "Place", name: "Bear Mountain, Langford, BC", geo: { "@type": "GeoCoordinates", latitude: "48.4640", longitude: "-123.5260" } },
  ],
  openingHours: `${HOURS.dayRange} ${HOURS.opens}-${HOURS.closes}`,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: HOURS.days,
      opens: HOURS.opens,
      closes: HOURS.closes,
    },
  ],
  sameAs: GOOGLE_MAPS_URL ? [INSTAGRAM_URL, GOOGLE_MAPS_URL] : [INSTAGRAM_URL],
  ...(GOOGLE_MAPS_URL ? { hasMap: GOOGLE_MAPS_URL } : {}),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: TELEPHONE,
    email: EMAIL,
    availableLanguage: ["English"],
  },
};

/** The parent company. Home page only: every other page references it through parentOrganization. */
export const PARENT_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": PARENT_ORG_ID,
  name: "VCS Inc.",
  legalName: "VCS Vice Consulting and Streaming Inc.",
  subOrganization: [{ "@id": ORG_ID }, { "@id": "https://www.pearlys.ca/#business" }],
};
