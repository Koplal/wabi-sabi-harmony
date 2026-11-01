/**
 * Forwards real visitors' LCP to Axiom, because Speed Insights doesn't show LCP for this project
 * and Vercel Drains aren't available to it. Kept in one file with no local imports, so it deploys
 * as a single Vercel Function.
 *
 * The event sent to Axiom is built from the checked fields below, so nothing else in a request
 * can reach it: no IP, user agent, cookie or query string. With AXIOM_TOKEN or AXIOM_DATASET
 * unset, a valid report is logged as missing and dropped. `npm run verify:vitals` checks this
 * function with Axiom stubbed.
 */

/** The dataset is in Axiom's US East deployment, and ingest must use that deployment's domain. */
const INGEST_URL = "https://us-east-1.aws.edge.axiom.co/v1/ingest";
const AXIOM_TIMEOUT_MS = 3000;
const MAX_BODY_LENGTH = 300;
const MAX_PATH_LENGTH = 120;
/** Ten minutes in milliseconds. Larger means a broken or made-up report. */
const MAX_VALUE = 600_000;

const DEVICES = new Set(["mobile", "desktop"]);

/** Letters, digits, hyphens and slashes. Every route fits this, and so can a made-up address. */
const ROUTE_PATH = /^\/[a-z0-9/-]*$/i;

interface SpeedReport {
  metric: string;
  value: number;
  path: string;
  device: string;
}

const noContent = () => new Response(null, { status: 204 });

function parseReport(text: string): SpeedReport | null {
  if (text.length > MAX_BODY_LENGTH) return null;
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof body !== "object" || body === null) return null;
  const { metric, value, path, device } = body as Record<string, unknown>;
  if (metric !== "LCP") return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > MAX_VALUE) return null;
  if (typeof path !== "string" || path.length > MAX_PATH_LENGTH || !ROUTE_PATH.test(path)) return null;
  if (typeof device !== "string" || !DEVICES.has(device)) return null;
  return { metric, value, path, device };
}

export async function POST(request: Request): Promise<Response> {
  const report = parseReport(await request.text().catch(() => ""));
  if (!report) return new Response(null, { status: 400 });

  const token = process.env.AXIOM_TOKEN;
  const dataset = process.env.AXIOM_DATASET;
  if (!token || !dataset) {
    console.error("AXIOM_TOKEN or AXIOM_DATASET is not set");
    return noContent();
  }

  try {
    const response = await fetch(`${INGEST_URL}/${encodeURIComponent(dataset)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([{ ...report, environment: process.env.VERCEL_ENV ?? "unknown" }]),
      signal: AbortSignal.timeout(AXIOM_TIMEOUT_MS),
    });
    if (response.ok) return noContent();
    console.error(`Axiom refused a speed report: ${response.status}`);
  } catch (error) {
    console.error(`Axiom could not be reached: ${error instanceof Error ? error.name : "unknown error"}`);
  }
  return new Response(null, { status: 502 });
}
