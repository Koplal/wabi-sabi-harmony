/** Shared helpers for the verify harness: arguments, findings, text views and JSON-LD checks. */
import { AUDIT, INDEXABLE_ROUTES, PEARLY_IDS } from "./rules";

export interface Finding {
  rule: string;
  row?: string;
  file?: string;
  line?: number;
  message: string;
}

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------

export interface Args {
  flags: Set<string>;
  values: Map<string, string>;
}

export function parseArgs(argv: string[]): Args {
  const flags = new Set<string>();
  const values = new Map<string, string>();
  for (const arg of argv) {
    const match = /^--([^=]+)(?:=(.*))?$/s.exec(arg);
    if (!match) throw new UsageError(`Unknown argument: ${arg}`);
    if (match[2] === undefined) flags.add(match[1]);
    else values.set(match[1], match[2]);
  }
  return { flags, values };
}

export class UsageError extends Error {}

export function listValue(args: Args, name: string): string[] | undefined {
  const value = args.values.get(name);
  if (value === undefined) return undefined;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

/**
 * Git Bash rewrites `--route=/about` to `--route=C:/Program Files/Git/about` before node
 * starts. Routes never look like Windows paths, so the prefix can be removed safely.
 */
export function undoMsysPath(value: string): string {
  return value.replace(/^[A-Za-z]:[\\/](?:.*[\\/])?Git(?=[\\/]|,|$)/, "") || "/";
}

export function routeList(args: Args, name: string): string[] | undefined {
  const value = args.values.get(name);
  if (value === undefined) return undefined;
  return undoMsysPath(value)
    .split(",")
    .map((item) => undoMsysPath(item.trim()))
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const location = (finding: Finding) => {
  if (!finding.file) return "";
  return `${finding.file}${finding.line ? `:${finding.line}` : ""} `;
};

export function formatFinding(finding: Finding): string {
  const row = finding.row ? ` [${finding.row}]` : "";
  return `  ${location(finding)}[${finding.rule}]${row} ${finding.message}`;
}

/** Prints findings grouped by rule. Returns the process exit code. */
export function report(findings: Finding[], label: string): number {
  const rules = [...new Set(findings.map((finding) => finding.rule))].sort();
  for (const rule of rules) {
    const matching = findings.filter((finding) => finding.rule === rule);
    console.log(`\n${rule}: ${matching.length} finding${matching.length === 1 ? "" : "s"}`);
    for (const finding of matching) console.log(formatFinding(finding));
  }

  if (findings.length === 0) {
    console.log(`\n${label}: pass`);
    return 0;
  }

  const rows = new Set(
    findings.flatMap((finding) => (finding.row ? finding.row.split(",").map((row) => row.trim()) : []))
  );
  console.log(`\n${label}: FAIL, ${findings.length} finding${findings.length === 1 ? "" : "s"} across ${rules.length} rule${rules.length === 1 ? "" : "s"}`);
  if (rows.size > 0) console.log(`Rows reported: ${[...rows].sort().join(", ")}`);
  return 1;
}

// ---------------------------------------------------------------------------
// Text views
// ---------------------------------------------------------------------------

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&apos;": "'",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&rsquo;": "\u2019",
  "&lsquo;": "\u2018",
  "&ldquo;": "\u201C",
  "&rdquo;": "\u201D",
  "&ndash;": "\u2013",
  "&mdash;": "\u2014",
  "&nbsp;": " ",
};

const INLINE_TAGS = "strong|em|b|i|u|span|a|Link|small|mark|abbr|sup|sub|code";
const ENTITY_TOKEN = Object.keys(ENTITIES).join("|");
const TOKEN = new RegExp(
  [
    "\\s+",
    "\\{\\s*(?:\"\\s*\"|'\\s*')\\s*\\}",
    ENTITY_TOKEN,
    "\\\\['\"]",
    `</?(?:${INLINE_TAGS})(?:\\s[^>]*)?>`,
    "<br\\s*/?>",
  ].join("|"),
  "g"
);

const isInlineTag = (token: string) => token.startsWith("<") && !token.startsWith("<br");

export interface TextView {
  text: string;
  /** Maps each index in `text` to its index in the raw source. */
  map: number[];
}

/**
 * Collapses JSX whitespace and decodes escapes, keeping a map back to the raw source.
 * With `stripInline`, inline tags go too, so a phrase split by <strong> reads as one string.
 */
function project(raw: string, stripInline: boolean): TextView {
  const chars: string[] = [];
  const map: number[] = [];

  const push = (value: string, sourceIndex: number) => {
    for (const char of value) {
      if (char === " " && chars[chars.length - 1] === " ") continue;
      chars.push(char);
      map.push(sourceIndex);
    }
  };

  let cursor = 0;
  for (const match of raw.matchAll(TOKEN)) {
    const token = match[0];
    const index = match.index ?? 0;
    for (let i = cursor; i < index; i++) push(raw[i], i);
    cursor = index + token.length;

    if (token.startsWith("\\")) push(token[1], index);
    else if (token.startsWith("&")) push(ENTITIES[token], index);
    else if (token.startsWith("{") || /^\s/.test(token) || token.startsWith("<br")) push(" ", index);
    else if (isInlineTag(token) && !stripInline) for (let i = 0; i < token.length; i++) push(token[i], index + i);
  }
  for (let i = cursor; i < raw.length; i++) push(raw[i], i);
  return { text: chars.join(""), map };
}

export class SourceText {
  readonly raw: string;
  /** Whitespace collapsed and escapes decoded. */
  readonly plain: TextView;
  /** As `plain`, with inline JSX tags removed. */
  readonly copy: TextView;
  private readonly lineStarts: number[];

  constructor(raw: string) {
    this.raw = raw;
    this.plain = project(raw, false);
    this.copy = project(raw, true);
    this.lineStarts = [0];
    for (let i = 0; i < raw.length; i++) if (raw[i] === "\n") this.lineStarts.push(i + 1);
  }

  lineOfRaw(index: number): number {
    let low = 0;
    let high = this.lineStarts.length - 1;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (this.lineStarts[mid] <= index) low = mid;
      else high = mid - 1;
    }
    return low + 1;
  }

  lineOf(view: TextView, index: number): number {
    return this.lineOfRaw(view.map[Math.min(index, view.map.length - 1)] ?? 0);
  }

  contains(value: string): boolean {
    return this.plain.text.includes(value) || this.copy.text.includes(value);
  }
}

export const lines = (raw: string) => raw.split(/\r?\n/);

const SENTENCE_BOUNDARY = /[.!?](?=[\s"'<]|$)|<\/?(?:p|li|ul|ol|div|h[1-6]|section)\b[^>]*>|"\s*[,;)\]}]/g;

/** The sentence around a match, bounded by punctuation, block tags or the end of a string. */
export function sentenceAround(text: string, index: number, length: number): string {
  let start = 0;
  let end = text.length;
  for (const match of text.matchAll(SENTENCE_BOUNDARY)) {
    const boundaryStart = match.index ?? 0;
    const boundaryEnd = boundaryStart + match[0].length;
    if (boundaryEnd <= index) start = boundaryEnd;
    else if (boundaryStart >= index + length) {
      end = boundaryStart;
      break;
    }
  }
  return text.slice(start, end);
}

export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A straight apostrophe in a ban also matches a curly one. */
export const compileBan = (source: string, flags: string) => new RegExp(source.replace(/'/g, "['\u2019]"), flags);

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

export const decodeHtml = (value: string) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

export function attributes(tag: string): Record<string, string> {
  const found: Record<string, string> = {};
  for (const match of tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) found[match[1].toLowerCase()] = decodeHtml(match[2]);
  return found;
}

export const headOf = (html: string) => /<head[\s>][\s\S]*?<\/head>/i.exec(html)?.[0] ?? "";

export const tagsNamed = (html: string, name: string) =>
  [...html.matchAll(new RegExp(`<${name}\\b(?:[^>"]|"[^"]*")*>`, "gi"))].map((match) => match[0]);

export const titleOf = (html: string) => decodeHtml(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "");

export function metaContent(html: string, key: string): string | undefined {
  for (const tag of tagsNamed(headOf(html), "meta")) {
    const attrs = attributes(tag);
    if (attrs.name === key || attrs.property === key) return attrs.content;
  }
  return undefined;
}

export const canonicalsOf = (html: string) =>
  tagsNamed(headOf(html), "link")
    .map(attributes)
    .filter((attrs) => attrs.rel === "canonical")
    .map((attrs) => attrs.href);

export const jsonLdBlocksOf = (html: string) =>
  [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);

// ---------------------------------------------------------------------------
// Raw HTML body
// ---------------------------------------------------------------------------

const NOT_READ = /<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1>/gi;
const BLOCK_START = /<(?=(?:p|li|ul|ol|div|h[1-6]|section|article|header|footer|main|nav|aside|table|tr|dl|dt|dd|blockquote|form|button)\b)/gi;

export const bodyOf = (html: string) => /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? "";

/** What a reader with no JavaScript gets: no comments, scripts or styling, one block per line. */
export const bodyMarkup = (html: string) =>
  bodyOf(html)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(NOT_READ, " ")
    .replace(/\s(?:class|style)="[^"]*"/gi, "")
    .replace(BLOCK_START, "\n<");

const collapse = (text: string) => text.replace(/\s+/g, " ").trim();

export const rawTextOf = (html: string) => collapse(decodeHtml(bodyMarkup(html).replace(/<[^>]+>/g, " ")));

/** H1 text as textContent reads it, so a span inside a heading adds no space. */
export const rawHeadingsOf = (html: string) =>
  [...bodyMarkup(html).matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((match) => collapse(decodeHtml(match[1].replace(/<[^>]+>/g, ""))))
    .filter(Boolean);

export const pathOfHref = (href: string) => href.split(/[?#]/)[0];

export const rawLinksOf = (html: string) =>
  tagsNamed(bodyMarkup(html), "a")
    .map((tag) => attributes(tag).href ?? "")
    .filter((href) => href.startsWith("/"))
    .map(pathOfHref);

/** Words for comparing raw and rendered text: lower case, with no surrounding punctuation. */
export const textWords = (text: string) =>
  text
    .toLowerCase()
    .replace(/’/g, "'")
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}$]+|[^\p{L}\p{N}%+]+$/gu, ""))
    .filter((word) => /[\p{L}\p{N}]/u.test(word));

/** How many of `words` also appear in `other`, counting repeats. */
export function sharedWordCount(words: string[], other: string[]): number {
  const left = new Map<string, number>();
  for (const word of other) left.set(word, (left.get(word) ?? 0) + 1);
  let shared = 0;
  for (const word of words) {
    const count = left.get(word) ?? 0;
    if (count > 0) {
      shared++;
      left.set(word, count - 1);
    }
  }
  return shared;
}

/** One page as a browser rendered it, with menus closed. */
export interface RenderedPage {
  h1: string;
  text: string;
  links: string[];
}

/**
 * R2-FR-01, shared by D-RAW (the saved baseline) and BR-RAW (the same build). It runs both ways,
 * because text only the raw HTML holds is read by crawlers and never seen by visitors.
 * closedAnswers are the one allowance, R2-FR-04's FAQ answers, so pass them only for a route that
 * has them. minShare also covers what the capture viewport hides, such as the header's second
 * Book Now link.
 */
export function rawProblems(rendered: RenderedPage, html: string, minShare: number, closedAnswers: string[] = []): string[] {
  const problems: string[] = [];
  const headings = rawHeadingsOf(html);
  if (headings.length === 0) problems.push("no H1 in raw HTML");
  else if (headings[0] !== rendered.h1) problems.push(`raw H1 "${headings[0]}" differs from the rendered H1 "${rendered.h1}"`);

  const words = textWords(rendered.text);
  const rawText = rawTextOf(html);
  const shared = sharedWordCount(words, textWords(rawText));
  if (words.length > 0 && shared / words.length < minShare) {
    const percent = Math.floor((shared / words.length) * 100);
    problems.push(`${shared} of ${words.length} rendered words are in raw HTML (${percent}%), expected at least ${minShare * 100}%`);
  }

  const rawWords = textWords(closedAnswers.reduce((text, answer) => text.split(collapse(answer)).join(" "), rawText));
  const shown = sharedWordCount(rawWords, words);
  if (rawWords.length > 0 && shown / rawWords.length < minShare) {
    const percent = Math.floor((shown / rawWords.length) * 100);
    problems.push(`${shown} of ${rawWords.length} raw words are on the rendered page (${percent}%), expected at least ${minShare * 100}%`);
  }

  const links = new Set(rawLinksOf(html));
  const missing = rendered.links.filter((link) => !links.has(link));
  if (missing.length > 0) problems.push(`${missing.length} rendered internal links are not in raw HTML: ${missing.slice(0, 5).join(", ")}`);
  return problems;
}

/** BR-RENDER: this text against saved text, both ways, so a page can neither gain nor lose copy. */
export function textDriftProblems(text: string, saved: string, minShare: number): string[] {
  const words = textWords(text);
  const savedWords = textWords(saved);
  const shared = sharedWordCount(words, savedWords);
  const problems: string[] = [];
  const percent = (whole: number) => Math.floor((shared / whole) * 100);
  if (shared / savedWords.length < minShare) problems.push(`lost text: ${shared} of ${savedWords.length} saved words are on the page (${percent(savedWords.length)}%)`);
  if (shared / words.length < minShare) problems.push(`gained text: ${shared} of ${words.length} words on the page are saved (${percent(words.length)}%)`);
  return problems;
}

/** R2-FR-08, shared by D-404, BR-404 and LV-404, so a platform's default 404 page cannot pass. */
export function missingPageProblems(html: string, site: string, brand: string): string[] {
  const problems: string[] = [];
  if (!(metaContent(html, "robots") ?? "").includes("noindex")) problems.push("no noindex");
  if (canonicalsOf(html).includes(`${site}/`)) problems.push("the canonical is the home page");
  if (!titleOf(html).includes(brand)) problems.push(`the title does not name ${brand}`);
  if (rawHeadingsOf(html).length === 0) problems.push("no H1 without JavaScript");
  if (!rawLinksOf(html).includes("/")) problems.push("no link home without JavaScript");
  if (!rawLinksOf(html).includes("/services")) problems.push("no link to /services without JavaScript");
  return problems;
}

/** Whole-body words in raw HTML, shared by LV-RAW, D-AUDIT and LV-AUDIT, so the floors count alike. */
export const visibleWords = (html: string) =>
  html
    .replace(/<head[\s>][\s\S]*?<\/head>/i, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

/** Routes held to a limit even though a list excuses them, so a change can prove it has landed. */
export interface AuditStrict {
  titles?: string[];
  descriptions?: string[];
}

const charCount = (text: string) => [...text].length;

/** One page's lines, shared by D-AUDIT and LV-AUDIT. Only D-AUDIT passes strict. */
export function auditPageProblems(route: string, html: string, strict: AuditStrict = {}): string[] {
  const problems: string[] = [];
  const h1Tags = tagsNamed(bodyMarkup(html), "h1").length;
  const headings = rawHeadingsOf(html).length;
  if (h1Tags !== 1 || headings !== 1) problems.push(`${h1Tags} H1 tags, ${headings} with text, expected exactly one`);

  const title = titleOf(html);
  const description = metaContent(html, "description") ?? "";
  if (!title) problems.push("no title");
  if (!description) problems.push("no meta description");
  for (const key of ["og:title", "twitter:title", "title"]) {
    const value = metaContent(html, key);
    if (value !== title) problems.push(`${key} is "${value ?? "missing"}", which differs from the title "${title}"`);
  }

  const { titleMax, descriptionMax, titleExempt, descriptionExempt, limitPending, wordExempt, wordPending, minWords, minLinks } = AUDIT;
  const titleListed = route in titleExempt || limitPending.titles.includes(route);
  if (charCount(title) > titleMax && (!titleListed || strict.titles?.includes(route))) problems.push(`title is ${charCount(title)} characters, over ${titleMax}`);
  const descriptionListed = route in descriptionExempt || limitPending.descriptions.includes(route);
  if (charCount(description) > descriptionMax && (!descriptionListed || strict.descriptions?.includes(route))) problems.push(`description is ${charCount(description)} characters, over ${descriptionMax}`);

  const words = visibleWords(html);
  if (words < minWords && !wordExempt.includes(route) && !(route in wordPending)) problems.push(`${words} words of body text, expected at least ${minWords}`);

  const links = new Set(rawLinksOf(html));
  links.delete(route);
  if (links.size < minLinks) problems.push(`${links.size} internal links to other pages, expected at least ${minLinks}`);
  return problems;
}

export interface AuditProblem {
  route: string;
  message: string;
}

/**
 * The lines that take every page at once. knownRoutes holds the utility routes too, because every
 * page links to /cart. An inbound link counts only from a different sitemap page, so a page linked
 * from itself or from /cart alone is still an orphan.
 */
export function auditSiteProblems(htmlByRoute: Map<string, string>, knownRoutes: string[]): AuditProblem[] {
  const problems: AuditProblem[] = [];
  const known = new Set(knownRoutes);
  const linkedFrom = new Set<string>();
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const defined = new Set<string>(PEARLY_IDS);
  const references: AuditProblem[] = [];

  for (const [route, html] of htmlByRoute) {
    for (const link of new Set(rawLinksOf(html))) {
      if (!known.has(link)) problems.push({ route, message: `links to ${link}, which is not a route` });
      if (link !== route && INDEXABLE_ROUTES.includes(route)) linkedFrom.add(link);
    }

    const title = titleOf(html);
    const description = metaContent(html, "description") ?? "";
    if (titles.has(title)) problems.push({ route, message: `title also used by ${titles.get(title)}` });
    if (descriptions.has(description)) problems.push({ route, message: `description also used by ${descriptions.get(description)}` });
    titles.set(title, route);
    descriptions.set(description, route);

    jsonLdBlocksOf(html).forEach((block, index) => {
      const data = parseBlock(block);
      if (data === undefined) problems.push({ route, message: `JSON-LD block ${index + 1} does not parse` });
      walkNodes(data, (node) => {
        const id = node["@id"];
        if (typeof id !== "string") return;
        if (Object.keys(node).length > 1) defined.add(id);
        else references.push({ route, message: id });
      });
    });
  }

  for (const route of INDEXABLE_ROUTES) {
    if (htmlByRoute.has(route) && !linkedFrom.has(route)) problems.push({ route, message: "orphan: no link from another sitemap page" });
  }
  for (const { route, message: id } of references) {
    if (!defined.has(id)) problems.push({ route, message: `@id ${id} resolves to no node on any page` });
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Sitemap dates
// ---------------------------------------------------------------------------

/** Dates here are written with toISOString, so they compare in UTC. */
export const todayUtc = () => new Date().toISOString().slice(0, 10);

export const isDate = (value: unknown) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

/** Each URL's lastmod as a date. Undefined for an entry with none. */
export function sitemapLastmods(sitemap: string): Map<string, string | undefined> {
  const lastmods = new Map<string, string | undefined>();
  for (const [entry] of sitemap.matchAll(/<url>[\s\S]*?<\/url>/g)) {
    const loc = /<loc>\s*([^<]+?)\s*<\/loc>/.exec(entry)?.[1];
    if (loc) lastmods.set(loc, /<lastmod>\s*([^<]+?)\s*<\/lastmod>/.exec(entry)?.[1].slice(0, 10));
  }
  return lastmods;
}

/** R2-FR-15, the parts one date can settle. Shared by D-SITEMAP and LV-SITEMAP. */
export function lastmodProblem(page: string, date: string | undefined): string | undefined {
  if (!date) return `${page} has no lastmod`;
  if (!isDate(date)) return `${page}: lastmod ${date} is not a date`;
  if (date > todayUtc()) return `${page}: lastmod ${date} is later than today`;
  return undefined;
}

/**
 * R2-FR-15 against the tracked dates, URL by URL, and shared by D-SITEMAP and LV-SITEMAP. R1 changed
 * most pages on one day, so a shared date proves nothing either way, and only this tells that
 * honest date from a build date stamped on most URLs. A URL with no lastmod is lastmodProblem's.
 */
export function trackedDateProblems(lastmods: Map<string, string | undefined>, tracked: Record<string, string>, site: string): string[] {
  const problems: string[] = [];
  const dated = new Map(Object.entries(tracked).map(([route, date]) => [`${site}${route}`, date]));
  for (const [url, date] of dated) {
    const shown = lastmods.get(url);
    if (!lastmods.has(url)) problems.push(`${url} has a tracked date but is not in the sitemap`);
    else if (shown && shown !== date) problems.push(`${url}: lastmod ${shown} differs from the tracked date ${date}`);
  }
  for (const url of lastmods.keys()) if (!dated.has(url)) problems.push(`${url} has no tracked date`);
  return problems;
}

/**
 * R2-FR-15's shape for a build date or a placeholder: every URL on one date that is not the day
 * every page last changed. histories holds each page's latest commit. The check is against that
 * date and not only for dates that differ, because a release can touch every page on one day, as
 * R1 did, and a build date stamped on those pages afterwards must still fail.
 */
export function sharedDateProblem(dates: string[], histories: string[]): string | undefined {
  if (dates.length < 2 || new Set(dates).size > 1) return undefined;
  const others = histories.filter((date) => date !== dates[0]).length;
  if (others === 0) return undefined;
  return `all ${dates.length} URLs share the lastmod ${dates[0]}, but ${others} of ${histories.length} pages last changed on another date`;
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export type JsonNode = Record<string, unknown>;

export const isNode = (value: unknown): value is JsonNode =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function parseBlock(block: string): unknown | undefined {
  try {
    return JSON.parse(block);
  } catch {
    return undefined;
  }
}

/** Key order ignored, so two blocks with the same data compare equal. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (isNode(value)) {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

export function topNodes(data: unknown): JsonNode[] {
  if (Array.isArray(data)) return data.flatMap(topNodes);
  if (!isNode(data)) return [];
  if (Array.isArray(data["@graph"])) return (data["@graph"] as unknown[]).flatMap(topNodes);
  return [data];
}

export function walkNodes(value: unknown, visit: (node: JsonNode) => void) {
  if (Array.isArray(value)) value.forEach((item) => walkNodes(item, visit));
  else if (isNode(value)) {
    visit(value);
    Object.values(value).forEach((item) => walkNodes(item, visit));
  }
}

export const typesOf = (node: JsonNode): string[] => {
  const type = node["@type"];
  if (Array.isArray(type)) return type.filter((item): item is string => typeof item === "string");
  return typeof type === "string" ? [type] : [];
};

const ONE_PER_PAGE = ["BreadcrumbList", "FAQPage", "BlogPosting", "ItemList"];
const ONE_PER_ID = ["Organization", "LocalBusiness"];
const UNIQUE_NAME = ["Service", "Product"];

/** The duplicate rules, shared by D-DUP and BR-HEAD. Returns one message per problem. */
export function duplicateProblems(blocks: string[]): string[] {
  const problems: string[] = [];
  const parsed: unknown[] = [];

  for (const block of blocks) {
    const data = parseBlock(block);
    if (data === undefined) problems.push("a JSON-LD block does not parse");
    else parsed.push(data);
  }

  const seenJson = new Set<string>();
  for (const data of parsed) {
    const json = canonicalJson(data);
    if (seenJson.has(json)) problems.push("two JSON-LD blocks are identical");
    seenJson.add(json);
  }

  const nodes = parsed.flatMap(topNodes);
  for (const type of ONE_PER_PAGE) {
    const count = nodes.filter((node) => typesOf(node).includes(type)).length;
    if (count > 1) problems.push(`${count} ${type} blocks on one page`);
  }

  const orgCounts = new Map<string, number>();
  for (const node of nodes) {
    if (!typesOf(node).some((type) => ONE_PER_ID.includes(type))) continue;
    const id = String(node["@id"] ?? "(no @id)");
    orgCounts.set(id, (orgCounts.get(id) ?? 0) + 1);
  }
  for (const [id, count] of orgCounts) if (count > 1) problems.push(`${count} Organization or LocalBusiness nodes for ${id}`);

  for (const type of UNIQUE_NAME) {
    const names = new Map<string, number>();
    for (const node of nodes) {
      if (typesOf(node).includes(type)) names.set(String(node.name), (names.get(String(node.name)) ?? 0) + 1);
    }
    for (const [name, count] of names) if (count > 1) problems.push(`${count} ${type} blocks named "${name}"`);
  }

  const definitions = new Map<string, number>();
  for (const data of parsed) {
    walkNodes(data, (node) => {
      if (typeof node["@id"] === "string" && Object.keys(node).length > 1) {
        definitions.set(node["@id"], (definitions.get(node["@id"]) ?? 0) + 1);
      }
    });
  }
  for (const [id, count] of definitions) if (count > 1) problems.push(`@id ${id} is defined ${count} times`);

  return [...new Set(problems)];
}

export const canonicalPath = (route: string) => {
  const path = route.split("?")[0];
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
};

export const routeUrl = (site: string, route: string) => `${site}${canonicalPath(route)}`;

export const routeOfHtmlFile = (path: string) => {
  const route = path.replace(/(?:^|\/)index\.html$/, "");
  return route ? `/${route}` : "/";
};

export const htmlFileOfRoute = (route: string) => (route === "/" ? "index.html" : `${route.slice(1)}/index.html`);

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
