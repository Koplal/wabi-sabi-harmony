/** Browser rules as pure checks on page snapshots, so the self-test can run them on fixtures. */
import { BROWSER, PARENT, RANK_ROUTES, SITE } from "./rules";
import { canonicalJson, canonicalPath, duplicateProblems, type Finding, parseBlock, routeUrl, topNodes } from "./lib";

export interface PageSnapshot {
  /** The route as requested. */
  route: string;
  /** A label for the run, such as "seeded cart". */
  scenario?: string;
  /** The pathname the page ended on. */
  finalPath: string;
  pageErrors: string[];
  consoleErrors: Array<{ text: string; url: string }>;
  h1s: string[];
  canonicals: string[];
  descriptions: string[];
  jsonLd: string[];
  areaLinks: number;
  hasNameField: boolean;
  clarityScript: boolean;
  clarityScriptSrc?: string;
}

export const label = (snapshot: PageSnapshot) =>
  snapshot.scenario ? `${snapshot.route} [${snapshot.scenario}]` : snapshot.route;

const ignoredConsoleUrl = (url: string, origin: string) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.origin !== origin || parsed.pathname.startsWith("/_vercel/");
  } catch {
    return false;
  }
};

export function checkConsole(snapshot: PageSnapshot, origin: string): Finding[] {
  const file = label(snapshot);
  const findings: Finding[] = snapshot.pageErrors.map((message) => ({ rule: "BR-CONSOLE", file, message: `pageerror: ${message}` }));
  for (const entry of snapshot.consoleErrors) {
    const networkFailure = entry.text.startsWith("Failed to load resource");
    if (networkFailure && ignoredConsoleUrl(entry.url, origin)) continue;
    findings.push({ rule: "BR-CONSOLE", file, message: `console.error: ${entry.text}` });
  }
  return findings;
}

export function checkH1(snapshot: PageSnapshot): Finding[] {
  const file = label(snapshot);
  const findings: Finding[] = [];
  const add = (message: string) => findings.push({ rule: "BR-H1", file, message });

  if (snapshot.h1s.length === 0) add("no rendered H1");
  if (snapshot.scenario === "seeded cart") {
    if (snapshot.finalPath !== "/checkout") add(`left the form, ended at ${snapshot.finalPath}`);
    if (!snapshot.hasNameField) add("the name field is not on the page");
  }
  if (snapshot.scenario === "empty cart" && snapshot.finalPath !== "/cart") {
    add(`an empty cart should end at /cart, ended at ${snapshot.finalPath}`);
  }
  return findings;
}

export function checkAreas(snapshot: PageSnapshot): Finding[] {
  if (canonicalPath(snapshot.route) !== "/areas") return [];
  const findings: Finding[] = [];
  if (snapshot.h1s.length === 0) findings.push({ rule: "BR-AREAS", file: snapshot.route, message: "no rendered H1" });
  if (snapshot.areaLinks < BROWSER.minAreaLinks) {
    findings.push({ rule: "BR-AREAS", file: snapshot.route, message: `${snapshot.areaLinks} area links, expected at least ${BROWSER.minAreaLinks}` });
  }
  return findings;
}

export function checkHead(snapshot: PageSnapshot): Finding[] {
  const file = label(snapshot);
  const expectedCanonical = routeUrl(SITE, snapshot.scenario === "empty cart" ? "/cart" : snapshot.route);
  const findings: Finding[] = [];
  const add = (message: string) => findings.push({ rule: "BR-HEAD", row: "FR-2", file, message });

  if (snapshot.canonicals.length !== 1) add(`${snapshot.canonicals.length} canonical tags`);
  else if (snapshot.canonicals[0] !== expectedCanonical) add(`canonical is ${snapshot.canonicals[0]}, expected ${expectedCanonical}`);
  if (snapshot.descriptions.length !== 1) add(`${snapshot.descriptions.length} meta descriptions`);
  for (const problem of duplicateProblems(snapshot.jsonLd)) add(problem);
  return findings;
}

const blockKeys = (blocks: string[]) =>
  blocks.map((block) => {
    const data = parseBlock(block);
    return data === undefined ? block : canonicalJson(data);
  });

const hasNode = (blocks: string[], id: string) =>
  blocks.some((block) => topNodes(parseBlock(block)).some((node) => node["@id"] === id));

export interface NavStep {
  from: PageSnapshot;
  to: PageSnapshot;
  /** The same route loaded directly, for what should be on the page. */
  direct: PageSnapshot;
  clientSide: boolean;
}

export function checkNav(step: NavStep): Finding[] {
  const file = `${step.from.route} to ${step.to.route}`;
  const findings: Finding[] = [];
  const add = (message: string) => findings.push({ rule: "BR-NAV", row: "FR-2", file, message });

  if (!step.clientSide) add("the navigation was a full page load");
  if (step.to.finalPath !== step.to.route) add(`ended at ${step.to.finalPath}`);

  const expectedCanonical = routeUrl(SITE, step.to.route);
  if (step.to.canonicals.length !== 1 || step.to.canonicals[0] !== expectedCanonical) {
    add(`canonicals after navigation: ${step.to.canonicals.join(", ") || "none"}`);
  }

  const wanted = new Set(blockKeys(step.direct.jsonLd));
  const current = new Set(blockKeys(step.to.jsonLd));
  const stale = blockKeys(step.from.jsonLd).filter((block) => !wanted.has(block) && current.has(block));
  if (stale.length > 0) add(`${stale.length} JSON-LD block${stale.length === 1 ? "" : "s"} left from the previous page`);
  for (const problem of duplicateProblems(step.to.jsonLd)) add(problem);

  if (step.to.route === "/services" && hasNode(step.to.jsonLd, PARENT.id)) add(`${PARENT.id} is on /services`);
  return findings;
}

export function checkRank(snapshot: PageSnapshot, baselineH1: string | undefined): Finding[] {
  if (!RANK_ROUTES.includes(snapshot.route)) return [];
  if (baselineH1 === undefined) return [{ rule: "BR-RANK", file: snapshot.route, message: "no baseline H1" }];
  if (snapshot.h1s[0] !== baselineH1) {
    return [{ rule: "BR-RANK", file: snapshot.route, message: `H1 changed from the baseline: "${snapshot.h1s[0] ?? ""}"` }];
  }
  return [];
}

export function checkClarity(snapshot: PageSnapshot, expectId: string | undefined): Finding[] {
  const finding = (message: string): Finding[] => [{ rule: "BR-CLARITY", row: "FR-3", file: label(snapshot), message }];
  if (!expectId) return snapshot.clarityScript ? finding("script#clarity-script is on the page") : [];
  if (snapshot.route === "/") {
    if (!snapshot.clarityScript) return finding("script#clarity-script is not on the page");
    if (!snapshot.clarityScriptSrc?.includes(expectId)) return finding("script#clarity-script does not load the expected ID");
  }
  if (snapshot.route === "/checkout-success" && snapshot.clarityScript) return finding("script#clarity-script is on /checkout-success");
  return [];
}

export const BROWSER_RULES = ["BR-CONSOLE", "BR-H1", "BR-AREAS", "BR-HEAD", "BR-NAV", "BR-RANK", "BR-CLARITY"];
