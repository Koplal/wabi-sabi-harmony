/**
 * Checks the speed report function with Axiom stubbed and a fake token, then the built site's
 * reports in a real browser, passing each one through that same function. Nothing leaves this
 * machine, so this proves our own behaviour and not Axiom's. Run npm run build first.
 *
 *   npm run verify:vitals
 *
 * Exit codes: 0 pass, 1 failures.
 */
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { type Browser, type BrowserContext, chromium, type Page } from "playwright-core";
import { POST } from "../api/report-vitals";
import { reportBody } from "../src/lib/reportVitals";
import { startStaticServer } from "./verify/static-server";

const TOKEN = "test-not-a-real-token";
const GOOD = { metric: "LCP", value: 2345.6, path: "/areas/oak-bay", device: "mobile" };
const LANDING = "/areas/oak-bay";
/** Kept in localStorage, because a report sent while leaving must outlive the page that sent it. */
const CAPTURE_REPORTS = `const realBeacon = navigator.sendBeacon.bind(navigator);
navigator.sendBeacon = (url, data) => {
  const reports = JSON.parse(localStorage.getItem("reports") ?? "[]");
  reports.push({ url, text: String(data) });
  localStorage.setItem("reports", JSON.stringify(reports));
  return realBeacon(url, data);
};
new PerformanceObserver(() => {
  window.__painted = true;
}).observe({ type: "largest-contentful-paint", buffered: true });`;

interface Call {
  url: string;
  headers: Record<string, string>;
  body: string;
}

const calls: Call[] = [];
const logged: string[] = [];
let answer: () => Promise<Response> = async () => Response.json({ ingested: 1, failed: 0 });

console.error = (...parts: unknown[]) => void logged.push(parts.join(" "));
globalThis.fetch = (async (url: string, init: RequestInit) => {
  calls.push({ url, headers: init.headers as Record<string, string>, body: String(init.body) });
  return answer();
}) as typeof fetch;

function setEnv(values: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

async function launch(): Promise<Browser> {
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      // Try the next installed browser.
    }
  }
  throw new Error("no installed Edge or Chrome");
}

const report = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request("https://wabisabiservices.ca/api/report-vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );

let passed = 0;
const failures: string[] = [];

async function check(name: string, run: () => Promise<void>) {
  calls.length = 0;
  logged.length = 0;
  answer = async () => Response.json({ ingested: 1, failed: 0 });
  setEnv({ AXIOM_TOKEN: TOKEN, AXIOM_DATASET: "site speed", VERCEL_ENV: "preview" });
  try {
    await run();
    passed++;
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function expectRefused(name: string, body: unknown) {
  await check(`refuses ${name}`, async () => {
    assert.equal((await report(body)).status, 400);
    assert.equal(calls.length, 0);
  });
}

/** A phone-sized visit that lands with a query string, does something, then leaves for a full page load. */
async function reportsFrom(context: BrowserContext, origin: string, act: (page: Page) => Promise<void>) {
  const page = await context.newPage();
  await page.goto(`${origin}${LANDING}?ref=ann@example.ca`, { waitUntil: "load" });
  await page.waitForFunction("window.__painted"); // The browser stops measuring LCP at the first click.
  await act(page);
  await page.goto(`${origin}/about`, { waitUntil: "load" });
  const reports = await page.evaluate<{ url: string; text: string }[]>('JSON.parse(localStorage.getItem("reports") ?? "[]")');
  await page.evaluate("localStorage.clear()");
  await page.close();
  return reports;
}

async function expectOneReport(reports: { url: string; text: string }[]) {
  assert.equal(reports.length, 1, `expected one report, got ${reports.length}`);
  const [{ url, text }] = reports;
  const body = JSON.parse(text);
  assert.equal(url, "/api/report-vitals");
  assert.deepEqual(Object.keys(body).sort(), ["device", "metric", "path", "value"]);
  assert.equal(body.metric, "LCP");
  assert.equal(body.path, LANDING);
  assert.equal(body.device, "mobile");
  assert.equal((await report(text)).status, 204);
}

async function checkPageReports() {
  assert.ok(existsSync("dist/index.html"), "dist/index.html not found: run npm run build first");
  const server = await startStaticServer(process.cwd());
  const browser = await launch();
  try {
    const context = await browser.newContext({ viewport: { width: 412, height: 823 } });
    await context.addInitScript({ content: CAPTURE_REPORTS });
    await context.route("**/*", (route) => (route.request().url().startsWith(server.origin) ? route.continue() : route.abort()));
    await context.route("**/api/report-vitals", (route) => route.fulfill({ status: 204 }));

    await expectOneReport(await reportsFrom(context, server.origin, async () => undefined));
    await expectOneReport(
      await reportsFrom(context, server.origin, async (page) => {
        await page.locator('a[href="/contact"]').last().click();
        await page.waitForURL("**/contact");
      })
    );
  } finally {
    await browser.close();
    await server.close();
  }
}

async function main() {
  await check("forwards a valid report", async () => {
    assert.equal((await report(GOOD)).status, 204);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://us-east-1.aws.edge.axiom.co/v1/ingest/site%20speed");
    assert.equal(calls[0].headers.Authorization, `Bearer ${TOKEN}`);
    assert.deepEqual(JSON.parse(calls[0].body), [{ ...GOOD, environment: "preview" }]);
  });

  await check("sends nothing about the visitor", async () => {
    const extras = { email: "ann@example.ca", ip: "203.0.113.9", query: "session_id=cs_test_secret" };
    const headers = { "x-forwarded-for": "203.0.113.9", "user-agent": "Ann's phone", cookie: "_clck=abc" };
    assert.equal((await report({ ...GOOD, ...extras }, headers)).status, 204);
    assert.deepEqual(JSON.parse(calls[0].body), [{ ...GOOD, environment: "preview" }]);
    assert.deepEqual(Object.keys(calls[0].headers).sort(), ["Authorization", "Content-Type"]);
  });

  await check("accepts each device and the home page", async () => {
    for (const device of ["mobile", "desktop"]) assert.equal((await report({ ...GOOD, device })).status, 204);
    assert.equal((await report({ ...GOOD, path: "/" })).status, 204);
  });

  await check("the page sends a report for a real load", async () => {
    const body = reportBody({ name: "LCP", value: 2345.6, navigationType: "navigate" }, LANDING, "mobile");
    assert.deepEqual(JSON.parse(body ?? ""), GOOD);
  });

  await check("the page sends nothing for a Back button restore", async () => {
    assert.equal(reportBody({ name: "LCP", value: 30, navigationType: "back-forward-cache" }, LANDING, "mobile"), null);
  });

  for (const missing of ["AXIOM_TOKEN", "AXIOM_DATASET"]) {
    await check(`drops a report when ${missing} is unset`, async () => {
      setEnv({ [missing]: undefined });
      assert.equal((await report(GOOD)).status, 204);
      assert.equal(calls.length, 0);
      assert.deepEqual(logged, ["AXIOM_TOKEN or AXIOM_DATASET is not set"]);
    });
  }

  await expectRefused("a body that isn't JSON", "not json");
  await expectRefused("an empty body", "");
  await expectRefused("null", "null");
  await expectRefused("a list", [GOOD]);
  await expectRefused("a metric other than LCP", { ...GOOD, metric: "CLS" });
  await expectRefused("a value in text", { ...GOOD, value: "2345" });
  await expectRefused("a negative value", { ...GOOD, value: -1 });
  await expectRefused("a value over the limit", { ...GOOD, value: 600_001 });
  await expectRefused("a path with a query string", { ...GOOD, path: "/checkout-success?session_id=cs_test" });
  await expectRefused("a path holding an email", { ...GOOD, path: "/ann@example.ca" });
  await expectRefused("a full address", { ...GOOD, path: "https://example.test/" });
  await expectRefused("a long path", { ...GOOD, path: `/${"a".repeat(120)}` });
  await expectRefused("an unknown device", { ...GOOD, device: "Ann's phone" });
  await expectRefused("a missing field", { metric: "LCP", value: 1, path: "/" });
  await expectRefused("an oversized body", { ...GOOD, padding: "a".repeat(300) });

  await check("reports Axiom's refusal by status only", async () => {
    answer = async () => Response.json({ message: `bad token ${TOKEN}` }, { status: 403 });
    assert.equal((await report(GOOD)).status, 502);
    assert.deepEqual(logged, ["Axiom refused a speed report: 403"]);
  });

  await check("survives Axiom being unreachable", async () => {
    answer = async () => {
      throw new TypeError(`fetch failed for ${TOKEN}`);
    };
    assert.equal((await report(GOOD)).status, 502);
    assert.deepEqual(logged, ["Axiom could not be reached: TypeError"]);
  });

  await check("the built page sends reports the function accepts", checkPageReports);

  for (const failure of failures) console.log(`FAIL  ${failure}`);
  console.log(`verify:vitals: ${passed} passed, ${failures.length} failed.`);
  process.exitCode = failures.length > 0 ? 1 : 0;
}

await main();
