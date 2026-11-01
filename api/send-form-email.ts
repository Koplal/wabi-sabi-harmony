/**
 * Emails the contact, booking and careers forms to the business inbox through Resend.
 * Kept in one file with no local imports, so it deploys as a single Vercel Function.
 * Personal details are never logged.
 *
 * FORMS and OPTION_LABELS mirror the form pages, and S-FORMS in the verify harness fails
 * if they drift apart. `vite dev` doesn't serve /api: use `vercel dev` to test the forms
 * locally, with RESEND_API_KEY in your local environment.
 */

const RESEND_URL = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 8000;
const INBOX = "hello@wabisabiservices.ca";
const SENDER_ADDRESS = "onboarding@wabisabiservices.ca";
const MAX_NAME_LENGTH = 200;
const MAX_FIELD_LENGTH = 5000;
const MAX_LOGGED_REASON = 300;

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

const row =(label: string, value: string) =>
  `<p><strong>${label}:</strong> ${escapeHtml(value).replace(/\r?\n/g, "<br>")}</p>`;

/** Returns the trimmed text of a field, "" if it is absent, or null if it is not usable text. */
function readField(body: Record<string, unknown>, key: string, maxLength: number): string | null {
  const value = body[key];
  if (value === undefined || value === null) return "";
  if (typeof value !== "string" || value.length > maxLength) return null;
  return value.trim();
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return json({ error: "Forms are unavailable" }, 500);
  }

  // A browser must preflight a cross-site JSON post, and this function never approves one.
  if (!request.headers.get("content-type")?.includes("application/json")) {
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
      return json({ error: "The email could not be sent" }, 502);
    }
  } catch (error) {
    console.error("Could not reach Resend:", error instanceof Error ? error.name : "unknown error");
    return json({ error: "The email could not be sent" }, 502);
  }

  return json({ ok: true }, 200);
}
