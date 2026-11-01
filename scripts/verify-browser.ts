/**
 * Renders every route in the installed Edge or Chrome and checks the result.
 *
 *   npm run verify:browser                         all routes and rules, on dist/
 *   npm run verify:browser -- --route=/a,/b        only these routes
 *   npm run verify:browser -- --skip=/a,/b         all routes except these
 *   npm run verify:browser -- --rules=BR-H1,BR-NAV only these rules
 *   npm run verify:browser -- --base=<url>         a deployment instead of dist/
 *   npm run verify:browser -- --expect-clarity=<id>  a build made with that Clarity ID
 *   npm run verify:browser -- --dev-react          BR-HYDRATE on a sample of routes with development
 *     React, which alone reports attribute mismatches. Build with NODE_ENV=development npm run build
 *     first, and run npm run build again before any other pass
 *   npm run verify:browser -- --rules=BR-LCP --base=<url>  compares a deployment's lab LCP with R1
 *   npm run verify:browser -- --measure-lcp --base=<url>   saves that lab LCP as the R1 figure
 *   npm run verify:browser -- --write-render-baseline  saves each route's rendered text
 *     with --route=/a,/b                          only these routes, keeping the rest
 *     with --from-prerendered                     allows a prerendered build, which replaces R1 text
 *
 * Until R2-20 builds them, the utility routes serve the home page, so an earlier row passes
 * --skip=/cart,/checkout,/checkout-success. A full pass must never skip them.
 *
 * Analytics hosts and /_vercel/* are answered locally on every pass, including --base, and
 * nothing but GET and HEAD leaves the browser. Exit codes: 0 pass, 1 findings, 2 setup error.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type Browser, type BrowserContext, type BrowserContextOptions, chromium, type ConsoleMessage, type Page, type Route } from "playwright-core";
import { BROWSER, INDEXABLE_ROUTES, LIVE, RANK_ROUTES, RENDER_BASELINE_FILE, UTILITY_ROUTES } from "./verify/rules";
import { type Finding, htmlFileOfRoute, listValue, median, parseArgs, pathOfHref, rawHeadingsOf, report, routeList, textWords, UsageError } from "./verify/lib";
import {
  BROWSER_RULES,
  type CartStep,
  checkAreas,
  checkCart,
  checkClarity,
  checkConsole,
  checkH1,
  checkHead,
  checkHydrate,
  checkLcpRuns,
  checkMissingUrl,
  checkNav,
  checkRank,
  checkRawPage,
  type HydrationSnapshot,
  type NavStep,
  type PageSnapshot,
} from "./verify/browser-rules";
import type { LcpLab, RankBaseline, RenderBaseline, RenderEntry } from "./verify/dist-checks";
import { type RunningServer, startStaticServer } from "./verify/static-server";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE = resolve(ROOT, "scripts/verify/rank-baseline.json");
const RENDER_BASELINE = resolve(ROOT, RENDER_BASELINE_FILE);

const VIEWPORT = { width: 1280, height: 900 };
const WORKERS = 4;
const NAVIGATION_TIMEOUT = 45_000;
const RENDER_TIMEOUT = 8_000;
const HEADING_TIMEOUT = 3_000;
/** React can report a mismatch, or an effect can write the cart, just after the page attaches. */
const HYDRATION_QUIET = 500;
const CLARITY_WAIT = 12_000;
const CLARITY_ABSENT_WAIT = 3_000;
const LCP_TIMEOUT = 90_000;
/** A throttled page can still be painting when the network goes quiet. */
const LCP_QUIET = 3_000;

const KNOWN_FLAGS = ["write-rank-h1", "write-render-baseline", "from-prerendered", "dev-react", "measure-lcp"];
const KNOWN_VALUES = ["route", "skip", "rules", "base", "expect-clarity"];

/** Rules read from one visit to each route. BR-NAV, BR-404, BR-HYDRATE and BR-CART make their own visits. */
const PAGE_RULES = ["BR-CONSOLE", "BR-H1", "BR-AREAS", "BR-HEAD", "BR-RANK", "BR-CLARITY", "BR-RAW"];

class PreviewProtected extends Error {}

const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

const isHost = (hostname: string, host: string) => hostname === host || hostname.endsWith(`.${host}`);

type Scenario = "seeded cart" | "empty cart" | "next year";

interface Target {
  route: string;
  scenario?: Scenario;
}

function targetsFor(routes: string[]): Target[] {
  return routes.flatMap((route): Target[] =>
    route === "/checkout" ? [{ route, scenario: "seeded cart" }, { route, scenario: "empty cart" }] : [{ route }]
  );
}

interface Session {
  origin: string;
  baseMode: boolean;
  expectClarity?: string;
  blockedWrites: string[];
  /** Lets web fonts load, because they can decide the LCP. Other passes answer them empty. */
  realFonts?: boolean;
}

async function guardRequests(context: BrowserContext, session: Session) {
  const token = process.env.VERCEL_BYPASS_TOKEN;
  const handler = async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (!["GET", "HEAD"].includes(request.method())) {
      session.blockedWrites.push(`${request.method()} ${url.origin}${url.pathname}`);
      await route.fulfill({ status: 204 });
      return;
    }
    if (BROWSER.blockedHosts.some((host) => isHost(url.hostname, host)) || url.pathname.startsWith("/_vercel/")) {
      await route.fulfill({ status: 204 });
      return;
    }
    if (!session.realFonts && BROWSER.fontHosts.some((host) => isHost(url.hostname, host))) {
      await route.fulfill({ status: 200, contentType: "text/css", body: "" });
      return;
    }
    if (token && session.baseMode && url.origin === session.origin) {
      await route.continue({ headers: { ...request.headers(), [BROWSER.bypassHeader]: token } });
      return;
    }
    await route.continue();
  };
  await context.route("**/*", handler);
}

async function newPage(browser: Browser, session: Session, scenario?: Scenario, options: BrowserContextOptions = { viewport: VIEWPORT }) {
  const context = await browser.newContext(options);
  // tsx wraps named functions in __name(), which does not exist in the page. Without this, any
  // evaluate() that declares one throws, and a catch can hide it. Init scripts run in no set order,
  // so the probes passed to addInitScript below declare no named functions.
  await context.addInitScript({ content: "window.__name = (target) => target;" });
  await guardRequests(context, session);
  if (scenario === "seeded cart") {
    const cart = JSON.stringify(BROWSER.seededCart);
    await context.addInitScript((value) => localStorage.setItem("cart", value), cart);
  }
  // Only the date moves. Timers keep running, so the page loads as usual.
  if (scenario === "next year") await context.clock.setFixedTime(new Date(new Date().getFullYear() + 1, 0, 1, 12));
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
  return { context, page };
}

function watchErrors(page: Page) {
  const pageErrors: string[] = [];
  const consoleErrors: PageSnapshot["consoleErrors"] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message: ConsoleMessage) => {
    if (message.type() === "error") consoleErrors.push({ text: message.text(), url: message.location().url });
  });
  return { pageErrors, consoleErrors };
}

/**
 * Waits for React to own the page, then for the head manager to stop changing the head.
 * Prerendered HTML has its content and H1 before any script runs, so seeing those proves nothing.
 * React sets this key on a node only when it hydrates or creates it. It is a React internal, so a
 * rename shows up as BR-HYDRATE failing on every route, never as a pass.
 */
async function settle(page: Page) {
  await page
    .waitForFunction(
      () => {
        const root = document.getElementById("root");
        if (!root || root.querySelector('[aria-busy="true"]')) return false;
        const content = root.querySelector("main") ?? root.querySelector("h1");
        return Boolean(content) && Object.keys(content as Element).some((key) => key.startsWith("__reactFiber$"));
      },
      undefined,
      { timeout: RENDER_TIMEOUT }
    )
    .catch(() => undefined);
  await page.waitForSelector("h1", { timeout: HEADING_TIMEOUT }).catch(() => undefined);
  await page
    .evaluate(
      () =>
        new Promise<void>((done) => {
          let previous = "";
          let stable = 0;
          let rounds = 0;
          const check = () => {
            const current = document.head.innerHTML;
            stable = current === previous ? stable + 1 : 0;
            previous = current;
            rounds++;
            if (stable >= 3 || rounds >= 40) done();
            else requestAnimationFrame(() => setTimeout(check, 50));
          };
          check();
        })
    )
    .catch(() => undefined);
}

type PageReading = Pick<
  PageSnapshot,
  "finalPath" | "h1s" | "canonicals" | "descriptions" | "jsonLd" | "areaLinks" | "hasNameField" | "clarityScript" | "clarityScriptSrc"
>;

const readPage = (page: Page): Promise<PageReading> =>
  page.evaluate(() => {
    const clarity = document.querySelector<HTMLScriptElement>("script#clarity-script");
    return {
      finalPath: location.pathname,
      h1s: [...document.querySelectorAll("h1")].map((heading) => (heading.textContent ?? "").replace(/\s+/g, " ").trim()).filter(Boolean),
      canonicals: [...document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')].map((link) => link.getAttribute("href") ?? ""),
      descriptions: [...document.querySelectorAll<HTMLMetaElement>('meta[name="description"]')].map((meta) => meta.content),
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => script.textContent ?? ""),
      areaLinks: document.querySelectorAll('main a[href^="/areas/"]').length,
      hasNameField: Boolean(document.querySelector("#name")),
      clarityScript: Boolean(clarity),
      clarityScriptSrc: clarity?.src,
    };
  });

async function waitForClarity(page: Page, target: Target, session: Session, wanted: boolean) {
  if (!wanted) return;
  const expected = Boolean(session.expectClarity) && target.route === "/";
  if (expected) {
    await page.waitForSelector("script#clarity-script", { state: "attached", timeout: CLARITY_WAIT }).catch(() => undefined);
  } else if (target.route === "/" || target.route === "/checkout-success") {
    await page.waitForTimeout(CLARITY_ABSENT_WAIT);
  }
}

async function visit(browser: Browser, session: Session, target: Target, clarity: boolean): Promise<PageSnapshot> {
  const { context, page } = await newPage(browser, session, target.scenario);
  try {
    const errors = watchErrors(page);
    const response = await page.goto(`${session.origin}${target.route}`, { waitUntil: "load" });
    if (response?.status() === 401) throw new PreviewProtected();
    const html = await response?.text().catch(() => undefined);
    await settle(page);
    await waitForClarity(page, target, session, clarity);
    const rendered = await readRendered(page);
    return { route: target.route, scenario: target.scenario, status: response?.status(), html, rendered, ...errors, ...(await readPage(page)) };
  } finally {
    await context.close();
  }
}

async function inPool<T>(items: T[], worker: (item: T) => Promise<void>) {
  let next = 0;
  const run = async () => {
    while (next < items.length) await worker(items[next++]);
  };
  await Promise.all(Array.from({ length: Math.min(WORKERS, items.length) }, run));
}

async function clickThrough(page: Page, route: string): Promise<boolean> {
  const clicked = await page.evaluate((path) => {
    const link = document.querySelector<HTMLAnchorElement>(`a[href="${path}"]`);
    if (!link) return false;
    link.click();
    return true;
  }, route);
  if (!clicked) return false;
  await page.waitForFunction((path) => location.pathname === path, route, { timeout: RENDER_TIMEOUT }).catch(() => undefined);
  await settle(page);
  return page.evaluate(() => (window as unknown as { __verifyNav?: boolean }).__verifyNav === true);
}

async function navFindings(browser: Browser, session: Session): Promise<Finding[]> {
  const direct = {
    "/services": await visit(browser, session, { route: "/services" }, false),
    "/faq": await visit(browser, session, { route: "/faq" }, false),
  };

  const { context, page } = await newPage(browser, session);
  try {
    const errors = watchErrors(page);
    await page.goto(`${session.origin}/`, { waitUntil: "load" });
    await settle(page);
    await page.evaluate(() => {
      (window as unknown as { __verifyNav?: boolean }).__verifyNav = true;
    });

    const findings: Finding[] = [];
    let from: PageSnapshot = { route: "/", ...errors, ...(await readPage(page)) };
    for (const route of ["/services", "/faq"] as const) {
      const clientSide = await clickThrough(page, route);
      const to: PageSnapshot = { route, ...errors, ...(await readPage(page)) };
      const step: NavStep = { from, to, direct: direct[route], clientSide };
      findings.push(...checkNav(step));
      from = to;
    }
    return findings;
  } finally {
    await context.close();
  }
}

interface ProbeWindow {
  __verifyMarkup?: { content: Element | null; heading: Element | null; empty: boolean };
  __verifyCartWrites?: string[];
  __verifyLcp?: number;
}

/**
 * Keeps the nodes the HTML itself put in #root. It runs at document start, and the parser sets
 * readyState to interactive before deferred and module scripts run, so app code adds nothing here.
 * <main> sits inside the Suspense boundary and React completes it after its children, so it owning
 * <main> means the page hydrated. The first child of #root is the toast region, which does not.
 */
const keepServerMarkup = () => {
  document.addEventListener(
    "readystatechange",
    () => {
      const root = document.getElementById("root");
      (window as unknown as ProbeWindow).__verifyMarkup = {
        content: root?.querySelector("main") ?? null,
        heading: root?.querySelector("h1") ?? null,
        empty: !root?.firstElementChild,
      };
    },
    { once: true }
  );
};

type MarkupReading = Pick<HydrationSnapshot, "finalPath" | "markup" | "headingKept">;

/** Waits for React to claim the kept <main> or drop it. On a timeout the reading says "not attached". */
const waitForAttachment = (page: Page) =>
  page
    .waitForFunction(
      () => {
        const { content = null } = (window as unknown as ProbeWindow).__verifyMarkup ?? {};
        return !content || !content.isConnected || Object.keys(content).some((key) => key.startsWith("__reactFiber$"));
      },
      undefined,
      { timeout: RENDER_TIMEOUT }
    )
    .catch(() => undefined);

const readServerMarkup = (page: Page): Promise<MarkupReading> =>
  page.evaluate(() => {
    const { content = null, heading = null, empty = true } = (window as unknown as ProbeWindow).__verifyMarkup ?? {};
    const owned = Object.keys(content ?? {}).some((key) => key.startsWith("__reactFiber$"));
    const replaced = content ? !content.isConnected : false;
    return {
      finalPath: location.pathname,
      markup: !content ? (empty ? "none" : "no main") : replaced ? "replaced" : owned ? "attached" : "not attached",
      headingKept: heading ? heading.isConnected : undefined,
    } as MarkupReading;
  });

async function hydrationFindings(browser: Browser, session: Session, routes: string[]): Promise<Finding[]> {
  const urls = routes.flatMap((route) => [route, ...BROWSER.hydrationUrls.filter((url) => pathOfHref(url) === route)]);
  const targets = urls.flatMap((route): Array<{ route: string; scenario: Scenario }> => [
    { route, scenario: "empty cart" },
    { route, scenario: "seeded cart" },
    ...(BROWSER.clockRoutes.includes(route) ? [{ route, scenario: "next year" as const }] : []),
  ]);
  const findings: Finding[] = [];
  await inPool(targets, async ({ route, scenario }) => {
    const { context, page } = await newPage(browser, session, scenario);
    try {
      await context.addInitScript(keepServerMarkup);
      const errors = watchErrors(page);
      const response = await page.goto(`${session.origin}${route}`, { waitUntil: "load" });
      if (response?.status() === 401) throw new PreviewProtected();
      await settle(page);
      await waitForAttachment(page);
      await page.waitForTimeout(HYDRATION_QUIET);
      const fileBuilt = session.baseMode || !UTILITY_ROUTES.includes(pathOfHref(route)) || existsSync(resolve(ROOT, "dist", htmlFileOfRoute(pathOfHref(route))));
      findings.push(...checkHydrate({ route, scenario, fileBuilt, ...errors, ...(await readServerMarkup(page)) }));
    } catch (error) {
      if (error instanceof PreviewProtected) throw error;
      const message = `the page did not load: ${error instanceof Error ? error.message : String(error)}`;
      findings.push({ rule: "BR-HYDRATE", file: `${route} [${scenario}]`, message });
    } finally {
      await context.close();
    }
  });
  return findings;
}

const watchCartWrites = () => {
  const writes: string[] = [];
  (window as unknown as ProbeWindow).__verifyCartWrites = writes;
  const setItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key: string, value: string) {
    if (key === "cart") writes.push(value);
    setItem.call(this, key, value);
  };
};

type CartReading = Omit<CartStep, "name" | "route" | "cleared">;

const readCart = (page: Page, itemName: string): Promise<CartReading> =>
  page.evaluate((name) => {
    let stored: Array<{ id: string }> = [];
    try {
      stored = JSON.parse(localStorage.getItem("cart") ?? "[]");
    } catch {
      // A damaged value reads as an empty cart.
    }
    return {
      finalPath: location.pathname,
      storedIds: stored.map((item) => item.id),
      itemShown: (document.getElementById("root")?.innerText ?? "").includes(name),
      hasNameField: Boolean(document.querySelector("#name")),
      emptyWrites: ((window as unknown as ProbeWindow).__verifyCartWrites ?? []).filter((value) => value === "[]").length,
    };
  }, itemName);

/**
 * The cart is stored once, on a page with no app code. newPage's seeded cart cannot be used here:
 * it stores the cart again on every load, which would hide a cart lost on reload.
 */
async function cartFindings(browser: Browser, session: Session): Promise<Finding[]> {
  const { context, page } = await newPage(browser, session);
  const steps: CartStep[] = [];
  try {
    await context.addInitScript(watchCartWrites);
    const seed = await page.goto(`${session.origin}${BROWSER.seedPage}`, { waitUntil: "load" });
    if (seed?.status() === 401) throw new PreviewProtected();
    await page.evaluate((value) => localStorage.setItem("cart", value), JSON.stringify(BROWSER.seededCart));

    for (const { name, route, url, reload, cleared } of BROWSER.cartSteps) {
      if (reload) await page.reload({ waitUntil: "load" });
      else await page.goto(`${session.origin}${url ?? route}`, { waitUntil: "load" });
      await settle(page);
      await page.waitForTimeout(HYDRATION_QUIET);
      steps.push({ name, route, cleared, ...(await readCart(page, BROWSER.seededCart[0].name)) });
    }
    return checkCart(steps);
  } catch (error) {
    if (error instanceof PreviewProtected) throw error;
    const message = `the steps did not finish: ${error instanceof Error ? error.message : String(error)}`;
    return [...checkCart(steps), { rule: "BR-CART", row: "R2-FR-03", message }];
  } finally {
    await context.close();
  }
}

async function missingUrlFindings(browser: Browser, session: Session): Promise<Finding[]> {
  try {
    return checkMissingUrl(await visit(browser, session, { route: LIVE.missingPath }, false), session.origin);
  } catch (error) {
    if (error instanceof PreviewProtected) throw error;
    const message = `the page did not load: ${error instanceof Error ? error.message : String(error)}`;
    return [{ rule: "BR-404", row: "R2-FR-08", file: LIVE.missingPath, message }];
  }
}

const readRendered = (page: Page) =>
  page.evaluate(() => {
    const root = document.getElementById("root");
    const hrefs = [...(root?.querySelectorAll("a[href]") ?? [])].map((link) => link.getAttribute("href") ?? "");
    return {
      finalPath: location.pathname,
      h1: (document.querySelector("h1")?.textContent ?? "").replace(/\s+/g, " ").trim(),
      text: (root?.innerText ?? "").replace(/\s+/g, " ").trim(),
      links: [...new Set(hrefs.filter((href) => href.startsWith("/")).map((href) => href.split(/[?#]/)[0]))].sort(),
    };
  });

const LCP_NOTE = "lab is the R2-FR-12 baseline: BROWSER.lcp on R1 production, repeated on a deployment by BR-LCP. field is an optional Speed Insights reading with its sample count and dates. Never estimate either.";
const LCP_NOT_MEASURED: RenderBaseline["mobileLcp"] = { lab: null, field: null, note: LCP_NOTE };

const watchLcp = () => {
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    (window as unknown as ProbeWindow).__verifyLcp = entries[entries.length - 1].startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
};

/** A cold load with the BROWSER.lcp settings, in a new context so nothing is cached. */
async function lcpRun(browser: Browser, session: Session, route: string): Promise<number | undefined> {
  const { viewport, deviceScaleFactor, latencyMs, downloadBytesPerSecond, uploadBytesPerSecond, cpuSlowdown } = BROWSER.lcp.settings;
  const { context, page } = await newPage(browser, session, undefined, { viewport, deviceScaleFactor, isMobile: true, hasTouch: true });
  try {
    await context.addInitScript(watchLcp);
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: latencyMs, downloadThroughput: downloadBytesPerSecond, uploadThroughput: uploadBytesPerSecond });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuSlowdown });
    const response = await page.goto(`${session.origin}${route}`, { waitUntil: "load", timeout: LCP_TIMEOUT });
    if (response?.status() === 401) throw new PreviewProtected();
    await page.waitForLoadState("networkidle", { timeout: LCP_TIMEOUT }).catch(() => undefined);
    await page.waitForTimeout(LCP_QUIET);
    return await page.evaluate(() => (window as unknown as ProbeWindow).__verifyLcp);
  } catch (error) {
    if (error instanceof PreviewProtected) throw error;
    console.log(`LCP: ${route} gave no figure: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  } finally {
    await context.close();
  }
}

/** One load at a time, because pages side by side would compete for the CPU being measured. */
async function measureLcp(browser: Browser, session: Session): Promise<LcpLab["routes"]> {
  const measured: LcpLab["routes"] = {};
  for (const route of BROWSER.lcp.routes) {
    const runsMs: number[] = [];
    for (let run = 0; run < BROWSER.lcp.runs; run++) {
      const value = await lcpRun(browser, session, route);
      if (value !== undefined) runsMs.push(Math.round(value));
    }
    measured[route] = { runsMs, medianMs: median(runsMs) };
    console.log(`LCP: ${route} median ${measured[route].medianMs} ms from ${runsMs.join(", ")}`);
  }
  return measured;
}

function loadRenderBaseline(): RenderBaseline {
  if (!existsSync(RENDER_BASELINE)) throw new UsageError(`${RENDER_BASELINE_FILE} not found`);
  return JSON.parse(readFileSync(RENDER_BASELINE, "utf8")) as RenderBaseline;
}

/** R1 stops being live at the R2 deploy, so a saved figure is never replaced by accident. */
async function writeLcpBaseline(browser: Browser, session: Session) {
  const baseline = loadRenderBaseline();
  if (baseline.mobileLcp.lab) throw new UsageError(`The R1 figure from ${baseline.mobileLcp.lab.measuredOn} is saved. To compare, use --rules=BR-LCP. To replace it, delete mobileLcp.lab by hand first.`);
  const routes = await measureLcp(browser, session);
  const short = BROWSER.lcp.routes.filter((route) => routes[route].runsMs.length < BROWSER.lcp.runs);
  if (short.length > 0) throw new UsageError(`Nothing saved: too few runs gave a figure on ${short.join(", ")}`);
  const lab: LcpLab = { measuredOn: new Date().toISOString().slice(0, 10), target: session.origin, browser: `${browser.browserType().name()} ${browser.version()}`, settings: BROWSER.lcp.settings, routes };
  writeFileSync(RENDER_BASELINE, `${JSON.stringify({ ...baseline, mobileLcp: { ...baseline.mobileLcp, lab } }, null, 2)}\n`);
  console.log(`Wrote the lab LCP to ${RENDER_BASELINE_FILE} from ${session.origin}`);
}

/**
 * Menus stay closed, so nothing from their open states is counted (R2-FR-01). The saved text is
 * the Release 1 record, so a build that already has page bodies cannot replace it by accident.
 */
async function writeRenderBaseline(browser: Browser, session: Session, capturedFrom: string, requested: string[] | undefined, fromPrerendered: boolean) {
  const all = [...INDEXABLE_ROUTES, ...UTILITY_ROUTES];
  const routes = requested ?? all;
  const unknown = routes.filter((route) => !all.includes(route));
  if (unknown.length > 0) throw new UsageError(`Not a known route: ${unknown.join(", ")}`);
  const previous = existsSync(RENDER_BASELINE) ? (JSON.parse(readFileSync(RENDER_BASELINE, "utf8")) as RenderBaseline) : undefined;
  if (requested && !previous) throw new UsageError("--route needs an existing baseline to keep the other routes from");

  const entries = new Map<string, RenderEntry>();
  const prerendered: string[] = [];
  await inPool(routes, async (route) => {
    // With an empty cart /checkout leaves for /cart, so only a seeded cart shows its page.
    const scenario = route === "/checkout" ? "seeded cart" : undefined;
    const { context, page } = await newPage(browser, session, scenario);
    try {
      const response = await page.goto(`${session.origin}${route}`, { waitUntil: "load" });
      if (rawHeadingsOf((await response?.text().catch(() => undefined)) ?? "").length > 0) prerendered.push(route);
      await settle(page);
      const { text, ...rendered } = await readRendered(page);
      if (!rendered.h1) throw new UsageError(`No rendered H1 on ${route}`);
      entries.set(route, { ...rendered, ...(scenario ? { scenario } : {}), ...(requested ? { capturedFrom } : {}), words: textWords(text).length, text });
    } finally {
      await context.close();
    }
  });
  if (prerendered.length > 0 && !fromPrerendered) {
    throw new UsageError(`${plural(prerendered.length, "route")} already served with a page body, so this would replace the Release 1 text. Name the changed routes with --route and add --from-prerendered.`);
  }

  const baseline: RenderBaseline = {
    capturedFrom: requested ? (previous as RenderBaseline).capturedFrom : capturedFrom,
    viewport: VIEWPORT,
    mobileLcp: previous?.mobileLcp ?? LCP_NOT_MEASURED,
    routes: Object.fromEntries(all.flatMap((route) => {
      const entry = entries.get(route) ?? previous?.routes[route];
      return entry ? [[route, entry]] : [];
    })),
  };
  writeFileSync(RENDER_BASELINE, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(`Wrote ${plural(routes.length, "route")} to ${RENDER_BASELINE_FILE} from ${capturedFrom}`);
}

function routesToVisit(selected: string[], requested: string[] | undefined, skipped: string[], expectClarity?: string): string[] {
  if (requested) return requested.filter((route) => !skipped.includes(route));

  const all = [...INDEXABLE_ROUTES, ...UTILITY_ROUTES];
  const needsAll = selected.some((rule) => ["BR-CONSOLE", "BR-H1", "BR-HEAD", "BR-RAW"].includes(rule)) || (selected.includes("BR-CLARITY") && !expectClarity);
  const needed = new Set<string>(needsAll ? all : []);
  if (selected.includes("BR-AREAS")) needed.add("/areas");
  if (selected.includes("BR-RANK")) RANK_ROUTES.forEach((route) => needed.add(route));
  if (selected.includes("BR-CLARITY") && expectClarity) ["/", "/checkout-success"].forEach((route) => needed.add(route));
  return [...needed].filter((route) => !skipped.includes(route));
}

function loadBaseline(): RankBaseline | undefined {
  return existsSync(BASELINE) ? (JSON.parse(readFileSync(BASELINE, "utf8")) as RankBaseline) : undefined;
}

async function launch(): Promise<Browser> {
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      // Try the next installed browser.
    }
  }
  throw new UsageError("Neither Edge nor Chrome could be started");
}

/** Fails on a production build, which cannot report what --dev-react exists to find. */
function requireDevReact() {
  const assets = resolve(ROOT, "dist/assets");
  const scripts = existsSync(assets) ? readdirSync(assets).filter((file) => file.endsWith(".js")) : [];
  if (scripts.some((file) => readFileSync(resolve(assets, file), "utf8").includes(BROWSER.devReact.marker))) return;
  throw new UsageError("dist/ has production React. Run NODE_ENV=development npm run build first.");
}

async function writeRankH1(browser: Browser, session: Session) {
  const baseline = loadBaseline();
  if (!baseline) throw new UsageError("Run npm run verify -- --write-rank-baseline first");
  for (const route of RANK_ROUTES) {
    const snapshot = await visit(browser, session, { route }, false);
    if (snapshot.h1s.length === 0) throw new UsageError(`No rendered H1 on ${route}`);
    baseline.pages[route].h1 = snapshot.h1s[0];
  }
  writeFileSync(BASELINE, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log("Wrote the rendered H1s to scripts/verify/rank-baseline.json");
}

async function run(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));
  for (const flag of args.flags) if (!KNOWN_FLAGS.includes(flag)) throw new UsageError(`Unknown flag: --${flag}`);
  for (const key of args.values.keys()) if (!KNOWN_VALUES.includes(key)) throw new UsageError(`Unknown option: --${key}`);

  const devReact = args.flags.has("dev-react");
  const measuring = args.flags.has("measure-lcp");
  const named = listValue(args, "rules") ?? [];
  const selected = listValue(args, "rules") ?? (devReact ? ["BR-HYDRATE"] : BROWSER_RULES.filter((rule) => rule !== "BR-LCP"));
  const unknown = selected.filter((rule) => !BROWSER_RULES.includes(rule));
  if (unknown.length > 0) throw new UsageError(`Unknown rule: ${unknown.join(", ")}`);

  const base = args.values.get("base")?.replace(/\/+$/, "");
  if (devReact && base) throw new UsageError("--dev-react reads dist/, so it does not run with --base");
  if ((measuring || selected.includes("BR-LCP")) && !base) throw new UsageError("Lab LCP is only comparable on a deployment, so it needs --base");
  const expectClarity = args.values.get("expect-clarity");
  const requested = routeList(args, "route");
  const skipped = routeList(args, "skip") ?? [];
  for (const route of [...(requested ?? []), ...skipped]) {
    if (!route.startsWith("/")) throw new UsageError(`A route must start with /: ${route}`);
  }
  const routes = routesToVisit(selected, requested, skipped, expectClarity);
  const targets = selected.some((rule) => PAGE_RULES.includes(rule)) ? targetsFor(routes) : [];

  let server: RunningServer | undefined;
  if (!base) {
    if (!existsSync(resolve(ROOT, "dist/index.html"))) throw new UsageError("dist/index.html not found: run npm run build first");
    if (devReact) requireDevReact();
    server = await startStaticServer(ROOT);
  }
  const realFonts = measuring || selected.includes("BR-LCP");
  const session: Session = { origin: base ?? (server as RunningServer).origin, baseMode: Boolean(base), expectClarity, blockedWrites: [], realFonts };

  const browser = await launch();
  try {
    if (args.flags.has("write-rank-h1")) {
      await writeRankH1(browser, session);
      return 0;
    }
    if (args.flags.has("write-render-baseline")) {
      const commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
      await writeRenderBaseline(browser, session, base ?? commit, requested, args.flags.has("from-prerendered"));
      return 0;
    }
    if (measuring) {
      await writeLcpBaseline(browser, session);
      return 0;
    }

    const baseline = loadBaseline();
    const findings: Finding[] = [];
    const clarity = selected.includes("BR-CLARITY");
    const has = (rule: string) => selected.includes(rule);

    await inPool(targets, async (target) => {
      let snapshot: PageSnapshot;
      try {
        snapshot = await visit(browser, session, target, clarity);
      } catch (error) {
        if (error instanceof PreviewProtected) throw error;
        const file = target.scenario ? `${target.route} [${target.scenario}]` : target.route;
        findings.push({ rule: "BR-H1", file, message: `the page did not load: ${error instanceof Error ? error.message : String(error)}` });
        return;
      }
      if (has("BR-CONSOLE")) findings.push(...checkConsole(snapshot, session.origin));
      if (has("BR-H1")) findings.push(...checkH1(snapshot));
      if (has("BR-AREAS")) findings.push(...checkAreas(snapshot));
      if (has("BR-HEAD")) findings.push(...checkHead(snapshot));
      if (has("BR-RANK")) findings.push(...checkRank(snapshot, baseline?.pages[snapshot.route]?.h1));
      if (has("BR-CLARITY")) findings.push(...checkClarity(snapshot, expectClarity));
      if (has("BR-RAW")) findings.push(...checkRawPage(snapshot));
    });

    if (has("BR-NAV") && (!requested || named.includes("BR-NAV"))) findings.push(...(await navFindings(browser, session)));
    if (has("BR-CART") && (!requested || named.includes("BR-CART"))) findings.push(...(await cartFindings(browser, session)));
    if (has("BR-404") && (!requested || named.includes("BR-404"))) findings.push(...(await missingUrlFindings(browser, session)));

    const everyRoute = devReact ? BROWSER.devReact.routes : [...INDEXABLE_ROUTES, ...UTILITY_ROUTES];
    const hydrationRoutes = has("BR-HYDRATE") ? (requested ?? everyRoute).filter((route) => !skipped.includes(route)) : [];
    findings.push(...(await hydrationFindings(browser, session, hydrationRoutes)));
    if (has("BR-LCP")) {
      const { lab } = loadRenderBaseline().mobileLcp;
      const measured = await measureLcp(browser, session);
      for (const route of BROWSER.lcp.routes) findings.push(...checkLcpRuns(route, measured[route].runsMs, lab?.routes[route]));
    }

    console.log(`Checked ${routes.length} route${routes.length === 1 ? "" : "s"} (${targets.length} page loads) against ${base ?? "dist/"}.`);
    if (hydrationRoutes.length > 0) {
      const later = hydrationRoutes.filter((route) => BROWSER.clockRoutes.includes(route));
      console.log(`BR-HYDRATE: ${plural(hydrationRoutes.length, "route")}${devReact ? " with development React" : ""}, each with an empty and a seeded cart${later.length > 0 ? `, and ${later.join(", ")} on a later date` : ""}.`);
    }
    if (session.blockedWrites.length > 0) {
      const unique = [...new Set(session.blockedWrites)];
      console.log(`Blocked ${session.blockedWrites.length} write request${session.blockedWrites.length === 1 ? "" : "s"}: ${unique.join(", ")}`);
    }
    findings.sort((a, b) => (a.file ?? "").localeCompare(b.file ?? ""));
    return report(findings, "verify:browser");
  } finally {
    await browser.close();
    await server?.close();
  }
}

run()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    if (error instanceof PreviewProtected) {
      console.error("preview protected: 401 from the deployment, nothing was checked. Set VERCEL_BYPASS_TOKEN.");
      process.exitCode = 1;
    } else if (error instanceof UsageError) {
      console.error(`verify:browser: ${error.message}`);
      process.exitCode = 2;
    } else throw error;
  });
