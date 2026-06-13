/**
 * Build-time prerender for AEO / crawlability.
 *
 * For each /areas route, writes dist/areas/<slug>/index.html — a copy of the SPA
 * shell (dist/index.html) with the route's <title>, meta description, canonical,
 * Open Graph/Twitter tags, and Service + BreadcrumbList JSON-LD injected into the
 * raw HTML <head>. Non-JS consumers (AI answer engines, social scrapers, first-pass
 * crawlers) read these static signals directly; the SPA still boots and routes
 * client-side as normal.
 *
 * Runs after `vite build` (see package.json "build"). No headless browser required.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neighborhoods } from "../src/data/neighborhoods";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE = "https://wabisabiservices.ca";
const ORG_ID = `${SITE}/#organization`;
const OG_IMAGE = `${SITE}/og-image.png`;

const template = readFileSync(resolve(DIST, "index.html"), "utf8");

const escAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
// schema.org guidance: escape "<" inside <script type="application/ld+json">
const jsonLd = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

interface PageMeta {
  title: string; // full <title> incl. brand
  description: string;
  canonical: string;
  jsonLdBlocks: unknown[];
  outPath: string; // relative to dist
}

function renderPage(meta: PageMeta): string {
  let html = template;
  const fullTitle = meta.title;

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${fullTitle}</title>`);
  // Replace base description
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${escAttr(meta.description)}" />`
  );
  // Override OG/Twitter title, description, url
  const repl: Array<[RegExp, string]> = [
    [/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:title" content="${escAttr(fullTitle)}" />`],
    [/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:description" content="${escAttr(meta.description)}" />`],
    [/<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/, `<meta property="og:url" content="${meta.canonical}" />`],
    [/<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="twitter:title" content="${escAttr(fullTitle)}" />`],
    [/<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="twitter:description" content="${escAttr(meta.description)}" />`],
    [/<meta\s+name="twitter:url"\s+content="[\s\S]*?"\s*\/?>/, `<meta name="twitter:url" content="${meta.canonical}" />`],
  ];
  for (const [re, val] of repl) html = html.replace(re, val);

  // Inject canonical + JSON-LD before </head>
  const inject =
    `\n    <link rel="canonical" href="${meta.canonical}" />\n    ` +
    meta.jsonLdBlocks.map(jsonLd).join("\n    ") +
    "\n  ";
  html = html.replace("</head>", `${inject}</head>`);
  return html;
}

function write(relPath: string, html: string) {
  const out = resolve(DIST, relPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, "utf8");
}

let count = 0;

// /areas hub
{
  const canonical = `${SITE}/areas`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: canonical },
    ],
  };
  write(
    "areas/index.html",
    renderPage({
      title: "Service Areas | Wabi Sabi Services",
      description:
        "Bespoke concierge cleaning across Greater Victoria, the Saanich Peninsula, Oak Bay, and the Westshore. Discreet, museum-level care for discerning homes.",
      canonical,
      jsonLdBlocks: [breadcrumb],
      outPath: "areas/index.html",
    })
  );
  count++;
}

// One static page per neighborhood
for (const n of Object.values(neighborhoods)) {
  const canonical = `${SITE}/areas/${n.slug}`;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Bespoke Concierge Cleaning in ${n.name}`,
    description: n.metaDescription,
    serviceType: "Luxury House Cleaning & Concierge",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Place", name: `${n.name}, Victoria, BC` },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE}/book`,
      servicePhone: "+1-250-896-5971",
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: `${SITE}/areas` },
      { "@type": "ListItem", position: 3, name: n.name, item: canonical },
    ],
  };
  write(
    `areas/${n.slug}/index.html`,
    renderPage({
      title: `Luxury Cleaning in ${n.name}, Victoria | Wabi Sabi Services`,
      description: n.metaDescription,
      canonical,
      jsonLdBlocks: [service, breadcrumb],
      outPath: `areas/${n.slug}/index.html`,
    })
  );
  count++;
}

console.log(`[prerender] wrote ${count} static area pages to dist/areas/`);
