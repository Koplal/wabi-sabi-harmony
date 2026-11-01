/**
 * Read-only checks against production or a preview. It sends GET requests only.
 *
 *   npm run verify:live                     the Release 1 rules, against production
 *   npm run verify:live -- --rules=<ids>    only these rules
 *   npm run verify:live -- --base=<url>     a preview instead of production
 *
 * LV-HOST checks the production hosts, so it does not run with --base.
 * Exit codes: 0 pass, 1 findings, 2 usage or network error.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BROWSER, LIVE, RENDER_BASELINE_FILE } from "./verify/rules";
import { type Finding, listValue, parseArgs, report, UsageError } from "./verify/lib";
import type { RenderBaseline } from "./verify/dist-checks";
import { type Chain, checkFile, checkHost, checkMissing, checkRaw, checkRedirect, checkUtility, describeChain } from "./verify/live-rules";

const RENDER_BASELINE = resolve(dirname(fileURLToPath(import.meta.url)), "..", RENDER_BASELINE_FILE);
const MAX_HOPS = 6;
const KNOWN_VALUES = ["base", "rules"];

class PreviewProtected extends Error {}

const headersFor = (url: string, base: string): Record<string, string> => {
  const token = process.env.VERCEL_BYPASS_TOKEN;
  return token && new URL(url).origin === new URL(base).origin ? { [BROWSER.bypassHeader]: token } : {};
};

async function get(url: string, base: string): Promise<Response> {
  const response = await fetch(url, { method: "GET", redirect: "manual", headers: headersFor(url, base) });
  if (response.status === 401) throw new PreviewProtected();
  return response;
}

async function follow(start: string, base: string): Promise<Chain> {
  const chain: Chain = [];
  let url = start;
  for (let hop = 0; hop < MAX_HOPS; hop++) {
    const response = await get(url, base);
    await response.body?.cancel();
    const location = response.headers.get("location") ?? undefined;
    chain.push({ url: response.url || url, status: response.status, location });
    if (response.status < 300 || response.status >= 400 || !location) return chain;
    url = new URL(location, url).href;
  }
  return chain;
}

async function page(url: string, base: string): Promise<{ status: number; html: string }> {
  const response = await get(url, base);
  return { status: response.status, html: await response.text() };
}

async function run(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));
  for (const flag of args.flags) throw new UsageError(`Unknown flag: --${flag}`);
  for (const key of args.values.keys()) if (!KNOWN_VALUES.includes(key)) throw new UsageError(`Unknown option: --${key}`);

  const base = args.values.get("base")?.replace(/\/+$/, "") ?? LIVE.apex;
  const preview = args.values.has("base");
  const selected = listValue(args, "rules") ?? (preview ? LIVE.releaseOne.filter((rule) => rule !== "LV-HOST") : LIVE.releaseOne);
  const unknown = selected.filter((rule) => !LIVE.all.includes(rule));
  if (unknown.length > 0) throw new UsageError(`Unknown rule: ${unknown.join(", ")}`);
  if (preview && selected.includes("LV-HOST")) throw new UsageError("LV-HOST checks the production hosts, so it does not run with --base");

  const findings: Finding[] = [];
  const say = (rule: string, chain: Chain) => console.log(`${rule}: ${describeChain(chain)}`);

  if (selected.includes("LV-HOST")) {
    for (const start of LIVE.hostStarts) {
      const chain = await follow(start, base);
      say("LV-HOST", chain);
      findings.push(...checkHost(start, chain));
    }
  }
  if (selected.includes("LV-FILES")) {
    for (const path of LIVE.files) {
      const chain = await follow(`${base}${path}`, base);
      say("LV-FILES", chain);
      findings.push(...checkFile(path, chain));
    }
  }
  if (selected.includes("LV-404")) {
    const chain = await follow(`${base}${LIVE.missingPath}`, base);
    say("LV-404", chain);
    const { html } = await page(`${base}${LIVE.missingPath}`, base);
    findings.push(...checkMissing(chain, html));
  }
  if (selected.includes("LV-RAW")) {
    if (!existsSync(RENDER_BASELINE)) throw new UsageError(`${RENDER_BASELINE_FILE} not found`);
    const { routes } = JSON.parse(readFileSync(RENDER_BASELINE, "utf8")) as RenderBaseline;
    for (const route of LIVE.rawRoutes) {
      const { status, html } = await page(`${base}${route}`, base);
      findings.push(...checkRaw(route, status, html, routes[route]?.h1));
    }
  }
  if (selected.includes("LV-REDIRECT")) {
    for (const { from, to } of LIVE.redirects) {
      const chain = await follow(`${base}${from}`, base);
      say("LV-REDIRECT", chain);
      findings.push(...checkRedirect(from, to, base, chain));
    }
  }
  if (selected.includes("LV-UTILITY")) {
    for (const route of LIVE.utilityRoutes) {
      const { status, html } = await page(`${base}${route}`, base);
      findings.push(...checkUtility(route, status, html));
    }
  }

  return report(findings, "verify:live");
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
      console.error(`verify:live: ${error.message}`);
      process.exitCode = 2;
    } else {
      console.error(`verify:live: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 2;
    }
  });
