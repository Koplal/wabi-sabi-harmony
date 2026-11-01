/**
 * Source and built-output checks for the site's SEO copy and metadata.
 *
 *   npm run verify                      all source and dist rules
 *   npm run verify -- --source          source rules only
 *   npm run verify -- --dist            dist rules only (needs a build)
 *   npm run verify -- --scope=<paths>   source rules on these files or folders
 *   npm run verify -- --rules=<ids>     only these rules, S-BAN or a single BAN-nn
 *   npm run verify -- --self-test       every rule against good and bad fixtures
 *
 * Other flags: --expect-clarity=<id>, --pearlys=<path>, --write-rank-baseline.
 * SEO_PRIVATE_BANS must name the private ban file. BAN-08, S-LEAK and D-COPY fail closed without
 * it, and only a --scope run may skip BAN-08.
 * Exit codes: 0 pass, 1 findings, 2 usage or setup error.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BANS, COPY_BASE_COMMIT, COPY_PAGES, INDEXABLE_ROUTES, MANIFEST, OVERLAP, RANK_ROUTES, RENDER_BASELINE_FILE, REQUIRED, SCAN } from "./verify/rules";
import { type Args, type Finding, listValue, parseArgs, report, routeOfHtmlFile, SourceText, UsageError } from "./verify/lib";
import { type CommitRecord, copySegments, type GitInput, parsePrivateBans, type PrivateBans, SOURCE_CHECKS, type ScanFile, type SourceCtx } from "./verify/source-checks";
import { DIST_CHECKS, type DistCtx, rankEntryFromHtml, type RankBaseline, type RenderBaseline, type RouteManifest } from "./verify/dist-checks";
import { runSelfTest } from "./verify/fixtures/cases";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, "dist");
const BASELINE = resolve(ROOT, "scripts/verify/rank-baseline.json");
const RENDER_BASELINE = resolve(ROOT, RENDER_BASELINE_FILE);

const KNOWN_FLAGS = ["source", "dist", "self-test", "write-rank-baseline"];
const KNOWN_VALUES = ["scope", "rules", "expect-clarity", "pearlys"];
const TEXT_EXTENSIONS = [".html", ".js", ".txt", ".xml", ".css", ".json"];

const toPosix = (path: string) => path.replace(/\\/g, "/");

function walk(dir: string, visit: (path: string) => void, skip: string[] = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, visit, skip);
    else visit(path);
  }
}

function git(args: string[]): { ok: boolean; output: string } {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 30 });
  return { ok: result.status === 0, output: result.stdout ?? "" };
}

const realGit: GitInput = {
  tracked() {
    const listed = git(["ls-files", "-z"]);
    if (!listed.ok) throw new UsageError("git ls-files failed");
    return listed.output
      .split("\0")
      .filter(Boolean)
      .flatMap((path) => {
        const absolute = resolve(ROOT, path);
        if (!existsSync(absolute)) return [];
        const text = readFileSync(absolute, "utf8");
        return text.includes("\0") ? [] : [{ path, text }];
      });
  },
  commits(): CommitRecord[] {
    const range = git(["rev-list", "main..HEAD"]);
    if (!range.ok) throw new UsageError("S-LEAK needs a local main branch to compare against");
    return range.output
      .split("\n")
      .filter(Boolean)
      .map((hash) => ({
        hash,
        message: git(["log", "-1", "--format=%B", hash]).output,
        patch: git(["show", "-m", "--format=", "-U0", "--no-color", "--no-ext-diff", hash]).output,
      }));
  },
  baseText(path) {
    const shown = git(["show", `${COPY_BASE_COMMIT}:${path}`]);
    return shown.ok ? shown.output : undefined;
  },
};

function scanFiles(): Map<string, ScanFile> {
  const paths: string[] = [];
  for (const include of SCAN.include) {
    const absolute = resolve(ROOT, include);
    if (!existsSync(absolute)) continue;
    if (statSync(absolute).isDirectory()) walk(absolute, (path) => paths.push(path));
    else paths.push(absolute);
  }

  const files = new Map<string, ScanFile>();
  for (const absolute of paths) {
    const path = toPosix(relative(ROOT, absolute));
    if (SCAN.exclude.some((prefix) => path.startsWith(prefix))) continue;
    if (!SCAN.extensions.includes(extname(path))) continue;
    files.set(path, { path, text: new SourceText(readFileSync(absolute, "utf8")) });
  }
  return files;
}

function readRepoFile(path: string): string | undefined {
  const absolute = resolve(ROOT, path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : undefined;
}

function loadPrivateBans(): PrivateBans {
  const path = process.env.SEO_PRIVATE_BANS;
  if (!path) return parsePrivateBans(undefined, "SEO_PRIVATE_BANS is not set");
  try {
    return parsePrivateBans(readFileSync(path, "utf8"));
  } catch {
    return parsePrivateBans(undefined, "file not readable");
  }
}

function siblingCopy(root: string): string[] {
  if (!existsSync(root)) throw new UsageError(`--pearlys path not found: ${root}`);
  const paths: string[] = [];
  for (const dir of OVERLAP.siblingDirs) {
    const absolute = resolve(root, dir);
    if (existsSync(absolute)) walk(absolute, (path) => paths.push(path), OVERLAP.siblingSkip);
  }
  for (const file of OVERLAP.siblingFiles) {
    const absolute = resolve(root, file);
    if (existsSync(absolute)) paths.push(absolute);
  }
  return paths
    .filter((path) => [".ts", ".tsx", ".txt", ".html"].includes(extname(path)))
    .flatMap((path) => copySegments(path, readFileSync(path, "utf8")).map((segment) => segment.text));
}

function normaliseScope(value: string): string {
  return toPosix(value).replace(/^\.\//, "").replace(/\/+$/, "");
}

function buildSourceCtx(args: Args): SourceCtx {
  const all = scanFiles();
  const scope = listValue(args, "scope")?.map(normaliseScope);
  const inScope = (path: string) => !scope || scope.some((item) => path === item || path.startsWith(`${item}/`));

  for (const item of scope ?? []) {
    const known =
      [...all.keys()].some((path) => path === item || path.startsWith(`${item}/`)) ||
      REQUIRED.some((entry) => entry.files.includes(item)) ||
      existsSync(resolve(ROOT, item));
    if (!known) throw new UsageError(`--scope matches no file: ${item}`);
  }

  const pearlys = args.values.get("pearlys");
  return {
    files: [...all.values()].filter((file) => inScope(file.path)),
    all,
    scoped: Boolean(scope),
    inScope,
    read: readRepoFile,
    privateBans: loadPrivateBans(),
    git: realGit,
    sibling: pearlys ? siblingCopy(resolve(process.cwd(), pearlys)) : undefined,
    note: (message) => console.log(message),
  };
}

function loadBaseline(): RankBaseline {
  if (!existsSync(BASELINE)) throw new UsageError("scripts/verify/rank-baseline.json not found");
  return JSON.parse(readFileSync(BASELINE, "utf8")) as RankBaseline;
}

function loadRenderBaseline(): RenderBaseline | undefined {
  return existsSync(RENDER_BASELINE) ? (JSON.parse(readFileSync(RENDER_BASELINE, "utf8")) as RenderBaseline) : undefined;
}

/** Undefined when capturedFrom is not a commit here, so no warning can be given. */
function baselineDrift(baseline: RenderBaseline | undefined): string[] | undefined {
  if (!baseline) return undefined;
  const changed = git(["diff", "--name-only", baseline.capturedFrom, "--", "src", "public", "index.html"]);
  return changed.ok ? changed.output.split("\n").filter(Boolean) : undefined;
}

const commitDates = new Map<string, string | undefined>();

/** %cs is the date as committed. Area routes share one file, so each file is asked about once. */
function lastCommitDate(path: string): string | undefined {
  if (!commitDates.has(path)) commitDates.set(path, git(["log", "-1", "--format=%cs", "--", path]).output.trim() || undefined);
  return commitDates.get(path);
}

async function loadExport(file: string, name: string): Promise<unknown> {
  const module = (await import(pathToFileURL(resolve(ROOT, file)).href)) as Record<string, unknown>;
  return module[name];
}

async function loadManifest(): Promise<RouteManifest> {
  const manifest: RouteManifest = {};
  try {
    const data = (await loadExport(COPY_PAGES.areaFile, MANIFEST.areaExport)) as Record<string, { slug: string }>;
    manifest.areas = Object.values(data).map(({ slug }) => `${COPY_PAGES.areaPrefix}${slug}`);
  } catch {
    // D-MANIFEST reports the missing data.
  }
  if (!existsSync(resolve(ROOT, MANIFEST.routeFile))) {
    manifest.listError = "the file does not exist";
    return manifest;
  }
  try {
    const list = await loadExport(MANIFEST.routeFile, MANIFEST.routeExport);
    if (!Array.isArray(list)) throw new Error(`it does not export ${MANIFEST.routeExport} as a list`);
    const entries = list.map((item: unknown) => (typeof item === "string" ? { path: item } : (item as { path?: unknown; page?: unknown })));
    if (entries.some((entry) => typeof entry?.path !== "string")) throw new Error("an entry has no path");
    manifest.listed = entries.map((entry) => entry.path as string);
    const pages = entries.flatMap((entry) => (typeof entry.page === "string" ? [[entry.path as string, entry.page]] : []));
    if (pages.length > 0) manifest.pages = Object.fromEntries(pages);
  } catch (error) {
    manifest.listError = `it could not be loaded: ${error instanceof Error ? error.message : String(error)}`;
  }
  return manifest;
}

function distFiles(): Map<string, string> {
  if (!existsSync(resolve(DIST, "index.html"))) throw new UsageError("dist/index.html not found: run npm run build first");
  const files = new Map<string, string>();
  walk(DIST, (absolute) => {
    if (TEXT_EXTENSIONS.includes(extname(absolute))) files.set(toPosix(relative(DIST, absolute)), readFileSync(absolute, "utf8"));
  });
  return files;
}

async function buildDistCtx(args: Args): Promise<DistCtx> {
  const renderBaseline = loadRenderBaseline();
  return {
    files: distFiles(),
    routes: INDEXABLE_ROUTES,
    baseline: loadBaseline(),
    renderBaseline,
    baselineDrift: baselineDrift(renderBaseline),
    manifest: await loadManifest(),
    privateBans: loadPrivateBans(),
    readSource: readRepoFile,
    lastCommitDate,
    sourcePages() {
      const pages: string[] = [];
      walk(resolve(ROOT, "src/pages"), (path) => {
        if (path.endsWith(".tsx")) pages.push(toPosix(relative(ROOT, path)));
      });
      return pages;
    },
    expectClarity: args.values.get("expect-clarity"),
    note: (message) => console.log(message),
  };
}

const BAN_IDS = BANS.map((ban) => ban.id);

function selectRules(args: Args): { source: string[]; dist: string[] } {
  const named = listValue(args, "rules");
  const sourceFlag = args.flags.has("source");
  const distFlag = args.flags.has("dist");
  const scoped = args.values.has("scope");
  const sourceIds = Object.keys(SOURCE_CHECKS);
  const distIds = Object.keys(DIST_CHECKS);

  if (named) {
    const expanded = named.flatMap((id) => (id === "S-BAN" ? BAN_IDS : [id]));
    const unknown = expanded.filter((id) => !sourceIds.includes(id) && !distIds.includes(id));
    if (unknown.length > 0) throw new UsageError(`Unknown rule: ${unknown.join(", ")}`);
    const source = expanded.filter((id) => sourceIds.includes(id));
    const dist = expanded.filter((id) => distIds.includes(id));
    if (sourceFlag && !distFlag && dist.length > 0) throw new UsageError(`--source with dist rules: ${dist.join(", ")}`);
    if (distFlag && !sourceFlag && source.length > 0) throw new UsageError(`--dist with source rules: ${source.join(", ")}`);
    if (source.includes("S-OVERLAP") && !args.values.has("pearlys")) throw new UsageError("S-OVERLAP needs --pearlys=<path>");
    return { source, dist };
  }

  const runSource = sourceFlag || !distFlag;
  const runDist = distFlag || (!sourceFlag && !scoped);
  const source = sourceIds.filter((id) => {
    if (id === "S-OVERLAP") return args.values.has("pearlys");
    if (id === "S-LEAK") return !scoped;
    return true;
  });
  return { source: runSource ? source : [], dist: runDist ? distIds : [] };
}

function writeRankBaseline() {
  const pages: RankBaseline["pages"] = {};
  const existing = existsSync(BASELINE) ? loadBaseline() : undefined;
  const files = distFiles();
  for (const route of RANK_ROUTES) {
    const file = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
    const html = files.get(file);
    if (html === undefined) throw new UsageError(`no built HTML for ${routeOfHtmlFile(file)}`);
    pages[route] = { ...rankEntryFromHtml(html), h1: existing?.pages[route]?.h1 };
  }
  const capturedFrom = git(["rev-parse", "--short", "HEAD"]).output.trim();
  writeFileSync(BASELINE, `${JSON.stringify({ capturedFrom, pages }, null, 2)}\n`);
  console.log(`Wrote ${toPosix(relative(ROOT, BASELINE))} from ${capturedFrom}`);
}

async function main(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));
  for (const flag of args.flags) if (!KNOWN_FLAGS.includes(flag)) throw new UsageError(`Unknown flag: --${flag}`);
  for (const key of args.values.keys()) if (!KNOWN_VALUES.includes(key)) throw new UsageError(`Unknown option: --${key}`);

  if (args.flags.has("self-test")) return runSelfTest();
  if (args.flags.has("write-rank-baseline")) {
    writeRankBaseline();
    return 0;
  }

  const selected = selectRules(args);
  const findings: Finding[] = [];

  if (selected.source.length > 0) {
    const ctx = buildSourceCtx(args);
    for (const id of selected.source) findings.push(...SOURCE_CHECKS[id](ctx));
  }
  if (selected.dist.length > 0) {
    const ctx = await buildDistCtx(args);
    for (const id of selected.dist) findings.push(...DIST_CHECKS[id](ctx));
  }

  const ran = selected.source.length + selected.dist.length;
  console.log(`Ran ${ran} rule${ran === 1 ? "" : "s"}.`);
  return report(findings, "verify");
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error: unknown) => {
    if (error instanceof UsageError) {
      console.error(`verify: ${error.message}`);
      process.exitCode = 2;
    } else throw error;
  });
