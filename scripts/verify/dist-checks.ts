/** Dist rules. Each check takes a DistCtx, so the self-test can run it on fixtures. */
import {
  CLARITY_PROJECT_ID,
  HELMET_META_KEYS,
  NAP,
  ORG,
  PARENT,
  PARITY_EXEMPT,
  PEARLY_IDS,
  RANK_ROUTES,
  SITE,
} from "./rules";
import {
  attributes,
  canonicalJson,
  canonicalsOf,
  duplicateProblems,
  type Finding,
  headOf,
  isNode,
  jsonLdBlocksOf,
  type JsonNode,
  metaContent,
  parseBlock,
  routeOfHtmlFile,
  tagsNamed,
  titleOf,
  topNodes,
  typesOf,
} from "./lib";
import { napProblems } from "./source-checks";

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

export interface DistCtx {
  /** Every file in dist, keyed by its path relative to dist. Text files only. */
  files: Map<string, string>;
  routes: string[];
  baseline: RankBaseline;
  readSource(path: string): string | undefined;
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

export function checkRoutes(ctx: DistCtx): Finding[] {
  const findings: Finding[] = [];
  const add = (message: string, file?: string) => findings.push({ rule: "D-ROUTES", file, message });
  const pages = htmlFiles(ctx).filter(({ path }) => /(?:^|\/)index\.html$/.test(path));
  const built = new Set(pages.map(({ path }) => routeOfHtmlFile(path)));

  for (const route of ctx.routes) if (!built.has(route)) add(`no built HTML for ${route}`);
  for (const route of built) if (!ctx.routes.includes(route)) add(`unexpected built HTML for ${route}`);

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

export function checkSitemap(ctx: DistCtx): Finding[] {
  const sitemap = ctx.files.get("sitemap.xml");
  if (sitemap === undefined) return [{ rule: "D-SITEMAP", message: "dist/sitemap.xml is missing" }];
  const locs = new Set([...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]));
  const expected = new Set(ctx.routes.map(expectedCanonical));
  const findings: Finding[] = [];
  for (const url of expected) if (!locs.has(url)) findings.push({ rule: "D-SITEMAP", file: "sitemap.xml", message: `missing ${url}` });
  for (const url of locs) if (!expected.has(url)) findings.push({ rule: "D-SITEMAP", file: "sitemap.xml", message: `not an indexable route: ${url}` });
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
  const app = ctx.readSource("src/App.tsx");
  if (app === undefined) return [{ rule: "D-PARITY", message: "src/App.tsx not found" }];
  const routes = routesByComponent(app);
  const findings: Finding[] = [];
  let pagesCompared = 0;
  let pricesCompared = 0;

  for (const path of ctx.sourcePages()) {
    if (PARITY_EXEMPT.includes(fileStem(path))) continue;
    const route = routes.get(path);
    const text = ctx.readSource(path);
    if (!route || text === undefined) continue;
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
};

export const rankEntryFromHtml = (html: string): RankEntry => ({
  title: titleOf(html),
  description: metaContent(html, "description") ?? "",
  canonical: canonicalsOf(html)[0] ?? "",
});
