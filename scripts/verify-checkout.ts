/**
 * Checks the checkout function's cart rules with Stripe stubbed and a fake key.
 * Nothing leaves this process, so this proves our own behaviour and not Stripe's.
 *
 *   npm run verify:checkout
 *
 * Exit codes: 0 pass, 1 failures.
 */
import assert from "node:assert/strict";
import { POST } from "../api/create-checkout";
import { CLOSED_PACKAGES } from "./verify/rules";

const CLOSED_ADD_ON = "cozy-cabin-candles";
const CLOSED_ADD_ON_NAME = "Additional LED Candles (4) (add-on for The Cozy Cabin)";
const OPEN_PACKAGE = "abundant-harmony";

process.env.STRIPE_SECRET_KEY = "test-not-a-real-key";
console.error = () => undefined;

let stripeCalls = 0;
globalThis.fetch = (async () => {
  stripeCalls++;
  return Response.json({ id: "stubbed", url: "https://example.test/pay" });
}) as typeof fetch;

let passed = 0;
const failures: string[] = [];

async function check(name: string, run: () => Promise<void>) {
  stripeCalls = 0;
  try {
    await run();
    passed++;
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const buy = (ids: string[]) =>
  POST(
    new Request("https://wabisabiservices.ca/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: ids.map((id) => ({ id })), customerInfo: { name: "Ann", email: "ann@example.ca" } }),
    })
  );

async function expectClosed(ids: string[], ...named: string[]) {
  const response = await buy(ids);
  assert.equal(response.status, 400);
  const { error } = await response.json();
  assert.match(error, /^Closed for 2026, please remove: /);
  for (const name of named) assert.ok(error.includes(name), `${name} is not in "${error}"`);
  assert.equal(stripeCalls, 0);
}

async function main() {
  for (const id of CLOSED_PACKAGES) {
    await check(`refuses ${id}`, () => expectClosed([id]));
  }
  await check("names a closed add-on the way the cart shows it", () => expectClosed([CLOSED_ADD_ON], CLOSED_ADD_ON_NAME));
  await check("names every closed item at once", () => expectClosed(["cozy-cabin", CLOSED_ADD_ON], "The Cozy Cabin,", CLOSED_ADD_ON_NAME));
  await check("refuses a closed item beside an open one", () => expectClosed([OPEN_PACKAGE, "cozy-cabin"], "The Cozy Cabin"));
  await check("sends an open package to Stripe", async () => {
    const response = await buy([OPEN_PACKAGE]);
    assert.equal(response.status, 200);
    assert.equal(stripeCalls, 1);
  });

  for (const failure of failures) console.log(`FAIL  ${failure}`);
  console.log(`verify:checkout: ${passed} passed, ${failures.length} failed.`);
  process.exitCode = failures.length > 0 ? 1 : 0;
}

await main();
