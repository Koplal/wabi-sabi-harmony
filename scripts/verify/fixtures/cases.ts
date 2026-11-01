/**
 * Self-test: every rule runs against a good fixture and at least one bad fixture.
 * The good fixtures are built from rules.ts in memory. The private ban terms here are
 * made-up placeholders, and never real ones.
 */
import { formatFinding, type Finding, htmlFileOfRoute, median, rawHeadingsOf, rawLinksOf, rawTextOf, SourceText, textWords, undoMsysPath } from "../lib";
import {
  ABSENT,
  BANS,
  BONDING_LINE,
  BROWSER,
  CLARITY_PROJECT_ID,
  CONSULTATION,
  COPY_PAGES,
  FAQ_FILES,
  FAQ_SECTIONS,
  FREE_ESTIMATES,
  GA_EVENTS,
  INDEXABLE_ROUTES,
  LIVE,
  MANIFEST,
  MASK_ATTRIBUTE,
  MASK_FILES,
  MISSING_PAGE,
  NAP,
  NO_BIOHAZARD,
  ORG,
  PARENT,
  PEARLY_IDS,
  PRICE_FILES,
  RANK_ROUTES,
  REQUIRED,
  REQUIRED_ORDER,
  SITE,
  STAFF_LINE,
  STRIPE_RETURN,
  UTILITY_ROUTES,
} from "../rules";
import { parsePrivateBans, SOURCE_CHECKS, type ScanFile, type SourceCtx } from "../source-checks";
import { DIST_CHECKS, type DistCtx, type LcpField, type LcpLab, type LcpRoute, rankEntryFromHtml, type RankBaseline, type RenderBaseline, type RenderEntry, type RouteManifest } from "../dist-checks";
import {
  BROWSER_RULES,
  type CartStep,
  checkAreas,
  checkCart,
  checkClarity,
  checkConsole,
  checkGa,
  checkH1,
  checkHead as checkBrowserHead,
  checkHydrate,
  checkLcpRuns,
  checkMissingUrl,
  checkNav,
  checkRank as checkBrowserRank,
  checkRawPage,
  checkRendered,
  type HydrationSnapshot,
  type LcpMeasure,
  type PageSnapshot,
} from "../browser-rules";
import { checkFile, checkHost, checkMissing, checkRaw, checkRedirect, checkUtility, type Chain } from "../live-rules";

type Files = Map<string, string>;

const PLACEHOLDER_BANS = JSON.stringify(["zzplaceholder-term", "qq\\.fixture\\s+limit\\b"]);
const PLACEHOLDER_HIT = "QQ.fixture   limit";
const PLACEHOLDER_MISS = "qqXfixture limit";

// ---------------------------------------------------------------------------
// Good source fixture
// ---------------------------------------------------------------------------

const lineFor = (path: string, text: string) => (path.endsWith(".txt") ? `${text}\n` : `<p>${text}</p>\n`);

function faqQuestions(): string[] {
  const middle: Record<string, string[]> = {
    "Pricing & Scheduling": ["What is your cancellation policy?", "What are your hours?", "What is your arrival window?", "Fixture pricing question?"],
    "Products & Safety": ["What is the Eco-Luxury Package?", "Is there anything you don't clean?", "Fixture product question?", "Fixture pet question?"],
  };
  return FAQ_SECTIONS.flatMap((section) => {
    const rest = middle[section.heading] ?? Array.from({ length: section.count - 1 }, (_, index) => `Fixture ${section.count} ${section.heading} ${index}?`);
    return [section.first, ...rest];
  });
}

function goodSource(): Files {
  const files: Files = new Map();
  const add = (path: string, text: string) => files.set(path, (files.get(path) ?? "") + text);

  for (const entry of REQUIRED) {
    if (entry.text === CONSULTATION || entry.text === FREE_ESTIMATES) continue;
    for (const path of entry.files) add(path, lineFor(path, entry.text));
  }
  for (const entry of REQUIRED_ORDER) {
    for (const path of entry.files) for (const text of entry.texts) add(path, lineFor(path, text));
  }

  add(FAQ_FILES.data, `<p>Start with a ${CONSULTATION}. ${FREE_ESTIMATES}</p>\n`);
  add(FAQ_FILES.data, "<p>Our Eco-Luxury Package is the fully non-toxic, organic tier.</p>\n");
  add(FAQ_FILES.data, "<p>Are you insured and bonded?</p>\n");
  for (const question of faqQuestions()) add(FAQ_FILES.data, `{ question: ${JSON.stringify(question)} },\n`);

  add("src/pages/TermsOfService.tsx", "<p>We cannot clean biohazards, or handle hazardous materials.</p>\n");
  add("src/pages/TermsOfService.tsx", "<li><strong>Eco-Luxury Package:</strong> Premium services using exclusively organic, non-toxic products</li>\n");

  for (const section of FAQ_SECTIONS) add(FAQ_FILES.page, `{ heading: ${JSON.stringify(section.heading)}, count: ${section.count} },\n`);

  add("src/components/Layout.tsx", '<a href="tel:+12508965971">(250) 896-5971</a><a href="mailto:hello@wabisabiservices.ca">Email</a>\n');
  add("src/data/organization.ts", `const founder = "${PEARLY_IDS[0]}";\n`);
  add("src/data/neighborhoods.ts", '"Oceanfront condo glass kept clear, with exterior window cleaning arranged through trusted partners.",\n');
  add("src/data/neighborhoods.ts", '"Copper accents, metal roofing, and Ipe decking define the street.",\n');
  add("src/data/neighborhoods.ts", '"Waterproof finishes stay dry.",\n');

  for (const { file, event } of GA_EVENTS) {
    add(file, `try { const { error } = await send(); if (error) throw error; track("${event}"); } catch (error) { show(); }\n`);
  }
  for (const file of MASK_FILES) add(file, `<div ${MASK_ATTRIBUTE}>\n<div><form onSubmit={save}><input /></form></div>\n</div>\n`);

  add(`${PRICE_FILES.seasonalDir}FixturePackage.tsx`, `const packageItem = { id: 'fixture-package', name: 'The Fixture Package', price: 399, description: "x" };\n`);
  add(PRICE_FILES.catalogue, `const CATALOGUE = {\n  "fixture-package": { name: "The Fixture Package", price: 399 },\n};\n`);
  return files;
}

interface SourceOptions {
  scoped?: boolean;
  scope?: string[];
  privateBans?: string | null;
  tracked?: Array<{ path: string; text: string }>;
  commits?: Array<{ hash: string; message: string; patch: string }>;
  base?: Record<string, string>;
  sibling?: string[];
}

function sourceCtx(files: Files, options: SourceOptions = {}): SourceCtx {
  const all = new Map<string, ScanFile>();
  for (const [path, text] of files) all.set(path, { path, text: new SourceText(text) });
  const inScope = (path: string) => !options.scope || options.scope.some((item) => path === item || path.startsWith(`${item}/`));
  return {
    files: [...all.values()].filter((file) => inScope(file.path)),
    all,
    scoped: options.scoped ?? Boolean(options.scope),
    inScope,
    read: (path) => files.get(path),
    privateBans: parsePrivateBans(options.privateBans === null ? undefined : options.privateBans ?? PLACEHOLDER_BANS, "SEO_PRIVATE_BANS is not set"),
    git: {
      tracked: () => options.tracked ?? [...files].map(([path, text]) => ({ path, text })),
      commits: () => options.commits ?? [],
      baseText: (path) => options.base?.[path],
    },
    sibling: options.sibling ?? [],
  };
}

// ---------------------------------------------------------------------------
// Good dist fixture
// ---------------------------------------------------------------------------

const rh = 'data-rh="true"';

function orgNode(): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ORG.types,
    "@id": ORG.id,
    ...ORG.exact,
    areaServed: [
      { "@type": "Place", name: ORG.firstArea },
      ...Array.from({ length: ORG.areaCount - 1 }, (_, index) => ({ "@type": "Place", name: `Fixture ${index}` })),
    ],
    sameAs: [ORG.instagram],
  };
  for (const key of ORG.keptKeys) node[key] = `fixture ${key}`;
  return node;
}

const script = (data: unknown) => `<script type="application/ld+json" ${rh}>${JSON.stringify(data)}</script>`;
const parentNode = {
  "@type": "Organization",
  "@id": PARENT.id,
  name: PARENT.name,
  legalName: PARENT.legalName,
  subOrganization: PARENT.subOrganization.map((id) => ({ "@id": id })),
};

/** Real routes for the source files the required strings name. */
function fileRoutes(): Map<string, string> {
  const routes = new Map([
    ["src/pages/Home.tsx", "/"],
    ["src/pages/About.tsx", "/about"],
    ["src/pages/Services.tsx", "/services"],
    ["src/pages/Ritual.tsx", "/ritual"],
    ["src/pages/KeyTakeaways.tsx", "/key-takeaways"],
    ["src/pages/TermsOfService.tsx", "/terms-of-service"],
    ["src/pages/ClientAgreement.tsx", "/client-agreement"],
    ["src/pages/Contact.tsx", "/contact"],
    ["src/pages/Privacy.tsx", "/privacy"],
    ["src/pages/FAQ.tsx", "/faq"],
    ["src/pages/services/Cleaning.tsx", "/services/cleaning"],
    ["src/pages/services/Errands.tsx", "/services/errands"],
    ["src/pages/blog/March2026.tsx", "/blog/march-2026"],
    ["src/pages/seasonal/QuietGrace.tsx", "/seasoning/quiet-grace"],
  ]);
  const spare = INDEXABLE_ROUTES.filter((route) => route.startsWith("/seasoning/") && route !== "/seasoning/quiet-grace");
  for (const { files } of [...REQUIRED, ...REQUIRED_ORDER]) {
    for (const file of files) {
      if (file.startsWith(PRICE_FILES.seasonalDir) && !routes.has(file)) routes.set(file, spare.shift() as string);
    }
  }
  return routes;
}

const FILE_ROUTES = fileRoutes();

/** Escapes text the way React does in server-rendered HTML. */
const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;");

const isOnRoute = (route: string) => (path: string) => (path === FAQ_FILES.data ? "/faq" : FILE_ROUTES.get(path)) === route;

const requiredOn = (route: string) => [
  ...REQUIRED.filter((entry) => entry.text !== CONSULTATION && entry.text !== FREE_ESTIMATES && entry.files.some(isOnRoute(route))).map((entry) => entry.text),
  ...REQUIRED_ORDER.filter((entry) => entry.files.some(isOnRoute(route))).flatMap((entry) => entry.texts),
];

const FAQ_ANSWERS = ["Fixture answer one.", "Fixture answer with a person's apostrophe & an ampersand."];
const FILLER_WORDS = 100;
const filler = (count: number) => Array.from({ length: count }, (_, index) => `fixtureword${index}`).join(" ");
const faqAnswer = (answer: string) => `<div class="pb-4 pt-0">${escapeHtml(answer)}</div>`;

function bodyHtml(route: string): string {
  const lines = requiredOn(route).map((text) => `<p class="text-lg">${escapeHtml(text)}</p>`);
  if (route === "/faq") lines.push(`<p>Start with a ${CONSULTATION}. ${FREE_ESTIMATES}</p>`, ...FAQ_ANSWERS.map(faqAnswer));
  return `<div id="root"><nav><a href="/about">About</a><a href="/contact?ref=nav#top">Contact</a></nav><main><h1 class="font-serif">Heading <span>for</span> ${route}</h1><p>${filler(FILLER_WORDS)}</p>${lines.join("")}</main></div>`;
}

function notFoundHtml(): string {
  return `<!doctype html><html><head><title>Page Not Found | ${MISSING_PAGE.brand}</title>
<meta name="robots" content="noindex,follow" ${rh} />
${script(orgNode())}
</head><body><div id="root"><main><h1>This page could not be found</h1><a href="/">Return Home</a></main></div></body></html>`;
}

function pageHtml(route: string, extraBlocks: unknown[] = []): string {
  const url = route === "/" ? `${SITE}/` : `${SITE}${route}`;
  const blocks = [orgNode(), ...(route === "/" ? [parentNode] : []), ...extraBlocks];
  return `<!doctype html><html><head><title>Fixture ${route} | Wabi Sabi Services</title>
<meta name="description" content="Description of ${route}" ${rh} />
<meta property="og:url" content="${url}" ${rh} />
<meta name="twitter:url" content="${url}" ${rh} />
<link rel="canonical" href="${url}" ${rh} />
${blocks.map(script).join("\n")}
</head><body>${bodyHtml(route)}</body></html>`;
}

/** When each source file last changed. The dates differ between files, as real ones do. */
const changedOn = (file: string) => `2026-0${(file.length % 9) + 1}-15`;

/** The date a sitemap should give a route: the later of the files its copy comes from. */
function sitemapDate(route: string): string {
  if (route.startsWith(COPY_PAGES.areaPrefix)) return changedOn(COPY_PAGES.areaFile);
  const page = `src/pages/${LISTED_PAGES[route]}.tsx`;
  return [page, COPY_PAGES.aliases[page]].filter(Boolean).map(changedOn).sort().pop() as string;
}

const sitemapEntry = (route: string) => `<url><loc>${route === "/" ? `${SITE}/` : `${SITE}${route}`}</loc><lastmod>${sitemapDate(route)}</lastmod></url>`;

function goodDist(): Files {
  const files: Files = new Map();
  const product = { "@type": "Product", name: "The Fixture Package", offers: { price: "399" } };
  for (const route of INDEXABLE_ROUTES) {
    const path = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
    files.set(path, pageHtml(route, route === "/seasoning/quiet-grace" ? [product] : []));
  }
  files.set("sitemap.xml", INDEXABLE_ROUTES.map(sitemapEntry).join("\n"));
  files.set("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  files.set("llms.txt", `Call ${NAP.phones[0]} or ${NAP.email}. See ${SITE}/book\n`);
  files.set("assets/index.js", `const a="${NAP.phones[3]}";const b="mailto:${NAP.email}";const c="${PEARLY_IDS[0]}";`);
  files.set(MISSING_PAGE.file, notFoundHtml());
  return files;
}

const ALL_ROUTES = [...INDEXABLE_ROUTES, ...UTILITY_ROUTES];
const AREA_ROUTES = INDEXABLE_ROUTES.filter((route) => route.startsWith("/areas/"));
const moduleOf = (file: string) => file.replace(/^src\/pages\//, "").replace(/\.tsx$/, "");

/** Release 1's router: one plain line per page. The harness reads this shape until R2-10. */
const plainPageRouter = [...FILE_ROUTES]
  .map(([file, route], index) => `const Page${index} = lazy(() => import("./pages/${moduleOf(file)}"));\n<Route path="${route}" element={<Page${index} />} />`)
  .join("\n");

/** The router R2-10 must leave. It writes no path and no page, so only the list can place a page. */
const listRouter = `import { ROUTES } from "./data/routes";
const pages = import.meta.glob("./pages/**/*.tsx");
{ROUTES.map(({ path, page }) => (<Route key={path} path={path} element={<LazyPage load={pages[page]} />} />))}`;

const pageOfRoute = new Map([...FILE_ROUTES].map(([file, route]) => [route, moduleOf(file)]));
const LISTED_PAGES = Object.fromEntries(
  ALL_ROUTES.filter((route) => !AREA_ROUTES.includes(route)).map((route, index) => [route, pageOfRoute.get(route) ?? `Fixture${index}`])
);
const LIST_MANIFEST: RouteManifest = { listed: ALL_ROUTES, areas: AREA_ROUTES, pages: LISTED_PAGES };

const faqSource = `export const faqItems = [${FAQ_ANSWERS.map((answer) => `{ question: "Fixture?", answer: ${JSON.stringify(answer)} }`).join(", ")}];`;
const pageSource = `<SEO title="Fixture /seasoning/quiet-grace" description="Description of /seasoning/quiet-grace" />
const packageItem = { id: 'fixture-package', name: 'The Fixture Package', price: 399 };`;

const LCP_RUNS = [3000, 3100, 3200, 3300, 3400];
const R1_LCP: LcpRoute = { runsMs: LCP_RUNS, medianMs: 3200 };
const goodLab = (): LcpLab => ({
  measuredOn: BROWSER.lcp.liveFrom,
  target: SITE,
  browser: "fixture",
  settings: BROWSER.lcp.settings,
  routes: Object.fromEntries(BROWSER.lcp.routes.map((route) => [route, R1_LCP])),
});
const goodField: LcpField = { p75Ms: 3000, samples: 40, from: BROWSER.lcp.liveFrom, to: "2026-11-20", readOn: "2026-11-21" };

/** The good fixture as a browser would have rendered it. */
function renderBaselineOf(files: Files): RenderBaseline {
  const routes: RenderBaseline["routes"] = {};
  for (const route of INDEXABLE_ROUTES) {
    const html = files.get(htmlFileOfRoute(route)) as string;
    const text = rawTextOf(html);
    routes[route] = { finalPath: route, h1: rawHeadingsOf(html)[0], words: textWords(text).length, links: [...new Set(rawLinksOf(html))], text };
  }
  for (const route of UTILITY_ROUTES) routes[route] = { finalPath: route, h1: "Utility", words: 1, links: [], text: "Utility" };
  return { capturedFrom: "fixture", viewport: { width: 1280, height: 900 }, routes, mobileLcp: { lab: goodLab(), field: null, note: "fixture" } };
}

interface DistOptions {
  expectClarity?: string;
  page?: string;
  baseline?: RankBaseline;
  /** null means there is no baseline file. */
  renderBaseline?: RenderBaseline | null;
  editRenderBaseline?: (baseline: RenderBaseline) => void;
  /** Source files to replace. undefined means the file does not exist. */
  sources?: Record<string, string | undefined>;
  manifest?: RouteManifest;
  baselineDrift?: string[];
  privateBans?: string | null;
  /** Commit dates to use in place of changedOn. undefined means git has none for that file. */
  lastCommits?: Record<string, string | undefined>;
}

function distCtx(files: Files, options: DistOptions = {}): DistCtx {
  const pages: RankBaseline["pages"] = {};
  const good = goodDist();
  for (const route of RANK_ROUTES) pages[route] = rankEntryFromHtml(good.get(htmlFileOfRoute(route)) as string);
  const sources: Record<string, string | undefined> = {
    "src/App.tsx": listRouter,
    "src/pages/seasonal/QuietGrace.tsx": options.page ?? pageSource,
    [FAQ_FILES.data]: faqSource,
    ...options.sources,
  };
  const renderBaseline = options.renderBaseline === null ? undefined : options.renderBaseline ?? renderBaselineOf(good);
  if (renderBaseline) options.editRenderBaseline?.(renderBaseline);
  return {
    files,
    routes: INDEXABLE_ROUTES,
    baseline: options.baseline ?? { capturedFrom: "fixture", pages },
    renderBaseline,
    baselineDrift: options.baselineDrift,
    manifest: options.manifest ?? LIST_MANIFEST,
    privateBans: parsePrivateBans(options.privateBans === null ? undefined : options.privateBans ?? PLACEHOLDER_BANS, "SEO_PRIVATE_BANS is not set"),
    readSource: (path) => sources[path],
    lastCommitDate: (path) => (options.lastCommits && path in options.lastCommits ? options.lastCommits[path] : changedOn(path)),
    sourcePages: () => ["src/pages/seasonal/QuietGrace.tsx"],
    expectClarity: options.expectClarity,
  };
}

// ---------------------------------------------------------------------------
// Case tables
// ---------------------------------------------------------------------------

interface Case {
  rule: string;
  name: string;
  run: () => Finding[];
  expect: "pass" | "fail";
  /** Text that must never appear in the output for this case. */
  hidden?: string;
}

const cases: Case[] = [];

const editFile = (files: Files, path: string, text: string) => files.set(path, (files.get(path) ?? "") + text);

function sourceCase(rule: string, name: string, expect: Case["expect"], edit: (files: Files) => void, options: SourceOptions = {}, hidden?: string) {
  cases.push({
    rule,
    name,
    expect,
    hidden,
    run: () => {
      const files = goodSource();
      edit(files);
      return SOURCE_CHECKS[rule](sourceCtx(files, options));
    },
  });
}

function distCase(rule: string, name: string, expect: Case["expect"], edit: (files: Files) => void, options: DistOptions = {}, hidden?: string) {
  cases.push({
    rule,
    name,
    expect,
    hidden,
    run: () => {
      const files = goodDist();
      edit(files);
      return DIST_CHECKS[rule](distCtx(files, options));
    },
  });
}

const replaceIn = (files: Files, path: string, from: string, to: string) => {
  const text = files.get(path) ?? "";
  if (!text.includes(from)) throw new Error(`fixture text not found in ${path}: ${from}`);
  files.set(path, text.split(from).join(to));
};

for (const rule of Object.keys(SOURCE_CHECKS)) sourceCase(rule, "good fixture", "pass", () => undefined);
for (const rule of Object.keys(DIST_CHECKS)) distCase(rule, "good fixture", "pass", () => undefined);

const HOME = "src/pages/Home.tsx";
const TERMS = "src/pages/TermsOfService.tsx";
const BLOG = "src/pages/blog/March2026.tsx";

const banExamples: Record<string, string[]> = {
  "BAN-02": ["medical-grade", "Medical &amp; Wellness"],
  "BAN-03": ["Digital Organization"],
  "BAN-04": ["24/7"],
  "BAN-05": ["eco-certified", "certified pet-safe", "harsh\n   chemicals", "free from VOCs"],
  "BAN-09": ["professionally trained"],
  "BAN-10": ["you&apos;ll work with the same professional", "paired with the same"],
  "BAN-11": ["NDA-Grade"],
  "BAN-12": ["2 ladder steps", "no ladders"],
  "BAN-13": ["interior and exterior", "interior/exterior", "ground level"],
  "BAN-14": ["2-hour window"],
  "BAN-15": ["after-hours"],
  "BAN-16": ["accurate estimates during booking"],
  "BAN-17": ["due upon"],
  "BAN-18": ["any aspect of our service", "any aspect"],
  "BAN-19": ["travel fees may apply"],
  "BAN-20": ["Join 2026 Waitlist", "2026 waitlist"],
  "BAN-21": ["magazine-perfect", "perfection isn't sustainable", "hidden keys", "studio/1BR"],
};
for (const [rule, examples] of Object.entries(banExamples)) {
  examples.forEach((example) => sourceCase(rule, `bans "${example.replace(/\s+/g, " ")}"`, "fail", (files) => editFile(files, HOME, `<p>${example}</p>\n`)));
}

sourceCase("BAN-01", "bans the word on another page", "fail", (files) => editFile(files, HOME, "<p>biohazard</p>\n"));
sourceCase("BAN-01", "bans the word in a new FAQ question", "fail", (files) => editFile(files, FAQ_FILES.data, 'question: "Do you clean biohazards?",\n'));
sourceCase("BAN-01", "bans a second copy of the FAQ sentence", "fail", (files) => editFile(files, FAQ_FILES.data, `<p>${NO_BIOHAZARD}</p>\n`));
sourceCase("BAN-01", "bans other Terms wording", "fail", (files) => editFile(files, TERMS, "<p>We handle biohazards.</p>\n"));
sourceCase("BAN-01", "allows the FAQ sentence on its own", "pass", (files) => replaceIn(files, TERMS, "clean biohazards, or ", ""));
sourceCase("BAN-01", "allows clean biohazards in Terms on its own", "pass", (files) => replaceIn(files, FAQ_FILES.data, NO_BIOHAZARD, "Fixture."));
sourceCase("BAN-05", "VOCs stays case-sensitive", "pass", (files) => editFile(files, HOME, "<p>vocs</p>\n"));
sourceCase("BAN-06", "bans the claim in a plain sentence", "fail", (files) => editFile(files, HOME, "<p>We use non-toxic products.</p>\n"));
sourceCase("BAN-06", "the exception needs the tier's exact name", "fail", (files) => editFile(files, HOME, "<p>Our eco-luxury products are non-toxic.</p>\n"));
sourceCase("BAN-06", "the exception needs the same sentence", "fail", (files) => editFile(files, HOME, "<p>See the Eco-Luxury Package. Everything is non-toxic.</p>\n"));
sourceCase("BAN-06", "allows the Eco-Luxury sentence", "pass", (files) => editFile(files, HOME, "<p>The Eco-Luxury Package is fully non-toxic.</p>\n"));
sourceCase("BAN-07", "bans the short claim", "fail", (files) => editFile(files, HOME, "<p>We are fully insured and bonded.</p>\n"));
sourceCase("BAN-07", "allows the bonding line and the question", "pass", (files) => editFile(files, HOME, `<p>${BONDING_LINE}</p><p>Are you insured and bonded?</p>\n`));
sourceCase("BAN-08", "matches an escaped regex, and hides the text", "fail", (files) => editFile(files, HOME, `<p>${PLACEHOLDER_HIT}</p>\n`), {}, PLACEHOLDER_HIT);
sourceCase("BAN-08", "matches a plain term, and hides the text", "fail", (files) => editFile(files, HOME, "<p>zzplaceholder-term</p>\n"), {}, "zzplaceholder-term");
sourceCase("BAN-08", "does not treat the regex as plain text or a wildcard", "pass", (files) => editFile(files, HOME, `<p>${PLACEHOLDER_MISS}</p>\n`));
sourceCase("BAN-08", "fails an unscoped run with no ban file", "fail", () => undefined, { privateBans: null });
sourceCase("BAN-08", "fails an unscoped run with a bad ban file", "fail", () => undefined, { privateBans: "[]" });
sourceCase("BAN-08", "is skipped on a scoped run with no ban file", "pass", () => undefined, { privateBans: null, scope: [HOME] });
sourceCase("BAN-22", "bans DIY cleaning content in a post", "fail", (files) => editFile(files, BLOG, "<li>White vinegar</li>\n"));
sourceCase("BAN-22", "applies only to its scope", "pass", (files) => editFile(files, HOME, "<li>White vinegar</li>\n"));
sourceCase("BAN-23", "bans a template term", "fail", (files) => editFile(files, "src/pages/Privacy.tsx", "<p>We use Zapier.</p>\n"));
sourceCase("BAN-23", "bans advertising outside the Clarity sentence", "fail", (files) => editFile(files, "src/pages/Privacy.tsx", "<p>We measure our advertising.</p>\n"));
sourceCase("BAN-23", "allows advertising in the Clarity sentence", "pass", (files) => editFile(files, "src/pages/Privacy.tsx", "<p>Microsoft may also use this data, including for advertising.</p>\n"));
sourceCase("BAN-23", "does not read an address as an ad", "pass", (files) => editFile(files, "src/pages/Privacy.tsx", "<p>Your name or an address.</p>\n"));
sourceCase("BAN-23", "bans a mention of Google Maps", "fail", (files) => editFile(files, "src/pages/Privacy.tsx", "<p>The Google Maps embeds on our pages.</p>\n"));
sourceCase("BAN-23", "bans a Maps identifier", "fail", (files) => editFile(files, "src/pages/Privacy.tsx", "<a href={GOOGLE_MAPS_URL}>Find us</a>\n"));
sourceCase("BAN-23", "allows heatmaps in the Clarity paragraph", "pass", (files) => editFile(files, "src/pages/Privacy.tsx", "<p>Clarity produces heatmaps and session replays.</p>\n"));
sourceCase("BAN-23", "allows heatmaps only once", "fail", (files) => editFile(files, "src/pages/Privacy.tsx", "<p>Clarity produces heatmaps.</p>\n<p>We also review heatmaps.</p>\n"));
sourceCase("BAN-23", "applies only to its scope", "pass", (files) => editFile(files, HOME, "<p>We use Zapier.</p>\n"));
const PACKAGE_PAGE = "src/pages/seasonal/GrandCelebration.tsx";
sourceCase("BAN-24", "bans a roofline promise on a package page", "fail", (files) => editFile(files, PACKAGE_PAGE, "<p>Built for long rooflines.</p>\n"));
sourceCase("BAN-24", "bans work at height on a package page", "fail", (files) => editFile(files, PACKAGE_PAGE, "<p>A crew handles the heights.</p>\n"));
sourceCase("BAN-24", "bans wiring work on a package page", "fail", (files) => editFile(files, PACKAGE_PAGE, "<p>We handle the wiring.</p>\n"));
sourceCase("BAN-24", "bans lights in mature trees on a package page", "fail", (files) => editFile(files, PACKAGE_PAGE, "<p>Lights for mature trees.</p>\n"));
sourceCase("BAN-24", "allows the no roof or eave line", "pass", (files) => editFile(files, PACKAGE_PAGE, "<p>We do no roof or eave work.</p>\n"));
sourceCase("BAN-24", "applies only to its scope", "pass", (files) => editFile(files, HOME, "<p>Built for long rooflines.</p>\n"));

sourceCase("S-REQ", "reports a missing string", "fail", (files) => replaceIn(files, HOME, STAFF_LINE, "Fixture."));
sourceCase("S-REQ", "reports a file that does not exist", "fail", (files) => files.delete("src/pages/Privacy.tsx"));
sourceCase("S-REQ", "reports a missing heading", "fail", (files) => replaceIn(files, "src/pages/Ritual.tsx", "4. Communication", "Fixture"));
sourceCase("S-REQ", "reports headings out of order", "fail", (files) => {
  replaceIn(files, "src/pages/Ritual.tsx", "1. Consultation", "SWAP");
  replaceIn(files, "src/pages/Ritual.tsx", "2. Consistency", "1. Consultation");
  replaceIn(files, "src/pages/Ritual.tsx", "SWAP", "2. Consistency");
});
sourceCase("S-REQ", "normalises JSX whitespace", "pass", (files) => replaceIn(files, HOME, STAFF_LINE, "Every team member is background-checked\n      and vetted.{\" \"}\n      WorkSafeBC registered."));
sourceCase("S-REQ", "reads through inline tags", "pass", (files) => replaceIn(files, HOME, STAFF_LINE, "<strong>Every team member</strong> is background-checked and vetted. WorkSafeBC registered."));
sourceCase("S-REQ", "ignores files out of scope", "pass", (files) => replaceIn(files, HOME, STAFF_LINE, "Fixture."), { scope: ["src/pages/About.tsx"] });

sourceCase("S-CONSULT", "reports a line with no follow-up", "fail", (files) => editFile(files, HOME, `<p>A ${CONSULTATION}.</p>\n`));
sourceCase("S-CONSULT", "reports a follow-up past 250 characters", "fail", (files) => editFile(files, HOME, `<p>A ${CONSULTATION}. ${"word ".repeat(60)}${FREE_ESTIMATES}</p>\n`));
sourceCase("S-CONSULT", "reports a follow-up in the next paragraph", "fail", (files) => editFile(files, HOME, `<p>A ${CONSULTATION}.</p><p>${FREE_ESTIMATES}</p>\n`));
sourceCase("S-CONSULT", "reads across JSX lines and inline tags", "pass", (files) => {
  const [first, second] = [CONSULTATION.slice(0, 40), CONSULTATION.slice(40)];
  editFile(files, HOME, `<p>A <strong>${first}\n     ${second.trimStart()}</strong>. ${FREE_ESTIMATES}</p>\n`);
});

sourceCase("S-FAQ", "reports counts that do not sum to the items", "fail", (files) => editFile(files, FAQ_FILES.data, '{ question: "One more?" },\n'));
sourceCase("S-FAQ", "reports a section count", "fail", (files) => {
  replaceIn(files, FAQ_FILES.page, '"Pricing & Scheduling", count: 5', '"Pricing & Scheduling", count: 4');
  replaceIn(files, FAQ_FILES.page, '"Products & Safety", count: 5', '"Products & Safety", count: 6');
});
sourceCase("S-FAQ", "reports a section that starts in the wrong place", "fail", (files) => replaceIn(files, FAQ_FILES.data, FAQ_SECTIONS[3].first, "Fixture first?"));
sourceCase("S-FAQ", "reports a new item out of place", "fail", (files) => replaceIn(files, FAQ_FILES.data, "What are your hours?", "Fixture hours?"));

sourceCase("S-NAP", "reports the retired number", "fail", (files) => editFile(files, HOME, "<p>778-404-7357</p>\n"));
sourceCase("S-NAP", "reports a tel: form that is not allowed", "fail", (files) => editFile(files, HOME, '<a href="tel:+1-250-896-5971">Call</a>\n'));
sourceCase("S-NAP", "reports another email", "fail", (files) => editFile(files, HOME, "<p>info@wabisabiservices.ca</p>\n"));
sourceCase("S-PEARLY", "reports the name outside its files", "fail", (files) => editFile(files, HOME, "<p>Pearly's</p>\n"));
sourceCase("S-PEARLY", "reports the domain outside its files", "fail", (files) => editFile(files, HOME, '<a href="https://www.pearlys.ca">x</a>\n'));
sourceCase("S-GA", "reports an event in the catch path", "fail", (files) => {
  files.set(GA_EVENTS[0].file, `try { await send(); } catch (error) { track("${GA_EVENTS[0].event}"); }\n`);
});
sourceCase("S-GA", "reports an event fired twice", "fail", (files) => editFile(files, GA_EVENTS[0].file, `track("${GA_EVENTS[0].event}");\n`));
sourceCase("S-GA", "reports an event in the catch path after a throw", "fail", (files) => {
  files.set(GA_EVENTS[0].file, `try { if (error) throw error; } catch (error) { track("${GA_EVENTS[0].event}"); }\nconst later = "catch";\n`);
});
sourceCase("S-GA", "reports a missing event", "fail", (files) => files.set(GA_EVENTS[1].file, "try { await send(); } catch {}\n"));
sourceCase("S-EXTGLASS", "reports a glass and salt claim", "fail", (files) => editFile(files, "src/data/neighborhoods.ts", '"Salt-spray removal from window glass.",\n'));
sourceCase("S-ROOF", "reports a roof claim", "fail", (files) => editFile(files, "src/data/neighborhoods.ts", '"Moss removed from the roof.",\n'));
sourceCase("S-ROOF", "reports a chimney claim", "fail", (files) => editFile(files, FAQ_FILES.data, '"Chimney care included.",\n'));
sourceCase("S-ABSENT", "reports a review that must be gone", "fail", (files) => editFile(files, HOME, `<p>${ABSENT[0].texts[0]}</p>\n`));
sourceCase("S-ABSENT", "reports a blog string in its post", "fail", (files) => editFile(files, BLOG, "<h3>Bathroom Brilliance</h3>\n"));
sourceCase("S-ABSENT", "keeps a blog string to its post", "pass", (files) => editFile(files, "src/pages/services/Cleaning.tsx", "<li>Oven cleaning</li>\n"));
sourceCase("S-ABSENT", "reports an exterior line anywhere in scope", "fail", (files) => editFile(files, HOME, "<li>Salt-air care for marble.</li>\n"));
sourceCase("S-MASK", "reports a form with no wrapper", "fail", (files) => files.set(MASK_FILES[0], "<div><form></form></div>\n"));
sourceCase("S-MASK", "reports the attribute on the form itself", "fail", (files) => files.set(MASK_FILES[1], `<form ${MASK_ATTRIBUTE}></form>\n`));
sourceCase("S-MASK", "reports a wrapper closed before the form", "fail", (files) => files.set(MASK_FILES[2], `<div ${MASK_ATTRIBUTE}></div><form></form>\n`));
sourceCase("S-MASK", "reports a wrapper closed inside the form", "fail", (files) => files.set(MASK_FILES[3], `<div ${MASK_ATTRIBUTE}><form></div></form>\n`));
sourceCase("S-PRICES", "reports a price that differs", "fail", (files) => replaceIn(files, PRICE_FILES.catalogue, "price: 399", "price: 499"));
sourceCase("S-PRICES", "reports a name that differs", "fail", (files) => replaceIn(files, PRICE_FILES.catalogue, "The Fixture Package", "The Other Package"));
sourceCase("S-PRICES", "reports an item missing from the catalogue", "fail", (files) => replaceIn(files, PRICE_FILES.catalogue, '"fixture-package"', '"other-package"'));

const HIDDEN_TERM = "zzplaceholder-term";
const leakCommit = (fields: Partial<{ message: string; patch: string }>) => [{ hash: "abcdef1234", message: "Neutral", patch: "", ...fields }];
sourceCase("S-LEAK", "reports a tracked file, and hides the text", "fail", () => undefined, { tracked: [{ path: "docs/notes.md", text: `Line one\n${HIDDEN_TERM}\n` }] }, HIDDEN_TERM);
sourceCase("S-LEAK", "reports a commit message, and hides the text", "fail", () => undefined, { tracked: [], commits: leakCommit({ message: HIDDEN_TERM }) }, HIDDEN_TERM);
sourceCase("S-LEAK", "reports a commit patch, and hides the text", "fail", () => undefined, { tracked: [], commits: leakCommit({ patch: `+${PLACEHOLDER_HIT}` }) }, PLACEHOLDER_HIT);
sourceCase("S-LEAK", "fails with no ban file, scoped or not", "fail", () => undefined, { privateBans: null, scope: [HOME] });

const SHARED = "our team arrives on time and leaves your home calm and bright";
sourceCase("S-OVERLAP", "reports new copy found on the sibling site", "fail", (files) => editFile(files, "src/data/organization.ts", `const text = "${SHARED}";\n`), { sibling: [SHARED] });
sourceCase("S-OVERLAP", "reports overlapping JSX copy", "fail", (files) => editFile(files, HOME, `<p>${SHARED}</p>\n`), { sibling: [SHARED] });
sourceCase("S-OVERLAP", "allows copy that was already there", "pass", (files) => editFile(files, HOME, `<p>${SHARED}</p>\n`), { sibling: [SHARED], base: { [HOME]: `<p>${SHARED}</p>` } });
sourceCase("S-OVERLAP", "allows a VERBATIM string", "pass", () => undefined, { sibling: [STAFF_LINE, BONDING_LINE] });
sourceCase("S-OVERLAP", "exempts the privacy page", "pass", (files) => editFile(files, "src/pages/Privacy.tsx", `<p>${SHARED}</p>\n`), { sibling: [SHARED] });
sourceCase("S-OVERLAP", "ignores class names", "pass", (files) => editFile(files, HOME, '<p className="a b c d e f g h i j">x</p>\n'), { sibling: ["a b c d e f g h i j"] });

const HOME_HTML = "index.html";
const ABOUT_HTML = "about/index.html";
const orgBlock = (html: string) => {
  const block = /<script[^>]*>(\{[^<]*#organization"[^<]*)<\/script>/.exec(html)?.[1];
  if (!block) throw new Error("fixture org block not found");
  return block;
};
const editOrg = (files: Files, path: string, edit: (node: Record<string, unknown>) => void) => {
  const html = files.get(path) as string;
  const block = orgBlock(html);
  const node = JSON.parse(block) as Record<string, unknown>;
  edit(node);
  files.set(path, html.replace(block, () => JSON.stringify(node)));
};
const editAllOrgs = (files: Files, edit: (node: Record<string, unknown>) => void) => {
  for (const path of files.keys()) if (path.endsWith(".html")) editOrg(files, path, edit);
};

distCase("D-PARSE", "reports a block that does not parse", "fail", (files) => replaceIn(files, ABOUT_HTML, "</head>", `<script type="application/ld+json" ${rh}>{bad</script></head>`));
const addBlock = (files: Files, path: string, data: unknown) => replaceIn(files, path, "</head>", `${script(data)}</head>`);
distCase("D-DUP", "reports two breadcrumbs", "fail", (files) => {
  addBlock(files, ABOUT_HTML, { "@type": "BreadcrumbList", itemListElement: [1] });
  addBlock(files, ABOUT_HTML, { "@type": "BreadcrumbList", itemListElement: [2] });
});
distCase("D-DUP", "reports two nodes for one @id", "fail", (files) => addBlock(files, ABOUT_HTML, { "@type": "Organization", "@id": ORG.id, name: "x" }));
distCase("D-DUP", "reports two Services with one name", "fail", (files) => {
  addBlock(files, ABOUT_HTML, { "@type": "Service", name: "One", url: "a" });
  addBlock(files, ABOUT_HTML, { "@type": "Service", name: "One", url: "b" });
});
distCase("D-DUP", "reports identical blocks, ignoring key order", "fail", (files) => {
  addBlock(files, ABOUT_HTML, { "@type": "WebPage", name: "One" });
  addBlock(files, ABOUT_HTML, { name: "One", "@type": "WebPage" });
});
distCase("D-DUP", "allows many Products with different names", "pass", (files) => {
  addBlock(files, ABOUT_HTML, { "@type": "Product", name: "One" });
  addBlock(files, ABOUT_HTML, { "@type": "Product", name: "Two" });
});
distCase("D-HEAD", "reports a tag with no marker", "fail", (files) => replaceIn(files, ABOUT_HTML, `<link rel="canonical" href="${SITE}/about" ${rh} />`, `<link rel="canonical" href="${SITE}/about" />`));
distCase("D-HEAD", "reads a marker after a > in a quoted value", "pass", (files) => replaceIn(files, ABOUT_HTML, 'content="Description of /about"', 'content="Before > after"'));
distCase("D-HEAD", "reports a JSON-LD block with no marker", "fail", (files) => replaceIn(files, ABOUT_HTML, `<script type="application/ld+json" ${rh}>`, '<script type="application/ld+json">'));
distCase("D-ORG", "reports a sameAs short link", "fail", (files) => editAllOrgs(files, (node) => (node.sameAs = [ORG.instagram, "https://share.google/abc"])));
distCase("D-ORG", "reports a sibling site in sameAs", "fail", (files) => editAllOrgs(files, (node) => (node.sameAs = [ORG.instagram, "https://www.pearlys.ca/"])));
distCase("D-ORG", "reports a missing key", "fail", (files) => editAllOrgs(files, (node) => delete node.openingHours));
distCase("D-ORG", "reports the area list", "fail", (files) => editAllOrgs(files, (node) => (node.areaServed = [{ name: "Greater Victoria, BC" }])));
distCase("D-ORG", "reports a node that differs between pages", "fail", (files) => editOrg(files, ABOUT_HTML, (node) => (node.name = "Other")));
distCase("D-ORG", "reports a node missing from a page", "fail", (files) => files.set(ABOUT_HTML, "<html><head></head></html>"));
distCase("D-ORG", "reports hasMap that is not Maps", "fail", (files) => editAllOrgs(files, (node) => (node.hasMap = "https://example.com/")));
distCase("D-ORG", "allows a Maps URL in sameAs and hasMap", "pass", (files) => editAllOrgs(files, (node) => {
  node.sameAs = [ORG.instagram, `${ORG.mapsPrefix}place/fixture`];
  node.hasMap = `${ORG.mapsPrefix}place/fixture`;
}));
distCase("D-PARENT", "reports a missing node", "fail", (files) => replaceIn(files, HOME_HTML, `"@id":"${PARENT.id}","name"`, `"@id":"${SITE}/#other","name"`));
distCase("D-PARENT", "reports the node on another page", "fail", (files) => addBlock(files, ABOUT_HTML, parentNode));
distCase("D-PARENT", "reports a missing legalName", "fail", (files) => replaceIn(files, HOME_HTML, `"legalName":"${PARENT.legalName}"`, '"legalName":"Other"'));
distCase("D-PARENT", "reports a missing subOrganization", "fail", (files) => replaceIn(files, HOME_HTML, '"subOrganization"', '"other"'));
distCase("D-NAP", "reports the retired number in HTML", "fail", (files) => replaceIn(files, ABOUT_HTML, "</head>", "<!-- 778-404-7357 --></head>"));
distCase("D-NAP", "reports another email in llms.txt", "fail", (files) => editFile(files, "llms.txt", "info@wabisabiservices.ca\n"));
distCase("D-NAP", "reports the retired number in JS", "fail", (files) => editFile(files, "assets/index.js", 'const d="(778) 404-7357";'));
distCase("D-NAP", "reports a tel: value in JS", "fail", (files) => editFile(files, "assets/index.js", 'const d="tel:+17784047357";'));
distCase("D-NAP", "ignores a bare tel: scheme in library code", "pass", (files) => editFile(files, "assets/index.js", 'const d=/^(?:tel:|mailto:)/;const e="tel:";'));
distCase("D-PEARLY", "reports the domain in an href", "fail", (files) => replaceIn(files, ABOUT_HTML, "</head>", '<a href="https://www.pearlys.ca/">x</a></head>'));
distCase("D-PEARLY", "reports the domain in sameAs", "fail", (files) => editOrg(files, ABOUT_HTML, (node) => (node.sameAs = ["https://www.pearlys.ca/"])));
distCase("D-PEARLY", "reports another @id", "fail", (files) => addBlock(files, ABOUT_HTML, { "@type": "Thing", "@id": "https://www.pearlys.ca/#other" }));
distCase("D-PEARLY", "reports a link in JS", "fail", (files) => editFile(files, "assets/index.js", 'const d={href:"https://www.pearlys.ca/#jalene"};'));
distCase("D-PEARLY", "reports the domain in llms.txt", "fail", (files) => editFile(files, "llms.txt", "https://www.pearlys.ca\n"));
distCase("D-HOST", "reports www", "fail", (files) => replaceIn(files, ABOUT_HTML, `property="og:url" content="${SITE}/about"`, 'property="og:url" content="https://www.wabisabiservices.ca/about"'));
distCase("D-HOST", "reports http", "fail", (files) => replaceIn(files, "sitemap.xml", `${SITE}/about`, "http://wabisabiservices.ca/about"));
distCase("D-HOST", "reports the robots Sitemap line", "fail", (files) => replaceIn(files, "robots.txt", SITE, "https://www.wabisabiservices.ca"));
distCase("D-HOST", "ignores third-party hosts", "pass", (files) => editFile(files, "llms.txt", "http://example.com https://www.instagram.com/x\n"));
distCase("D-TODO", "reports TODO in HTML", "fail", (files) => replaceIn(files, ABOUT_HTML, "</head>", "<!-- TODO --></head>"));
distCase("D-TODO", "reports TODO in llms.txt", "fail", (files) => editFile(files, "llms.txt", "TODO\n"));
distCase("D-TODO", "reports the marker in JS", "fail", (files) => editFile(files, "assets/index.js", "const d='TODO(Justin)';"));
distCase("D-TODO", "allows a library TODO in JS", "pass", (files) => editFile(files, "assets/index.js", "// TODO fix\n"));
distCase("D-ROUTES", "reports a missing route", "fail", (files) => files.delete("privacy/index.html"));
distCase("D-ROUTES", "reports an unexpected route", "fail", (files) => files.set("extra/index.html", pageHtml("/extra")));
distCase("D-ROUTES", "reports a canonical on another route", "fail", (files) => replaceIn(files, ABOUT_HTML, `<link rel="canonical" href="${SITE}/about"`, `<link rel="canonical" href="${SITE}/"`));
distCase("D-ROUTES", "reports a shared title", "fail", (files) => replaceIn(files, ABOUT_HTML, "<title>Fixture /about", "<title>Fixture /book"));
distCase("D-ROUTES", "reports a shared description", "fail", (files) => replaceIn(files, ABOUT_HTML, 'content="Description of /about"', 'content="Description of /book"'));
const noindexPage = (route: string) => pageHtml(route).replace("</head>", `<meta name="robots" content="noindex,follow" ${rh} /></head>`);
distCase("D-ROUTES", "allows the file R2-20 builds for a utility route", "pass", (files) => files.set("cart/index.html", noindexPage("/cart")));
distCase("D-ROUTES", "reports a utility file with no noindex", "fail", (files) => files.set("cart/index.html", pageHtml("/cart")));
distCase("D-SITEMAP", "reports a missing URL", "fail", (files) => replaceIn(files, "sitemap.xml", sitemapEntry("/privacy"), ""));
distCase("D-SITEMAP", "reports a utility route", "fail", (files) => editFile(files, "sitemap.xml", `<url><loc>${SITE}/cart</loc></url>`));
const withLastmods = (files: Files, dateOf: (index: number) => string) => {
  let index = 0;
  files.set("sitemap.xml", (files.get("sitemap.xml") as string).replace(/<lastmod>[^<]*<\/lastmod>/g, () => `<lastmod>${dateOf(index++)}</lastmod>`));
};
const ABOUT_LASTMOD = `<lastmod>${sitemapDate("/about")}</lastmod>`;
const withAboutLastmod = (files: Files, text: string) => replaceIn(files, "sitemap.xml", `${SITE}/about</loc>${ABOUT_LASTMOD}`, `${SITE}/about</loc>${text}`);
const OLD_DATE = "2025-11-22";
distCase("D-SITEMAP", "reports one page dated before its last commit", "fail", (files) => withAboutLastmod(files, `<lastmod>${OLD_DATE}</lastmod>`));
distCase("D-SITEMAP", "reports stale dates that differ, as in Release 1", "fail", (files) => withLastmods(files, (index) => (index % 2 === 0 ? OLD_DATE : "2025-12-01")));
distCase("D-SITEMAP", "reports one lastmod on every URL", "fail", (files) => withLastmods(files, () => "2026-10-31"));
distCase("D-SITEMAP", "reports one lastmod with a time on every URL", "fail", (files) => withLastmods(files, (index) => `2026-10-31T00:00:${String(index % 60).padStart(2, "0")}Z`));
distCase("D-SITEMAP", "reports one page stamped later than its last commit, as a build date reads", "fail", (files) => withAboutLastmod(files, "<lastmod>2026-10-31</lastmod>"));
distCase("D-SITEMAP", "reports a lastmod in the future", "fail", (files) => withAboutLastmod(files, "<lastmod>2999-01-01</lastmod>"));
distCase("D-SITEMAP", "reports a URL with no lastmod", "fail", (files) => withAboutLastmod(files, ""));
distCase("D-SITEMAP", "reads a date written with a time", "pass", (files) => withAboutLastmod(files, `<lastmod>${sitemapDate("/about")}T08:00:00Z</lastmod>`));
distCase("D-SITEMAP", "allows many pages on one date when each really changed then", "pass", (files) => withLastmods(files, () => "2026-10-31"), { lastCommits: Object.fromEntries(INDEXABLE_ROUTES.flatMap((route) => [`src/pages/${LISTED_PAGES[route]}.tsx`, COPY_PAGES.areaFile, FAQ_FILES.data].map((file) => [file, "2026-10-31"]))) });
distCase("D-SITEMAP", "dates a page from its data file when that changed later", "fail", () => undefined, { lastCommits: { [FAQ_FILES.data]: "2026-10-01" } });
distCase("D-SITEMAP", "dates every area page from their shared data", "fail", () => undefined, { lastCommits: { [COPY_PAGES.areaFile]: "2026-10-01" } });
distCase("D-SITEMAP", "reports a source file git has no date for", "fail", () => undefined, { lastCommits: { "src/pages/About.tsx": undefined } });
distCase("D-SITEMAP", "reports a route with no source file", "fail", () => undefined, { manifest: { ...LIST_MANIFEST, pages: { "/about": "About" } } });
distCase("D-PARITY", "reports a title that differs", "fail", () => undefined, { page: pageSource.replace('title="Fixture', 'title="Other') });
distCase("D-PARITY", "reports a description that differs", "fail", () => undefined, { page: pageSource.replace('description="Description', 'description="Other') });
distCase("D-PARITY", "reports a package price that differs", "fail", () => undefined, { page: pageSource.replace("price: 399", "price: 499") });
distCase("D-RANK", "reports a changed title", "fail", (files) => replaceIn(files, HOME_HTML, "<title>Fixture", "<title>Changed"));
distCase("D-RANK", "reports a changed description", "fail", (files) => replaceIn(files, "services/cleaning/index.html", 'content="Description of', 'content="Changed'));
distCase("D-RANK", "reports a changed canonical", "fail", (files) => replaceIn(files, "areas/oak-bay/index.html", `<link rel="canonical" href="${SITE}/areas/oak-bay"`, `<link rel="canonical" href="${SITE}/areas"`));
distCase("D-RANK", "ignores other pages", "pass", (files) => replaceIn(files, ABOUT_HTML, "<title>Fixture", "<title>Changed"));
distCase("D-CLARITY", "reports the real ID in an unset build", "fail", (files) => editFile(files, "assets/index.js", `const id="${CLARITY_PROJECT_ID}";`));
distCase("D-CLARITY", "reports a missing expected ID", "fail", () => undefined, { expectClarity: "fixtureclarityid" });
distCase("D-CLARITY", "finds an expected ID", "pass", (files) => editFile(files, "assets/index.js", 'const id="fixtureclarityid";'), { expectClarity: "fixtureclarityid" });

const AREA_HTML = "areas/sidney/index.html";
const FAQ_HTML = "faq/index.html";
const TERMS_HTML = "terms-of-service/index.html";
const BLOG_HTML = "blog/march-2026/index.html";
const addToBody = (files: Files, path: string, html: string) => replaceIn(files, path, "</main>", `${html}</main>`);
const setBody = (files: Files, path: string, body: string) => {
  files.set(path, (files.get(path) as string).replace(/<body>[\s\S]*<\/body>/, () => `<body>${body}</body>`));
};
/** What every route looked like in Release 1. */
const headOnly = (files: Files) => {
  for (const path of files.keys()) if (path.endsWith("index.html")) setBody(files, path, '<div id="root"></div>');
};
const dropFiller = (files: Files, path: string, count: number) => replaceIn(files, path, `<p>${filler(count)} `, "<p>");

distCase("D-RAW", "reports head-only pages, as in Release 1", "fail", headOnly);
distCase("D-RAW", "reports a page with no H1", "fail", (files) => replaceIn(files, AREA_HTML, '<h1 class="font-serif">', '<h2 class="font-serif">'));
distCase("D-RAW", "reports an H1 that differs from the rendered one", "fail", (files) => replaceIn(files, AREA_HTML, "Heading <span>", "Other <span>"));
distCase("D-RAW", "allows 95 percent of the rendered words", "pass", (files) => dropFiller(files, AREA_HTML, 5));
distCase("D-RAW", "reports fewer than 95 percent of the rendered words", "fail", (files) => dropFiller(files, AREA_HTML, 6));
distCase("D-RAW", "reports other words in place of the page's", "fail", (files) => replaceIn(files, AREA_HTML, filler(20), "padding ".repeat(20).trim()));
distCase("D-RAW", "counts no words from a script in the body", "fail", (files) => setBody(files, AREA_HTML, `<div id="root"></div><script>${filler(FILLER_WORDS)}</script>`));
distCase("D-RAW", "counts no words from the head", "fail", (files) => {
  setBody(files, AREA_HTML, '<div id="root"><h1>Heading for /areas/sidney</h1></div>');
  replaceIn(files, AREA_HTML, "</head>", `<meta name="keywords" content="${filler(FILLER_WORDS)}"></head>`);
});
distCase("D-RAW", "allows more words than the rendered page, as closed FAQ answers add", "pass", (files) => addToBody(files, AREA_HTML, `<div>${"extra ".repeat(500)}</div>`));
distCase("D-RAW", "reports a rendered link missing from raw HTML", "fail", (files) => replaceIn(files, AREA_HTML, '<a href="/about">About</a>', "<span>About</span>"));
distCase("D-RAW", "reports no baseline file", "fail", () => undefined, { renderBaseline: null });
distCase("D-RAW", "reports an indexable route missing from the baseline", "fail", () => undefined, { editRenderBaseline: (baseline) => delete baseline.routes["/about"] });
distCase("D-RAW", "reports a utility route missing from the baseline", "fail", () => undefined, { editRenderBaseline: (baseline) => delete baseline.routes["/cart"] });
distCase("D-RAW", "reports a route with no built HTML", "fail", (files) => files.delete(AREA_HTML));
const baselineNotes = (baselineDrift: string[]): Finding[] => {
  const notes: string[] = [];
  DIST_CHECKS["D-RAW"]({ ...distCtx(goodDist(), { baselineDrift }), note: (message) => notes.push(message) });
  return notes.map((message) => ({ rule: "D-RAW", message }));
};
cases.push({ rule: "D-RAW", name: "warns when pages changed after the baseline", expect: "fail", run: () => baselineNotes(["src/pages/About.tsx"]) });
cases.push({ rule: "D-RAW", name: "stays quiet when no page changed", expect: "pass", run: () => baselineNotes([]) });

distCase("D-FAQRAW", "reports head-only pages, as in Release 1", "fail", headOnly);
distCase("D-FAQRAW", "reports a missing answer", "fail", (files) => replaceIn(files, FAQ_HTML, faqAnswer(FAQ_ANSWERS[0]), ""));
distCase("D-FAQRAW", "reports an answer found only in JSON-LD", "fail", (files) => {
  replaceIn(files, FAQ_HTML, faqAnswer(FAQ_ANSWERS[0]), "");
  addBlock(files, FAQ_HTML, { "@type": "FAQPage", text: FAQ_ANSWERS[0] });
});
distCase("D-FAQRAW", "reports no answers in the data", "fail", () => undefined, { sources: { [FAQ_FILES.data]: "export const faqItems = [];" } });
distCase("D-FAQRAW", "reports a page that is not built", "fail", (files) => files.delete(FAQ_HTML));
const withExtraAnswer = (answer: string) => ({ sources: { [FAQ_FILES.data]: faqSource.replace("];", `, { question: "Extra?", answer: ${answer} }];`) } });
distCase("D-FAQRAW", "reports an answer in a template literal", "fail", () => undefined, withExtraAnswer("`Fixture answer one.`"));
distCase("D-FAQRAW", "reports an answer joined from pieces", "fail", () => undefined, withExtraAnswer('"Fixture answer one." + " And more."'));

const editLcp = (edit: (lcp: RenderBaseline["mobileLcp"]) => void): DistOptions => ({ editRenderBaseline: (baseline) => edit(baseline.mobileLcp) });
const lcpNotes = (options: DistOptions): Finding[] => {
  const notes: string[] = [];
  DIST_CHECKS["D-LCP"]({ ...distCtx(goodDist(), options), note: (message) => notes.push(message) });
  return notes.map((message) => ({ rule: "D-LCP", message }));
};
const withLab = (fields: Partial<LcpLab>) => editLcp((lcp) => void (lcp.lab = { ...goodLab(), ...fields }));
const withField = (fields: Partial<LcpField>) => editLcp((lcp) => void (lcp.field = { ...goodField, ...fields }));
const withRouteLcp = (entry: LcpRoute) => withLab({ routes: { ...goodLab().routes, [BROWSER.lcp.routes[0]]: entry } });
distCase("D-LCP", "leaves the missing field figure to the owner", "pass", () => undefined, editLcp((lcp) => void (lcp.field = null)));
cases.push({ rule: "D-LCP", name: "warns while no field figure is saved", expect: "fail", run: () => lcpNotes(editLcp((lcp) => void (lcp.field = null))) });
cases.push({ rule: "D-LCP", name: "stays quiet once a field figure is saved", expect: "pass", run: () => lcpNotes(withField({})) });
distCase("D-LCP", "allows a field figure with its samples and dates", "pass", () => undefined, withField({}));
distCase("D-LCP", "reports R1 not measured", "fail", () => undefined, editLcp((lcp) => void (lcp.lab = null)));
distCase("D-LCP", "reports no baseline file", "fail", () => undefined, { renderBaseline: null });
distCase("D-LCP", "reports a figure from before R1 went live", "fail", () => undefined, withLab({ measuredOn: "2026-10-01" }));
distCase("D-LCP", "reports a date it cannot read", "fail", () => undefined, withLab({ measuredOn: "soon" }));
distCase("D-LCP", "reports a figure dated later than today", "fail", () => undefined, withLab({ measuredOn: "2999-01-01" }));
distCase("D-LCP", "reports a figure measured on a preview", "fail", () => undefined, withLab({ target: "https://preview.vercel.app" }));
distCase("D-LCP", "reports a figure with no target", "fail", () => undefined, withLab({ target: "" }));
distCase("D-LCP", "reports settings a deployment could not repeat", "fail", () => undefined, withLab({ settings: { ...BROWSER.lcp.settings, cpuSlowdown: 1 } }));
distCase("D-LCP", "reports a route with no figure", "fail", () => undefined, withLab({ routes: {} }));
distCase("D-LCP", "reports too few runs", "fail", () => undefined, withRouteLcp({ runsMs: [3000], medianMs: 3000 }));
distCase("D-LCP", "reports a run of zero", "fail", () => undefined, withRouteLcp({ runsMs: [0, ...LCP_RUNS.slice(1)], medianMs: 3200 }));
distCase("D-LCP", "reports a median that is not its runs' median", "fail", () => undefined, withRouteLcp({ runsMs: LCP_RUNS, medianMs: 1000 }));
distCase("D-LCP", "reports a field figure with no sample count", "fail", () => undefined, withField({ samples: 0 }));
distCase("D-LCP", "reports a field figure with no value", "fail", () => undefined, withField({ p75Ms: 0 }));
distCase("D-LCP", "reports a field period from before R1", "fail", () => undefined, withField({ from: "2026-10-01" }));
distCase("D-LCP", "reports a field reading dated before its period ends", "fail", () => undefined, withField({ readOn: "2026-11-01" }));
distCase("D-LCP", "reports a field date it cannot read", "fail", () => undefined, withField({ to: "soon" }));

distCase("D-NOFALLBACK", "reports head-only pages, as in Release 1", "fail", headOnly);
distCase("D-NOFALLBACK", "reports the loading fallback", "fail", (files) => setBody(files, ABOUT_HTML, '<div id="root"><div class="min-h-screen" aria-busy="true"></div></div>'));
distCase("D-NOFALLBACK", "reports a pending Suspense boundary", "fail", (files) => addToBody(files, ABOUT_HTML, '<!--$?--><template id="B:0"></template><!--/$-->'));
distCase("D-NOFALLBACK", "reports a boundary that failed on the server", "fail", (files) => addToBody(files, ABOUT_HTML, "<!--$!--><div></div><!--/$-->"));
distCase("D-NOFALLBACK", "allows a finished Suspense boundary", "pass", (files) => addToBody(files, ABOUT_HTML, "<!--$--><div>Done</div><!--/$-->"));
distCase("D-NOFALLBACK", "checks the 404 page too", "fail", (files) => setBody(files, MISSING_PAGE.file, '<div id="root"></div>'));

distCase("D-404", "reports no 404 page, as in Release 1", "fail", (files) => files.delete(MISSING_PAGE.file));
distCase("D-404", "reports no noindex", "fail", (files) => replaceIn(files, MISSING_PAGE.file, `<meta name="robots" content="noindex,follow" ${rh} />`, ""));
distCase("D-404", "reports a home canonical", "fail", (files) => replaceIn(files, MISSING_PAGE.file, "</head>", `<link rel="canonical" href="${SITE}/" ${rh} /></head>`));
distCase("D-404", "reports no brand", "fail", (files) => replaceIn(files, MISSING_PAGE.file, `| ${MISSING_PAGE.brand}`, ""));
distCase("D-404", "reports no H1 without JavaScript", "fail", (files) => setBody(files, MISSING_PAGE.file, '<div id="root"><a href="/">Home</a></div>'));
distCase("D-404", "reports no way home without JavaScript", "fail", (files) => setBody(files, MISSING_PAGE.file, '<div id="root"><h1>Not found</h1></div>'));

const listedWith = (edit: (routes: string[]) => string[]): RouteManifest => ({ ...LIST_MANIFEST, listed: edit(ALL_ROUTES) });
const NO_LIST: RouteManifest = { listError: "the file does not exist", areas: AREA_ROUTES };
/** The router as in Release 1: plain paths, and one generated path per neighbourhood. */
const plainRouter = ALL_ROUTES.filter((route) => !AREA_ROUTES.includes(route))
  .map((route) => `<Route path="${route}" element={<Page />} />`)
  .join("\n");
const areaRouter = "{Object.values(neighborhoods).map((n) => (<Route key={n.slug} path={`/areas/${n.slug}`} element={<Area data={n} />} />))}";
const releaseOneRouter = `${plainRouter}\n${areaRouter}`;
/** Runs with the given router and keeps only what the rule says about it. */
const routerCase = (name: string, expect: Case["expect"], app: string, manifest: RouteManifest = NO_LIST) =>
  cases.push({
    rule: "D-MANIFEST",
    name,
    expect,
    run: () => DIST_CHECKS["D-MANIFEST"](distCtx(goodDist(), { manifest, sources: { "src/App.tsx": app } })).filter((finding) => finding.file === MANIFEST.appFile),
  });

distCase("D-MANIFEST", "reports no route list, as in Release 1", "fail", () => undefined, { manifest: NO_LIST, sources: { "src/App.tsx": releaseOneRouter } });
distCase("D-MANIFEST", "reports a route list that cannot be loaded", "fail", () => undefined, { manifest: { listError: "it could not be loaded", areas: AREA_ROUTES } });
distCase("D-MANIFEST", "reports a route missing from the list", "fail", () => undefined, { manifest: listedWith((routes) => routes.filter((route) => route !== "/about")) });
distCase("D-MANIFEST", "reports a utility route missing from the list", "fail", () => undefined, { manifest: listedWith((routes) => routes.filter((route) => route !== "/cart")) });
distCase("D-MANIFEST", "reports a listed route the harness does not know", "fail", () => undefined, { manifest: listedWith((routes) => [...routes, "/extra"]) });
distCase("D-MANIFEST", "reports a route only the router has", "fail", () => undefined, { sources: { "src/App.tsx": `${listRouter}\n<Route path="/extra" element={<Extra />} />` } });
distCase("D-MANIFEST", "reports a neighbourhood with no route", "fail", () => undefined, { manifest: { ...LIST_MANIFEST, areas: [...AREA_ROUTES, "/areas/new-area"] } });
distCase("D-MANIFEST", "reports an area route with no neighbourhood", "fail", () => undefined, { manifest: { ...LIST_MANIFEST, areas: AREA_ROUTES.slice(1) } });
distCase("D-MANIFEST", "reports neighbourhood data that cannot be loaded", "fail", () => undefined, { manifest: { listed: ALL_ROUTES, pages: LISTED_PAGES } });
distCase("D-MANIFEST", "reports list entries that name no page file", "fail", () => undefined, { manifest: { listed: ALL_ROUTES, areas: AREA_ROUTES } });
routerCase("reads the generated area routes, as in Release 1", "pass", releaseOneRouter);
routerCase("reports a route missing from a router with plain paths", "fail", releaseOneRouter.replace('<Route path="/about" element={<Page />} />', ""));
routerCase("reports a generated path it cannot read", "fail", `${releaseOneRouter}\n<Route path={extraPath} element={<Page />} />`);
routerCase("reports a router with no routes it can read", "fail", "");
routerCase("reports a list the router does not read", "fail", releaseOneRouter, LIST_MANIFEST);
routerCase("allows a router built from the list", "pass", listRouter, LIST_MANIFEST);
routerCase("allows the catch-all beside the list", "pass", `${listRouter}\n<Route path="*" element={<NotFound />} />`, LIST_MANIFEST);
routerCase("reads the list under another name", "pass", listRouter.replace("{ ROUTES }", "{ ROUTES as SITE_ROUTES }").replace("{ROUTES.map", "{SITE_ROUTES.map"), LIST_MANIFEST);
const LIST_IMPORT = 'import { ROUTES } from "./data/routes";';
routerCase("reports the list imported beside every plain path", "fail", `${LIST_IMPORT}\n${releaseOneRouter}`, LIST_MANIFEST);
routerCase("reports the list used beside every plain path", "fail", `${LIST_IMPORT}\nconsole.log(ROUTES);\n${releaseOneRouter}`, LIST_MANIFEST);
routerCase("reports one plain path beside a built router", "fail", `${listRouter}\n<Route path="/about" element={<Page />} />`, LIST_MANIFEST);
routerCase("reports a list import nothing uses", "fail", `${LIST_IMPORT}\n<Route path={route} element={<Page />} />`, LIST_MANIFEST);
routerCase("reports a list named only in a comment", "fail", `${LIST_IMPORT}\n// ROUTES drives this\n/* ROUTES */\n<Route path={route} element={<Page />} />`, LIST_MANIFEST);
routerCase("reports another name imported from the list file", "fail", 'import { helper } from "./data/routes";\nhelper(ROUTES);', LIST_MANIFEST);
distCase("D-MANIFEST", "reports a URL missing from the sitemap", "fail", (files) => replaceIn(files, "sitemap.xml", sitemapEntry("/about"), ""));
distCase("D-MANIFEST", "reports a sitemap URL that is not indexable", "fail", (files) => editFile(files, "sitemap.xml", `<url><loc>${SITE}/cart</loc></url>`));
distCase("D-MANIFEST", "reports a listed route with no file", "fail", (files) => files.delete(ABOUT_HTML));
distCase("D-MANIFEST", "reports a file for an unknown route", "fail", (files) => files.set("extra/index.html", pageHtml("/extra")));
distCase("D-MANIFEST", "allows a utility route with no file until R2-20", "pass", () => undefined);
distCase("D-MANIFEST", "allows a utility route with a noindex file", "pass", (files) => files.set("cart/index.html", notFoundHtml()));
distCase("D-MANIFEST", "reports a utility file with no noindex", "fail", (files) => files.set("cart/index.html", pageHtml("/cart")));
distCase("D-MANIFEST", "reports an llms.txt link that is not a route", "fail", (files) => editFile(files, "llms.txt", `- [Extra](${SITE}/extra)\n`));
distCase("D-MANIFEST", "allows llms.txt links to a route and a static file", "pass", (files) => editFile(files, "llms.txt", `- [FAQ](${SITE}/faq), ${SITE}/robots.txt and ${SITE}.\n`));

distCase("D-COPY", "reports head-only pages, as in Release 1", "fail", headOnly);
distCase("D-COPY", "reports a banned phrase on a page", "fail", (files) => addToBody(files, HOME_HTML, "<p>Service after-hours.</p>"));
distCase("D-COPY", "reads a banned phrase split by an inline tag", "fail", (files) => addToBody(files, HOME_HTML, "<p>Service <strong>after</strong>-hours.</p>"));
distCase("D-COPY", "reports a banned phrase spread across escaped text", "fail", (files) => addToBody(files, HOME_HTML, "<p>you&#x27;ll work with the same professional</p>"));
distCase("D-COPY", "reports a ban that runs across a React text marker", "fail", (files) => addToBody(files, HOME_HTML, "<p>after-<!-- -->hours</p>"));
distCase("D-COPY", "does not read class names as copy", "pass", (files) => addToBody(files, HOME_HTML, '<p class="after-hours">Fixture.</p>'));
distCase("D-COPY", "allows the FAQ sentence on /faq", "pass", () => undefined);
distCase("D-COPY", "reports the FAQ sentence on another page", "fail", (files) => addToBody(files, HOME_HTML, `<p>${escapeHtml(NO_BIOHAZARD)}</p>`));
distCase("D-COPY", "reports a second copy of the FAQ sentence on /faq", "fail", (files) => addToBody(files, FAQ_HTML, `<p>${escapeHtml(NO_BIOHAZARD)}</p>`));
distCase("D-COPY", "allows the Terms wording on /terms-of-service", "pass", (files) => addToBody(files, TERMS_HTML, "<p>We cannot clean biohazards.</p>"));
distCase("D-COPY", "keeps a scoped ban to its pages", "pass", (files) => addToBody(files, HOME_HTML, "<li>White vinegar</li>"));
distCase("D-COPY", "applies a scoped ban on its pages", "fail", (files) => addToBody(files, BLOG_HTML, "<li>White vinegar</li>"));
const PRIVACY_HTML = "privacy/index.html";
distCase("D-COPY", "a page's ban reads the page", "fail", (files) => addToBody(files, PRIVACY_HTML, "<p>Find us on Instagram.</p>"));
distCase("D-COPY", "a page's ban leaves the shared footer alone", "pass", (files) => replaceIn(files, PRIVACY_HTML, "</main>", '</main><footer><a href="https://www.instagram.com/x">Instagram</a></footer>'));
distCase("D-COPY", "a page's ban reads the whole body when there is no main", "fail", (files) => setBody(files, PRIVACY_HTML, '<div id="root"><footer>Instagram</footer></div>'));
distCase("D-COPY", "a site-wide ban still reads the shared footer", "fail", (files) => replaceIn(files, HOME_HTML, "</main>", "</main><footer>Open after-hours</footer>"));
distCase("D-COPY", "reports a required string missing from its page", "fail", (files) => replaceIn(files, HOME_HTML, `<p class="text-lg">${STAFF_LINE}</p>`, ""));
distCase("D-COPY", "reports a consultation line with no follow-up", "fail", (files) => addToBody(files, HOME_HTML, `<p>A ${CONSULTATION}.</p>`));
distCase("D-COPY", "reports text that must be gone", "fail", (files) => addToBody(files, HOME_HTML, `<p>${ABSENT[0].texts[0]}</p>`));
distCase("D-COPY", "reports the sister brand outside its pages", "fail", (files) => addToBody(files, HOME_HTML, "<p>Pearly&#x27;s</p>"));
distCase("D-COPY", "reports an exterior glass claim on an area page", "fail", (files) => addToBody(files, AREA_HTML, "<li>Salt-spray removal from window glass.</li>"));
distCase("D-COPY", "reports a roof claim on an area page", "fail", (files) => addToBody(files, AREA_HTML, "<li>Moss removed from the roof.</li>"));
distCase("D-COPY", "matches a private term, and hides the text", "fail", (files) => addToBody(files, HOME_HTML, `<p>${PLACEHOLDER_HIT}</p>`), {}, PLACEHOLDER_HIT);
distCase("D-COPY", "matches a private term in the head, and hides the text", "fail", (files) => replaceIn(files, HOME_HTML, "</head>", `<meta name="keywords" content="${HIDDEN_TERM}"></head>`), {}, HIDDEN_TERM);
distCase("D-COPY", "fails with no ban file", "fail", () => undefined, { privateBans: null });
distCase("D-COPY", "reports a required page that is not built", "fail", (files) => files.delete(ABOUT_HTML));
distCase("D-COPY", "reports a router it can no longer read", "fail", () => undefined, { manifest: NO_LIST, sources: { "src/App.tsx": "" } });
const plainRouted: DistOptions = { manifest: NO_LIST, sources: { "src/App.tsx": plainPageRouter } };
distCase("D-COPY", "places pages through a Release 1 router", "pass", () => undefined, plainRouted);
distCase("D-PARITY", "places pages through a Release 1 router", "pass", () => undefined, plainRouted);
distCase("D-PARITY", "reports a page the route list does not name", "fail", () => undefined, { manifest: { ...LIST_MANIFEST, pages: { "/about": "About" } } });

const snapshot = (fields: Partial<PageSnapshot> = {}): PageSnapshot => {
  const route = fields.route ?? "/about";
  return {
    route,
    finalPath: route,
    pageErrors: [],
    consoleErrors: [],
    h1s: ["Heading"],
    canonicals: [route === "/" ? `${SITE}/` : `${SITE}${route.replace(/\/$/, "")}`],
    descriptions: ["Description"],
    jsonLd: [JSON.stringify(orgNode())],
    areaLinks: 0,
    hasNameField: false,
    clarityScript: false,
    ...fields,
  };
};

const ORIGIN = "http://127.0.0.1:4173";
const browserCase = (rule: string, name: string, expect: Case["expect"], run: () => Finding[]) => cases.push({ rule, name, expect, run });

browserCase("BR-CONSOLE", "good fixture", "pass", () => checkConsole(snapshot(), ORIGIN));
browserCase("BR-CONSOLE", "reports a pageerror", "fail", () => checkConsole(snapshot({ pageErrors: ["ChevronRight is not defined"] }), ORIGIN));
browserCase("BR-CONSOLE", "reports console.error", "fail", () => checkConsole(snapshot({ consoleErrors: [{ text: "boom", url: "" }] }), ORIGIN));
browserCase("BR-CONSOLE", "reports a same-origin failed load", "fail", () => checkConsole(snapshot({ consoleErrors: [{ text: "Failed to load resource: 404", url: `${ORIGIN}/assets/x.js` }] }), ORIGIN));
const MISSING_URL = `${ORIGIN}${LIVE.missingPath}`;
const OWN_404 = { text: "Failed to load resource: the server responded with a status of 404 (Not Found)", url: MISSING_URL };
browserCase("BR-CONSOLE", "allows a missing page's own 404", "pass", () => checkConsole(snapshot({ route: LIVE.missingPath, consoleErrors: [OWN_404] }), ORIGIN));
browserCase("BR-CONSOLE", "reports a real route that returns 404", "fail", () => checkConsole(snapshot({ route: "/about", consoleErrors: [{ ...OWN_404, url: `${ORIGIN}/about` }] }), ORIGIN));
browserCase("BR-CONSOLE", "reports another failed load on the missing page", "fail", () => checkConsole(snapshot({ route: LIVE.missingPath, consoleErrors: [{ ...OWN_404, url: `${ORIGIN}/assets/x.js` }] }), ORIGIN));
browserCase("BR-CONSOLE", "ignores third-party and /_vercel failures", "pass", () => checkConsole(snapshot({
  consoleErrors: [
    { text: "Failed to load resource: net::ERR_FAILED", url: "https://fonts.googleapis.com/css2" },
    { text: "Failed to load resource: 404", url: `${ORIGIN}/_vercel/insights/script.js` },
  ],
}), ORIGIN));
browserCase("BR-H1", "good fixture", "pass", () => checkH1(snapshot()));
browserCase("BR-H1", "reports no H1", "fail", () => checkH1(snapshot({ h1s: [] })));
browserCase("BR-H1", "seeded cart stays on the form", "pass", () => checkH1(snapshot({ route: "/checkout", scenario: "seeded cart", hasNameField: true })));
browserCase("BR-H1", "reports a seeded cart that leaves the form", "fail", () => checkH1(snapshot({ route: "/checkout", scenario: "seeded cart", finalPath: "/cart", hasNameField: false })));
browserCase("BR-H1", "empty cart ends at /cart", "pass", () => checkH1(snapshot({ route: "/checkout", scenario: "empty cart", finalPath: "/cart" })));
browserCase("BR-H1", "reports an empty cart that stays blank", "fail", () => checkH1(snapshot({ route: "/checkout", scenario: "empty cart", h1s: [] })));
browserCase("BR-AREAS", "good fixture", "pass", () => checkAreas(snapshot({ route: "/areas", areaLinks: 19 })));
browserCase("BR-AREAS", "reports too few links", "fail", () => checkAreas(snapshot({ route: "/areas", areaLinks: 3 })));
browserCase("BR-AREAS", "reports no H1", "fail", () => checkAreas(snapshot({ route: "/areas", areaLinks: 19, h1s: [] })));
browserCase("BR-HEAD", "good fixture", "pass", () => checkBrowserHead(snapshot()));
browserCase("BR-HEAD", "home keeps its slash", "pass", () => checkBrowserHead(snapshot({ route: "/", canonicals: [`${SITE}/`] })));
browserCase("BR-HEAD", "a trailing-slash route canonicalises without it", "pass", () => checkBrowserHead(snapshot({ route: "/services/errands/", canonicals: [`${SITE}/services/errands`] })));
browserCase("BR-HEAD", "reports a trailing-slash canonical", "fail", () => checkBrowserHead(snapshot({ route: "/services/errands/", canonicals: [`${SITE}/services/errands/`] })));
browserCase("BR-HEAD", "reports two canonicals", "fail", () => checkBrowserHead(snapshot({ canonicals: [`${SITE}/about`, `${SITE}/`] })));
browserCase("BR-HEAD", "reports two descriptions", "fail", () => checkBrowserHead(snapshot({ descriptions: ["One", "Two"] })));
browserCase("BR-HEAD", "reports duplicate rendered JSON-LD", "fail", () => checkBrowserHead(snapshot({ jsonLd: [JSON.stringify(orgNode()), JSON.stringify({ ...orgNode(), name: "Other" })] })));
browserCase("BR-HEAD", "an empty cart canonicalises to /cart", "pass", () => checkBrowserHead(snapshot({ route: "/checkout", scenario: "empty cart", finalPath: "/cart", canonicals: [`${SITE}/cart`] })));

const homeBlocks = [JSON.stringify(orgNode()), JSON.stringify(parentNode)];
const servicesBlocks = [JSON.stringify(orgNode()), JSON.stringify({ "@type": "BreadcrumbList", name: "services" })];
const navStep = (fields: Partial<PageSnapshot> = {}, clientSide = true) => ({
  from: snapshot({ route: "/", jsonLd: homeBlocks }),
  to: snapshot({ route: "/services", jsonLd: servicesBlocks, ...fields }),
  direct: snapshot({ route: "/services", jsonLd: servicesBlocks }),
  clientSide,
});
browserCase("BR-NAV", "good fixture", "pass", () => checkNav(navStep()));
browserCase("BR-NAV", "reports a block left from the previous page", "fail", () => checkNav(navStep({ jsonLd: [...servicesBlocks, JSON.stringify(parentNode)] })));
browserCase("BR-NAV", "reports a canonical left from the previous page", "fail", () => checkNav(navStep({ canonicals: [`${SITE}/services`, `${SITE}/`] })));
browserCase("BR-NAV", "reports a full page load", "fail", () => checkNav(navStep({}, false)));
browserCase("BR-RANK", "good fixture", "pass", () => checkBrowserRank(snapshot({ route: "/services", h1s: ["Our Services"] }), "Our Services"));
browserCase("BR-RANK", "reports a changed H1", "fail", () => checkBrowserRank(snapshot({ route: "/services", h1s: ["Changed"] }), "Our Services"));
browserCase("BR-RANK", "reports a missing baseline", "fail", () => checkBrowserRank(snapshot({ route: "/services" }), undefined));
browserCase("BR-CLARITY", "good fixture", "pass", () => checkClarity(snapshot(), undefined));
browserCase("BR-CLARITY", "reports the script by default", "fail", () => checkClarity(snapshot({ clarityScript: true }), undefined));
browserCase("BR-CLARITY", "finds the expected ID on home", "pass", () => checkClarity(snapshot({ route: "/", clarityScript: true, clarityScriptSrc: "https://www.clarity.ms/tag/abc" }), "abc"));
browserCase("BR-CLARITY", "reports the script missing from home", "fail", () => checkClarity(snapshot({ route: "/" }), "abc"));
browserCase("BR-CLARITY", "reports the script on the success page", "fail", () => checkClarity(snapshot({ route: "/checkout-success", clarityScript: true }), "abc"));

const rawSnapshot = (route: string, fields: Partial<PageSnapshot> = {}): PageSnapshot => {
  const html = pageHtml(route);
  return snapshot({ route, html, rendered: { h1: rawHeadingsOf(html)[0], text: rawTextOf(html), links: [...new Set(rawLinksOf(html))] }, ...fields });
};
const renderedPage = (fields: Partial<NonNullable<PageSnapshot["rendered"]>>) => {
  const rendered = rawSnapshot("/about").rendered as NonNullable<PageSnapshot["rendered"]>;
  return { ...rendered, ...fields };
};
const headOnlyHtml = (html: string) => html.replace(/<body>[\s\S]*<\/body>/, '<body><div id="root"></div></body>');
browserCase("BR-RAW", "good fixture", "pass", () => checkRawPage(rawSnapshot("/about")));
browserCase("BR-RAW", "reports a head-only page, as in Release 1", "fail", () => checkRawPage(rawSnapshot("/about", { html: headOnlyHtml(pageHtml("/about")) })));
browserCase("BR-RAW", "reports copy added since the baseline was captured", "fail", () => {
  const text = `${renderedPage({}).text} ${"added ".repeat(FILLER_WORDS)}`;
  return checkRawPage(rawSnapshot("/about", { rendered: renderedPage({ text }) }));
});
browserCase("BR-RAW", "reports an H1 that differs from this build's", "fail", () => checkRawPage(rawSnapshot("/about", { rendered: renderedPage({ h1: "Other" }) })));
browserCase("BR-RAW", "reports a page it could not read", "fail", () => checkRawPage(rawSnapshot("/about", { html: undefined })));
browserCase("BR-RAW", "leaves utility routes to the other rules", "pass", () => checkRawPage(snapshot({ route: "/cart" })));

const SAVED_FAQ = "Frequently Asked Questions What makes this service different? How is pricing determined?";
const OPEN_ANSWERS = "Every visit follows a plan written for your home. Pricing follows the size of the home and how often we visit.";
const savedEntry = (text: string, fields: Partial<RenderEntry> = {}): RenderEntry => ({ finalPath: "/faq", h1: "FAQ", links: [], words: textWords(text).length, text, ...fields });
const renderedAs = (text: string, fields: Partial<PageSnapshot> = {}) => snapshot({ route: "/faq", rendered: { h1: "FAQ", text, links: [] }, ...fields });
const WORDS = filler(100);
browserCase("BR-RENDER", "good fixture", "pass", () => checkRendered(renderedAs(SAVED_FAQ), savedEntry(SAVED_FAQ)));
browserCase("BR-RENDER", "reports FAQ answers left open", "fail", () => checkRendered(renderedAs(`${SAVED_FAQ} ${OPEN_ANSWERS}`), savedEntry(SAVED_FAQ)));
browserCase("BR-RENDER", "reports a section lost after load", "fail", () => checkRendered(renderedAs(SAVED_FAQ.slice(0, 26)), savedEntry(SAVED_FAQ)));
browserCase("BR-RENDER", "reports a blank page", "fail", () => checkRendered(renderedAs(""), savedEntry(SAVED_FAQ)));
browserCase("BR-RENDER", "allows five extra words in a hundred", "pass", () => checkRendered(renderedAs(`${WORDS} one two three four five`), savedEntry(WORDS)));
browserCase("BR-RENDER", "reports six extra words in a hundred", "fail", () => checkRendered(renderedAs(`${WORDS} one two three four five six`), savedEntry(WORDS)));
browserCase("BR-RENDER", "reports a route with no saved text", "fail", () => checkRendered(renderedAs(SAVED_FAQ), undefined));
browserCase("BR-RENDER", "reports text it could not read", "fail", () => checkRendered(snapshot({ route: "/faq" }), savedEntry(SAVED_FAQ)));
browserCase("BR-RENDER", "compares the state that was saved", "fail", () => checkRendered(renderedAs("Your cart is empty", { route: "/checkout", scenario: "seeded cart" }), savedEntry(SAVED_FAQ, { scenario: "seeded cart" })));
browserCase("BR-RENDER", "leaves a state that was not saved", "pass", () => checkRendered(renderedAs("Your cart is empty", { route: "/checkout", scenario: "empty cart" }), savedEntry(SAVED_FAQ, { scenario: "seeded cart" })));
browserCase("BR-RENDER", "leaves a URL outside the route list", "pass", () => checkRendered(renderedAs("Not found", { route: LIVE.missingPath }), undefined));

const missingUrl = (fields: Partial<PageSnapshot> = {}) => snapshot({ route: LIVE.missingPath, status: 404, html: notFoundHtml(), ...fields });
browserCase("BR-404", "good fixture", "pass", () => checkMissingUrl(missingUrl(), ORIGIN));
browserCase("BR-404", "allows the browser's log of the page's own 404", "pass", () => checkMissingUrl(missingUrl({ consoleErrors: [OWN_404] }), ORIGIN));
browserCase("BR-404", "reports the home page served with a 200, as in Release 1", "fail", () => checkMissingUrl(missingUrl({ status: 200, html: pageHtml("/") }), ORIGIN));
browserCase("BR-404", "reports the console.error in NotFound, as in Release 1", "fail", () => checkMissingUrl(missingUrl({ consoleErrors: [{ text: "404 Error: User attempted to access non-existent route", url: "" }] }), ORIGIN));
browserCase("BR-404", "reports a 404 page with no noindex", "fail", () => checkMissingUrl(missingUrl({ html: notFoundHtml().replace('content="noindex,follow"', 'content="index"') }), ORIGIN));

const hydrated = (fields: Partial<HydrationSnapshot> = {}): HydrationSnapshot => ({
  route: "/about",
  scenario: "empty cart",
  finalPath: fields.route ?? "/about",
  pageErrors: [],
  consoleErrors: [],
  markup: "attached",
  headingKept: true,
  ...fields,
});
browserCase("BR-HYDRATE", "good fixture", "pass", () => checkHydrate(hydrated()));
browserCase("BR-HYDRATE", "a seeded cart with no warnings", "pass", () => checkHydrate(hydrated({ scenario: "seeded cart" })));
browserCase("BR-HYDRATE", "reports a page with no markup, as in Release 1", "fail", () => checkHydrate(hydrated({ markup: "none", headingKept: undefined })));
browserCase("BR-HYDRATE", "reports markup discarded with no warning", "fail", () => checkHydrate(hydrated({ markup: "replaced" })));
browserCase("BR-HYDRATE", "reports a page React never reached", "fail", () => checkHydrate(hydrated({ markup: "not attached" })));
browserCase("BR-HYDRATE", "reports a mismatch that needs a later date", "fail", () => checkHydrate(hydrated({ route: "/", finalPath: "/", scenario: "next year", pageErrors: ["Minified React error #425"] })));
browserCase("BR-HYDRATE", "allows an empty checkout that leaves for /cart", "pass", () => checkHydrate(hydrated({ route: "/checkout", finalPath: "/cart", markup: "replaced" })));
browserCase("BR-HYDRATE", "reports a utility page that stays and loses its markup", "fail", () => checkHydrate(hydrated({ route: "/cart", markup: "replaced" })));
browserCase("BR-HYDRATE", "reports a production hydration error", "fail", () => checkHydrate(hydrated({ pageErrors: ["Minified React error #418; visit https://reactjs.org/docs/error-decoder.html?invariant=418"] })));
browserCase("BR-HYDRATE", "reports a production text mismatch", "fail", () => checkHydrate(hydrated({ scenario: "seeded cart", pageErrors: ["Minified React error #425"] })));
browserCase("BR-HYDRATE", "reports a development warning", "fail", () => checkHydrate(hydrated({ consoleErrors: [{ text: "Warning: Text content did not match. Server: \"0\" Client: \"1\"", url: "" }] })));
browserCase("BR-HYDRATE", "does not report another error", "pass", () => checkHydrate(hydrated({ pageErrors: ["Minified React error #300"], consoleErrors: [{ text: "boom", url: "" }] })));
browserCase("BR-HYDRATE", "reports an H1 replaced after load", "fail", () => checkHydrate(hydrated({ headingKept: false })));
browserCase("BR-HYDRATE", "allows a cart page to swap its H1", "pass", () => checkHydrate(hydrated({ route: "/cart", scenario: "seeded cart", headingKept: false })));
browserCase("BR-HYDRATE", "allows a page with no H1 in its HTML", "pass", () => checkHydrate(hydrated({ route: "/checkout", headingKept: undefined })));
browserCase("BR-HYDRATE", "reports a page with no <main>", "fail", () => checkHydrate(hydrated({ markup: "no main" })));
const stripeReturn = (fields: Partial<HydrationSnapshot> = {}) => hydrated({ route: STRIPE_RETURN, finalPath: "/checkout-success", ...fields });
browserCase("BR-HYDRATE", "Stripe's return URL stays on its page", "pass", () => checkHydrate(stripeReturn()));
browserCase("BR-HYDRATE", "reports a mismatch on Stripe's return URL", "fail", () => checkHydrate(stripeReturn({ pageErrors: ["Minified React error #418"] })));
browserCase("BR-HYDRATE", "reports Stripe's return URL losing its markup", "fail", () => checkHydrate(stripeReturn({ markup: "replaced" })));
browserCase("BR-HYDRATE", "names the row when a utility route has no file", "fail", () => checkHydrate(hydrated({ route: "/cart", finalPath: "/cart", fileBuilt: false })));
for (const text of [
  "Warning: Prop `id` did not match. Server: \":R1:\" Client: \":R2:\"",
  "Warning: Extra attributes from the server: class",
  "Warning: Expected server HTML to contain a matching <div> in <div>.",
  "Warning: Did not expect server HTML to contain a <div> in <div>.",
]) {
  browserCase("BR-HYDRATE", `reports what development React prints: ${text.slice(9, 30)}`, "fail", () => checkHydrate(hydrated({ consoleErrors: [{ text, url: "" }] })));
}

const cartSteps = (edit: (step: CartStep) => Partial<CartStep> = () => ({})): CartStep[] =>
  BROWSER.cartSteps.map(({ name, route, cleared }) => {
    const storedIds = cleared ? [] : [BROWSER.seededCart[0].id];
    const step: CartStep = { name, route, cleared, finalPath: route, storedIds, itemShown: route === "/cart", hasNameField: route === "/checkout", emptyWrites: cleared ? 1 : 0 };
    return { ...step, ...edit(step) };
  });
const atStep = (name: string, fields: Partial<CartStep>) => cartSteps((step) => (step.name === name ? fields : {}));
browserCase("BR-CART", "good fixture", "pass", () => checkCart(cartSteps()));
browserCase("BR-CART", "reports a cart lost on reload", "fail", () => checkCart(atStep("reload", { storedIds: [] })));
browserCase("BR-CART", "reports a cart lost on return to /cart", "fail", () => checkCart(atStep("return to the cart", { storedIds: [] })));
browserCase("BR-CART", "reports an empty list written over the cart", "fail", () => checkCart(atStep("first load", { emptyWrites: 1 })));
browserCase("BR-CART", "reports a stored item that is not on the page", "fail", () => checkCart(atStep("reload", { itemShown: false })));
browserCase("BR-CART", "reports checkout leaving the form", "fail", () => checkCart(atStep("full load of checkout", { finalPath: "/cart", hasNameField: false })));
browserCase("BR-CART", "reports checkout with no form", "fail", () => checkCart(atStep("full load of checkout", { hasNameField: false })));
browserCase("BR-CART", "reports a step that did not run", "fail", () => checkCart(cartSteps().slice(0, 2)));
const PAID_ITEM = [BROWSER.seededCart[0].id];
browserCase("BR-CART", "reports a paid item left in the stored cart", "fail", () => checkCart(atStep("order complete", { storedIds: PAID_ITEM })));
browserCase("BR-CART", "reports a paid item back after a reload", "fail", () => checkCart(atStep("reload after the order", { storedIds: PAID_ITEM })));
browserCase("BR-CART", "reports the order page sending the visitor away", "fail", () => checkCart(atStep("order complete", { finalPath: "/cart" })));
browserCase("BR-CART", "allows the order page a few empty writes", "pass", () => checkCart(atStep("order complete", { emptyWrites: BROWSER.maxEmptyWrites })));
browserCase("BR-CART", "reports the order page writing in a loop", "fail", () => checkCart(atStep("order complete", { emptyWrites: BROWSER.maxEmptyWrites + 1 })));
browserCase("BR-CART", "reports the loop after a reload too", "fail", () => checkCart(atStep("reload after the order", { emptyWrites: 40 })));

const lcpOf = (runsMs: number[], shifts: number[] = runsMs.map(() => 0)): LcpMeasure => ({ runsMs, medianMs: median(runsMs), shifts });
browserCase("BR-LCP", "good fixture", "pass", () => checkLcpRuns("/", lcpOf([2000, 2100, 2200, 2300, 2400]), R1_LCP));
browserCase("BR-LCP", "allows a fastest run within the tolerance", "pass", () => checkLcpRuns("/", lcpOf([3140, 3300, 3400, 3500, 3600]), R1_LCP));
browserCase("BR-LCP", "reports a fastest run past the tolerance", "fail", () => checkLcpRuns("/", lcpOf([3160, 3170, 3180, 3190, 3200]), R1_LCP));
browserCase("BR-LCP", "gives a slow median no say, as on unchanged R1", "pass", () => checkLcpRuns("/", lcpOf([3000, 3050, 3900, 3950, 4000]), R1_LCP));
browserCase("BR-LCP", "reports too few runs", "fail", () => checkLcpRuns("/", lcpOf([2000]), R1_LCP));
browserCase("BR-LCP", "reports no R1 figure", "fail", () => checkLcpRuns("/", lcpOf(LCP_RUNS), undefined));
browserCase("BR-LCP", "reports too few R1 runs in the sitting", "fail", () => checkLcpRuns("/", lcpOf(LCP_RUNS), { runsMs: [3200], medianMs: 3200 }));
browserCase("BR-LCP", "reports one run with a layout shift", "fail", () => checkLcpRuns("/", lcpOf(LCP_RUNS, [0, 0, 0.02, 0, 0]), R1_LCP));

browserCase("BR-GA", "good fixture", "pass", () => checkGa(snapshot({ gaConfigs: 1 })));
browserCase("BR-GA", "reports two page views from one load", "fail", () => checkGa(snapshot({ gaConfigs: 2 })));
browserCase("BR-GA", "reports a page with no tag", "fail", () => checkGa(snapshot({ gaConfigs: 0 })));
browserCase("BR-GA", "reports a load with no reading", "fail", () => checkGa(snapshot()));
browserCase("BR-GA", "leaves the 404 page alone", "pass", () => checkGa(snapshot({ route: LIVE.missingPath, gaConfigs: 0 })));

const liveCase = (rule: string, name: string, expect: Case["expect"], run: () => Finding[]) => cases.push({ rule, name, expect, run });
const APEX = LIVE.apex;
const chain = (...hops: Array<[string, number]>): Chain => hops.map(([url, status]) => ({ url, status }));

liveCase("LV-HOST", "good fixture", "pass", () => checkHost("https://www.wabisabiservices.ca", chain(["https://www.wabisabiservices.ca/", 308], [`${APEX}/`, 200])));
liveCase("LV-HOST", "the apex needs no redirect", "pass", () => checkHost(APEX, chain([`${APEX}/`, 200])));
liveCase("LV-HOST", "reports a 307", "fail", () => checkHost(APEX, chain([`${APEX}/`, 307], ["https://www.wabisabiservices.ca/", 200])));
liveCase("LV-HOST", "reports a temporary hop to the apex", "fail", () => checkHost("http://wabisabiservices.ca", chain(["http://wabisabiservices.ca/", 307], [`${APEX}/`, 200])));
liveCase("LV-HOST", "reports two hops", "fail", () => checkHost("http://wabisabiservices.ca", chain(["http://wabisabiservices.ca/", 308], ["https://www.wabisabiservices.ca/", 308], [`${APEX}/`, 200])));
liveCase("LV-FILES", "good fixture", "pass", () => checkFile("/llms.txt", chain([`${APEX}/llms.txt`, 200])));
liveCase("LV-FILES", "reports a redirect", "fail", () => checkFile("/llms.txt", chain([`${APEX}/llms.txt`, 307], ["https://www.wabisabiservices.ca/llms.txt", 200])));
liveCase("LV-404", "good fixture", "pass", () => checkMissing(chain([`${APEX}/does-not-exist`, 404]), notFoundHtml()));
liveCase("LV-404", "reports a soft 404", "fail", () => checkMissing(chain([`${APEX}/does-not-exist`, 200]), notFoundHtml()));
liveCase("LV-404", "reports the platform's own 404 page", "fail", () => checkMissing(chain([`${APEX}/does-not-exist`, 404]), "<html><head><title>404: NOT_FOUND</title></head><body><h1>404</h1></body></html>"));
liveCase("LV-404", "reports a 404 page with a home canonical", "fail", () => checkMissing(chain([`${APEX}/does-not-exist`, 404]), notFoundHtml().replace("</head>", `<link rel="canonical" href="${APEX}/" /></head>`)));
const OAK_BAY = "/areas/oak-bay";
const liveHtml = (canonical: string, h1: string, words = 200) => `<html><head><link rel="canonical" href="${canonical}" /></head><body><h1>${h1}</h1><p>${"word ".repeat(words)}</p></body></html>`;
liveCase("LV-RAW", "good fixture", "pass", () => checkRaw(OAK_BAY, 200, liveHtml(`${APEX}${OAK_BAY}`, "Title"), "Title"));
liveCase("LV-RAW", "reports a head-only page", "fail", () => checkRaw(OAK_BAY, 200, '<html><head><title>x</title></head><body><div id="root"></div></body></html>', "Title"));
liveCase("LV-RAW", "reports the home page served for this route", "fail", () => checkRaw(OAK_BAY, 200, liveHtml(`${APEX}/`, "Home"), "Title"));
liveCase("LV-RAW", "reports the right canonical with the wrong H1", "fail", () => checkRaw(OAK_BAY, 200, liveHtml(`${APEX}${OAK_BAY}`, "Other"), "Title"));
liveCase("LV-RAW", "reports the right H1 with the wrong canonical", "fail", () => checkRaw(OAK_BAY, 200, liveHtml(`${APEX}/`, "Title"), "Title"));
liveCase("LV-RAW", "reports no baseline H1", "fail", () => checkRaw(OAK_BAY, 200, liveHtml(`${APEX}${OAK_BAY}`, "Title"), undefined));
liveCase("LV-RAW", "reports too little body text", "fail", () => checkRaw(OAK_BAY, 200, liveHtml(`${APEX}${OAK_BAY}`, "Title", 10), "Title"));
liveCase("LV-REDIRECT", "good fixture", "pass", () => checkRedirect("/the-ritual", "/ritual", APEX, chain([`${APEX}/the-ritual`, 308], [`${APEX}/ritual`, 200])));
liveCase("LV-REDIRECT", "reports a temporary redirect", "fail", () => checkRedirect("/the-ritual", "/ritual", APEX, chain([`${APEX}/the-ritual`, 307], [`${APEX}/ritual`, 200])));
liveCase("LV-REDIRECT", "/home goes to the home page", "pass", () => checkRedirect("/home", "/", APEX, chain([`${APEX}/home`, 308], [`${APEX}/`, 200])));
const SLASH_HOPS = LIVE.redirects.find((item) => item.from === "/home/")?.maxHops;
liveCase("LV-REDIRECT", "/home/ goes straight to the home page", "pass", () => checkRedirect("/home/", "/", APEX, chain([`${APEX}/home/`, 308], [`${APEX}/`, 200]), SLASH_HOPS));
liveCase("LV-REDIRECT", "/home/ may go through /home, as trailingSlash does", "pass", () => checkRedirect("/home/", "/", APEX, chain([`${APEX}/home/`, 308], [`${APEX}/home`, 308], [`${APEX}/`, 200]), SLASH_HOPS));
liveCase("LV-REDIRECT", "reports a temporary hop on a slash form", "fail", () => checkRedirect("/home/", "/", APEX, chain([`${APEX}/home/`, 308], [`${APEX}/home`, 307], [`${APEX}/`, 200]), SLASH_HOPS));
liveCase("LV-REDIRECT", "reports three hops on a slash form", "fail", () => checkRedirect("/home/", "/", APEX, chain([`${APEX}/home/`, 308], [`${APEX}/home`, 308], [`${APEX}/index.html`, 308], [`${APEX}/`, 200]), SLASH_HOPS));
liveCase("LV-REDIRECT", "reports a 200 with no redirect, as in Release 1", "fail", () => checkRedirect("/the-ritual", "/ritual", APEX, chain([`${APEX}/the-ritual`, 200])));
liveCase("LV-REDIRECT", "reports two hops", "fail", () => checkRedirect("/the-ritual", "/ritual", APEX, chain([`${APEX}/the-ritual`, 308], [`${APEX}/the-ritual/`, 308], [`${APEX}/ritual`, 200])));
liveCase("LV-REDIRECT", "reports the wrong destination", "fail", () => checkRedirect("/the-ritual", "/ritual", APEX, chain([`${APEX}/the-ritual`, 308], [`${APEX}/`, 200])));
liveCase("LV-REDIRECT", "reports a redirect that ends in a 404", "fail", () => checkRedirect("/the-ritual", "/ritual", APEX, chain([`${APEX}/the-ritual`, 308], [`${APEX}/ritual`, 404])));
const utilityHtml = (meta: string) => `<html><head>${meta}</head><body></body></html>`;
liveCase("LV-UTILITY", "good fixture", "pass", () => checkUtility("/cart", 200, utilityHtml('<meta name="robots" content="noindex,follow" data-rh="true" />')));
liveCase("LV-UTILITY", "reads content written before name", "pass", () => checkUtility("/cart", 200, utilityHtml('<meta content="noindex" name="robots" />')));
liveCase("LV-UTILITY", "reports no noindex", "fail", () => checkUtility("/cart", 200, "<html></html>"));
liveCase("LV-UTILITY", "ignores noindex outside the head", "fail", () => checkUtility("/cart", 200, '<html><head></head><body><meta name="robots" content="noindex" /></body></html>'));
liveCase("LV-UTILITY", "reports a status other than 200", "fail", () => checkUtility("/cart", 404, utilityHtml('<meta name="robots" content="noindex,follow" />')));

const LIVE_RULES = LIVE.all;

function argumentChecks(): string[] {
  const problems: string[] = [];
  const expectRoute = (input: string, expected: string) => {
    const actual = undoMsysPath(input);
    if (actual !== expected) problems.push(`undoMsysPath("${input}") gave "${actual}", expected "${expected}"`);
  };
  expectRoute("C:/Program Files/Git/areas", "/areas");
  expectRoute("C:/Program Files/Git/", "/");
  expectRoute("C:/Program Files/Git/,/reviews", "/,/reviews");
  expectRoute("/services/errands/", "/services/errands/");
  return problems;
}

function coverageProblems(): string[] {
  const problems: string[] = [];
  const allRules = [...Object.keys(SOURCE_CHECKS), ...Object.keys(DIST_CHECKS), ...BROWSER_RULES, ...LIVE_RULES];
  for (const rule of allRules) {
    if (!cases.some((item) => item.rule === rule && item.expect === "pass")) problems.push(`${rule} has no good fixture`);
    if (!cases.some((item) => item.rule === rule && item.expect === "fail")) problems.push(`${rule} has no bad fixture`);
  }
  for (const ban of BANS) if (!(ban.id in SOURCE_CHECKS)) problems.push(`${ban.id} has no check`);
  // The forms Google reported, with and without the slash.
  for (const [from, to] of [["/home", "/"], ["/home/", "/"], ["/the-ritual", "/ritual"], ["/the-ritual/", "/ritual"]]) {
    if (!LIVE.redirects.some((item) => item.from === from && item.to === to)) problems.push(`LV-REDIRECT does not cover ${from}`);
  }
  if (!BROWSER.hydrationUrls.includes(STRIPE_RETURN)) problems.push("BR-HYDRATE does not load Stripe's return URL");
  if (!LIVE.utilityRoutes.includes(STRIPE_RETURN)) problems.push("LV-UTILITY does not load Stripe's return URL");
  return problems;
}

export function runSelfTest(): number {
  let failures = 0;
  const fail = (message: string) => {
    failures++;
    console.log(`  FAIL ${message}`);
  };

  for (const item of cases) {
    const title = `[${item.rule}] ${item.name}`;
    let findings: Finding[];
    try {
      findings = item.run();
    } catch (error) {
      fail(`${title}: threw ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    if (item.expect === "pass" && findings.length > 0) {
      fail(`${title}: expected no findings, got ${findings.length}`);
      findings.slice(0, 3).forEach((finding) => console.log(`  ${formatFinding(finding)}`));
    }
    if (item.expect === "fail" && !findings.some((finding) => finding.rule === item.rule)) fail(`${title}: expected a finding, got none`);
    if (item.hidden && findings.some((finding) => formatFinding(finding).toLowerCase().includes((item.hidden as string).toLowerCase()))) {
      fail(`${title}: the output contains the matched text`);
    }
  }

  for (const problem of [...coverageProblems(), ...argumentChecks()]) fail(problem);

  const rules = new Set(cases.map((item) => item.rule)).size;
  if (failures > 0) {
    console.log(`\nself-test: FAIL, ${failures} of ${cases.length} checks`);
    return 1;
  }
  console.log(`self-test: pass, ${cases.length} cases across ${rules} rules`);
  return 0;
}
