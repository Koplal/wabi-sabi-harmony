/** Source rules. Each check takes a SourceCtx, so the self-test can run it on fixtures. */
import ts from "typescript";
import {
  ABSENT,
  AREA_COPY_FILES,
  BANS,
  type Ban,
  type BanAllow,
  CONSULTATION,
  CONSULTATION_WINDOW,
  EXTGLASS,
  FAQ_FILES,
  FAQ_PLACEMENT,
  FAQ_SECTIONS,
  FORM_FILES,
  FREE_ESTIMATES,
  GA_EVENTS,
  MASK_ATTRIBUTE,
  MASK_FILES,
  NAP,
  OVERLAP,
  PEARLY_FILES,
  PRICE_FILES,
  REQUIRED,
  REQUIRED_ORDER,
  ROOF,
  VERBATIM_STRINGS,
} from "./rules";
import { compileBan, type Finding, lines, sentenceAround, SourceText, type TextView } from "./lib";

export interface ScanFile {
  path: string;
  text: SourceText;
}

export interface PrivateBans {
  ok: boolean;
  reason?: string;
  patterns: RegExp[];
}

export interface CommitRecord {
  hash: string;
  message: string;
  patch: string;
}

export interface GitInput {
  tracked(): Array<{ path: string; text: string }>;
  commits(): CommitRecord[];
  baseText(path: string): string | undefined;
}

export interface SourceCtx {
  /** Files in the current scope. */
  files: ScanFile[];
  /** The whole scan scope. */
  all: Map<string, ScanFile>;
  scoped: boolean;
  inScope(path: string): boolean;
  read(path: string): string | undefined;
  privateBans: PrivateBans;
  git: GitInput;
  /** Copy from the sibling repo, for S-OVERLAP. */
  sibling?: string[];
  note?: (message: string) => void;
}

export function parsePrivateBans(content: string | undefined, reason?: string): PrivateBans {
  if (content === undefined) return { ok: false, reason: reason ?? "file not readable", patterns: [] };
  let data: unknown;
  try {
    data = JSON.parse(content);
  } catch {
    return { ok: false, reason: "file is not valid JSON", patterns: [] };
  }
  if (!Array.isArray(data) || data.length === 0 || !data.every((item) => typeof item === "string" && item.length > 0)) {
    return { ok: false, reason: "file must be a non-empty array of regex strings", patterns: [] };
  }
  try {
    return { ok: true, patterns: data.map((source: string) => new RegExp(source, "gi")) };
  } catch {
    return { ok: false, reason: "file holds a pattern that does not compile", patterns: [] };
  }
}

// ---------------------------------------------------------------------------
// S-BAN
// ---------------------------------------------------------------------------

function phraseHit(view: TextView, allow: BanAllow, index: number): boolean {
  const phrase = allow.phrase ?? "";
  let position = view.text.indexOf(phrase);
  let first = true;
  while (position >= 0) {
    if (index >= position && index < position + phrase.length) return first || !allow.once;
    first = false;
    position = view.text.indexOf(phrase, position + phrase.length);
  }
  return false;
}

function isAllowed(ban: Ban, file: ScanFile, view: TextView, match: RegExpMatchArray): boolean {
  const index = match.index ?? 0;
  const length = match[0].length;
  return (ban.allow ?? []).some((allow) => {
    if (allow.file && allow.file !== file.path) return false;
    if (allow.pattern && !new RegExp(allow.pattern, "i").test(match[0])) return false;
    if (allow.followedBy) return view.text.startsWith(allow.followedBy, index + length);
    if (allow.sentenceContains) return sentenceAround(view.text, index, length).includes(allow.sentenceContains);
    if (allow.phrase) return phraseHit(view, allow, index);
    return false;
  });
}

const inBanScope = (ban: Ban, path: string) =>
  !ban.scope || ban.scope.some((scope) => path === scope || path.startsWith(scope));

function scanPatterns(file: ScanFile, patterns: RegExp[], onMatch: (patternIndex: number, view: TextView, match: RegExpMatchArray) => void) {
  for (const view of [file.text.plain, file.text.copy]) {
    patterns.forEach((pattern, patternIndex) => {
      for (const match of view.text.matchAll(pattern)) onMatch(patternIndex, view, match);
    });
  }
}

function checkPublicBan(ban: Ban, ctx: SourceCtx): Finding[] {
  const patterns = [
    ...ban.patterns.map((source) => compileBan(source, "gi")),
    ...(ban.caseSensitive ?? []).map((source) => compileBan(source, "g")),
  ];
  const findings = new Map<string, Finding>();
  for (const file of ctx.files) {
    if (!inBanScope(ban, file.path)) continue;
    scanPatterns(file, patterns, (patternIndex, view, match) => {
      if (isAllowed(ban, file, view, match)) return;
      const line = file.text.lineOf(view, match.index ?? 0);
      findings.set(`${file.path}:${line}:${patternIndex}`, {
        rule: ban.id,
        row: ban.row,
        file: file.path,
        line,
        message: `banned text "${match[0]}"`,
      });
    });
  }
  return [...findings.values()];
}

function checkPrivateBan(ban: Ban, ctx: SourceCtx): Finding[] {
  if (!ctx.privateBans.ok) {
    const message = `private ban file unavailable: ${ctx.privateBans.reason}`;
    if (ctx.scoped) {
      ctx.note?.(`Warning: ${ban.id} skipped, ${message}. Set SEO_PRIVATE_BANS.`);
      return [];
    }
    return [{ rule: ban.id, row: ban.row, message }];
  }
  const findings = new Map<string, Finding>();
  for (const file of ctx.files) {
    scanPatterns(file, ctx.privateBans.patterns, (patternIndex, view, match) => {
      const line = file.text.lineOf(view, match.index ?? 0);
      findings.set(`${file.path}:${line}:${patternIndex}`, {
        rule: ban.id,
        row: ban.row,
        file: file.path,
        line,
        message: `matches private pattern ${patternIndex + 1}`,
      });
    });
  }
  return [...findings.values()];
}

export function checkBan(ban: Ban, ctx: SourceCtx): Finding[] {
  return ban.private ? checkPrivateBan(ban, ctx) : checkPublicBan(ban, ctx);
}

// ---------------------------------------------------------------------------
// Required and absent strings
// ---------------------------------------------------------------------------

export function checkRequired(ctx: SourceCtx): Finding[] {
  const findings: Finding[] = [];
  for (const entry of REQUIRED) {
    for (const path of entry.files) {
      if (!ctx.inScope(path)) continue;
      const file = ctx.all.get(path);
      if (!file) findings.push({ rule: "S-REQ", row: entry.row, file: path, message: "file does not exist yet" });
      else if (!file.text.contains(entry.text)) {
        findings.push({ rule: "S-REQ", row: entry.row, file: path, message: `missing "${entry.text}"` });
      }
    }
  }

  for (const entry of REQUIRED_ORDER) {
    for (const path of entry.files) {
      if (!ctx.inScope(path)) continue;
      const file = ctx.all.get(path);
      if (!file) {
        findings.push({ rule: "S-REQ", row: entry.row, file: path, message: "file does not exist yet" });
        continue;
      }
      let cursor = 0;
      for (const text of entry.texts) {
        const index = file.text.copy.text.indexOf(text, cursor);
        if (index < 0) {
          findings.push({ rule: "S-REQ", row: entry.row, file: path, message: `missing, or out of order: "${text}"` });
          break;
        }
        cursor = index + text.length;
      }
    }
  }
  return findings;
}

export function checkAbsent(ctx: SourceCtx): Finding[] {
  const findings = new Map<string, Finding>();
  for (const entry of ABSENT) {
    const targets = ctx.files.filter((file) => !entry.files || entry.files.includes(file.path));
    for (const file of targets) {
      for (const view of [file.text.plain, file.text.copy]) {
        const haystack = view.text.toLowerCase();
        for (const text of entry.texts) {
          const needle = text.toLowerCase();
          let index = haystack.indexOf(needle);
          while (index >= 0) {
            const line = file.text.lineOf(view, index);
            findings.set(`${file.path}:${line}:${needle}`, {
              rule: "S-ABSENT",
              row: entry.row,
              file: file.path,
              line,
              message: `must be gone: "${text}"`,
            });
            index = haystack.indexOf(needle, index + needle.length);
          }
        }
      }
    }
  }
  return [...findings.values()];
}

export function checkConsult(ctx: SourceCtx): Finding[] {
  const findings: Finding[] = [];
  for (const file of ctx.files) {
    const { copy } = file.text;
    let index = copy.text.indexOf(CONSULTATION);
    while (index >= 0) {
      const end = index + CONSULTATION.length;
      const following = copy.text.slice(end, end + CONSULTATION_WINDOW + FREE_ESTIMATES.length);
      const position = following.indexOf(FREE_ESTIMATES);
      const closesFirst = position >= 0 && following.slice(0, position).includes("</p>");
      if (position < 0 || closesFirst) {
        findings.push({
          rule: "S-CONSULT",
          row: "T-19",
          file: file.path,
          line: file.text.lineOf(copy, index),
          message: `the consultation line is not followed by "${FREE_ESTIMATES}" in the same paragraph, within ${CONSULTATION_WINDOW} characters`,
        });
      }
      index = copy.text.indexOf(CONSULTATION, end);
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// S-FAQ
// ---------------------------------------------------------------------------

const unquote = (value: string) => value.replace(/\\(['"])/g, "$1");

/**
 * The answers in the FAQ data, as a visitor reads them. Only a complete quoted string counts, so an
 * answer built some other way is left out rather than cut short, and D-FAQRAW reports the shortfall.
 */
export const faqAnswers = (dataText: string) =>
  [...dataText.matchAll(/answer:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')(?=\s*[,}])/g)].map((match) => unquote(match[1] ?? match[2]));

export const faqQuestions = (dataText: string) =>
  [...dataText.matchAll(/question:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g)].map((match) => unquote(match[1] ?? match[2]));

export function checkFaq(ctx: SourceCtx): Finding[] {
  if (!ctx.inScope(FAQ_FILES.data) && !ctx.inScope(FAQ_FILES.page)) return [];
  const finding = (file: string, message: string): Finding => ({ rule: "S-FAQ", file, message });

  const dataText = ctx.read(FAQ_FILES.data);
  const pageText = ctx.read(FAQ_FILES.page);
  if (dataText === undefined || pageText === undefined) return [finding(FAQ_FILES.data, "FAQ files not found")];

  const questions = faqQuestions(dataText);
  const sections = [...pageText.matchAll(/heading:\s*"([^"]+)",\s*count:\s*(\d+)/g)].map((match) => ({
    heading: match[1],
    count: Number(match[2]),
  }));

  const findings: Finding[] = [];
  const sum = sections.reduce((total, section) => total + section.count, 0);
  if (sum !== questions.length) {
    findings.push(finding(FAQ_FILES.page, `section counts sum to ${sum}, but there are ${questions.length} FAQ items`));
  }

  let cursor = 0;
  FAQ_SECTIONS.forEach((expected, index) => {
    const actual = sections[index];
    if (!actual || actual.heading !== expected.heading) {
      findings.push(finding(FAQ_FILES.page, `section ${index + 1} should be "${expected.heading}"`));
      return;
    }
    if (actual.count !== expected.count) {
      findings.push(finding(FAQ_FILES.page, `"${expected.heading}" has count ${actual.count}, expected ${expected.count}`));
    }
    if (questions[cursor] !== expected.first) {
      findings.push(finding(FAQ_FILES.data, `"${expected.heading}" starts with "${questions[cursor]}", expected "${expected.first}"`));
    }
    cursor += actual.count;
  });

  for (const placement of FAQ_PLACEMENT) {
    const index = questions.indexOf(placement.after);
    const following = questions.slice(index + 1, index + 1 + placement.next.length);
    const missing = placement.next.filter((question) => !following.includes(question));
    if (index < 0 || missing.length > 0) {
      findings.push(finding(FAQ_FILES.data, `directly after "${placement.after}", expected: ${missing.join(" | ")}`));
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// S-NAP, S-PEARLY, S-GA, S-EXTGLASS, S-ROOF, S-MASK
// ---------------------------------------------------------------------------

export function napProblems(text: string): string[] {
  const problems: string[] = [];
  for (const match of text.matchAll(new RegExp(NAP.phoneCandidate, "g"))) {
    if (!NAP.phones.includes(match[0])) problems.push(`phone form not allowed: ${match[0]}`);
  }
  for (const match of text.matchAll(new RegExp(NAP.emailCandidate, "g"))) {
    if (match[0] !== NAP.email) problems.push(`email not allowed: ${match[0]}`);
  }
  return problems;
}

export function checkNap(ctx: SourceCtx): Finding[] {
  const findings: Finding[] = [];
  for (const file of ctx.files) {
    lines(file.text.raw).forEach((line, index) => {
      for (const message of napProblems(line)) {
        findings.push({ rule: "S-NAP", file: file.path, line: index + 1, message });
      }
    });
  }
  return findings;
}

export function checkPearly(ctx: SourceCtx): Finding[] {
  const findings: Finding[] = [];
  for (const file of ctx.files) {
    if (PEARLY_FILES.includes(file.path)) continue;
    lines(file.text.raw).forEach((line, index) => {
      if (/pearly/i.test(line)) {
        findings.push({ rule: "S-PEARLY", file: file.path, line: index + 1, message: "the sister brand appears outside its allowed files" });
      }
    });
  }
  return findings;
}

export function checkGa(ctx: SourceCtx): Finding[] {
  const findings: Finding[] = [];
  for (const { file, event } of GA_EVENTS) {
    if (!ctx.inScope(file)) continue;
    const finding = (message: string): Finding => ({ rule: "S-GA", row: "FR-4", file, message });
    const text = ctx.read(file);
    if (text === undefined) {
      findings.push(finding("file not found"));
      continue;
    }
    const count = text.split(`"${event}"`).length + text.split(`'${event}'`).length - 2;
    if (count !== 1) {
      findings.push(finding(`${event} fires ${count} times, expected once`));
      continue;
    }
    const index = Math.max(text.indexOf(`"${event}"`), text.indexOf(`'${event}'`));
    const tryIndex = text.lastIndexOf("try {", index);
    const before = tryIndex >= 0 ? text.slice(tryIndex, index) : "";
    const inSuccessPath = /\bthrow\b/.test(before) && !/\bcatch\b/.test(before);
    if (!inSuccessPath) findings.push(finding(`${event} does not fire in the success path`));
  }
  return findings;
}

export function checkExtGlass(ctx: SourceCtx): Finding[] {
  const surface = new RegExp(EXTGLASS.surface, "i");
  const exposure = new RegExp(EXTGLASS.exposure, "i");
  const findings: Finding[] = [];
  for (const path of AREA_COPY_FILES) {
    const file = ctx.inScope(path) ? ctx.all.get(path) : undefined;
    if (!file) continue;
    lines(file.text.raw).forEach((line, index) => {
      if (surface.test(line) && exposure.test(line) && !line.includes(EXTGLASS.partner)) {
        findings.push({ rule: "S-EXTGLASS", row: "T-14", file: path, line: index + 1, message: `exterior glass claim without "${EXTGLASS.partner}"` });
      }
    });
  }
  return findings;
}

export function checkRoof(ctx: SourceCtx): Finding[] {
  const pattern = new RegExp(ROOF.pattern, "i");
  const findings: Finding[] = [];
  for (const path of AREA_COPY_FILES) {
    const file = ctx.inScope(path) ? ctx.all.get(path) : undefined;
    if (!file) continue;
    lines(file.text.raw).forEach((line, index) => {
      if (pattern.test(line) && !ROOF.allowed.some((allowed) => line.includes(allowed))) {
        findings.push({ rule: "S-ROOF", row: "T-13", file: path, line: index + 1, message: "roof or chimney claim" });
      }
    });
  }
  return findings;
}

function maskProblem(raw: string): string | undefined {
  const formIndex = raw.indexOf("<form");
  if (formIndex < 0) return "no <form> found";
  const attribute = raw.lastIndexOf(MASK_ATTRIBUTE, formIndex);
  if (attribute < 0) return `no ${MASK_ATTRIBUTE} wrapper around the <form>`;

  const open = raw.lastIndexOf("<", attribute);
  const tag = /^<([A-Za-z][\w.]*)/.exec(raw.slice(open))?.[1];
  if (!tag) return `no ${MASK_ATTRIBUTE} wrapper around the <form>`;

  const depth = (text: string) => {
    const opens = text.match(new RegExp(`<${tag}[\\s>]`, "g"))?.length ?? 0;
    const closes = text.match(new RegExp(`</${tag}>`, "g"))?.length ?? 0;
    return opens - closes;
  };
  const formEnd = raw.indexOf("</form>", formIndex);
  if (depth(raw.slice(open, formIndex)) < 1 || formEnd < 0 || depth(raw.slice(open, formEnd)) < 1) {
    return "the masked wrapper does not contain the whole <form>";
  }
  return undefined;
}

export function checkMask(ctx: SourceCtx): Finding[] {
  const findings: Finding[] = [];
  for (const file of MASK_FILES) {
    if (!ctx.inScope(file)) continue;
    const text = ctx.read(file);
    const problem = text === undefined ? "file not found" : maskProblem(text);
    if (problem) findings.push({ rule: "S-MASK", row: "FR-3", file, message: problem });
  }
  return findings;
}

// ---------------------------------------------------------------------------
// S-PRICES
// ---------------------------------------------------------------------------

export function checkPrices(ctx: SourceCtx): Finding[] {
  const seasonal = ctx.files.filter((file) => file.path.startsWith(PRICE_FILES.seasonalDir));
  if (seasonal.length === 0) return [];
  const finding = (file: string, line: number | undefined, message: string): Finding => ({ rule: "S-PRICES", file, line, message });

  const catalogueText = ctx.read(PRICE_FILES.catalogue);
  if (catalogueText === undefined) return [finding(PRICE_FILES.catalogue, undefined, "checkout catalogue not found")];
  const catalogue = new Map<string, { name: string; price: number }>();
  for (const match of catalogueText.matchAll(/"([a-z0-9-]+)":\s*\{\s*name:\s*"((?:[^"\\]|\\.)*)",\s*price:\s*(\d+)/g)) {
    catalogue.set(match[1], { name: unquote(match[2]), price: Number(match[3]) });
  }

  const findings: Finding[] = [];
  const item = /id:\s*(['"])([a-z0-9-]+)\1,\s*name:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"),\s*price:\s*(\d+)/g;
  for (const file of seasonal) {
    for (const match of file.text.raw.matchAll(item)) {
      const id = match[2];
      const name = unquote(match[3] ?? match[4]);
      const price = Number(match[5]);
      const line = file.text.lineOfRaw(match.index ?? 0);
      const entry = catalogue.get(id);
      if (!entry) findings.push(finding(file.path, line, `cart item ${id} is not in the checkout catalogue`));
      else if (entry.name !== name) findings.push(finding(file.path, line, `cart item ${id} is named "${name}", the catalogue says "${entry.name}"`));
      else if (entry.price !== price) findings.push(finding(file.path, line, `cart item ${id} costs ${price}, the catalogue says ${entry.price}`));
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// S-FORMS
// ---------------------------------------------------------------------------

/** The keys in one form's field list in the function, or undefined if the form is not there. */
function functionFields(source: string, form: string): string[] | undefined {
  const block = new RegExp(`^\\s*${form}: \\{[\\s\\S]*?fields: \\[((?:\\s*\\[[^\\]]*\\],?)*)\\s*\\]`, "m").exec(source)?.[1];
  return block === undefined ? undefined : [...block.matchAll(/\[\s*"(\w+)"/g)].map((match) => match[1]);
}

/** A field on a page that the function does not list would never reach the inbox, with no error. */
export function checkForms(ctx: SourceCtx): Finding[] {
  const pages = FORM_FILES.pages.filter(({ file }) => ctx.inScope(file));
  if (pages.length === 0) return [];
  const finding = (file: string, message: string): Finding => ({ rule: "S-FORMS", row: "B-15", file, message });

  const source = ctx.read(FORM_FILES.handler);
  if (source === undefined) return [finding(FORM_FILES.handler, "form function not found")];
  const labelBlock = /OPTION_LABELS[^=]*=\s*\{([\s\S]*?)\n\};/.exec(source)?.[1] ?? "";
  const labels = new Map([...labelBlock.matchAll(/^\s*"?([a-z0-9-]+)"?:\s*"([^"]*)",?$/gm)].map((match) => [match[1], match[2]]));

  const findings: Finding[] = [];
  for (const { form, file } of pages) {
    const text = ctx.read(file);
    if (text === undefined) {
      findings.push(finding(file, "file not found"));
      continue;
    }
    if (!text.includes(`sendForm("${form}"`)) findings.push(finding(file, `does not post the ${form} form`));

    const state = /useState\(\{([^}]*)\}\)/.exec(text)?.[1];
    const fields = functionFields(source, form);
    if (state === undefined) findings.push(finding(file, "form state not found"));
    if (fields === undefined || fields.length === 0) findings.push(finding(FORM_FILES.handler, `form ${form} has no field list`));
    if (state !== undefined && fields?.length) {
      const pageKeys = [...state.matchAll(/(\w+):\s*""/g)].map((match) => match[1]);
      for (const key of pageKeys) {
        if (!FORM_FILES.directKeys.includes(key) && !fields.includes(key)) findings.push(finding(file, `field ${key} never reaches the inbox: it is not in the ${form} field list`));
      }
      for (const key of fields) {
        if (!pageKeys.includes(key)) findings.push(finding(FORM_FILES.handler, `the ${form} field list has ${key}, which the page does not send`));
      }
    }

    for (const match of text.matchAll(/<SelectItem value="([^"]+)">([^<]+)<\/SelectItem>/g)) {
      const [, value, label] = match;
      const mapped = labels.get(value);
      if (mapped === undefined) findings.push(finding(file, `option ${value} is not in OPTION_LABELS`));
      else if (mapped !== label) findings.push(finding(file, `option ${value} reads "${label}" on the page, the email says "${mapped}"`));
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// S-LEAK
// ---------------------------------------------------------------------------

export function checkLeak(ctx: SourceCtx): Finding[] {
  if (!ctx.privateBans.ok) {
    return [{ rule: "S-LEAK", message: `private ban file unavailable: ${ctx.privateBans.reason}` }];
  }

  const findings: Finding[] = [];
  const scan = (text: string, record: (line: number, patternNumber: number) => void) => {
    ctx.privateBans.patterns.forEach((pattern, patternIndex) => {
      for (const match of text.matchAll(pattern)) {
        const line = text.slice(0, match.index ?? 0).split("\n").length;
        record(line, patternIndex + 1);
      }
    });
  };

  for (const file of ctx.git.tracked()) {
    scan(file.text, (line, patternNumber) => {
      findings.push({ rule: "S-LEAK", file: file.path, line, message: `matches private pattern ${patternNumber}` });
    });
  }
  for (const commit of ctx.git.commits()) {
    const short = commit.hash.slice(0, 7);
    scan(commit.message, (line, patternNumber) => {
      findings.push({ rule: "S-LEAK", message: `commit ${short} message line ${line} matches private pattern ${patternNumber}` });
    });
    scan(commit.patch, (line, patternNumber) => {
      findings.push({ rule: "S-LEAK", message: `commit ${short} patch line ${line} matches private pattern ${patternNumber}` });
    });
  }
  return findings;
}

// ---------------------------------------------------------------------------
// S-OVERLAP
// ---------------------------------------------------------------------------

interface CopySegment {
  text: string;
  line: number;
}

/** The text a visitor can read from a source file: JSX text and string literals. */
/** With numbers, numeric literals count too, because a price is copy when asking what changed. */
export function copySegments(path: string, text: string, numbers = false): CopySegment[] {
  if (!/\.tsx?$/.test(path)) return lines(text).map((line, index) => ({ text: line, line: index + 1 }));

  const kind = path.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, kind);
  const segments: CopySegment[] = [];
  const push = (node: ts.Node, value: string) => {
    segments.push({ text: value, line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1 });
  };
  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isJsxAttribute(node) && OVERLAP.nonCopyAttributes.includes(node.name.getText(source))) return;
    if (ts.isJsxText(node)) push(node, node.text);
    else if (ts.isStringLiteralLike(node)) push(node, node.text);
    else if (numbers && ts.isNumericLiteral(node)) push(node, node.text);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return segments;
}

const wordsOf = (text: string) => text.toLowerCase().replace(/’/g, "'").match(/[a-z0-9$'-]+/g) ?? [];

function wordRuns(text: string): string[] {
  const words = wordsOf(text);
  const runs: string[] = [];
  for (let i = 0; i + OVERLAP.words <= words.length; i++) runs.push(words.slice(i, i + OVERLAP.words).join(" "));
  return runs;
}

const runsOfFile = (path: string, text: string) => new Set(copySegments(path, text).flatMap((segment) => wordRuns(segment.text)));

export function checkOverlap(ctx: SourceCtx): Finding[] {
  const sibling = new Set((ctx.sibling ?? []).flatMap(wordRuns));
  const allowed = new Set(VERBATIM_STRINGS.flatMap(wordRuns));
  const findings = new Map<string, Finding>();

  for (const file of ctx.files) {
    if (OVERLAP.exemptFiles.includes(file.path)) continue;
    const baseText = ctx.git.baseText(file.path);
    const baseRuns = baseText === undefined ? new Set<string>() : runsOfFile(file.path, baseText);
    for (const segment of copySegments(file.path, file.text.raw)) {
      for (const run of wordRuns(segment.text)) {
        if (sibling.has(run) && !allowed.has(run) && !baseRuns.has(run)) {
          findings.set(`${file.path}:${segment.line}`, {
            rule: "S-OVERLAP",
            file: file.path,
            line: segment.line,
            message: `new copy shares an ${OVERLAP.words}-word run with the sibling site: "${run}"`,
          });
        }
      }
    }
  }
  return [...findings.values()];
}

export const SOURCE_CHECKS: Record<string, (ctx: SourceCtx) => Finding[]> = {
  ...Object.fromEntries(BANS.map((ban) => [ban.id, (ctx: SourceCtx) => checkBan(ban, ctx)])),
  "S-REQ": checkRequired,
  "S-CONSULT": checkConsult,
  "S-FAQ": checkFaq,
  "S-NAP": checkNap,
  "S-PEARLY": checkPearly,
  "S-GA": checkGa,
  "S-EXTGLASS": checkExtGlass,
  "S-ROOF": checkRoof,
  "S-ABSENT": checkAbsent,
  "S-MASK": checkMask,
  "S-PRICES": checkPrices,
  "S-FORMS": checkForms,
  "S-LEAK": checkLeak,
  "S-OVERLAP": checkOverlap,
};
