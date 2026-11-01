/**
 * Checks the form function and the browser helper with fetch stubbed and a fake key.
 * Nothing leaves this process, so this proves our own behaviour. It can't prove that
 * Resend accepts the request: only a real send on a deployment can do that.
 *
 *   npm run verify:forms
 *
 * Exit codes: 0 pass, 1 failures.
 */
import assert from "node:assert/strict";
import { POST } from "../api/send-form-email";
import { formFailure, FormRefused, sendForm } from "../src/lib/sendForm";

const RESEND_URL = "https://api.resend.com/emails";
const FUNCTION_PATH = "/api/send-form-email";
const FUNCTION_URL = `https://example.test${FUNCTION_PATH}`;
const FAKE_KEY = "test-not-a-real-key";

interface Email {
  init: RequestInit;
  body: Record<string, unknown>;
}

const accepted = async () => Response.json({ id: "stubbed" });

let emails: Email[] = [];
let resendAnswer: () => Promise<Response> = accepted;
const logged: string[] = [];

process.env.RESEND_API_KEY = FAKE_KEY;
console.error = (...args: unknown[]) => void logged.push(args.join(" "));

// sendForm's path runs the real function, and any other address fails the check that made the call.
globalThis.fetch = (async (url: string, init: RequestInit) => {
  if (url === FUNCTION_PATH) return POST(new Request(`https://example.test${url}`, init));
  if (url !== RESEND_URL) throw new Error(`unexpected request to ${url}`);
  emails.push({ init, body: JSON.parse(init.body as string) });
  return resendAnswer();
}) as typeof fetch;

let passed = 0;
const failures: string[] = [];

async function check(name: string, run: () => Promise<void>) {
  emails = [];
  resendAnswer = accepted;
  logged.length = 0;
  try {
    await run();
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

const html = (email: Record<string, unknown>) => email.html as string;
const booking = { form: "booking", name: "Ann", email: "ann@example.ca", phone: "250 555 0100", address: "Oak Bay" };
const contact = { form: "contact", name: "Ann", email: "ann@example.ca" };

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
    } finally {
      process.env.RESEND_API_KEY = FAKE_KEY;
    }
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
    assert.ok(emails[0].init.signal instanceof AbortSignal, "the Resend call has a timeout");
    assert.equal(new Headers(emails[0].init.headers).get("authorization"), `Bearer ${FAKE_KEY}`);
  });
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
  const failedSend = async (answer: () => Promise<Response>) => {
    resendAnswer = answer;
    const response = await post({ ...booking, name: "Private Name" });
    assert.equal(response.status, 502);
    assert.equal((await response.json()).error, "The email could not be sent");
    const log = logged.join(" ");
    assert.ok(!log.includes("Private Name") && !log.includes("ann@example.ca"), "no personal details in the logs");
    return log;
  };
  const refusal = (status: number, body: string) => async () => new Response(body, { status });
  await check("logs a spent quota", async () => assert.match(await failedSend(refusal(429, '{"name":"daily_quota_exceeded"}')), /429 .*daily_quota_exceeded/));
  await check("logs a suspended key", async () => assert.match(await failedSend(refusal(403, '{"name":"suspended_api_key"}')), /403 .*suspended_api_key/));
  await check("logs no reason a visitor could have typed", async () => assert.match(await failedSend(refusal(422, '{"message":"bad ann@example.ca"}')), /status 422 $/));
  await check("caps the logged reason", async () => assert.ok((await failedSend(refusal(401, "x".repeat(5000)))).length < 400));
  await check("logs a timeout", async () => {
    assert.match(await failedSend(() => Promise.reject(new DOMException("timed out", "TimeoutError"))), /Could not reach Resend: TimeoutError/);
  });
  await check("logs a failure that is not an Error", async () => assert.match(await failedSend(() => Promise.reject("not an error")), /unknown error/));

  // The browser helper, through the real function.
  await check("posts a form the function accepts", async () => {
    const response = await sendForm("booking", { name: "Ann", email: "ann@example.ca", phone: "250 555 0100", address: "Oak Bay" });
    assert.equal(response.status, 200);
    assert.equal(emails[0].body.subject, "New Booking Request from Ann");
  });
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
