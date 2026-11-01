/**
 * Renders every route in the installed Edge or Chrome and checks the result.
 *
 *   npm run verify:browser                         all routes and rules, on dist/
 *   npm run verify:browser -- --route=/a,/b        only these routes
 *   npm run verify:browser -- --skip=/a,/b         all routes except these
 *   npm run verify:browser -- --rules=BR-H1,BR-NAV only these rules
 *   npm run verify:browser -- --base=<url>         a deployment instead of dist/
 *   npm run verify:browser -- --expect-clarity=<id>  a build made with that Clarity ID
 *
 * Analytics hosts and /_vercel/* are answered locally on every pass, including --base, and
 * nothing but GET and HEAD leaves the browser. Exit codes: 0 pass, 1 findings, 2 setup error.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type Browser, type BrowserContext, chromium, type ConsoleMessage, type Page, type Route } from "playwright-core";
import { BROWSER, INDEXABLE_ROUTES, RANK_ROUTES, UTILITY_ROUTES } from "./verify/rules";
import { type Finding, listValue, parseArgs, report, routeList, UsageError } from "./verify/lib";
import {
  BROWSER_RULES,
  checkAreas,
  checkClarity,
  checkConsole,
  checkH1,
  checkHead,
  checkNav,
  checkRank,
  type NavStep,
  type PageSnapshot,
} from "./verify/browser-rules";
import type { RankBaseline } from "./verify/dist-checks";
import { type RunningServer, startStaticServer } from "./verify/static-server";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE = resolve(ROOT, "scripts/verify/rank-baseline.json");

const WORKERS = 4;
const NAVIGATION_TIMEOUT = 45_000;
const RENDER_TIMEOUT = 8_000;
const HEADING_TIMEOUT = 3_000;
const CLARITY_WAIT = 12_000;
const CLARITY_ABSENT_WAIT = 3_000;

const KNOWN_FLAGS = ["write-rank-h1"];
const KNOWN_VALUES = ["route", "skip", "rules", "base", "expect-clarity"];

class PreviewProtected extends Error {}

const isHost = (hostname: string, host: string) => hostname === host || hostname.endsWith(`.${host}`);

interface Target {
  route: string;
  scenario?: "seeded cart" | "empty cart";
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
    if (BROWSER.fontHosts.some((host) => isHost(url.hostname, host))) {
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

async function newPage(browser: Browser, session: Session, scenario?: Target["scenario"]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await guardRequests(context, session);
  if (scenario === "seeded cart") {
    const cart = JSON.stringify(BROWSER.seededCart);
    await context.addInitScript((value) => localStorage.setItem("cart", value), cart);
  }
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

/** Waits for React to render, then for the head manager to stop changing the head. */
async function settle(page: Page) {
  await page
    .waitForFunction(
      () => {
        const root = document.getElementById("root");
        return Boolean(root && root.childElementCount > 0 && !root.querySelector('[aria-busy="true"]'));
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
    await settle(page);
    await waitForClarity(page, target, session, clarity);
    return { route: target.route, scenario: target.scenario, ...errors, ...(await readPage(page)) };
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

function routesToVisit(selected: string[], requested: string[] | undefined, skipped: string[], expectClarity?: string): string[] {
  if (requested) return requested.filter((route) => !skipped.includes(route));

  const all = [...INDEXABLE_ROUTES, ...UTILITY_ROUTES];
  const needsAll = selected.some((rule) => ["BR-CONSOLE", "BR-H1", "BR-HEAD"].includes(rule)) || (selected.includes("BR-CLARITY") && !expectClarity);
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

  const selected = listValue(args, "rules") ?? BROWSER_RULES;
  const unknown = selected.filter((rule) => !BROWSER_RULES.includes(rule));
  if (unknown.length > 0) throw new UsageError(`Unknown rule: ${unknown.join(", ")}`);

  const base = args.values.get("base")?.replace(/\/+$/, "");
  const expectClarity = args.values.get("expect-clarity");
  const requested = routeList(args, "route");
  const skipped = routeList(args, "skip") ?? [];
  for (const route of [...(requested ?? []), ...skipped]) {
    if (!route.startsWith("/")) throw new UsageError(`A route must start with /: ${route}`);
  }
  const routes = routesToVisit(selected, requested, skipped, expectClarity);
  const targets = targetsFor(routes);

  let server: RunningServer | undefined;
  if (!base) {
    if (!existsSync(resolve(ROOT, "dist/index.html"))) throw new UsageError("dist/index.html not found: run npm run build first");
    server = await startStaticServer(ROOT);
  }
  const session: Session = { origin: base ?? (server as RunningServer).origin, baseMode: Boolean(base), expectClarity, blockedWrites: [] };

  const browser = await launch();
  try {
    if (args.flags.has("write-rank-h1")) {
      await writeRankH1(browser, session);
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
    });

    const namedNav = listValue(args, "rules")?.includes("BR-NAV");
    if (has("BR-NAV") && (!requested || namedNav)) findings.push(...(await navFindings(browser, session)));

    console.log(`Checked ${routes.length} route${routes.length === 1 ? "" : "s"} (${targets.length} page loads) against ${base ?? "dist/"}.`);
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
