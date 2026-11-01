/**
 * Emails the contact, booking and careers forms to the business inbox through Resend.
 * Kept in one file with no local imports, so it deploys as a single Vercel Function.
 * Personal details are never logged.
 */

const RESEND_URL = "https://api.resend.com/emails";
const INBOX = "hello@wabisabiservices.ca";
const SENDER_ADDRESS = "onboarding@wabisabiservices.ca";
const MAX_NAME_LENGTH = 200;
const MAX_FIELD_LENGTH = 5000;

/** Fields whose values are form slugs such as "residential-deep", shown as readable labels. */
const SLUG_FIELDS = new Set(["serviceType", "cadence"]);

interface FormDefinition {
  sender: string;
  subject: string;
  fields: [key: string, label: string][];
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

const slugToLabel = (value: string) => value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const row = (label: string, value: string) =>
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

  const name = readField(body, "name", MAX_NAME_LENGTH);
  const email = readField(body, "email", MAX_NAME_LENGTH);
  if (!name || !email || !/^\S+@\S+$/.test(email)) {
    return json({ error: "Name and email are required" }, 400);
  }

  const rows: string[] = [];
  for (const [key, label] of form.fields) {
    const value = readField(body, key, MAX_FIELD_LENGTH);
    if (value === null) return json({ error: "Invalid request" }, 400);
    if (value) rows.push(row(label, SLUG_FIELDS.has(key) ? slugToLabel(value) : value));
  }

  const subjectName = name.replace(/\s+/g, " ");
  const html = [`<h2>${form.subject}</h2>`, row("Name", name), row("Email", email), ...rows].join("\n");

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
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
      console.error("Resend rejected the email, status", response.status);
      return json({ error: "The email could not be sent" }, 502);
    }
  } catch {
    console.error("Could not reach Resend");
    return json({ error: "The email could not be sent" }, 502);
  }

  return json({ ok: true }, 200);
}
