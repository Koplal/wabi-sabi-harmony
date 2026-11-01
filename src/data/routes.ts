import { neighborhoods } from "./neighborhoods";

/**
 * The one route list. The router, the prerender step and the verify harness all read it, so a
 * route is added here and nowhere else. The harness and prerender.ts load this file directly, so
 * it imports data only: no pages, React or assets.
 */
export interface SiteRoute {
  path: string;
  /** The file under src/pages, with no extension. Area routes share a template and leave it out. */
  page?: string;
  /** For an area route, the key of its entry in neighborhoods.ts. */
  area?: string;
  /** The page brings no Layout of its own, so the router adds one. */
  addLayout?: true;
  /** A step in the checkout: served, but noindex and left out of the sitemap. */
  utility?: true;
}

const blogPosts: Array<[slug: string, page: string]> = [
  ["august-2025", "August2025"],
  ["september-2025", "September2025"],
  ["october-2025", "October2025"],
  ["november-2025", "November2025"],
  ["december-2025", "December2025"],
  ["january-2026", "January2026"],
  ["february-2026", "February2026"],
  ["march-2026", "March2026"],
  ["april-2026", "April2026"],
  ["may-2026", "May2026"],
  ["june-2026", "June2026"],
  ["july-2026", "July2026"],
];

const seasonalPages: Array<[slug: string, page: string]> = [
  ["fall-pumpkins", "FallPumpkins"],
  ["quiet-grace", "QuietGrace"],
  ["abundant-harmony", "AbundantHarmony"],
  ["gathered-abundance", "GatheredAbundance"],
  ["estate-collection", "EstateCollection"],
  ["mindful-merchant", "MindfulMerchant"],
  ["winter-holiday", "WinterHoliday"],
  ["the-cozy-cabin", "CozyCabin"],
  ["the-winter-wonderland", "WinterWonderland"],
  ["the-festive-estate", "FestiveEstate"],
  ["the-grand-celebration", "GrandCelebration"],
  ["the-business-welcome", "BusinessWelcome"],
  ["spring-refresh", "SpringRefresh"],
  ["the-fresh-start", "FreshStart"],
  ["the-garden-gate", "GardenGate"],
  ["the-botanical-estate", "BotanicalEstate"],
  ["the-blooming-manor", "BloomingManor"],
  ["the-professional-welcome", "ProfessionalWelcome"],
  ["summer-serenity", "SummerSerenity"],
  ["the-coastal-cottage", "CoastalCottage"],
  ["the-island-retreat", "IslandRetreat"],
  ["the-beachside-manor", "BeachsideManor"],
  ["the-seaside-estate", "SeasideEstate"],
  ["the-summer-storefront", "SummerStorefront"],
];

export const ROUTES: SiteRoute[] = [
  { path: "/", page: "Home", addLayout: true },
  { path: "/about", page: "About" },
  { path: "/services", page: "Services" },
  { path: "/services/cleaning", page: "services/Cleaning" },
  { path: "/services/organizing", page: "services/Organizing" },
  { path: "/services/errands", page: "services/Errands" },
  { path: "/ritual", page: "Ritual" },
  { path: "/reviews", page: "Reviews" },
  { path: "/careers", page: "Careers" },
  { path: "/contact", page: "Contact" },
  { path: "/book", page: "Book" },
  { path: "/faq", page: "FAQ" },
  { path: "/key-takeaways", page: "KeyTakeaways" },
  { path: "/terms-of-service", page: "TermsOfService" },
  { path: "/client-agreement", page: "ClientAgreement" },
  { path: "/privacy", page: "Privacy" },
  { path: "/blog", page: "Blog" },
  ...blogPosts.map(([slug, page]) => ({ path: `/blog/${slug}`, page: `blog/${page}` })),
  { path: "/seasoning", page: "Seasoning" },
  ...seasonalPages.map(([slug, page]) => ({ path: `/seasoning/${slug}`, page: `seasonal/${page}` })),
  { path: "/areas", page: "areas/Index" },
  ...Object.entries(neighborhoods).map(([key, { slug }]) => ({ path: `/areas/${slug}`, area: key })),
  { path: "/cart", page: "Cart", utility: true },
  { path: "/checkout", page: "Checkout", utility: true },
  { path: "/checkout-success", page: "CheckoutSuccess", utility: true },
];
