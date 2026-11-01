/** Dist rules. Each check takes a DistCtx, so the self-test can run it on fixtures. */
import {
  BANS,
  BROWSER,
  CLARITY_PROJECT_ID,
  COPY_PAGES,
  FALLBACK,
  FAQ_FILES,
  FAQ_ROUTE,
  HELMET_META_KEYS,
  LASTMOD_FILE,
  MANIFEST,
  MISSING_PAGE,
  NAP,
  NO_H1_ROUTE,
  ORG,
  PARENT,
  PARITY_EXEMPT,
  PEARLY_IDS,
  RANK_ROUTES,
  RAW_MIN_WORD_SHARE,
  RENDER_BASELINE_FILE,
  REQUIRED,
  REQUIRED_ORDER,
  SITE,
  UTILITY_ROUTES,
} from "./rules";
import {
  attributes,
  bodyMarkup,
  bodyOf,
  canonicalJson,
  canonicalsOf,
  duplicateProblems,
  escapeRegex,
  type Finding,
  headOf,
  htmlFileOfRoute,
  isDate,
  isNode,
  jsonLdBlocksOf,
  type JsonNode,
  lastmodProblem,
  median,
  metaContent,
  missingPageProblems,
  parseBlock,
  rawHeadingsOf,
  rawProblems,
  rawTextOf,
  type RenderedPage,
  routeOfHtmlFile,
  sharedDateProblem,
  sitemapLastmods,
  SourceText,
  tagsNamed,
  titleOf,
  todayUtc,
  topNodes,
  trackedDateProblems,
  typesOf,
  UsageError,
} from "./lib";
import {
  checkAbsent,
  checkBan,
  checkConsult,
  checkExtGlass,
  checkPearly,
  checkRequired,
  checkRoof,
  copySegments,
  faqAnswers,
  faqQuestions,
  napProblems,
  type PrivateBans,
  type ScanFile,
  type SourceCtx,
} from "./source-checks";

export interface RankEntry {
  title: string;
  description: string;
  canonical: string;
  h1?: string;
}

export interface RankBaseline {
  capturedFrom: string;
  pages: Record<string, RankEntry>;
}

/** One route as a browser rendered it, with menus closed. */
export interface RenderEntry extends RenderedPage {
  finalPath: string;
  /** Set when the route needs a particular state to show its page. */
  scenario?: string;
  words: number;
  /** Set when this route was recaptured later than the rest of the baseline. */
  capturedFrom?: string;
}

export interface LcpRoute {
  runsMs: number[];
  medianMs: number;
}

/** One lab measurement of R1, made with BROWSER.lcp so a deployment can repeat it exactly. */
export interface LcpLab {
  measuredOn: string;
  target: string;
  browser: string;
  settings: typeof BROWSER.lcp.settings;
  routes: Record<string, LcpRoute>;
}

/** The Speed Insights reading R2-02 names. It means little without its sample count and dates. */
export interface LcpField {
  p75Ms: number;
  samples: number;
  from: string;
  to: string;
  readOn: string;
}

export interface RenderBaseline {
  capturedFrom: string;
  viewport: { width: number; height: number };
  routes: Record<string, RenderEntry>;
  /** Figures are measured or read, never estimated. */
  mobileLcp: { lab: LcpLab | null; field: LcpField | null; note: string };
}

/** The route list and the neighbourhood data, loaded as modules. */
export interface RouteManifest {
  /** Undefined when the list could not be loaded. listError then says why. */
  listed?: string[];
  listError?: string;
  /** One route per neighbourhood. Undefined when the data could not be loaded. */
  areas?: string[];
  /** Route to page file, from the list's `page` fields. Undefined when no entry names one. */
  pages?: Record<string, string>;
}

export interface DistCtx {
  /** Every file in dist, keyed by its path relative to dist. Text files only. */
  files: Map<string, string>;
  routes: string[];
  baseline: RankBaseline;
  renderBaseline?: RenderBaseline;
  /** Files under src and public that differ from the baseline's commit. Undefined when unknown. */
  baselineDrift?: string[];
  manifest: RouteManifest;
  privateBans: PrivateBans;
  readSource(path: string): string | undefined;
  /** The date of the last commit to a file, as YYYY-MM-DD. Undefined when git has none. */
  lastCommitDate(path: string): string | undefined;
  /** The dates of a file's commits, newest first, through renames. */
  commitDates(path: string): string[];
  /** The file as it stood at the end of a date, through renames. Undefined when it did not exist yet. */
  sourceOn(path: string, date: string): string | undefined;
  /** Each indexable route's date from LASTMOD_FILE. Undefined when the file cannot be read. */
  lastmods?: Record<string, string>;
  /** True in a shallow clone, where every older file reads as last changed at the clone's edge. */
  shallowClone?: boolean;
  sourcePages(): string[];
  expectClarity?: string;
  note?: (message: string) => void;
}

const htmlFiles = (ctx: DistCtx) =>
  [...ctx.files.entries()].filter(([path]) => path.endsWith(".html")).map(([path, html]) => ({ path, html }));

const scriptFiles = (ctx: DistCtx) =>
  [...ctx.files.entries()].filter(([path]) => path.endsWith(".js")).map(([path, text]) => ({ path, text }));

const textFiles = ["llms.txt", "robots.txt", "sitemap.xml"];

const blockNodes = (html: string) =>
  jsonLdBlocksOf(html).flatMap((block) => {
    const data = parseBlock(block);
    return data === undefined ? [] : topNodes(data);
  });

const isSameJson = (a: unknown, b: unknown) => canonicalJson(a) === canonicalJson(b);

export function checkParse(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  for (const { path, html } of htmlFiles(ctx)) {
    jsonLdBlocksOf(html).forEach((block, index) => {
      if (parseBlock(block) === undefined) findings.push({ rule: "D-PARSE", file: path, message: `JSON-LD block ${index + 1} does not parse` });
    });
  }
  return findings;
}

export function checkDup(ctx: DistCtx): Finding[] {
  return htmlFiles(ctx).flatMap(({ path, html }) =>
    duplicateProblems(jsonLdBlocksOf(html)).map((message) => ({ rule: "D-DUP", file: path, message }))
  );
}

export function checkHead(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  for (const { path, html } of htmlFiles(ctx)) {
    const head = headOf(html);
    const missing: string[] = [];
    for (const tag of tagsNamed(head, "meta")) {
      const attrs = attributes(tag);
      const key = attrs.name ?? attrs.property;
      if (HELMET_META_KEYS.includes(key) && attrs["data-rh"] !== "true") missing.push(key);
    }
    for (const tag of tagsNamed(head, "link")) {
      const attrs = attributes(tag);
      if (attrs.rel === "canonical" && attrs["data-rh"] !== "true") missing.push("canonical");
    }
    for (const tag of tagsNamed(head, "script")) {
      const attrs = attributes(tag);
      if (attrs.type === "application/ld+json" && attrs["data-rh"] !== "true") missing.push("JSON-LD");
    }
    if (missing.length > 0) {
      findings.push({ rule: "D-HEAD", row: "FR-2", file: path, message: `no data-rh="true" on: ${[...new Set(missing)].join(", ")}` });
    }
  }
  return findings;
}

function orgProblems(node: JsonNode): string[] {
  const problems: string[] = [];
  if (!isSameJson(node["@type"], ORG.types)) problems.push(`@type should be ${ORG.types.join(" + ")}`);
  for (const [key, value] of Object.entries(ORG.exact)) {
    if (!isSameJson(node[key], value)) problems.push(`${key} does not match the schema contract`);
  }
  for (const key of ORG.keptKeys) if (node[key] === undefined) problems.push(`${key} is missing`);

  const areas = Array.isArray(node.areaServed) ? node.areaServed : [];
  const firstArea = isNode(areas[0]) ? areas[0].name : undefined;
  if (firstArea !== ORG.firstArea) problems.push(`the first areaServed entry should be "${ORG.firstArea}"`);
  if (areas.length !== ORG.areaCount) problems.push(`areaServed has ${areas.length} entries, expected ${ORG.areaCount}`);

  const sameAs = Array.isArray(node.sameAs) ? node.sameAs : [];
  if (!sameAs.includes(ORG.instagram)) problems.push("sameAs is missing Instagram");
  for (const url of sameAs) {
    const allowed = url === ORG.instagram || (typeof url === "string" && url.startsWith(ORG.mapsPrefix));
    if (!allowed) problems.push(`sameAs holds ${String(url)}`);
  }
  const hasMap = node.hasMap;
  if (hasMap !== undefined && !(typeof hasMap === "string" && hasMap.startsWith(ORG.mapsPrefix))) {
    problems.push("hasMap is not a Google Maps URL");
  }
  return problems;
}

export function checkOrg(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  let reference: string | undefined;
  let sample: JsonNode | undefined;

  for (const { path, html } of htmlFiles(ctx)) {
    if (jsonLdBlocksOf(html).some((block) => block.includes("share.google"))) {
      findings.push({ rule: "D-ORG", file: path, message: "share.google appears in JSON-LD" });
    }
    const org = blockNodes(html).find((node) => node["@id"] === ORG.id);
    if (!org) {
      findings.push({ rule: "D-ORG", file: path, message: `no ${ORG.id} node` });
      continue;
    }
    const json = canonicalJson(org);
    if (reference === undefined) {
      reference = json;
      sample = org;
      for (const message of orgProblems(org)) findings.push({ rule: "D-ORG", file: path, message });
    } else if (json !== reference) {
      findings.push({ rule: "D-ORG", file: path, message: "the organization node differs from the first page" });
    }
  }

  if (sample) {
    const sameAs = Array.isArray(sample.sameAs) ? sample.sameAs.length : 0;
    ctx.note?.(`D-ORG: sameAs entries: ${sameAs}, hasMap: ${sample.hasMap ? "present" : "absent"}`);
  }
  return findings;
}

export function checkParent(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  for (const { path, html } of htmlFiles(ctx)) {
    const route = routeOfHtmlFile(path);
    const parent = blockNodes(html).find((node) => node["@id"] === PARENT.id);
    if (route === "/") {
      if (!parent) {
        findings.push({ rule: "D-PARENT", file: path, message: `no ${PARENT.id} node on the home page` });
        continue;
      }
      if (parent.name !== PARENT.name) findings.push({ rule: "D-PARENT", file: path, message: `name should be "${PARENT.name}"` });
      if (parent.legalName !== PARENT.legalName) findings.push({ rule: "D-PARENT", file: path, message: `legalName should be "${PARENT.legalName}"` });
      const ids = Array.isArray(parent.subOrganization)
        ? parent.subOrganization.map((item) => (isNode(item) ? item["@id"] : undefined))
        : [];
      if (!isSameJson(ids, PARENT.subOrganization)) findings.push({ rule: "D-PARENT", file: path, message: "subOrganization does not match the schema contract" });
    } else if (parent) {
      findings.push({ rule: "D-PARENT", file: path, message: `${PARENT.id} appears outside the home page` });
    }
  }
  return findings;
}

export function checkNapDist(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  const add = (file: string, message: string) => findings.push({ rule: "D-NAP", file, message });

  for (const { path, html } of htmlFiles(ctx)) for (const message of napProblems(html)) add(path, message);
  for (const path of textFiles) {
    const text = ctx.files.get(path);
    if (text !== undefined) for (const message of napProblems(text)) add(path, message);
  }

  const retired = new RegExp(NAP.retired);
  for (const { path, text } of scriptFiles(ctx)) {
    for (const match of text.matchAll(/tel:[+\d(][^"'`\s]*/g)) {
      if (!NAP.phones.includes(match[0])) add(path, `tel: value not allowed: ${match[0]}`);
    }
    for (const match of text.matchAll(/mailto:[\w.%+-]+@[^"'`\s]*/g)) {
      if (match[0].split("?")[0] !== `mailto:${NAP.email}`) add(path, `mailto: value not allowed: ${match[0]}`);
    }
    if (retired.test(text)) add(path, "the retired phone number appears in JS");
  }
  return findings;
}

function pearlyProblemsInJson(value: unknown, key: string, problems: string[]) {
  if (typeof value === "string") {
    if (value.includes("pearlys.ca") && !(key === "@id" && PEARLY_IDS.includes(value))) {
      problems.push(`pearlys.ca in JSON-LD key "${key}": ${value}`);
    }
  } else if (Array.isArray(value)) value.forEach((item) => pearlyProblemsInJson(item, key, problems));
  else if (isNode(value)) for (const [childKey, child] of Object.entries(value)) pearlyProblemsInJson(child, childKey, problems);
}

export function checkPearlyDist(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  for (const { path, html } of htmlFiles(ctx)) {
    const problems: string[] = [];
    const blocks = jsonLdBlocksOf(html);
    let outside = html;
    for (const block of blocks) {
      outside = outside.replace(block, "");
      const data = parseBlock(block);
      if (data !== undefined) pearlyProblemsInJson(data, "", problems);
    }
    if (outside.includes("pearlys.ca")) problems.push("pearlys.ca appears outside JSON-LD");
    for (const message of [...new Set(problems)]) findings.push({ rule: "D-PEARLY", file: path, message });
  }

  for (const path of textFiles) {
    if (ctx.files.get(path)?.includes("pearlys.ca")) findings.push({ rule: "D-PEARLY", file: path, message: "pearlys.ca appears in this file" });
  }

  for (const { path, text } of scriptFiles(ctx)) {
    for (const match of text.matchAll(/(href[=:]\s*["'`]?)?(?:https?:\/\/)?(?:www\.)?pearlys\.ca[^"'`\s]*/g)) {
      const url = match[0].replace(match[1] ?? "", "");
      if (match[1] || !PEARLY_IDS.includes(url)) {
        findings.push({ rule: "D-PEARLY", file: path, message: `pearlys.ca in JS outside the two allowed @id values: ${match[0]}` });
      }
    }
  }
  return findings;
}

export function checkHost(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  const wrongHost = /\bhttps?:\/\/(?:www\.)wabisabiservices\.ca|\bhttp:\/\/wabisabiservices\.ca/g;
  const scan = (file: string, text: string) => {
    for (const match of new Set([...text.matchAll(wrongHost)].map((item) => item[0]))) {
      findings.push({ rule: "D-HOST", file, message: `uses ${match}` });
    }
  };

  for (const { path, html } of htmlFiles(ctx)) {
    scan(path, html);
    for (const key of ["og:url", "twitter:url"]) {
      const value = metaContent(html, key);
      if (value !== undefined && !value.startsWith(SITE)) findings.push({ rule: "D-HOST", file: path, message: `${key} is ${value}` });
    }
    for (const canonical of canonicalsOf(html)) {
      if (!canonical.startsWith(SITE)) findings.push({ rule: "D-HOST", file: path, message: `canonical is ${canonical}` });
    }
  }
  for (const path of textFiles) {
    const text = ctx.files.get(path);
    if (text !== undefined) scan(path, text);
  }

  const sitemapLine = /^Sitemap:\s*(.+)$/im.exec(ctx.files.get("robots.txt") ?? "")?.[1]?.trim();
  if (sitemapLine && sitemapLine !== `${SITE}/sitemap.xml`) findings.push({ rule: "D-HOST", file: "robots.txt", message: `Sitemap line is ${sitemapLine}` });
  return findings;
}

export function checkTodo(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  for (const { path, html } of htmlFiles(ctx)) {
    if (html.includes("TODO")) findings.push({ rule: "D-TODO", file: path, message: "contains TODO" });
  }
  for (const path of textFiles) {
    if (ctx.files.get(path)?.includes("TODO")) findings.push({ rule: "D-TODO", file: path, message: "contains TODO" });
  }
  for (const { path, text } of scriptFiles(ctx)) {
    if (text.includes("TODO(Justin)")) findings.push({ rule: "D-TODO", file: path, message: "contains TODO(Justin)" });
  }
  return findings;
}

const expectedCanonical = (route: string) => (route === "/" ? `${SITE}/` : `${SITE}${route}`);

const isNoindex = (html: string) => (metaContent(html, "robots") ?? "").includes("noindex");

export function checkRoutes(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  const add = (message: string, file?: string) => findings.push({ rule: "D-ROUTES", file, message });
  const pages = htmlFiles(ctx).filter(({ path }) => /(?:^|\/)index\.html$/.test(path));
  const built = new Set(pages.map(({ path }) => routeOfHtmlFile(path)));

  // The utility routes need files too: with no catch-all, Stripe's return URLs would be 404s.
  for (const route of [...ctx.routes, ...UTILITY_ROUTES]) if (!built.has(route)) add(`no built HTML for ${route}`);
  for (const route of built) {
    const file = htmlFileOfRoute(route);
    if (UTILITY_ROUTES.includes(route)) {
      if (!isNoindex(ctx.files.get(file) as string)) add(`${route} has no noindex`, file);
    } else if (!ctx.routes.includes(route)) add(`unexpected built HTML for ${route}`);
  }
  const noH1 = ctx.files.get(htmlFileOfRoute(NO_H1_ROUTE));
  if (noH1 !== undefined && rawHeadingsOf(noH1).length > 0) add(`${NO_H1_ROUTE} must build in its empty-cart state, which has no H1`, htmlFileOfRoute(NO_H1_ROUTE));

  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const { path, html } of pages) {
    const route = routeOfHtmlFile(path);
    const canonicals = canonicalsOf(html);
    if (canonicals.length !== 1 || canonicals[0] !== expectedCanonical(route)) {
      add(`canonical is ${canonicals.join(", ") || "missing"}, expected ${expectedCanonical(route)}`, path);
    }
    const title = titleOf(html);
    const description = metaContent(html, "description") ?? "";
    if (titles.has(title)) add(`title also used by ${titles.get(title)}`, path);
    if (descriptions.has(description)) add(`description also used by ${descriptions.get(description)}`, path);
    titles.set(title, path);
    descriptions.set(description, path);
  }
  return findings;
}

const sitemapLocs = (sitemap: string) => new Set([...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]));

/** One place a route's copy comes from. slug narrows the shared area data to this route's entry. */
interface CopySource {
  file: string;
  slug?: string;
}

/** Where a route's copy comes from, found the way D-COPY finds it, with the area template added. */
function routeSources(ctx: DistCtx): Map<string, CopySource[]> {
  const sources = new Map<string, CopySource[]>();
  for (const [file, route] of pageRoutes(ctx)) {
    const alias = COPY_PAGES.aliases[file];
    const files = [file, ...(alias ? [alias] : []), ...(COPY_PAGES.pageData[file] ?? [])];
    sources.set(route, files.map((item) => ({ file: item })));
  }
  for (const route of ctx.routes) {
    if (!route.startsWith(COPY_PAGES.areaPrefix)) continue;
    sources.set(route, [{ file: COPY_PAGES.areaFile, slug: route.slice(COPY_PAGES.areaPrefix.length) }, { file: COPY_PAGES.areaTemplate }]);
  }
  return sources;
}

/** One neighbourhood's entry, so a change to Sidney's copy says nothing about Oak Bay's date. */
const areaEntry = (text: string, slug: string) => new RegExp(`^ {2}"?${escapeRegex(slug)}"?: \\{[\\s\\S]*?^ {2}\\},?\\s*$`, "m").exec(text)?.[0];

/** A source's copy as one string. Undefined when the source had no such copy. */
function copyOf({ file, slug }: CopySource, text: string | undefined): string | undefined {
  const part = text !== undefined && slug ? areaEntry(text, slug) : text;
  if (part === undefined) return undefined;
  const segments = copySegments(file, slug ? `({${part}})` : part, true);
  return segments.map((segment) => segment.text.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
}

/**
 * R2-FR-15: a date must reflect real content changes. A route's source is the files routeSources
 * names, and this accepts any real date, up to today, with no copy change in those sources after it:
 *
 * - The date of a source's last commit, or anything later. A later date can be honest, because a
 *   page's content can come from data outside these files. The build date this used to catch has
 *   one shape, a date shared by every URL, which sharedDateProblem rejects here and LV-SITEMAP
 *   rejects on the deployed file.
 * - An older date, when the commits after it changed no copy, because a refactor is not a content
 *   change. Copy is every string, JSX text and number in the version in force on that date, and for
 *   an area page, in its own entry in the shared data. So a changed code string counts as copy, and
 *   such a page takes the later date, which always passes.
 *
 * It rejects an older date when the copy did change after it, or when the source did not exist yet.
 */
function routeLastmodProblem(ctx: DistCtx, route: string, date: string | undefined, sources: CopySource[] | undefined): string | undefined {
  const problem = lastmodProblem(route, date);
  if (problem || !date) return problem;
  if (!sources) return `${route}: no source file found, so its lastmod cannot be checked`;
  if (ctx.shallowClone) return undefined;
  for (const source of sources) {
    const changed = ctx.lastCommitDate(source.file);
    if (!changed) return `${route}: git has no commit date for ${source.file}`;
    if (date >= changed) continue;
    const before = copyOf(source, ctx.sourceOn(source.file, date));
    if (before === undefined) return `${route}: lastmod ${date} is before ${source.file} existed`;
    if (before !== copyOf(source, ctx.readSource(source.file))) return `${route}: lastmod ${date} is older than a copy change in ${source.file}, whose last commit is ${changed}`;
  }
  return undefined;
}

/** The day a source's copy took its current form: walks back through its commits to the last change. */
function lastCopyChange(ctx: DistCtx, source: CopySource): string | undefined {
  const current = copyOf(source, ctx.readSource(source.file));
  if (current === undefined) return undefined;
  let date: string | undefined;
  for (const day of ctx.commitDates(source.file)) {
    if (copyOf(source, ctx.sourceOn(source.file, day)) !== current) break;
    date = day;
  }
  return date;
}

/** What --write-lastmod saves: each route's latest copy change across its sources, as D-SITEMAP reads them. */
export function lastCopyDates(ctx: DistCtx): Record<string, string> {
  const sources = routeSources(ctx);
  const dates: Record<string, string> = {};
  for (const route of ctx.routes) {
    const changes = (sources.get(route) ?? []).map((source) => lastCopyChange(ctx, source));
    if (changes.length === 0 || changes.includes(undefined)) throw new UsageError(`${route}: its copy matches no commit, so commit the change first`);
    dates[route] = (changes as string[]).sort().pop() as string;
  }
  return dates;
}

/** The latest commit behind each route, for telling whether pages have different histories. */
function routeHistories(ctx: DistCtx, sources: Map<string, CopySource[]>): string[] {
  return ctx.routes.flatMap((route) => {
    const dates = (sources.get(route) ?? []).flatMap(({ file }) => ctx.lastCommitDate(file) ?? []);
    return dates.length > 0 ? [dates.sort().pop() as string] : [];
  });
}

export function checkSitemap(ctx: DistCtx): Finding[] {
  const sitemap = ctx.files.get("sitemap.xml");
  if (sitemap === undefined) return [{ rule: "D-SITEMAP", message: "dist/sitemap.xml is missing" }];
  const locs = sitemapLocs(sitemap);
  const expected = new Set(ctx.routes.map(expectedCanonical));
  const findings: Finding[] = [];
  for (const url of expected) if (!locs.has(url)) findings.push({ rule: "D-SITEMAP", file: "sitemap.xml", message: `missing ${url}` });
  for (const url of locs) if (!expected.has(url)) findings.push({ rule: "D-SITEMAP", file: "sitemap.xml", message: `not an indexable route: ${url}` });
  // This reads the page itself, so it also catches an indexable route marked noindex by mistake.
  for (const url of locs) {
    const html = ctx.files.get(htmlFileOfRoute(url.slice(SITE.length) || "/"));
    if (html !== undefined && isNoindex(html)) findings.push({ rule: "D-SITEMAP", file: "sitemap.xml", message: `lists a noindex page: ${url}` });
  }

  const add = (message: string) => findings.push({ rule: "D-SITEMAP", row: "R2-FR-15", file: "sitemap.xml", message });
  const lastmods = sitemapLastmods(sitemap);
  if (!ctx.lastmods) add(`${LASTMOD_FILE} could not be read`);
  else for (const message of trackedDateProblems(lastmods, ctx.lastmods, SITE)) add(message);
  const sources = routeSources(ctx);
  for (const route of ctx.routes) {
    const url = expectedCanonical(route);
    if (!lastmods.has(url)) continue;
    const message = routeLastmodProblem(ctx, route, lastmods.get(url), sources.get(route));
    if (message) add(message);
  }
  if (ctx.shallowClone) add("this clone is shallow, so git cannot date the pages. Run git fetch --unshallow.");
  else {
    const dates = [...lastmods.values()].filter((date): date is string => Boolean(date));
    const shared = sharedDateProblem(dates, routeHistories(ctx, sources));
    if (shared) add(shared);
  }
  return findings;
}

/** Component name to route, read from the router, so no second route map is kept. */
function routesByComponent(appText: string): Map<string, string> {
  const fileToComponent = new Map<string, string>();
  for (const match of appText.matchAll(/const (\w+) = lazy\(\(\) => import\("\.\/pages\/([^"]+)"\)\)/g)) {
    fileToComponent.set(`src/pages/${match[2]}.tsx`, match[1]);
  }
  const componentToRoute = new Map<string, string>();
  for (const match of appText.matchAll(/<Route path="([^"]+)" element=\{(?:<Layout>)?<(\w+) \/>/g)) {
    componentToRoute.set(match[2], match[1]);
  }
  const routes = new Map<string, string>();
  for (const [file, component] of fileToComponent) {
    const route = componentToRoute.get(component);
    if (route) routes.set(file, route);
  }
  return routes;
}

/** Page file to route: from the route list when it names them, otherwise from the router. */
function pageRoutes(ctx: DistCtx): Map<string, string> {
  const { pages } = ctx.manifest;
  if (pages) return new Map(Object.entries(pages).map(([route, page]) => [`src/pages/${page}.tsx`, route]));
  return routesByComponent(ctx.readSource(MANIFEST.appFile) ?? "");
}

const jsxAttribute = (block: string, name: string) => {
  const match = new RegExp(`\\b${name}=(?:"([^"]*)"|\\{"((?:[^"\\\\]|\\\\.)*)"\\})`).exec(block);
  return match ? (match[1] ?? match[2]).replace(/&apos;/g, "'").replace(/&amp;/g, "&") : undefined;
};

const seoBlocks = (text: string) => [...text.matchAll(/<SEO\b[\s\S]*?\/>/g)].map((match) => match[0]);

const fileStem = (path: string) => path.split("/").pop()?.replace(/\.tsx$/, "") ?? path;

function pricesOf(pageText: string): Map<string, number> {
  const prices = new Map<string, number>();
  for (const match of pageText.matchAll(/name:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"),\s*(?:slug:\s*"[^"]*",\s*)?price:\s*(\d+)/g)) {
    const name = (match[1] ?? match[2]).replace(/\\'/g, "'");
    if (name.startsWith("The ")) prices.set(name, Number(match[3]));
  }
  return prices;
}

export function checkParity(ctx: DistCtx): Finding[] {
  if (ctx.readSource(MANIFEST.appFile) === undefined) return [{ rule: "D-PARITY", message: `${MANIFEST.appFile} not found` }];
  const routes = pageRoutes(ctx);
  const findings: Finding[] = [];
  let pagesCompared = 0;
  let pricesCompared = 0;

  for (const path of ctx.sourcePages()) {
    if (PARITY_EXEMPT.includes(fileStem(path))) continue;
    const route = routes.get(path);
    const text = ctx.readSource(path);
    // A page this parser cannot place would otherwise pass without being compared.
    if (!route || text === undefined) {
      findings.push({ rule: "D-PARITY", file: path, message: "not compared: no route found for this page in the router" });
      continue;
    }
    const htmlPath = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
    const html = ctx.files.get(htmlPath);
    if (html === undefined) {
      findings.push({ rule: "D-PARITY", file: path, message: `no built HTML for ${route}` });
      continue;
    }
    pagesCompared++;

    for (const block of seoBlocks(text)) {
      const title = jsxAttribute(block, "title");
      const description = jsxAttribute(block, "description");
      if (title !== undefined && titleOf(html) !== `${title} | Wabi Sabi Services`) {
        findings.push({ rule: "D-PARITY", file: path, message: `title differs from built HTML: "${titleOf(html)}"` });
      }
      if (description !== undefined && metaContent(html, "description") !== description) {
        findings.push({ rule: "D-PARITY", file: path, message: "description differs from built HTML" });
      }
    }

    if (path.startsWith("src/pages/seasonal/")) {
      const built = new Map<string, number>();
      const listed = /availability:\s*"([^"]+)"/.exec(text)?.[1];
      for (const node of blockNodes(html)) {
        if (!typesOf(node).includes("Product") || !isNode(node.offers)) continue;
        built.set(String(node.name), Number(node.offers.price));
        if (listed && node.offers.availability !== listed) {
          findings.push({ rule: "D-PARITY", row: "DJ-19 and DJ-21", file: path, message: `${String(node.name)} is ${listed} on the page and ${String(node.offers.availability)} in built HTML` });
        }
      }
      for (const [name, price] of pricesOf(text)) {
        pricesCompared++;
        if (built.get(name) !== price) {
          findings.push({ rule: "D-PARITY", row: "T-28", file: path, message: `${name} costs ${price} on the page and ${built.get(name)} in built HTML` });
        }
      }
    }
  }
  ctx.note?.(`D-PARITY: compared ${pagesCompared} pages and ${pricesCompared} package prices`);
  return findings;
}

export function checkRank(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  for (const route of RANK_ROUTES) {
    const expected = ctx.baseline.pages[route];
    const file = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
    const html = ctx.files.get(file);
    if (!expected) findings.push({ rule: "D-RANK", message: `no baseline for ${route}` });
    else if (html === undefined) findings.push({ rule: "D-RANK", file, message: `no built HTML for ${route}` });
    else {
      const actual = { title: titleOf(html), description: metaContent(html, "description"), canonical: canonicalsOf(html)[0] };
      for (const key of ["title", "description", "canonical"] as const) {
        if (actual[key] !== expected[key]) findings.push({ rule: "D-RANK", file, message: `${key} changed from the baseline: "${actual[key]}"` });
      }
    }
  }
  return findings;
}

export function checkClarity(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  const all = [...ctx.files.entries()];
  if (ctx.expectClarity) {
    if (!all.some(([, text]) => text.includes(ctx.expectClarity as string))) {
      findings.push({ rule: "D-CLARITY", row: "FR-3", message: "the expected Clarity ID is not in dist" });
    }
  }
  if (ctx.expectClarity !== CLARITY_PROJECT_ID) {
    for (const [path, text] of all) {
      if (text.includes(CLARITY_PROJECT_ID)) findings.push({ rule: "D-CLARITY", row: "FR-3", file: path, message: "the real project ID is in this build" });
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Release 2: raw HTML
// ---------------------------------------------------------------------------

export function checkRaw(ctx: DistCtx): Finding[] {
  const baseline = ctx.renderBaseline;
  if (!baseline) return [{ rule: "D-RAW", message: "no render baseline: run npm run verify:browser -- --write-render-baseline" }];

  const findings: Finding[] = [];
  const add = (message: string, file?: string) => findings.push({ rule: "D-RAW", row: "R2-FR-01", file, message });
  for (const route of [...ctx.routes, ...UTILITY_ROUTES]) if (!baseline.routes[route]) add(`no baseline for ${route}`);
  const answers = faqAnswers(ctx.readSource(FAQ_FILES.data) ?? "");

  for (const route of ctx.routes) {
    const entry = baseline.routes[route];
    const file = htmlFileOfRoute(route);
    const html = ctx.files.get(file);
    if (html === undefined) {
      add(`no built HTML for ${route}`);
      continue;
    }
    if (!entry) continue;
    for (const problem of rawProblems(entry, html, RAW_MIN_WORD_SHARE, route === FAQ_ROUTE ? answers : [])) add(problem, file);
  }

  // The baseline is the Release 1 record, so it ages. BR-RAW compares raw and rendered in one build.
  if (ctx.baselineDrift?.length) {
    ctx.note?.(
      `D-RAW: warning: files under src or public changed since the baseline at ${baseline.capturedFrom} (${ctx.baselineDrift.length}), so a difference here may mean the baseline is old. BR-RAW compares this build. Recapture with verify:browser --write-render-baseline --route=<routes>.`
    );
  }
  return findings;
}

export function checkFaqRaw(ctx: DistCtx): Finding[] {
  const finding = (message: string, file?: string): Finding => ({ rule: "D-FAQRAW", row: "R2-FR-04", file, message });
  const file = htmlFileOfRoute("/faq");
  const html = ctx.files.get(file);
  const data = ctx.readSource(FAQ_FILES.data);
  if (html === undefined) return [finding("no built HTML for /faq")];
  if (data === undefined) return [finding("FAQ data not found", FAQ_FILES.data)];

  const answers = faqAnswers(data);
  if (answers.length === 0) return [finding("no FAQ answers found", FAQ_FILES.data)];
  const findings: Finding[] = [];
  const questions = faqQuestions(data).length;
  if (answers.length !== questions) findings.push(finding(`${questions} FAQ questions, but only ${answers.length} answers could be read as plain strings`, FAQ_FILES.data));
  const text = rawTextOf(html);
  const missing = answers.filter((answer) => !text.includes(answer.replace(/\s+/g, " ").trim()));
  return [...findings, ...missing.map((answer) => finding(`answer not in raw HTML: "${answer.slice(0, 60)}..."`, file))];
}

export function checkNoFallback(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  for (const { path, html } of htmlFiles(ctx)) {
    const add = (message: string) => findings.push({ rule: "D-NOFALLBACK", row: "R2-FR-05", file: path, message });
    const body = bodyOf(html);
    if (body.includes(FALLBACK.busy)) add("raw HTML holds the loading fallback");
    if (FALLBACK.suspenseMarkers.some((marker) => body.includes(marker))) add("a Suspense boundary did not finish rendering");
    const root = bodyMarkup(html).replace(/<div id="root"[^>]*>/, "").replace(/<\/div>\s*$/, "");
    if (root.trim() === "") add("#root is empty, so the page is not in the raw HTML");
  }
  return findings;
}

export function checkMissingPage(ctx: DistCtx): Finding[] {
  const { file, brand } = MISSING_PAGE;
  const finding = (message: string): Finding => ({ rule: "D-404", row: "R2-FR-08", file, message });
  const html = ctx.files.get(file);
  if (html === undefined) return [finding("the 404 page is not in dist")];
  return missingPageProblems(html, SITE, brand).map(finding);
}

function lcpLabProblems(lab: LcpLab): string[] {
  const { liveFrom, routes, runs, settings } = BROWSER.lcp;
  const problems: string[] = [];
  if (!isDate(lab.measuredOn) || lab.measuredOn < liveFrom) problems.push(`measuredOn is ${lab.measuredOn}, but R1 went live on ${liveFrom}`);
  else if (lab.measuredOn > todayUtc()) problems.push(`measuredOn is ${lab.measuredOn}, which is later than today in UTC`);
  if (lab.target !== SITE) problems.push(`the target is ${lab.target || "missing"}, but the R1 figure must come from ${SITE}`);
  if (!lab.browser) problems.push("no browser version");
  if (!isSameJson(lab.settings, settings)) problems.push("the settings differ from BROWSER.lcp.settings, so no deployment can repeat this run");
  for (const route of routes) {
    const entry = lab.routes?.[route];
    if (!entry) problems.push(`no figure for ${route}`);
    else if (entry.runsMs.length < runs || entry.runsMs.some((value) => !(value > 0))) problems.push(`${route} needs ${runs} positive runs`);
    else if (entry.medianMs !== median(entry.runsMs)) problems.push(`${route}: medianMs is not the median of its runs`);
  }
  return problems;
}

function lcpFieldProblems(field: LcpField): string[] {
  const { liveFrom } = BROWSER.lcp;
  const problems: string[] = [];
  if (!(field.p75Ms > 0)) problems.push("the field figure has no p75Ms");
  if (!(field.samples > 0)) problems.push("the field figure has no sample count");
  if (![field.from, field.to, field.readOn].every(isDate)) problems.push("the field figure needs from, to and readOn dates");
  else if (field.from < liveFrom || field.to < field.from || field.readOn < field.to) {
    problems.push(`the field dates must start on or after ${liveFrom}, run in order and end by readOn`);
  }
  return problems;
}

/** R2-FR-12 compares against the R1 figure, and R1 stops being live at the R2 deploy. */
export function checkLcp(ctx: DistCtx): Finding[] {
  const finding = (message: string): Finding => ({ rule: "D-LCP", row: "R2-FR-12", file: RENDER_BASELINE_FILE, message });
  const lcp = ctx.renderBaseline?.mobileLcp;
  if (!lcp) return [finding("no mobile LCP in the render baseline")];
  if (!lcp.lab) return [finding(`the R1 lab LCP is not measured. While R1 is live, run npm run verify:browser -- --measure-lcp --base=${SITE}`)];
  // Only Justin can read it or accept the lab figure in its place, so this warns and does not fail.
  if (!lcp.field) ctx.note?.("D-LCP: warning: no Speed Insights reading is saved. R2-02 names one, and R1 stops being live at the R2 deploy, so save mobileLcp.field before then or record that the lab figure replaces it.");
  return [...lcpLabProblems(lcp.lab), ...(lcp.field ? lcpFieldProblems(lcp.field) : [])].map(finding);
}

/** Every link in llms.txt on this site, as a route or a file path. */
function llmsPaths(text: string): string[] {
  const links = text.split(/[\s()[\]"'<>]+/).filter((word) => word.startsWith(SITE));
  return [...new Set(links.map((link) => link.slice(SITE.length).replace(/[.,;:]+$/, "").replace(/\/$/, "") || "/"))];
}

/** The router's paths: plain strings, and the expressions for paths built at run time. */
function routerPaths(app: string) {
  const plain = [...app.matchAll(/<Route\b[^>]*?\bpath="([^"]+)"/g)].map((match) => match[1]).filter((path) => path !== "*");
  const built = [...app.matchAll(/<Route\b[^>]*?\bpath=\{(`[^`]*`|[^}]*)\}/g)].map((match) => match[1].trim());
  return { plain, built };
}

/** The router uses the imported list in code, under whatever name it imported it. */
function usesRouteList(app: string): boolean {
  const { routeExport, routeImport } = MANIFEST;
  const statement = new RegExp(`import\\s*\\{([^}]*)\\}\\s*${routeImport}`).exec(app);
  const binding = statement?.[1].split(",").map((item) => item.trim().split(/\s+as\s+/)).find(([name]) => name === routeExport);
  if (!statement || !binding) return false;
  const code = app.replace(statement[0], "").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  return new RegExp(`\\b${binding[binding.length - 1]}\\b`).test(code);
}

type AddFinding = (message: string, file?: string) => void;

function checkRouter(ctx: DistCtx, known: Set<string>, add: AddFinding) {
  const { appFile, areaTemplate, routeImport } = MANIFEST;
  const app = ctx.readSource(appFile) ?? "";
  const readsList = new RegExp(routeImport).test(app);
  const { plain, built } = routerPaths(app);

  if (ctx.manifest.listed !== undefined && !readsList) add("the router does not read the route list", appFile);
  if (!readsList && plain.length + built.length === 0) add("no routes could be read from the router", appFile);
  for (const route of plain) if (!known.has(route)) add(`the router serves ${route}, which is not a known route`, appFile);

  // A path built from the route list is compared through the list itself, which must then name
  // each route's page file, because the router has no line left for D-COPY and D-PARITY to read.
  // An import alone proves nothing, and a path written beside it is the second list R2-FR-11 removes.
  if (readsList) {
    if (!usesRouteList(app)) add("the router imports the route list but does not build its routes from it", appFile);
    for (const route of plain) if (known.has(route)) add(`${route} is written by hand beside the route list`, appFile);
    for (const route of ctx.manifest.listed ?? []) {
      if (!route.startsWith(COPY_PAGES.areaPrefix) && !ctx.manifest.pages?.[route]) add(`${route} names no page file`, MANIFEST.routeFile);
    }
    return;
  }
  const served = new Set(plain);
  for (const path of built) {
    if (path === areaTemplate) ctx.manifest.areas?.forEach((route) => served.add(route));
    else add(`the router builds a path this rule cannot read: ${path}`, appFile);
  }
  for (const route of known) if (!served.has(route)) add(`${route} is not in the router`, appFile);
}

function checkAreaRoutes(ctx: DistCtx, known: Set<string>, add: AddFinding) {
  const { areas } = ctx.manifest;
  if (areas === undefined) {
    add("the neighbourhood data could not be loaded", COPY_PAGES.areaFile);
    return;
  }
  for (const route of areas) if (!known.has(route)) add(`${route} is in the neighbourhood data but is not a known route`, COPY_PAGES.areaFile);
  for (const route of known) {
    if (route.startsWith(COPY_PAGES.areaPrefix) && !areas.includes(route)) add(`${route} has no neighbourhood data`, COPY_PAGES.areaFile);
  }
}

export function checkManifest(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  const add: AddFinding = (message, file) => findings.push({ rule: "D-MANIFEST", row: "R2-FR-11", file, message });
  const known = new Set([...ctx.routes, ...UTILITY_ROUTES]);

  const { listed, listError } = ctx.manifest;
  if (listed === undefined) {
    add(`no single route list (${listError}): the router, build, sitemap and harness must all read this file`, MANIFEST.routeFile);
  } else {
    for (const route of known) if (!listed.includes(route)) add(`${route} is not in the route list`, MANIFEST.routeFile);
    for (const route of listed) if (!known.has(route)) add(`${route} is in the route list but not in the harness`, MANIFEST.routeFile);
  }
  // The harness takes its routes from the list, so a route dropped from it would agree with itself.
  // The saved Release 1 record is the check that does not come from the list.
  for (const route of Object.keys(ctx.renderBaseline?.routes ?? {})) {
    if (!known.has(route)) add(`${route} is in the render baseline but not in the route list`, MANIFEST.routeFile);
  }
  checkAreaRoutes(ctx, known, add);
  checkRouter(ctx, known, add);

  const sitemap = ctx.files.get("sitemap.xml");
  if (sitemap === undefined) add("dist/sitemap.xml is missing");
  else {
    const locs = sitemapLocs(sitemap);
    for (const route of ctx.routes) if (!locs.has(expectedCanonical(route))) add(`${route} is not in the sitemap`, "sitemap.xml");
    for (const loc of locs) {
      const route = loc.slice(SITE.length).replace(/\/$/, "") || "/";
      if (!ctx.routes.includes(route)) add(`the sitemap lists ${loc}, which is not an indexable route`, "sitemap.xml");
    }
  }

  const built = new Set(
    htmlFiles(ctx)
      .filter(({ path }) => /(?:^|\/)index\.html$/.test(path))
      .map(({ path }) => routeOfHtmlFile(path))
  );
  for (const route of known) if (!built.has(route)) add(`no built file for ${route}`);
  for (const route of built) if (!known.has(route)) add(`built file for ${route}, which is not a known route`);
  for (const route of UTILITY_ROUTES) {
    const file = htmlFileOfRoute(route);
    if (built.has(route) && !isNoindex(ctx.files.get(file) as string)) add(`the built file for ${route} has no noindex`, file);
  }

  for (const path of llmsPaths(ctx.files.get("llms.txt") ?? "")) {
    if (!known.has(path) && !ctx.files.has(path.slice(1))) add(`links to ${path}, which is not a route`, "llms.txt");
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Release 2: the copy rules, on built pages
// ---------------------------------------------------------------------------

const NO_GIT: SourceCtx["git"] = { tracked: () => [], commits: () => [], baseText: () => undefined };

/** A one-file source context, so a built page goes through the same checks as its source. */
function pageSourceCtx(path: string, text: string, ctx: DistCtx): SourceCtx {
  const file: ScanFile = { path, text: new SourceText(text) };
  return {
    files: [file],
    all: new Map([[path, file]]),
    scoped: false,
    inScope: (item) => item === path,
    read: (item) => (item === path ? text : undefined),
    privateBans: ctx.privateBans,
    git: NO_GIT,
  };
}

const PRIVATE_BANS = BANS.filter((ban) => ban.private);
const SITE_BANS = BANS.filter((ban) => !ban.private && !ban.scope);

/**
 * A scoped ban covers its page's source, which renders inside <main>. The header and footer come
 * from the layout, so reading them would apply one page's ban to shared links. With no <main>,
 * the ban reads the whole body.
 */
const PAGE_BANS = BANS.filter((ban) => !ban.private && ban.scope);
const pageContent = (body: string) => /<main\b[\s\S]*<\/main>/i.exec(body)?.[0] ?? body;

/** S-NAP is not here because D-NAP already reads each page's whole HTML. */
const COPY_CHECKS: Array<(ctx: SourceCtx) => Finding[]> = [
  ...SITE_BANS.map((ban) => (ctx: SourceCtx) => checkBan(ban, ctx)),
  (ctx: SourceCtx) => checkRequired(ctx, true),
  checkConsult,
  checkAbsent,
  checkPearly,
  checkExtGlass,
  checkRoof,
];

export function checkCopy(ctx: DistCtx): Finding[] {
  const findings = new Map<string, Finding>();
  const add = (file: string | undefined, row: string | undefined, message: string) => {
    findings.set(`${file}:${message}`, { rule: "D-COPY", row, file, message });
  };

  const sourceByRoute = new Map<string, string>();
  for (const [file, route] of pageRoutes(ctx)) {
    sourceByRoute.set(route, COPY_PAGES.aliases[file] ?? file);
  }

  if (!ctx.privateBans.ok) add(undefined, PRIVATE_BANS[0].row, `private ban file unavailable: ${ctx.privateBans.reason}`);

  const sources = new Set<string>();
  for (const { path, html } of htmlFiles(ctx)) {
    const route = routeOfHtmlFile(path);
    const source = route.startsWith(COPY_PAGES.areaPrefix) ? COPY_PAGES.areaFile : sourceByRoute.get(route) ?? path;
    sources.add(source);

    const body = bodyMarkup(html);
    const page = pageSourceCtx(source, body, ctx);
    for (const check of COPY_CHECKS) {
      for (const finding of check(page)) add(path, finding.row, `${finding.rule}: ${finding.message}`);
    }
    const content = pageSourceCtx(source, pageContent(body), ctx);
    for (const ban of PAGE_BANS) {
      for (const finding of checkBan(ban, content)) add(path, finding.row, `${finding.rule}: ${finding.message}`);
    }
    if (ctx.privateBans.ok) {
      const whole = pageSourceCtx(source, html, ctx);
      for (const ban of PRIVATE_BANS) {
        for (const finding of checkBan(ban, whole)) add(path, finding.row, `${finding.rule}: ${finding.message}`);
      }
    }
  }

  for (const entry of [...REQUIRED, ...REQUIRED_ORDER]) {
    for (const file of entry.files) {
      if (!file.endsWith(".txt") && !sources.has(file)) add(file, entry.row, "no built page for this source file");
    }
  }
  return [...findings.values()];
}

export const DIST_CHECKS: Record<string, (ctx: DistCtx) => Finding[]> = {
  "D-PARSE": checkParse,
  "D-DUP": checkDup,
  "D-HEAD": checkHead,
  "D-ORG": checkOrg,
  "D-PARENT": checkParent,
  "D-NAP": checkNapDist,
  "D-PEARLY": checkPearlyDist,
  "D-HOST": checkHost,
  "D-TODO": checkTodo,
  "D-ROUTES": checkRoutes,
  "D-SITEMAP": checkSitemap,
  "D-PARITY": checkParity,
  "D-RANK": checkRank,
  "D-CLARITY": checkClarity,
  "D-RAW": checkRaw,
  "D-FAQRAW": checkFaqRaw,
  "D-NOFALLBACK": checkNoFallback,
  "D-404": checkMissingPage,
  "D-LCP": checkLcp,
  "D-MANIFEST": checkManifest,
  "D-COPY": checkCopy,
};

export const rankEntryFromHtml = (html: string): RankEntry => ({
  title: titleOf(html),
  description: metaContent(html, "description") ?? "",
  canonical: canonicalsOf(html)[0] ?? "",
});
