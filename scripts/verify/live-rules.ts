/** Live rules as pure checks on fetched responses, so the self-test can run them on fixtures. */
import { BROWSER, INDEXABLE_ROUTES, LIVE, MISSING_PAGE, SITE, UTILITY_ROUTES } from "./rules";
import { auditPageProblems, auditSiteProblems, canonicalsOf, type Finding, lastmodProblem, metaContent, missingPageProblems, rawHeadingsOf, routeUrl, sharedDateProblem, sitemapLastmods, trackedDateProblems, visibleWords } from "./lib";

export interface Hop {
  url: string;
  status: number;
  location?: string;
}

/** Every response from a start URL to the first response that is not a redirect. */
export type Chain = Hop[];

const isRedirect = (status: number) => status >= 300 && status < 400;

export const describeChain = (chain: Chain) => chain.map((hop) => `${hop.url} ${hop.status}`).join(" -> ");

const finalUrl = (chain: Chain) => chain[chain.length - 1]?.url ?? "";
const finalStatus = (chain: Chain) => chain[chain.length - 1]?.status ?? 0;
const redirects = (chain: Chain) => chain.filter((hop) => isRedirect(hop.status));

const PRODUCTION_ORIGINS = LIVE.hostStarts.map((start) => new URL(start).origin);

/** The bypass token goes to a preview's own origin and to nothing else, least of all production. */
export function headersFor(url: string, base: string, token: string | undefined): Record<string, string> {
  const origin = new URL(base).origin;
  if (!token || PRODUCTION_ORIGINS.includes(origin) || new URL(url).origin !== origin) return {};
  return { [BROWSER.bypassHeader]: token };
}

export function checkHost(start: string, chain: Chain): Finding[] {
  const finding = (message: string): Finding[] => [{ rule: "LV-HOST", file: start, message: `${message}: ${describeChain(chain)}` }];
  const hops = redirects(chain);
  if (finalUrl(chain).replace(/\/$/, "") !== LIVE.apex || finalStatus(chain) !== 200) return finding("does not end at the apex");
  if (hops.length > 1) return finding(`${hops.length} redirects, expected at most one`);
  const wrong = hops.find((hop) => hop.status !== 308);
  if (wrong) return finding(`redirect is ${wrong.status}, expected 308`);
  return [];
}

export function checkFile(path: string, chain: Chain): Finding[] {
  if (chain.length === 1 && chain[0].status === 200) return [];
  return [{ rule: "LV-FILES", file: path, message: `expected 200 with no redirect: ${describeChain(chain)}` }];
}

export function checkMissing(path: string, chain: Chain, html: string): Finding[] {
  const finding = (message: string): Finding => ({ rule: "LV-404", row: "R2-FR-08", file: path, message });
  if (finalStatus(chain) !== 404) return [finding(`expected 404: ${describeChain(chain)}`)];
  return missingPageProblems(html, SITE, MISSING_PAGE.brand).map(finding);
}

/** After R2 every page has an H1 and body text, so the canonical and H1 prove it is the right page. */
export function checkRaw(route: string, status: number, html: string, expectedH1: string | undefined): Finding[] {
  const findings: Finding[] = [];
  const add = (message: string) => findings.push({ rule: "LV-RAW", file: route, message });
  if (status !== 200) add(`status ${status}`);
  const heading = rawHeadingsOf(html)[0];
  if (heading === undefined) add("no H1 in raw HTML");
  else if (expectedH1 === undefined) add("no baseline H1 for this route");
  else if (heading !== expectedH1) add(`raw H1 is "${heading}", expected "${expectedH1}"`);
  const canonicals = canonicalsOf(html);
  const canonical = routeUrl(SITE, route);
  if (canonicals.length !== 1 || canonicals[0] !== canonical) add(`canonical is ${canonicals.join(", ") || "missing"}, expected ${canonical}`);
  const words = visibleWords(html);
  if (words < LIVE.rawMinWords) add(`${words} words of body text in raw HTML, expected at least ${LIVE.rawMinWords}`);
  return findings;
}

/** The redirects are patterns, and one that grew too wide would catch a working path with nothing else failing. */
export function checkNotRedirected(path: string, chain: Chain): Finding[] {
  if (redirects(chain).length === 0) return [];
  return [{ rule: "LV-REDIRECT", file: path, message: `expected no redirect: ${describeChain(chain)}` }];
}

export function checkRedirect(from: string, to: string, base: string, chain: Chain, maxHops = 1): Finding[] {
  const hops = redirects(chain);
  const expected = new URL(to, base).href;
  const permanent = hops.length >= 1 && hops.length <= maxHops && hops.every((hop) => [301, 308].includes(hop.status));
  if (permanent && finalUrl(chain) === expected && finalStatus(chain) === 200) return [];
  const wanted = maxHops === 1 ? "one permanent redirect" : `at most ${maxHops} permanent redirects`;
  return [{ rule: "LV-REDIRECT", file: from, message: `expected ${wanted} to ${to}, ending at 200: ${describeChain(chain)}` }];
}

/**
 * R2-FR-15 on the deployed file, because a build could still stamp dates that differ from what
 * D-SITEMAP saw. tracked holds each route's date from LASTMOD_FILE, and every deployed date must
 * match it. histories is each page's latest commit, from this checkout's git.
 */
export function checkSitemapDates(status: number, sitemap: string, histories: string[], tracked: Record<string, string>): Finding[] {
  const finding = (message: string): Finding => ({ rule: "LV-SITEMAP", row: "R2-FR-15", file: "/sitemap.xml", message });
  if (status !== 200) return [finding(`status ${status}`)];
  const lastmods = sitemapLastmods(sitemap);
  if (lastmods.size === 0) return [finding("no URLs in the sitemap")];
  const problems = [...lastmods].flatMap(([url, date]) => lastmodProblem(url, date) ?? []);
  const dates = [...lastmods.values()].filter((date): date is string => Boolean(date));
  const shared = sharedDateProblem(dates, histories);
  return [...problems, ...trackedDateProblems(lastmods, tracked, SITE), ...(shared ? [shared] : [])].map(finding);
}

/** Each sitemap URL is on the apex, so its path is what a preview run asks its own host for. */
export const sitemapPaths = (sitemap: string) => [...sitemapLastmods(sitemap).keys()].map((loc) => new URL(loc).pathname);

/** LV-AUDIT reads what the sitemap lists, so a short or empty sitemap would otherwise pass. */
export function checkAuditRoutes(status: number, paths: string[]): Finding[] {
  const finding = (message: string): Finding => ({ rule: "LV-AUDIT", file: "/sitemap.xml", message });
  if (status !== 200) return [finding(`status ${status}`)];
  if (paths.length === 0) return [finding("no URLs in the sitemap")];
  return [
    ...INDEXABLE_ROUTES.filter((route) => !paths.includes(route)).map((route) => finding(`${route} is not in the sitemap`)),
    ...paths.filter((path) => !INDEXABLE_ROUTES.includes(path)).map((path) => finding(`${path} is in the sitemap but is not a route`)),
  ];
}

/** One response with redirects off. The exception lists apply inside auditPageProblems. */
export function checkAudit(route: string, chain: Chain, html: string): Finding[] {
  const findings: Finding[] = [];
  const add = (message: string) => findings.push({ rule: "LV-AUDIT", file: route, message });
  if (chain.length !== 1 || finalStatus(chain) !== 200) add(`expected 200 with no redirect: ${describeChain(chain)}`);
  for (const hop of chain) if (hop.location) add(`a Location header goes to ${hop.location}`);
  const canonicals = canonicalsOf(html);
  const canonical = routeUrl(SITE, route);
  if (canonicals.length !== 1 || canonicals[0] !== canonical) add(`canonical is ${canonicals.join(", ") || "missing"}, expected ${canonical}`);
  auditPageProblems(route, html).forEach(add);
  return findings;
}

export function checkAuditSite(pages: Map<string, string>): Finding[] {
  return auditSiteProblems(pages, [...INDEXABLE_ROUTES, ...UTILITY_ROUTES]).map(({ route, message }) => ({ rule: "LV-AUDIT", file: route, message }));
}

export type WwwSlash = "before" | "after";

export interface HopRow {
  start: string;
  final: string;
  hops: number;
}

/**
 * LV-HOPS's starts. Production takes every row of LIVE.hops. A preview takes the https apex's row on
 * its own host: it has no www host, and the bypass header reaches only its https origin.
 */
export function hopRows(wwwSlash: WwwSlash | undefined, base: string = LIVE.apex): HopRow[] {
  const { path, query, table } = LIVE.hops;
  const rows = base === LIVE.apex ? table : [{ ...table[0], origin: base }];
  return rows.flatMap(({ origin, bare, slash }) =>
    ["", query].flatMap((search) => [
      { start: `${origin}${path}${search}`, final: `${base}${path}${search}`, hops: bare },
      { start: `${origin}${path}/${search}`, final: `${base}${path}${search}`, hops: slash[wwwSlash ?? "before"] },
    ])
  );
}

export function checkHops(chain: Chain, row: HopRow): Finding[] {
  const finding = (message: string): Finding[] => [{ rule: "LV-HOPS", file: row.start, message: `${message}: ${describeChain(chain)}` }];
  const hops = redirects(chain);
  if (hops.length !== row.hops) return finding(`${hops.length} hops, expected ${row.hops}`);
  const wrong = hops.find((hop) => hop.status !== 308);
  if (wrong) return finding(`hop is ${wrong.status}, expected 308`);
  const search = new URL(row.start).search;
  if (chain.some((hop) => new URL(hop.url).search !== search)) return finding("the query did not survive");
  if (finalUrl(chain) !== row.final || finalStatus(chain) !== 200) return finding(`does not end at ${row.final} with a 200`);
  return [];
}

export function checkUtility(route: string, status: number, html: string): Finding[] {
  const findings: Finding[] = [];
  if (status !== 200) findings.push({ rule: "LV-UTILITY", file: route, message: `status ${status}` });
  if (!(metaContent(html, "robots") ?? "").includes("noindex")) findings.push({ rule: "LV-UTILITY", file: route, message: "no noindex in raw HTML" });
  return findings;
}
