/**
 * Checks the form function, the Resend webhook and the browser helper with fetch stubbed
 * and fake keys. Nothing leaves this process, so this proves our own behaviour. It can't
 * prove that Resend or Sentry accepts a request: only a real send on a deployment can.
 *
 *   npm run verify:forms
 *
 * Exit codes: 0 pass, 1 failures.
 */
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { POST as webhook } from "../api/resend-webhook";
import { POST } from "../api/send-form-email";
import { formFailure, FormRefused, formSent, sendForm, TIMEOUT_MS } from "../src/lib/sendForm";

const RESEND_URL = "https://api.resend.com/emails";
const FUNCTION_PATH = "/api/send-form-email";
const FUNCTION_URL = `https://example.test${FUNCTION_PATH}`;
const FAKE_KEY = "test-not-a-real-key";
const SENTRY_KEY = "fakepublickey";
const FAKE_DSN = `https://${SENTRY_KEY}@o1.ingest.example.test/456`;
const SENTRY_URL = "https://o1.ingest.example.test/api/456/envelope/";
const WEBHOOK_URL = "https://example.test/api/resend-webhook";
const WEBHOOK_KEY = Buffer.from("test-signing-key-not-a-real-one");

/** Every personal value in these checks. None may reach a log or a report, on any path. */
const PERSONAL_TEXT = /private|ann@example|250 555|oak bay|not-a-dsn/i;

interface Email {
  init: RequestInit;
  body: Record<string, unknown>;
}

const accepted = async () => Response.json({ id: "stubbed" });

interface Report {
  init: RequestInit;
  body: string;
}

type Answer = (init: RequestInit) => Promise<Response>;

/** Stands in for a service that never answers, until the request's own timeout fires. */
const noAnswer: Answer = (init) =>
  new Promise((_, reject) => {
    const { signal } = init;
    if (!signal) reject(new Error("this request has no timeout"));
    signal?.addEventListener("abort", () => reject(signal.reason));
  });

let emails: Email[] = [];
let reports: Report[] = [];
let resendAnswer: Answer = accepted;
let sentryAnswer: Answer = async () => Response.json({ id: "stubbed" });
const logged: string[] = [];

process.env.RESEND_API_KEY = FAKE_KEY;
process.env.SENTRY_DSN = FAKE_DSN;
process.env.RESEND_WEBHOOK_SECRET = `whsec_${WEBHOOK_KEY.toString("base64")}`;
console.error = (...args: unknown[]) => void logged.push(args.join(" "));

// sendForm's path runs the real function, and any other address fails the check that made the call.
globalThis.fetch = (async (url: string, init: RequestInit) => {
  if (url === FUNCTION_PATH) return POST(new Request(`https://example.test${url}`, init));
  if (url === SENTRY_URL) {
    reports.push({ init, body: init.body as string });
    return sentryAnswer(init);
  }
  if (url !== RESEND_URL) throw new Error(`unexpected request to ${url}`);
  emails.push({ init, body: JSON.parse(init.body as string) });
  return resendAnswer(init);
}) as typeof fetch;

let passed = 0;
const failures: string[] = [];

async function check(name: string, run: () => Promise<void>) {
  emails = [];
  reports = [];
  resendAnswer = accepted;
  sentryAnswer = async () => Response.json({ id: "stubbed" });
  logged.length = 0;
  try {
    await run();
    const leak = PERSONAL_TEXT.exec([...logged, ...reports.map((report) => report.body)].join(" "));
    assert.equal(leak, null, "personal details reached a log or a report");
    passed++;
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const post = (body: unknown, contentType = "application/json") =>
  POST(new Request(FUNCTION_URL, { method: "POST", headers: { "Content-Type": contentType }, body: JSON.stringify(body) }));

async function expectRefused(response: Response, status: number, error: string) {
  assert.equal(response.status, status);
  assert.equal((await response.json()).error, error);
  assert.equal(emails.length, 0, "nothing goes to Resend on a refusal");
}

/** Posts a form, expects it to reach Resend, and returns what was sent. */
async function expectSent(body: unknown, contentType?: string): Promise<Record<string, unknown>> {
  const response = await post(body, contentType);
  assert.equal(response.status, 200);
  assert.equal(emails.length, 1, "one email goes to Resend");
  return emails[0].body;
}

/** Sets one variable for a check, or removes it with undefined. */
async function withEnv(name: string, value: string | undefined, run: () => Promise<void>) {
  const previous = process.env[name];
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
  try {
    await run();
  } finally {
    process.env[name] = previous;
  }
}

/** Fires every AbortSignal.timeout at once and records the milliseconds asked for. */
async function withInstantTimeouts(run: (asked: number[]) => Promise<void>) {
  const real = AbortSignal.timeout;
  const asked: number[] = [];
  AbortSignal.timeout = (milliseconds: number) => {
    asked.push(milliseconds);
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException("timed out", "TimeoutError")));
    return controller.signal;
  };
  try {
    await run(asked);
  } finally {
    AbortSignal.timeout = real;
  }
}

/** The one report sent, after checking its envelope. It may hold only these event keys. */
function soleReport() {
  assert.equal(reports.length, 1, "one report goes to Sentry");
  const lines = reports[0].body.split("\n");
  assert.equal(lines.length, 4, "an envelope is three lines and a final newline");
  assert.equal(lines[3], "");
  const [header, item, event] = lines.slice(0, 3).map((line) => JSON.parse(line));
  assert.deepEqual(item, { type: "event" });
  assert.match(event.event_id, /^[0-9a-f]{32}$/);
  assert.equal(header.event_id, event.event_id);
  assert.ok(Math.abs(Date.parse(header.sent_at) - Date.now()) < 60_000, "sent_at is the current time");
  assert.ok(Math.abs(event.timestamp * 1000 - Date.now()) < 60_000, "timestamp is in seconds");
  assert.deepEqual(Object.keys(event).sort(), ["environment", "event_id", "fingerprint", "level", "message", "platform", "tags", "timestamp"]);
  assert.deepEqual(Object.keys(event.tags).sort(), ["form", "reason"]);
  const headers = new Headers(reports[0].init.headers);
  assert.equal(headers.get("content-type"), "application/x-sentry-envelope");
  assert.match(headers.get("x-sentry-auth") ?? "", new RegExp(`^Sentry sentry_version=7, .*sentry_key=${SENTRY_KEY}$`));
  assert.ok(reports[0].init.signal instanceof AbortSignal, "the Sentry call has a timeout");
  return event;
}

function expectReport(form: string, reason: string) {
  const event = soleReport();
  assert.deepEqual(event.tags, { form, reason });
  assert.equal(event.message, `Form email failed: ${form}, ${reason}`);
  assert.deepEqual(event.fingerprint, ["form-email-failed", form, reason]);
  assert.equal(event.level, "error");
  assert.equal(event.environment, "unknown", "this process is not a Vercel deployment");
}

function sign(id: string, timestamp: number | string, body: string, key = WEBHOOK_KEY) {
  return createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64");
}

const now = () => Math.floor(Date.now() / 1000);

/** Posts an event to the webhook, signed correctly unless a header is overridden. */
function deliver(event: unknown, headers: Record<string, string | undefined> = {}, id = "msg_test") {
  const body = typeof event === "string" ? event : JSON.stringify(event);
  const timestamp = headers["svix-timestamp"] ?? String(now());
  const all = { "svix-id": id, "svix-timestamp": timestamp, "svix-signature": `v1,${sign(id, timestamp, body)}`, ...headers };
  const present = Object.entries(all).filter((entry): entry is [string, string] => entry[1] !== undefined);
  return webhook(new Request(WEBHOOK_URL, { method: "POST", headers: present, body }));
}

/** Resend's event shape, holding the personal details a real one carries. */
const resendEvent = (type: string, extra: Record<string, unknown> = {}, from = "Wabi-Sabi Booking <onboarding@wabisabiservices.ca>") => ({
  type,
  created_at: "2026-11-01T00:00:00.000Z",
  data: {
    email_id: "stubbed",
    from,
    to: ["hello@wabisabiservices.ca"],
    subject: "New Booking Request from Private Name",
    ...extra,
  },
});

const html = (email: Record<string, unknown>) => email.html as string;
const booking = { form: "booking", name: "Ann", email: "ann@example.ca", phone: "250 555 0100", address: "Oak Bay" };
const contact = { form: "contact", name: "Ann", email: "ann@example.ca" };

/** Every field of a form, each holding text the personal-details check looks for. */
function filled(form: string) {
  const person = { form, name: "Private Name", email: "private.person@example.ca", phone: "Private phone" };
  if (form === "careers") {
    return { ...person, position: "Private position", availability: "Private hours", experience: "Private past", message: "Private message" };
  }
  const place = { address: "Private address", serviceType: "Private service", cadence: "Private cadence" };
  if (form === "contact") return { ...person, ...place, notes: "Private notes" };
  return { ...person, ...place, preferredTime1: "Private one", preferredTime2: "Private two", preferredTime3: "Private three" };
}

const FORM_NAMES = ["contact", "booking", "careers"];

async function main() {
  // Only an exact JSON type gets through, because a browser sends the others with no preflight.
  for (const type of ["application/json", "application/json; charset=utf-8", "Application/JSON"]) {
    await check(`accepts Content-Type ${type}`, async () => void (await expectSent(booking, type)));
  }
  for (const type of [
    "text/plain",
    "text/plain; application/json",
    "text/plain; charset=application/json",
    "application/x-www-form-urlencoded",
    "multipart/form-data; boundary=application/json",
    "application/json, text/plain",
    "application/jsonp",
  ]) {
    await check(`refuses Content-Type ${type}`, () => post(booking, type).then((r) => expectRefused(r, 400, "Invalid request")));
  }
  await check("refuses a request with no Content-Type", async () => {
    const bytes = new TextEncoder().encode(JSON.stringify(booking));
    await expectRefused(await POST(new Request(FUNCTION_URL, { method: "POST", body: bytes })), 400, "Invalid request");
  });

  // Requests that are not a usable form.
  const invalid: [string, unknown][] = [
    ["an unknown form", { ...booking, form: "other" }],
    ["a form named after an object property", { ...booking, form: "constructor" }],
    ["a null body", null],
    ["an array body", [booking]],
  ];
  for (const [label, body] of invalid) {
    await check(`refuses ${label}`, () => post(body).then((r) => expectRefused(r, 400, "Invalid request")));
  }
  await check("refuses a body that is not JSON", async () => {
    const request = new Request(FUNCTION_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
    await expectRefused(await POST(request), 400, "Invalid request");
  });
  await check("reports a missing key instead of sending", async () => {
    delete process.env.RESEND_API_KEY;
    try {
      await expectRefused(await post(booking), 500, "Forms are unavailable");
      expectReport("booking", "resend_key_missing");
    } finally {
      process.env.RESEND_API_KEY = FAKE_KEY;
    }
  });
  await check("raises no report for a junk request while the key is missing", async () => {
    await withEnv("RESEND_API_KEY", undefined, async () => {
      await expectRefused(await post({ form: "other" }), 400, "Invalid request");
      await expectRefused(await post({ ...booking, email: "jo@gmail" }), 400, "Please check your email address");
      assert.equal(reports.length, 0);
    });
  });

  // Names and addresses.
  await check("requires a name that holds text", () => post({ ...booking, name: "   " }).then((r) => expectRefused(r, 400, "Name is required")));
  const badEmails = ["jo@gmail", "a@b,c@d.ca", "a@b;c@d.ca", "a b@c.ca", "<a@b.ca>", "a@b.", "a@.ca", "a@b..ca", "a@@b.ca", "a@b.ca,c@d.ca", ""];
  for (const email of badEmails) {
    await check(`refuses the email "${email}"`, () => post({ ...booking, email }).then((r) => expectRefused(r, 400, "Please check your email address")));
  }
  for (const email of ["jo.smith+home@mail.example.ca", "o'brien@example.com", "x@sub.domain.co.uk"]) {
    await check(`replies to ${email}`, async () => assert.equal((await expectSent({ ...booking, email })).reply_to, email));
  }

  // Required and over-long fields.
  await check("requires a booking phone", () => post({ ...booking, phone: "   " }).then((r) => expectRefused(r, 400, "Phone is required")));
  await check("requires a booking address", () => post({ ...booking, address: undefined }).then((r) => expectRefused(r, 400, "Address/Neighbourhood is required")));
  await check("refuses an over-long field", () => post({ ...booking, phone: "1".repeat(5001) }).then((r) => expectRefused(r, 400, "Phone is too long")));
  await check("sends a contact form with no optional fields", async () => void (await expectSent(contact)));
  await check("sends a careers form with no optional fields", async () => void (await expectSent({ ...contact, form: "careers" })));

  // What the email says.
  await check("addresses a booking to the inbox with its own subject", async () => {
    const email = await expectSent(booking);
    assert.equal(email.subject, "New Booking Request from Ann");
    assert.deepEqual(email.to, ["hello@wabisabiservices.ca"]);
    const headers = new Headers(emails[0].init.headers);
    assert.equal(headers.get("authorization"), `Bearer ${FAKE_KEY}`);
    assert.equal(headers.get("user-agent"), "wabisabiservices-forms", "Resend refuses a request with no User-Agent");
    assert.equal(headers.get("content-type"), "application/json");
  });
  await check("shows the Name and Email rows", async () => {
    const email = await expectSent(booking);
    assert.ok(html(email).includes("<strong>Name:</strong> Ann</p>"));
    assert.ok(html(email).includes("<strong>Email:</strong> ann@example.ca</p>"));
  });
  for (const [form, sender] of [
    ["contact", "Wabi-Sabi Contact Form"],
    ["booking", "Wabi-Sabi Booking"],
    ["careers", "Wabi-Sabi Careers"],
  ]) {
    await check(`sends the ${form} form under its own sender`, async () => {
      assert.equal((await expectSent({ ...booking, form })).from, `${sender} <onboarding@wabisabiservices.ca>`);
    });
  }
  await check("keeps the subject on one line", async () => {
    const email = await expectSent({ ...booking, name: "Ann\r\nBcc: x@example.ca" });
    assert.equal(email.subject, "New Booking Request from Ann Bcc: x@example.ca");
  });
  await check("escapes what a visitor typed", async () => {
    const email = await expectSent({ ...booking, name: "<img src=x>", preferredTime1: `<b>Mon</b> & Tue's "am"` });
    assert.ok(!html(email).includes("<img"));
    assert.ok(html(email).includes("&lt;b&gt;Mon&lt;/b&gt; &amp; Tue&#39;s &quot;am&quot;"));
  });
  await check("keeps line breaks in long answers", async () => {
    assert.ok(html(await expectSent({ ...contact, notes: "one\r\ntwo\nthree" })).includes("one<br>two<br>three"));
  });
  await check("shows the words the customer chose", async () => {
    const email = await expectSent({ ...booking, serviceType: "residential-move", cadence: "biweekly" });
    assert.ok(html(email).includes("Service Type:</strong> Moving Prep / Listing-Ready<"));
    assert.ok(html(email).includes("Ideal Cadence:</strong> Bi-Weekly<"));
  });
  for (const [value, shown] of [
    ["residential-deep", "Residential Deep Reset"],
    ["consultation", "Consultation Only"],
    ["seasonal-2027-waitlist", "2027 Seasonal Waitlist"],
    ["unknown-value", "unknown-value"],
    ["constructor", "constructor"],
  ]) {
    await check(`shows the service ${value} as ${shown}`, async () => {
      assert.ok(html(await expectSent({ ...booking, serviceType: value })).includes(`Service Type:</strong> ${shown}<`));
    });
  }
  await check("leaves a free-text answer that matches a slug alone", async () => {
    assert.ok(html(await expectSent({ ...contact, notes: "commercial" })).includes("Notes:</strong> commercial<"));
  });

  // Resend failures: the visitor gets a 502, and the logs hold no personal details.
  const failedSend = async (answer: Answer) => {
    resendAnswer = answer;
    const response = await post({ ...booking, name: "Private Name" });
    assert.equal(response.status, 502);
    assert.equal((await response.json()).error, "The email could not be sent");
    const log = logged.join(" ");
    assert.ok(!log.includes("Private Name") && !log.includes("ann@example.ca"), "no personal details in the logs");
    return log;
  };
  const refusal = (status: number, body: string) => async () => new Response(body, { status });
  await check("logs and reports a spent quota", async () => {
    assert.match(await failedSend(refusal(429, '{"name":"daily_quota_exceeded"}')), /429 .*daily_quota_exceeded/);
    expectReport("booking", "resend_refused_429_daily_quota_exceeded");
  });
  await check("logs and reports a suspended key", async () => {
    assert.match(await failedSend(refusal(403, '{"name":"suspended_api_key"}')), /403 .*suspended_api_key/);
    expectReport("booking", "resend_refused_403_suspended_api_key");
  });
  await check("carries no reason a visitor could have typed", async () => {
    assert.match(await failedSend(refusal(422, '{"name":"validation_error","message":"bad ann@example.ca"}')), /status 422 $/);
    expectReport("booking", "resend_refused_422");
  });
  for (const status of [500, 502, 503]) {
    await check(`reports a Resend ${status}`, async () => {
      assert.match(await failedSend(refusal(status, '{"name":"application_error","message":"bad ann@example.ca"}')), new RegExp(`status ${status} $`));
      expectReport("booking", `resend_refused_${status}`);
    });
  }
  await check("caps the logged reason", async () => assert.ok((await failedSend(refusal(401, "x".repeat(5000)))).length < 400));
  await check("gives up on a silent Resend at the timeout, within the browser's wait", async () => {
    await withInstantTimeouts(async (asked) => {
      assert.match(await failedSend(noAnswer), /Could not reach Resend: TimeoutError/);
      expectReport("booking", "resend_timeout");
      assert.equal(asked.length, 2, "one timeout for Resend and one for Sentry");
      assert.equal(asked[0], 8000);
      assert.ok(asked[0] + asked[1] < TIMEOUT_MS, "the function answers before the browser stops waiting");
    });
  });
  await check("logs and reports a failure that is not an Error", async () => {
    assert.match(await failedSend(() => Promise.reject("not an error")), /unknown error/);
    expectReport("booking", "resend_unreachable");
  });

  // Personal details, with every field of every form filled in. check() scans each log and report.
  for (const form of FORM_NAMES) {
    await check(`keeps a refused ${form} form out of the logs`, async () => {
      resendAnswer = refusal(500, "{}");
      assert.equal((await post(filled(form))).status, 502);
      expectReport(form, "resend_refused_500");
      assert.equal(emails.length, 1);
      assert.ok(JSON.stringify(emails[0].body).includes("Private"), "the check's text did reach the email");
    });
    await check(`keeps a timed out ${form} form out of the logs`, async () => {
      resendAnswer = noAnswer;
      await withInstantTimeouts(async () => assert.equal((await post(filled(form))).status, 502));
      expectReport(form, "resend_timeout");
    });
    await check(`logs and reports nothing for a sent ${form} form`, async () => {
      assert.equal((await post(filled(form))).status, 200);
      assert.equal(logged.length, 0);
      assert.equal(reports.length, 0);
    });
    await check(`keeps a ${form} form with no key out of the logs`, async () => {
      await withEnv("RESEND_API_KEY", undefined, async () => assert.equal((await post(filled(form))).status, 500));
      expectReport(form, "resend_key_missing");
    });
  }

  // Sentry must never change what the visitor sees.
  await check("sends as before with no SENTRY_DSN", async () => {
    await withEnv("SENTRY_DSN", undefined, async () => {
      assert.equal((await post(booking)).status, 200);
      assert.equal(emails.length, 1);
      assert.equal(logged.length, 0);
    });
  });
  await check("answers a failed send as before with no SENTRY_DSN", async () => {
    await withEnv("SENTRY_DSN", undefined, async () => {
      await failedSend(refusal(429, "{}"));
      assert.equal(reports.length, 0);
    });
  });
  await check("answers as before when SENTRY_DSN is not a URL, and logs nothing of it", async () => {
    await withEnv("SENTRY_DSN", "not-a-dsn", async () => {
      assert.match(await failedSend(refusal(429, "{}")), /Sentry could not be reached: TypeError/);
      assert.equal(reports.length, 0);
    });
  });
  await check("answers as before when Sentry refuses", async () => {
    sentryAnswer = refusal(500, "{}");
    assert.match(await failedSend(refusal(429, "{}")), /Sentry refused a report: 500/);
  });
  await check("answers as before when Sentry can't be reached", async () => {
    sentryAnswer = () => Promise.reject(new TypeError("fetch failed"));
    assert.match(await failedSend(refusal(429, "{}")), /Sentry could not be reached: TypeError/);
  });
  await check("gives up on a silent Sentry at its timeout", async () => {
    sentryAnswer = noAnswer;
    await withInstantTimeouts(async (asked) => {
      assert.match(await failedSend(refusal(429, "{}")), /Sentry could not be reached: TimeoutError/);
      assert.deepEqual(asked, [8000, 1500]);
    });
  });

  // The webhook's signature. This vector is the worked example in Svix's documentation, so it
  // proves the scheme itself: every other check below signs with the same recipe as the function.
  await check("accepts Svix's published example", async () => {
    await withEnv("RESEND_WEBHOOK_SECRET", "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw", async () => {
      const realNow = Date.now;
      Date.now = () => 1614265330000;
      try {
        const headers = { "svix-id": "msg_p5jXN8AQM9LWM0D4loKWxJek", "svix-timestamp": "1614265330", "svix-signature": "v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=" };
        const body = '{"test": 2432232314}';
        assert.equal((await webhook(new Request(WEBHOOK_URL, { method: "POST", headers, body }))).status, 200);
        const tampered = body.replace("2432232314", "2432232315");
        assert.equal((await webhook(new Request(WEBHOOK_URL, { method: "POST", headers, body: tampered }))).status, 401);
      } finally {
        Date.now = realNow;
      }
    });
  });
  const bounced = resendEvent("email.bounced", { bounce: { type: "Permanent", subType: "General", message: "550 private.person@example.ca refused" } });
  const unsigned: [string, Record<string, string | undefined>][] = [
    ["no signature", { "svix-signature": undefined }],
    ["no timestamp", { "svix-timestamp": undefined }],
    ["no ID", { "svix-id": undefined }],
    ["a wrong signature", { "svix-signature": `v1,${Buffer.alloc(32).toString("base64")}` }],
    ["a short signature", { "svix-signature": "v1,AAAA" }],
    ["an empty signature", { "svix-signature": "v1," }],
    ["a signature of another version", { "svix-signature": `v2,${sign("msg_test", now(), JSON.stringify(bounced))}` }],
    ["a signature from another key", { "svix-signature": `v1,${sign("msg_test", now(), JSON.stringify(bounced), Buffer.from("another-key"))}` }],
    ["a timestamp that is not a number", { "svix-timestamp": "soon" }],
  ];
  for (const [label, headers] of unsigned) {
    await check(`refuses an event with ${label}`, async () => {
      assert.equal((await deliver(bounced, headers)).status, 401);
      assert.equal(reports.length, 0);
    });
  }
  await check("refuses a changed body", async () => {
    const timestamp = String(now());
    const headers = { "svix-timestamp": timestamp, "svix-signature": `v1,${sign("msg_test", timestamp, JSON.stringify(bounced))}` };
    assert.equal((await deliver({ ...bounced, type: "email.failed" }, headers)).status, 401);
    assert.equal(reports.length, 0);
  });
  await check("refuses a changed message ID", async () => {
    const timestamp = String(now());
    const headers = { "svix-timestamp": timestamp, "svix-signature": `v1,${sign("msg_test", timestamp, JSON.stringify(bounced))}` };
    assert.equal((await deliver(bounced, headers, "msg_other")).status, 401);
  });
  for (const [label, age] of [["old", 301], ["future", -301]] as const) {
    await check(`refuses a correctly signed ${label} event`, async () => {
      assert.equal((await deliver(bounced, { "svix-timestamp": String(now() - age) })).status, 401);
      assert.equal(reports.length, 0);
    });
  }
  await check("accepts an event within the tolerance", async () => {
    assert.equal((await deliver(bounced, { "svix-timestamp": String(now() - 290) })).status, 200);
  });
  await check("accepts the matching signature among several during a key rotation", async () => {
    const timestamp = String(now());
    const signature = `v1,${Buffer.alloc(32).toString("base64")} v1,${sign("msg_test", timestamp, JSON.stringify(bounced))}`;
    assert.equal((await deliver(bounced, { "svix-timestamp": timestamp, "svix-signature": signature })).status, 200);
    assert.equal(reports.length, 1);
  });
  for (const secret of [undefined, "", "whsec_"]) {
    await check(`refuses every event with the secret ${JSON.stringify(secret)}`, async () => {
      await withEnv("RESEND_WEBHOOK_SECRET", secret, async () => {
        const body = JSON.stringify(bounced);
        const timestamp = String(now());
        const headers = { "svix-id": "msg_test", "svix-timestamp": timestamp, "svix-signature": `v1,${sign("msg_test", timestamp, body, Buffer.alloc(0))}` };
        assert.equal((await webhook(new Request(WEBHOOK_URL, { method: "POST", headers, body }))).status, 503);
        assert.equal(reports.length, 0);
      });
    });
  }
  await check("sends a form as before with no webhook secret", async () => {
    await withEnv("RESEND_WEBHOOK_SECRET", undefined, async () => assert.equal((await post(booking)).status, 200));
  });

  // What the webhook reports.
  const events: [string, unknown, string][] = [
    ["a failed send", resendEvent("email.failed", { failed: { reason: "reached_daily_quota" } }), "email.failed:reached_daily_quota"],
    ["a bounce", bounced, "email.bounced:Permanent:General"],
    ["a suppressed inbox", resendEvent("email.suppressed", { suppressed: { type: "OnAccountSuppressionList", message: "private.person@example.ca is on the list" } }), "email.suppressed:OnAccountSuppressionList"],
    ["a spam complaint", resendEvent("email.complained"), "email.complained"],
    ["detail that is free text", resendEvent("email.failed", { failed: { reason: "Private Name is not allowed" } }), "email.failed"],
    ["detail that is not text", resendEvent("email.bounced", { bounce: { type: 7, subType: { private: true } } }), "email.bounced"],
    ["no detail", { type: "email.failed" }, "email.failed"],
  ];
  for (const [label, event, reason] of events) {
    await check(`reports ${label} with the form and reason only`, async () => {
      assert.equal((await deliver(event)).status, 200);
      expectReport(label === "no detail" ? "unknown" : "booking", reason);
    });
  }
  for (const form of FORM_NAMES) {
    await check(`names the ${form} form from the sender the function really uses`, async () => {
      const { from } = await expectSent({ ...booking, form });
      assert.equal((await deliver(resendEvent("email.complained", {}, from as string))).status, 200);
      expectReport(form, "email.complained");
    });
  }
  await check("reads a quoted sender name", async () => {
    await deliver(resendEvent("email.complained", {}, '"Wabi-Sabi Careers" <onboarding@wabisabiservices.ca>'));
    expectReport("careers", "email.complained");
  });
  for (const from of ["Private Name <private.person@example.ca>", "constructor <x@example.test>", "", undefined, 7]) {
    await check(`calls the sender ${JSON.stringify(from)} unknown`, async () => {
      await deliver(resendEvent("email.complained", { from }));
      expectReport("unknown", "email.complained");
    });
  }
  for (const type of ["email.delivered", "email.sent", "email.opened", "constructor", 7, undefined]) {
    await check(`ignores the event type ${JSON.stringify(type)}`, async () => {
      assert.equal((await deliver({ ...bounced, type })).status, 200);
      assert.equal(reports.length, 0);
      assert.equal(logged.length, 0);
    });
  }
  for (const body of ["not json", "null", "7"]) {
    await check(`refuses the signed body ${body}`, async () => {
      assert.equal((await deliver(body)).status, 400);
      assert.equal(reports.length, 0);
    });
  }
  await check("gives a retried event the same Sentry ID", async () => {
    await deliver(bounced, {}, "msg_same");
    const first = soleReport().event_id;
    reports = [];
    await deliver(bounced, {}, "msg_same");
    assert.equal(soleReport().event_id, first);
    reports = [];
    await deliver(bounced, {}, "msg_other");
    assert.notEqual(soleReport().event_id, first);
  });
  await check("asks Resend to retry when Sentry refuses", async () => {
    sentryAnswer = refusal(429, "{}");
    assert.equal((await deliver(bounced)).status, 502);
  });
  await check("asks Resend to retry when Sentry is silent", async () => {
    sentryAnswer = noAnswer;
    await withInstantTimeouts(async (asked) => {
      assert.equal((await deliver(bounced)).status, 502);
      assert.deepEqual(asked, [1500]);
    });
  });
  await check("takes an event with no SENTRY_DSN, so nothing is retried for nothing", async () => {
    await withEnv("SENTRY_DSN", undefined, async () => {
      assert.equal((await deliver(bounced)).status, 200);
      assert.equal(reports.length, 0);
    });
  });

  // The browser helper, through the real function.
  await check("posts a form the function accepts", async () => {
    const response = await sendForm("booking", { name: "Ann", email: "ann@example.ca", phone: "250 555 0100", address: "Oak Bay" });
    assert.equal(response.status, 200);
    assert.equal(emails[0].body.subject, "New Booking Request from Ann");
  });
  await check("counts the function's own answer as sent", async () => {
    assert.equal(await formSent(await sendForm("booking", { name: "Ann", email: "ann@example.ca", phone: "250 555 0100", address: "Oak Bay" })), true);
  });
  const notSent: [string, Response][] = [
    ["a proxy's 200 page", new Response("<html>Please sign in</html>", { status: 200 })],
    ["a 200 with other JSON", Response.json({ status: "ok" })],
    ["a 200 with ok false", Response.json({ ok: false })],
    ["a 200 with ok as a word", Response.json({ ok: "true" })],
    ["a 200 with a null body", Response.json(null)],
    ["an empty 204", new Response(null, { status: 204 })],
    ["a 500 that says ok", Response.json({ ok: true }, { status: 500 })],
  ];
  for (const [label, response] of notSent) {
    await check(`does not count ${label} as sent`, async () => {
      assert.equal(await formSent(response), false);
      assert.ok(!((await formFailure(response)) instanceof FormRefused));
    });
  }
  await check("shows the customer a refusal they can fix", async () => {
    const failure = await formFailure(await sendForm("contact", { name: "Ann", email: "jo@gmail" }));
    assert.ok(failure instanceof FormRefused);
    assert.equal(failure.message, "Please check your email address");
  });
  await check("hides a failed send from the customer", async () => {
    resendAnswer = refusal(429, "{}");
    const failure = await formFailure(await sendForm("contact", { name: "Ann", email: "ann@example.ca" }));
    assert.ok(!(failure instanceof FormRefused));
  });
  await check("hides a 400 with no usable message", async () => {
    assert.ok(!((await formFailure(new Response("not json", { status: 400 }))) instanceof FormRefused));
    assert.ok(!((await formFailure(Response.json({ error: 7 }, { status: 400 }))) instanceof FormRefused));
  });

  for (const failure of failures) console.log(`FAIL  ${failure}`);
  console.log(`verify:forms: ${passed} passed, ${failures.length} failed.`);
  process.exitCode = failures.length > 0 ? 1 : 0;
}

await main();
