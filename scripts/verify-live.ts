/**
 * Read-only checks against production or a preview. It sends GET requests only.
 *
 *   npm run verify:live                     the Release 1 rules, against production
 *   npm run verify:live -- --rules=<ids>    only these rules
 *   npm run verify:live -- --base=<url>     a preview instead of production
 *   npm run verify:live -- --local          every rule but LV-HOST, on dist/ through the local
 *     server, which applies vercel.json. Real 404s and redirects are proved on a deployment
 *
 * LV-HOST checks the production hosts, so it does not run with --base or --local.
 * LV-SITEMAP compares each deployed date with src/data/lastmod.json in this checkout, and reads
 * this checkout's git, so it needs a full clone.
 * Exit codes: 0 pass, 1 findings, 2 usage or network error.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BROWSER, COPY_PAGES, LASTMOD_FILE, LIVE, PARITY_EXEMPT, RENDER_BASELINE_FILE } from "./verify/rules";
import { type Finding, listValue, parseArgs, report, UsageError } from "./verify/lib";
import type { RenderBaseline } from "./verify/dist-checks";
import { type Chain, checkFile, checkHost, checkMissing, checkRaw, checkNotRedirected, checkRedirect, checkSitemapDates, checkUtility, describeChain } from "./verify/live-rules";
import { type RunningServer, startStaticServer } from "./verify/static-server";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RENDER_BASELINE = resolve(ROOT, RENDER_BASELINE_FILE);
const LASTMODS = resolve(ROOT, LASTMOD_FILE);
const MAX_HOPS = 6;
const KNOWN_FLAGS = ["local"];
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

function git(args: string[]): string {
  return spawnSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 30 }).stdout ?? "";
}

/**
 * Each page's latest commit: the indexable page files, with the data they read, and the area pages
 * as one, because they share their sources. A shallow clone would date most files from its edge,
 * and the pages would then seem to share one history.
 */
function pageHistories(): string[] {
  if (git(["rev-parse", "--is-shallow-repository"]).trim() !== "false") throw new UsageError("LV-SITEMAP needs a full git clone to read the pages' histories");
  const dates = new Map<string, string>();
  let date = "";
  for (const line of git(["log", "--format=date %cs", "--name-only", "--", "src"]).split("\n").filter(Boolean)) {
    if (line.startsWith("date ")) date = line.slice(5);
    else if (!dates.has(line)) dates.set(line, date);
  }
  const latest = (...files: string[]) => files.flatMap((file) => dates.get(file) ?? []).sort().pop();
  const pages = [...dates.keys()].filter((file) => /^src\/pages\/.*\.tsx$/.test(file) && existsSync(resolve(ROOT, file)) && !PARITY_EXEMPT.some((name) => file.endsWith(`/${name}.tsx`)));
  const histories = [...pages.map((file) => latest(file, COPY_PAGES.aliases[file])), latest(COPY_PAGES.areaFile, COPY_PAGES.areaTemplate)];
  if (histories.some((history) => !history)) throw new UsageError("LV-SITEMAP could not read the pages' histories from git");
  return histories as string[];
}

const withoutHost = (rules: string[]) => rules.filter((rule) => rule !== "LV-HOST");

async function run(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));
  for (const flag of args.flags) if (!KNOWN_FLAGS.includes(flag)) throw new UsageError(`Unknown flag: --${flag}`);
  for (const key of args.values.keys()) if (!KNOWN_VALUES.includes(key)) throw new UsageError(`Unknown option: --${key}`);

  const local = args.flags.has("local");
  if (local && args.values.has("base")) throw new UsageError("--local and --base name two different targets");
  const preview = args.values.has("base") || local;
  const selected = listValue(args, "rules") ?? (local ? withoutHost(LIVE.all) : preview ? withoutHost(LIVE.releaseOne) : LIVE.releaseOne);
  const unknown = selected.filter((rule) => !LIVE.all.includes(rule));
  if (unknown.length > 0) throw new UsageError(`Unknown rule: ${unknown.join(", ")}`);
  if (preview && selected.includes("LV-HOST")) throw new UsageError("LV-HOST checks the production hosts, so it does not run with --base or --local");
  if (!local) return check(args.values.get("base")?.replace(/\/+$/, "") ?? LIVE.apex, selected);

  if (!existsSync(resolve(ROOT, "dist/index.html"))) throw new UsageError("dist/index.html not found: run npm run build first");
  const server: RunningServer = await startStaticServer(ROOT);
  try {
    return await check(server.origin, selected);
  } finally {
    await server.close();
  }
}

async function check(base: string, selected: string[]): Promise<number> {
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
    for (const { from, to, maxHops } of LIVE.redirects) {
      const chain = await follow(`${base}${from}`, base);
      say("LV-REDIRECT", chain);
      findings.push(...checkRedirect(from, to, base, chain, maxHops));
    }
    for (const path of LIVE.notRedirected) {
      const chain = await follow(`${base}${path}`, base);
      say("LV-REDIRECT", chain);
      findings.push(...checkNotRedirected(path, chain));
    }
  }
  if (selected.includes("LV-UTILITY")) {
    for (const route of LIVE.utilityRoutes) {
      const { status, html } = await page(`${base}${route}`, base);
      findings.push(...checkUtility(route, status, html));
    }
  }

  if (selected.includes("LV-SITEMAP")) {
    if (!existsSync(LASTMODS)) throw new UsageError(`${LASTMOD_FILE} not found`);
    const tracked = JSON.parse(readFileSync(LASTMODS, "utf8")) as Record<string, string>;
    const histories = pageHistories();
    const { status, html: sitemap } = await page(`${base}/sitemap.xml`, base);
    findings.push(...checkSitemapDates(status, sitemap, histories, tracked));
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
