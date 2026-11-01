/** Browser rules as pure checks on page snapshots, so the self-test can run them on fixtures. */
import type { LcpRoute, RenderEntry } from "./dist-checks";
import { BROWSER, CLS_TOLERANCE, FAQ_ROUTE, INDEXABLE_ROUTES, LIVE, MISSING_PAGE, PARENT, RANK_ROUTES, RAW_MIN_WORD_SHARE, SITE, UTILITY_ROUTES } from "./rules";
import {
  canonicalJson,
  canonicalPath,
  duplicateProblems,
  type Finding,
  missingPageProblems,
  parseBlock,
  pathOfHref,
  rawProblems,
  type RenderedPage,
  routeUrl,
  textDriftProblems,
  topNodes,
} from "./lib";

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
  /** The HTTP status of the document. */
  status?: number;
  /** The HTML as served, before any script ran. */
  html?: string;
  /** The same load after hydration, for comparing with html. */
  rendered?: RenderedPage;
  /** gtag config calls this load made. Each one sends a page_view. */
  gaConfigs?: number;
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
  // The browser logs a missing page's own 404. That is the page working, so it alone is exempt.
  const ownMissing = snapshot.route === LIVE.missingPath ? `${origin}${LIVE.missingPath}` : undefined;
  for (const entry of snapshot.consoleErrors) {
    const networkFailure = entry.text.startsWith("Failed to load resource");
    if (networkFailure && (ignoredConsoleUrl(entry.url, origin) || entry.url === ownMissing)) continue;
    findings.push({ rule: "BR-CONSOLE", file, message: `console.error: ${entry.text}` });
  }
  return findings;
}

/**
 * R2-FR-01 within one build, so copy added after the baseline was captured is compared too.
 * faqAnswers are the site's closed answers, which only FAQ_ROUTE may hold beyond its rendered text.
 */
export function checkRawPage(snapshot: PageSnapshot, faqAnswers: string[] = []): Finding[] {
  if (!INDEXABLE_ROUTES.includes(snapshot.route)) return [];
  const finding = (message: string): Finding => ({ rule: "BR-RAW", row: "R2-FR-01", file: snapshot.route, message });
  if (snapshot.html === undefined || !snapshot.rendered) return [finding("the raw HTML or the rendered text could not be read")];
  return rawProblems(snapshot.rendered, snapshot.html, RAW_MIN_WORD_SHARE, snapshot.route === FAQ_ROUTE ? faqAnswers : []).map(finding);
}

/**
 * R2-FR-03 and R2-FR-04. BR-RAW compares raw HTML with this load's rendered page, so it passes a
 * change that reaches both, as FAQ answers left open would, or a section lost from both.
 * This compares the rendered page with the saved Release 1 text, both ways. A page changed on
 * purpose takes a new entry from verify:browser --write-render-baseline --route=<route>.
 */
export function checkRendered(snapshot: PageSnapshot, saved: RenderEntry | undefined): Finding[] {
  if (![...INDEXABLE_ROUTES, ...UTILITY_ROUTES].includes(snapshot.route)) return [];
  const finding = (message: string): Finding => ({ rule: "BR-RENDER", row: "R2-FR-03, R2-FR-04", file: label(snapshot), message });
  if (!saved) return [finding("no saved text for this route")];
  // The saved text is one state of the route, so an empty /checkout has nothing to compare with.
  if (snapshot.scenario !== saved.scenario) return [];
  if (!snapshot.rendered) return [finding("the rendered text could not be read")];
  return textDriftProblems(snapshot.rendered.text, saved.text, RAW_MIN_WORD_SHARE).map(finding);
}

/** A URL outside the route list, in a browser. LV-404 proves the same page on a deployment. */
export function checkMissingUrl(snapshot: PageSnapshot, origin: string): Finding[] {
  const finding = (message: string): Finding => ({ rule: "BR-404", row: "R2-FR-08", file: snapshot.route, message });
  const findings: Finding[] = [];
  if (snapshot.status !== 404) findings.push(finding(`status ${snapshot.status}, expected 404`));
  findings.push(...missingPageProblems(snapshot.html ?? "", SITE, MISSING_PAGE.brand).map(finding));
  findings.push(...checkConsole(snapshot, origin).map((item) => finding(item.message)));
  return findings;
}

/**
 * R2-FR-13. The analytics hosts are blocked, so this counts the calls and nothing is sent. A URL
 * outside the route list is the static 404 page, which need not carry the tag.
 */
export function checkGa(snapshot: PageSnapshot): Finding[] {
  if (![...INDEXABLE_ROUTES, ...UTILITY_ROUTES].includes(snapshot.route) || snapshot.gaConfigs === 1) return [];
  return [{ rule: "BR-GA", row: "R2-FR-13", file: label(snapshot), message: `${snapshot.gaConfigs ?? 0} gtag config calls, expected 1` }];
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

export interface HydrationSnapshot {
  route: string;
  scenario: string;
  /** The pathname the page ended on. */
  finalPath: string;
  pageErrors: string[];
  consoleErrors: Array<{ text: string; url: string }>;
  /**
   * What became of the page's <main> from the HTML.
   * The toast region outside it hydrates even when the page does not, so it proves nothing.
   */
  markup: "none" | "no main" | "attached" | "replaced" | "not attached";
  /** The server-rendered H1 is still on the page. Undefined when the HTML has none. */
  headingKept?: boolean;
  /** False for a utility route with no built file, so it has no page of its own to attach to. */
  fileBuilt?: boolean;
}

/**
 * A page that never hydrates raises no warning, and neither does one that discards the
 * server markup, so a clean console alone proves nothing. React must also attach to the markup.
 */
export function checkHydrate(snapshot: HydrationSnapshot): Finding[] {
  const file = `${snapshot.route} [${snapshot.scenario}]`;
  const finding = (message: string): Finding => ({ rule: "BR-HYDRATE", row: "R2-FR-03", file, message });
  const warning = new RegExp(BROWSER.hydrationErrors.join("|"), "i");
  const path = pathOfHref(snapshot.route);

  if (snapshot.fileBuilt === false) {
    return [finding("no built file, so this URL has no page of its own to attach to. Run npm run build.")];
  }

  const findings = [...snapshot.pageErrors, ...snapshot.consoleErrors.map((entry) => entry.text)]
    .filter((text) => warning.test(text))
    .map((text) => finding(`hydration warning: ${text}`));

  // A utility page may send the visitor on, as an empty /checkout does. That is not a mismatch.
  const leftPage = UTILITY_ROUTES.includes(path) && snapshot.finalPath !== path;
  if (snapshot.markup === "none") findings.push(finding("#root has no server-rendered page markup to attach to"));
  else if (snapshot.markup === "no main") findings.push(finding("the server-rendered page has no <main>, so attaching to it cannot be proved"));
  else if (snapshot.markup === "not attached") findings.push(finding("React had not attached to the server-rendered page when the wait ended"));
  else if (snapshot.markup === "replaced" && !leftPage) findings.push(finding("React replaced the server-rendered markup instead of attaching to it"));
  // A cart that fills after load may swap the H1 on a utility page. That is not a mismatch.
  else if (snapshot.headingKept === false && !UTILITY_ROUTES.includes(path)) {
    findings.push(finding("the server-rendered H1 was replaced"));
  }
  return findings;
}

export interface CartStep {
  name: string;
  route: string;
  finalPath: string;
  storedIds: string[];
  itemShown: boolean;
  hasNameField: boolean;
  /** Times this load wrote an empty list over the stored cart. */
  emptyWrites: number;
  /** The stored cart must be empty after this step. */
  cleared?: boolean;
}

export function checkCart(steps: CartStep[]): Finding[] {
  const item = BROWSER.seededCart[0];
  const findings: Finding[] = [];
  if (steps.length !== BROWSER.cartSteps.length) {
    findings.push({ rule: "BR-CART", row: "R2-FR-03", message: `${steps.length} of ${BROWSER.cartSteps.length} steps ran` });
  }
  for (const step of steps) {
    const add = (message: string) => findings.push({ rule: "BR-CART", row: "R2-FR-03", file: `${step.route} [${step.name}]`, message });
    if (step.finalPath !== step.route) add(`ended at ${step.finalPath}`);
    if (step.cleared) {
      if (step.storedIds.length > 0) add("the order is complete, but the stored cart still holds its item");
      if (step.emptyWrites > BROWSER.maxEmptyWrites) add(`${step.emptyWrites} empty writes in one load, over the limit of ${BROWSER.maxEmptyWrites}, so the page is writing in a loop`);
      continue;
    }
    if (!step.storedIds.includes(item.id)) add("the stored cart lost its item");
    if (step.emptyWrites > 0) add("an empty list was written over the stored cart");
    if (step.route === "/cart" && !step.itemShown) add("the item is not on the page");
    if (step.route === "/checkout" && !step.hasNameField) add("the form is not on the page");
  }
  return findings;
}

/** One route's lab runs on one target, with the layout shift each run added up. */
export interface LcpMeasure extends LcpRoute {
  shifts: number[];
}

/**
 * R2-FR-12 on a deployment. Fastest runs are compared, for the reason at BROWSER.lcp.tolerance, so
 * this catches a page that got slower, and not one that was unlucky. comparison is production from
 * the same sitting, or the saved R1 figure when production is the target. Layout shift compares
 * the largest of each target's runs, and the saved figure has none, so it is compared in a sitting
 * only.
 */
export function checkLcpRuns(route: string, measured: LcpMeasure, comparison: (LcpRoute & { shifts?: number[] }) | undefined): Finding[] {
  const { runs, tolerance } = BROWSER.lcp;
  const finding = (message: string): Finding => ({ rule: "BR-LCP", row: "R2-FR-12", file: route, message });
  const findings: Finding[] = [];
  if (comparison?.shifts) {
    const worst = Math.max(0, ...measured.shifts);
    const production = Math.max(0, ...comparison.shifts);
    if (worst > production + CLS_TOLERANCE) findings.push(finding(`layout shift of ${worst.toFixed(4)}, worse than production's ${production.toFixed(4)} by more than ${CLS_TOLERANCE}`));
  }
  if (measured.runsMs.length < runs) findings.push(finding(`${measured.runsMs.length} of ${runs} runs gave a figure`));
  if (!comparison) findings.push(finding("no R1 figure to compare with"));
  else if (comparison.runsMs.length < runs) findings.push(finding(`${comparison.runsMs.length} of ${runs} R1 runs gave a figure`));
  else if (measured.runsMs.length >= runs) {
    const fastest = Math.min(...measured.runsMs);
    const fastestR1 = Math.min(...comparison.runsMs);
    const limit = Math.round(fastestR1 * (1 + tolerance));
    if (fastest > limit) findings.push(finding(`fastest run ${fastest} ms, over the ${limit} ms limit (R1's fastest ${fastestR1} ms plus ${tolerance * 100}%)`));
  }
  return findings;
}

/** What each BR-INTERACT step saw. A step that could not finish has no reading, only an entry in errors. */
export interface InteractReading {
  /** The answer panel's text on screen before and after the click. */
  answer?: { before: string; after: string };
  /** Links on screen in the mobile menu before and after the tap. */
  menu?: { before: string[]; after: string[] };
  /** Links on screen in the nav dropdown before and after the click. */
  dropdown?: { before: string[]; after: string[] };
  /** What the form field held after typing, and the submit events the page saw. */
  field?: { value: string; submits: number };
  /** Scroll position just before a client navigation and after it. */
  scroll?: { before: number; after: number; clientSide: boolean; finalPath: string };
  /** Why a step did not finish, by step name. */
  errors: Record<string, string>;
  /** Requests other than GET and HEAD during these steps. All were stopped in the browser. */
  writes: string[];
}

/** R2-FR-03's after-load behaviours. Today's site is the reference, so this passes on Release 1. */
export function checkInteract(reading: InteractReading): Finding[] {
  const { accordion, menu, dropdown, field, scroll } = BROWSER.interact;
  const findings: Finding[] = [];
  const add = (file: string, message: string) => findings.push({ rule: "BR-INTERACT", row: "R2-FR-03", file, message });
  const unfinished = (name: string, route: string) => add(`${route} [${name}]`, `the step did not finish: ${reading.errors[name] ?? "no reading"}`);
  const opened = (name: string, route: string, seen: { before: string[]; after: string[] } | undefined, expected: string) => {
    if (!seen) unfinished(name, route);
    else if (seen.before.length > 0) add(route, `the ${name} was open before anything was pressed`);
    else if (!seen.after.includes(expected)) add(route, `the ${name} did not open: no link to ${expected} on screen`);
  };

  if (!reading.answer) unfinished("FAQ answer", accordion.route);
  else if (reading.answer.before) add(accordion.route, "an answer was on screen before the click");
  else if (!reading.answer.after) add(accordion.route, "clicking a question did not open its answer");

  opened("mobile menu", menu.route, reading.menu, menu.expected);
  opened("dropdown", dropdown.route, reading.dropdown, dropdown.expected);

  if (!reading.field) unfinished("form field", field.route);
  else {
    if (reading.field.value !== field.text) add(field.route, `typed "${field.text}", but the field holds "${reading.field.value}"`);
    if (reading.field.submits > 0) add(field.route, `typing submitted the form ${reading.field.submits} times`);
  }

  const journey = `${scroll.through} to ${scroll.start}`;
  if (!reading.scroll) unfinished("scroll reset", scroll.start);
  else {
    const { before, after, clientSide, finalPath } = reading.scroll;
    if (finalPath !== scroll.start) add(journey, `ended at ${finalPath}`);
    // A full load also starts at the top, and so does a page that never scrolled.
    if (!clientSide) add(journey, "the navigation was a full page load, so it proves no scroll reset");
    if (before === 0) add(journey, "the page was not scrolled before the click, so the reset proves nothing");
    if (after !== 0) add(journey, `client navigation left the page scrolled to ${after}, expected 0`);
  }

  for (const write of new Set(reading.writes)) add(write, "a write request left the page, and these steps must make none");
  return findings;
}

/** What one step saw of the window before React attaches, and whether it was in that window at all. */
interface EarlyStep {
  /** React owned nothing on the page when the step acted. Without this it proves nothing. */
  held: boolean;
  /** React owned the page once the scripts were released. */
  attached: boolean;
}

/** What each BR-EARLY step saw. A step that could not finish has no reading, only an entry in errors. */
export interface EarlyReading {
  /** Scroll position just before the scripts were released, and after React attached. */
  scroll?: EarlyStep & { before: number; after: number };
  /** By route: what the form sent, and whether the send stopped in the browser. */
  forms: Record<string, EarlyStep & { body: string; stopped: boolean }>;
  /** By route: a press of Enter went to another URL, which would lose what was typed. */
  enterLeft: Record<string, boolean>;
  /** The page's script failed once. loads counts documents, and the reload must then attach. */
  retry?: { loads: number; attached: boolean };
  /** The page's script failed every time. It must reload once, stop, and leave the page on screen. */
  giveUp?: { loads: number; heading: boolean };
  /** /cart with a saved cart: the text of <main> before React attached, and after. */
  cart?: EarlyStep & { before: string; after: string };
  /** Why a step did not finish, by step name. */
  errors: Record<string, string>;
}

/** R2-FR-03 before load: what a visitor did to the built page survives React attaching to it. */
export function checkEarly(reading: EarlyReading): Finding[] {
  const { scroll, forms, chunk, cart } = BROWSER.early;
  const findings: Finding[] = [];
  const add = (file: string, message: string) => findings.push({ rule: "BR-EARLY", row: "R2-FR-03", file, message });
  const unfinished = (name: string, route: string) => add(`${route} [${name}]`, `the step did not finish: ${reading.errors[name] ?? "no reading"}`);
  const inWindow = (file: string, { held, attached }: EarlyStep) => {
    if (!held) add(file, "React had attached before the step acted, so it proves nothing");
    if (!attached) add(file, "React did not attach after the scripts were released");
  };

  if (!reading.scroll) unfinished("scroll", scroll.route);
  else {
    inWindow(scroll.route, reading.scroll);
    const { before, after } = reading.scroll;
    if (before === 0) add(scroll.route, "the page was not scrolled before React attached, so this proves nothing");
    if (after !== before) add(scroll.route, `scrolled to ${before} before React attached, then moved to ${after}`);
  }

  for (const plan of forms) {
    const left = reading.enterLeft[plan.route];
    if (left === undefined) unfinished(`Enter ${plan.route}`, plan.route);
    else if (left) add(plan.route, "pressing Enter before React attached sent the page to another URL");

    const seen = reading.forms[plan.route];
    if (!seen) {
      unfinished(`form ${plan.route}`, plan.route);
      continue;
    }
    inWindow(plan.route, seen);
    if (!seen.stopped) add(plan.route, "the form's send was not stopped in the browser");
    for (const text of [...Object.values(plan.early), ...Object.values(plan.late)]) {
      if (!seen.body.includes(text)) add(plan.route, `"${text}" was entered, but the request did not carry it`);
    }
  }

  if (!reading.retry) unfinished("one failed script", chunk.route);
  else {
    if (reading.retry.loads !== 2) add(chunk.route, `${reading.retry.loads} page loads after the script failed once, expected 2`);
    if (!reading.retry.attached) add(chunk.route, "React did not attach after the reload");
  }
  if (!reading.giveUp) unfinished("a script that always fails", chunk.route);
  else {
    if (reading.giveUp.loads !== 2) add(chunk.route, `${reading.giveUp.loads} page loads with the script always failing, expected 2`);
    if (!reading.giveUp.heading) add(chunk.route, "the built page did not stay on screen after the script failed");
  }

  if (!reading.cart) unfinished("saved cart", cart.route);
  else {
    inWindow(cart.route, reading.cart);
    const { before, after } = reading.cart;
    if (!before) add(cart.route, "the built page had no text, so this proves nothing");
    if (before.toLowerCase().includes(cart.falseClaim)) add(cart.route, `a visitor with a saved cart reads "${cart.falseClaim}" before React attaches`);
    if (!after.includes(BROWSER.seededCart[0].name)) add(cart.route, "the saved cart was not on the page after React attached");
  }
  return findings;
}

/** BR-LCP needs a deployment and many slow loads, so it runs only when named. */
export const BROWSER_RULES = ["BR-CONSOLE", "BR-H1", "BR-AREAS", "BR-HEAD", "BR-NAV", "BR-RANK", "BR-CLARITY", "BR-GA", "BR-RAW", "BR-RENDER", "BR-404", "BR-HYDRATE", "BR-CART", "BR-INTERACT", "BR-EARLY", "BR-LCP"];

/**
 * BR-HYDRATE's URLs. React attaches only to a route's own built page. It renders over the 404 page
 * on purpose (main.tsx), so a URL outside the list is left out here, and is BR-404's to prove.
 */
export function hydrationUrls(requested: string[] | undefined, skipped: string[]): { routes: string[]; outside: string[] } {
  const known = [...INDEXABLE_ROUTES, ...UTILITY_ROUTES];
  const wanted = (requested ?? known).filter((route) => !skipped.includes(route));
  return { routes: wanted.filter((url) => known.includes(pathOfHref(url))), outside: wanted.filter((url) => !known.includes(pathOfHref(url))) };
}

/** A --route run skips rules that make their own visits unless they are named, but BR-404 is the point of a run on the missing path. */
export const runsMissingUrl = (requested: string[] | undefined, named: string[]) => !requested || named.includes("BR-404") || requested.includes(LIVE.missingPath);

/**
 * --from-prerendered replaces Release 1 text, so it must name the routes it replaces. Without that,
 * one run would rewrite every entry, and D-RAW and BR-RENDER would compare R2 with itself.
 */
export const fromPrerenderedProblem = (fromPrerendered: boolean, writing: boolean, routes: string[] | undefined): string | undefined => {
  if (!fromPrerendered) return undefined;
  if (!writing) return "--from-prerendered only applies to --write-render-baseline";
  return routes?.length ? undefined : "--from-prerendered replaces Release 1 text, so it needs --route=<the changed routes>";
};
