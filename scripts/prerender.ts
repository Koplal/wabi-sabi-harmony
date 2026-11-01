/**
 * Build-time prerender for AEO / crawlability.
 *
 * For every route, writes dist/<route>/index.html — the SPA shell (dist/index.html)
 * with that route's page body rendered into #root and its <title>, meta description,
 * canonical, Open Graph/Twitter tags, and JSON-LD in the raw HTML <head>. Non-JS
 * consumers (AI answer engines, social scrapers, first-pass crawlers) read the whole
 * page; the SPA still boots as normal. dist/404.html is the same shell with NotFound
 * in it, for every URL outside the route list.
 *
 * Nothing about a page is kept here. Routes come from src/data/routes.ts, and the
 * body and head come from rendering the page itself, so its <SEO> and JSON-LD
 * components are the one source and the raw HTML cannot drift from them.
 *
 * Runs after both `vite build` passes (see package.json "build"): the second one
 * bundles src/entry-server.tsx into dist-ssr, which this script loads. No headless
 * browser or runtime server is involved. The build fails if a route cannot render,
 * has no SEO data, is an indexable route with no H1 (R2-FR-07), or has no date for the
 * sitemap (R2-FR-15).
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ROUTES, type SiteRoute } from "../src/data/routes";
import type { RenderedRoute } from "../src/entry-server";
import { lastmodProblem } from "./verify/lib";
import { INDEXABLE_ROUTES, LASTMOD_FILE, SITE } from "./verify/rules";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const EMPTY_ROOT = '<div id="root"></div>';
/** Nothing in the route list matches this, so the router shows NotFound. */
const MISSING_PATH = "/404";
/** The head tags that name a page's own URL. */
const OWN_URL_TAGS = /\s*<(?:link[^>]*rel="canonical"|meta[^>]*(?:property="og:url"|name="twitter:url"))[^>]*>/g;

const template = readFileSync(resolve(DIST, "index.html"), "utf8");
if (!template.includes(EMPTY_ROOT)) {
  throw new Error("[prerender] dist/index.html already holds a page. Run npm run build, not this script alone.");
}

// The bundle reads this at runtime, and without it Node would load React's development build.
process.env.NODE_ENV ??= "production";
const { builtOn, GOOGLE_REVIEWS_URL, GOOGLE_SHARE_URL, render } = (await import(
  pathToFileURL(resolve(ROOT, "dist-ssr/entry-server.js")).href
)) as typeof import("../src/entry-server");

// Home LCP is the hero background image (src/pages/Home.tsx). Resolve the build-hashed asset and
// preload it (home route only) so the fetch starts during initial HTML parse, ahead of the styles
// that use it. The hash changes every build, so glob it rather than hardcode; skip gracefully if
// absent.
const heroPreloadTag = (() => {
  try {
    const hero = readdirSync(resolve(DIST, "assets")).find(
      (f) => f.startsWith("hero-image-") && f.endsWith(".jpg")
    );
    if (!hero) {
      console.warn("[prerender] hero-image asset not found; skipping LCP preload");
      return "";
    }
    return `<link rel="preload" as="image" href="/assets/${hero}" fetchpriority="high" />`;
  } catch {
    console.warn("[prerender] dist/assets unreadable; skipping LCP preload");
    return "";
  }
})();

/** index.html's tags for what every page sets through <SEO>, which would otherwise appear twice. */
const SHELL_HEAD_TAGS = [
  /<title>[\s\S]*?<\/title>/,
  /<meta\s+(?:name="description"|property="og:\w+"|name="twitter:\w+")\s+content="[^"]*"\s*\/?>/g,
  /<!-- (?:Open Graph \/ Facebook|Twitter) -->/g,
];

const shell = SHELL_HEAD_TAGS.reduce((html, tag) => html.replace(tag, ""), template).replace(/\n\s*(?=\n)/g, "");

/** Stops the build on a page that should never ship (R2-FR-05, R2-FR-07). */
function assertComplete({ path, utility }: SiteRoute, { html, helmet }: RenderedRoute) {
  const problems: string[] = [];
  if (!/<title[^>]*>[^<]/.test(helmet.title.toString())) problems.push("no title");
  if (!helmet.meta.toString().includes('name="description"')) problems.push("no meta description");
  if (!helmet.link.toString().includes('rel="canonical"')) problems.push("no canonical");
  if (!utility && !/<h1[\s>]/.test(html)) problems.push("no H1");
  if (html.includes('aria-busy="true"') || html.includes("<!--$?-->") || html.includes("<!--$!-->")) problems.push("the loading fallback is in the HTML");
  if (problems.length > 0) throw new Error(`[prerender] ${path}: ${problems.join(", ")}`);
}

// All replacements use function replacers so that "$" in the page ("$$-$$$" in JSON-LD, prices in
// the copy) is inserted literally. String.replace treats "$$" in a string replacement as special.
function pageHtml({ html, helmet }: RenderedRoute, path?: string): string {
  const headTags = [helmet.title, helmet.meta, helmet.link, helmet.script].map((tags) => tags.toString());
  if (path === "/") headTags.push(heroPreloadTag);
  const head = headTags.filter(Boolean).join("\n    ");
  // main.tsx attaches only where data-route matches the URL, and useToday first renders data-built-on.
  const routeAttribute = path ? ` data-route="${path}"` : "";
  return shell
    .replace(EMPTY_ROOT, () => `<div id="root"${routeAttribute} data-built-on="${builtOn}">${html}</div>`)
    .replace("</head>", () => `  ${path ? head : head.replace(OWN_URL_TAGS, "")}\n  </head>`);
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

// ---------------------------------------------------------------------------
// Emit one page per route. Utility routes build too, in their empty-cart state, because the
// catch-all that served them is gone and Stripe returns to /cart and /checkout-success.
// ---------------------------------------------------------------------------

for (const route of ROUTES) {
  const page = await render(route.path);
  assertComplete(route, page);
  write(outPathFor(route.path), pageHtml(page, route.path));
}
const utilityPages = ROUTES.filter((route) => route.utility).length;
console.log(`[prerender] wrote ${ROUTES.length - utilityPages} pages and ${utilityPages} utility pages to dist/`);

// ---------------------------------------------------------------------------
// One file answers every URL outside the route list, so it has no URL of its own to name, and
// with no data-route main.tsx renders over it. React Router matches paths in any case, so /FAQ
// lands here and still shows the FAQ page once the script runs.
// ---------------------------------------------------------------------------

const notFound = await render(MISSING_PATH);
assertComplete({ path: MISSING_PATH }, notFound);
write("404.html", pageHtml(notFound));
console.log("[prerender] wrote 404.html to dist/");

// ---------------------------------------------------------------------------
// The sitemap comes from the route list, with dates from the tracked file. A route with no date
// stops the build, and so does a date whose route has gone.
// ---------------------------------------------------------------------------

const lastmods = JSON.parse(readFileSync(resolve(ROOT, LASTMOD_FILE), "utf8")) as Record<string, string>;
const dateProblems = [
  ...INDEXABLE_ROUTES.flatMap((route) => lastmodProblem(route, lastmods[route]) ?? []),
  ...Object.keys(lastmods).filter((route) => !INDEXABLE_ROUTES.includes(route)).map((route) => `${route} is not an indexable route`),
];
if (dateProblems.length > 0) throw new Error(`[prerender] ${LASTMOD_FILE}: ${dateProblems.join(", ")}`);

const sitemapUrls = INDEXABLE_ROUTES.map((route) => `  <url>\n    <loc>${SITE}${route}</loc>\n    <lastmod>${lastmods[route]}</lastmod>\n  </url>`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join("\n")}\n</urlset>\n`);
console.log(`[prerender] wrote ${sitemapUrls.length} URLs to dist/sitemap.xml`);

// ---------------------------------------------------------------------------
// llms.txt is copied from public/ as it stands, so its visible link is swapped
// here. With VITE_GOOGLE_MAPS_URL unset the file does not change.
// ---------------------------------------------------------------------------

const llmsPath = resolve(DIST, "llms.txt");
writeFileSync(
  llmsPath,
  readFileSync(llmsPath, "utf8").split(GOOGLE_SHARE_URL).join(GOOGLE_REVIEWS_URL),
  "utf8"
);
