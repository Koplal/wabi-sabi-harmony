/**
 * Renders every route in the installed Edge or Chrome and checks the result.
 *
 *   npm run verify:browser                         all routes and rules, on dist/
 *   npm run verify:browser -- --route=/a,/b        only these routes
 *   npm run verify:browser -- --route=/does-not-exist  the 404 page: BR-404 runs and BR-HYDRATE,
 *     which needs a page built for the URL, leaves it out
 *   npm run verify:browser -- --skip=/a,/b         all routes except these
 *   npm run verify:browser -- --rules=BR-H1,BR-NAV only these rules
 *   npm run verify:browser -- --base=<url>         a deployment instead of dist/
 *   npm run verify:browser -- --expect-clarity=<id>  a build made with that Clarity ID
 *   npm run verify:browser -- --dev-react          BR-HYDRATE with development React, which alone
 *     reports attribute mismatches. Build with NODE_ENV=development npm run build first, and run
 *     npm run build again before any other pass
 *   npm run verify:browser -- --rules=BR-LCP --base=<url>  R2-FR-12: lab LCP and layout shift on a
 *     deployment, against production in the same sitting. With production as --base, the saved R1
 *     figure is the comparison
 *   npm run verify:browser -- --measure-lcp --base=<site>  saves production's lab LCP as the R1 figure
 *     with --route=/a                             adds a route new to BROWSER.lcp to that record
 *   npm run verify:browser -- --write-render-baseline  saves each route's rendered text, from dist/ only
 *     with --route=/a,/b                          only these routes, keeping the rest
 *     with --from-prerendered --route=/a,/b       allows a prerendered build, which replaces R1 text,
 *                                                 and only for the routes named
 *
 * BR-RENDER reads dist/ only, because a deployment renders its reviews and the saved text has none.
 * A page changed on purpose takes a new entry with --write-render-baseline --route=<route>.
 *
 * A full pass must never skip /cart, /checkout or /checkout-success.
 *
 * Analytics hosts and /_vercel/* are answered locally on every pass, including --base, and
 * nothing but GET and HEAD leaves the browser. Exit codes: 0 pass, 1 findings, 2 setup error.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type Browser, type BrowserContext, type BrowserContextOptions, chromium, type ConsoleMessage, type Page, type Route } from "playwright-core";
import { BROWSER, type EarlyFormPlan, FAQ_FILES, INDEXABLE_ROUTES, LIVE, RANK_ROUTES, RENDER_BASELINE_FILE, SITE, UTILITY_ROUTES, type SiteDown, type TypedMoment } from "./verify/rules";
import { type Finding, htmlFileOfRoute, listValue, median, parseArgs, pathOfHref, rawHeadingsOf, report, routeList, textWords, UsageError } from "./verify/lib";
import {
  BROWSER_RULES,
  type CartStep,
  checkAreas,
  checkCart,
  checkClarity,
  checkConsole,
  checkEarly,
  checkGa,
  checkH1,
  checkHead,
  checkHydrate,
  checkInteract,
  checkLcpRuns,
  checkMissingUrl,
  checkNav,
  checkRank,
  checkRawPage,
  checkRendered,
  type EarlyReading,
  fromPrerenderedProblem,
  type HydrationSnapshot,
  hydrationUrls,
  type InteractReading,
  type LcpMeasure,
  type NavStep,
  type PageSnapshot,
  runsMissingUrl,
} from "./verify/browser-rules";
import type { LcpLab, RankBaseline, RenderBaseline, RenderEntry } from "./verify/dist-checks";
import { faqAnswers } from "./verify/source-checks";
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

/** Rules read from one visit to each route. BR-NAV, BR-404, BR-HYDRATE, BR-CART, BR-INTERACT and BR-EARLY make their own visits. */
const PAGE_RULES = ["BR-CONSOLE", "BR-H1", "BR-AREAS", "BR-HEAD", "BR-RANK", "BR-CLARITY", "BR-GA", "BR-RAW", "BR-RENDER"];

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

    // The page's speed report goes out on any click. It is answered here so it never counts as a write.
    if (url.pathname === "/api/report-vitals") {
      await route.fulfill({ status: 204 });
      return;
    }
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
  "finalPath" | "h1s" | "canonicals" | "descriptions" | "title" | "jsonLd" | "areaLinks" | "hasNameField" | "clarityScript" | "clarityScriptSrc" | "gaConfigs"
>;

const readPage = (page: Page): Promise<PageReading> =>
  page.evaluate(() => {
    const clarity = document.querySelector<HTMLScriptElement>("script#clarity-script");
    return {
      finalPath: location.pathname,
      h1s: [...document.querySelectorAll("h1")].map((heading) => (heading.textContent ?? "").replace(/\s+/g, " ").trim()).filter(Boolean),
      canonicals: [...document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')].map((link) => link.getAttribute("href") ?? ""),
      descriptions: [...document.querySelectorAll<HTMLMetaElement>('meta[name="description"]')].map((meta) => meta.content),
      title: document.title,
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => script.textContent ?? ""),
      areaLinks: document.querySelectorAll('main a[href^="/areas/"]').length,
      hasNameField: Boolean(document.querySelector("#name")),
      clarityScript: Boolean(clarity),
      clarityScriptSrc: clarity?.src,
      gaConfigs: ((window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? []).filter((entry) => entry[0] === "config").length,
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
  __verifyNav?: boolean;
  __verifySubmits?: number;
  __verifyMarkup?: { content: Element | null; heading: Element | null; empty: boolean };
  __verifyCartWrites?: string[];
  __verifyLcp?: number;
  __verifyShift?: number;
}

/**
 * Keeps the nodes the HTML itself put in #root. It runs at document start, and the parser sets
 * readyState to interactive before deferred and module scripts run, so app code adds nothing here.
 * <main> holds the page and React completes it after its children, so it owning <main> means the
 * page hydrated. The first child of #root is the toast region, which does not.
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

const countSubmits = () => {
  document.addEventListener(
    "submit",
    () => {
      const probe = window as unknown as ProbeWindow;
      probe.__verifySubmits = (probe.__verifySubmits ?? 0) + 1;
    },
    true
  );
};

const linksOnScreen = (page: Page, selector: string) =>
  page.evaluate(
    (links) => [...document.querySelectorAll<HTMLAnchorElement>(links)].filter((link) => link.getClientRects().length > 0).map((link) => link.getAttribute("href") ?? ""),
    selector
  );

/** Nothing counts until it takes up room on screen, because closed answers may be in the DOM after R2-14. */
const panelText = (page: Page, id: string) =>
  page.evaluate((panel) => {
    const element = document.getElementById(panel);
    return element && element.getBoundingClientRect().height > 0 ? element.innerText.trim() : "";
  }, id);

async function openAnswer(page: Page): Promise<InteractReading["answer"]> {
  const trigger = page.locator(BROWSER.interact.accordion.trigger).first();
  const panel = (await trigger.getAttribute("aria-controls", { timeout: RENDER_TIMEOUT })) ?? "";
  const before = await panelText(page, panel);
  await trigger.click({ timeout: RENDER_TIMEOUT });
  await page.waitForFunction((id) => (document.getElementById(id)?.getBoundingClientRect().height ?? 0) > 0, panel, { timeout: HEADING_TIMEOUT }).catch(() => undefined);
  return { before, after: await panelText(page, panel) };
}

async function openMenu(page: Page): Promise<InteractReading["menu"]> {
  const { button, links } = BROWSER.interact.menu;
  const before = await linksOnScreen(page, links);
  await page.locator(button).tap({ timeout: RENDER_TIMEOUT });
  await page.locator(links).first().waitFor({ state: "visible", timeout: HEADING_TIMEOUT }).catch(() => undefined);
  return { before, after: await linksOnScreen(page, links) };
}

async function openDropdown(page: Page): Promise<InteractReading["dropdown"]> {
  const { button, links } = BROWSER.interact.dropdown;
  const before = await linksOnScreen(page, links);
  await page.locator(button).click({ timeout: RENDER_TIMEOUT });
  await page.locator(links).first().waitFor({ state: "visible", timeout: HEADING_TIMEOUT }).catch(() => undefined);
  return { before, after: await linksOnScreen(page, links) };
}

/** Types one key at a time and stops. Enter would submit, so it is never pressed. */
async function typeInField(page: Page): Promise<InteractReading["field"]> {
  const { selector, text } = BROWSER.interact.field;
  const field = page.locator(selector);
  await field.pressSequentially(text, { timeout: RENDER_TIMEOUT });
  const submits = await page.evaluate(() => (window as unknown as ProbeWindow).__verifySubmits ?? 0);
  return { value: await field.inputValue(), submits };
}

/** The seasonal pages' waitlist link names the option in its query, and the choice is made once the page attaches. */
async function readWaitlist(page: Page): Promise<InteractReading["waitlist"]> {
  const { trigger, reply } = BROWSER.interact.waitlist;
  const line = page.getByText(reply, { exact: true });
  await line.waitFor({ timeout: HEADING_TIMEOUT }).catch(() => undefined);
  const selected = await page.locator(trigger).first().innerText({ timeout: RENDER_TIMEOUT });
  return { selected: selected.trim(), replied: await line.isVisible() };
}

async function clickFooterLink(page: Page, path: string): Promise<number> {
  const link = page.locator(`footer a[href="${path}"]`).first();
  await link.scrollIntoViewIfNeeded({ timeout: RENDER_TIMEOUT });
  const scrolled = await page.evaluate(() => window.scrollY);
  await link.click({ timeout: RENDER_TIMEOUT });
  await page.waitForFunction((target) => location.pathname === target, path, { timeout: RENDER_TIMEOUT }).catch(() => undefined);
  await settle(page);
  return scrolled;
}

/** Both pages are loaded by the time it counts, so the second click swaps them with no fallback between. */
async function followFooterLinks(page: Page): Promise<InteractReading["scroll"]> {
  const { start, through } = BROWSER.interact.scroll;
  await page.evaluate(() => {
    (window as unknown as ProbeWindow).__verifyNav = true;
  });
  await clickFooterLink(page, through);
  const before = await clickFooterLink(page, start);
  const reading = await page.evaluate(() => ({
    after: window.scrollY,
    clientSide: (window as unknown as ProbeWindow).__verifyNav === true,
    finalPath: location.pathname,
  }));
  return { before, ...reading };
}

async function interactFindings(browser: Browser, session: Session): Promise<Finding[]> {
  const { accordion, menu, dropdown, field, waitlist, scroll } = BROWSER.interact;
  const writesBefore = session.blockedWrites.length;
  const errors: InteractReading["errors"] = {};

  async function step<T>(name: string, route: string, act: (page: Page) => Promise<T>, options?: BrowserContextOptions): Promise<T | undefined> {
    const { context, page } = await newPage(browser, session, undefined, options);
    try {
      await context.addInitScript(countSubmits);
      const response = await page.goto(`${session.origin}${route}`, { waitUntil: "load" });
      if (response?.status() === 401) throw new PreviewProtected();
      await settle(page);
      return await act(page);
    } catch (error) {
      if (error instanceof PreviewProtected) throw error;
      errors[name] = error instanceof Error ? error.message.split("\n")[0] : String(error);
      return undefined;
    } finally {
      await closeWithinLimit(context, name);
    }
  }

  const reading = {
    answer: await step("FAQ answer", accordion.route, openAnswer),
    menu: await step("mobile menu", menu.route, openMenu, { viewport: menu.viewport, isMobile: true, hasTouch: true }),
    dropdown: await step("dropdown", dropdown.route, openDropdown),
    field: await step("form field", field.route, typeInField),
    waitlist: await step("waitlist link", waitlist.route, readWaitlist),
    scroll: await step("scroll reset", scroll.start, followFooterLinks),
  };
  return checkInteract({ ...reading, errors, writes: session.blockedWrites.slice(writesBefore) });
}

/** Keeps the page as its HTML built it until the result is called. A page route runs ahead of guardRequests, then falls through to it. */
async function holdScripts(page: Page) {
  let release = () => {};
  const released = new Promise<void>((done) => {
    release = done;
  });
  await page.route(BROWSER.early.scripts, async (route) => {
    await released;
    await route.fallback().catch(() => undefined);
  });
  return release;
}

/** With scripts held, neither the load event nor DOMContentLoaded can come. */
async function loadBuiltPage(page: Page, session: Session, route: string) {
  const response = await page.goto(`${session.origin}${route}`, { waitUntil: "commit" });
  if (response?.status() === 401) throw new PreviewProtected();
  await page.waitForSelector("main", { state: "attached", timeout: RENDER_TIMEOUT });
}

const reactOwnsPage = (page: Page) =>
  page.evaluate(() => {
    const main = document.querySelector("#root main");
    return Boolean(main) && Object.keys(main as Element).some((key) => key.startsWith("__reactFiber$"));
  });

async function attach(page: Page, release: () => void) {
  release();
  await settle(page);
  await page.waitForTimeout(HYDRATION_QUIET);
  return reactOwnsPage(page);
}

async function scrollEarly(page: Page, session: Session): Promise<EarlyReading["scroll"]> {
  const { route, to } = BROWSER.early.scroll;
  const release = await holdScripts(page);
  await loadBuiltPage(page, session, route);
  // Styles give the page its height, and they are not held.
  await page.waitForFunction((target) => document.documentElement.scrollHeight >= target + window.innerHeight, to, { timeout: RENDER_TIMEOUT });
  const held = !(await reactOwnsPage(page));
  const before = await page.evaluate((target) => {
    window.scrollTo(0, target);
    return window.scrollY;
  }, to);
  const attached = await attach(page, release);
  return { held, attached, before, after: await page.evaluate(() => window.scrollY) };
}

/** Picks the first choice in each Select, which is also a later change to the form. */
async function chooseOptions(page: Page) {
  const selects = page.locator('form [role="combobox"]');
  for (let index = 0; index < (await selects.count()); index++) {
    await selects.nth(index).click({ timeout: RENDER_TIMEOUT });
    await page.locator('[role="option"]').first().click({ timeout: RENDER_TIMEOUT });
  }
}

/**
 * A field left empty, or one that lost its text, stops a submit at required before anything else
 * can happen. These steps test what comes after that, so that check must not answer for them.
 */
const skipValidation = (page: Page) =>
  page.locator("form").evaluate((form: HTMLFormElement) => {
    form.noValidate = true;
  });

/** On its own load, because leaving the page would lose the text the send below has to carry. */
async function pressEnterEarly(page: Page, session: Session, plan: EarlyFormPlan) {
  await holdScripts(page);
  await loadBuiltPage(page, session, plan.route);
  await skipValidation(page);
  const start = page.url();
  const [[selector, text]] = Object.entries(plan.early);
  await page.locator(selector).fill(text, { timeout: RENDER_TIMEOUT });
  await page.locator(selector).press("Enter", { timeout: RENDER_TIMEOUT });
  await page.waitForTimeout(HYDRATION_QUIET);
  return page.url() !== start;
}

async function sendEarly(page: Page, session: Session, plan: EarlyFormPlan): Promise<EarlyReading["forms"][string]> {
  const release = await holdScripts(page);
  await loadBuiltPage(page, session, plan.route);
  const held = !(await reactOwnsPage(page));
  const help = await page.locator("form").innerText({ timeout: RENDER_TIMEOUT });
  for (const [selector, text] of Object.entries(plan.early)) await page.locator(selector).fill(text, { timeout: RENDER_TIMEOUT });

  const attached = await attach(page, release);
  for (const [selector, text] of Object.entries(plan.late)) await page.locator(selector).pressSequentially(text, { timeout: RENDER_TIMEOUT });
  await chooseOptions(page);
  await skipValidation(page);
  const writes = session.blockedWrites.length;
  const sending = page.waitForRequest((request) => request.method() === "POST" && request.url().endsWith(plan.action), { timeout: RENDER_TIMEOUT });
  await page.locator('form button[type="submit"]').click({ timeout: RENDER_TIMEOUT });
  const sent = await sending;
  // Settles once guardRequests has answered it.
  await sent.response().catch(() => null);
  return { held, attached, stopped: session.blockedWrites.length > writes, body: sent.postData() ?? "", help };
}

/** Counts the documents a page loads, because a reload is what these steps watch for. */
function countLoads(page: Page) {
  let loads = 0;
  page.on("response", (response) => {
    if (response.request().isNavigationRequest() && response.frame() === page.mainFrame()) loads++;
  });
  return () => loads;
}

/** Loads the page with its script failing, and returns how many documents had loaded by the time it would have attached. */
async function failPageScript(page: Page, session: Session, times?: number) {
  const { route, script } = BROWSER.early.chunk;
  const loads = countLoads(page);
  await page.route(script, (blocked) => blocked.abort(), { times });
  await loadBuiltPage(page, session, route);
  await settle(page);
  await page.waitForTimeout(HYDRATION_QUIET);
  return loads();
}

/** As failPageScript, with the page's own URL answering badly. Only the script's HEAD check does, or the page could not load at all. */
async function failSiteCheck(page: Page, session: Session, answer: SiteDown) {
  const { route } = BROWSER.early.chunk;
  let settled = answer !== "stalled";
  page.on("requestfailed", (request) => {
    if (request.method() === "HEAD") settled = true;
  });
  await page.route(`${session.origin}${route}`, async (request) => {
    if (request.request().method() !== "HEAD") await request.fallback();
    else if (answer === "aborted") await request.abort();
    else if (answer === "refused") await request.fulfill({ status: 503 });
    else await new Promise(() => undefined);
  });
  const loads = await failPageScript(page, session);
  return { loads, heading: await page.locator("h1").first().isVisible(), settled };
}

/** Lets the page's script fail with text in the form: typed while the scripts wait, or while the site check waits. */
async function failWithText(page: Page, session: Session, moment: TypedMoment) {
  const { route, script, field, text } = BROWSER.early.chunk;
  const fill = () => page.locator(field).fill(text, { timeout: RENDER_TIMEOUT });
  const loads = countLoads(page);
  let release = () => {};
  if (moment === "before") {
    release = await holdScripts(page);
  } else {
    const answer = new Promise<void>((done) => {
      release = done;
    });
    await page.route(`${session.origin}${route}`, async (request) => {
      if (request.request().method() === "HEAD") await answer;
      await request.fallback().catch(() => undefined);
    });
  }
  const asked = moment === "during" ? page.waitForRequest((request) => request.method() === "HEAD", { timeout: RENDER_TIMEOUT }) : undefined;
  await page.route(script, (blocked) => blocked.abort());
  await loadBuiltPage(page, session, route);
  await asked;
  await fill();
  release();
  await settle(page);
  await page.waitForTimeout(HYDRATION_QUIET);
  return { loads: loads(), kept: (await page.locator(field).inputValue()) === text };
}

const RELOAD_READING = "fields-locked-at-reload";
const FORM_FIELDS = "form input[id], form textarea[id]";

/**
 * Reads the form as the reload leaves the page, and keeps the answer in session storage for the next page to give back.
 * Nothing holds the reload open, because a read sent to a page waiting on a navigation may never return.
 */
async function failWhileReloading(page: Page, session: Session) {
  const { route, script } = BROWSER.early.chunk;
  await page.addInitScript(
    ([selector, key]) => {
      addEventListener("beforeunload", () => {
        const fields = [...document.querySelectorAll<HTMLInputElement>(selector)];
        sessionStorage.setItem(key, String(fields.length > 0 && fields.every((field) => field.readOnly)));
      });
    },
    [FORM_FIELDS, RELOAD_READING]
  );
  await page.route(script, (blocked) => blocked.abort());
  await loadBuiltPage(page, session, route);
  const locked = await page.waitForFunction((key) => sessionStorage.getItem(key), RELOAD_READING, { timeout: RENDER_TIMEOUT }).then(
    (found) => found.jsonValue(),
    () => null
  );
  return { reached: locked !== null, editable: locked !== null && locked !== "true" };
}

/** Sends a form that fails after React attached, the one way a visitor meets this. */
async function failSend(page: Page, session: Session, plan: EarlyFormPlan) {
  const [[selector, text]] = Object.entries(plan.early);
  await page.route(`**${plan.action}`, (request) => request.fulfill({ status: 502 }));
  const release = await holdScripts(page);
  await loadBuiltPage(page, session, plan.route);
  for (const [early, value] of Object.entries(plan.early)) await page.locator(early).fill(value, { timeout: RENDER_TIMEOUT });
  await attach(page, release);
  await chooseOptions(page);
  await skipValidation(page);
  await page.locator('form button[type="submit"]').click({ timeout: RENDER_TIMEOUT });
  const told = await page
    .getByText(BROWSER.early.sendFailed)
    .first()
    .waitFor({ timeout: RENDER_TIMEOUT })
    .then(
      () => true,
      () => false
    );
  return { told, kept: (await page.locator(selector).inputValue()) === text };
}

const mainText = (page: Page) => page.evaluate(() => document.querySelector<HTMLElement>("main")?.innerText.trim() ?? "");

/** What a returning visitor reads on the built /cart, and then once their saved cart has loaded. */
async function readCartEarly(page: Page, session: Session): Promise<EarlyReading["cart"]> {
  const release = await holdScripts(page);
  await loadBuiltPage(page, session, BROWSER.early.cart.route);
  // The parser is done by now, because module scripts wait for it and readyState moves first.
  await page.waitForFunction(() => document.readyState !== "loading", undefined, { timeout: RENDER_TIMEOUT });
  const held = !(await reactOwnsPage(page));
  const before = await mainText(page);
  const attached = await attach(page, release);
  return { held, attached, before, after: await mainText(page) };
}

/** Longer than any step here takes. A stuck browser call then fails its step, and the run still ends. */
const STEP_LIMIT = 60_000;

async function withinLimit<T>(work: Promise<T>): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const limit = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`no result after ${STEP_LIMIT / 1000} seconds`)), STEP_LIMIT);
  });
  try {
    return await Promise.race([work, limit]);
  } finally {
    clearTimeout(timer);
  }
}

/** A close can stall as well. What the step read still stands, so this warns and the run moves on. */
async function closeWithinLimit(context: BrowserContext, name: string) {
  await withinLimit(context.close()).catch((error: unknown) => {
    console.warn(`${name}: the browser context did not close: ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`);
  });
}

async function earlyFindings(browser: Browser, session: Session): Promise<Finding[]> {
  const errors: EarlyReading["errors"] = {};

  async function step<T>(name: string, act: (page: Page) => Promise<T>, scenario?: Scenario): Promise<T | undefined> {
    const { context, page } = await newPage(browser, session, scenario);
    try {
      return await withinLimit(act(page));
    } catch (error) {
      if (error instanceof PreviewProtected) throw error;
      errors[name] = error instanceof Error ? error.message.split("\n")[0] : String(error);
      return undefined;
    } finally {
      await closeWithinLimit(context, name);
    }
  }

  const scroll = await step("scroll", (page) => scrollEarly(page, session));
  const forms: EarlyReading["forms"] = {};
  const enterLeft: EarlyReading["enterLeft"] = {};
  for (const plan of BROWSER.early.forms) {
    const left = await step(`Enter ${plan.route}`, (page) => pressEnterEarly(page, session, plan));
    if (left !== undefined) enterLeft[plan.route] = left;
    const sent = await step(`form ${plan.route}`, (page) => sendEarly(page, session, plan));
    if (sent) forms[plan.route] = sent;
  }
  const retry = await step("one failed script", async (page) => {
    const loads = await failPageScript(page, session, 1);
    return { loads, attached: await reactOwnsPage(page) };
  });
  const giveUp = await step("a script that always fails", async (page) => {
    const loads = await failPageScript(page, session);
    return { loads, heading: await page.locator("h1").first().isVisible() };
  });
  const siteDown: EarlyReading["siteDown"] = {};
  for (const answer of BROWSER.early.siteDown) {
    const seen = await step(`site check ${answer}`, (page) => failSiteCheck(page, session, answer));
    if (seen) siteDown[answer] = seen;
  }
  const typed: EarlyReading["typed"] = {};
  for (const moment of BROWSER.early.typed) {
    const seen = await step(`text ${moment} the site check`, (page) => failWithText(page, session, moment));
    if (seen) typed[moment] = seen;
  }
  const reloading = await step("reloading", (page) => failWhileReloading(page, session));
  const sendFailed: EarlyReading["sendFailed"] = {};
  for (const plan of BROWSER.early.forms) {
    const seen = await step(`failed send ${plan.route}`, (page) => failSend(page, session, plan));
    if (seen) sendFailed[plan.route] = seen;
  }
  const cart = await step("saved cart", (page) => readCartEarly(page, session), "seeded cart");
  return checkEarly({ scroll, forms, enterLeft, retry, giveUp, siteDown, typed, reloading, sendFailed, cart, errors });
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

/**
 * Radix fills the hidden native <select> behind a closed Select after mount, and innerText reads
 * it although nobody sees it. Those options are a menu's open state, which R2-FR-01 leaves out and
 * no prerender can hold, so the selects leave the layout for the moment of the read.
 */
const readRendered = (page: Page) =>
  page.evaluate(() => {
    const root = document.getElementById("root");
    const hrefs = [...(root?.querySelectorAll("a[href]") ?? [])].map((link) => link.getAttribute("href") ?? "");
    const selects = [...(root?.querySelectorAll<HTMLElement>('select[aria-hidden="true"]') ?? [])];
    const displays = selects.map((select) => select.style.display);
    selects.forEach((select) => {
      select.style.display = "none";
    });
    const text = (root?.innerText ?? "").replace(/\s+/g, " ").trim();
    selects.forEach((select, index) => {
      select.style.display = displays[index];
    });
    return {
      finalPath: location.pathname,
      h1: (document.querySelector("h1")?.textContent ?? "").replace(/\s+/g, " ").trim(),
      text,
      links: [...new Set(hrefs.filter((href) => href.startsWith("/")).map((href) => href.split(/[?#]/)[0]))].sort(),
    };
  });

const LCP_NOTE = "lab is the R2-FR-12 record: BROWSER.lcp on R1 production, with measuredOn in UTC. BR-LCP compares a deployment with production in one sitting while R1 is live, and with this figure after that. field is the Speed Insights reading R2-02 names, with its sample count and dates. It stays null until Justin saves one or records that lab replaces it, and D-LCP warns until then. Never estimate either.";
const LCP_NOT_MEASURED: RenderBaseline["mobileLcp"] = { lab: null, field: null, note: LCP_NOTE };

const watchLcp = () => {
  const probe = window as unknown as ProbeWindow;
  probe.__verifyShift = 0;
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    probe.__verifyLcp = entries[entries.length - 1].startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as unknown as Array<{ value: number; hadRecentInput: boolean }>) {
      if (!entry.hadRecentInput) probe.__verifyShift = (probe.__verifyShift ?? 0) + entry.value;
    }
  }).observe({ type: "layout-shift", buffered: true });
};

interface LcpReading {
  lcp: number;
  shift: number;
}

/**
 * A cold load with the BROWSER.lcp settings, in a new context so nothing is cached. Only the page
 * that was asked for counts: an error page or a redirect to a lighter page would read as fast.
 */
async function lcpRun(browser: Browser, session: Session, route: string): Promise<LcpReading | undefined> {
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
    if (!response?.ok()) throw new Error(`status ${response?.status()}`);
    await page.waitForLoadState("networkidle", { timeout: LCP_TIMEOUT }).catch(() => undefined);
    await page.waitForTimeout(LCP_QUIET);
    const { finalPath, lcp, shift } = await page.evaluate(() => {
      const probe = window as unknown as ProbeWindow;
      return { finalPath: location.pathname, lcp: probe.__verifyLcp, shift: probe.__verifyShift ?? 0 };
    });
    if (finalPath !== route) throw new Error(`ended at ${finalPath}`);
    return lcp === undefined ? undefined : { lcp, shift };
  } catch (error) {
    if (error instanceof PreviewProtected) throw error;
    console.log(`LCP: ${route} gave no figure: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  } finally {
    await context.close();
  }
}

/**
 * One load at a time, because pages side by side would compete for the CPU being measured. With
 * two sessions the runs alternate, so both see the same machine, network and hour. The result has
 * one entry per session, in the same order.
 */
async function measureLcp(browser: Browser, sessions: Session[], routes: string[]): Promise<Array<Record<string, LcpMeasure>>> {
  const measured = sessions.map((): Record<string, LcpMeasure> => ({}));
  for (const route of routes) {
    const readings = sessions.map((): LcpReading[] => []);
    for (let run = 0; run < BROWSER.lcp.runs; run++) {
      for (const [index, session] of sessions.entries()) {
        const reading = await lcpRun(browser, session, route);
        if (reading) readings[index].push(reading);
      }
    }
    for (const [index, session] of sessions.entries()) {
      const runsMs = readings[index].map((reading) => Math.round(reading.lcp));
      const shifts = readings[index].map((reading) => reading.shift);
      measured[index][route] = { runsMs, medianMs: median(runsMs), shifts };
      console.log(`LCP: ${session.origin}${route} median ${measured[index][route].medianMs} ms from ${runsMs.join(", ")}, layout shift ${Math.min(...shifts, Infinity).toFixed(4)} to ${Math.max(0, ...shifts).toFixed(4)}`);
    }
  }
  return measured;
}

const browserName = (browser: Browser) => `${browser.browserType().name()} ${browser.version()}`;

/**
 * R2-FR-12. While R1 is live, the deployment and production run in one sitting, which takes the
 * day, the machine and the browser out of the comparison. Once R2 is production, the saved figure
 * is all that is left of R1, and those differences are back, so the run says so.
 */
async function lcpFindings(browser: Browser, session: Session, routes: string[]): Promise<Finding[]> {
  if (session.origin !== SITE) {
    // baseMode is off so the deployment's bypass token is never sent to production.
    const production: Session = { origin: SITE, baseMode: false, blockedWrites: session.blockedWrites, realFonts: true };
    const [measured, comparison] = await measureLcp(browser, [session, production], routes);
    console.log(`BR-LCP: ${session.origin} against production in the same sitting.`);
    return routes.flatMap((route) => checkLcpRuns(route, measured[route], comparison[route]));
  }
  const { lab } = loadRenderBaseline().mobileLcp;
  const [measured] = await measureLcp(browser, [session], routes);
  console.log(`BR-LCP: against the R1 figure from ${lab?.measuredOn} on ${lab?.browser}, today on ${browserName(browser)}, so another sitting and possibly another machine. Layout shift is not compared, because the saved figure has none.`);
  return routes.flatMap((route) => checkLcpRuns(route, measured[route], lab?.routes[route]));
}

function loadRenderBaseline(): RenderBaseline {
  if (!existsSync(RENDER_BASELINE)) throw new UsageError(`${RENDER_BASELINE_FILE} not found`);
  return JSON.parse(readFileSync(RENDER_BASELINE, "utf8")) as RenderBaseline;
}

/**
 * R1 stops being live at the R2 deploy, so a saved figure is never replaced by accident. A route new
 * to BROWSER.lcp joins the saved record through --route, which leaves every saved route as it is.
 */
async function writeLcpBaseline(browser: Browser, session: Session, requested: string[] | undefined) {
  if (session.origin !== SITE) throw new UsageError(`The R1 figure must come from ${SITE}, not ${session.origin}`);
  const baseline = loadRenderBaseline();
  const saved = baseline.mobileLcp.lab;
  if (saved && !requested) throw new UsageError(`The R1 figure from ${saved.measuredOn} is saved. To compare, use --rules=BR-LCP. To add a route, use --route. To replace it, delete mobileLcp.lab by hand first.`);
  if (!saved && requested) throw new UsageError("--route adds to a saved R1 figure, and none is saved. Run --measure-lcp with no --route first.");
  const wanted = requested ?? BROWSER.lcp.routes;
  const unknown = wanted.filter((route) => !BROWSER.lcp.routes.includes(route));
  if (unknown.length > 0) throw new UsageError(`Not in BROWSER.lcp.routes: ${unknown.join(", ")}`);
  const taken = wanted.filter((route) => saved?.routes[route]);
  if (taken.length > 0) throw new UsageError(`Already has a saved figure: ${taken.join(", ")}`);
  const [measured] = await measureLcp(browser, [session], wanted);
  const short = wanted.filter((route) => measured[route].runsMs.length < BROWSER.lcp.runs);
  if (short.length > 0) throw new UsageError(`Nothing saved: too few runs gave a figure on ${short.join(", ")}`);
  const routes = { ...saved?.routes, ...Object.fromEntries(Object.entries(measured).map(([route, { runsMs, medianMs }]) => [route, { runsMs, medianMs }])) };
  const lab: LcpLab = saved ? { ...saved, routes } : { measuredOn: new Date().toISOString().slice(0, 10), target: session.origin, browser: browserName(browser), settings: BROWSER.lcp.settings, routes };
  writeFileSync(RENDER_BASELINE, `${JSON.stringify({ ...baseline, mobileLcp: { ...baseline.mobileLcp, lab } }, null, 2)}\n`);
  console.log(`Wrote the lab LCP to ${RENDER_BASELINE_FILE} from ${session.origin}`);
}

/**
 * Menus stay closed, and readRendered leaves out what a closed Select keeps behind it, so nothing
 * from their open states is counted (R2-FR-01). The saved text is the Release 1 record, so a build
 * that already has page bodies cannot replace it by accident.
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
  const needsAll = selected.some((rule) => ["BR-CONSOLE", "BR-H1", "BR-HEAD", "BR-GA", "BR-RAW", "BR-RENDER"].includes(rule)) || (selected.includes("BR-CLARITY") && !expectClarity);
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

function distScripts(): string[] {
  const assets = resolve(ROOT, "dist/assets");
  if (!existsSync(assets)) return [];
  return readdirSync(assets).filter((file) => file.endsWith(".js")).map((file) => readFileSync(resolve(assets, file), "utf8"));
}

/** Fails on a production build, which cannot report what --dev-react exists to find. */
function requireDevReact() {
  if (distScripts().some((text) => text.includes(BROWSER.devReact.marker))) return;
  throw new UsageError("dist/ has production React. Run NODE_ENV=development npm run build first.");
}

/** VITE_GOOGLE_REVIEWS is JSON in a string in the bundle, so this reads what was actually built. */
const BUILT_REVIEWS = /\\?"quote\\?"\s*:/;

const holdsReviews = () => distScripts().some((text) => BUILT_REVIEWS.test(text));

/**
 * The baseline is a tracked file in a public repo, and the review text must never enter the repo
 * (googleReviews.ts). A deployment and a build with that variable both render it.
 */
function refuseReviewText(base: string | undefined) {
  if (base) throw new UsageError("--write-render-baseline reads dist/ only, because a deployment renders its reviews, which must stay out of this repo");
  if (holdsReviews()) throw new UsageError("This build holds VITE_GOOGLE_REVIEWS, which must stay out of this repo. Unset it and run npm run build first.");
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
  const base = args.values.get("base")?.replace(/\/+$/, "");
  const notOnDeployment = (rule: string) => Boolean(base) && rule === "BR-RENDER";
  const selected = listValue(args, "rules") ?? (devReact ? ["BR-HYDRATE"] : BROWSER_RULES.filter((rule) => rule !== "BR-LCP" && !notOnDeployment(rule)));
  const unknown = selected.filter((rule) => !BROWSER_RULES.includes(rule));
  if (unknown.length > 0) throw new UsageError(`Unknown rule: ${unknown.join(", ")}`);

  if (devReact && base) throw new UsageError("--dev-react reads dist/, so it does not run with --base");
  if (selected.some(notOnDeployment)) throw new UsageError("BR-RENDER reads dist/ only, because a deployment renders its reviews and the saved text has none");
  if ((measuring || selected.includes("BR-LCP")) && !base) throw new UsageError("Lab LCP is only comparable on a deployment, so it needs --base");
  if (args.flags.has("write-render-baseline")) refuseReviewText(base);
  const expectClarity = args.values.get("expect-clarity");
  const requested = routeList(args, "route");
  const skipped = routeList(args, "skip") ?? [];
  for (const route of [...(requested ?? []), ...skipped]) {
    if (!route.startsWith("/")) throw new UsageError(`A route must start with /: ${route}`);
  }
  const prerenderProblem = fromPrerenderedProblem(args.flags.has("from-prerendered"), args.flags.has("write-render-baseline"), requested);
  if (prerenderProblem) throw new UsageError(prerenderProblem);
  const routes = routesToVisit(selected, requested, skipped, expectClarity);
  const targets = selected.some((rule) => PAGE_RULES.includes(rule)) ? targetsFor(routes) : [];

  let server: RunningServer | undefined;
  if (!base) {
    if (!existsSync(resolve(ROOT, "dist/index.html"))) throw new UsageError("dist/index.html not found: run npm run build first");
    if (devReact) requireDevReact();
    if (selected.includes("BR-RENDER") && holdsReviews()) throw new UsageError("BR-RENDER needs a build with no VITE_GOOGLE_REVIEWS, because the saved text has none. Unset it and run npm run build first.");
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
      await writeRenderBaseline(browser, session, commit, requested, args.flags.has("from-prerendered"));
      return 0;
    }
    if (measuring) {
      await writeLcpBaseline(browser, session, requested);
      return 0;
    }

    const baseline = loadBaseline();
    const findings: Finding[] = [];
    const clarity = selected.includes("BR-CLARITY");
    const has = (rule: string) => selected.includes(rule);
    const savedRoutes: RenderBaseline["routes"] = has("BR-RENDER") ? loadRenderBaseline().routes : {};
    const answers = has("BR-RAW") ? faqAnswers(readFileSync(resolve(ROOT, FAQ_FILES.data), "utf8")) : [];

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
      if (has("BR-GA")) findings.push(...checkGa(snapshot));
      if (has("BR-RAW")) findings.push(...checkRawPage(snapshot, answers));
      if (has("BR-RENDER")) findings.push(...checkRendered(snapshot, savedRoutes[snapshot.route]));
    });

    if (has("BR-NAV") && (!requested || named.includes("BR-NAV"))) findings.push(...(await navFindings(browser, session)));
    if (has("BR-CART") && (!requested || named.includes("BR-CART"))) findings.push(...(await cartFindings(browser, session)));
    if (has("BR-404") && runsMissingUrl(requested, named)) findings.push(...(await missingUrlFindings(browser, session)));
    const interacting = has("BR-INTERACT") && (!requested || named.includes("BR-INTERACT"));
    if (interacting) findings.push(...(await interactFindings(browser, session)));
    // After BR-INTERACT, which reports any write during its own steps, because each form here sends one.
    const early = has("BR-EARLY") && (!requested || named.includes("BR-EARLY"));
    if (early) findings.push(...(await earlyFindings(browser, session)));

    const { routes: hydrationRoutes, outside } = has("BR-HYDRATE") ? hydrationUrls(requested, skipped) : { routes: [], outside: [] };
    findings.push(...(await hydrationFindings(browser, session, hydrationRoutes)));
    if (has("BR-LCP")) findings.push(...(await lcpFindings(browser, session, requested ?? BROWSER.lcp.routes)));

    console.log(`Checked ${routes.length} route${routes.length === 1 ? "" : "s"} (${targets.length} page loads) against ${base ?? "dist/"}.`);
    if (base && named.length === 0) console.log("BR-RENDER: not run, because it reads dist/ only.");
    if (hydrationRoutes.length > 0) {
      const later = hydrationRoutes.filter((route) => BROWSER.clockRoutes.includes(route));
      console.log(`BR-HYDRATE: ${plural(hydrationRoutes.length, "route")}${devReact ? " with development React" : ""}, each with an empty and a seeded cart${later.length > 0 ? `, and ${later.join(", ")} on a later date` : ""}.`);
    }
    if (outside.length > 0) console.log(`BR-HYDRATE: not loaded, because no page is built for it: ${outside.join(", ")}`);
    if (interacting) console.log("BR-INTERACT: an FAQ answer, the mobile menu, the nav dropdown, a form field, the waitlist link and a scroll reset, with nothing submitted.");
    if (early) console.log("BR-EARLY: scrolling and filling in forms before React attaches, a page script that fails once and every time, and /cart with a saved cart. Each send stopped in the browser.");
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
