/** Live rules as pure checks on fetched responses, so the self-test can run them on fixtures. */
import { LIVE } from "./rules";
import type { Finding } from "./lib";

export interface Hop {
  url: string;
  status: number;
  location?: string;
}

/** Every response from a start URL to the first response that is not a redirect. */
export type Chain = Hop[];

const isRedirect = (status: number) => status >= 300 && status < 400;

export const describeChain = (chain: Chain) => chain.map((hop) => `${hop.url} ${hop.status}`).join(" -> ");

const finalUrl = (chain: Chain) => chain[chain.length - 1]?.url ?? "";
const finalStatus = (chain: Chain) => chain[chain.length - 1]?.status ?? 0;
const redirects = (chain: Chain) => chain.filter((hop) => isRedirect(hop.status));

export function checkHost(start: string, chain: Chain): Finding[] {
  const finding = (message: string): Finding[] => [{ rule: "LV-HOST", file: start, message: `${message}: ${describeChain(chain)}` }];
  const hops = redirects(chain);
  if (finalUrl(chain).replace(/\/$/, "") !== LIVE.apex || finalStatus(chain) !== 200) return finding("does not end at the apex");
  if (hops.length > 1) return finding(`${hops.length} redirects, expected at most one`);
  const wrong = hops.find((hop) => hop.status !== 308);
  if (wrong) return finding(`redirect is ${wrong.status}, expected 308`);
  return [];
}

export function checkFile(path: string, chain: Chain): Finding[] {
  if (chain.length === 1 && chain[0].status === 200) return [];
  return [{ rule: "LV-FILES", file: path, message: `expected 200 with no redirect: ${describeChain(chain)}` }];
}

export function checkMissing(chain: Chain): Finding[] {
  if (finalStatus(chain) === 404) return [];
  return [{ rule: "LV-404", file: LIVE.missingPath, message: `expected 404: ${describeChain(chain)}` }];
}

const visibleWords = (html: string) =>
  html
    .replace(/<head[\s>][\s\S]*?<\/head>/i, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

export function checkRaw(route: string, status: number, html: string): Finding[] {
  const findings: Finding[] = [];
  const add = (message: string) => findings.push({ rule: "LV-RAW", file: route, message });
  if (status !== 200) add(`status ${status}`);
  if (!/<h1[\s>]/i.test(html)) add("no H1 in raw HTML");
  const words = visibleWords(html);
  if (words < LIVE.rawMinWords) add(`${words} words of body text in raw HTML, expected at least ${LIVE.rawMinWords}`);
  return findings;
}

export function checkRedirect(from: string, to: string, base: string, chain: Chain): Finding[] {
  const hops = redirects(chain);
  const expected = new URL(to, base).href;
  if (hops.length === 1 && [301, 308].includes(hops[0].status) && finalUrl(chain) === expected && finalStatus(chain) === 200) return [];
  return [{ rule: "LV-REDIRECT", file: from, message: `expected one permanent redirect to ${to}, ending at 200: ${describeChain(chain)}` }];
}

export function checkUtility(route: string, status: number, html: string): Finding[] {
  const findings: Finding[] = [];
  if (status !== 200) findings.push({ rule: "LV-UTILITY", file: route, message: `status ${status}` });
  if (!/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) findings.push({ rule: "LV-UTILITY", file: route, message: "no noindex in raw HTML" });
  return findings;
}
