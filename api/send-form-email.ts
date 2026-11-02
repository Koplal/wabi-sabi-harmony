/**
 * Emails the contact, booking and careers forms to the business inbox through Resend.
 * Kept in one file with no local imports, so it deploys as a single Vercel Function.
 * Personal details are never logged. A failed send is reported to Sentry with the form type and
 * reason only, and with SENTRY_DSN unset the forms work the same with no report.
 *
 * FORMS and OPTION_LABELS mirror the form pages, and S-FORMS in the verify harness fails
 * if they drift apart. `vite dev` doesn't serve /api: use `vercel dev` to test the forms
 * locally, with RESEND_API_KEY in your local environment. `npm run verify:forms` checks
 * this function with Resend stubbed.
 */

const RESEND_URL = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 8000;
/** Short, because it follows the wait on Resend and the visitor is still waiting for an answer. */
const SENTRY_TIMEOUT_MS = 1500;
const INBOX = "hello@wabisabiservices.ca";
const SENDER_ADDRESS = "onboarding@wabisabiservices.ca";
const MAX_NAME_LENGTH = 200;
const MAX_FIELD_LENGTH = 5000;
const MAX_LOGGED_REASON = 300;

/** Resend's error name, such as daily_quota_exceeded, in a refusal's JSON. */
const RESEND_ERROR_NAME = /"name"\s*:\s*"([a-z_]{1,60})"/;

/** One address with a dotted domain. A comma or semicolon would turn reply_to into a list. */
const EMAIL = /^[^\s@,;<>"]+@[^\s@,;<>".]+(\.[^\s@,;<>".]+)+$/;

/** Resend statuses about the account, whose reasons can't repeat what a visitor typed. */
const ACCOUNT_STATUSES = new Set([401, 403, 429]);

/** Fields filled from a select, whose values are slugs such as "residential-deep". */
const OPTION_FIELDS = new Set(["serviceType", "cadence"]);

/** The words the customer saw for each select value, matching the form pages. */
const OPTION_LABELS: Record<string, string> = {
  "residential-maintenance": "Residential Maintenance",
  "residential-deep": "Residential Deep Reset",
  "residential-move": "Moving Prep / Listing-Ready",
  residential: "Residential",
  commercial: "Commercial",
  "post-construction": "Post-Construction",
  consultation: "Consultation Only",
  "seasonal-2027-waitlist": "2027 Seasonal Waitlist",
  weekly: "Weekly",
  biweekly: "Bi-Weekly",
  monthly: "Monthly",
  "one-time": "One-Time",
};

interface FormDefinition {
  sender: string;
  subject: string;
  fields: [key: string, label: string][];
  /** Keys that must hold text. The pages require them too, but spaces pass the browser's check. */
  required?: string[];
}

const FORMS: Record<string, FormDefinition> = {
  contact: {
    sender: "Wabi-Sabi Contact Form",
    subject: "New Contact Form Submission",
    fields: [
      ["phone", "Phone"],
      ["address", "Address/Neighbourhood"],
      ["serviceType", "Service Type"],
      ["cadence", "Ideal Cadence"],
      ["notes", "Notes"],
    ],
  },
  booking: {
    sender: "Wabi-Sabi Booking",
    subject: "New Booking Request",
    fields: [
      ["phone", "Phone"],
      ["address", "Address/Neighbourhood"],
      ["serviceType", "Service Type"],
      ["cadence", "Ideal Cadence"],
      ["preferredTime1", "Preferred Time 1"],
      ["preferredTime2", "Preferred Time 2"],
      ["preferredTime3", "Preferred Time 3"],
    ],
    required: ["phone", "address"],
  },
  careers: {
    sender: "Wabi-Sabi Careers",
    subject: "New Job Application",
    fields: [
      ["phone", "Phone"],
      ["position", "Position of Interest"],
      ["availability", "Availability"],
      ["experience", "Relevant Experience"],
      ["message", "Additional Information"],
    ],
  },
};

const json = (body: unknown, status: number) => Response.json(body, { status });

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const displayValue = (key: string, value: string) =>
  OPTION_FIELDS.has(key) && Object.hasOwn(OPTION_LABELS, value) ? OPTION_LABELS[value] : value;

const row = (label: string, value: string) =>
  `<p><strong>${label}:</strong> ${escapeHtml(value).replace(/\r?\n/g, "<br>")}</p>`;

/** The media type of a Content-Type header, without parameters such as charset. */
const mediaType = (header: string | null) => header?.split(";")[0].trim().toLowerCase();

/** Returns the trimmed text of a field, "" if it is absent, or null if it is not usable text. */
function readField(body: Record<string, unknown>, key: string, maxLength: number): string | null {
  const value = body[key];
  if (value === undefined || value === null) return "";
  if (typeof value !== "string" || value.length > maxLength) return null;
  return value.trim();
}

/**
 * Sends one failure to Sentry with fetch, so no SDK can capture a request body. The event is built
 * here from the form type and reason alone, and neither holds anything a visitor typed. It never
 * throws, and the caller waits for it because Vercel may stop a function once it has answered.
 */
async function reportToSentry(form: string, reason: string): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    console.error("SENTRY_DSN is not set");
    return;
  }
  try {
    const { username, protocol, host, pathname } = new URL(dsn);
    const eventId = crypto.randomUUID().replace(/-/g, "");
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
    if (!response.ok) console.error(`Sentry refused a report: ${response.status}`);
  } catch (error) {
    console.error(`Sentry could not be reached: ${error instanceof Error ? error.name : "unknown error"}`);
  }
}

export async function POST(request: Request): Promise<Response> {
  // Exact, because a browser reads "text/plain; application/json" as text/plain and skips the preflight.
  // JSON needs one, which this function never approves. That only stops other sites: a script can still post.
  if (mediaType(request.headers.get("content-type")) !== "application/json") {
    return json({ error: "Invalid request" }, 400);
  }

  let body: Record<string, unknown> | null;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return json({ error: "Invalid request" }, 400);
  }

  const formName = body.form;
  if (typeof formName !== "string" || !Object.hasOwn(FORMS, formName)) {
    return json({ error: "Invalid request" }, 400);
  }
  const form = FORMS[formName];

  // Messages on a 400 are shown to the customer, so each one says what to correct.
  const name = readField(body, "name", MAX_NAME_LENGTH);
  if (!name) return json({ error: "Name is required" }, 400);
  const email = readField(body, "email", MAX_NAME_LENGTH);
  if (!email || !EMAIL.test(email)) return json({ error: "Please check your email address" }, 400);

  const rows: string[] = [];
  for (const [key, label] of form.fields) {
    const value = readField(body, key, MAX_FIELD_LENGTH);
    if (value === null) return json({ error: `${label} is too long` }, 400);
    if (value) rows.push(row(label, displayValue(key, value)));
    else if (form.required?.includes(key)) return json({ error: `${label} is required` }, 400);
  }

  // Checked after the form is read, so the report can name it and a junk request can't raise one.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    await reportToSentry(formName, "resend_key_missing");
    return json({ error: "Forms are unavailable" }, 500);
  }

  const subjectName = name.replace(/\s+/g, " ");
  const html = [`<h2>${form.subject}</h2>`, row("Name", name), row("Email", email), ...rows].join("\n");

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
      // Resend refuses API requests that have no User-Agent.
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "wabisabiservices-forms",
      },
      body: JSON.stringify({
        from: `${form.sender} <${SENDER_ADDRESS}>`,
        to: [INBOX],
        reply_to: email,
        subject: `${form.subject} from ${subjectName}`,
        html,
      }),
    });
    if (!response.ok) {
      const reason = ACCOUNT_STATUSES.has(response.status) ? (await response.text()).slice(0, MAX_LOGGED_REASON) : "";
      console.error("Resend rejected the email, status", response.status, reason);
      const errorName = RESEND_ERROR_NAME.exec(reason)?.[1];
      await reportToSentry(formName, ["resend_refused", response.status, errorName].filter(Boolean).join("_"));
      return json({ error: "The email could not be sent" }, 502);
    }
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "unknown error";
    console.error("Could not reach Resend:", errorName);
    await reportToSentry(formName, errorName === "TimeoutError" ? "resend_timeout" : "resend_unreachable");
    return json({ error: "The email could not be sent" }, 502);
  }

  return json({ ok: true }, 200);
}
