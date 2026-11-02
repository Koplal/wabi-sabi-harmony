/**
 * Receives Resend's delivery events and reports failed ones to Sentry. This is the only way to
 * learn of a suppressed inbox, where the visitor saw success and no email arrived. Kept in one
 * file with no local imports, so it deploys as a single Vercel Function.
 *
 * Resend signs each event through Svix, and nothing is read until that signature is checked.
 * An event's subject and addresses hold visitors' details, so the report is built only from the
 * form type and a reason made of Resend's own codes. `npm run verify:forms` checks this function
 * with Sentry stubbed.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const SENTRY_TIMEOUT_MS = 1500;
/** The tolerance Svix's own library uses, which stops an old signed event being replayed. */
const MAX_SIGNATURE_AGE_SECONDS = 300;

const FAILURE_EVENTS = new Set(["email.failed", "email.bounced", "email.suppressed", "email.complained"]);

/** A Resend code such as reached_daily_quota. Free text from a mail server doesn't fit this. */
const RESEND_CODE = /^[A-Za-z_]{1,40}$/;

/** The sender names set in send-form-email.ts. `npm run verify:forms` fails if they drift apart. */
const FORM_SENDERS: Record<string, string> = {
  "Wabi-Sabi Contact Form": "contact",
  "Wabi-Sabi Booking": "booking",
  "Wabi-Sabi Careers": "careers",
};

interface ResendEvent {
  type?: unknown;
  data?: {
    from?: unknown;
    failed?: { reason?: unknown };
    bounce?: { type?: unknown; subType?: unknown };
    suppressed?: { type?: unknown };
  };
}

const answer = (status: number) => new Response(null, { status });

function isSignedByResend(headers: Headers, body: Buffer, secret: Buffer): boolean {
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signatures = headers.get("svix-signature");
  if (!id || !timestamp || !signatures || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_SIGNATURE_AGE_SECONDS) return false;

  const expected = createHmac("sha256", secret).update(`${id}.${timestamp}.`).update(body).digest();
  // The header can list several signatures while a secret is being rotated.
  return signatures.split(" ").some((entry) => {
    const [version, signature] = entry.split(",");
    if (version !== "v1" || !signature) return false;
    const given = Buffer.from(signature, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

function parseEvent(body: Buffer): ResendEvent | null {
  try {
    const event: unknown = JSON.parse(body.toString("utf8"));
    return typeof event === "object" && event !== null ? event : null;
  } catch {
    return null;
  }
}

const formOf = (from: unknown) => {
  const sender = typeof from === "string" ? from.split("<")[0].replace(/"/g, "").trim() : "";
  return Object.hasOwn(FORM_SENDERS, sender) ? FORM_SENDERS[sender] : "unknown";
};

function reasonOf(type: string, data: ResendEvent["data"]): string {
  const details = [data?.failed?.reason, data?.bounce?.type, data?.bounce?.subType, data?.suppressed?.type];
  return [type, ...details.filter((detail) => typeof detail === "string" && RESEND_CODE.test(detail))].join(":");
}

/**
 * Sends one failure to Sentry with fetch, so no SDK can capture a request body. The event is built
 * here from the form type and reason alone. Returns false if Sentry didn't take it. The ID comes
 * from Svix's, so a retried event reaches Sentry as the same event.
 */
async function reportToSentry(form: string, reason: string, deliveryId: string): Promise<boolean> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.error("SENTRY_DSN is not set");
    return true;
  }
  try {
    const { username, protocol, host, pathname } = new URL(dsn);
    const eventId = createHash("sha256").update(deliveryId).digest("hex").slice(0, 32);
    const event = {
      event_id: eventId,
      timestamp: Date.now() / 1000,
      platform: "node",
      level: "error",
      environment: process.env.VERCEL_ENV ?? "unknown",
      message: `Form email failed: ${form}, ${reason}`,
      fingerprint: ["form-email-failed", form, reason],
      tags: { form, reason },
    };
    const envelope = [{ event_id: eventId, sent_at: new Date().toISOString() }, { type: "event" }, event];
    const response = await fetch(`${protocol}//${host}/api${pathname}/envelope/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_client=wabisabiservices-forms/1.0, sentry_key=${username}`,
      },
      body: `${envelope.map((line) => JSON.stringify(line)).join("\n")}\n`,
      signal: AbortSignal.timeout(SENTRY_TIMEOUT_MS),
    });
    if (response.ok) return true;
    console.error(`Sentry refused a report: ${response.status}`);
  } catch (error) {
    console.error(`Sentry could not be reached: ${error instanceof Error ? error.name : "unknown error"}`);
  }
  return false;
}

export async function POST(request: Request): Promise<Response> {
  // An empty key would let anyone sign, so a secret with nothing after the prefix counts as unset.
  const secret = Buffer.from((process.env.RESEND_WEBHOOK_SECRET ?? "").replace(/^whsec_/, ""), "base64");
  if (secret.length === 0) {
    console.error("RESEND_WEBHOOK_SECRET is not set");
    return answer(503);
  }

  const body = Buffer.from(await request.arrayBuffer());
  if (!isSignedByResend(request.headers, body, secret)) return answer(401);

  const event = parseEvent(body);
  if (!event) return answer(400);
  if (typeof event.type !== "string" || !FAILURE_EVENTS.has(event.type)) return answer(200);

  const form = formOf(event.data?.from);
  const reason = reasonOf(event.type, event.data);
  console.error("Resend reported a failed email:", form, reason);

  // A failed report gets a non-2xx answer, so Resend sends the event again later.
  const reported = await reportToSentry(form, reason, request.headers.get("svix-id") ?? "");
  return answer(reported ? 200 : 502);
}
