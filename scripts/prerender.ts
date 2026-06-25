/**
 * Build-time prerender for AEO / crawlability.
 *
 * For every key route, writes dist/<route>/index.html — a copy of the SPA shell
 * (dist/index.html) with that route's <title>, meta description, canonical,
 * Open Graph/Twitter tags, and JSON-LD injected into the raw HTML <head>.
 * Non-JS consumers (AI answer engines, social scrapers, first-pass crawlers)
 * read these static signals directly; the SPA still boots and routes
 * client-side as normal.
 *
 * The route table below mirrors each page component's <SEO ...> props
 * (title/description/canonical) and its JSON-LD intent (Service, BlogPosting,
 * Product/Offer, ItemList, BreadcrumbList) so the static head stays consistent
 * with what React renders at runtime. Area pages are generated from
 * src/data/neighborhoods.ts.
 *
 * Runs after `vite build` (see package.json "build"). No headless browser required.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neighborhoods } from "../src/data/neighborhoods";
import { faqItems } from "../src/data/faqItems";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE = "https://wabisabiservices.ca";
const ORG_ID = `${SITE}/#organization`;

const template = readFileSync(resolve(DIST, "index.html"), "utf8");

const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
// schema.org guidance: escape "<" inside <script type="application/ld+json">
const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

const BRAND = "Wabi Sabi Services";

// ---------------------------------------------------------------------------
// JSON-LD builders — mirror the runtime structured-data components 1:1.
// ---------------------------------------------------------------------------

function breadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function service(opts: {
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string;
  areaServedType?: "City" | "Place";
  geo?: { lat: string; lng: string };
}) {
  const areaServedNode: Record<string, unknown> = {
    "@type": opts.areaServedType || "City",
    name: opts.areaServed || "Victoria, BC",
  };
  if (opts.geo) {
    areaServedNode.geo = {
      "@type": "GeoCoordinates",
      latitude: opts.geo.lat,
      longitude: opts.geo.lng,
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    provider: { "@id": ORG_ID },
    areaServed: areaServedNode,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE}/book`,
      servicePhone: "+1-250-896-5971",
    },
  };
}

function itemList(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

function article(opts: {
  headline: string;
  description: string;
  datePublished: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.datePublished,
    url: opts.url,
    mainEntityOfPage: opts.url,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

function faqPage(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

function product(opts: {
  name: string;
  description: string;
  price: string;
  availability: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    brand: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      price: opts.price,
      priceCurrency: "CAD",
      availability: opts.availability,
      url: opts.url,
    },
  };
}

// ---------------------------------------------------------------------------
// Render + write helpers.
// ---------------------------------------------------------------------------

interface RouteMeta {
  /** Route path, e.g. "/services/cleaning". "/" writes dist/index.html. */
  path: string;
  /** Bare page title (brand suffix appended automatically, matching <SEO>). */
  title: string;
  description: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  jsonLdBlocks: unknown[];
}

function renderPage(meta: RouteMeta): string {
  let html = template;
  const fullTitle = `${meta.title} | ${BRAND}`;
  const canonical = meta.path === "/" ? `${SITE}/` : `${SITE}${meta.path}`;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escAttr(fullTitle)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${escAttr(meta.description)}" />`
  );

  const repl: Array<[RegExp, string]> = [
    [/<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:type" content="${meta.ogType || "website"}" />`],
    [/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:title" content="${escAttr(fullTitle)}" />`],
    [/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:description" content="${escAttr(meta.description)}" />`],
    [/<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`],
    [/<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="twitter:title" content="${escAttr(fullTitle)}" />`],
    [/<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="twitter:description" content="${escAttr(meta.description)}" />`],
    [/<meta\s+name="twitter:url"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="twitter:url" content="${canonical}" />`],
  ];
  for (const [re, val] of repl) html = html.replace(re, val);

  let inject = `\n    <link rel="canonical" href="${canonical}" />`;
  if (meta.publishedTime) {
    inject += `\n    <meta property="article:published_time" content="${escAttr(meta.publishedTime)}" />`;
  }
  inject += "\n    " + meta.jsonLdBlocks.map(jsonLd).join("\n    ") + "\n  ";
  html = html.replace("</head>", `${inject}</head>`);
  return html;
}

function write(relPath: string, html: string) {
  const out = resolve(DIST, relPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, "utf8");
}

function outPathFor(routePath: string): string {
  if (routePath === "/") return "index.html";
  return `${routePath.replace(/^\//, "")}/index.html`;
}

const bcHome = { name: "Home", url: `${SITE}/` };
const bcServices = { name: "Services", url: `${SITE}/services` };
const bcSeasonal = { name: "Seasonal", url: `${SITE}/seasoning` };
const bcJournal = { name: "Journal", url: `${SITE}/blog` };

// ---------------------------------------------------------------------------
// Static route table.
// ---------------------------------------------------------------------------

const routes: RouteMeta[] = [
  // Home
  {
    path: "/",
    title: "Mindful Luxury Cleaning Victoria BC",
    description:
      "Quiet luxury, immaculately kept. Professional cleaning, organizing, and household services in Victoria, BC. Museum-level precision, discreet service, sustainable care.",
    jsonLdBlocks: [],
  },

  // Services hub
  {
    path: "/services",
    title: "Our Services",
    description:
      "Professional cleaning, organizing, and concierge services in Victoria, BC. Residential cleaning, commercial cleaning, home organizing, and errand services.",
    jsonLdBlocks: [
      breadcrumb([bcHome, bcServices]),
      itemList([
        { name: "Cleaning Services", url: `${SITE}/services/cleaning` },
        { name: "Professional Organizing", url: `${SITE}/services/organizing` },
        { name: "Household Errands", url: `${SITE}/services/errands` },
      ]),
      service({
        name: "Cleaning Services",
        description:
          "Residential, commercial, and specialty cleaning for Victoria's most distinguished homes, from regular maintenance to deep cleans and post-construction care.",
        serviceType: "House Cleaning",
      }),
      service({
        name: "Professional Organizing",
        description:
          "Decluttering and household systems that reduce mental load and support daily life across Greater Victoria, BC.",
        serviceType: "Home Organizing",
      }),
      service({
        name: "Household Errands",
        description:
          "Discreet errand running and household coordination for clients across Greater Victoria, BC.",
        serviceType: "Concierge Service",
      }),
    ],
  },

  // Service subpages
  {
    path: "/services/cleaning",
    title: "Professional Cleaning Services Victoria BC",
    description:
      "Residential, commercial, and specialty cleaning in Victoria, BC. Deep cleaning, maintenance, move-in/out, post-construction, and vacation rental turnover.",
    jsonLdBlocks: [
      service({
        name: "Professional Cleaning Services",
        description:
          "Cleaning for homes and businesses in Victoria, BC: residential maintenance, deep cleaning, commercial spaces, and specialty services.",
        serviceType: "Cleaning Service",
      }),
      breadcrumb([bcHome, bcServices, { name: "Cleaning", url: `${SITE}/services/cleaning` }]),
    ],
  },
  {
    path: "/services/organizing",
    title: "Professional Organizing Services Victoria BC",
    description:
      "Expert home and office organizing services in Victoria, BC. Decluttering, space planning, closet systems, seasonal transitions, and move coordination.",
    jsonLdBlocks: [
      service({
        name: "Professional Organizing Services",
        description:
          "Expert organizing for closets to entire homes in Victoria, BC. We compose functional, beautiful systems that make daily life easier.",
        serviceType: "Organizing Service",
      }),
      breadcrumb([bcHome, bcServices, { name: "Organizing", url: `${SITE}/services/organizing` }]),
    ],
  },
  {
    path: "/services/errands",
    title: "Concierge & Errand Services Victoria BC",
    description:
      "Professional errand and concierge services in Victoria, BC. Grocery shopping, home restocking, mail services, pet care coordination, and household management.",
    jsonLdBlocks: [
      service({
        name: "Concierge & Errand Services",
        description:
          "Save time with professional errand services. We handle grocery shopping, household restocking, dry cleaning, mail services, and more in Victoria, BC.",
        serviceType: "Concierge Service",
      }),
      breadcrumb([bcHome, bcServices, { name: "Errands", url: `${SITE}/services/errands` }]),
    ],
  },

  // FAQ
  {
    path: "/faq",
    title: "Frequently Asked Questions",
    description:
      "Get answers to common questions about Wabi Sabi Services' luxury cleaning, organizing, and concierge services in Victoria, BC. Pricing, scheduling, and service details.",
    jsonLdBlocks: [
      breadcrumb([bcHome, { name: "FAQ", url: `${SITE}/faq` }]),
      faqPage(faqItems),
    ],
  },

  // About
  {
    path: "/about",
    title: "About Us",
    description:
      "Learn about Wabi Sabi Services and our approach to mindful luxury cleaning in Victoria, BC. Founded on environmental psychology principles and hospitality standards.",
    jsonLdBlocks: [breadcrumb([bcHome, { name: "About", url: `${SITE}/about` }])],
  },

  // Reviews
  {
    path: "/reviews",
    title: "Client Reviews & Testimonials",
    description:
      "Read what discerning clients across Greater Victoria, BC say about Wabi Sabi Services. Luxury concierge cleaning reviews from Uplands, Oak Bay, and Bear Mountain.",
    jsonLdBlocks: [breadcrumb([bcHome, { name: "Reviews", url: `${SITE}/reviews` }])],
  },

  // Contact
  {
    path: "/contact",
    title: "Contact Us",
    description:
      "Get in touch with Wabi Sabi Services for luxury cleaning, organizing, and concierge services in Victoria, BC. Request a private consultation today.",
    jsonLdBlocks: [breadcrumb([bcHome, { name: "Contact", url: `${SITE}/contact` }])],
  },

  // The Ritual (no <SEO> in source yet — mirror page intent without "complimentary" wording)
  {
    path: "/ritual",
    title: "The Ritual",
    description:
      "Our approach to caring for your home: personalized checklists informed by environmental psychology and refined through hospitality standards, across Greater Victoria.",
    jsonLdBlocks: [breadcrumb([bcHome, { name: "The Ritual", url: `${SITE}/ritual` }])],
  },

  // What to Expect
  {
    path: "/key-takeaways",
    title: "What to Expect — Wabi Sabi Services",
    description:
      "How we work, what we value, and what it's like to have Wabi Sabi Services care for your home in Greater Victoria. Quiet, mindful, fully insured.",
    jsonLdBlocks: [breadcrumb([bcHome, { name: "What to Expect", url: `${SITE}/key-takeaways` }])],
  },

  // Blog index
  {
    path: "/blog",
    title: "The Wabi Sabi Journal: Mindful Home Notes",
    description:
      "Seasonal notes on caring for a Victoria home with intention — cleaning, organizing, and the quiet rituals that keep a household calm through the year.",
    jsonLdBlocks: [breadcrumb([bcHome, bcJournal])],
  },

  // Seasonal hub
  {
    path: "/seasoning",
    title: "Seasonal Decorating Services in Victoria BC",
    description:
      "Seasonal styling for the home through autumn, winter, spring, and summer. Designed, installed, and removed by hand across Greater Victoria.",
    jsonLdBlocks: [breadcrumb([bcHome, bcSeasonal])],
  },
];

// ---------------------------------------------------------------------------
// Blog posts (12) — title/description/datePublished mirror each <SEO>/<ArticleSchema>.
// ---------------------------------------------------------------------------

interface BlogEntry {
  slug: string;
  title: string;
  description: string;
  headline: string;
  articleDescription: string;
  datePublished: string;
  publishedTime: string;
  crumb: string;
}

const blogPosts: BlogEntry[] = [
  {
    slug: "august-2025",
    title: "August Awakening: From Summer's Ease to Fall's Focus",
    description:
      "As August settles over Victoria, renew your home with intention. Move outdoor living, beach gear, and kitchen routines from summer ease into autumn order.",
    headline: "August Awakening: Transitioning from Summer's Freedom to Fall's Focus",
    articleDescription:
      "As August settles over Victoria, renew your home with intention as summer's ease gives way to autumn's order.",
    datePublished: "2025-08-01",
    publishedTime: "2025-08-01T00:00:00-07:00",
    crumb: "August Awakening",
  },
  {
    slug: "september-2025",
    title: "Back-to-School Serenity: Calm in September's Chaos",
    description:
      "September brings routines, homework stations, and packed lunches. How a calm, well-ordered Victoria home supports learning, focus, and easier mornings.",
    headline: "Back-to-School Serenity: Creating Calm in September's Chaos",
    articleDescription:
      "How a calm, well-ordered Victoria home quietly supports learning, focus, and easier mornings as the school year begins.",
    datePublished: "2025-09-01",
    publishedTime: "2025-09-01T00:00:00-07:00",
    crumb: "Back-to-School Serenity",
  },
  {
    slug: "october-2025",
    title: "A Mindful Fall Cleaning Guide for Victoria Homes",
    description:
      "As maple leaves turn along Victoria's streets, autumn invites a gentler kind of cleaning. A room-by-room guide to a calm, warm home for the season ahead.",
    headline: "Embracing Autumn's Transition: Your Mindful Fall Cleaning Guide",
    articleDescription:
      "A room-by-room guide to preparing a calm, warm Victoria home for autumn, with natural methods and seasonal care.",
    datePublished: "2025-10-01",
    publishedTime: "2025-10-01T00:00:00-07:00",
    crumb: "Mindful Fall Cleaning",
  },
  {
    slug: "november-2025",
    title: "The Gratitude Home: Thankful Spaces for Connection",
    description:
      "November in Victoria invites us to gather. A calm plan for readying your home before Thanksgiving, room by room, with gratitude rather than rush.",
    headline: "The Gratitude Home: Preparing Thankful Spaces for Connection",
    articleDescription:
      "A calm, considered plan for readying your Victoria home before Thanksgiving, room by room, with gratitude rather than rush.",
    datePublished: "2025-11-01",
    publishedTime: "2025-11-01T00:00:00-08:00",
    crumb: "The Gratitude Home",
  },
  {
    slug: "december-2025",
    title: "Holiday Harmony: Mindful Cleaning for December",
    description:
      "December in Victoria sparkles with lights and gatherings. A week-by-week plan for hosting with grace, plus natural scents and sustainable table settings.",
    headline: "Holiday Harmony: Mindful Cleaning for December's Magic",
    articleDescription:
      "A week-by-week plan for hosting with grace in a Victoria home, with natural scents and sustainable table settings.",
    datePublished: "2025-12-01",
    publishedTime: "2025-12-01T00:00:00-08:00",
    crumb: "Holiday Harmony",
  },
  {
    slug: "january-2026",
    title: "The Art of Minimalism: Less Stuff, Less Stress",
    description:
      "A January look at minimalism through wabi-sabi. How simpler spaces calm the mind, plus a gentle four-week path to a lighter, easier-to-keep home.",
    headline: "The Art of Minimalism: How Less Stuff Means Less Stress",
    articleDescription:
      "How simpler spaces calm the mind, and a gentle four-week path to a lighter, easier-to-keep home, through the lens of wabi-sabi.",
    datePublished: "2026-01-01",
    publishedTime: "2026-01-01T00:00:00-08:00",
    crumb: "The Art of Minimalism",
  },
  {
    slug: "february-2026",
    title: "Love Your Home: Spaces That Nurture Relationships",
    description:
      "February is for tending love in all its forms, beginning with home. How a calm, cared-for Victoria space supports romance, family bonds, and self-care.",
    headline: "Love Your Home: Creating Spaces That Nurture Relationships",
    articleDescription:
      "How a calm, cared-for Victoria home supports romance, family bonds, and self-care in February and beyond.",
    datePublished: "2026-02-01",
    publishedTime: "2026-02-01T00:00:00-08:00",
    crumb: "Love Your Home",
  },
  {
    slug: "march-2026",
    title: "Sustainable Spring Cleaning for Eco-Conscious Victorians",
    description:
      "As cherry blossoms open across Victoria, refresh your home without harming the Island. Natural recipes, a room-by-room guide, and ways to let things go.",
    headline: "Spring Cleaning the Sustainable Way: A Guide for Eco-Conscious Victorians",
    articleDescription:
      "Natural recipes, a room-by-room guide, and mindful ways to let things go, for a Victoria home and the Island around it.",
    datePublished: "2026-03-01",
    publishedTime: "2026-03-01T00:00:00-08:00",
    crumb: "Sustainable Spring Cleaning",
  },
  {
    slug: "april-2026",
    title: "Earth Month: Cleaning with Climate Consciousness",
    description:
      "April brings Earth Day to Victoria. A four-week plan for lower-impact cleaning, ocean-safe choices, and a near zero-waste home routine.",
    headline: "Earth Month Excellence: Cleaning with Climate Consciousness",
    articleDescription:
      "A four-week plan for lower-impact cleaning, ocean-safe choices, and a near zero-waste routine, for a Victoria home.",
    datePublished: "2026-04-01",
    publishedTime: "2026-04-01T00:00:00-07:00",
    crumb: "Earth Month",
  },
  {
    slug: "may-2026",
    title: "May Mindfulness: Wellness Sanctuaries for Families",
    description:
      "May blooms in Victoria with rhododendrons and Mother's Day. How a clean, well-ordered home quietly supports sleep, nutrition, movement, and clearer minds.",
    headline: "May Mindfulness: Creating Wellness Sanctuaries for Modern Families",
    articleDescription:
      "How a clean, well-ordered Victoria home quietly supports sleep, nutrition, movement, and clearer minds for the whole family.",
    datePublished: "2026-05-01",
    publishedTime: "2026-05-01T00:00:00-07:00",
    crumb: "May Mindfulness",
  },
  {
    slug: "june-2026",
    title: "Pet-Friendly Cleaning: A Fresh, Safe Home",
    description:
      "Victoria is a pet-loving city. Which cleaning products put pets at risk, the gentler alternatives, and how to manage odours, hair, and messes safely.",
    headline: "Pet-Friendly Cleaning: Keeping Your Home Fresh and Your Furry Friends Safe",
    articleDescription:
      "Which common cleaning products put pets at risk, the gentler alternatives, and how to manage odours, hair, and messes safely.",
    datePublished: "2026-06-01",
    publishedTime: "2026-06-01T00:00:00-07:00",
    crumb: "Pet-Friendly Cleaning",
  },
  {
    slug: "july-2026",
    title: "Summer Sanctuary: Indoor-Outdoor Living in Victoria",
    description:
      "July in Victoria means long days and outdoor living. How to open your home to the garden, manage sand and sun, and keep cool without losing the calm.",
    headline: "Summer Sanctuary: Mastering Indoor-Outdoor Living in Victoria",
    articleDescription:
      "How to open your home to the garden, manage sand and sun, and keep cool without losing the calm, through a Victoria July.",
    datePublished: "2026-07-01",
    publishedTime: "2026-07-01T00:00:00-07:00",
    crumb: "Summer Sanctuary",
  },
];

for (const post of blogPosts) {
  const url = `${SITE}/blog/${post.slug}`;
  routes.push({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    ogType: "article",
    publishedTime: post.publishedTime,
    jsonLdBlocks: [
      article({
        headline: post.headline,
        description: post.articleDescription,
        datePublished: post.datePublished,
        url,
      }),
      breadcrumb([bcHome, bcJournal, { name: post.crumb, url }]),
    ],
  });
}

// ---------------------------------------------------------------------------
// Seasonal packages.
//
// 20 individual package pages (one Product + breadcrumb each) plus the 4
// seasonal hub pages (multiple Products + breadcrumb each). Together: 24 pages.
// ---------------------------------------------------------------------------

interface SeasonalEntry {
  slug: string; // route under /seasoning/
  title: string; // bare <SEO> title (brand suffix appended)
  description: string; // <SEO> description
  product: { name: string; description: string; price: string; availability: string };
  crumb: string; // breadcrumb leaf name
}

const PRE = "https://schema.org/PreOrder";
const IN = "https://schema.org/InStock";

const seasonalPackages: SeasonalEntry[] = [
  // Autumn
  {
    slug: "quiet-grace",
    title: "The Quiet Grace | Autumn Pumpkin Package",
    description:
      "A restrained autumn pumpkin display for intimate porches and townhome entries. Heritage and heirloom varieties, arranged and installed across Greater Victoria.",
    product: {
      name: "The Quiet Grace",
      description:
        "A restrained autumn pumpkin display for intimate porches and townhome entries, with heritage and heirloom varieties arranged on site.",
      price: "399",
      availability: PRE,
    },
    crumb: "The Quiet Grace",
  },
  {
    slug: "abundant-harmony",
    title: "The Abundant Harmony | Autumn Pumpkin Package",
    description:
      "A generous autumn pumpkin display for larger porches and stepped entries. Heritage varieties, botanicals, and full installation across Greater Victoria.",
    product: {
      name: "The Abundant Harmony",
      description:
        "A generous autumn pumpkin display for larger porches and stepped entries, with heritage varieties, seasonal botanicals, and full installation.",
      price: "899",
      availability: PRE,
    },
    crumb: "The Abundant Harmony",
  },
  {
    slug: "gathered-abundance",
    title: "The Gathered Abundance | Autumn Pumpkin Package",
    description:
      "A statement autumn pumpkin display with grand-prize centerpieces, rare varieties, and professional installation across Victoria and the Saanich Peninsula.",
    product: {
      name: "The Gathered Abundance",
      description:
        "A statement autumn pumpkin display with grand-prize centerpieces, rare varieties, and landscape-level installation.",
      price: "1399",
      availability: PRE,
    },
    crumb: "The Gathered Abundance",
  },
  {
    slug: "estate-collection",
    title: "The Estate Collection | Autumn Pumpkin Package",
    description:
      "Our most involved autumn pumpkin installation: rare specimen varieties, a dedicated project manager, and twice-weekly care for Greater Victoria estates.",
    product: {
      name: "The Estate Collection",
      description:
        "Our most involved autumn pumpkin installation, with rare specimen varieties, a dedicated project manager, and twice-weekly seasonal care.",
      price: "1899",
      availability: PRE,
    },
    crumb: "The Estate Collection",
  },
  {
    slug: "mindful-merchant",
    title: "The Mindful Merchant | Autumn Storefront Styling",
    description:
      "Autumn storefront styling for Victoria businesses. Commercial-grade pumpkins, insured installation, and seasonal maintenance for shops and studios.",
    product: {
      name: "The Mindful Merchant",
      description:
        "Autumn storefront styling for Victoria businesses, with commercial-grade pumpkins, insured installation, and seasonal maintenance.",
      price: "799",
      availability: PRE,
    },
    crumb: "The Mindful Merchant",
  },
  // Winter
  {
    slug: "the-cozy-cabin",
    title: "The Cozy Cabin | Winter Holiday Package",
    description:
      "A warm winter entrance with a fresh evergreen wreath, door swag, and planter greens, styled and installed across Greater Victoria.",
    product: {
      name: "The Cozy Cabin",
      description:
        "A warm winter entrance with a fresh evergreen wreath, door swag, and planter greens, styled and installed on site.",
      price: "474",
      availability: PRE,
    },
    crumb: "The Cozy Cabin",
  },
  {
    slug: "the-winter-wonderland",
    title: "The Winter Wonderland | Winter Holiday Package",
    description:
      "A frost-inspired holiday entrance with premium evergreens, frosted branches, and warm lighting, installed across Greater Victoria.",
    product: {
      name: "The Winter Wonderland",
      description:
        "A frost-inspired holiday entrance with premium evergreens, frosted branches, and warm lighting, installed on site.",
      price: "924",
      availability: PRE,
    },
    crumb: "The Winter Wonderland",
  },
  {
    slug: "the-festive-estate",
    title: "The Festive Estate | Winter Holiday Package",
    description:
      "A holiday display for multi-level entries and wide facades, with coordinated wreaths, railing garland, and planter arrangements across Victoria and the Saanich Peninsula.",
    product: {
      name: "The Festive Estate",
      description:
        "A holiday display for multi-level entries and wide facades, with coordinated wreaths, railing garland, and abundant planter arrangements.",
      price: "1424",
      availability: PRE,
    },
    crumb: "The Festive Estate",
  },
  {
    slug: "the-grand-celebration",
    title: "The Grand Celebration | Winter Holiday Package",
    description:
      "Our most involved holiday installation for estate properties: extensive lighting, garland, and a dedicated project manager with weekly care across Greater Victoria.",
    product: {
      name: "The Grand Celebration",
      description:
        "Our most involved holiday installation for estate properties, with extensive lighting and garland, a dedicated project manager, and weekly seasonal care.",
      price: "1924",
      availability: PRE,
    },
    crumb: "The Grand Celebration",
  },
  {
    slug: "the-business-welcome",
    title: "The Business Welcome | Holiday Storefront Styling",
    description:
      "Holiday styling for Victoria business entrances. A commercial-grade wreath, weatherproof planters, and brand-aligned design, installed and maintained for the season.",
    product: {
      name: "The Business Welcome",
      description:
        "Holiday styling for a Victoria business entrance, with a commercial-grade wreath, weatherproof planters, and brand-aligned design, installed and maintained.",
      price: "799",
      availability: PRE,
    },
    crumb: "The Business Welcome",
  },
  // Spring
  {
    slug: "the-fresh-start",
    title: "The Fresh Start | Spring Styling Package | Victoria",
    description:
      "The Fresh Start: a light spring display of handcrafted blooms, seasonal planters, and natural textures for your Victoria entrance. $474 CAD, designed and installed.",
    product: {
      name: "The Fresh Start",
      description:
        "Light and airy spring refresh with delicate floral touches, seasonal planters, and natural moss and twig elements, professionally placed.",
      price: "474",
      availability: IN,
    },
    crumb: "The Fresh Start",
  },
  {
    slug: "the-garden-gate",
    title: "The Garden Gate | Spring Styling Package | Victoria",
    description:
      "The Garden Gate: an abundant spring display with a designer floral wreath, four seasonal planters, and garden accents for your Victoria home. $924 CAD, fully installed.",
    product: {
      name: "The Garden Gate",
      description:
        "Abundant spring display celebrating renewal and growth, with a 26-inch floral wreath, four seasonal planters, and natural wood and moss accents.",
      price: "924",
      availability: IN,
    },
    crumb: "The Garden Gate",
  },
  {
    slug: "the-botanical-estate",
    title: "The Botanical Estate | Spring Styling | Victoria",
    description:
      "The Botanical Estate: an expansive spring garden display with multiple wreaths, eight luxury planters, and cherry blossom branches for larger Victoria properties. $1,424 CAD.",
    product: {
      name: "The Botanical Estate",
      description:
        "Expansive spring garden aesthetic for larger properties, with multiple wreaths, eight luxury planters, cherry blossom branches, and sculptural garden accents.",
      price: "1424",
      availability: IN,
    },
    crumb: "The Botanical Estate",
  },
  {
    slug: "the-blooming-manor",
    title: "The Blooming Manor | Spring Styling | Victoria",
    description:
      "The Blooming Manor: our most generous spring installation, with custom wreaths, twelve statement planters, lighting, and a dedicated design process. $1,924 CAD, Greater Victoria.",
    product: {
      name: "The Blooming Manor",
      description:
        "Our most generous spring installation for estate properties, with a custom floral wreath collection, twelve statement planters, garden lighting, and a dedicated design process.",
      price: "1924",
      availability: IN,
    },
    crumb: "The Blooming Manor",
  },
  {
    slug: "the-professional-welcome",
    title: "The Professional Welcome | Spring Commercial | Victoria",
    description:
      "The Professional Welcome: spring styling for Victoria storefronts and lobbies, with weatherproof planters, a commercial wreath, and flexible scheduling. $799 CAD, installed.",
    product: {
      name: "The Professional Welcome",
      description:
        "Spring presentation for Victoria businesses, with a commercial wreath, four weatherproof planter displays, brand-appropriate styling, and flexible installation.",
      price: "799",
      availability: IN,
    },
    crumb: "The Professional Welcome",
  },
  // Summer
  {
    slug: "the-coastal-cottage",
    title: "The Coastal Cottage | Summer Styling | Victoria",
    description:
      "The Coastal Cottage: a breezy summer display of shells, driftwood, and sea glass in ocean tones for your Victoria entrance. $474 CAD, designed and installed.",
    product: {
      name: "The Coastal Cottage",
      description:
        "Breezy beach-inspired summer welcome with a nautical wreath, coastal planters, driftwood accents, and sea glass touches in ocean tones.",
      price: "474",
      availability: IN,
    },
    crumb: "The Coastal Cottage",
  },
  {
    slug: "the-island-retreat",
    title: "The Island Retreat | Summer Styling | Victoria",
    description:
      "The Island Retreat: a relaxed summer display with a tropical wreath, four planters, bamboo and rattan accents, and hurricane lanterns for your Victoria home. $924 CAD.",
    product: {
      name: "The Island Retreat",
      description:
        "Relaxed summer aesthetic with tropical-inspired touches, a palm-element wreath, four summer planters, bamboo and rattan accents, and hurricane lanterns.",
      price: "924",
      availability: IN,
    },
    crumb: "The Island Retreat",
  },
  {
    slug: "the-beachside-manor",
    title: "The Beachside Manor | Summer Styling | Victoria",
    description:
      "The Beachside Manor: an expansive coastal summer display with multiple wreaths, eight statement planters, driftwood sculpture, and lanterns for larger Victoria properties. $1,424 CAD.",
    product: {
      name: "The Beachside Manor",
      description:
        "Expansive coastal-luxe summer styling for larger properties, with multiple coastal wreaths, eight statement planters, driftwood sculpture accents, and large hurricane lanterns.",
      price: "1424",
      availability: IN,
    },
    crumb: "The Beachside Manor",
  },
  {
    slug: "the-seaside-estate",
    title: "The Seaside Estate | Summer Styling | Victoria",
    description:
      "The Seaside Estate: our largest summer installation for waterfront homes, with custom coastal wreaths, twelve arrangements, driftwood art, and a dedicated design process. $1,924 CAD.",
    product: {
      name: "The Seaside Estate",
      description:
        "Resort-style summer elegance for waterfront properties, with a custom coastal wreath collection, twelve luxury arrangements, large driftwood installations, and a dedicated design process.",
      price: "1924",
      availability: IN,
    },
    crumb: "The Seaside Estate",
  },
  {
    slug: "the-summer-storefront",
    title: "The Summer Storefront | Commercial Styling | Victoria",
    description:
      "The Summer Storefront: coastal-inspired summer styling for Victoria businesses, with weather-resistant planters and flexible installation. $799 CAD, installed and maintained.",
    product: {
      name: "The Summer Storefront",
      description:
        "Fresh summer presentation for Victoria businesses, with a commercial wreath, four weather-resistant planter displays, coastal-inspired styling, and flexible installation.",
      price: "799",
      availability: IN,
    },
    crumb: "The Summer Storefront",
  },
];

for (const pkg of seasonalPackages) {
  const url = `${SITE}/seasoning/${pkg.slug}`;
  routes.push({
    path: `/seasoning/${pkg.slug}`,
    title: pkg.title,
    description: pkg.description,
    jsonLdBlocks: [
      product({
        name: pkg.product.name,
        description: pkg.product.description,
        price: pkg.product.price,
        availability: pkg.product.availability,
        url,
      }),
      breadcrumb([bcHome, bcSeasonal, { name: pkg.crumb, url }]),
    ],
  });
}

// Seasonal hub pages — each lists its packages (one Product per package) + breadcrumb.
interface SeasonalHub {
  slug: string;
  title: string;
  description: string;
  crumb: string;
  packages: SeasonalEntry[];
}

const bySlug = (s: string) => seasonalPackages.find((p) => p.slug === s)!;

const seasonalHubs: SeasonalHub[] = [
  {
    slug: "fall-pumpkins",
    title: "Autumn Pumpkin Packages | Seasonal Styling",
    description:
      "Heritage pumpkin displays styled and installed across Greater Victoria. Five autumn packages, from intimate porches to estate entries. Join the 2026 waitlist.",
    crumb: "Autumn Pumpkin Packages",
    packages: ["quiet-grace", "abundant-harmony", "gathered-abundance", "estate-collection", "mindful-merchant"].map(bySlug),
  },
  {
    slug: "winter-holiday",
    title: "Winter Holiday Packages | Seasonal Styling",
    description:
      "Fresh evergreen wreaths, garlands, and lighting for the holidays, designed and installed across Greater Victoria. Five winter packages for homes and businesses.",
    crumb: "Winter Holiday Packages",
    packages: ["the-cozy-cabin", "the-winter-wonderland", "the-festive-estate", "the-grand-celebration", "the-business-welcome"].map(bySlug),
  },
  {
    slug: "spring-refresh",
    title: "Spring Refresh Seasonal Packages | Victoria, BC",
    description:
      "Spring floral styling for Victoria homes and businesses. Five thoughtfully composed packages of fresh blooms, garden accents, and natural textures, designed and installed for you.",
    crumb: "Spring Refresh",
    packages: ["the-fresh-start", "the-garden-gate", "the-botanical-estate", "the-blooming-manor", "the-professional-welcome"].map(bySlug),
  },
  {
    slug: "summer-serenity",
    title: "Summer Serenity Seasonal Packages | Victoria, BC",
    description:
      "Coastal summer styling for Victoria homes and businesses. Five packages of driftwood, sea glass, and breezy arrangements, designed and installed to suit your entrance.",
    crumb: "Summer Serenity",
    packages: ["the-coastal-cottage", "the-island-retreat", "the-beachside-manor", "the-seaside-estate", "the-summer-storefront"].map(bySlug),
  },
];

for (const hub of seasonalHubs) {
  const hubUrl = `${SITE}/seasoning/${hub.slug}`;
  const productBlocks = hub.packages.map((pkg) =>
    product({
      name: pkg.product.name,
      description: pkg.product.description,
      price: pkg.product.price,
      availability: pkg.product.availability,
      url: `${SITE}/seasoning/${pkg.slug}`,
    })
  );
  routes.push({
    path: `/seasoning/${hub.slug}`,
    title: hub.title,
    description: hub.description,
    jsonLdBlocks: [
      breadcrumb([bcHome, bcSeasonal, { name: hub.crumb, url: hubUrl }]),
      ...productBlocks,
    ],
  });
}

// ---------------------------------------------------------------------------
// Emit all static-route HTML.
// ---------------------------------------------------------------------------

let count = 0;
for (const route of routes) {
  write(outPathFor(route.path), renderPage(route));
  count++;
}
console.log(`[prerender] wrote ${count} static route pages to dist/`);

// ---------------------------------------------------------------------------
// /areas hub + one static page per neighborhood (existing behavior, preserved).
// ---------------------------------------------------------------------------

let areaCount = 0;

write(
  "areas/index.html",
  renderPage({
    path: "/areas",
    title: "Service Areas",
    description:
      "Bespoke concierge cleaning across Greater Victoria, the Saanich Peninsula, and Oak Bay — from Uplands and Rockland to Sidney and Downtown Victoria.",
    jsonLdBlocks: [
      breadcrumb([bcHome, { name: "Service Areas", url: `${SITE}/areas` }]),
    ],
  })
);
areaCount++;

for (const n of Object.values(neighborhoods)) {
  const canonical = `${SITE}/areas/${n.slug}`;
  write(
    `areas/${n.slug}/index.html`,
    renderPage({
      path: `/areas/${n.slug}`,
      title: `Luxury Cleaning in ${n.name}, Victoria`,
      description: n.metaDescription,
      jsonLdBlocks: [
        service({
          name: `Bespoke Concierge Cleaning in ${n.name}`,
          description: n.metaDescription,
          serviceType: "Luxury House Cleaning & Concierge",
          areaServed: `${n.name}, Victoria, BC`,
          areaServedType: "Place",
          geo: n.geo,
        }),
        breadcrumb([
          bcHome,
          { name: "Service Areas", url: `${SITE}/areas` },
          { name: n.name, url: canonical },
        ]),
      ],
    })
  );
  areaCount++;
}

console.log(`[prerender] wrote ${areaCount} static area pages to dist/areas/`);
