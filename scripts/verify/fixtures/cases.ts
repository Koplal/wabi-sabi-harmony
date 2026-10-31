/**
 * Self-test: every rule runs against a good fixture and at least one bad fixture.
 * The good fixtures are built from rules.ts in memory. The private ban terms here are
 * made-up placeholders, and never real ones.
 */
import { formatFinding, type Finding, SourceText, undoMsysPath } from "../lib";
import {
  ABSENT,
  BANS,
  BONDING_LINE,
  CLARITY_PROJECT_ID,
  CONSULTATION,
  FAQ_FILES,
  FAQ_SECTIONS,
  FREE_ESTIMATES,
  GA_EVENTS,
  INDEXABLE_ROUTES,
  LIVE,
  MASK_ATTRIBUTE,
  MASK_FILES,
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
} from "../rules";
import { parsePrivateBans, SOURCE_CHECKS, type ScanFile, type SourceCtx } from "../source-checks";
import { DIST_CHECKS, type DistCtx, rankEntryFromHtml, type RankBaseline } from "../dist-checks";
import {
  BROWSER_RULES,
  checkAreas,
  checkClarity,
  checkConsole,
  checkH1,
  checkHead as checkBrowserHead,
  checkNav,
  checkRank as checkBrowserRank,
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

function pageHtml(route: string, extraBlocks: unknown[] = []): string {
  const url = route === "/" ? `${SITE}/` : `${SITE}${route}`;
  const blocks = [orgNode(), ...(route === "/" ? [parentNode] : []), ...extraBlocks];
  return `<!doctype html><html><head><title>Fixture ${route} | Wabi Sabi Services</title>
<meta name="description" content="Description of ${route}" ${rh} />
<meta property="og:url" content="${url}" ${rh} />
<meta name="twitter:url" content="${url}" ${rh} />
<link rel="canonical" href="${url}" ${rh} />
${blocks.map(script).join("\n")}
</head><body><div id="root"></div></body></html>`;
}

function goodDist(): Files {
  const files: Files = new Map();
  const product = { "@type": "Product", name: "The Fixture Package", offers: { price: "399" } };
  for (const route of INDEXABLE_ROUTES) {
    const path = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
    files.set(path, pageHtml(route, route === "/seasoning/quiet-grace" ? [product] : []));
  }
  files.set("sitemap.xml", INDEXABLE_ROUTES.map((route) => `<url><loc>${route === "/" ? `${SITE}/` : `${SITE}${route}`}</loc></url>`).join("\n"));
  files.set("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  files.set("llms.txt", `Call ${NAP.phones[0]} or ${NAP.email}. See ${SITE}/book\n`);
  files.set("assets/index.js", `const a="${NAP.phones[3]}";const b="mailto:${NAP.email}";const c="${PEARLY_IDS[0]}";`);
  return files;
}

const appSource = `const QuietGrace = lazy(() => import("./pages/seasonal/QuietGrace"));
<Route path="/seasoning/quiet-grace" element={<QuietGrace />} />`;
const pageSource = `<SEO title="Fixture /seasoning/quiet-grace" description="Description of /seasoning/quiet-grace" />
const packageItem = { id: 'fixture-package', name: 'The Fixture Package', price: 399 };`;

function distCtx(files: Files, options: { expectClarity?: string; page?: string; baseline?: RankBaseline } = {}): DistCtx {
  const pages: RankBaseline["pages"] = {};
  const good = goodDist();
  for (const route of RANK_ROUTES) pages[route] = rankEntryFromHtml(good.get(route === "/" ? "index.html" : `${route.slice(1)}/index.html`) as string);
  const sources: Record<string, string> = {
    "src/App.tsx": appSource,
    "src/pages/seasonal/QuietGrace.tsx": options.page ?? pageSource,
  };
  return {
    files,
    routes: INDEXABLE_ROUTES,
    baseline: options.baseline ?? { capturedFrom: "fixture", pages },
    readSource: (path) => sources[path],
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

function distCase(rule: string, name: string, expect: Case["expect"], edit: (files: Files) => void, options: Parameters<typeof distCtx>[1] = {}) {
  cases.push({
    rule,
    name,
    expect,
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
distCase("D-SITEMAP", "reports a missing URL", "fail", (files) => replaceIn(files, "sitemap.xml", `<url><loc>${SITE}/privacy</loc></url>`, ""));
distCase("D-SITEMAP", "reports a utility route", "fail", (files) => editFile(files, "sitemap.xml", `<url><loc>${SITE}/cart</loc></url>`));
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
liveCase("LV-404", "good fixture", "pass", () => checkMissing(chain([`${APEX}/does-not-exist`, 404])));
liveCase("LV-404", "reports a soft 404", "fail", () => checkMissing(chain([`${APEX}/does-not-exist`, 200])));
liveCase("LV-RAW", "good fixture", "pass", () => checkRaw("/areas/oak-bay", 200, `<html><head></head><body><h1>Title</h1><p>${"word ".repeat(200)}</p></body></html>`));
liveCase("LV-RAW", "reports a head-only page", "fail", () => checkRaw("/areas/oak-bay", 200, '<html><head><title>x</title></head><body><div id="root"></div></body></html>'));
liveCase("LV-REDIRECT", "good fixture", "pass", () => checkRedirect("/the-ritual", "/ritual", APEX, chain([`${APEX}/the-ritual`, 308], [`${APEX}/ritual`, 200])));
liveCase("LV-REDIRECT", "reports a temporary redirect", "fail", () => checkRedirect("/the-ritual", "/ritual", APEX, chain([`${APEX}/the-ritual`, 307], [`${APEX}/ritual`, 200])));
liveCase("LV-UTILITY", "good fixture", "pass", () => checkUtility("/cart", 200, '<meta name="robots" content="noindex,follow" data-rh="true" />'));
liveCase("LV-UTILITY", "reports no noindex", "fail", () => checkUtility("/cart", 200, "<html></html>"));

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
